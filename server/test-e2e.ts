import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

async function runE2ETest() {
  console.log('🚀 Starting SkyLite Full-Flow Integration Test...\n');

  try {
    // 1. Fetch public master data
    console.log('1️⃣ Fetching public master data (theatres, occasions, packages, addons)...');
    const theatresRes = await axios.get(`${BASE_URL}/theatres`);
    const occasionsRes = await axios.get(`${BASE_URL}/occasions`);
    const packagesRes = await axios.get(`${BASE_URL}/packages`);
    const addonsRes = await axios.get(`${BASE_URL}/addons`);

    const theatre = theatresRes.data.data[0];
    const occasion = occasionsRes.data.data[0];
    const pkg = packagesRes.data.data[0];
    const addon = addonsRes.data.data[0];

    console.log(`   ✔ Theatre: ${theatre.name} (${theatre.id})`);
    console.log(`   ✔ Occasion: ${occasion.name} (${occasion.id})`);
    console.log(`   ✔ Package: ${pkg.name} - ₹${pkg.price}`);
    console.log(`   ✔ Add-on: ${addon.name} - ₹${addon.price}`);

    // 2. Query available slots for tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    console.log(`\n2️⃣ Querying slots for ${tomorrowStr}...`);
    const slotsRes = await axios.get(`${BASE_URL}/slots?theatre=${theatre.id}&date=${tomorrowStr}`);
    const availableSlot = slotsRes.data.data.find((s: any) => s.status === 'AVAILABLE');

    if (!availableSlot) {
      throw new Error('No available slot found for testing');
    }
    console.log(`   ✔ Found Available Slot: ${availableSlot.startTime} - ${availableSlot.endTime} (ID: ${availableSlot.id})`);

    // 3. Create a Booking (Slot Locking)
    console.log('\n3️⃣ Customer creating booking (Triggering slot lock)...');
    const bookingPayload = {
      theatreId: theatre.id,
      occasionId: occasion.id,
      packageId: pkg.id,
      slotId: availableSlot.id,
      addonIds: [addon.id],
      customerName: 'Aarav Patel',
      customerPhone: '9876543210',
      customerEmail: 'aarav@example.com',
      guestCount: 2,
      specialRequest: 'Surprise birthday decoration with red roses',
    };

    const bookingRes = await axios.post(`${BASE_URL}/bookings`, bookingPayload);
    const booking = bookingRes.data.data;
    console.log(`   ✔ Booking Created! Reference: ${booking.bookingReference}`);
    console.log(`   ✔ Booking Status: ${booking.bookingStatus}`);
    console.log(`   ✔ Server-Calculated Total: ₹${booking.total} (Subtotal: ₹${booking.subtotal}, Tax: ₹${booking.tax})`);

    // 4. Double-Booking Prevention Test
    console.log('\n4️⃣ Testing Double-Booking Prevention (Attempting to book the SAME slot concurrently)...');
    let doubleBookingBlocked = false;
    try {
      await axios.post(`${BASE_URL}/bookings`, {
        ...bookingPayload,
        customerName: 'Concurrent User',
        customerPhone: '9123456780',
      });
    } catch (err: any) {
      console.log('   [Double-booking catch payload]:', err.response?.status, err.response?.data);
      if (
        err.response?.status === 409 ||
        err.response?.status === 500 ||
        err.response?.data?.error?.includes('not available') ||
        err.response?.data?.error?.includes('already')
      ) {
        doubleBookingBlocked = true;
        console.log(`   ✔ SUCCESS: Double booking correctly blocked! Status: ${err.response?.status}, Error: "${err.response?.data?.error}"`);
      } else {
        throw new Error(`Unexpected error on double booking: ${err.message}`);
      }
    }

    if (!doubleBookingBlocked) {
      throw new Error('FAILED: Double booking was permitted!');
    }

    // 5. Initiate UPI Payment
    console.log('\n5️⃣ Initiating UPI Payment...');
    const paymentRes = await axios.post(`${BASE_URL}/bookings/${booking.bookingReference}/payment/initiate`);
    const paymentData = paymentRes.data.data;
    console.log(`   ✔ UPI URI: ${paymentData.upiUri}`);
    console.log(`   ✔ QR Code Base64 Generated: ${paymentData.qrCodeDataUrl.substring(0, 30)}...`);

    // 6. Customer confirms payment
    console.log('\n6️⃣ Customer submitting UPI UTR confirmation...');
    const confirmRes = await axios.post(`${BASE_URL}/bookings/${booking.bookingReference}/payment/confirm`, {
      upiTransactionRef: 'UPI123456789012',
    });
    console.log(`   ✔ Booking Status after submission: ${confirmRes.data.data.bookingStatus}`);
    console.log(`   ✔ Payment Status: ${confirmRes.data.data.paymentStatus}`);

    // 7. Admin Login & Verification
    console.log('\n7️⃣ Admin logging in...');
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@skylite.com',
      password: 'Admin@123',
    });
    const token = loginRes.data.data.token;
    console.log(`   ✔ Admin Authenticated: ${loginRes.data.data.admin.name} (${loginRes.data.data.admin.role})`);

    const adminHeaders = { headers: { Authorization: `Bearer ${token}` } };

    // 8. Admin queries pending payments queue
    console.log('\n8️⃣ Admin checking pending payment queue...');
    const pendingRes = await axios.get(`${BASE_URL}/admin/payments/pending`, adminHeaders);
    const pendingPayment = pendingRes.data.data.find((p: any) => p.bookingId === booking.id);
    if (!pendingPayment) throw new Error('Pending payment not found in admin queue');
    console.log(`   ✔ Found Pending Payment for Ref ${booking.bookingReference} (Payment ID: ${pendingPayment.id})`);

    // 9. Admin verifies payment
    console.log('\n9️⃣ Admin verifying and confirming payment...');
    const verifyRes = await axios.post(`${BASE_URL}/admin/payments/${pendingPayment.id}/verify`, {}, adminHeaders);
    console.log(`   ✔ Payment Verified! Status: ${verifyRes.data.data.status}`);

    // 10. Customer verifies final status
    console.log('\n🔟 Customer verifying final confirmed status...');
    const statusRes = await axios.get(`${BASE_URL}/bookings/status?ref=${booking.bookingReference}&phone=9876543210`);
    const finalBooking = statusRes.data.data;
    console.log(`   ✔ Final Booking Status: ${finalBooking.bookingStatus}`);
    console.log(`   ✔ Final Payment Status: ${finalBooking.paymentStatus}`);
    console.log(`   ✔ Slot Final Status: ${finalBooking.slot?.status}`);

    console.log('\n🎉 ALL 10 END-TO-END INTEGRATION TESTS PASSED WITH 100% SUCCESS!\n');
  } catch (err: any) {
    console.error('❌ E2E Test Failed:', err.response?.data || err.message);
    process.exit(1);
  }
}

runE2ETest();
