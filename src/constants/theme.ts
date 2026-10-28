import { Platform } from 'react-native';

export type ThemeMode = 'light' | 'dark';

export type ThemeTokens = {
  mode: ThemeMode;
  colors: {
    background: string;
    surface: string;
    surfaceSubtle: string;
    border: string;
    primary: string;
    onPrimary: string;
    secondary: string;
    onSecondary: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    focus: string;
    overlayBackdrop: string;
    success: string;
    successSoft: string;
    danger: string;
    dangerSoft: string;
    onDanger: string;
    warning: string;
    warningSoft: string;
    info: string;
    infoSoft: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  size: {
    brandMark: number;
    touchTarget: number;
    supportIcon: number;
    supportDividerWidth: number;
    supportDividerHeight: number;
    eyebrowDot: number;
    messageIcon: number;
    supportActionIcon: number;
    themeToggleIcon: number;
    dialogPreferredWidth: number;
    overlayActionHeight: number;
    sheetHandleHeight: number;
    sheetHandleWidth: number;
    sheetHandleThickness: number;
    loaderSpinner: number;
  };
  layout: {
    fill: number;
    heroTop: number;
    footerTop: number;
    screenTop: number;
    screenBottom: number;
    standardBorderWidth: number;
    focusBorderWidth: number;
    noBorder: number;
    sheetDismissRatio: number;
    sheetDismissVelocity: number;
  };
  fontFamily: {
    regular: string;
    medium: string;
    semibold: string;
    bold: string;
  };
  typography: {
    title: { fontSize: number; lineHeight: number; letterSpacing: number };
    heading: { fontSize: number; lineHeight: number };
    body: { fontSize: number; lineHeight: number };
    caption: { fontSize: number; lineHeight: number };
    wordmark: { fontSize: number; lineHeight: number; letterSpacing: number };
    prototypeLabel: { fontSize: number; lineHeight: number; letterSpacing: number };
    eyebrow: { fontSize: number; lineHeight: number; letterSpacing: number };
    supportTitle: { fontSize: number; lineHeight: number };
    supportCaption: { fontSize: number; lineHeight: number };
    footerLabel: { fontSize: number; lineHeight: number; letterSpacing: number };
    overlayTitle: { fontSize: number; lineHeight: number };
  };
  opacity: {
    full: number;
    disabled: number;
    pressed: number;
    muted: number;
  };
  motion: {
    normalScale: number;
    pressedScale: number;
    springSpeed: number;
    springBounciness: number;
  };
  radius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    pill: number;
  };
  shadow: {
    card: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
  };
};

const sharedTokens = {
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },
  size: {
    brandMark: 40,
    touchTarget: 48,
    supportIcon: 48,
    supportDividerWidth: 1,
    supportDividerHeight: 62,
    eyebrowDot: 8,
    messageIcon: 25,
    supportActionIcon: 22,
    themeToggleIcon: 21,
    dialogPreferredWidth: 420,
    overlayActionHeight: 48,
    sheetHandleHeight: 44,
    sheetHandleWidth: 36,
    sheetHandleThickness: 4,
    loaderSpinner: 32,
  },
  layout: {
    fill: 1,
    heroTop: 54,
    footerTop: 34,
    screenTop: 18,
    screenBottom: 28,
    standardBorderWidth: 1,
    focusBorderWidth: 2,
    noBorder: 0,
    sheetDismissRatio: 0.18,
    sheetDismissVelocity: 0.7,
  },
  fontFamily: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
  },
  typography: {
    title: { fontSize: 40, lineHeight: 48, letterSpacing: -1.8 },
    heading: { fontSize: 17, lineHeight: 24 },
    body: { fontSize: 15, lineHeight: 24 },
    caption: { fontSize: 12, lineHeight: 18 },
    wordmark: { fontSize: 19, lineHeight: 24, letterSpacing: -0.5 },
    prototypeLabel: { fontSize: 10, lineHeight: 14, letterSpacing: 0.8 },
    eyebrow: { fontSize: 11, lineHeight: 16, letterSpacing: 1.3 },
    supportTitle: { fontSize: 14, lineHeight: 20 },
    supportCaption: { fontSize: 11, lineHeight: 16 },
    footerLabel: { fontSize: 10, lineHeight: 14, letterSpacing: 1 },
    overlayTitle: { fontSize: 19, lineHeight: 27 },
  },
  opacity: { full: 1, disabled: 0.42, pressed: 0.72, muted: 0.64 },
  motion: { normalScale: 1, pressedScale: 0.92, springSpeed: 30, springBounciness: 5 },
  radius: { sm: 8, md: 14, lg: 16, xl: 24, pill: 999 },
} as const;

const lightTheme: ThemeTokens = {
  mode: 'light',
  ...sharedTokens,
  colors: {
    background: '#F5F8FC',
    surface: '#FFFFFF',
    surfaceSubtle: '#EAF4FF',
    border: '#E1E9F1',
    primary: '#0057B8',
    onPrimary: '#FFFFFF',
    secondary: '#FFD43B',
    onSecondary: '#102A43',
    textPrimary: '#102A43',
    textSecondary: '#52677D',
    textMuted: '#687D91',
    focus: '#0057B8',
    overlayBackdrop: 'rgba(6, 22, 40, 0.64)',
    success: '#18794E',
    successSoft: '#E6F4EC',
    danger: '#C62F3A',
    dangerSoft: '#FCEBEC',
    onDanger: '#FFFFFF',
    warning: '#956500',
    warningSoft: '#FFF5D8',
    info: '#175CD3',
    infoSoft: '#EAF2FF',
  },
  shadow: {
    card: {
      shadowColor: '#102A43',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.07,
      shadowRadius: 20,
      elevation: 3,
    },
  },
};

const darkTheme: ThemeTokens = {
  mode: 'dark',
  ...sharedTokens,
  colors: {
    background: '#0B1724',
    surface: '#142536',
    surfaceSubtle: '#1B334A',
    border: '#2B4054',
    primary: '#55A5FF',
    onPrimary: '#071C32',
    secondary: '#FFD43B',
    onSecondary: '#102A43',
    textPrimary: '#F3F7FB',
    textSecondary: '#C2D0DE',
    textMuted: '#9BAFC2',
    focus: '#8CC4FF',
    overlayBackdrop: 'rgba(0, 0, 0, 0.72)',
    success: '#4ADE80',
    successSoft: '#143824',
    danger: '#FF7B83',
    dangerSoft: '#472126',
    onDanger: '#2A080D',
    warning: '#FACC4F',
    warningSoft: '#403515',
    info: '#7AB7FF',
    infoSoft: '#172D46',
  },
  shadow: {
    card: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: Platform.OS === 'android' ? 0 : 0.24,
      shadowRadius: 20,
      elevation: 4,
    },
  },
};

export const themes: Record<ThemeMode, ThemeTokens> = {
  light: lightTheme,
  dark: darkTheme,
};
