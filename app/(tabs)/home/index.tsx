import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';
import { AppScreen } from '../../../src/components/shared/appScreen';
import { ChatHomeSection } from '../../../src/components/chat/chatHomeSection';
import { OptionPicker, type PickerOption } from '../../../src/components/shared/optionPicker';
import { chatConfig } from '../../../src/constants/chat';
import { profileConfig } from '../../../src/constants/profile';
import { useAuth } from '../../../src/hooks/useAuth';
import { useOverlay } from '../../../src/hooks/useOverlay';
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
  const { theme } = useTheme();
  const { fontScale } = useWindowDimensions();

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
            if (option.id === 'logout') void signOut();
          });
        }}
      />
    ),
  });

  return (
    <AppScreen
      title="Home"
      subtitle="Support, together in one place."
      rightSlot={(
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open quick actions"
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
      <View style={{ gap: theme.spacing.md, borderRadius: theme.radius.xl, padding: theme.spacing.xl, backgroundColor: theme.colors.primary, ...theme.shadow.card }}>
        <View style={{ width: theme.size.brandMark, height: theme.size.brandMark, alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.md, backgroundColor: theme.colors.onPrimary }}>
          <MaterialCommunityIcons name="headset" size={theme.size.supportActionIcon} color={theme.colors.primary} />
        </View>
        <Text style={{ color: theme.colors.onPrimary, fontFamily: theme.fontFamily.bold, fontSize: theme.typography.title.fontSize, lineHeight: theme.typography.title.lineHeight * fontScale, letterSpacing: theme.typography.title.letterSpacing }}>
          How can we help?
        </Text>
        <Text style={{ color: theme.colors.onPrimary, fontFamily: theme.fontFamily.regular, fontSize: theme.typography.body.fontSize, lineHeight: theme.typography.body.lineHeight * fontScale, opacity: theme.opacity.muted }}>
          Start a guided support chat and return to it later.
        </Text>
      </View>

      <ChatHomeSection />
    </AppScreen>
  );
}
