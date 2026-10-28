import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, Text, TextInput, View, useWindowDimensions, type TextInputProps } from 'react-native';
import { authConfig } from '../../constants/auth';
import { appAbout, appName } from '../../constants/about';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

export function AuthBrandHeader() {
  const { theme } = useTheme();
  const { fontScale } = useWindowDimensions();
  return (
    <View style={{ alignItems: 'center', gap: theme.spacing.md }}>
      <View style={{ width: theme.size.brandMark + theme.spacing.xl, height: theme.size.brandMark + theme.spacing.xl, alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.xl, backgroundColor: theme.colors.secondary }}>
        <MaterialCommunityIcons name={authConfig.icon} size={theme.size.brandMark} color={authConfig.accent} />
      </View>
      <Text style={{ color: theme.colors.textPrimary, fontFamily: theme.fontFamily.bold, fontSize: theme.typography.wordmark.fontSize, lineHeight: theme.typography.wordmark.lineHeight * fontScale, letterSpacing: theme.typography.wordmark.letterSpacing }}>
        {appName}
      </Text>
      <Text style={{ color: theme.colors.textSecondary, fontFamily: theme.fontFamily.regular, fontSize: theme.typography.body.fontSize, lineHeight: theme.typography.body.lineHeight * fontScale, textAlign: 'center' }}>
        {appAbout}
      </Text>
    </View>
  );
}

export function AuthField({ label, ...props }: TextInputProps & { label: string }) {
  const { theme } = useTheme();
  const { fontScale } = useWindowDimensions();
  return (
    <View style={{ gap: theme.spacing.xs }}>
      <Text style={{ color: theme.colors.textPrimary, fontFamily: theme.fontFamily.semibold, fontSize: theme.typography.caption.fontSize, lineHeight: theme.typography.caption.lineHeight * fontScale }}>
        {label}
      </Text>
      <TextInput
        {...props}
        accessibilityLabel={props.accessibilityLabel ?? label}
        placeholderTextColor={theme.colors.textMuted}
        selectionColor={theme.colors.primary}
        style={[{
          minHeight: theme.size.touchTarget + theme.spacing.sm,
          borderWidth: theme.layout.standardBorderWidth,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.md,
          paddingHorizontal: theme.spacing.lg,
          color: theme.colors.textPrimary,
          backgroundColor: theme.colors.surface,
          fontFamily: theme.fontFamily.regular,
          fontSize: theme.typography.body.fontSize,
          lineHeight: theme.typography.body.lineHeight * fontScale,
        }, props.style]}
      />
    </View>
  );
}

export function AuthPrimaryButton({ label, onPress, disabled = false, loading = false }: { label: string; onPress: () => void; disabled?: boolean; loading?: boolean }) {
  const { theme } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => ({ minHeight: theme.size.touchTarget + theme.spacing.sm, alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.pill, paddingHorizontal: theme.spacing.xl, backgroundColor: theme.colors.primary, opacity: pressed || disabled ? theme.opacity.disabled : theme.opacity.full })}
    >
      {loading ? <ActivityIndicator color={theme.colors.onPrimary} /> : <Text style={{ color: theme.colors.onPrimary, fontFamily: theme.fontFamily.semibold, fontSize: theme.typography.body.fontSize }}>{label}</Text>}
    </Pressable>
  );
}

export function AuthSessionCard() {
  const { session } = useAuth();
  const { theme } = useTheme();
  const { fontScale } = useWindowDimensions();
  if (!session) return null;
  const expiry = new Date(session.expiresAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, borderRadius: theme.radius.lg, borderWidth: theme.layout.standardBorderWidth, borderColor: theme.colors.border, padding: theme.spacing.lg, backgroundColor: theme.colors.surface }}>
      <MaterialCommunityIcons name="shield-check-outline" size={theme.size.supportActionIcon} color={theme.colors.success} />
      <View style={{ flex: theme.layout.fill }}>
        <Text style={{ color: theme.colors.textPrimary, fontFamily: theme.fontFamily.semibold, fontSize: theme.typography.body.fontSize }}>Local demo session</Text>
        <Text style={{ color: theme.colors.textSecondary, fontFamily: theme.fontFamily.regular, fontSize: theme.typography.caption.fontSize, lineHeight: theme.typography.caption.lineHeight * fontScale }}>Expires at {expiry} · not a production sign-in</Text>
      </View>
    </View>
  );
}

export function AuthSignOutButton() {
  const { signOut } = useAuth();
  const { theme } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Sign out of the demo session"
      onPress={() => { void signOut(); }}
      style={({ pressed }) => ({ minHeight: theme.size.touchTarget + theme.spacing.lg, flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, borderRadius: theme.radius.lg, borderWidth: theme.layout.standardBorderWidth, borderColor: theme.colors.border, padding: theme.spacing.lg, backgroundColor: theme.colors.surface, opacity: pressed ? theme.opacity.pressed : theme.opacity.full })}
    >
      <MaterialCommunityIcons name="logout" size={theme.size.supportActionIcon} color={theme.colors.danger} />
      <Text style={{ flex: theme.layout.fill, color: theme.colors.textPrimary, fontFamily: theme.fontFamily.semibold, fontSize: theme.typography.body.fontSize }}>Sign out</Text>
      <MaterialCommunityIcons name="chevron-right" size={theme.size.supportActionIcon} color={theme.colors.textMuted} />
    </Pressable>
  );
}

export function AuthLoadingScreen() {
  const { theme } = useTheme();
  return (
    <View style={{ flex: theme.layout.fill, alignItems: 'center', justifyContent: 'center', gap: theme.spacing.md, backgroundColor: theme.colors.background }}>
      <ActivityIndicator color={theme.colors.primary} />
      <Text style={{ color: theme.colors.textSecondary, fontFamily: theme.fontFamily.medium, fontSize: theme.typography.body.fontSize }}>Checking local demo session…</Text>
    </View>
  );
}
