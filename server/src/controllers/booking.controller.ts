import { Request, Response, NextFunction } from 'express';
import { bookingService } from '../services/booking.service';
import { paymentService } from '../services/payment.service';

/**
 * Create a new booking (customer-facing)
 * POST /api/bookings
 */
export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      occasionId, theatreId, slotId, packageId, addonIds,
      customerName, customerPhone, customerEmail,
      guestCount, specialRequest, paymentType, discountCode,
    } = req.body;

    // Basic validation
    if (!occasionId || !theatreId || !slotId || !packageId) {
      return res.status(400).json({ success: false, error: 'Missing required fields: occasionId, theatreId, slotId, packageId' });
    }
    if (!customerName || !customerPhone || !customerEmail) {
      return res.status(400).json({ success: false, error: 'Missing customer details: name, phone, email' });
    }

    const booking = await bookingService.createBooking({
      occasionId, theatreId, slotId, packageId,
      addonIds: addonIds || [],
      customerName, customerPhone, customerEmail,
      guestCount: guestCount || 1,
      specialRequest,
      paymentType,
      discountCode,
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error: any) {
    if (error.message?.includes('not available') || error.message?.includes('just booked')) {
      return res.status(409).json({ success: false, error: error.message });
    }
    next(error);
  }
};

/**
 * Get booking by reference (customer-facing)
 * GET /api/bookings/:ref
 */
export const getBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const booking = await bookingService.getBookingByRef(req.params.ref as string);
    res.json({ success: true, data: booking });
  } catch (error: any) {
    if (error.message === 'Booking not found') {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }
    next(error);
  }
};

/**
 * Initiate UPI payment for a booking
 * POST /api/bookings/:ref/payment/initiate
 */
export const initiatePayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const paymentData = await paymentService.initiatePayment(req.params.ref as string);
    res.json({ success: true, data: paymentData });
  } catch (error: any) {
    if (error.message?.includes('not found')) {
      return res.status(404).json({ success: false, error: error.message });
    }
    if (error.message?.includes('expired') || error.message?.includes('Cannot initiate')) {
      return res.status(400).json({ success: false, error: error.message });
    }
    next(error);
  }
};

/**
 * Submit payment confirmation (customer marks payment as done)
 * POST /api/bookings/:ref/payment/confirm
 */
export const submitPaymentConfirmation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { upiTransactionRef } = req.body;

    if (!upiTransactionRef) {
      return res.status(400).json({ success: false, error: 'UPI transaction reference is required' });
    }

    // Handle optional screenshot upload
    let screenshotUrl: string | undefined;
    if (req.file) {
      screenshotUrl = `/uploads/${req.file.filename}`;
    }

    const booking = await paymentService.submitConfirmation(
      req.params.ref as string,
      upiTransactionRef,
      screenshotUrl
    );

    res.json({ success: true, data: booking });
  } catch (error: any) {
    if (error.message === 'Booking not found') {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }
    if (error.message?.includes('valid 12-digit') || error.message?.includes('Duplicate') || error.message?.includes('already been used')) {
      return res.status(400).json({ success: false, error: error.message });
    }
    next(error);
  }
};

/**
 * Lookup booking status by reference + phone
 * GET /api/bookings/status?ref=SKL-XXX&phone=9876543210
 */
export const lookupBookingStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ref, phone } = req.query;

    if (!ref || !phone) {
      return res.status(400).json({ success: false, error: 'Booking reference and phone number are required' });
    }

    const booking = await bookingService.getBookingByRefAndPhone(
      ref as string,
      phone as string
    );

    res.json({ success: true, data: booking });
  } catch (error: any) {
    if (error.message === 'Booking not found' || error.message === 'Phone number does not match') {
      return res.status(404).json({ success: false, error: 'Booking not found. Please check your booking reference and phone number.' });
    }
    next(error);
  }
};
