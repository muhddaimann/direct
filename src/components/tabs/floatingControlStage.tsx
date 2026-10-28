import { MaterialCommunityIcons } from '@expo/vector-icons';
import { usePathname } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { minimumFloatingControlOffset } from '../../constants/layout';
import { useBar } from '../../hooks/useBar';
import { useTheme } from '../../hooks/useTheme';
import { BottomBar } from './bottomBar';

export function FloatingControlStage() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { isScrolled, direction, scrollToTop } = useBar();
  const tabOpacity = useRef(new Animated.Value(1)).current;
  const topOpacity = useRef(new Animated.Value(0)).current;
  const isRootTab = pathname === '/home' || pathname === '/settings';
  const activeTab = pathname === '/settings' ? 'settings' : 'home';
  const showTabs = isRootTab && (!isScrolled || direction === 'up');
  const showScrollToTop = isScrolled && (!isRootTab || direction === 'down');

  useEffect(() => {
    Animated.parallel([
      Animated.timing(tabOpacity, { toValue: showTabs ? theme.opacity.full : theme.opacity.hidden, duration: theme.motion.presenceDurationMs, useNativeDriver: true }),
      Animated.timing(topOpacity, { toValue: showScrollToTop ? theme.opacity.full : theme.opacity.hidden, duration: theme.motion.presenceDurationMs, useNativeDriver: true }),
    ]).start();
  }, [showScrollToTop, showTabs, tabOpacity, theme.motion.presenceDurationMs, theme.opacity.full, theme.opacity.hidden, topOpacity]);

  const bottomOffset = minimumFloatingControlOffset(theme.layout);
  const bottomClearance = insets.bottom + bottomOffset;
  const controlHeight = theme.layout.floatingStageHeight;

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: bottomClearance + controlHeight,
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}
    >
      <Animated.View pointerEvents={showTabs ? 'auto' : 'none'} style={{ position: 'absolute', left: 0, right: 0, bottom: bottomClearance, height: controlHeight, alignItems: 'center', justifyContent: 'center', opacity: tabOpacity }}>
        {isRootTab ? <BottomBar activeTab={activeTab} /> : null}
      </Animated.View>
      <Animated.View pointerEvents={showScrollToTop ? 'auto' : 'none'} style={{ position: 'absolute', bottom: bottomClearance + (controlHeight - theme.size.scrollToTop) / 2, opacity: topOpacity }}>
        {showScrollToTop ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Scroll to top"
            onPress={scrollToTop}
            style={({ pressed }) => ({
              width: theme.size.scrollToTop,
              height: theme.size.scrollToTop,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: theme.radius.pill,
              borderWidth: theme.layout.standardBorderWidth,
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.surface,
              opacity: pressed ? theme.opacity.pressed : theme.opacity.full,
              ...theme.shadow.card,
            })}
          >
            <MaterialCommunityIcons name="arrow-up" size={theme.size.supportActionIcon} color={theme.colors.primary} />
          </Pressable>
        ) : null}
      </Animated.View>
    </View>
  );
}
