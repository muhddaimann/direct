import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';
import { profileConfig } from '../../constants/profile';
import { useProfile } from '../../hooks/useProfile';
import { useTheme } from '../../hooks/useTheme';

export function ProfileSummaryCard() {
  const router = useRouter();
  const { profile } = useProfile();
  const { theme } = useTheme();
  const { fontScale } = useWindowDimensions();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Profile, ${profile.displayName}. Edit profile details.`}
      onPress={() => router.push('/(tabs)/settings/profile')}
      style={({ pressed }) => ({ minHeight: theme.size.touchTarget + theme.spacing.lg, flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, borderRadius: theme.radius.lg, borderWidth: theme.layout.standardBorderWidth, borderColor: theme.colors.border, padding: theme.spacing.lg, backgroundColor: theme.colors.surface, opacity: pressed ? theme.opacity.pressed : theme.opacity.full })}
    >
      <View style={{ width: theme.size.brandMark, height: theme.size.brandMark, alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.pill, backgroundColor: theme.colors.surfaceSubtle }}>
        <MaterialCommunityIcons name={profileConfig.icon} size={theme.size.supportActionIcon} color={theme.mode === 'light' ? profileConfig.accent : theme.colors.primary} />
      </View>
      <View style={{ flex: theme.layout.fill, gap: theme.spacing.xs }}>
        <Text style={{ color: theme.colors.textPrimary, fontFamily: theme.fontFamily.semibold, fontSize: theme.typography.body.fontSize }}>{profile.displayName}</Text>
        <Text style={{ color: theme.colors.textSecondary, fontFamily: theme.fontFamily.regular, fontSize: theme.typography.caption.fontSize, lineHeight: theme.typography.caption.lineHeight * fontScale }}>{profile.email}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={theme.size.supportActionIcon} color={theme.colors.textMuted} />
    </Pressable>
  );
}
