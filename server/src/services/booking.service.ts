import prisma from '../config/database';
import { calculatePrice } from '../utils/price-calculator';
import { generateBookingReference } from '../utils/booking-ref';
import { BookingStatus, PaymentStatus, SlotStatus } from '@skylite/shared';

export const bookingService = {
  /**
   * Create a new booking with slot hold.
   * Uses database transaction with atomic slot status check to prevent double booking.
   */
  async createBooking(data: {
    occasionId: string;
    theatreId: string;
    slotId: string;
    packageId: string;
    addonIds: string[];
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    guestCount: number;
    specialRequest?: string;
    paymentType?: 'FULL' | 'ADVANCE';
    discountCode?: string;
  }) {
    return await prisma.$transaction(async (tx) => {
      // 1. Validate required fields
      if (!data.customerName || !data.customerPhone || !data.slotId || !data.packageId || !data.occasionId || !data.theatreId) {
        throw new Error('Missing required booking fields');
      }

      // 2. Find or create customer
      const customer = await tx.customer.upsert({
        where: { phone: data.customerPhone },
        update: { name: data.customerName, email: data.customerEmail || null },
        create: { name: data.customerName, phone: data.customerPhone, email: data.customerEmail || null },
      });

      // 3. CRITICAL: Atomic slot availability check
      // Only update if slot is still AVAILABLE — prevents double booking
      const slot = await tx.slot.findFirst({
        where: { id: data.slotId, status: SlotStatus.AVAILABLE },
      });

      if (!slot) {
        throw new Error('This slot is no longer available. Please select another slot.');
      }

      // 4. Verify the slot belongs to the requested theatre
      if (slot.theatreId !== data.theatreId) {
        throw new Error('Slot does not belong to the selected theatre.');
      }

      // 5. Calculate price server-side (NEVER trust frontend values)
      const priceCalc = await calculatePrice(data.packageId, data.addonIds || [], data.slotId, data.discountCode);

      // 6. Generate unique booking reference
      const bookingReference = await generateBookingReference(slot.date);

      // 7. Determine Advance vs Full based on settings
      const settings = await tx.setting.findMany({
        where: {
          key: {
            in: ['booking_hold_duration', 'allow_advance_payment', 'advance_payment_type', 'advance_payment_value', 'allow_full_payment'],
          },
        },
      });
      const settingsMap: Record<string, string> = {};
      settings.forEach((s) => { settingsMap[s.key] = s.value; });

      const holdMinutes = parseInt(settingsMap['booking_hold_duration'] || '10', 10) || 10;
      const holdExpiresAt = new Date(Date.now() + holdMinutes * 60 * 1000);

      const allowAdvance = settingsMap['allow_advance_payment'] !== 'false';
      const advanceType = (settingsMap['advance_payment_type'] as 'FIXED' | 'PERCENTAGE') || 'PERCENTAGE';
      const advanceValue = parseFloat(settingsMap['advance_payment_value'] || '30');
      
      const requestedPaymentType = (data.paymentType === 'ADVANCE' && allowAdvance) ? 'ADVANCE' : 'FULL';

      let advanceAmount = priceCalc.total;
      let remainingAmount = 0;
      let remainingPaymentStatus = 'PAID_ONLINE';

      if (requestedPaymentType === 'ADVANCE') {
        if (advanceType === 'FIXED') {
          advanceAmount = Math.min(priceCalc.total, advanceValue);
        } else {
          advanceAmount = Math.round(priceCalc.total * (advanceValue / 100));
        }
        advanceAmount = Math.max(1, Math.min(advanceAmount, priceCalc.total));
        remainingAmount = Math.max(0, priceCalc.total - advanceAmount);
        remainingPaymentStatus = remainingAmount > 0 ? 'PENDING' : 'PAID_ONLINE';
      }

      // 8. Create the booking record
      const booking = await tx.booking.create({
        data: {
          bookingReference,
          customerId: customer.id,
          theatreId: data.theatreId,
          occasionId: data.occasionId,
          packageId: data.packageId,
          slotId: data.slotId,
          date: slot.date,
          startTime: slot.startTime,
          endTime: slot.endTime,
          guestCount: data.guestCount,
          specialRequest: data.specialRequest || null,
          subtotal: priceCalc.subtotal,
          tax: priceCalc.tax,
          discount: priceCalc.discount,
          discountCode: priceCalc.discountCode || null,
          total: priceCalc.total,
          advanceAmount,
          remainingAmount,
          paymentType: requestedPaymentType,
          remainingPaymentStatus,
          bookingSource: 'ONLINE',
          bookingStatus: BookingStatus.HELD,
          paymentStatus: PaymentStatus.PENDING,
          holdExpiresAt,
        },
      });

      // 9. Create booking add-on records with snapshotted prices
      if (data.addonIds && data.addonIds.length > 0) {
        const addons = await tx.addon.findMany({
          where: { id: { in: data.addonIds }, isActive: true },
        });

        await tx.bookingAddon.createMany({
          data: addons.map((addon) => ({
            bookingId: booking.id,
            addonId: addon.id,
            addonName: addon.name,
            addonPrice: addon.price,
          })),
        });
      }

      // 10. CRITICAL: Atomically update slot to HELD
      // The WHERE clause ensures only AVAILABLE slots can be held
      const updatedSlot = await tx.slot.updateMany({
        where: { id: data.slotId, status: SlotStatus.AVAILABLE },
        data: {
          status: SlotStatus.HELD,
          holdExpiresAt,
          heldByBookingId: booking.id,
        },
      });

      // If no rows were updated, another transaction beat us
      if (updatedSlot.count === 0) {
        throw new Error('This slot was just booked by someone else. Please select another slot.');
      }

      // 11. Return complete booking with relations
      return await tx.booking.findUnique({
        where: { id: booking.id },
        include: {
          customer: true,
          theatre: true,
          occasion: true,
          package: true,
          slot: true,
          bookingAddons: { include: { addon: true } },
        },
      });
    });
  },

  /**
   * Get booking by reference (public — used by customers)
   */
  async getBookingByRef(bookingReference: string) {
    const booking = await prisma.booking.findUnique({
      where: { bookingReference },
      include: {
        customer: true,
        theatre: true,
        occasion: true,
        package: true,
        slot: true,
        bookingAddons: { include: { addon: true } },
        payments: true,
      },
    });
    if (!booking) throw new Error('Booking not found');
    return booking;
  },

  /**
   * Get booking by reference and phone (for customer status lookup)
   */
  async getBookingByRefAndPhone(bookingReference: string, phone: string) {
    const booking = await prisma.booking.findUnique({
      where: { bookingReference },
      include: {
        customer: true,
        theatre: true,
        occasion: true,
        package: true,
        slot: true,
        bookingAddons: { include: { addon: true } },
        payments: true,
      },
    });

    if (!booking) throw new Error('Booking not found');
    if (booking.customer.phone !== phone) throw new Error('Phone number does not match');

    return booking;
  },

  /**
   * Get booking by ID (admin)
   */
  async getBookingById(id: string) {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        customer: true,
        theatre: true,
        occasion: true,
        package: true,
        slot: true,
        bookingAddons: { include: { addon: true } },
        payments: true,
      },
    });
    if (!booking) throw new Error('Booking not found');
    return booking;
  },

  /**
   * List bookings with filters and pagination (admin)
   */
  async listBookings(filters: {
    bookingStatus?: string;
    paymentStatus?: string;
    theatreId?: string;
    occasionId?: string;
    date?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters.bookingStatus) where.bookingStatus = filters.bookingStatus;
    if (filters.paymentStatus) where.paymentStatus = filters.paymentStatus;
    if (filters.theatreId) where.theatreId = filters.theatreId;
    if (filters.occasionId) where.occasionId = filters.occasionId;
    if (filters.date) {
      const dateObj = new Date(filters.date);
      const nextDay = new Date(dateObj);
      nextDay.setDate(nextDay.getDate() + 1);
      where.date = { gte: dateObj, lt: nextDay };
    }
    if (filters.search) {
      where.OR = [
        { bookingReference: { contains: filters.search } },
        { customer: { name: { contains: filters.search } } },
        { customer: { phone: { contains: filters.search } } },
      ];
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip,
        take: limit,
        include: {
          customer: true,
          theatre: true,
          occasion: true,
          package: true,
          slot: true,
          bookingAddons: true,
          payments: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.booking.count({ where }),
    ]);

    return { bookings, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  /**
   * Cancel a booking (releases the slot)
   */
  async cancelBooking(id: string, adminId?: string) {
    return await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id },
        include: { slot: true },
      });

      if (!booking) throw new Error('Booking not found');

      if (booking.bookingStatus === BookingStatus.CANCELLED) {
        throw new Error('Booking is already cancelled');
      }

      // Update booking status
      const updatedBooking = await tx.booking.update({
        where: { id },
        data: {
          bookingStatus: BookingStatus.CANCELLED,
          paymentStatus: booking.paymentStatus === PaymentStatus.PAID
            ? PaymentStatus.REFUNDED
            : PaymentStatus.FAILED,
        },
        include: {
          customer: true,
          theatre: true,
          occasion: true,
          package: true,
          slot: true,
          bookingAddons: true,
        },
      });

      // Release the slot
      await tx.slot.update({
        where: { id: booking.slotId },
        data: {
          status: SlotStatus.AVAILABLE,
          holdExpiresAt: null,
          heldByBookingId: null,
        },
      });

      // Create audit log
      if (adminId) {
        await tx.auditLog.create({
          data: {
            adminId,
            action: 'CANCEL',
            entityType: 'Booking',
            entityId: id,
            previousValue: JSON.stringify({ bookingStatus: booking.bookingStatus }),
            newValue: JSON.stringify({ bookingStatus: BookingStatus.CANCELLED }),
          },
        });
      }

      return updatedBooking;
    });
  },

  /**
   * Reschedule a booking to a new slot
   */
  async rescheduleBooking(id: string, newSlotId: string, adminId: string) {
    return await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id },
        include: { slot: true },
      });

      if (!booking) throw new Error('Booking not found');

      if (booking.bookingStatus !== BookingStatus.CONFIRMED) {
        throw new Error('Only confirmed bookings can be rescheduled');
      }

      // Check new slot availability
      const newSlot = await tx.slot.findFirst({
        where: { id: newSlotId, status: SlotStatus.AVAILABLE },
      });

      if (!newSlot) throw new Error('New slot is not available');

      // Release old slot
      await tx.slot.update({
        where: { id: booking.slotId },
        data: { status: SlotStatus.AVAILABLE, holdExpiresAt: null, heldByBookingId: null },
      });

      // Book new slot
      await tx.slot.update({
        where: { id: newSlotId },
        data: { status: SlotStatus.BOOKED, heldByBookingId: booking.id },
      });

      // Update booking
      const updatedBooking = await tx.booking.update({
        where: { id },
        data: {
          slotId: newSlotId,
          date: newSlot.date,
          startTime: newSlot.startTime,
          endTime: newSlot.endTime,
          bookingStatus: BookingStatus.CONFIRMED,
        },
        include: {
          customer: true,
          theatre: true,
          occasion: true,
          package: true,
          slot: true,
          bookingAddons: true,
        },
      });

      // Audit log
      await tx.auditLog.create({
        data: {
          adminId,
          action: 'RESCHEDULE',
          entityType: 'Booking',
          entityId: id,
          previousValue: JSON.stringify({
            slotId: booking.slotId,
            date: booking.date,
            startTime: booking.startTime,
          }),
          newValue: JSON.stringify({
            slotId: newSlotId,
            date: newSlot.date,
            startTime: newSlot.startTime,
          }),
        },
      });

      return updatedBooking;
    });
  },

  /**
   * Admin creates a manual booking (e.g., phone/WhatsApp booking)
   */
  async adminCreateBooking(data: {
    theatreId: string;
    occasionId: string;
    slotId: string;
    packageId: string;
    addonIds: string[];
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    guestCount: number;
    specialRequest?: string;
    paymentStatus: string;
    discountCode?: string;
    customDiscount?: number;
    bookingSource?: string;
  }, adminId: string) {
    return await prisma.$transaction(async (tx) => {
      // Find or create customer
      const customer = await tx.customer.upsert({
        where: { phone: data.customerPhone },
        update: { name: data.customerName, email: data.customerEmail || null },
        create: { name: data.customerName, phone: data.customerPhone, email: data.customerEmail || null },
      });

      // Atomic slot check
      const slot = await tx.slot.findFirst({
        where: { id: data.slotId, status: SlotStatus.AVAILABLE },
      });
      if (!slot) throw new Error('Slot is not available');

      // Server-side price calculation
      const priceCalc = await calculatePrice(data.packageId, data.addonIds || [], data.slotId, data.discountCode, data.customDiscount);

      // Generate reference
      const bookingReference = await generateBookingReference(slot.date);

      // Determine booking status based on payment
      const isPaid = data.paymentStatus === PaymentStatus.PAID;
      const bookingStatus = isPaid ? BookingStatus.CONFIRMED : BookingStatus.PAYMENT_PENDING;
      const slotStatus = isPaid ? SlotStatus.BOOKED : SlotStatus.HELD;

      // Create booking
      const booking = await tx.booking.create({
        data: {
          bookingReference,
          customerId: customer.id,
          theatreId: data.theatreId,
          occasionId: data.occasionId,
          packageId: data.packageId,
          slotId: data.slotId,
          date: slot.date,
          startTime: slot.startTime,
          endTime: slot.endTime,
          guestCount: data.guestCount,
          specialRequest: data.specialRequest || null,
          subtotal: priceCalc.subtotal,
          tax: priceCalc.tax,
          discount: priceCalc.discount,
          discountCode: priceCalc.discountCode || null,
          total: priceCalc.total,
          advanceAmount: priceCalc.total,
          remainingAmount: 0,
          paymentType: 'FULL',
          remainingPaymentStatus: isPaid ? 'PAID_OFFLINE' : 'PENDING',
          bookingSource: data.bookingSource || 'ONLINE',
          bookingStatus,
          paymentStatus: data.paymentStatus || PaymentStatus.PENDING,
          createdBy: adminId,
        },
      });

      // Create booking addons
      if (data.addonIds && data.addonIds.length > 0) {
        const addons = await tx.addon.findMany({
          where: { id: { in: data.addonIds }, isActive: true },
        });
        await tx.bookingAddon.createMany({
          data: addons.map((addon) => ({
            bookingId: booking.id,
            addonId: addon.id,
            addonName: addon.name,
            addonPrice: addon.price,
          })),
        });
      }

      // Update slot
      await tx.slot.update({
        where: { id: data.slotId },
        data: { status: slotStatus, heldByBookingId: booking.id },
      });

      // If paid, create payment record
      if (isPaid) {
        await tx.payment.create({
          data: {
            bookingId: booking.id,
            amount: priceCalc.total,
            paymentType: 'FULL',
            paymentMethod: 'OFFLINE_UPI',
            status: PaymentStatus.PAID,
            verifiedBy: adminId,
            verifiedAt: new Date(),
          },
        });
      }

      // Audit log
      await tx.auditLog.create({
        data: {
          adminId,
          action: 'CREATE',
          entityType: 'Booking',
          entityId: booking.id,
          newValue: JSON.stringify({ bookingReference, total: priceCalc.total }),
        },
      });

      return await tx.booking.findUnique({
        where: { id: booking.id },
        include: {
          customer: true,
          theatre: true,
          occasion: true,
          package: true,
          slot: true,
          bookingAddons: true,
        },
      });
    });
  },

  /**
   * Admin creates an immediate offline / walk-in booking at theatre
   */
  async adminWalkInBooking(data: {
    theatreId: string;
    occasionId: string;
    slotId: string;
    packageId: string;
    addonIds: string[];
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    guestCount: number;
    specialRequest?: string;
    paymentMethod: 'CASH' | 'CARD' | 'OFFLINE_UPI' | 'UPI';
    paidAmount: number;
    discountCode?: string;
    customDiscount?: number;
    transactionRef?: string;
  }, adminId: string) {
    return await prisma.$transaction(async (tx) => {
      const customer = await tx.customer.upsert({
        where: { phone: data.customerPhone },
        update: { name: data.customerName, email: data.customerEmail || null },
        create: { name: data.customerName, phone: data.customerPhone, email: data.customerEmail || null },
      });

      const slot = await tx.slot.findFirst({
        where: { id: data.slotId, status: SlotStatus.AVAILABLE },
      });
      if (!slot) throw new Error('Selected slot is not available for walk-in booking');

      const priceCalc = await calculatePrice(data.packageId, data.addonIds || [], data.slotId, data.discountCode, data.customDiscount);
      const bookingReference = await generateBookingReference(slot.date);

      const total = priceCalc.total;
      const paid = Math.min(total, data.paidAmount);
      const remaining = Math.max(0, total - paid);
      const isFullyPaid = remaining === 0;

      const booking = await tx.booking.create({
        data: {
          bookingReference,
          customerId: customer.id,
          theatreId: data.theatreId,
          occasionId: data.occasionId,
          packageId: data.packageId,
          slotId: data.slotId,
          date: slot.date,
          startTime: slot.startTime,
          endTime: slot.endTime,
          guestCount: data.guestCount,
          specialRequest: data.specialRequest || null,
          subtotal: priceCalc.subtotal,
          tax: priceCalc.tax,
          discount: priceCalc.discount,
          discountCode: priceCalc.discountCode || null,
          total,
          advanceAmount: paid,
          remainingAmount: remaining,
          paymentType: isFullyPaid ? 'FULL' : 'ADVANCE',
          remainingPaymentStatus: isFullyPaid ? 'PAID_OFFLINE' : 'PENDING',
          bookingSource: 'OFFLINE_WALKIN',
          bookingStatus: BookingStatus.CONFIRMED,
          paymentStatus: isFullyPaid ? PaymentStatus.PAID : PaymentStatus.PENDING,
          createdBy: adminId,
        },
      });

      if (data.addonIds && data.addonIds.length > 0) {
        const addons = await tx.addon.findMany({
          where: { id: { in: data.addonIds }, isActive: true },
        });
        await tx.bookingAddon.createMany({
          data: addons.map((addon) => ({
            bookingId: booking.id,
            addonId: addon.id,
            addonName: addon.name,
            addonPrice: addon.price,
          })),
        });
      }

      await tx.slot.update({
        where: { id: data.slotId },
        data: { status: SlotStatus.BOOKED, heldByBookingId: booking.id },
      });

      if (paid > 0) {
        await tx.payment.create({
          data: {
            bookingId: booking.id,
            amount: paid,
            paymentType: isFullyPaid ? 'FULL' : 'ADVANCE',
            paymentMethod: data.paymentMethod || 'CASH',
            upiTransactionRef: data.transactionRef || null,
            status: PaymentStatus.PAID,
            verifiedBy: adminId,
            verifiedAt: new Date(),
          },
        });
      }

      await tx.auditLog.create({
        data: {
          adminId,
          action: 'WALKIN_BOOKING',
          entityType: 'Booking',
          entityId: booking.id,
          newValue: JSON.stringify({ bookingReference, total, paid, remaining, method: data.paymentMethod }),
        },
      });

      return await tx.booking.findUnique({
        where: { id: booking.id },
        include: {
          customer: true,
          theatre: true,
          occasion: true,
          package: true,
          slot: true,
          bookingAddons: true,
          payments: true,
        },
      });
    });
  },

  /**
   * Collect remaining balance after booking completion or at venue
   */
  async collectBalance(data: {
    bookingId: string;
    amount: number;
    paymentMethod: 'CASH' | 'CARD' | 'OFFLINE_UPI' | 'UPI';
    transactionRef?: string;
  }, adminId: string) {
    return await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: data.bookingId },
        include: { customer: true },
      });

      if (!booking) throw new Error('Booking not found');

      if (booking.remainingAmount <= 0) {
        throw new Error('This booking has no remaining balance due');
      }

      const collectedAmount = Math.min(booking.remainingAmount, data.amount);
      const newRemaining = Math.max(0, booking.remainingAmount - collectedAmount);
      const isFullyPaid = newRemaining === 0;

      // Create balance payment record
      await tx.payment.create({
        data: {
          bookingId: booking.id,
          amount: collectedAmount,
          paymentType: 'REMAINING_BALANCE',
          paymentMethod: data.paymentMethod || 'CASH',
          upiTransactionRef: data.transactionRef || null,
          status: PaymentStatus.PAID,
          verifiedBy: adminId,
          verifiedAt: new Date(),
        },
      });

      // Update booking
      const updatedBooking = await tx.booking.update({
        where: { id: booking.id },
        data: {
          remainingAmount: newRemaining,
          remainingPaymentStatus: isFullyPaid ? 'PAID_OFFLINE' : 'PENDING',
          paymentStatus: isFullyPaid ? PaymentStatus.PAID : booking.paymentStatus,
        },
        include: {
          customer: true,
          theatre: true,
          occasion: true,
          package: true,
          slot: true,
          bookingAddons: true,
          payments: true,
        },
      });

      // Audit log
      await tx.auditLog.create({
        data: {
          adminId,
          action: 'COLLECT_BALANCE',
          entityType: 'Booking',
          entityId: booking.id,
          newValue: JSON.stringify({
            collectedAmount,
            newRemaining,
            paymentMethod: data.paymentMethod,
          }),
        },
      });

      return updatedBooking;
    });
  },
};
