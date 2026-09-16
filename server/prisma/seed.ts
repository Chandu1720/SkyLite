import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clear existing data (in correct dependency order)
  await prisma.auditLog.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.bookingAddon.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.slot.deleteMany();
  await prisma.occasionAddon.deleteMany();
  await prisma.occasionPackage.deleteMany();
  await prisma.occasionTheatre.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.addon.deleteMany();
  await prisma.package.deleteMany();
  await prisma.occasion.deleteMany();
  await prisma.theatreImage.deleteMany();
  await prisma.theatre.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.review.deleteMany();

  // Create Admin
  const hashedPassword = await bcrypt.hash('Admin@123', 10);
  await prisma.admin.create({
    data: {
      email: 'admin@skylite.com',
      passwordHash: hashedPassword,
      name: 'Super Admin',
      role: 'ADMIN',
    },
  });

  // Create Theatre
  const theatre = await prisma.theatre.create({
    data: {
      name: 'SkyLite Private Theatre',
      slug: 'skylite-private-theatre',
      description: 'A luxurious private theatre experience for your special moments.',
      capacity: 10,
      location: 'Near Hanuman Temple, Pappannareddy Layout, signal, Garvebhavi Palya, Bengaluru, Karnataka 560068',
      facilities: JSON.stringify(['4K Projector', 'Dolby Atmos', 'Recliners', 'AC', 'Wifi']),
      basePrice: 1999,
      status: 'ACTIVE',
    },
  });

  // Create Occasions
  const occasionsData = [
    { name: 'Birthday', slug: 'birthday', description: 'Celebrate your special day' },
    { name: 'Anniversary', slug: 'anniversary', description: 'Celebrate your love' },
    { name: 'Date Night', slug: 'date-night', description: 'A romantic evening' },
    { name: 'Family Celebration', slug: 'family-celebration', description: 'Quality time with family' },
    { name: 'Movie Night', slug: 'movie-night', description: 'Watch your favorite movies' },
    { name: 'Proposal', slug: 'proposal', description: 'Pop the question in style' },
  ];

  const occasions = [];
  for (const occ of occasionsData) {
    const created = await prisma.occasion.create({ data: occ });
    occasions.push(created);
    
    // Link to theatre
    await prisma.occasionTheatre.create({
      data: {
        occasionId: created.id,
        theatreId: theatre.id
      }
    });
  }

  // Create Packages
  const packagesData = [
    { name: 'Basic Experience', slug: 'basic-experience', description: 'Standard theatre experience', price: 1999, durationMinutes: 120, features: JSON.stringify(['2 hours screening', 'Standard decoration']) },
    { name: 'Birthday Premium', slug: 'birthday-premium', description: 'Premium birthday celebration', price: 2999, durationMinutes: 120, features: JSON.stringify(['2 hours screening', 'Premium balloon decoration', 'Birthday banner']) },
    { name: 'Anniversary Premium', slug: 'anniversary-premium', description: 'Premium anniversary celebration', price: 3499, durationMinutes: 120, features: JSON.stringify(['2 hours screening', 'Rose petal decoration', 'Candle light setup']) },
    { name: 'Luxury Celebration', slug: 'luxury-celebration', description: 'Ultimate luxury experience', price: 4499, durationMinutes: 180, features: JSON.stringify(['3 hours screening', 'Luxury floral decoration', 'Red carpet welcome', 'Welcome drinks']) },
  ];

  const packages = [];
  for (const pkg of packagesData) {
    const created = await prisma.package.create({ data: pkg });
    packages.push(created);
    
    // Link packages to occasions (simplify: link all to all for seed)
    for (const occ of occasions) {
      await prisma.occasionPackage.create({
        data: {
          occasionId: occ.id,
          packageId: created.id
        }
      });
    }
  }

  // Create Add-ons
  const addonsData = [
    { name: 'Cake', description: '1/2 kg Chocolate Truffle', price: 500 },
    { name: 'Bouquet', description: 'Red Roses Bouquet', price: 300 },
    { name: 'Balloon Decoration', description: 'Extra balloon decoration', price: 700 },
    { name: 'Photography', description: 'Professional photographer for 30 mins', price: 1000 },
    { name: 'Extra Hour', description: 'Extend your screening time by 1 hour', price: 800 },
    { name: 'Snacks', description: 'Popcorn and Cold drinks for 2', price: 400 },
  ];

  for (const addon of addonsData) {
    const created = await prisma.addon.create({ data: addon });
    
    for (const occ of occasions) {
      await prisma.occasionAddon.create({
        data: {
          occasionId: occ.id,
          addonId: created.id
        }
      });
    }
  }

  // Create Slots for the next 30 days
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start from start of day
  const timeSlots = [
    { start: '10:00', end: '12:00' },
    { start: '12:30', end: '14:30' },
    { start: '15:00', end: '17:00' },
    { start: '17:30', end: '19:30' },
    { start: '20:00', end: '22:00' }
  ];

  console.log('Generating slots for the next 30 days...');
  for (let i = 1; i <= 30; i++) {
    const slotDate = new Date(today);
    slotDate.setDate(today.getDate() + i);
    
    for (const ts of timeSlots) {
      await prisma.slot.create({
        data: {
          theatreId: theatre.id,
          date: slotDate,
          startTime: ts.start,
          endTime: ts.end,
          status: 'AVAILABLE'
        }
      });
    }
  }

  // Create Settings
  const settingsData = [
    { key: 'business_name', value: 'SkyLite Private Theatre', category: 'General' },
    { key: 'business_phone', value: '+91 9876543210', category: 'Contact' },
    { key: 'business_email', value: 'hello@skylite.com', category: 'Contact' },
    { key: 'whatsapp_number', value: '+91 9876543210', category: 'Contact' },
    { key: 'address', value: 'Near Hanuman Temple, Pappannareddy Layout, signal, Garvebhavi Palya, Bengaluru, Karnataka 560068', category: 'General' },
    { key: 'google_maps_url', value: 'https://maps.google.com', category: 'General' },
    { key: 'upi_id', value: 'skylite@upi', category: 'Payment' },
    { key: 'upi_payee_name', value: 'SkyLite Private Theatre', category: 'Payment' },
    { key: 'opening_time', value: '10:00', category: 'General' },
    { key: 'closing_time', value: '22:00', category: 'General' },
    { key: 'tax_percentage', value: '18', category: 'Payment' },
    { key: 'currency', value: 'INR', category: 'Payment' },
    { key: 'booking_hold_duration', value: '10', category: 'Booking' },
    { key: 'payment_verification_timeout', value: '120', category: 'Payment' },
    { key: 'allow_advance_payment', value: 'true', category: 'Payment' },
    { key: 'advance_payment_type', value: 'PERCENTAGE', category: 'Payment' },
    { key: 'advance_payment_value', value: '30', category: 'Payment' },
    { key: 'allow_full_payment', value: 'true', category: 'Payment' },
    { key: 'allow_pay_at_venue', value: 'true', category: 'Payment' },
  ];

  for (const setting of settingsData) {
    await prisma.setting.create({ data: setting });
  }

  // Create Reviews
  const reviewsData = [
    { customerName: 'Rahul Kumar', rating: 5, comment: 'Amazing experience! The screening quality was top notch and the decorations were beautiful.' },
    { customerName: 'Priya Sharma', rating: 4, comment: 'Great place for a private movie date. Food options could be better.' },
    { customerName: 'Amit Patel', rating: 5, comment: 'Booked it for my wife\'s birthday. She loved the surprise. Very professional staff.' },
    { customerName: 'Neha Singh', rating: 5, comment: 'Perfect ambiance and very clean. The sound system is really good.' },
  ];

  for (const review of reviewsData) {
    await prisma.review.create({ data: review });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
