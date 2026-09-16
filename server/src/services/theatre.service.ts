import prisma from '../config/database';

export const theatreService = {
  async getAll(activeOnly: boolean = false) {
    const where = activeOnly ? { status: 'ACTIVE' } : {};
    return await prisma.theatre.findMany({
      where,
      include: { images: { orderBy: { displayOrder: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getById(id: string) {
    return await prisma.theatre.findUnique({
      where: { id },
      include: { images: { orderBy: { displayOrder: 'asc' } } },
    });
  },

  async getBySlug(slug: string) {
    return await prisma.theatre.findUnique({
      where: { slug },
      include: { images: { orderBy: { displayOrder: 'asc' } } },
    });
  },

  async create(data: {
    name: string;
    description: string;
    capacity: number;
    location: string;
    facilities: string[];
    basePrice: number;
  }) {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return await prisma.theatre.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        capacity: data.capacity,
        location: data.location,
        facilities: JSON.stringify(data.facilities),
        basePrice: data.basePrice,
        status: 'ACTIVE',
      },
      include: { images: true },
    });
  },

  async update(id: string, data: any) {
    const updateData: any = { ...data };
    if (data.facilities && Array.isArray(data.facilities)) {
      updateData.facilities = JSON.stringify(data.facilities);
    }
    if (data.name) {
      updateData.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    return await prisma.theatre.update({
      where: { id },
      data: updateData,
      include: { images: true },
    });
  },
};
