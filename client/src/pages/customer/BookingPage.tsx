import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { BookingStepper } from '../../components/booking/BookingStepper';
import { occasionApi } from '../../api/occasions';
import { theatreApi } from '../../api/theatres';
import { packageApi } from '../../api/packages';
import { addonApi } from '../../api/addons';
import { slotApi } from '../../api/slots';
import { bookingApi } from '../../api/bookings';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { SlotCard } from '../../components/cards/SlotCard';
import { PriceBreakdown } from '../../components/booking/PriceBreakdown';
import { formatCurrency, formatTime12h, formatDate } from '@skylite/shared';
import { useSettings } from '../../hooks/useSettings';
import type { OccasionDTO, TheatreDTO, PackageDTO, AddonDTO, SlotDTO } from '@skylite/shared';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Film,
  Calendar,
  Clock,
  Gift,
  PlusCircle,
  User,
  ArrowRight,
  ArrowLeft,
  Check,
  MapPin,
  Users,
  ShieldCheck,
  Tag,
  CreditCard,
  Banknote,
} from 'lucide-react';

export const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { settings } = useSettings();

  const {
    currentStep,
    selectedOccasion,
    selectedTheatre,
    selectedDate,
    selectedSlot,
    selectedPackage,
    selectedAddons,
    customerDetails,
    paymentType,
    discountCode,
    setStep,
    selectOccasion,
    selectTheatre,
    selectDate,
    selectSlot,
    selectPackage,
    toggleAddon,
    setCustomerDetails,
    setPaymentType,
    setDiscountCode,
    goBack,
    goNext,
    canGoNext,
  } = useBooking();

  // Data states
  const [occasions, setOccasions] = useState<OccasionDTO[]>([]);
  const [theatres, setTheatres] = useState<TheatreDTO[]>([]);
  const [packages, setPackages] = useState<PackageDTO[]>([]);
  const [addons, setAddons] = useState<AddonDTO[]>([]);
  const [slots, setSlots] = useState<SlotDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Form inputs for customer
  const [name, setName] = useState(customerDetails?.name || '');
  const [phone, setPhone] = useState(customerDetails?.phone || '');
  const [email, setEmail] = useState(customerDetails?.email || '');
  const [guestCount, setGuestCount] = useState(customerDetails?.numberOfPeople || 2);
  const [specialRequest, setSpecialRequest] = useState('');
  const [couponInput, setCouponInput] = useState(discountCode || '');
  const [appliedCoupon, setAppliedCoupon] = useState(discountCode || '');
  const [appliedCouponMeta, setAppliedCouponMeta] = useState<{
    code: string;
    discountType: 'PERCENTAGE' | 'FIXED';
    discountValue: number;
    minOrderAmount?: number;
    maxDiscountAmount?: number | null;
  } | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);

  // Initial data loading
  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        const [occList, theatreList] = await Promise.all([
          occasionApi.getAll(),
          theatreApi.getAll(),
        ]);
        setOccasions(occList);
        setTheatres(theatreList);

        // Pre-select occasion from URL if provided
        const occParam = searchParams.get('occasion');
        if (occParam) {
          const match = occList.find((o) => o.slug === occParam || o.id === occParam);
          if (match) {
            selectOccasion(match.id);
            setStep(2);
          }
        } else if (theatreList.length === 1 && !selectedTheatre) {
          // If only 1 theatre exists, auto-select it for convenience
          selectTheatre(theatreList[0].id);
        }
      } catch (err: any) {
        toast('error', 'Failed to load booking details. Please refresh.');
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  // Fetch packages and addons when occasion changes
  useEffect(() => {
    if (selectedOccasion) {
      packageApi.getByOccasion(selectedOccasion).then(setPackages).catch(() => {});
      addonApi.getByOccasion(selectedOccasion).then(setAddons).catch(() => {});
    }
  }, [selectedOccasion]);

  // Fetch slots when theatre and date change
  useEffect(() => {
    if (selectedTheatre && selectedDate) {
      setLoading(true);
      slotApi
        .getAvailable(selectedTheatre, selectedDate)
        .then(setSlots)
        .catch(() => toast('error', 'Could not load slots for this date'))
        .finally(() => setLoading(false));
    }
  }, [selectedTheatre, selectedDate]);

  // Selected object helpers
  const currentOccasionObj = occasions.find((o) => o.id === selectedOccasion);
  const currentTheatreObj = theatres.find((t) => t.id === selectedTheatre);
  const currentPackageObj = packages.find((p) => p.id === selectedPackage);
  const currentSlotObj = slots.find((s) => s.id === selectedSlot);
  const selectedAddonObjs = addons.filter((a) => selectedAddons.includes(a.id));

  // Compute prices & advance preview
  const packagePrice = currentPackageObj?.price || 0;
  const addonsTotal = selectedAddonObjs.reduce((s, a) => s + a.price, 0);
  const rawSubtotal = packagePrice + addonsTotal;
  const taxRate = (settings?.taxPercent || 18) / 100;
  const taxAmount = Math.round(rawSubtotal * taxRate);
  const totalBeforeDiscount = rawSubtotal + taxAmount;

  // Pre-fill coupon from URL search params if present
  useEffect(() => {
    const couponParam = searchParams.get('coupon') || searchParams.get('code');
    if (couponParam) {
      const upper = couponParam.trim().toUpperCase();
      setCouponInput(upper);
      setDiscountCode(upper);
    }
  }, [searchParams]);

  // Recalculate discount dynamically if subtotal changes (e.g. package or addon change)
  useEffect(() => {
    if (appliedCouponMeta && rawSubtotal > 0) {
      if (appliedCouponMeta.minOrderAmount && rawSubtotal < appliedCouponMeta.minOrderAmount) {
        setCouponDiscount(0);
        setAppliedCoupon('');
        setAppliedCouponMeta(null);
        setDiscountCode('');
        toast('error', `Coupon ${appliedCouponMeta.code} removed: requires minimum subtotal of ${formatCurrency(appliedCouponMeta.minOrderAmount)}`);
      } else {
        let disc = 0;
        if (appliedCouponMeta.discountType === 'PERCENTAGE') {
          disc = Math.round((rawSubtotal * appliedCouponMeta.discountValue) / 100);
          if (appliedCouponMeta.maxDiscountAmount != null) {
            disc = Math.min(disc, appliedCouponMeta.maxDiscountAmount);
          }
        } else {
          disc = Math.min(appliedCouponMeta.discountValue, rawSubtotal);
        }
        setCouponDiscount(disc);
      }
    }
  }, [rawSubtotal, appliedCouponMeta]);

  const handleApplyCoupon = async (codeToApply?: string) => {
    const code = (codeToApply || couponInput).trim().toUpperCase();
    if (!code) {
      setAppliedCoupon('');
      setAppliedCouponMeta(null);
      setCouponDiscount(0);
      setDiscountCode('');
      return;
    }

    try {
      const res = await bookingApi.validateCoupon(code, rawSubtotal);
      if (res && res.valid) {
        const discAmount = typeof res.discountAmount === 'number'
          ? res.discountAmount
          : typeof (res as any).discount === 'number'
          ? (res as any).discount
          : 0;

        setCouponDiscount(discAmount);
        setAppliedCoupon(code);
        setDiscountCode(code);
        if (res.discountType && res.discountValue) {
          setAppliedCouponMeta({
            code,
            discountType: res.discountType,
            discountValue: res.discountValue,
            minOrderAmount: res.minOrderAmount || 0,
            maxDiscountAmount: res.maxDiscountAmount,
          });
        }
        toast('success', `Coupon ${code} applied! ${formatCurrency(discAmount)} discount.`);
      } else {
        // Fallback checks
        if (code === 'SKYLITE10') {
          const disc = Math.round((rawSubtotal * 10) / 100);
          setCouponDiscount(disc);
          setAppliedCoupon(code);
          setDiscountCode(code);
          setAppliedCouponMeta({ code, discountType: 'PERCENTAGE', discountValue: 10 });
          toast('success', `Coupon ${code} applied! ₹${disc} discount.`);
        } else if (code === 'WELCOME20') {
          const disc = Math.round((rawSubtotal * 20) / 100);
          setCouponDiscount(disc);
          setAppliedCoupon(code);
          setDiscountCode(code);
          setAppliedCouponMeta({ code, discountType: 'PERCENTAGE', discountValue: 20 });
          toast('success', `Coupon ${code} applied! ₹${disc} discount.`);
        } else {
          toast('error', res?.message || 'Invalid or expired coupon code');
        }
      }
    } catch (err: any) {
      toast('error', err?.response?.data?.error || 'Failed to validate coupon code');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon('');
    setAppliedCouponMeta(null);
    setCouponDiscount(0);
    setCouponInput('');
    setDiscountCode('');
    toast('info', 'Coupon removed');
  };

  const finalTotal = Math.max(0, totalBeforeDiscount - couponDiscount);
  const allowAdvance = settings?.allowAdvancePayment !== false;
  const advanceVal = settings?.advancePaymentValue || 30;
  const advanceType = settings?.advancePaymentType || 'PERCENTAGE';
  
  let computedAdvance = finalTotal;
  if (allowAdvance && paymentType === 'ADVANCE') {
    if (advanceType === 'FIXED') {
      computedAdvance = Math.min(finalTotal, advanceVal);
    } else {
      computedAdvance = Math.round(finalTotal * (advanceVal / 100));
    }
    computedAdvance = Math.max(1, Math.min(computedAdvance, finalTotal));
  }
  const computedRemaining = Math.max(0, finalTotal - computedAdvance);

  // Date list for next 30 days
  const availableDates = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1); // Start from tomorrow
    return d.toISOString().split('T')[0];
  });

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedOccasion) {
      toast('error', 'Please select an occasion before proceeding.');
      setStep(1);
      return;
    }

    if (!selectedTheatre) {
      toast('error', 'Please select a theatre hall before proceeding.');
      setStep(2);
      return;
    }

    if (!selectedDate) {
      toast('error', 'Please select a celebration date.');
      setStep(3);
      return;
    }

    if (!selectedSlot) {
      toast('error', 'Please select a time slot.');
      setStep(4);
      return;
    }

    if (!selectedPackage) {
      toast('error', 'Please select an experience package.');
      setStep(5);
      return;
    }

    if (!name || !phone || !email) {
      toast('error', 'Please fill in all required customer details');
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      toast('error', 'Please enter a valid 10-digit mobile number');
      return;
    }

    setCustomerDetails({
      name,
      phone: cleanPhone,
      email,
      numberOfPeople: guestCount,
    });

    try {
      setSubmitting(true);
      const booking = await bookingApi.create({
        occasionId: selectedOccasion,
        theatreId: selectedTheatre,
        slotId: selectedSlot,
        packageId: selectedPackage,
        addonIds: selectedAddons || [],
        customerName: name.trim(),
        customerPhone: cleanPhone,
        customerEmail: email.trim(),
        guestCount,
        specialRequest: specialRequest?.trim() || undefined,
        paymentType: allowAdvance ? paymentType : 'FULL',
        discountCode: appliedCoupon || undefined,
      });

      toast('success', `Slot held! Booking reference: ${booking.bookingReference}`);
      navigate(`/payment/${booking.bookingReference}`);
    } catch (err: any) {
      toast('error', err.response?.data?.error || err.message || 'Booking creation failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-darker text-white">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-16 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-heading text-brand-gold mb-2">Book Your Experience</h1>
          <p className="text-gray-400 text-sm md:text-base">Customize your private cinema celebration in a few simple steps</p>
        </div>

        {/* Stepper */}
        <div className="mb-10">
          <BookingStepper currentStep={currentStep} onStepClick={(step) => setStep(step)} />
        </div>

        {/* Content Box */}
        <div className="bg-brand-dark/60 backdrop-blur-md rounded-2xl border border-gray-800 p-6 md:p-10 shadow-2xl">
          <AnimatePresence mode="wait">
            {/* Step 1: Select Occasion */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
                  <Sparkles className="w-6 h-6 text-brand-gold" />
                  <div>
                    <h2 className="text-xl md:text-2xl font-heading text-white">Select Your Occasion</h2>
                    <p className="text-xs md:text-sm text-gray-400">Choose what you're celebrating with us</p>
                  </div>
                </div>

                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <LoadingSkeleton variant="card" count={6} />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {occasions.map((occ) => {
                      const isSelected = selectedOccasion === occ.id;
                      return (
                        <div
                          key={occ.id}
                          onClick={() => {
                            selectOccasion(occ.id);
                            goNext();
                          }}
                          className={`group cursor-pointer rounded-xl p-5 border-2 transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                            isSelected
                              ? 'border-brand-gold bg-brand-gold/10 shadow-lg shadow-brand-gold/10'
                              : 'border-gray-800 bg-brand-darker hover:border-brand-gold/50'
                          }`}
                        >
                          {occ.isFeatured && (
                            <span className="absolute top-3 right-3 text-xs bg-brand-gold text-brand-dark px-2 py-0.5 rounded-full font-bold">
                              Popular
                            </span>
                          )}
                          <div className="space-y-2">
                            <h3 className="text-lg font-heading text-white group-hover:text-brand-gold transition-colors">
                              {occ.name}
                            </h3>
                            <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                              {occ.description}
                            </p>
                          </div>
                          <div className="mt-4 pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs text-brand-gold">
                            <span>Select Occasion</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 2: Select Theatre */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
                  <Film className="w-6 h-6 text-brand-gold" />
                  <div>
                    <h2 className="text-xl md:text-2xl font-heading text-white">Select Private Theatre</h2>
                    <p className="text-xs md:text-sm text-gray-400">Choose your luxury private screening hall</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {theatres.map((theatre) => {
                    const isSelected = selectedTheatre === theatre.id;
                    const parsedFacilities: string[] = Array.isArray(theatre.facilities)
                      ? theatre.facilities
                      : typeof theatre.facilities === 'string'
                      ? JSON.parse(theatre.facilities || '[]')
                      : [];

                    return (
                      <div
                        key={theatre.id}
                        onClick={() => {
                          selectTheatre(theatre.id);
                          goNext();
                        }}
                        className={`group cursor-pointer rounded-xl p-6 border-2 transition-all duration-300 ${
                          isSelected
                            ? 'border-brand-gold bg-brand-gold/10'
                            : 'border-gray-800 bg-brand-darker hover:border-brand-gold/50'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-xl font-heading text-white group-hover:text-brand-gold transition-colors">
                              {theatre.name}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                              <MapPin className="w-3.5 h-3.5 text-brand-gold" />
                              <span>{theatre.location}</span>
                            </div>
                          </div>
                          <span className="flex items-center gap-1 text-xs bg-gray-800 px-2.5 py-1 rounded-full text-gray-300">
                            <Users className="w-3.5 h-3.5 text-brand-gold" />
                            Up to {theatre.capacity} Guests
                          </span>
                        </div>

                        <p className="text-sm text-gray-300 mb-4">{theatre.description}</p>

                        {parsedFacilities.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {parsedFacilities.map((f, i) => (
                              <span key={i} className="text-xs bg-gray-800/60 border border-gray-700 px-2 py-0.5 rounded text-gray-400">
                                {f}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="pt-3 border-t border-gray-800 flex items-center justify-between">
                          <span className="text-brand-gold font-heading text-lg">
                            From {formatCurrency(theatre.basePrice)}
                          </span>
                          <span className="text-xs text-brand-gold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            Select Hall <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 3: Select Date */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
                  <Calendar className="w-6 h-6 text-brand-gold" />
                  <div>
                    <h2 className="text-xl md:text-2xl font-heading text-white">Select Celebration Date</h2>
                    <p className="text-xs md:text-sm text-gray-400">Pick a date within the next 30 days</p>
                  </div>
                </div>

                {/* Horizontal scrollable date pills on mobile, grid on desktop */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3">
                  {availableDates.map((dateStr) => {
                    const isSelected = selectedDate === dateStr;
                    const dateObj = new Date(dateStr);
                    const dayName = dateObj.toLocaleDateString('en-IN', { weekday: 'short' });
                    const monthName = dateObj.toLocaleDateString('en-IN', { month: 'short' });
                    const dayNum = dateObj.getDate();

                    return (
                      <button
                        key={dateStr}
                        onClick={() => {
                          selectDate(dateStr);
                          goNext();
                        }}
                        className={`p-3.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                          isSelected
                            ? 'border-brand-gold bg-brand-gold text-brand-dark font-bold shadow-lg shadow-brand-gold/20'
                            : 'border-gray-800 bg-brand-darker hover:border-brand-gold/50 text-gray-300'
                        }`}
                      >
                        <span className="text-xs uppercase tracking-wider opacity-80">{dayName}</span>
                        <span className="text-2xl font-heading leading-none">{dayNum}</span>
                        <span className="text-xs uppercase">{monthName}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 4: Select Slot */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                  <div className="flex items-center gap-3">
                    <Clock className="w-6 h-6 text-brand-gold" />
                    <div>
                      <h2 className="text-xl md:text-2xl font-heading text-white">Select Time Slot</h2>
                      <p className="text-xs md:text-sm text-gray-400">
                        Available slots for {selectedDate ? formatDate(selectedDate) : ''}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setStep(3)}>
                    Change Date
                  </Button>
                </div>

                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <LoadingSkeleton variant="card" count={5} />
                  </div>
                ) : slots.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-gray-800 rounded-xl">
                    <Clock className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <h3 className="text-lg font-heading text-gray-300 mb-1">No Slots Found</h3>
                    <p className="text-sm text-gray-500 mb-4">No time slots are configured for this date.</p>
                    <Button variant="secondary" size="sm" onClick={() => setStep(3)}>
                      Choose Another Date
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {slots.map((slot) => {
                      const isAvailable = slot.status === 'AVAILABLE';
                      const isSelected = selectedSlot === slot.id;

                      return (
                        <div
                          key={slot.id}
                          onClick={() => {
                            if (isAvailable) {
                              selectSlot(slot.id);
                              goNext();
                            }
                          }}
                          className={`p-5 rounded-xl border-2 transition-all flex flex-col justify-between ${
                            isSelected
                              ? 'border-brand-gold bg-brand-gold/10'
                              : isAvailable
                              ? 'border-gray-800 bg-brand-darker hover:border-brand-gold/50 cursor-pointer'
                              : 'border-gray-900 bg-gray-950/50 opacity-50 cursor-not-allowed'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-base font-bold text-white">
                              {formatTime12h(slot.startTime)} – {formatTime12h(slot.endTime)}
                            </span>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-gray-800">
                            <span
                              className={`text-xs px-2 py-0.5 rounded font-semibold ${
                                isAvailable
                                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                  : slot.status === 'HELD' || slot.status === 'PAYMENT_PENDING'
                                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
                              }`}
                            >
                              {slot.status}
                            </span>
                            {isAvailable && (
                              <span className="text-xs text-brand-gold flex items-center gap-1">
                                Select <ArrowRight className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 5: Select Package */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
                  <Gift className="w-6 h-6 text-brand-gold" />
                  <div>
                    <h2 className="text-xl md:text-2xl font-heading text-white">Select Experience Package</h2>
                    <p className="text-xs md:text-sm text-gray-400">Choose the package tailored for {currentOccasionObj?.name}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {packages.map((pkg) => {
                    const isSelected = selectedPackage === pkg.id;
                    const parsedFeatures: string[] = Array.isArray(pkg.features)
                      ? pkg.features
                      : typeof pkg.features === 'string'
                      ? JSON.parse(pkg.features || '[]')
                      : [];

                    return (
                      <div
                        key={pkg.id}
                        onClick={() => {
                          selectPackage(pkg.id);
                          goNext();
                        }}
                        className={`cursor-pointer rounded-xl p-6 border-2 transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'border-brand-gold bg-brand-gold/10'
                            : 'border-gray-800 bg-brand-darker hover:border-brand-gold/50'
                        }`}
                      >
                        <div>
                          <h3 className="text-xl font-heading text-white mb-1">{pkg.name}</h3>
                          <div className="flex items-baseline gap-2 mb-4">
                            <span className="text-2xl font-heading font-bold text-brand-gold">
                              {formatCurrency(pkg.price)}
                            </span>
                            <span className="text-xs text-gray-400">/ {pkg.durationMinutes} Mins</span>
                          </div>

                          <p className="text-xs text-gray-400 mb-4">{pkg.description}</p>

                          <div className="space-y-2 mb-6">
                            {parsedFeatures.map((f, i) => (
                              <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                                <Check className="w-3.5 h-3.5 text-brand-gold flex-shrink-0" />
                                <span>{f}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Button variant={isSelected ? 'primary' : 'secondary'} size="sm" className="w-full">
                          {isSelected ? 'Selected' : 'Select Package'}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 6: Select Add-ons */}
            {currentStep === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                  <div className="flex items-center gap-3">
                    <PlusCircle className="w-6 h-6 text-brand-gold" />
                    <div>
                      <h2 className="text-xl md:text-2xl font-heading text-white">Enhance Your Celebration</h2>
                      <p className="text-xs md:text-sm text-gray-400">Optional cakes, decorations, and special surprises</p>
                    </div>
                  </div>
                  <span className="text-xs text-brand-gold font-medium">
                    {selectedAddons.length} Selected
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {addons.map((addon) => {
                    const isSelected = selectedAddons.includes(addon.id);

                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'border-brand-gold bg-brand-gold/10'
                            : 'border-gray-800 bg-brand-darker hover:border-gray-700'
                        }`}
                      >
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold text-white">{addon.name}</h4>
                          <p className="text-xs text-gray-400">{addon.description}</p>
                          <span className="text-sm font-heading text-brand-gold font-bold">
                            {formatCurrency(addon.price)}
                          </span>
                        </div>

                        <div
                          className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors flex-shrink-0 ${
                            isSelected
                              ? 'bg-brand-gold border-brand-gold text-brand-dark'
                              : 'border-gray-700'
                          }`}
                        >
                          {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {currentPackageObj && (
                  <div className="mt-6 pt-4 border-t border-gray-800">
                    <PriceBreakdown
                      packagePrice={currentPackageObj.price}
                      addons={selectedAddonObjs.map((a) => ({ name: a.name, price: a.price }))}
                      taxPercent={18}
                    />
                  </div>
                )}

                <div className="flex justify-end pt-4 border-t border-gray-800">
                  <Button variant="primary" onClick={goNext}>
                    Continue to Details <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 7: Customer Details & Booking Summary */}
            {currentStep === 7 && (
              <motion.div
                key="step7"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
                  <User className="w-6 h-6 text-brand-gold" />
                  <div>
                    <h2 className="text-xl md:text-2xl font-heading text-white">Review & Customer Details</h2>
                    <p className="text-xs md:text-sm text-gray-400">Confirm your experience summary and contact details</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left: Customer Form */}
                  <form onSubmit={handleDetailsSubmit} className="lg:col-span-7 space-y-4">
                    <h3 className="text-lg font-heading text-brand-gold mb-2">Guest Information</h3>

                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full bg-brand-darker border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-gold transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">Mobile Number (WhatsApp) *</label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. 9876543210"
                          className="w-full bg-brand-darker border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-gold transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. rahul@example.com"
                          className="w-full bg-brand-darker border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-gold transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
                        Guest Count (Max {currentTheatreObj?.capacity || 10})
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={currentTheatreObj?.capacity || 10}
                        value={guestCount}
                        onChange={(e) => setGuestCount(parseInt(e.target.value) || 1)}
                        className="w-full bg-brand-darker border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-gold transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Special Requests (Optional)</label>
                      <textarea
                        rows={2}
                        value={specialRequest}
                        onChange={(e) => setSpecialRequest(e.target.value)}
                        placeholder="Any movie preferences, setup customization, or surprise hints..."
                        className="w-full bg-brand-darker border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold transition-colors"
                      />
                    </div>

                    {/* Payment Options Selection (Admin Configurable) */}
                    <div className="pt-2 border-t border-gray-800/80">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-brand-gold mb-2.5">
                        Choose Payment Mode
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {allowAdvance && (
                          <div
                            onClick={() => setPaymentType('ADVANCE')}
                            className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                              paymentType === 'ADVANCE'
                                ? 'border-brand-gold bg-brand-gold/10'
                                : 'border-gray-800 bg-brand-darker hover:border-gray-700'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-heading text-sm text-white font-semibold flex items-center gap-1.5">
                                <Banknote className="w-4 h-4 text-brand-gold" /> Pay Advance Now
                              </span>
                              <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                  paymentType === 'ADVANCE' ? 'border-brand-gold bg-brand-gold' : 'border-gray-600'
                                }`}
                              >
                                {paymentType === 'ADVANCE' && <div className="w-2 h-2 rounded-full bg-brand-dark" />}
                              </div>
                            </div>
                            <p className="text-xs text-brand-gold font-bold">
                              Pay {formatCurrency(computedAdvance)} online
                            </p>
                            <p className="text-[11px] text-gray-400 mt-0.5">
                              Pay remaining {formatCurrency(computedRemaining)} at theatre
                            </p>
                          </div>
                        )}

                        <div
                          onClick={() => setPaymentType('FULL')}
                          className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                            paymentType === 'FULL'
                              ? 'border-brand-gold bg-brand-gold/10'
                              : 'border-gray-800 bg-brand-darker hover:border-gray-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-heading text-sm text-white font-semibold flex items-center gap-1.5">
                              <CreditCard className="w-4 h-4 text-brand-gold" /> Pay Full Online
                            </span>
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                paymentType === 'FULL' ? 'border-brand-gold bg-brand-gold' : 'border-gray-600'
                              }`}
                            >
                              {paymentType === 'FULL' && <div className="w-2 h-2 rounded-full bg-brand-dark" />}
                            </div>
                          </div>
                          <p className="text-xs text-green-400 font-bold">
                            Pay {formatCurrency(finalTotal)} (100%)
                          </p>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            Zero balance due on arrival
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Discount Coupon Code */}
                    <div className="pt-2 border-t border-gray-800/80">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5 text-brand-gold" /> Have a Promo Code?
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase().replace(/\s+/g, ''))}
                          placeholder="e.g. SKYLITE10, WELCOME20"
                          className="flex-grow bg-brand-darker border border-gray-800 rounded-lg px-3 py-2 text-xs uppercase font-mono font-semibold text-white tracking-wider focus:outline-none focus:border-brand-gold"
                        />
                        <Button type="button" variant="secondary" size="sm" onClick={() => handleApplyCoupon()}>
                          Apply
                        </Button>
                      </div>
                      {appliedCoupon && (
                        <div className="mt-2 flex items-center justify-between p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs">
                          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                            <Check className="w-3.5 h-3.5" />
                            <span>Coupon <strong>{appliedCoupon}</strong> active ({formatCurrency(couponDiscount)} saved)</span>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveCoupon}
                            className="text-rose-400 hover:text-rose-300 text-[11px] underline font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="pt-4">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        loading={submitting}
                        className="w-full font-heading text-lg py-4"
                      >
                        {paymentType === 'ADVANCE'
                          ? `Pay Advance ${formatCurrency(computedAdvance)} & Hold Slot`
                          : `Pay Full ${formatCurrency(finalTotal)} & Hold Slot`}
                      </Button>
                      <p className="text-[11px] text-gray-500 text-center mt-2 flex items-center justify-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                        Slots are held securely for 10 minutes upon proceeding
                      </p>
                    </div>
                  </form>

                  {/* Right: Booking Summary Card */}
                  <div className="lg:col-span-5 bg-brand-darker/80 border border-gray-800 rounded-xl p-6 space-y-4">
                    <h3 className="text-lg font-heading text-brand-gold border-b border-gray-800 pb-2">
                      Booking Summary
                    </h3>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Occasion</span>
                        <span className="text-white font-medium">{currentOccasionObj?.name || '—'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Theatre</span>
                        <span className="text-white font-medium">{currentTheatreObj?.name || '—'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Date</span>
                        <span className="text-white font-medium">
                          {selectedDate ? formatDate(selectedDate) : '—'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Time Slot</span>
                        <span className="text-white font-medium">
                          {currentSlotObj
                            ? `${formatTime12h(currentSlotObj.startTime)} - ${formatTime12h(currentSlotObj.endTime)}`
                            : '—'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Package</span>
                        <span className="text-white font-medium">{currentPackageObj?.name || '—'}</span>
                      </div>

                      {selectedAddonObjs.length > 0 && (
                        <div className="pt-2 border-t border-gray-800">
                          <span className="text-gray-400 text-xs block mb-1">Add-ons:</span>
                          {selectedAddonObjs.map((a) => (
                            <div key={a.id} className="flex justify-between text-xs py-0.5">
                              <span className="text-gray-300">• {a.name}</span>
                              <span className="text-gray-300">{formatCurrency(a.price)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-gray-800">
                      <PriceBreakdown
                        packagePrice={currentPackageObj?.price || 0}
                        addons={selectedAddonObjs.map((a) => ({ name: a.name, price: a.price }))}
                        taxPercent={18}
                        discount={couponDiscount}
                        paymentType={paymentType}
                        advanceAmount={computedAdvance}
                        remainingAmount={computedRemaining}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation bar at bottom */}
          {currentStep < 7 && (
            <div className="flex justify-between items-center pt-8 mt-8 border-t border-gray-800">
              <Button
                variant="ghost"
                onClick={goBack}
                disabled={currentStep === 1}
                className="flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>

              <Button
                variant="primary"
                onClick={goNext}
                disabled={!canGoNext()}
                className="flex items-center gap-1"
              >
                Next <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};