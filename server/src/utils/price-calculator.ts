import prisma from '../config/database';

export interface PriceCalculation {
  packagePrice: number;
  addonsTotal: number;
  subtotal: number;
  tax: number;
  discount: number;
  discountCode?: string;
  total: number;
}

/**
 * Server-side price calculation — the AUTHORITATIVE source of truth.
 * Frontend may display estimates, but this is what gets recorded.
 * NEVER trusts values sent from the client.
 */
export const calculatePrice = async (
  packageId: string,
  addonIds: string[],
  slotId: string,
  discountCode?: string,
  customDiscount?: number
): Promise<PriceCalculation> => {
  // 1. Get package price from database
  const pkg = await prisma.package.findUnique({ where: { id: packageId } });
  if (!pkg) throw new Error('Package not found');
  if (!pkg.isActive) throw new Error('Package is no longer available');

  const packagePrice = Number(pkg.price);

  // 2. Get add-on prices from database
  let addonsTotal = 0;
  if (addonIds && addonIds.length > 0) {
    const addons = await prisma.addon.findMany({
      where: { id: { in: addonIds }, isActive: true },
    });

    // Validate all requested add-ons exist and are active
    if (addons.length !== addonIds.length) {
      throw new Error('One or more add-ons are no longer available');
    }

    addonsTotal = addons.reduce((sum, addon) => sum + Number(addon.price), 0);
  }

  // 3. Check for slot price override
  const slot = await prisma.slot.findUnique({ where: { id: slotId } });
  // If slot has a price override (special/weekend pricing), add it
  const slotSurcharge = slot?.priceOverride ? Number(slot.priceOverride) : 0;

  // 4. Calculate subtotal
  const subtotal = packagePrice + addonsTotal + slotSurcharge;

  // 5. Get tax rate from settings
  const taxSetting = await prisma.setting.findUnique({ where: { key: 'tax_percentage' } });
  const taxRate = taxSetting ? Number(taxSetting.value) : 18;

  const tax = Math.round((subtotal * taxRate) / 100);
  
  // Calculate discount
  let discount = 0;
  let validCode = undefined;

  if (typeof customDiscount === 'number' && customDiscount > 0) {
    discount = Math.min(customDiscount, subtotal + tax);
  } else if (discountCode && discountCode.trim()) {
    const code = discountCode.trim().toUpperCase();

    // Check database for active coupon
    const dbCoupon = await prisma.coupon.findUnique({
      where: { code },
    });

    const now = new Date();

    if (dbCoupon && dbCoupon.isActive) {
      // Check start and end dates
      const isStarted = !dbCoupon.startDate || new Date(dbCoupon.startDate) <= now;
      const isNotExpired = !dbCoupon.endDate || new Date(dbCoupon.endDate) >= now;
      const withinUsage = dbCoupon.usageLimit == null || dbCoupon.usageCount < dbCoupon.usageLimit;
      const meetsMinOrder = subtotal >= dbCoupon.minOrderAmount;

      if (isStarted && isNotExpired && withinUsage && meetsMinOrder) {
        if (dbCoupon.discountType === 'PERCENTAGE') {
          discount = Math.round((subtotal * dbCoupon.discountValue) / 100);
          if (dbCoupon.maxDiscountAmount != null) {
            discount = Math.min(discount, dbCoupon.maxDiscountAmount);
          }
        } else {
          // FIXED
          discount = Math.min(dbCoupon.discountValue, subtotal);
        }
        validCode = dbCoupon.code;
      }
    }

    // Fallback built-in codes if not in DB
    if (!validCode) {
      if (code === 'SKYLITE10') {
        discount = Math.round((subtotal * 10) / 100);
        validCode = 'SKYLITE10';
      } else if (code === 'WELCOME20') {
        discount = Math.round((subtotal * 20) / 100);
        validCode = 'WELCOME20';
      } else if (code === 'CELEBRATE500') {
        discount = Math.min(500, subtotal);
        validCode = 'CELEBRATE500';
      } else if (code === 'SPECIAL') {
        discount = Math.round((subtotal * 15) / 100);
        validCode = 'SPECIAL';
      } else {
        // If code not recognized but provided, don't error, just 0 discount
        discount = 0;
      }
    }
  }

  // 6. Calculate total
  const total = Math.max(0, subtotal + tax - discount);

  return {
    packagePrice,
    addonsTotal,
    subtotal,
    tax,
    discount,
    discountCode: validCode,
    total: Math.round(total),
  };
};

export const calculateAdvanceAndRemaining = (
  total: number,
  paymentType: 'FULL' | 'ADVANCE',
  allowAdvance: boolean = true,
  advanceType: 'FIXED' | 'PERCENTAGE' = 'PERCENTAGE',
  advanceValue: number = 30
) => {
  if (paymentType === 'FULL' || !allowAdvance) {
    return {
      advanceAmount: total,
      remainingAmount: 0,
      paymentType: 'FULL',
    };
  }

  let advance = 0;
  if (advanceType === 'FIXED') {
    advance = Math.min(total, advanceValue);
  } else {
    advance = Math.round(total * (advanceValue / 100));
  }

  advance = Math.max(1, Math.min(advance, total));
  const remaining = Math.max(0, total - advance);

  return {
    advanceAmount: advance,
    remainingAmount: remaining,
    paymentType: 'ADVANCE',
  };
};
