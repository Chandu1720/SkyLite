import prisma from '../config/database';
import { CreateCouponInput, UpdateCouponInput } from '@skylite/shared';

export const couponService = {
  async getAll() {
    return prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });
  },

  async getById(id: string) {
    return prisma.coupon.findUnique({
      where: { id },
    });
  },

  async create(data: CreateCouponInput) {
    return prisma.coupon.create({
      data: {
        code: data.code.trim().toUpperCase(),
        description: data.description || null,
        discountType: data.discountType || 'PERCENTAGE',
        discountValue: Number(data.discountValue),
        minOrderAmount: data.minOrderAmount ? Number(data.minOrderAmount) : 0,
        maxDiscountAmount: data.maxDiscountAmount ? Number(data.maxDiscountAmount) : null,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        usageLimit: data.usageLimit ? Number(data.usageLimit) : null,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });
  },

  async update(id: string, data: UpdateCouponInput) {
    const updateData: any = {};
    if (data.code) updateData.code = data.code.trim().toUpperCase();
    if (data.description !== undefined) updateData.description = data.description || null;
    if (data.discountType) updateData.discountType = data.discountType;
    if (data.discountValue !== undefined) updateData.discountValue = Number(data.discountValue);
    if (data.minOrderAmount !== undefined) updateData.minOrderAmount = Number(data.minOrderAmount);
    if (data.maxDiscountAmount !== undefined) updateData.maxDiscountAmount = data.maxDiscountAmount ? Number(data.maxDiscountAmount) : null;
    if (data.startDate !== undefined) updateData.startDate = data.startDate ? new Date(data.startDate) : null;
    if (data.endDate !== undefined) updateData.endDate = data.endDate ? new Date(data.endDate) : null;
    if (data.usageLimit !== undefined) updateData.usageLimit = data.usageLimit ? Number(data.usageLimit) : null;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    return prisma.coupon.update({
      where: { id },
      data: updateData,
    });
  },

  async delete(id: string) {
    return prisma.coupon.delete({
      where: { id },
    });
  },

  async validateCoupon(code: string, subtotal: number) {
    const normalizedCode = code.trim().toUpperCase();
    const coupon = await prisma.coupon.findUnique({
      where: { code: normalizedCode },
    });

    if (!coupon) {
      // Fallback built-in codes
      if (normalizedCode === 'SKYLITE10') {
        const discount = Math.round((subtotal * 10) / 100);
        return { valid: true, code: normalizedCode, discountType: 'PERCENTAGE', discountValue: 10, discount, discountAmount: discount };
      }
      if (normalizedCode === 'WELCOME20') {
        const discount = Math.round((subtotal * 20) / 100);
        return { valid: true, code: normalizedCode, discountType: 'PERCENTAGE', discountValue: 20, discount, discountAmount: discount };
      }
      if (normalizedCode === 'CELEBRATE500') {
        const discount = Math.min(500, subtotal);
        return { valid: true, code: normalizedCode, discountType: 'FIXED', discountValue: 500, discount, discountAmount: discount };
      }
      if (normalizedCode === 'SPECIAL') {
        const discount = Math.round((subtotal * 15) / 100);
        return { valid: true, code: normalizedCode, discountType: 'PERCENTAGE', discountValue: 15, discount, discountAmount: discount };
      }
      throw new Error('Invalid promo code');
    }

    if (!coupon.isActive) {
      throw new Error('This promo coupon is currently inactive');
    }

    const now = new Date();
    if (coupon.startDate && new Date(coupon.startDate) > now) {
      throw new Error('This promo coupon has not started yet');
    }
    if (coupon.endDate && new Date(coupon.endDate) < now) {
      throw new Error('This promo coupon has expired');
    }
    if (coupon.usageLimit != null && coupon.usageCount >= coupon.usageLimit) {
      throw new Error('This promo coupon has reached its maximum usage limit');
    }
    if (subtotal < coupon.minOrderAmount) {
      throw new Error('Minimum booking subtotal of ₹' + coupon.minOrderAmount + ' required for this coupon');
    }

    let discount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discount = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscountAmount != null) {
        discount = Math.min(discount, coupon.maxDiscountAmount);
      }
    } else {
      discount = Math.min(coupon.discountValue, subtotal);
    }

    return {
      valid: true,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discount,
      discountAmount: discount,
      minOrderAmount: coupon.minOrderAmount,
      maxDiscountAmount: coupon.maxDiscountAmount,
      description: coupon.description,
    };
  },
};
