import prisma from '../config/database';

export const addonService = {
  async getAll() {
    return await prisma.addon.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
  },

  async getAllAdmin() {
    return await prisma.addon.findMany({
      orderBy: { displayOrder: 'asc' },
    });
  },

  async getById(id: string) {
    return await prisma.addon.findUnique({ where: { id } });
  },

  async getByOccasion(occasionId: string) {
    const relations = await prisma.occasionAddon.findMany({
      where: { occasionId },
      include: { addon: true },
    });
    return relations.map((r) => r.addon).filter((a) => a.isActive);
  },

  async create(data: {
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
    isActive?: boolean;
    displayOrder?: number;
  }) {
    return await prisma.addon.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        imageUrl: data.imageUrl || null,
        isActive: data.isActive !== false,
        displayOrder: data.displayOrder || 0,
      },
    });
  },

  async update(id: string, data: any) {
    return await prisma.addon.update({ where: { id }, data });
  },
};
