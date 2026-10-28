import { Text, TextInput, View, useWindowDimensions } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export function ProfileEditor({
  displayName,
  email,
  onDisplayNameChange,
  onEmailChange,
}: {
  displayName: string;
  email: string;
  onDisplayNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
}) {
  const { theme } = useTheme();
  const { fontScale } = useWindowDimensions();

  const fieldStyle = {
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
  } as const;

  return (
    <View style={{ gap: theme.spacing.lg }}>
      <View style={{ gap: theme.spacing.xs }}>
        <Text style={{ color: theme.colors.textPrimary, fontFamily: theme.fontFamily.semibold, fontSize: theme.typography.caption.fontSize }}>Display name</Text>
        <TextInput
          accessibilityLabel="Display name"
          value={displayName}
          onChangeText={onDisplayNameChange}
          placeholder="Enter your name"
          placeholderTextColor={theme.colors.textMuted}
          autoCapitalize="words"
          autoComplete="name"
          returnKeyType="next"
          maxLength={80}
          style={fieldStyle}
        />
      </View>
      <View style={{ gap: theme.spacing.xs }}>
        <Text style={{ color: theme.colors.textPrimary, fontFamily: theme.fontFamily.semibold, fontSize: theme.typography.caption.fontSize }}>Email address</Text>
        <TextInput
          accessibilityLabel="Email address"
          value={email}
          onChangeText={onEmailChange}
          placeholder="Enter email address"
          placeholderTextColor={theme.colors.textMuted}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="done"
          maxLength={254}
          style={fieldStyle}
        />
      </View>
      <View style={{ gap: theme.spacing.xs, borderRadius: theme.radius.md, padding: theme.spacing.md, backgroundColor: theme.colors.warningSoft }}>
        <Text style={{ color: theme.colors.warning, fontFamily: theme.fontFamily.semibold, fontSize: theme.typography.caption.fontSize }}>Local profile prototype</Text>
        <Text style={{ color: theme.colors.textSecondary, fontFamily: theme.fontFamily.regular, fontSize: theme.typography.caption.fontSize, lineHeight: theme.typography.caption.lineHeight * fontScale }}>
          Changes are kept only for this sign-in session. The email is fictional and no profile data is sent or synced.
        </Text>
      </View>
    </View>
  );
}
