import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

type TabName = 'home' | 'settings';

export function BottomBar({ activeTab }: { activeTab: TabName }) {
  const router = useRouter();
  const { theme } = useTheme();

  const tabs: { name: TabName; label: string; icon: 'home-variant' | 'cog-outline'; path: '/(tabs)/home' | '/(tabs)/settings' }[] = [
    { name: 'home', label: 'Home', icon: 'home-variant', path: '/(tabs)/home' },
    { name: 'settings', label: 'Settings', icon: 'cog-outline', path: '/(tabs)/settings' },
  ];

  return (
    <View
      accessibilityRole="tablist"
      style={{
        minHeight: theme.size.touchTarget + theme.spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderRadius: theme.radius.pill,
        borderWidth: theme.layout.standardBorderWidth,
        borderColor: theme.colors.border,
        paddingHorizontal: theme.spacing.sm,
        backgroundColor: theme.colors.surface,
        ...theme.shadow.card,
      }}
    >
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
              minWidth: theme.size.touchTarget + theme.spacing.xxl,
              minHeight: theme.size.touchTarget,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: theme.spacing.sm,
              borderRadius: theme.radius.pill,
              paddingHorizontal: theme.spacing.lg,
              backgroundColor: selected ? theme.colors.surfaceSubtle : 'transparent',
              opacity: pressed ? theme.opacity.pressed : theme.opacity.full,
            })}
          >
            <MaterialCommunityIcons
              name={tab.icon}
              size={theme.size.supportActionIcon}
              color={selected ? theme.colors.primary : theme.colors.textMuted}
            />
            <Text
              style={{
                color: selected ? theme.colors.primary : theme.colors.textSecondary,
                fontFamily: selected ? theme.fontFamily.semibold : theme.fontFamily.medium,
                fontSize: theme.typography.caption.fontSize,
                lineHeight: theme.typography.caption.lineHeight,
              }}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
