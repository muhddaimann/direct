import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export function useScreenPresence(durationMs: number, offsetY: number, targetOpacity: number, delayMs = 0) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: targetOpacity,
      duration: durationMs,
      delay: delayMs,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [delayMs, durationMs, progress, targetOpacity]);

  return {
    opacity: progress,
    transform: [{ translateY: progress.interpolate({ inputRange: [0, targetOpacity], outputRange: [offsetY, 0] }) }],
  };
}

export function useSelectionMotion(targetX: number, speed: number, bounciness: number) {
  const position = useRef(new Animated.Value(targetX)).current;

  useEffect(() => {
    const animation = Animated.spring(position, {
      toValue: targetX,
      speed,
      bounciness,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [bounciness, position, speed, targetX]);

  return { transform: [{ translateX: position }] };
}
