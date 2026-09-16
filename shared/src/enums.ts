// ============================================================
// SkyLite Private Theatre — Shared Enums
// ============================================================

export enum BookingStatus {
  DRAFT = 'DRAFT',
  HELD = 'HELD',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  PAYMENT_VERIFICATION = 'PAYMENT_VERIFICATION',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  RESCHEDULED = 'RESCHEDULED',
  COMPLETED = 'COMPLETED',
  NO_SHOW = 'NO_SHOW',
  EXPIRED = 'EXPIRED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  INITIATED = 'INITIATED',
  CUSTOMER_MARKED_PAID = 'CUSTOMER_MARKED_PAID',
  UNDER_VERIFICATION = 'UNDER_VERIFICATION',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REJECTED = 'REJECTED',
  REFUNDED = 'REFUNDED',
}

export enum SlotStatus {
  AVAILABLE = 'AVAILABLE',
  HELD = 'HELD',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  PAYMENT_VERIFICATION = 'PAYMENT_VERIFICATION',
  BOOKED = 'BOOKED',
  BLOCKED = 'BLOCKED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  NO_SHOW = 'NO_SHOW',
  EXPIRED = 'EXPIRED',
}

export enum AdminRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
}

export enum TheatreStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE',
}

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  BLOCK = 'BLOCK',
  UNBLOCK = 'UNBLOCK',
  CANCEL = 'CANCEL',
  RESCHEDULE = 'RESCHEDULE',
  VERIFY_PAYMENT = 'VERIFY_PAYMENT',
  REJECT_PAYMENT = 'REJECT_PAYMENT',
  COLLECT_BALANCE = 'COLLECT_BALANCE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

export enum PaymentType {
  FULL = 'FULL',
  ADVANCE = 'ADVANCE',
  REMAINING_BALANCE = 'REMAINING_BALANCE',
}

export enum PaymentMethod {
  UPI = 'UPI',
  CASH = 'CASH',
  CARD = 'CARD',
  OFFLINE_UPI = 'OFFLINE_UPI',
}

export enum RemainingPaymentStatus {
  PENDING = 'PENDING',
  PAID_OFFLINE = 'PAID_OFFLINE',
  PAID_ONLINE = 'PAID_ONLINE',
  WAIVED = 'WAIVED',
}

export enum BookingSource {
  ONLINE = 'ONLINE',
  OFFLINE_WALKIN = 'OFFLINE_WALKIN',
}

export enum AdvanceCalculationType {
  FIXED = 'FIXED',
  PERCENTAGE = 'PERCENTAGE',
}

