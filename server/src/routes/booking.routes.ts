import { Router } from 'express';
import {
  createBooking,
  getBooking,
  initiatePayment,
  submitPaymentConfirmation,
  lookupBookingStatus,
} from '../controllers/booking.controller';
import { bookingLimiter } from '../middleware/rateLimiter';
import { uploadScreenshot } from '../middleware/upload';

const router = Router();

router.post('/', bookingLimiter, createBooking);
router.get('/status', lookupBookingStatus);
router.get('/:ref', getBooking);
router.post('/:ref/payment/initiate', initiatePayment);
router.post('/:ref/payment/confirm', uploadScreenshot.single('screenshot'), submitPaymentConfirmation);
router.get('/:ref/status', lookupBookingStatus);

export default router;
