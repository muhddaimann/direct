import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';
import { useTheme } from '../../../../src/hooks/useTheme';

export default function SettingsDemoScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { fontScale } = useWindowDimensions();

  return (
    <View style={{ flex: theme.layout.fill, justifyContent: 'center', padding: theme.spacing.xl, gap: theme.spacing.lg, backgroundColor: theme.colors.background }}>
      <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={() => router.back()} style={{ minHeight: theme.size.touchTarget, justifyContent: 'center', alignSelf: 'flex-start' }}>
        <MaterialCommunityIcons name="arrow-left" size={theme.size.supportActionIcon} color={theme.colors.primary} />
      </Pressable>
      <Text style={{ color: theme.colors.textPrimary, fontFamily: theme.fontFamily.bold, fontSize: theme.typography.overlayTitle.fontSize, lineHeight: theme.typography.overlayTitle.lineHeight * fontScale }}>
        Settings demo
      </Text>
      <Text style={{ color: theme.colors.textSecondary, fontFamily: theme.fontFamily.regular, fontSize: theme.typography.body.fontSize, lineHeight: theme.typography.body.lineHeight * fontScale }}>
        Temporary nested route placeholder. The floating tab bar is intentionally hidden here.
      </Text>
    </View>
  );
}
