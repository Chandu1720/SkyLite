import prisma from '../config/database';

export const customerService = {
  async findOrCreate(name: string, phone: string, email?: string) {
    return await prisma.customer.upsert({
      where: { phone },
      update: { name, email: email || undefined },
      create: { name, phone, email: email || null },
    });
  },

  async getAll(params?: { search?: string; page?: number; limit?: number }) {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const skip = (page - 1) * limit;
    const where: any = {};

    if (params?.search) {
      where.OR = [
        { name: { contains: params.search } },
        { phone: { contains: params.search } },
        { email: { contains: params.search } },
      ];
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: limit,
        include: {
          bookings: {
            select: {
              id: true,
              total: true,
              date: true,
              bookingStatus: true,
            },
            orderBy: { createdAt: 'desc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.customer.count({ where }),
    ]);

    // Calculate stats for each customer
    const customersWithStats = customers.map((c) => ({
      ...c,
      totalBookings: c.bookings.length,
      totalSpent: c.bookings
        .filter((b) => b.bookingStatus === 'CONFIRMED' || b.bookingStatus === 'COMPLETED')
        .reduce((sum, b) => sum + b.total, 0),
      lastBookingDate: c.bookings[0]?.date?.toISOString() || null,
    }));

    return { customers: customersWithStats, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async getById(id: string) {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        bookings: {
          include: {
            theatre: true,
            occasion: true,
            package: true,
            slot: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!customer) throw new Error('Customer not found');

    return {
      ...customer,
      totalBookings: customer.bookings.length,
      totalSpent: customer.bookings
        .filter((b) => b.bookingStatus === 'CONFIRMED' || b.bookingStatus === 'COMPLETED')
        .reduce((sum, b) => sum + b.total, 0),
    };
  },
};
