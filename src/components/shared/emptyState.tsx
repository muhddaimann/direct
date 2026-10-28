import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export function EmptyState({
  title,
  message,
  icon = 'inbox-outline',
  actionLabel,
  onAction,
}: {
  title: string;
  message: string;
  icon?: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  actionLabel?: string;
  onAction?: () => void;
}) {
  const { theme } = useTheme();
  const { fontScale } = useWindowDimensions();

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', gap: theme.spacing.md, padding: theme.spacing.xl }}>
      <MaterialCommunityIcons name={icon} size={theme.size.supportIcon} color={theme.colors.textMuted} />
      <Text style={{ color: theme.colors.textPrimary, fontFamily: theme.fontFamily.semibold, fontSize: theme.typography.heading.fontSize, lineHeight: theme.typography.heading.lineHeight * fontScale, textAlign: 'center' }}>
        {title}
      </Text>
      <Text style={{ color: theme.colors.textSecondary, fontFamily: theme.fontFamily.regular, fontSize: theme.typography.body.fontSize, lineHeight: theme.typography.body.lineHeight * fontScale, textAlign: 'center' }}>
        {message}
      </Text>
      {actionLabel && onAction ? (
        <Pressable accessibilityRole="button" onPress={onAction} style={({ pressed }) => ({ minHeight: theme.size.touchTarget, justifyContent: 'center', paddingHorizontal: theme.spacing.lg, opacity: pressed ? theme.opacity.pressed : theme.opacity.full })}>
          <Text style={{ color: theme.colors.primary, fontFamily: theme.fontFamily.semibold, fontSize: theme.typography.body.fontSize }}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
