export type ProfileDetails = {
  displayName: string;
  email: string;
  accountLabel: string;
};

export type EditableProfileDetails = Pick<ProfileDetails, 'displayName' | 'email'>;

export const profileConfig = {
  icon: 'account-circle-outline',
  accent: '#0057B8',
} as const;

export const demoProfile: ProfileDetails = {
  displayName: 'Demo Member',
  email: 'member@example.invalid',
  accountLabel: 'CelcomDigi demo account',
};
