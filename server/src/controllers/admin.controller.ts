import { Request, Response, NextFunction } from 'express';
import { reportService } from '../services/report.service';
import { theatreService } from '../services/theatre.service';
import { occasionService } from '../services/occasion.service';
import { packageService } from '../services/package.service';
import { addonService } from '../services/addon.service';
import { slotService } from '../services/slot.service';
import { bookingService } from '../services/booking.service';
import { paymentService } from '../services/payment.service';
import { customerService } from '../services/customer.service';
import { settingsService } from '../services/settings.service';
import { auditService } from '../services/audit.service';
import { couponService } from '../services/coupon.service';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await reportService.getDashboardStats();
    res.json({ success: true, data: stats });
  } catch (error) { next(error); }
};

// THEATRES
export const getTheatres = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const theatres = await theatreService.getAll();
    res.json({ success: true, data: theatres });
  } catch (error) { next(error); }
};

export const createTheatre = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const theatre = await theatreService.create(req.body);
    await auditService.log(req.admin.id, 'CREATE', 'Theatre', theatre.id);
    res.status(201).json({ success: true, data: theatre });
  } catch (error) { next(error); }
};

export const updateTheatre = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const theatre = await theatreService.update(req.params.id as string, req.body);
    await auditService.log(req.admin.id, 'UPDATE', 'Theatre', theatre.id);
    res.json({ success: true, data: theatre });
  } catch (error) { next(error); }
};

// OCCASIONS
export const getOccasions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const occasions = await occasionService.getAll();
    res.json({ success: true, data: occasions });
  } catch (error) { next(error); }
};

export const createOccasion = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const occ = await occasionService.create(req.body);
    await auditService.log(req.admin.id, 'CREATE', 'Occasion', occ.id);
    res.status(201).json({ success: true, data: occ });
  } catch (error) { next(error); }
};

export const updateOccasion = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const occ = await occasionService.update(req.params.id as string, req.body);
    await auditService.log(req.admin.id, 'UPDATE', 'Occasion', occ.id);
    res.json({ success: true, data: occ });
  } catch (error) { next(error); }
};

export const deleteOccasion = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await occasionService.delete(req.params.id as string);
    await auditService.log(req.admin.id, 'DELETE', 'Occasion', req.params.id as string);
    res.json({ success: true, message: 'Occasion deactivated' });
  } catch (error) { next(error); }
};

// PACKAGES
export const getPackages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const packages = await packageService.getAllAdmin();
    res.json({ success: true, data: packages });
  } catch (error) { next(error); }
};

export const createPackage = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const pkg = await packageService.create(req.body);
    await auditService.log(req.admin.id, 'CREATE', 'Package', pkg.id);
    res.status(201).json({ success: true, data: pkg });
  } catch (error) { next(error); }
};

export const updatePackage = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const pkg = await packageService.update(req.params.id as string, req.body);
    await auditService.log(req.admin.id, 'UPDATE', 'Package', pkg.id);
    res.json({ success: true, data: pkg });
  } catch (error) { next(error); }
};

// ADDONS
export const getAddons = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const addons = await addonService.getAllAdmin();
    res.json({ success: true, data: addons });
  } catch (error) { next(error); }
};

export const createAddon = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const addon = await addonService.create(req.body);
    await auditService.log(req.admin.id, 'CREATE', 'Addon', addon.id);
    res.status(201).json({ success: true, data: addon });
  } catch (error) { next(error); }
};

export const updateAddon = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const addon = await addonService.update(req.params.id as string, req.body);
    await auditService.log(req.admin.id, 'UPDATE', 'Addon', addon.id);
    res.json({ success: true, data: addon });
  } catch (error) { next(error); }
};

// SLOTS
export const getSlots = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slots = await slotService.getAllSlots(req.query);
    res.json({ success: true, data: slots });
  } catch (error) { next(error); }
};

export const createSlot = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const slot = await slotService.create(req.body);
    await auditService.log(req.admin.id, 'CREATE', 'Slot', slot.id);
    res.status(201).json({ success: true, data: slot });
  } catch (error) { next(error); }
};

export const createBulkSlots = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { theatreId, startDate, endDate } = req.body;
    const count = await slotService.createBulkSlots(theatreId, startDate, endDate);
    await auditService.log(req.admin.id, 'CREATE', 'Slot', `bulk-${count}`);
    res.status(201).json({ success: true, message: `Created ${count} slots successfully` });
  } catch (error) { next(error); }
};

export const createCustomSlots = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await slotService.createCustomSlots(req.body);
    await auditService.log(req.admin.id, 'CREATE', 'Slot', `custom-${result.slotsCreated}`);
    res.status(201).json({ success: true, data: result, message: `Successfully generated ${result.slotsCreated} slots (${result.slotCountPerDay} per day)` });
  } catch (error) { next(error); }
};

export const updateSlot = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const slot = await slotService.update(req.params.id as string, req.body);
    await auditService.log(req.admin.id, 'UPDATE', 'Slot', slot.id);
    res.json({ success: true, data: slot });
  } catch (error) { next(error); }
};

export const blockSlot = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const slot = await slotService.blockSlot(req.params.id as string, req.admin.id);
    res.json({ success: true, data: slot });
  } catch (error) { next(error); }
};

export const unblockSlot = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const slot = await slotService.unblockSlot(req.params.id as string, req.admin.id);
    res.json({ success: true, data: slot });
  } catch (error) { next(error); }
};

// CALENDAR
export const getCalendar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slots = await slotService.getAllSlots(req.query);
    res.json({ success: true, data: slots });
  } catch (error) { next(error); }
};

// BOOKINGS
export const getBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await bookingService.listBookings(req.query);
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};

export const getBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id as string);
    res.json({ success: true, data: booking });
  } catch (error) { next(error); }
};

export const adminCreateBooking = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const booking = await bookingService.adminCreateBooking(req.body, req.admin.id);
    res.status(201).json({ success: true, data: booking });
  } catch (error) { next(error); }
};

export const adminWalkInBooking = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const booking = await bookingService.adminWalkInBooking(req.body, req.admin.id);
    res.status(201).json({ success: true, data: booking, message: 'Walk-in booking created successfully' });
  } catch (error) { next(error); }
};

export const collectBalance = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { amount, paymentMethod, transactionRef } = req.body;
    const booking = await bookingService.collectBalance({
      bookingId: req.params.id as string,
      amount: Number(amount),
      paymentMethod,
      transactionRef,
    }, req.admin.id);
    res.json({ success: true, data: booking, message: 'Balance collected successfully' });
  } catch (error: any) {
    if (error.message?.includes('no remaining balance')) {
      return res.status(400).json({ success: false, error: error.message });
    }
    next(error);
  }
};

export const cancelBooking = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const booking = await bookingService.cancelBooking(req.params.id as string, req.admin.id);
    res.json({ success: true, data: booking, message: 'Booking cancelled successfully' });
  } catch (error) { next(error); }
};

export const rescheduleBooking = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const booking = await bookingService.rescheduleBooking(req.params.id as string, req.body.newSlotId, req.admin.id);
    res.json({ success: true, data: booking, message: 'Booking rescheduled successfully' });
  } catch (error) { next(error); }
};

// PAYMENTS
export const getPendingPayments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payments = await paymentService.getPendingPayments();
    res.json({ success: true, data: payments });
  } catch (error) { next(error); }
};

export const verifyPayment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const payment = await paymentService.verifyPayment(req.params.id as string, req.admin.id);
    res.json({ success: true, data: payment, message: 'Payment verified successfully' });
  } catch (error) { next(error); }
};

export const rejectPayment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const payment = await paymentService.rejectPayment(req.params.id as string, req.admin.id, req.body.reason || 'Payment rejected');
    res.json({ success: true, data: payment, message: 'Payment rejected' });
  } catch (error) { next(error); }
};

// CUSTOMERS
export const getCustomers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await customerService.getAll(req.query);
    res.json({ success: true, data });
  } catch (error) { next(error); }
};

export const getCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customer = await customerService.getById(req.params.id as string);
    res.json({ success: true, data: customer });
  } catch (error) { next(error); }
};

// SETTINGS
export const getSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await settingsService.getAll();
    res.json({ success: true, data: settings });
  } catch (error) { next(error); }
};

export const updateSettings = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await settingsService.updateMany(req.body.settings);
    await auditService.log(req.admin.id, 'UPDATE', 'Settings', 'bulk');
    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) { next(error); }
};

// REPORTS
export const getReportData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate ? new Date(startDate as string) : undefined;
    const end = endDate ? new Date(endDate as string) : undefined;
    const data = await reportService.getReportData(start, end);
    res.json({ success: true, data });
  } catch (error) { next(error); }
};

// AUDIT LOGS
export const getAuditLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const logs = await auditService.getAll({ skip: 0, take: 100 }, req.query);
    res.json({ success: true, data: { logs, total: logs.length } });
  } catch (error) { next(error); }
};

// REVIEWS
export const getReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reviews = await prisma.review.findMany({ orderBy: { displayOrder: 'asc' } });
    res.json({ success: true, data: reviews });
  } catch (error) { next(error); }
};

export const createReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const review = await prisma.review.create({ data: req.body });
    await auditService.log(req.admin.id, 'CREATE', 'Review', review.id);
    res.status(201).json({ success: true, data: review });
  } catch (error) { next(error); }
};

export const updateReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const review = await prisma.review.update({ where: { id: req.params.id as string }, data: req.body });
    await auditService.log(req.admin.id, 'UPDATE', 'Review', review.id);
    res.json({ success: true, data: review });
  } catch (error) { next(error); }
};

// MEDIA UPLOAD
export const uploadMedia = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image file provided' });
    }
    const relativeUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, data: { url: relativeUrl, filename: req.file.filename } });
  } catch (error) { next(error); }
};

// COUPONS
export const getCoupons = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const coupons = await couponService.getAll();
    res.json({ success: true, data: coupons });
  } catch (error) { next(error); }
};

export const createCoupon = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const coupon = await couponService.create(req.body);
    await auditService.log(req.admin.id, 'CREATE', 'Coupon', coupon.id);
    res.status(201).json({ success: true, data: coupon, message: 'Coupon created successfully' });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, error: 'A coupon with this code already exists' });
    }
    next(error);
  }
};

export const updateCoupon = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const coupon = await couponService.update(req.params.id as string, req.body);
    await auditService.log(req.admin.id, 'UPDATE', 'Coupon', coupon.id);
    res.json({ success: true, data: coupon, message: 'Coupon updated successfully' });
  } catch (error) { next(error); }
};

export const deleteCoupon = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await couponService.delete(req.params.id as string);
    await auditService.log(req.admin.id, 'DELETE', 'Coupon', req.params.id as string);
    res.json({ success: true, message: 'Coupon deleted successfully' });
  } catch (error) { next(error); }
};


