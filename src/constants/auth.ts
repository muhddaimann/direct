export const authConfig = {
  sessionDurationMs: 60 * 60 * 1000,
  secureStoreKey: 'direct.auth.mockSession',
  // Deliberately invalid, synthetic input for local prototype testing only.
  demoEligiblePhone: '0000000000',
  accent: '#0057B8',
  icon: 'shield-account-outline',
  otpLength: 6,
} as const;

export type AuthSession = {
  createdAt: number;
  expiresAt: number;
  kind: 'nonProductionDemo';
};

export type AuthStep = 'phone' | 'otp';
