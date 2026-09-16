import prisma from '../config/database';

export const occasionService = {
  async getAll(activeOnly: boolean = false) {
    const where = activeOnly ? { isActive: true } : {};
    return await prisma.occasion.findMany({
      where,
      include: {
        occasionTheatres: { include: { theatre: true } },
        occasionPackages: { include: { package: true } },
        occasionAddons: { include: { addon: true } },
      },
      orderBy: { displayOrder: 'asc' },
    });
  },

  async getById(id: string) {
    return await prisma.occasion.findUnique({
      where: { id },
      include: {
        occasionTheatres: { include: { theatre: true } },
        occasionPackages: { include: { package: true } },
        occasionAddons: { include: { addon: true } },
      },
    });
  },

  async getBySlug(slug: string) {
    return await prisma.occasion.findUnique({
      where: { slug },
      include: {
        occasionTheatres: { include: { theatre: { include: { images: true } } } },
        occasionPackages: { include: { package: true } },
        occasionAddons: { include: { addon: true } },
      },
    });
  },

  async create(data: {
    name: string;
    description: string;
    imageUrl?: string;
    displayOrder: number;
    isFeatured: boolean;
    isActive: boolean;
    theatreIds: string[];
    packageIds: string[];
    addonIds: string[];
  }) {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    return await prisma.occasion.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        imageUrl: data.imageUrl || null,
        displayOrder: data.displayOrder || 0,
        isFeatured: data.isFeatured || false,
        isActive: data.isActive !== false,
        occasionTheatres: {
          create: data.theatreIds?.map((theatreId) => ({ theatreId })) || [],
        },
        occasionPackages: {
          create: data.packageIds?.map((packageId) => ({ packageId })) || [],
        },
        occasionAddons: {
          create: data.addonIds?.map((addonId) => ({ addonId })) || [],
        },
      },
      include: {
        occasionTheatres: { include: { theatre: true } },
        occasionPackages: { include: { package: true } },
        occasionAddons: { include: { addon: true } },
      },
    });
  },

  async update(id: string, data: any) {
    // If relationship arrays are provided, delete existing and recreate
    if (data.theatreIds) {
      await prisma.occasionTheatre.deleteMany({ where: { occasionId: id } });
      await prisma.occasionTheatre.createMany({
        data: data.theatreIds.map((theatreId: string) => ({ occasionId: id, theatreId })),
      });
    }
    if (data.packageIds) {
      await prisma.occasionPackage.deleteMany({ where: { occasionId: id } });
      await prisma.occasionPackage.createMany({
        data: data.packageIds.map((packageId: string) => ({ occasionId: id, packageId })),
      });
    }
    if (data.addonIds) {
      await prisma.occasionAddon.deleteMany({ where: { occasionId: id } });
      await prisma.occasionAddon.createMany({
        data: data.addonIds.map((addonId: string) => ({ occasionId: id, addonId })),
      });
    }

    // Generate slug if name changed
    const updateData: any = {};
    if (data.name) {
      updateData.name = data.name;
      updateData.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    if (data.description !== undefined) updateData.description = data.description;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
    if (data.displayOrder !== undefined) updateData.displayOrder = data.displayOrder;
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    return await prisma.occasion.update({
      where: { id },
      data: updateData,
      include: {
        occasionTheatres: { include: { theatre: true } },
        occasionPackages: { include: { package: true } },
        occasionAddons: { include: { addon: true } },
      },
    });
  },

  async delete(id: string) {
    // Soft delete by deactivating
    return await prisma.occasion.update({
      where: { id },
      data: { isActive: false },
    });
  },
};
