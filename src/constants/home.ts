export const homeDemoAccount = {
  label: 'DEMO POSTPAID',
  planName: 'Demo 5G plan',
  dataRemaining: '12.4 GB',
  dataTotal: '20 GB',
  dataUsedRatio: 0.38,
  renewalLabel: 'Data resets in 14 days',
  totalDue: 'RM 88.00',
  dueDate: '15 Nov 2026',
} as const;

export const homeQuickActionIds = ['chat', 'profile', 'usage', 'payments'] as const;
export type HomeQuickActionId = (typeof homeQuickActionIds)[number];

export const homeMotion = {
  sectionStaggerMs: 70,
} as const;
