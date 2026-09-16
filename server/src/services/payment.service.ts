import prisma from '../config/database';
import { buildUpiUri } from '../utils/upi';
import { generateQRDataUrl } from '../utils/qr';
import { validateUtr } from '../utils/validators';
import { BookingStatus, PaymentStatus, SlotStatus } from '@skylite/shared';

export const paymentService = {
  /**
   * Initiate payment for a booking — generates UPI URI and QR code
   * Amount is ALWAYS calculated server-side from the booking record (advanceAmount if ADVANCE, total if FULL)
   */
  async initiatePayment(bookingReference: string) {
    const booking = await prisma.booking.findUnique({
      where: { bookingReference },
      include: { customer: true },
    });

    if (!booking) throw new Error('Booking not found');

    // Only allow payment for HELD bookings
    if (booking.bookingStatus !== BookingStatus.HELD && booking.bookingStatus !== BookingStatus.PAYMENT_PENDING) {
      throw new Error(`Cannot initiate payment for booking in ${booking.bookingStatus} status`);
    }

    // Check if hold has expired
    if (booking.holdExpiresAt && new Date(booking.holdExpiresAt) < new Date()) {
      throw new Error('Booking hold has expired. Please create a new booking.');
    }

    // Get UPI settings from database
    const upiIdSetting = await prisma.setting.findUnique({ where: { key: 'upi_id' } });
    const upiNameSetting = await prisma.setting.findUnique({ where: { key: 'upi_payee_name' } });

    const payeeVpa = upiIdSetting?.value || process.env.UPI_ID || 'skylite@upi';
    const payeeName = upiNameSetting?.value || process.env.UPI_PAYEE_NAME || 'SkyLite Private Theatre';

    // Amount is advanceAmount if booking paymentType is ADVANCE, otherwise full total
    const amount = (booking.paymentType === 'ADVANCE' && booking.advanceAmount > 0)
      ? booking.advanceAmount
      : booking.total;

    // Generate UPI payment URI
    const upiUri = buildUpiUri({
      payeeVpa,
      payeeName,
      amount,
      transactionRef: booking.bookingReference,
      note: `SkyLite Booking ${booking.bookingReference}`,
    });

    // Generate QR code as data URL
    const qrCodeDataUrl = await generateQRDataUrl(upiUri);

    // Check for existing payment record (idempotent)
    let payment = await prisma.payment.findFirst({
      where: {
        bookingId: booking.id,
        paymentType: booking.paymentType || 'FULL',
        status: { in: [PaymentStatus.PENDING, PaymentStatus.INITIATED] },
      },
    });

    if (!payment) {
      // Create new payment record
      payment = await prisma.payment.create({
        data: {
          bookingId: booking.id,
          amount,
          paymentType: booking.paymentType || 'FULL',
          paymentMethod: 'UPI',
          upiUri,
          status: PaymentStatus.INITIATED,
        },
      });
    } else {
      // Update existing payment with new URI (in case settings changed)
      payment = await prisma.payment.update({
        where: { id: payment.id },
        data: { amount, upiUri, status: PaymentStatus.INITIATED },
      });
    }

    // Update booking status to PAYMENT_PENDING
    await prisma.booking.update({
      where: { id: booking.id },
      data: { bookingStatus: BookingStatus.PAYMENT_PENDING, paymentStatus: PaymentStatus.INITIATED },
    });

    // Update slot status
    await prisma.slot.update({
      where: { id: booking.slotId },
      data: { status: SlotStatus.PAYMENT_PENDING },
    });

    return {
      paymentId: payment.id,
      bookingReference: booking.bookingReference,
      amount,
      paymentType: booking.paymentType,
      advanceAmount: booking.advanceAmount,
      remainingAmount: booking.remainingAmount,
      upiUri,
      qrCodeDataUrl,
      holdExpiresAt: booking.holdExpiresAt?.toISOString() || '',
    };
  },

  /**
   * Customer submits payment confirmation (UPI ref + optional screenshot)
   * Idempotent — repeated submissions return existing data
   */
  async submitConfirmation(bookingReference: string, upiTransactionRef: string, screenshotUrl?: string) {
    return await prisma.$transaction(async (tx) => {
      const cleanUtr = upiTransactionRef ? upiTransactionRef.trim() : '';

      // 1. Strict UTR Validation
      if (!cleanUtr || !validateUtr(cleanUtr)) {
        throw new Error('Please enter a valid 12-digit UPI reference number (UTR) or standard bank reference ID');
      }

      const booking = await tx.booking.findUnique({
        where: { bookingReference },
        include: { payments: true },
      });

      if (!booking) throw new Error('Booking not found');

      // Idempotent: if already in verification or confirmed with same UTR, return
      if (
        booking.bookingStatus === BookingStatus.PAYMENT_VERIFICATION ||
        booking.bookingStatus === BookingStatus.CONFIRMED
      ) {
        const existingWithRef = booking.payments.find((p) => p.upiTransactionRef === cleanUtr);
        if (existingWithRef) {
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
        }
      }

      // 2. Strict Duplicate UTR check across all bookings in database
      const duplicatePayment = await tx.payment.findFirst({
        where: {
          upiTransactionRef: cleanUtr,
          status: { in: [PaymentStatus.PAID, PaymentStatus.UNDER_VERIFICATION] },
          bookingId: { not: booking.id },
        },
        include: { booking: true },
      });

      if (duplicatePayment) {
        throw new Error(
          `This UTR reference (${cleanUtr}) has already been used for booking ${duplicatePayment.booking.bookingReference}. Duplicate UTRs are not allowed.`
        );
      }

      // Update payment record
      const latestPayment = booking.payments[booking.payments.length - 1];
      if (latestPayment) {
        await tx.payment.update({
          where: { id: latestPayment.id },
          data: {
            upiTransactionRef: cleanUtr,
            screenshotUrl: screenshotUrl || latestPayment.screenshotUrl || null,
            status: PaymentStatus.UNDER_VERIFICATION,
          },
        });
      }

      // Update booking statuses
      const updatedBooking = await tx.booking.update({
        where: { id: booking.id },
        data: {
          bookingStatus: BookingStatus.PAYMENT_VERIFICATION,
          paymentStatus: PaymentStatus.UNDER_VERIFICATION,
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

      // Update slot status
      await tx.slot.update({
        where: { id: booking.slotId },
        data: { status: SlotStatus.PAYMENT_VERIFICATION },
      });

      return updatedBooking;
    });
  },

  /**
   * Admin verifies payment — confirms the booking
   */
  async verifyPayment(paymentId: string, adminId: string) {
    return await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({
        where: { id: paymentId },
        include: { booking: true },
      });

      if (!payment) throw new Error('Payment not found');

      if (payment.status === PaymentStatus.PAID) {
        return payment; // Idempotent
      }

      // Update payment
      await tx.payment.update({
        where: { id: paymentId },
        data: {
          status: PaymentStatus.PAID,
          verifiedBy: adminId,
          verifiedAt: new Date(),
        },
      });

      // Confirm booking
      await tx.booking.update({
        where: { id: payment.bookingId },
        data: {
          bookingStatus: BookingStatus.CONFIRMED,
          paymentStatus: PaymentStatus.PAID,
        },
      });

      // Mark slot as BOOKED
      await tx.slot.update({
        where: { id: payment.booking.slotId },
        data: {
          status: SlotStatus.BOOKED,
          holdExpiresAt: null,
        },
      });

      // Audit log
      await tx.auditLog.create({
        data: {
          adminId,
          action: 'VERIFY_PAYMENT',
          entityType: 'Payment',
          entityId: paymentId,
          newValue: JSON.stringify({
            bookingId: payment.bookingId,
            amount: payment.amount,
          }),
        },
      });

      return payment;
    });
  },

  /**
   * Admin rejects payment — cancels the booking and releases slot
   */
  async rejectPayment(paymentId: string, adminId: string, reason: string) {
    return await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({
        where: { id: paymentId },
        include: { booking: true },
      });

      if (!payment) throw new Error('Payment not found');

      // Update payment
      await tx.payment.update({
        where: { id: paymentId },
        data: {
          status: PaymentStatus.REJECTED,
          verifiedBy: adminId,
          verifiedAt: new Date(),
          rejectionReason: reason,
        },
      });

      // Cancel booking
      await tx.booking.update({
        where: { id: payment.bookingId },
        data: {
          bookingStatus: BookingStatus.CANCELLED,
          paymentStatus: PaymentStatus.REJECTED,
        },
      });

      // Release slot
      await tx.slot.update({
        where: { id: payment.booking.slotId },
        data: {
          status: SlotStatus.AVAILABLE,
          holdExpiresAt: null,
          heldByBookingId: null,
        },
      });

      // Audit log
      await tx.auditLog.create({
        data: {
          adminId,
          action: 'REJECT_PAYMENT',
          entityType: 'Payment',
          entityId: paymentId,
          newValue: JSON.stringify({
            bookingId: payment.bookingId,
            reason,
          }),
        },
      });

      return payment;
    });
  },

  /**
   * Get all payments awaiting verification
   */
  async getPendingPayments() {
    return await prisma.payment.findMany({
      where: { status: PaymentStatus.UNDER_VERIFICATION },
      include: {
        booking: {
          include: {
            customer: true,
            theatre: true,
            occasion: true,
            package: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  },
};
