import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Animated, Pressable, Text, View, useWindowDimensions } from 'react-native';
import { useScreenPresence, useSelectionMotion } from '../../helpers/animate';
import { useTheme } from '../../hooks/useTheme';

type TabName = 'home' | 'settings';

export function BottomBar({ activeTab }: { activeTab: TabName }) {
  const router = useRouter();
  const { theme } = useTheme();
  const { fontScale, width: viewportWidth } = useWindowDimensions();

  const tabs: { name: TabName; label: string; icon: 'home-variant' | 'cog-outline'; path: '/(tabs)/home' | '/(tabs)/settings' }[] = [
    { name: 'home', label: 'Home', icon: 'home-variant', path: '/(tabs)/home' },
    { name: 'settings', label: 'Settings', icon: 'cog-outline', path: '/(tabs)/settings' },
  ];
  const width = Math.min(theme.size.floatingTabBarWidth, viewportWidth - theme.spacing.xl * 2);
  const inset = theme.spacing.xs;
  const segmentWidth = (width - inset * 2 - theme.layout.standardBorderWidth * 2) / tabs.length;
  const activeIndex = tabs.findIndex((tab) => tab.name === activeTab);
  const selectionMotion = useSelectionMotion(activeIndex * segmentWidth, theme.motion.springSpeed, theme.motion.springBounciness);
  const entranceMotion = useScreenPresence(theme.motion.presenceDurationMs, theme.spacing.sm, theme.motion.normalScale);

  return (
    <Animated.View
      accessibilityRole="tablist"
      style={[
        {
          alignSelf: 'center',
          width,
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: theme.radius.pill,
          borderWidth: theme.layout.standardBorderWidth,
          borderColor: theme.colors.border,
          padding: inset,
          backgroundColor: theme.colors.surface,
          ...theme.shadow.card,
        },
        entranceMotion,
      ]}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: 'absolute',
            left: inset,
            top: inset,
            bottom: inset,
            width: segmentWidth,
            borderRadius: theme.radius.pill,
            backgroundColor: theme.colors.primary,
          },
          selectionMotion,
        ]}
      />
      {tabs.map((tab) => {
        const selected = tab.name === activeTab;
        return (
          <Pressable
            key={tab.name}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={tab.label}
            onPress={() => {
              if (!selected) router.replace(tab.path);
            }}
            style={({ pressed }) => ({
              flex: theme.layout.fill,
              minWidth: theme.size.touchTarget,
              minHeight: theme.size.touchTarget,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: theme.spacing.sm,
              borderRadius: theme.radius.pill,
              paddingHorizontal: theme.spacing.md,
              opacity: pressed ? theme.opacity.pressed : theme.opacity.full,
            })}
          >
            <MaterialCommunityIcons
              name={tab.icon}
              size={theme.size.supportActionIcon}
              color={selected ? theme.colors.onPrimary : theme.colors.textMuted}
            />
            <Text
              numberOfLines={1}
              style={{
                color: selected ? theme.colors.onPrimary : theme.colors.textSecondary,
                fontFamily: selected ? theme.fontFamily.semibold : theme.fontFamily.medium,
                fontSize: theme.typography.caption.fontSize,
                lineHeight: theme.typography.caption.lineHeight * fontScale,
              }}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </Animated.View>
  );
}
