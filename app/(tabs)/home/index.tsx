import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';
import { AppScreen } from '../../../src/components/shared/appScreen';
import { OptionPicker, type PickerOption } from '../../../src/components/shared/optionPicker';
import { profileConfig } from '../../../src/constants/profile';
import { useAuth } from '../../../src/hooks/useAuth';
import { useOverlay } from '../../../src/hooks/useOverlay';
import { useTheme } from '../../../src/hooks/useTheme';

const profileActions: PickerOption[] = [
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
    title: 'Account',
    message: 'Manage your profile or end this demo session.',
    content: (
      <OptionPicker
        mode="action"
        options={profileActions}
        onSelect={(option) => {
          overlay.dismiss(() => {
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
          accessibilityLabel="Open account actions"
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
          Browse support options or start a conversation.
        </Text>
      </View>

      <View style={{ gap: theme.spacing.md }}>
        <Text style={{ color: theme.colors.textPrimary, fontFamily: theme.fontFamily.bold, fontSize: theme.typography.overlayTitle.fontSize, lineHeight: theme.typography.overlayTitle.lineHeight * fontScale }}>
          Get support
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open support options"
          onPress={() => router.push('/(tabs)/home/demo')}
          style={({ pressed }) => ({ minHeight: theme.size.touchTarget + theme.spacing.lg, flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, borderRadius: theme.radius.lg, borderWidth: theme.layout.standardBorderWidth, borderColor: theme.colors.border, padding: theme.spacing.lg, backgroundColor: theme.colors.surface, opacity: pressed ? theme.opacity.pressed : theme.opacity.full })}
        >
          <MaterialCommunityIcons name="message-text-outline" size={theme.size.supportActionIcon} color={theme.colors.primary} />
          <View style={{ flex: theme.layout.fill }}>
            <Text style={{ color: theme.colors.textPrimary, fontFamily: theme.fontFamily.semibold, fontSize: theme.typography.body.fontSize }}>Support options</Text>
            <Text style={{ color: theme.colors.textSecondary, fontFamily: theme.fontFamily.regular, fontSize: theme.typography.caption.fontSize, lineHeight: theme.typography.caption.lineHeight * fontScale }}>Local prototype actions</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={theme.size.supportActionIcon} color={theme.colors.textMuted} />
        </Pressable>
      </View>
    </AppScreen>
  );
}
