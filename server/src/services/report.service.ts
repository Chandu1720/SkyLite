import prisma from '../config/database';
import { BookingStatus, PaymentStatus } from '@skylite/shared';

export const reportService = {
  async getDashboardStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      todayBookings,
      todayPaidPayments,
      allPaidPayments,
      availableSlots,
      bookedSlots,
      pendingPayments,
      upcomingBookings,
      cancelledBookings,
      pendingBalancesAgg,
    ] = await Promise.all([
      prisma.booking.count({
        where: {
          date: { gte: today, lt: tomorrow },
          bookingStatus: { not: BookingStatus.CANCELLED },
        },
      }),
      prisma.payment.findMany({
        where: {
          createdAt: { gte: today, lt: tomorrow },
          status: PaymentStatus.PAID,
        },
      }),
      prisma.payment.findMany({
        where: {
          status: PaymentStatus.PAID,
        },
      }),
      prisma.slot.count({
        where: {
          status: 'AVAILABLE',
          date: { gte: today },
        },
      }),
      prisma.slot.count({
        where: {
          status: 'BOOKED',
          date: { gte: today },
        },
      }),
      prisma.payment.count({
        where: {
          status: PaymentStatus.UNDER_VERIFICATION,
        },
      }),
      prisma.booking.count({
        where: {
          date: { gte: today },
          bookingStatus: BookingStatus.CONFIRMED,
        },
      }),
      prisma.booking.count({
        where: {
          bookingStatus: BookingStatus.CANCELLED,
        },
      }),
      prisma.booking.aggregate({
        _sum: { remainingAmount: true },
        where: {
          bookingStatus: { not: BookingStatus.CANCELLED },
          remainingAmount: { gt: 0 },
        },
      }),
    ]);

    const todayOnlineRevenue = todayPaidPayments
      .filter((p) => p.paymentMethod === 'UPI')
      .reduce((sum, p) => sum + p.amount, 0);

    const todayOfflineRevenue = todayPaidPayments
      .filter((p) => p.paymentMethod !== 'UPI')
      .reduce((sum, p) => sum + p.amount, 0);

    const totalOnlineRevenue = allPaidPayments
      .filter((p) => p.paymentMethod === 'UPI')
      .reduce((sum, p) => sum + p.amount, 0);

    const totalOfflineRevenue = allPaidPayments
      .filter((p) => p.paymentMethod !== 'UPI')
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      todayBookings,
      todayRevenue: todayOnlineRevenue + todayOfflineRevenue,
      todayOnlineRevenue,
      todayOfflineRevenue,
      availableSlots,
      bookedSlots,
      pendingPayments,
      upcomingBookings,
      cancelledBookings,
      totalRevenue: totalOnlineRevenue + totalOfflineRevenue,
      onlineRevenue: totalOnlineRevenue,
      offlineRevenue: totalOfflineRevenue,
      pendingBalance: pendingBalancesAgg._sum.remainingAmount || 0,
      totalOnlineRevenue,
      totalOfflineRevenue,
      totalPendingBalance: pendingBalancesAgg._sum.remainingAmount || 0,
    };
  },

  async getReportData(startDate?: Date, endDate?: Date) {
    const start = startDate || new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const end = endDate || new Date();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      dailyBookings,
      todayPaidPayments,
      monthlyBookings,
      rangePaidPayments,
      bookings,
      cancellationCount,
      addonsAgg,
      pendingBalancesAgg,
    ] = await Promise.all([
      prisma.booking.count({
        where: {
          date: { gte: today, lt: tomorrow },
          bookingStatus: { not: BookingStatus.CANCELLED },
        },
      }),
      prisma.payment.findMany({
        where: {
          createdAt: { gte: today, lt: tomorrow },
          status: PaymentStatus.PAID,
        },
      }),
      prisma.booking.count({
        where: {
          createdAt: { gte: start, lte: end },
          bookingStatus: { not: BookingStatus.CANCELLED },
        },
      }),
      prisma.payment.findMany({
        where: {
          createdAt: { gte: start, lte: end },
          status: PaymentStatus.PAID,
        },
      }),
      prisma.booking.findMany({
        where: {
          createdAt: { gte: start, lte: end },
        },
        include: {
          occasion: true,
          package: true,
          bookingAddons: true,
        },
      }),
      prisma.booking.count({
        where: {
          createdAt: { gte: start, lte: end },
          bookingStatus: BookingStatus.CANCELLED,
        },
      }),
      prisma.bookingAddon.aggregate({
        _sum: { addonPrice: true },
      }),
      prisma.booking.aggregate({
        _sum: { remainingAmount: true },
        where: {
          createdAt: { gte: start, lte: end },
          bookingStatus: { not: BookingStatus.CANCELLED },
          remainingAmount: { gt: 0 },
        },
      }),
    ]);

    const dailyOnlineRevenue = todayPaidPayments
      .filter((p) => p.paymentMethod === 'UPI')
      .reduce((sum, p) => sum + p.amount, 0);
    const dailyOfflineRevenue = todayPaidPayments
      .filter((p) => p.paymentMethod !== 'UPI')
      .reduce((sum, p) => sum + p.amount, 0);

    const onlineRevenue = rangePaidPayments
      .filter((p) => p.paymentMethod === 'UPI')
      .reduce((sum, p) => sum + p.amount, 0);
    const offlineRevenue = rangePaidPayments
      .filter((p) => p.paymentMethod !== 'UPI')
      .reduce((sum, p) => sum + p.amount, 0);
    const totalRevenue = onlineRevenue + offlineRevenue;

    // Aggregate popular occasions & packages
    const occasionCountMap: Record<string, number> = {};
    const packageCountMap: Record<string, number> = {};

    bookings.forEach((b) => {
      if (b.occasion?.name) {
        occasionCountMap[b.occasion.name] = (occasionCountMap[b.occasion.name] || 0) + 1;
      }
      if (b.package?.name) {
        packageCountMap[b.package.name] = (packageCountMap[b.package.name] || 0) + 1;
      }
    });

    const popularOccasions = Object.entries(occasionCountMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const popularPackages = Object.entries(packageCountMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const averageBookingValue = monthlyBookings > 0 ? Math.round(totalRevenue / monthlyBookings) : 0;

    return {
      dailyBookings,
      dailyRevenue: dailyOnlineRevenue + dailyOfflineRevenue,
      dailyOnlineRevenue,
      dailyOfflineRevenue,
      monthlyBookings,
      monthlyRevenue: totalRevenue,
      onlineRevenue,
      offlineRevenue,
      pendingBalance: pendingBalancesAgg._sum.remainingAmount || 0,
      popularOccasions,
      popularPackages,
      addonRevenue: addonsAgg._sum.addonPrice || 0,
      cancellationCount,
      averageBookingValue,
    };
  },
};
