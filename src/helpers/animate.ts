import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export function useScreenPresence(durationMs: number, offsetY: number, targetOpacity: number) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: targetOpacity,
      duration: durationMs,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [durationMs, progress, targetOpacity]);

  return {
    opacity: progress,
    transform: [{ translateY: progress.interpolate({ inputRange: [0, targetOpacity], outputRange: [offsetY, 0] }) }],
  };
}
