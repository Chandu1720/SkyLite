import { Router } from 'express';
import { authenticateAdmin } from '../middleware/auth';
import { apiLimiter } from '../middleware/rateLimiter';
import { uploadScreenshot } from '../middleware/upload';
import * as adminCtrl from '../controllers/admin.controller';

const router = Router();

// Apply auth middleware to all admin routes
router.use(authenticateAdmin, apiLimiter);

// Dashboard
router.get('/dashboard', adminCtrl.getDashboardStats);

// Theatres
router.get('/theatres', adminCtrl.getTheatres);
router.post('/theatres', adminCtrl.createTheatre);
router.put('/theatres/:id', adminCtrl.updateTheatre);

// Occasions
router.get('/occasions', adminCtrl.getOccasions);
router.post('/occasions', adminCtrl.createOccasion);
router.put('/occasions/:id', adminCtrl.updateOccasion);
router.delete('/occasions/:id', adminCtrl.deleteOccasion);

// Packages
router.get('/packages', adminCtrl.getPackages);
router.post('/packages', adminCtrl.createPackage);
router.put('/packages/:id', adminCtrl.updatePackage);

// Add-ons
router.get('/addons', adminCtrl.getAddons);
router.post('/addons', adminCtrl.createAddon);
router.put('/addons/:id', adminCtrl.updateAddon);

// Slots
router.get('/slots', adminCtrl.getSlots);
router.post('/slots', adminCtrl.createSlot);
router.post('/slots/bulk', adminCtrl.createBulkSlots);
router.post('/slots/custom', adminCtrl.createCustomSlots);
router.put('/slots/:id', adminCtrl.updateSlot);
router.post('/slots/:id/block', adminCtrl.blockSlot);
router.post('/slots/:id/unblock', adminCtrl.unblockSlot);

// Calendar
router.get('/calendar', adminCtrl.getCalendar);

// Bookings
router.get('/bookings', adminCtrl.getBookings);
router.get('/bookings/:id', adminCtrl.getBooking);
router.post('/bookings', adminCtrl.adminCreateBooking);
router.post('/bookings/walkin', adminCtrl.adminWalkInBooking);
router.post('/bookings/:id/collect-balance', adminCtrl.collectBalance);
router.post('/bookings/:id/cancel', adminCtrl.cancelBooking);
router.post('/bookings/:id/reschedule', adminCtrl.rescheduleBooking);

// Payments
router.get('/payments/pending', adminCtrl.getPendingPayments);
router.post('/payments/:id/verify', adminCtrl.verifyPayment);
router.post('/payments/:id/reject', adminCtrl.rejectPayment);

// Customers
router.get('/customers', adminCtrl.getCustomers);
router.get('/customers/:id', adminCtrl.getCustomer);

// Settings
router.get('/settings', adminCtrl.getSettings);
router.put('/settings', adminCtrl.updateSettings);

// Reports
router.get('/reports', adminCtrl.getReportData);

// Audit Logs
router.get('/audit-logs', adminCtrl.getAuditLogs);

// Reviews
router.get('/reviews', adminCtrl.getReviews);
router.post('/reviews', adminCtrl.createReview);
router.put('/reviews/:id', adminCtrl.updateReview);

// Coupons
router.get('/coupons', adminCtrl.getCoupons);
router.post('/coupons', adminCtrl.createCoupon);
router.put('/coupons/:id', adminCtrl.updateCoupon);
router.delete('/coupons/:id', adminCtrl.deleteCoupon);

// Media Upload
router.post('/upload', uploadScreenshot.single('image'), adminCtrl.uploadMedia);

export default router;
