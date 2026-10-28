import { useCallback, useEffect, useMemo, useRef, useState, type PropsWithChildren } from 'react';
import {
  overlayTiming,
  type OverlayConfig,
  type OverlayInstance,
  type ToastInstance,
  type ToastOptions,
} from '../constants/overlay';
import { OverlayContext, type OverlayContextValue } from './overlayContext';

export function OverlayProvider({ children }: PropsWithChildren) {
  const [overlay, setOverlay] = useState<OverlayInstance | null>(null);
  const [toastState, setToastState] = useState<ToastInstance | null>(null);
  const overlayRef = useRef<OverlayInstance | null>(null);
  const toastRef = useRef<ToastInstance | null>(null);
  const nextId = useRef(0);
  const nextToastId = useRef(0);
  const exitCallback = useRef<(() => void) | undefined>(undefined);
  const pendingOverlay = useRef<OverlayConfig | null>(null);
  const pendingToast = useRef<ToastOptions | null>(null);

  const updateOverlay = useCallback((next: OverlayInstance | null) => {
    overlayRef.current = next;
    setOverlay(next);
  }, []);

  const updateToast = useCallback((next: ToastInstance | null) => {
    toastRef.current = next;
    setToastState(next);
  }, []);

  const requestDismiss = useCallback((onComplete?: () => void) => {
    const current = overlayRef.current;
    if (!current || current.phase === 'closing') return;

    exitCallback.current = onComplete;
    updateOverlay({ ...current, phase: 'closing' });
  }, [updateOverlay]);

  const showOverlay = useCallback((config: OverlayConfig) => {
    const current = overlayRef.current;
    if (current) {
      pendingOverlay.current = config;
      requestDismiss();
      return;
    }

    const next = { ...config, id: ++nextId.current, phase: 'open' as const } as OverlayInstance;
    updateOverlay(next);
  }, [requestDismiss, updateOverlay]);

  const completeOverlayExit = useCallback((id: number) => {
    const current = overlayRef.current;
    if (!current || current.id !== id || current.phase !== 'closing') return;

    updateOverlay(null);
    const callback = exitCallback.current;
    const pending = pendingOverlay.current;
    exitCallback.current = undefined;
    pendingOverlay.current = null;

    try {
      callback?.();
    } finally {
      if (pending && !overlayRef.current) showOverlay(pending);
    }
  }, [showOverlay, updateOverlay]);

  const dismissToast = useCallback((id: number) => {
    const current = toastRef.current;
    if (!current || current.id !== id || current.phase === 'closing') return;
    updateToast({ ...current, phase: 'closing' });
  }, [updateToast]);

  const showToast = useCallback((options: ToastOptions) => {
    const current = toastRef.current;
    if (current) {
      pendingToast.current = options;
      dismissToast(current.id);
      return;
    }

    updateToast({
      ...options,
      id: ++nextToastId.current,
      phase: 'open',
      tone: options.tone ?? 'info',
    });
  }, [dismissToast, updateToast]);

  const completeToastExit = useCallback((id: number) => {
    const current = toastRef.current;
    if (!current || current.id !== id || current.phase !== 'closing') return;

    updateToast(null);
    const pending = pendingToast.current;
    pendingToast.current = null;
    if (pending) showToast(pending);
  }, [showToast, updateToast]);

  useEffect(() => {
    if (!overlay || overlay.kind !== 'loader' || overlay.phase !== 'open' || !overlay.durationMs) {
      return;
    }

    const timer = setTimeout(() => requestDismiss(), overlay.durationMs);
    return () => clearTimeout(timer);
  }, [overlay, requestDismiss]);

  useEffect(() => {
    if (!toastState || toastState.phase !== 'open') return;

    const timer = setTimeout(
      () => dismissToast(toastState.id),
      toastState.durationMs ?? overlayTiming.toastDurationMs,
    );
    return () => clearTimeout(timer);
  }, [dismissToast, toastState]);

  const value = useMemo<OverlayContextValue>(() => ({
    overlay,
    toastState,
    isOverlayActive: overlay !== null,
    alert: (options) => showOverlay({ kind: 'alert', ...options }),
    confirm: (options) => showOverlay({ kind: 'confirm', ...options }),
    confirmDestructive: (options) => showOverlay({ kind: 'destructiveConfirm', ...options }),
    modal: (options) => showOverlay({ kind: 'modal', ...options }),
    sheet: (options) => showOverlay({ kind: 'sheet', ...options }),
    loader: (options = {}) => showOverlay({ kind: 'loader', ...options }),
    dismiss: requestDismiss,
    toast: showToast,
    completeOverlayExit,
    dismissToast,
    completeToastExit,
  }), [
    completeOverlayExit,
    completeToastExit,
    dismissToast,
    overlay,
    requestDismiss,
    showOverlay,
    showToast,
    toastState,
  ]);

  return <OverlayContext.Provider value={value}>{children}</OverlayContext.Provider>;
}
