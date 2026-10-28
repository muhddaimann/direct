import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';
import { AuthSignOutButton } from '../../../src/components/auth/authComponents';
import { AppScreen } from '../../../src/components/shared/appScreen';
import { OptionPicker, type PickerOption } from '../../../src/components/shared/optionPicker';
import { useOverlay } from '../../../src/hooks/useOverlay';
import { useTheme } from '../../../src/hooks/useTheme';

const quickActions: (PickerOption & { href: '/(tabs)/home/demo'; navigation: 'push' } | PickerOption & { href: '/(tabs)/settings'; navigation: 'replace' })[] = [
  { id: 'support', label: 'Support options', description: 'Explore the local support placeholder', href: '/(tabs)/home/demo', navigation: 'push' },
  { id: 'settings', label: 'Settings', description: 'Open app preferences', href: '/(tabs)/settings', navigation: 'replace' },
];

export default function HomeScreen() {
  const router = useRouter();
  const overlay = useOverlay();
  const { theme } = useTheme();
  const { fontScale } = useWindowDimensions();

  const openQuickActions = () => overlay.modal({
    title: 'Quick actions',
    message: 'Choose where you would like to go.',
    content: (
      <OptionPicker
        mode="action"
        options={quickActions}
        onSelect={(option) => {
          const destination = quickActions.find((action) => action.id === option.id);
          if (destination) {
            overlay.dismiss(() => {
              if (destination.navigation === 'push') router.push(destination.href);
              else router.replace(destination.href);
            });
          }
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
          <MaterialCommunityIcons name="dots-horizontal" size={theme.size.supportActionIcon} color={theme.colors.primary} />
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
          onPress={openQuickActions}
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
      <AuthSignOutButton />
    </AppScreen>
  );
}
