export const validateEmail = (email: string): boolean => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const re = /^[0-9]{10}$/;
  return re.test(phone);
};

export const validateRequired = (val: any): boolean => {
  return val !== undefined && val !== null && val !== '';
};

export const validatePositiveNumber = (val: any): boolean => {
  return typeof val === 'number' && val > 0;
};

export const validateDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

export const validateGuestCount = (count: number): boolean => {
  return typeof count === 'number' && count > 0 && count <= 50;
};

export const validateUtr = (utr: string): boolean => {
  if (!utr || typeof utr !== 'string') return false;
  const trimmed = utr.trim();
  // Standard 12-digit UPI reference or 12-22 char alphanumeric reference
  return /^[0-9]{12}$/.test(trimmed) || /^[A-Za-z0-9]{12,22}$/.test(trimmed);
};
