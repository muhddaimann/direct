import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { AppScreen } from '../../../src/components/shared/appScreen';
import { HomeDashboard } from '../../../src/components/home/homeDashboard';
import { OptionPicker, type PickerOption } from '../../../src/components/shared/optionPicker';
import { chatConfig } from '../../../src/constants/chat';
import { profileConfig } from '../../../src/constants/profile';
import { useAuth } from '../../../src/hooks/useAuth';
import { useOverlay } from '../../../src/hooks/useOverlay';
import { useProfile } from '../../../src/hooks/useProfile';
import { useTheme } from '../../../src/hooks/useTheme';

const homeQuickActions: PickerOption[] = [
  { id: 'chat', label: 'Manage Chat', description: 'View active and previous demo chats', icon: chatConfig.icon },
  { id: 'profile', label: 'Manage Profile', description: 'View and edit your demo profile', icon: profileConfig.icon },
  { id: 'logout', label: 'Log out', description: 'End this local demo session', icon: 'logout', tone: 'danger' },
];

export default function HomeScreen() {
  const router = useRouter();
  const overlay = useOverlay();
  const { signOut } = useAuth();
  const { profile } = useProfile();
  const { theme } = useTheme();
  const firstName = profile.displayName.trim().split(/\s+/)[0] || 'there';

  const openQuickActions = () => overlay.modal({
    title: 'Quick actions',
    message: 'Manage chat, your profile, or this demo session.',
    content: (
      <OptionPicker
        mode="action"
        options={homeQuickActions}
        onSelect={(option) => {
          overlay.dismiss(() => {
            if (option.id === 'chat') router.push('/(tabs)/home/chat/record');
            if (option.id === 'profile') router.push('/(tabs)/settings/profile');
            if (option.id === 'logout') {
              overlay.confirmDestructive({
                title: 'Log out of this demo?',
                message: 'You will need to sign in again to return to your local demo session.',
                confirmLabel: 'Log out',
                cancelLabel: 'Stay signed in',
                onConfirm: () => { void signOut(); },
              });
            }
          });
        }}
      />
    ),
  });

  return (
    <AppScreen
      title={`Hi, ${firstName}`}
      subtitle="Your postpaid account at a glance."
      rightSlot={(
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open account and quick actions"
          onPress={openQuickActions}
          style={({ pressed }) => ({
            width: theme.size.touchTarget,
            height: theme.size.touchTarget,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: theme.radius.pill,
            backgroundColor: theme.colors.surface,
            opacity: pressed ? theme.opacity.pressed : theme.opacity.full,
          })}
        >
          <MaterialCommunityIcons name={profileConfig.icon} size={theme.size.supportActionIcon} color={theme.mode === 'light' ? profileConfig.accent : theme.colors.primary} />
        </Pressable>
      )}
    >
      <HomeDashboard />
    </AppScreen>
  );
}
