import { useFocusEffect, usePathname } from 'expo-router';
import { useCallback, useRef } from 'react';
import { FlatList, type FlatListProps } from 'react-native';
import { useBar } from '../../hooks/useBar';
import { useTheme } from '../../hooks/useTheme';

export function LongList<ItemT>({ contentContainerStyle, ...props }: FlatListProps<ItemT>) {
  const { theme } = useTheme();
  const pathname = usePathname();
  const bar = useBar();
  const listRef = useRef<FlatList<ItemT>>(null);

  useFocusEffect(useCallback(() => {
    bar.setActivePath(pathname);
    bar.registerScrollController(pathname, { scrollToTop: () => listRef.current?.scrollToOffset({ offset: 0, animated: true }) });
    return () => bar.registerScrollController(pathname, null);
  }, [bar.registerScrollController, bar.setActivePath, pathname]));

  return (
    <FlatList
      {...props}
      ref={listRef}
      onScroll={(event) => {
        bar.reportScroll(pathname, event.nativeEvent.contentOffset.y);
        props.onScroll?.(event);
      }}
      scrollEventThrottle={16}
      contentContainerStyle={[{ flexGrow: theme.layout.fill, gap: theme.spacing.md, paddingBottom: theme.layout.screenBottom }, contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
    />
  );
}
