import { useEffect, useState } from 'react';
import { Pressable, Text } from 'react-native';
import { AppScreen } from '../../../../src/components/shared/appScreen';
import { ProfileEditor } from '../../../../src/components/profile/profileEditor';
import { useProfile } from '../../../../src/hooks/useProfile';
import { useTheme } from '../../../../src/hooks/useTheme';

export default function ProfileScreen() {
  const { profile, updateProfile } = useProfile();
  const { theme } = useTheme();
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [email, setEmail] = useState(profile.email);
  const hasChanges = displayName.trim() !== profile.displayName || email.trim() !== profile.email;

  useEffect(() => {
    setDisplayName(profile.displayName);
    setEmail(profile.email);
  }, [profile.displayName, profile.email]);

  const saveChanges = () => {
    if (updateProfile({ displayName, email })) {
      setDisplayName(displayName.trim());
      setEmail(email.trim());
    }
  };

  return (
    <AppScreen
      title="Profile"
      subtitle="Your details."
      showBack
      rightSlot={(
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Save profile changes"
          accessibilityState={{ disabled: !hasChanges }}
          disabled={!hasChanges}
          onPress={saveChanges}
          style={({ pressed }) => ({
            minWidth: theme.size.touchTarget + theme.spacing.lg,
            minHeight: theme.size.touchTarget,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: theme.radius.pill,
            paddingHorizontal: theme.spacing.md,
            backgroundColor: hasChanges ? theme.colors.primary : theme.colors.surface,
            borderWidth: theme.layout.standardBorderWidth,
            borderColor: hasChanges ? theme.colors.primary : theme.colors.border,
            opacity: !hasChanges ? theme.opacity.disabled : pressed ? theme.opacity.pressed : theme.opacity.full,
          })}
        >
          <Text style={{ color: hasChanges ? theme.colors.onPrimary : theme.colors.textMuted, fontFamily: theme.fontFamily.semibold, fontSize: theme.typography.caption.fontSize }}>
            Save
          </Text>
        </Pressable>
      )}
    >
      <ProfileEditor
        displayName={displayName}
        email={email}
        onDisplayNameChange={setDisplayName}
        onEmailChange={setEmail}
      />
    </AppScreen>
  );
}
