import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';
import { AuthSessionCard, AuthSignOutButton } from '../../../src/components/auth/authComponents';
import { AppScreen } from '../../../src/components/shared/appScreen';
import { ProfileSummaryCard } from '../../../src/components/profile/profileSummaryCard';
import { OptionPicker, type PickerOption } from '../../../src/components/shared/optionPicker';
import { useOverlay } from '../../../src/hooks/useOverlay';
import { useTheme } from '../../../src/hooks/useTheme';

const appearanceOptions: PickerOption[] = [
  { id: 'light', label: 'Light', description: 'Use the light appearance for this session.' },
  { id: 'dark', label: 'Dark', description: 'Use the dark appearance for this session.' },
];

export default function SettingsScreen() {
  const overlay = useOverlay();
  const { theme, mode, toggleTheme } = useTheme();
  const { fontScale } = useWindowDimensions();

  const openAppearancePicker = () => overlay.sheet({
    title: 'Appearance',
    content: (
      <OptionPicker
        mode="preference"
        options={appearanceOptions}
        selectedId={mode}
        onSelect={(option) => {
          if (option.id !== mode) toggleTheme();
          overlay.dismiss();
        }}
      />
    ),
  });

  return (
    <AppScreen title="Settings" subtitle="Preferences for this session.">
      <AuthSessionCard />
      <ProfileSummaryCard />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Appearance, currently ${mode}. Choose appearance.`}
        onPress={openAppearancePicker}
        style={({ pressed }) => ({ minHeight: theme.size.touchTarget + theme.spacing.lg, flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, borderRadius: theme.radius.lg, borderWidth: theme.layout.standardBorderWidth, borderColor: theme.colors.border, padding: theme.spacing.lg, backgroundColor: theme.colors.surface, opacity: pressed ? theme.opacity.pressed : theme.opacity.full })}
      >
        <MaterialCommunityIcons name="theme-light-dark" size={theme.size.supportActionIcon} color={theme.colors.primary} />
        <View style={{ flex: theme.layout.fill }}>
          <Text style={{ color: theme.colors.textPrimary, fontFamily: theme.fontFamily.semibold, fontSize: theme.typography.body.fontSize }}>Appearance</Text>
          <Text style={{ color: theme.colors.textSecondary, fontFamily: theme.fontFamily.regular, fontSize: theme.typography.caption.fontSize, lineHeight: theme.typography.caption.lineHeight * fontScale }}>Current session · {mode}</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={theme.size.supportActionIcon} color={theme.colors.textMuted} />
      </Pressable>
      <AuthSignOutButton />
    </AppScreen>
  );
}
