import { config } from '../config/env';

export const whatsappService = {
  generateBookingMessage(booking: any): string {
    return `Hello ${booking.customer.name},\n\nYour booking at SkyLite Private Theatre is confirmed!\n\nBooking Ref: ${booking.reference}\nTheatre: ${booking.theatre.name}\nDate & Time: ${new Date(booking.slot.startTime).toLocaleString()}\n\nTotal Amount: ₹${booking.totalAmount}\n\nThank you for choosing SkyLite!`;
  },

  generateWhatsAppUrl(phone: string, message: string): string {
    const encodedMessage = encodeURIComponent(message);
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  },

  generateReviewRequestMessage(customerName: string, theatreName: string, reviewUrl: string): string {
    const directUrl = reviewUrl || 'https://maps.google.com';
    return `Hi ${customerName}! 🎉\n\nThank you for celebrating with us at SkyLite Private Theatre (${theatreName})! We hope you and your loved ones had a truly magical and memorable time.\n\nCould you please take 30 seconds to rate us and share your experience on Google? It means the world to our team: ⭐⭐⭐⭐⭐\n\n👉 Review us here: ${directUrl}\n\nWe look forward to hosting your next special celebration again soon! 🍿✨`;
  },

  generateReviewWhatsAppUrl(phone: string, customerName: string, theatreName: string, reviewUrl: string): string {
    const message = this.generateReviewRequestMessage(customerName, theatreName, reviewUrl);
    return this.generateWhatsAppUrl(phone, message);
  }
};
