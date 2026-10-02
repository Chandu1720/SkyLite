import prisma from '../config/database';
import type { CreateGalleryImageRequest, UpdateGalleryImageRequest, GalleryImageDTO } from '@skylite/shared';

const DEFAULT_GALLERY_SEEDS = [
  {
    title: 'Neon Glow Birthday Celebration',
    category: 'birthdays',
    imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1200',
    description: 'Custom neon birthday arch with pastel balloons and gourmet chocolate cake setup.',
    displayOrder: 1,
    isActive: true,
  },
  {
    title: 'Grand Audiophile Screening Hall',
    category: 'theatres',
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200',
    description: 'Plush acoustic recliners, 4K HDR laser projection, and 7.1 Dolby Atmos sound.',
    displayOrder: 2,
    isActive: true,
  },
  {
    title: 'Candlelight Romantic Date Night',
    category: 'datenights',
    imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1200',
    description: 'LED candle walkway with red rose petals, fairy lights, and private screening.',
    displayOrder: 3,
    isActive: true,
  },
  {
    title: 'Magical Marry Me Proposal Setup',
    category: 'proposals',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200',
    description: 'Illuminated MARRY ME marquee letters, floral arch, and custom memory video playback.',
    displayOrder: 4,
    isActive: true,
  },
  {
    title: 'Golden Jubilee Anniversary Lounge',
    category: 'anniversaries',
    imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1200',
    description: 'Champagne gold decor themes, personalized photo montage, and celebration bouquets.',
    displayOrder: 5,
    isActive: true,
  },
  {
    title: 'Private Friends Movie Screening',
    category: 'theatres',
    imageUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200',
    description: 'Comfortable group seating, unlimited snacks, and PlayStation 5 gaming compatibility.',
    displayOrder: 6,
    isActive: true,
  },
  {
    title: 'Fairy Tale Birthday Fantasy',
    category: 'birthdays',
    imageUrl: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=1200',
    description: 'Lavender and silver thematic decor with fog entry and custom countdown video.',
    displayOrder: 7,
    isActive: true,
  },
  {
    title: 'Intimate Proposal with Ring Box Reveal',
    category: 'proposals',
    imageUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1200',
    description: 'Surprise on-screen question projection followed by sparkler celebration.',
    displayOrder: 8,
    isActive: true,
  },
];

export const galleryService = {
  async getAll(onlyActive = true, category?: string): Promise<GalleryImageDTO[]> {
    const where: any = {};
    if (onlyActive) {
      where.isActive = true;
    }
    if (category && category !== 'all') {
      where.category = category;
    }

    let items = await prisma.galleryImage.findMany({
      where,
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
    });

    // Auto-seed if empty
    if (items.length === 0) {
      const count = await prisma.galleryImage.count();
      if (count === 0) {
        for (const seed of DEFAULT_GALLERY_SEEDS) {
          await prisma.galleryImage.create({ data: seed });
        }
        items = await prisma.galleryImage.findMany({
          where,
          orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
        });
      }
    }

    return items.map((img: any) => ({
      ...img,
      createdAt: img.createdAt.toISOString(),
      updatedAt: img.updatedAt.toISOString(),
    }));
  },

  async getById(id: string): Promise<GalleryImageDTO | null> {
    const img: any = await prisma.galleryImage.findUnique({ where: { id } });
    if (!img) return null;
    return {
      ...img,
      createdAt: img.createdAt.toISOString(),
      updatedAt: img.updatedAt.toISOString(),
    };
  },

  async create(data: CreateGalleryImageRequest): Promise<GalleryImageDTO> {
    const img: any = await prisma.galleryImage.create({
      data: {
        title: data.title,
        imageUrl: data.imageUrl,
        category: data.category || 'birthdays',
        description: data.description || null,
        displayOrder: data.displayOrder || 0,
        isActive: data.isActive !== false,
      },
    });

    return {
      ...img,
      createdAt: img.createdAt.toISOString(),
      updatedAt: img.updatedAt.toISOString(),
    };
  },

  async update(id: string, data: UpdateGalleryImageRequest): Promise<GalleryImageDTO> {
    const img: any = await prisma.galleryImage.update({
      where: { id },
      data: {
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.imageUrl !== undefined ? { imageUrl: data.imageUrl } : {}),
        ...(data.category !== undefined ? { category: data.category } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.displayOrder !== undefined ? { displayOrder: data.displayOrder } : {}),
        ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
      },
    });

    return {
      ...img,
      createdAt: img.createdAt.toISOString(),
      updatedAt: img.updatedAt.toISOString(),
    };
  },

  async delete(id: string): Promise<boolean> {
    await prisma.galleryImage.delete({ where: { id } });
    return true;
  },
};
