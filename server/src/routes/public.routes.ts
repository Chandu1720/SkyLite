import { Router } from 'express';
import {
  getTheatres,
  getTheatreById,
  getTheatreBySlug,
  getOccasions,
  getOccasionBySlug,
  getPackages,
  getAddons,
  getSlots,
  getReviews,
  getPublicSettings,
  validateCoupon,
} from '../controllers/public.controller';

const router = Router();

router.get('/theatres', getTheatres);
router.get('/theatres/slug/:slug', getTheatreBySlug);
router.get('/theatres/:id', getTheatreById);

router.get('/occasions', getOccasions);
router.get('/occasions/:slug', getOccasionBySlug);

router.get('/packages', getPackages);
router.get('/addons', getAddons);
router.get('/slots', getSlots);
router.get('/reviews', getReviews);
router.get('/settings/public', getPublicSettings);
router.post('/coupons/validate', validateCoupon);

export default router;
