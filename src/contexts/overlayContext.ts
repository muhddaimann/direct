import { createContext } from 'react';
import type {
  AlertOptions,
  BottomSheetOptions,
  ConfirmOptions,
  CustomModalOptions,
  LoaderOptions,
  OverlayInstance,
  ToastInstance,
  ToastOptions,
} from '../constants/overlay';

export type OverlayApi = {
  isOverlayActive: boolean;
  alert: (options: AlertOptions) => void;
  confirm: (options: ConfirmOptions) => void;
  confirmDestructive: (options: ConfirmOptions) => void;
  modal: (options: CustomModalOptions) => void;
  sheet: (options: BottomSheetOptions) => void;
  loader: (options?: LoaderOptions) => void;
  dismiss: (onComplete?: () => void) => void;
  toast: (options: ToastOptions) => void;
};

export type OverlayContextValue = OverlayApi & {
  overlay: OverlayInstance | null;
  toastState: ToastInstance | null;
  completeOverlayExit: (id: number) => void;
  dismissToast: (id: number) => void;
  completeToastExit: (id: number) => void;
};

export const OverlayContext = createContext<OverlayContextValue | null>(null);
