import QRCode from 'qrcode';

/**
 * Generate a QR code as a base64 data URL from any string input.
 * Used to encode UPI payment URIs for customer scanning.
 */
export const generateQRDataUrl = async (data: string): Promise<string> => {
  try {
    return await QRCode.toDataURL(data, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 300,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });
  } catch (err) {
    console.error('QR Code generation failed:', err);
    throw new Error('Failed to generate QR Code');
  }
};

// Backwards-compatible alias
export const generateQRCode = generateQRDataUrl;
