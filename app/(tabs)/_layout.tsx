import { Redirect, Tabs } from 'expo-router';
import { AuthLoadingScreen } from '../../src/components/auth/authComponents';
import { useAuth } from '../../src/hooks/useAuth';
import { useTheme } from '../../src/hooks/useTheme';

export default function TabLayout() {
  const { theme } = useTheme();
  const { isRestoring, session } = useAuth();

  if (isRestoring) return <AuthLoadingScreen />;
  if (!session) return <Redirect href="/" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: 'none',
        tabBarStyle: { display: 'none' },
        sceneStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
