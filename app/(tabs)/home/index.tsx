import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { BottomBar } from '../../../src/components/tabs/bottomBar';
import { useTheme } from '../../../src/hooks/useTheme';

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
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
        <View
          style={{
            gap: theme.spacing.md,
            borderRadius: theme.radius.xl,
            padding: theme.spacing.xl,
            backgroundColor: theme.colors.primary,
            ...theme.shadow.card,
          }}
        >
          <View
            style={{
              width: theme.size.brandMark,
              height: theme.size.brandMark,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: theme.radius.md,
              backgroundColor: theme.colors.onPrimary,
            }}
          >
            <MaterialCommunityIcons name="headset" size={theme.size.supportActionIcon} color={theme.colors.primary} />
          </View>
          <Text
            style={{
              color: theme.colors.onPrimary,
              fontFamily: theme.fontFamily.bold,
              fontSize: theme.typography.title.fontSize,
              lineHeight: theme.typography.title.lineHeight * fontScale,
              letterSpacing: theme.typography.title.letterSpacing,
            }}
          >
            How can we help?
          </Text>
          <Text
            style={{
              color: theme.colors.onPrimary,
              fontFamily: theme.fontFamily.regular,
              fontSize: theme.typography.body.fontSize,
              lineHeight: theme.typography.body.lineHeight * fontScale,
              opacity: theme.opacity.muted,
            }}
          >
            Your support, together in one place.
          </Text>
        </View>

        <View style={{ gap: theme.spacing.md }}>
          <Text
            style={{
              color: theme.colors.textPrimary,
              fontFamily: theme.fontFamily.bold,
              fontSize: theme.typography.overlayTitle.fontSize,
              lineHeight: theme.typography.overlayTitle.lineHeight * fontScale,
            }}
          >
            Get support
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open the support demo"
            onPress={() => router.push('/(tabs)/home/demo')}
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
            <MaterialCommunityIcons name="message-text-outline" size={theme.size.supportIcon / 2} color={theme.colors.primary} />
            <View style={{ flex: theme.layout.fill }}>
              <Text style={{ color: theme.colors.textPrimary, fontFamily: theme.fontFamily.semibold, fontSize: theme.typography.body.fontSize }}>
                Support options
              </Text>
              <Text style={{ color: theme.colors.textSecondary, fontFamily: theme.fontFamily.regular, fontSize: theme.typography.caption.fontSize, lineHeight: theme.typography.caption.lineHeight * fontScale }}>
                View a local navigation placeholder
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={theme.size.supportActionIcon} color={theme.colors.textMuted} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Log out of the prototype"
            onPress={() => router.replace('/')}
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
            <MaterialCommunityIcons name="logout" size={theme.size.supportIcon / 2} color={theme.colors.danger} />
            <View style={{ flex: theme.layout.fill }}>
              <Text style={{ color: theme.colors.textPrimary, fontFamily: theme.fontFamily.semibold, fontSize: theme.typography.body.fontSize }}>
                Log out
              </Text>
              <Text style={{ color: theme.colors.textSecondary, fontFamily: theme.fontFamily.regular, fontSize: theme.typography.caption.fontSize, lineHeight: theme.typography.caption.lineHeight * fontScale }}>
                Prototype navigation only · no account session
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={theme.size.supportActionIcon} color={theme.colors.textMuted} />
          </Pressable>
        </View>
      </ScrollView>
      <BottomBar activeTab="home" />
    </View>
  );
}
