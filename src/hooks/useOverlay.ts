import { useContext, useMemo } from 'react';
import { OverlayContext, type OverlayApi } from '../contexts/overlayContext';

export function useOverlay(): OverlayApi {
  const context = useContext(OverlayContext);

  if (!context) {
    throw new Error('useOverlay must be used within an OverlayProvider.');
  }

  return useMemo(() => ({
    isOverlayActive: context.isOverlayActive,
    alert: context.alert,
    confirm: context.confirm,
    confirmDestructive: context.confirmDestructive,
    modal: context.modal,
    sheet: context.sheet,
    loader: context.loader,
    dismiss: context.dismiss,
    toast: context.toast,
  }), [context]);
}
