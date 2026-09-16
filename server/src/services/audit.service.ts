import prisma from '../config/database';

export const auditService = {
  async log(adminId: string, action: string, entityType: string, entityId: string, previousValue?: string, newValue?: string, ipAddress?: string) {
    return await prisma.auditLog.create({
      data: {
        adminId,
        action,
        entityType,
        entityId,
        previousValue,
        newValue,
        ipAddress
      }
    });
  },

  async getAll(pagination: any = { skip: 0, take: 50 }, filters: any = {}) {
    return await prisma.auditLog.findMany({
      where: filters,
      ...pagination,
      include: { admin: true },
      orderBy: { createdAt: 'desc' }
    });
  }
};
