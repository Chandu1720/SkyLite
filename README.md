# 🎬 SkyLite — Private Theatre Booking & Event Management Platform

SkyLite is a full-stack private theatre and celebration booking platform built with **React 19**, **TypeScript**, **Node.js/Express**, and **Prisma ORM**. It provides a luxury cinema booking experience for customers and an admin operations portal.

---

## ✨ Features

### 🌟 Customer Experience
- **Luxury Cinema Aesthetic**: Dark gold glassmorphism UI with smooth animations powered by Framer Motion.
- **8-Step Booking Flow**:
  1. Occasion Selection (Birthday, Anniversary, Proposal, Date Night, etc.)
  2. Theatre Hall Selection
  3. Interactive 30-Day Date Picker
  4. Real-time Slot Availability Grid with Hold Timers
  5. Experience Packages with feature comparisons
  6. Custom Add-ons (Cakes, Balloons, Photography, Extra Hours, Snacks)
  7. Customer Details & Dynamic Promo Code Application
  8. Instant UPI Payment (Dynamic QR Code + Mobile Deep Link + Strict UTR Verification)
- **First-Time Visitor Welcome Promo Pop-up**: Luxury modal offering new visitors an exclusive discount code with 1-click auto-apply.
- **Booking Status Lookup**: Instant lookup by Booking Reference (`SKL-YYYYMMDD-XXXXX`) and Phone Number.
- **Live Assistant ChatBot**: Instant customer help for packages, pricing, location, and policies.

---

### 🛡️ Admin & Operational Capabilities
- **Live Metrics Dashboard**: Real-time stats on today's bookings, revenue, available slots, and outstanding balances.
- **Real-Time Payment Verification Alerts**: 15-second polling with a notification banner for payments awaiting UTR verification.
- **Strict 12-Digit UTR Verification & Duplicate Blocker**: Validates Indian banking UTR formats and blocks duplicate submissions.
- **Dynamic Coupon & Promo Code Management**: Full CRUD for Percentage (`%`) and Flat (`₹`) coupons, minimum order subtotal requirements, maximum discount caps, usage limits, and date validity.
- **Custom Slot Generator**: Batch generate slots with configurable opening/closing times, slot durations, buffer/sanitization intervals, and price overrides.
- **Walk-In / Offline Booking Engine**: On-the-spot creation of bookings for walk-in guests with instant receipt generation.
- **Venue Balance Collection**: Record remaining offline payments collected in Cash, Card / POS, or Venue UPI.
- **Financial Analytics & Reporting**: Clear split between Online UPI collections, Offline venue collections, and outstanding dues.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Framer Motion, React Router v7
- **Backend**: Node.js, Express.js, TypeScript, Prisma ORM, Multer, QRCode, JWT, Bcrypt
- **Database**: SQLite (Development) / PostgreSQL compatible
- **Architecture**: Monorepo with npm workspaces (`@skylite/shared`, `@skylite/server`, `@skylite/client`)

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

### 2. Installation
```bash
git clone https://github.com/Chandu1720/SkyLite.git
cd SkyLite
npm install
```

### 3. Database Setup & Seeding
```bash
npm run db:setup
```
*Seeds default admin (`admin@skylite.com` / `Admin@123`), theatre halls, occasions, packages, add-ons, business settings, and slots for the next 30 days.*

### 4. Run Development Servers
```bash
npm run dev
```
- **Customer Web App**: [http://localhost:5173](http://localhost:5173)
- **Admin Portal**: [http://localhost:5173/admin](http://localhost:5173/admin)
- **Backend API**: [http://localhost:3000](http://localhost:3000)

### 5. Production Build
```bash
npm run build
```

---

## 🔑 Default Admin Credentials
- **URL**: `/admin/login`
- **Email**: `admin@skylite.com`
- **Password**: `Admin@123`

---

## 📄 License
This project is private and proprietary.
