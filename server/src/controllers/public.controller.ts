import { Request, Response, NextFunction } from 'express';
import { theatreService } from '../services/theatre.service';
import { occasionService } from '../services/occasion.service';
import { packageService } from '../services/package.service';
import { addonService } from '../services/addon.service';
import { slotService } from '../services/slot.service';
import { settingsService } from '../services/settings.service';
import prisma from '../config/database';

export const getTheatres = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const theatres = await theatreService.getAll(true);
    res.json({ success: true, data: theatres });
  } catch (error) { next(error); }
};

export const getTheatreById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const theatre = await theatreService.getById(req.params.id as string);
    if (!theatre) return res.status(404).json({ success: false, error: 'Theatre not found' });
    res.json({ success: true, data: theatre });
  } catch (error) { next(error); }
};

export const getTheatreBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const theatre = await theatreService.getBySlug(req.params.slug as string);
    if (!theatre) return res.status(404).json({ success: false, error: 'Theatre not found' });
    res.json({ success: true, data: theatre });
  } catch (error) { next(error); }
};

export const getOccasions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const occasions = await occasionService.getAll(true);
    res.json({ success: true, data: occasions });
  } catch (error) { next(error); }
};

export const getOccasionBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const occasion = await occasionService.getBySlug(req.params.slug as string);
    if (!occasion) return res.status(404).json({ success: false, error: 'Occasion not found' });
    res.json({ success: true, data: occasion });
  } catch (error) { next(error); }
};

export const getPackages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const occasionId = req.query.occasion as string;
    let packages;
    if (occasionId) {
      packages = await packageService.getByOccasion(occasionId);
    } else {
      packages = await packageService.getAll();
    }
    res.json({ success: true, data: packages });
  } catch (error) { next(error); }
};

export const getAddons = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const occasionId = req.query.occasion as string;
    let addons;
    if (occasionId) {
      addons = await addonService.getByOccasion(occasionId);
    } else {
      addons = await addonService.getAll();
    }
    res.json({ success: true, data: addons });
  } catch (error) { next(error); }
};

export const getSlots = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { theatre, date } = req.query;
    if (!theatre || !date) {
      return res.status(400).json({ success: false, error: 'theatre and date query params are required' });
    }
    const slots = await slotService.getAvailableSlots(theatre as string, date as string);
    res.json({ success: true, data: slots });
  } catch (error) { next(error); }
};

export const getReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
    res.json({ success: true, data: reviews });
  } catch (error) { next(error); }
};

import { couponService } from '../services/coupon.service';

export const getPublicSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await settingsService.getPublicSettings();
    res.json({ success: true, data: settings });
  } catch (error) { next(error); }
};

export const validateCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, error: 'Coupon code is required' });
    }
    const result = await couponService.validateCoupon(code, Number(subtotal || 0));
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message || 'Invalid coupon code' });
  }
};

