import * as SecureStore from 'expo-secure-store';
import { AppState, type AppStateStatus } from 'react-native';
import { createContext, useCallback, useEffect, useMemo, useRef, useState, type PropsWithChildren } from 'react';
import { authConfig, type AuthSession, type AuthStep } from '../constants/auth';
import { useOverlay } from '../hooks/useOverlay';

export type AuthContextValue = {
  isRestoring: boolean;
  session: AuthSession | null;
  step: AuthStep;
  demoOtp: string | null;
  requestOtp: (phoneNumber: string) => boolean;
  verifyOtp: (otp: string) => Promise<boolean>;
  resetAuthFlow: () => void;
  signOut: () => Promise<boolean>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const overlay = useOverlay();
  const overlayRef = useRef(overlay);
  overlayRef.current = overlay;

  const [isRestoring, setIsRestoring] = useState(true);
  const [session, setSession] = useState<AuthSession | null>(null);
  const sessionRef = useRef<AuthSession | null>(null);
  const [step, setStep] = useState<AuthStep>('phone');
  const [demoOtp, setDemoOtp] = useState<string | null>(null);

  const updateSession = useCallback((next: AuthSession | null) => {
    sessionRef.current = next;
    setSession(next);
  }, []);

  const resetAuthFlow = useCallback(() => {
    setStep('phone');
    setDemoOtp(null);
  }, []);

  const expireSession = useCallback(async () => {
    updateSession(null);
    resetAuthFlow();
    try {
      await SecureStore.deleteItemAsync(authConfig.secureStoreKey);
    } catch {
      // The expired timestamp remains invalid even if native cleanup fails.
    }
    overlayRef.current.toast({ message: 'Your demo session expired. Please sign in again.', tone: 'info' });
  }, [resetAuthFlow, updateSession]);

  useEffect(() => {
    let mounted = true;

    const restoreSession = async () => {
      try {
        const available = await SecureStore.isAvailableAsync();
        if (!available) throw new Error('SecureStore is unavailable on this device.');
        const stored = await SecureStore.getItemAsync(authConfig.secureStoreKey);
        if (!stored) return;

        const parsed: unknown = JSON.parse(stored);
        if (
          typeof parsed === 'object' && parsed !== null &&
          'createdAt' in parsed && typeof parsed.createdAt === 'number' &&
          'expiresAt' in parsed && typeof parsed.expiresAt === 'number' &&
          parsed.expiresAt > Date.now()
        ) {
          const restored: AuthSession = {
            createdAt: parsed.createdAt,
            expiresAt: parsed.expiresAt,
            kind: 'nonProductionDemo',
          };
          if (mounted) updateSession(restored);
        } else {
          await SecureStore.deleteItemAsync(authConfig.secureStoreKey);
          if (mounted) {
            overlayRef.current.toast({ message: 'Your previous demo session expired. Please sign in again.', tone: 'info' });
          }
        }
      } catch {
        if (mounted) {
          overlayRef.current.alert({
            title: 'Could not restore session',
            message: 'Saved sign-in could not be checked securely. You can try signing in again; this prototype does not contact a service.',
          });
        }
      } finally {
        if (mounted) setIsRestoring(false);
      }
    };

    void restoreSession();
    return () => { mounted = false; };
  }, [updateSession]);

  useEffect(() => {
    if (!session) return;
    const remaining = session.expiresAt - Date.now();
    if (remaining <= 0) {
      void expireSession();
      return;
    }
    const timeout = setTimeout(() => { void expireSession(); }, remaining);
    return () => clearTimeout(timeout);
  }, [expireSession, session]);

  useEffect(() => {
    const onAppStateChange = (state: AppStateStatus) => {
      const current = sessionRef.current;
      if (state === 'active' && current && current.expiresAt <= Date.now()) void expireSession();
    };
    const subscription = AppState.addEventListener('change', onAppStateChange);
    return () => subscription.remove();
  }, [expireSession]);

  const requestOtp = useCallback((phoneNumber: string) => {
    const normalized = phoneNumber.replace(/\D/g, '');
    if (normalized !== authConfig.demoEligiblePhone) {
      overlayRef.current.alert({
        title: 'You’re not a CelcomDigi user',
        message: 'This local demo only accepts the synthetic test number shown on the login screen. No real membership check is performed.',
      });
      return false;
    }

    const generatedOtp = Math.floor(Math.random() * (10 ** authConfig.otpLength))
      .toString()
      .padStart(authConfig.otpLength, '0');
    setDemoOtp(generatedOtp);
    setStep('otp');
    overlayRef.current.toast({ message: 'Demo code generated on this device; no SMS was sent.', tone: 'info' });
    return true;
  }, []);

  const verifyOtp = useCallback(async (otp: string) => {
    if (!demoOtp || otp !== demoOtp) {
      overlayRef.current.alert({ title: 'Incorrect code', message: 'Check the on-screen demo code and try again.' });
      return false;
    }

    const createdAt = Date.now();
    const nextSession: AuthSession = {
      createdAt,
      expiresAt: createdAt + authConfig.sessionDurationMs,
      kind: 'nonProductionDemo',
    };

    try {
      if (!(await SecureStore.isAvailableAsync())) throw new Error('SecureStore is unavailable.');
      await SecureStore.setItemAsync(authConfig.secureStoreKey, JSON.stringify(nextSession));
      updateSession(nextSession);
      resetAuthFlow();
      overlayRef.current.toast({ message: 'Demo sign-in complete. Session lasts one hour on this device.', tone: 'success' });
      return true;
    } catch {
      overlayRef.current.alert({
        title: 'Could not save session',
        message: 'Secure session storage failed, so sign-in was not completed. Please retry.',
      });
      return false;
    }
  }, [demoOtp, resetAuthFlow, updateSession]);

  const signOut = useCallback(async () => {
    try {
      await SecureStore.deleteItemAsync(authConfig.secureStoreKey);
      updateSession(null);
      resetAuthFlow();
      overlayRef.current.toast({ message: 'You have signed out of the local demo.', tone: 'success' });
      return true;
    } catch {
      overlayRef.current.alert({
        title: 'Could not sign out securely',
        message: 'The saved session could not be removed. You are still signed in; please retry.',
      });
      return false;
    }
  }, [resetAuthFlow, updateSession]);

  const value = useMemo<AuthContextValue>(() => ({
    isRestoring,
    session,
    step,
    demoOtp,
    requestOtp,
    verifyOtp,
    resetAuthFlow,
    signOut,
  }), [demoOtp, isRestoring, requestOtp, resetAuthFlow, session, signOut, step, verifyOtp]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
