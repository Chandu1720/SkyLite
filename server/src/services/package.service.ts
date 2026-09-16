import prisma from '../config/database';

export const packageService = {
  async getAll() {
    return await prisma.package.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
  },

  async getAllAdmin() {
    return await prisma.package.findMany({
      orderBy: { displayOrder: 'asc' },
    });
  },

  async getById(id: string) {
    return await prisma.package.findUnique({ where: { id } });
  },

  async getByOccasion(occasionId: string) {
    const relations = await prisma.occasionPackage.findMany({
      where: { occasionId },
      include: { package: true },
    });
    return relations.map((r) => r.package).filter((p) => p.isActive);
  },

  async create(data: {
    name: string;
    description: string;
    price: number;
    durationMinutes: number;
    features: string[];
    isActive?: boolean;
    displayOrder?: number;
  }) {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return await prisma.package.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        price: data.price,
        durationMinutes: data.durationMinutes,
        features: JSON.stringify(data.features),
        isActive: data.isActive !== false,
        displayOrder: data.displayOrder || 0,
      },
    });
  },

  async update(id: string, data: any) {
    const updateData: any = { ...data };
    if (data.features && Array.isArray(data.features)) {
      updateData.features = JSON.stringify(data.features);
    }
    if (data.name) {
      updateData.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    return await prisma.package.update({ where: { id }, data: updateData });
  },
};
