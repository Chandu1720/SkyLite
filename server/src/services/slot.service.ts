import prisma from '../config/database';
import { SlotStatus } from '@skylite/shared';
import { SLOT_TIMES } from '@skylite/shared';

export const slotService = {
  /**
   * Get all slots for a theatre on a specific date (public - shows all statuses for display)
   */
  async getAvailableSlots(theatreId: string, dateStr: string) {
    const date = new Date(dateStr);
    date.setUTCHours(0, 0, 0, 0);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    return await prisma.slot.findMany({
      where: {
        theatreId,
        date: { gte: date, lt: nextDay },
      },
      orderBy: { startTime: 'asc' },
    });
  },

  /**
   * Get slot by ID
   */
  async getById(id: string) {
    return await prisma.slot.findUnique({ where: { id } });
  },

  /**
   * Create a single slot
   */
  async create(data: {
    theatreId: string;
    date: string;
    startTime: string;
    endTime: string;
    priceOverride?: number;
  }) {
    const dateObj = new Date(data.date);
    dateObj.setUTCHours(0, 0, 0, 0);

    return await prisma.slot.create({
      data: {
        theatreId: data.theatreId,
        date: dateObj,
        startTime: data.startTime,
        endTime: data.endTime,
        priceOverride: data.priceOverride || null,
        status: SlotStatus.AVAILABLE,
      },
    });
  },

  /**
   * Create bulk slots for a date range (admin)
   * Creates 5 default time slots per day
   */
  async createBulkSlots(theatreId: string, startDateStr: string, endDateStr: string) {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    const slots: any[] = [];

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateObj = new Date(d);
      dateObj.setUTCHours(0, 0, 0, 0);

      for (const time of SLOT_TIMES) {
        slots.push({
          theatreId,
          date: dateObj,
          startTime: time.start,
          endTime: time.end,
          status: SlotStatus.AVAILABLE,
        });
      }
    }

    await prisma.slot.createMany({ data: slots });
    return slots.length;
  },

  /**
   * Admin generates custom slots with configurable opening/closing times, duration, buffer and price overrides
   */
  async createCustomSlots(data: {
    theatreId: string;
    startDate: string;
    endDate: string;
    openingTime?: string;
    closingTime?: string;
    slotDurationMinutes?: number;
    bufferMinutes?: number;
    priceOverride?: number;
  }) {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const openTime = data.openingTime || '10:00';
    const closeTime = data.closingTime || '22:00';
    const duration = Number(data.slotDurationMinutes) || 120;
    const buffer = Number(data.bufferMinutes) || 30;

    const [openH, openM] = openTime.split(':').map(Number);
    const [closeH, closeM] = closeTime.split(':').map(Number);
    const openMinutesTotal = openH * 60 + openM;
    const closeMinutesTotal = closeH * 60 + closeM;

    const generatedTimes: { start: string; end: string }[] = [];
    let currentStart = openMinutesTotal;

    while (currentStart + duration <= closeMinutesTotal) {
      const endMinutes = currentStart + duration;
      const sH = String(Math.floor(currentStart / 60)).padStart(2, '0');
      const sM = String(currentStart % 60).padStart(2, '0');
      const eH = String(Math.floor(endMinutes / 60)).padStart(2, '0');
      const eM = String(endMinutes % 60).padStart(2, '0');

      generatedTimes.push({
        start: `${sH}:${sM}`,
        end: `${eH}:${eM}`,
      });

      currentStart = endMinutes + buffer;
    }

    const slotsToCreate: any[] = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateObj = new Date(d);
      dateObj.setUTCHours(0, 0, 0, 0);

      for (const time of generatedTimes) {
        slotsToCreate.push({
          theatreId: data.theatreId,
          date: dateObj,
          startTime: time.start,
          endTime: time.end,
          priceOverride: data.priceOverride ? Number(data.priceOverride) : null,
          status: SlotStatus.AVAILABLE,
        });
      }
    }

    if (slotsToCreate.length > 0) {
      await prisma.slot.createMany({ data: slotsToCreate });
    }

    return { slotsCreated: slotsToCreate.length, slotCountPerDay: generatedTimes.length };
  },

  /**
   * Update slot
   */
  async update(id: string, data: Partial<{
    startTime: string;
    endTime: string;
    priceOverride: number | null;
    status: string;
  }>) {
    return await prisma.slot.update({ where: { id }, data });
  },

  /**
   * Block a slot (admin)
   */
  async blockSlot(id: string, adminId: string) {
    const slot = await prisma.slot.findUnique({ where: { id } });
    if (!slot) throw new Error('Slot not found');

    if (slot.status !== SlotStatus.AVAILABLE) {
      throw new Error(`Cannot block a slot in ${slot.status} status`);
    }

    const updated = await prisma.slot.update({
      where: { id },
      data: { status: SlotStatus.BLOCKED },
    });

    await prisma.auditLog.create({
      data: {
        adminId,
        action: 'BLOCK',
        entityType: 'Slot',
        entityId: id,
        previousValue: JSON.stringify({ status: slot.status }),
        newValue: JSON.stringify({ status: SlotStatus.BLOCKED }),
      },
    });

    return updated;
  },

  /**
   * Unblock a slot (admin)
   */
  async unblockSlot(id: string, adminId: string) {
    const slot = await prisma.slot.findUnique({ where: { id } });
    if (!slot) throw new Error('Slot not found');

    if (slot.status !== SlotStatus.BLOCKED) {
      throw new Error('Slot is not blocked');
    }

    const updated = await prisma.slot.update({
      where: { id },
      data: { status: SlotStatus.AVAILABLE },
    });

    await prisma.auditLog.create({
      data: {
        adminId,
        action: 'UNBLOCK',
        entityType: 'Slot',
        entityId: id,
        previousValue: JSON.stringify({ status: SlotStatus.BLOCKED }),
        newValue: JSON.stringify({ status: SlotStatus.AVAILABLE }),
      },
    });

    return updated;
  },

  /**
   * CRITICAL: Release expired holds.
   * Called by background job every 60 seconds.
   * Finds all HELD/PAYMENT_PENDING slots where holdExpiresAt < now,
   * releases them back to AVAILABLE.
   */
  async releaseExpiredHolds() {
    const now = new Date();

    // Find expired slots
    const expiredSlots = await prisma.slot.findMany({
      where: {
        status: { in: [SlotStatus.HELD, SlotStatus.PAYMENT_PENDING] },
        holdExpiresAt: { lt: now },
      },
    });

    if (expiredSlots.length === 0) return 0;

    // Release each slot and update corresponding booking
    for (const slot of expiredSlots) {
      await prisma.$transaction(async (tx) => {
        // Release slot
        await tx.slot.update({
          where: { id: slot.id },
          data: {
            status: SlotStatus.AVAILABLE,
            holdExpiresAt: null,
            heldByBookingId: null,
          },
        });

        // Expire the booking if one exists
        if (slot.heldByBookingId) {
          await tx.booking.update({
            where: { id: slot.heldByBookingId },
            data: {
              bookingStatus: 'EXPIRED',
              paymentStatus: 'FAILED',
            },
          });
        }
      });
    }

    return expiredSlots.length;
  },

  /**
   * Get all slots for admin (with filters)
   */
  async getAllSlots(filters: {
    theatreId?: string;
    date?: string;
    status?: string;
  }) {
    const where: any = {};

    if (filters.theatreId) where.theatreId = filters.theatreId;
    if (filters.status) where.status = filters.status;
    if (filters.date) {
      const date = new Date(filters.date);
      date.setUTCHours(0, 0, 0, 0);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      where.date = { gte: date, lt: nextDay };
    }

    return await prisma.slot.findMany({
      where,
      include: { theatre: true },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });
  },
};
