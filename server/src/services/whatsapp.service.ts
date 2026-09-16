import { config } from '../config/env';

export const whatsappService = {
  generateBookingMessage(booking: any): string {
    return `Hello ${booking.customer.name},\n\nYour booking at SkyLite Private Theatre is confirmed!\n\nBooking Ref: ${booking.reference}\nTheatre: ${booking.theatre.name}\nDate & Time: ${new Date(booking.slot.startTime).toLocaleString()}\n\nTotal Amount: ₹${booking.totalAmount}\n\nThank you for choosing SkyLite!`;
  },

  generateWhatsAppUrl(phone: string, message: string): string {
    const encodedMessage = encodeURIComponent(message);
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  }
};
