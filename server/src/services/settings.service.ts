import prisma from '../config/database';

export const settingsService = {
  async getAll() {
    return await prisma.setting.findMany({ orderBy: { category: 'asc' } });
  },

  async getByKey(key: string) {
    return await prisma.setting.findUnique({ where: { key } });
  },

  async getPublicSettings() {
    const settings = await prisma.setting.findMany({
      where: {
        key: {
          in: [
            'business_name', 'business_phone', 'business_email', 'business_logo_url',
            'whatsapp_number', 'address', 'google_maps_url',
            'opening_time', 'closing_time', 'tax_percentage', 'currency',
            'allow_advance_payment', 'advance_payment_type', 'advance_payment_value',
            'allow_full_payment', 'allow_pay_at_venue',
            'upi_id', 'upi_payee_name',
            'welcome_popup_enabled', 'welcome_popup_title', 'welcome_popup_subtitle',
            'welcome_popup_coupon_code', 'welcome_popup_discount_text',
          ],
        },
      },
    });

    const map: Record<string, string> = {};
    settings.forEach((s) => { map[s.key] = s.value; });

    return {
      businessName: map['business_name'] || 'SkyLite Private Theatre',
      businessLogoUrl: map['business_logo_url'] || '',
      businessPhone: map['business_phone'] || '',
      businessEmail: map['business_email'] || '',
      whatsappNumber: map['whatsapp_number'] || '',
      address: map['address'] || '',
      googleMapsUrl: map['google_maps_url'] || '',
      openingTime: map['opening_time'] || '10:00',
      closingTime: map['closing_time'] || '22:00',
      taxPercent: parseFloat(map['tax_percentage'] || '18'),
      currency: map['currency'] || 'INR',
      allowAdvancePayment: map['allow_advance_payment'] !== 'false',
      advancePaymentType: (map['advance_payment_type'] as 'FIXED' | 'PERCENTAGE') || 'PERCENTAGE',
      advancePaymentValue: parseFloat(map['advance_payment_value'] || '30'),
      allowFullPayment: map['allow_full_payment'] !== 'false',
      allowPayAtVenue: map['allow_pay_at_venue'] === 'true',
      upiId: map['upi_id'] || '',
      upiPayeeName: map['upi_payee_name'] || '',
      welcomePopupEnabled: map['welcome_popup_enabled'] !== 'false',
      welcomePopupTitle: map['welcome_popup_title'] || '🎉 Special Welcome Offer!',
      welcomePopupSubtitle: map['welcome_popup_subtitle'] || 'Get 20% OFF on your first private theatre booking',
      welcomePopupCouponCode: map['welcome_popup_coupon_code'] || 'WELCOME20',
      welcomePopupDiscountText: map['welcome_popup_discount_text'] || 'Use code at checkout for instant savings',
    };
  },

  async update(key: string, value: string) {
    return await prisma.setting.update({
      where: { key },
      data: { value },
    });
  },

  async updateMany(settings: { key: string; value: string }[]) {
    const updates = settings.map((s) =>
      prisma.setting.upsert({
        where: { key: s.key },
        update: { value: s.value },
        create: { key: s.key, value: s.value, category: 'general' },
      })
    );
    return await Promise.all(updates);
  },
};
