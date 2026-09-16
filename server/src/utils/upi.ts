/**
 * Build a UPI payment URI.
 * All values are properly URL-encoded via URLSearchParams.
 */
export interface UpiParams {
  payeeVpa: string;
  payeeName: string;
  amount: number;
  transactionRef: string;
  note?: string;
}

export const buildUpiUri = (params: UpiParams): string => {
  const urlParams = new URLSearchParams({
    pa: params.payeeVpa,
    pn: params.payeeName,
    am: params.amount.toFixed(2),
    cu: 'INR',
    tr: params.transactionRef,
    tn: params.note || `SkyLite Booking ${params.transactionRef}`,
  });
  return `upi://pay?${urlParams.toString()}`;
};

// Backwards-compatible alias
export const generateUpiUri = (
  payeeVpa: string,
  payeeName: string,
  amount: number,
  bookingReference: string,
  note: string = 'Booking Payment'
): string => {
  return buildUpiUri({ payeeVpa, payeeName, amount, transactionRef: bookingReference, note });
};
