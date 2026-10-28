import type { ReactNode } from 'react';

export type OverlayPhase = 'open' | 'closing';
export type OverlayTone = 'success' | 'danger' | 'warning' | 'info';

export type OverlayAction = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'danger' | 'secondary';
};

export type AlertOptions = {
  title: string;
  message?: string;
  confirmLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export type ConfirmOptions = {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export type CustomModalOptions = {
  title?: string;
  message?: string;
  content: ReactNode;
  actions?: OverlayAction[];
  onCancel?: () => void;
};

export type BottomSheetOptions = {
  title?: string;
  content: ReactNode;
  onCancel?: () => void;
};

export type LoaderOptions = {
  message?: string;
  durationMs?: number;
};

export type ToastOptions = {
  message: string;
  tone?: OverlayTone;
  durationMs?: number;
};

export type OverlayConfig =
  | ({ kind: 'alert' } & AlertOptions)
  | ({ kind: 'confirm' } & ConfirmOptions)
  | ({ kind: 'destructiveConfirm' } & ConfirmOptions)
  | ({ kind: 'modal' } & CustomModalOptions)
  | ({ kind: 'sheet' } & BottomSheetOptions)
  | ({ kind: 'loader' } & LoaderOptions);

export type OverlayInstance = OverlayConfig & {
  id: number;
  phase: OverlayPhase;
};

export type ToastInstance = ToastOptions & {
  id: number;
  phase: OverlayPhase;
  tone: OverlayTone;
};

export const overlayTiming = {
  enterMs: 220,
  exitMs: 180,
  toastDurationMs: 3200,
  toastOffset: 12,
  dialogEnterScale: 0.96,
  dialogEnterOffset: 16,
  sheetMaxHeightRatio: 0.92,
  hiddenProgress: 0,
  shownProgress: 1,
  layoutEpsilon: 1,
};
