import prisma from '../config/database';

export const generateBookingReference = async (date: Date): Promise<string> => {
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');

  const lastBooking = await prisma.booking.findFirst({
    where: {
      bookingReference: {
        startsWith: `SKL-${dateStr}`,
      },
    },
    orderBy: {
      bookingReference: 'desc',
    },
  });

  let counter = 1;
  if (lastBooking && lastBooking.bookingReference) {
    const parts = lastBooking.bookingReference.split('-');
    if (parts.length === 3) {
      const lastCounter = parseInt(parts[2], 10);
      if (!isNaN(lastCounter)) {
        counter = lastCounter + 1;
      }
    }
  }

  const counterStr = counter.toString().padStart(5, '0');
  return `SKL-${dateStr}-${counterStr}`;
};
