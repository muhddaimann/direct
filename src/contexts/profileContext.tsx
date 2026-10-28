import { createContext, useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { demoProfile, type EditableProfileDetails, type ProfileDetails } from '../constants/profile';
import { useAuth } from '../hooks/useAuth';
import { useOverlay } from '../hooks/useOverlay';

export type ProfileContextValue = {
  profile: ProfileDetails;
  updateProfile: (changes: EditableProfileDetails) => boolean;
  resetProfile: () => void;
};

export const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: PropsWithChildren) {
  const { session } = useAuth();
  const overlay = useOverlay();
  const [profile, setProfile] = useState<ProfileDetails>(demoProfile);

  const resetProfile = useCallback(() => setProfile(demoProfile), []);

  useEffect(() => {
    // Profile edits are session-only; a new sign-in or sign-out restores fictional defaults.
    resetProfile();
  }, [resetProfile, session?.createdAt]);

  const updateProfile = useCallback((changes: EditableProfileDetails) => {
    const displayName = changes.displayName.trim();
    const email = changes.email.trim();

    if (!displayName) {
      overlay.alert({ title: 'Name required', message: 'Enter a name before saving your profile.' });
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      overlay.alert({ title: 'Check your email', message: 'Enter a valid email address for this local demo profile.' });
      return false;
    }

    setProfile((current) => ({ ...current, displayName, email }));
    overlay.toast({ message: 'Profile updated for this session.', tone: 'success' });
    return true;
  }, [overlay]);

  const value = useMemo(() => ({ profile, updateProfile, resetProfile }), [profile, resetProfile, updateProfile]);
  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}
