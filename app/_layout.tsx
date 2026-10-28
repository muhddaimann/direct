import { useEffect } from 'react';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Stack, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { OverlayHost } from '../src/components/overlay/overlayHost';
import { OverlayProvider } from '../src/contexts/overlayProvider';
import { BarProvider } from '../src/contexts/barContext';
import { ThemeProvider } from '../src/contexts/themeContext';
import { useOverlay } from '../src/hooks/useOverlay';
import { useTheme } from '../src/hooks/useTheme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <BarProvider>
          <OverlayProvider>
            <RootNavigation />
            <OverlayHost />
          </OverlayProvider>
        </BarProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function RootNavigation() {
  const { mode, theme } = useTheme();
  const { isOverlayActive } = useOverlay();

  return (
    <SafeAreaView
      edges={['top']}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <StatusBar style={isOverlayActive || mode === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      />
    </SafeAreaView>
  );
}
