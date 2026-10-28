import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { Animated, Pressable } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export function ThemeToggle() {
  const { mode, theme, toggleTheme } = useTheme();
  const scale = useRef(new Animated.Value(theme.motion.normalScale)).current;
  const [focused, setFocused] = useState(false);
  const nextMode = mode === 'light' ? 'dark' : 'light';

  const animateScale = (toValue: number) => {
    Animated.spring(scale, {
      toValue,
      useNativeDriver: true,
      speed: theme.motion.springSpeed,
      bounciness: theme.motion.springBounciness,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        accessibilityRole="switch"
        accessibilityState={{ checked: mode === 'dark' }}
        accessibilityLabel={`Switch to ${nextMode} appearance`}
        accessibilityHint={`Changes the appearance to ${nextMode} for this session.`}
        onPress={toggleTheme}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onPressIn={() => animateScale(theme.motion.pressedScale)}
        onPressOut={() => animateScale(theme.motion.normalScale)}
        style={({ pressed }) => ({
          alignItems: 'center',
          justifyContent: 'center',
          width: theme.size.touchTarget,
          height: theme.size.touchTarget,
          borderRadius: theme.radius.pill,
          borderWidth: focused ? theme.layout.focusBorderWidth : theme.layout.standardBorderWidth,
          borderColor: focused ? theme.colors.focus : theme.colors.border,
          backgroundColor: theme.colors.surface,
          opacity: pressed ? theme.opacity.pressed : theme.opacity.full,
        })}
      >
        <MaterialCommunityIcons
          name={mode === 'light' ? 'moon-waning-crescent' : 'white-balance-sunny'}
          size={theme.size.themeToggleIcon}
          color={theme.colors.textPrimary}
        />
      </Pressable>
    </Animated.View>
  );
}
