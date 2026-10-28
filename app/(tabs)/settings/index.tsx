import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { BottomBar } from '../../../src/components/tabs/bottomBar';
import { useTheme } from '../../../src/hooks/useTheme';

export default function SettingsScreen() {
  const router = useRouter();
  const { theme, mode } = useTheme();
  const { fontScale } = useWindowDimensions();

  return (
    <View style={{ flex: theme.layout.fill, backgroundColor: theme.colors.background }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: theme.layout.fill,
          paddingHorizontal: theme.spacing.xl,
          paddingTop: theme.layout.screenTop,
          paddingBottom: theme.layout.screenBottom + theme.size.touchTarget + theme.spacing.xxl,
          gap: theme.spacing.xl,
        }}
      >
        <Text
          style={{
            color: theme.colors.textPrimary,
            fontFamily: theme.fontFamily.bold,
            fontSize: theme.typography.title.fontSize,
            lineHeight: theme.typography.title.lineHeight * fontScale,
            letterSpacing: theme.typography.title.letterSpacing,
          }}
        >
          Settings
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.md,
            borderRadius: theme.radius.lg,
            borderWidth: theme.layout.standardBorderWidth,
            borderColor: theme.colors.border,
            padding: theme.spacing.lg,
            backgroundColor: theme.colors.surface,
          }}
        >
          <MaterialCommunityIcons name="theme-light-dark" size={theme.size.supportActionIcon} color={theme.colors.primary} />
          <View style={{ flex: theme.layout.fill }}>
            <Text style={{ color: theme.colors.textPrimary, fontFamily: theme.fontFamily.semibold, fontSize: theme.typography.body.fontSize }}>
              Appearance
            </Text>
            <Text style={{ color: theme.colors.textSecondary, fontFamily: theme.fontFamily.regular, fontSize: theme.typography.caption.fontSize, lineHeight: theme.typography.caption.lineHeight * fontScale }}>
              Current session · {mode}
            </Text>
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open the settings demo"
          onPress={() => router.push('/(tabs)/settings/demo')}
          style={({ pressed }) => ({
            minHeight: theme.size.touchTarget + theme.spacing.lg,
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.md,
            borderRadius: theme.radius.lg,
            borderWidth: theme.layout.standardBorderWidth,
            borderColor: theme.colors.border,
            padding: theme.spacing.lg,
            backgroundColor: theme.colors.surface,
            opacity: pressed ? theme.opacity.pressed : theme.opacity.full,
          })}
        >
          <MaterialCommunityIcons name="tune-variant" size={theme.size.supportActionIcon} color={theme.colors.primary} />
          <Text style={{ flex: theme.layout.fill, color: theme.colors.textPrimary, fontFamily: theme.fontFamily.semibold, fontSize: theme.typography.body.fontSize }}>
            Settings demo
          </Text>
          <MaterialCommunityIcons name="chevron-right" size={theme.size.supportActionIcon} color={theme.colors.textMuted} />
        </Pressable>
      </ScrollView>
      <BottomBar activeTab="settings" />
    </View>
  );
}
