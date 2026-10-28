import { createContext, useCallback, useMemo, useRef, useState, type PropsWithChildren } from 'react';
import { useTheme } from '../hooks/useTheme';

type ScrollDirection = 'up' | 'down';
type ScrollController = { scrollToTop: () => void };

export type BarContextValue = {
  activePath: string;
  isScrolled: boolean;
  direction: ScrollDirection;
  setActivePath: (path: string) => void;
  registerScrollController: (path: string, controller: ScrollController | null) => void;
  reportScroll: (path: string, offset: number) => void;
  scrollToTop: () => void;
};

export const BarContext = createContext<BarContextValue | null>(null);

export function BarProvider({ children }: PropsWithChildren) {
  const { theme } = useTheme();
  const [activePath, setActivePathState] = useState('/');
  const [isScrolled, setIsScrolled] = useState(false);
  const [direction, setDirection] = useState<ScrollDirection>('down');
  const controllers = useRef(new Map<string, ScrollController>());
  const lastOffset = useRef(0);
  const pendingDirection = useRef<ScrollDirection>('down');
  const pendingDistance = useRef(0);

  const setActivePath = useCallback((path: string) => {
    setActivePathState(path);
    lastOffset.current = 0;
    pendingDistance.current = 0;
    setDirection('down');
    setIsScrolled(false);
  }, []);

  const registerScrollController = useCallback((path: string, controller: ScrollController | null) => {
    if (controller) controllers.current.set(path, controller);
    else controllers.current.delete(path);
  }, []);

  const reportScroll = useCallback((path: string, offset: number) => {
    if (path !== activePath) return;

    const delta = offset - lastOffset.current;
    if (Math.abs(delta) > 0) {
      const nextDirection: ScrollDirection = delta > 0 ? 'down' : 'up';
      if (nextDirection !== pendingDirection.current) {
        pendingDirection.current = nextDirection;
        pendingDistance.current = Math.abs(delta);
      } else {
        pendingDistance.current += Math.abs(delta);
      }
      if (pendingDistance.current >= theme.layout.scrollDirectionHysteresis) {
        setDirection(nextDirection);
        pendingDistance.current = 0;
      }
    }

    lastOffset.current = offset;
    setIsScrolled(offset > theme.layout.scrollVisibilityThreshold);
  }, [activePath, theme.layout.scrollDirectionHysteresis, theme.layout.scrollVisibilityThreshold]);

  const scrollToTop = useCallback(() => controllers.current.get(activePath)?.scrollToTop(), [activePath]);

  const value = useMemo(() => ({
    activePath,
    isScrolled,
    direction,
    setActivePath,
    registerScrollController,
    reportScroll,
    scrollToTop,
  }), [activePath, direction, isScrolled, registerScrollController, reportScroll, scrollToTop, setActivePath]);

  return <BarContext.Provider value={value}>{children}</BarContext.Provider>;
}
