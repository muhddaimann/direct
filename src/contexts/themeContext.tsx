import { createContext, useMemo, useState, type PropsWithChildren } from 'react';
import { useColorScheme } from 'react-native';
import { themes, type ThemeMode, type ThemeTokens } from '../constants/theme';

export type ThemeContextValue = {
  mode: ThemeMode;
  theme: ThemeTokens;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: PropsWithChildren) {
  const systemColorScheme = useColorScheme();
  const [manualMode, setManualMode] = useState<ThemeMode | null>(null);
  const mode: ThemeMode = manualMode ?? (systemColorScheme === 'dark' ? 'dark' : 'light');

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      theme: themes[mode],
      toggleTheme: () => setManualMode(mode === 'light' ? 'dark' : 'light'),
    }),
    [mode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
