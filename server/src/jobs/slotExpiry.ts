import prisma from '../config/database';

export const startSlotExpiryJob = () => {
  setInterval(async () => {
    try {
      const now = new Date();
      const expiredSlots = await prisma.slot.findMany({
        where: {
          status: 'HELD',
          holdExpiresAt: {
            lt: now
          }
        }
      });

      if (expiredSlots.length > 0) {
        const result = await prisma.slot.updateMany({
          where: {
            id: {
              in: expiredSlots.map(s => s.id)
            }
          },
          data: {
            status: 'AVAILABLE',
            holdExpiresAt: null
          }
        });
        
        // Optionally update associated bookings to CANCELLED or FAILED
        for (const slot of expiredSlots) {
            await prisma.booking.updateMany({
                where: { slotId: slot.id, bookingStatus: 'DRAFT' },
                data: { bookingStatus: 'CANCELLED' }
            });
        }
        
        console.log(`Released ${result.count} expired slots.`);
      }
    } catch (error) {
      console.error('Error in slot expiry job:', error);
    }
  }, 60000); // Run every 60 seconds
};
