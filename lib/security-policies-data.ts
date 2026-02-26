/**
 * Security Policies — password/2FA/session/account lock. Support-friendly for field users (avoid accidental lock).
 */

export type PasswordPolicy = {
  minLength: number
  requireUppercase: boolean
  requireNumber: boolean
  requireSpecial: boolean
  resetFrequencyDays: number | null
}

export type SessionPolicy = {
  timeoutMinutes: number
  singleDeviceLogin: boolean
}

export type LockPolicy = {
  failedAttemptsThreshold: number
  lockoutMinutes: number
}

export const DEFAULT_PASSWORD_POLICY: PasswordPolicy = {
  minLength: 8,
  requireUppercase: true,
  requireNumber: true,
  requireSpecial: false,
  resetFrequencyDays: null,
}

export const DEFAULT_SESSION_POLICY: SessionPolicy = {
  timeoutMinutes: 60,
  singleDeviceLogin: false,
}

export const DEFAULT_LOCK_POLICY: LockPolicy = {
  failedAttemptsThreshold: 5,
  lockoutMinutes: 15,
}
