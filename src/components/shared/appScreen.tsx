import { useFocusEffect, usePathname, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Animated, Pressable, RefreshControl, ScrollView, Text, View, useWindowDimensions, type ScrollViewInstance } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FloatingControlStage } from '../tabs/floatingControlStage';
import { useBar } from '../../hooks/useBar';
import { useTheme } from '../../hooks/useTheme';

export function AppScreen({
  title,
  subtitle,
  rightSlot,
  showBack = false,
  refreshing = false,
  onRefresh,
  scrollable = true,
  children,
}: {
  title?: string;
  subtitle?: string;
  rightSlot?: ReactNode;
  showBack?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  scrollable?: boolean;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const { theme } = useTheme();
  const bar = useBar();
  const { fontScale } = useWindowDimensions();
  const scrollRef = useRef<ScrollViewInstance>(null);
  const [entered, setEntered] = useState(false);
  const presence = useRef(new Animated.Value(0)).current;
  const isRootTab = pathname === '/home' || pathname === '/settings';
  useFocusEffect(useCallback(() => {
    bar.setActivePath(pathname);
    if (scrollable) {
      bar.registerScrollController(pathname, {
        scrollToTop: () => scrollRef.current?.scrollTo({ y: 0, animated: true }),
      });
    }
    return () => {
      if (scrollable) bar.registerScrollController(pathname, null);
    };
  }, [bar.registerScrollController, bar.setActivePath, pathname, scrollable]));

  useEffect(() => {
    if (entered) return;
    setEntered(true);
    Animated.timing(presence, {
      toValue: theme.motion.normalScale,
      duration: theme.motion.presenceDurationMs,
      useNativeDriver: true,
    }).start();
  }, [entered, presence, theme.motion.normalScale, theme.motion.presenceDurationMs]);

  const header = title || subtitle || rightSlot || showBack
    ? <AppScreenHeader title={title} subtitle={subtitle} showBack={showBack} rightSlot={rightSlot} />
    : null;

  return (
    <Animated.View
      style={{
        flex: theme.layout.fill,
        opacity: presence,
        transform: [{ translateY: presence.interpolate({ inputRange: [0, 1], outputRange: [theme.spacing.md, 0] }) }],
        backgroundColor: theme.colors.background,
      }}
    >
      {scrollable ? <ScrollView
        ref={scrollRef}
        onScroll={(event) => bar.reportScroll(pathname, event.nativeEvent.contentOffset.y)}
        scrollEventThrottle={16}
        refreshControl={onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} /> : undefined}
        contentContainerStyle={{
          flexGrow: theme.layout.fill,
          paddingHorizontal: theme.spacing.xl,
          paddingTop: theme.layout.screenTop,
          paddingBottom: theme.layout.screenBottom + (isRootTab ? theme.layout.floatingContentClearance : theme.spacing.xl),
          gap: theme.spacing.xl,
        }}
      >
        {header}
        {children}
      </ScrollView> : <View style={{ flex: theme.layout.fill, paddingHorizontal: theme.spacing.xl, paddingTop: theme.layout.screenTop, paddingBottom: theme.layout.screenBottom, gap: theme.spacing.xl }}>{header}{children}</View>}
      <FloatingControlStage />
    </Animated.View>
  );
}

export function AppScreenHeader({
  title,
  subtitle,
  showBack = false,
  rightSlot,
}: {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  rightSlot?: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme } = useTheme();
  const { fontScale } = useWindowDimensions();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(pathname.startsWith('/settings') ? '/(tabs)/settings' : '/(tabs)/home');
  };

  return (
    <View style={{ minHeight: theme.size.touchTarget, flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md }}>
      {showBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={handleBack}
          style={({ pressed }) => ({ width: theme.size.touchTarget, height: theme.size.touchTarget, alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.pill, borderWidth: theme.layout.standardBorderWidth, borderColor: theme.colors.border, backgroundColor: theme.colors.surface, opacity: pressed ? theme.opacity.pressed : theme.opacity.full })}
        >
          <MaterialCommunityIcons name="arrow-left" size={theme.size.supportActionIcon} color={theme.colors.primary} />
        </Pressable>
      ) : null}
      <View style={{ flex: theme.layout.fill, gap: theme.spacing.xs }}>
        {title ? <Text style={{ color: theme.colors.textPrimary, fontFamily: theme.fontFamily.bold, fontSize: theme.typography.heading.fontSize, lineHeight: theme.typography.heading.lineHeight * fontScale }}>{title}</Text> : null}
        {subtitle ? <Text style={{ color: theme.colors.textSecondary, fontFamily: theme.fontFamily.regular, fontSize: theme.typography.body.fontSize, lineHeight: theme.typography.body.lineHeight * fontScale }}>{subtitle}</Text> : null}
      </View>
      {rightSlot}
    </View>
  );
}
