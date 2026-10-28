import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Animated,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  overlayTiming,
  type OverlayAction,
  type OverlayInstance,
  type OverlayTone,
} from '../../constants/overlay';
import { OverlayContext } from '../../contexts/overlayContext';
import { useTheme } from '../../hooks/useTheme';

export function OverlayHost() {
  const context = useContext(OverlayContext);
  const { theme } = useTheme();
  if (!context) {
    throw new Error('OverlayHost must be rendered within an OverlayProvider.');
  }

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <NativeOverlayHost />
      <ToastHost />
    </View>
  );
}

function NativeOverlayHost() {
  const context = useContext(OverlayContext);
  if (!context) {
    throw new Error('NativeOverlayHost must be rendered within an OverlayProvider.');
  }

  const { overlay, completeOverlayExit, dismiss } = context;
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { width, height, fontScale } = useWindowDimensions();
  const progress = useRef(new Animated.Value(0)).current;
  const sheetTranslation = useRef(new Animated.Value(height)).current;
  const currentAnimationId = useRef<number | null>(null);
  const overlayRef = useRef(overlay);
  const dismissRef = useRef(dismiss);
  const measuredSheetHeight = useRef(height * 0.7);
  const dragStart = useRef(0);
  const [sheetHeight, setSheetHeight] = useState(height * 0.7);

  overlayRef.current = overlay;
  dismissRef.current = dismiss;

  const sheetResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onStartShouldSetPanResponderCapture: () => true,
    onMoveShouldSetPanResponder: (_, gesture) => gesture.dy > 0,
    onMoveShouldSetPanResponderCapture: (_, gesture) => gesture.dy > 0,
    onPanResponderTerminationRequest: () => false,
    onPanResponderGrant: () => {
      sheetTranslation.stopAnimation((value) => {
        dragStart.current = value;
      });
    },
    onPanResponderMove: (_, gesture) => {
      sheetTranslation.setValue(Math.max(0, dragStart.current + gesture.dy));
    },
    onPanResponderRelease: (_, gesture) => {
      const active = overlayRef.current;
      if (!active || active.kind !== 'sheet') return;

      if (
        gesture.dy >= measuredSheetHeight.current * theme.layout.sheetDismissRatio ||
        gesture.vy >= theme.layout.sheetDismissVelocity
      ) {
        dismissRef.current(active.onCancel);
      } else {
        Animated.spring(sheetTranslation, {
          toValue: overlayTiming.hiddenProgress,
          useNativeDriver: true,
          speed: theme.motion.springSpeed,
          bounciness: theme.motion.springBounciness,
        }).start();
      }
    },
    onPanResponderTerminate: () => {
      Animated.spring(sheetTranslation, {
        toValue: overlayTiming.hiddenProgress,
        useNativeDriver: true,
        speed: theme.motion.springSpeed,
        bounciness: theme.motion.springBounciness,
      }).start();
    },
  }), [sheetTranslation, theme.layout.sheetDismissRatio, theme.layout.sheetDismissVelocity, theme.motion.springBounciness, theme.motion.springSpeed]);

  useEffect(() => {
    if (!overlay) {
      currentAnimationId.current = null;
      return;
    }

    const isSheet = overlay.kind === 'sheet';
    if (currentAnimationId.current !== overlay.id) {
      currentAnimationId.current = overlay.id;
      progress.setValue(overlayTiming.hiddenProgress);
      sheetTranslation.setValue(sheetHeight);
    }

    const closing = overlay.phase === 'closing';
    const animations = [
      Animated.timing(progress, {
        toValue: closing ? overlayTiming.hiddenProgress : overlayTiming.shownProgress,
        duration: closing ? overlayTiming.exitMs : overlayTiming.enterMs,
        useNativeDriver: true,
      }),
    ];

    if (isSheet) {
      animations.push(Animated.timing(sheetTranslation, {
        toValue: closing ? sheetHeight : overlayTiming.hiddenProgress,
        duration: closing ? overlayTiming.exitMs : overlayTiming.enterMs,
        useNativeDriver: true,
      }));
    }

    Animated.parallel(animations).start(({ finished }) => {
      if (finished && closing) completeOverlayExit(overlay.id);
    });
  }, [completeOverlayExit, overlay?.id, overlay?.kind, overlay?.phase, progress, sheetHeight, sheetTranslation]);

  const backdropOpacity = progress;
  const dialogTranslateY = progress.interpolate({
    inputRange: [0, 1],
      outputRange: [overlayTiming.dialogEnterOffset, overlayTiming.hiddenProgress],
  });
  const dialogScale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [overlayTiming.dialogEnterScale, theme.motion.normalScale],
  });

  const cancelActiveOverlay = () => {
    const active = overlayRef.current;
    if (!active || active.phase === 'closing' || active.kind === 'loader') return;
    dismissRef.current(getCancelCallback(active));
  };

  const dialogWidth = Math.max(
    0,
    Math.min(theme.size.dialogPreferredWidth, width - theme.spacing.xl * 2),
  );

  return (
    <Modal
      visible={overlay !== null}
      transparent
      animationType="none"
      presentationStyle="overFullScreen"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={cancelActiveOverlay}
    >
      {overlay ? (
        <View style={{ flex: theme.layout.fill }}>
          {overlay.kind === 'loader' ? (
            <Animated.View
              pointerEvents="none"
              style={{
                ...StyleSheet.absoluteFill,
                backgroundColor: theme.colors.overlayBackdrop,
                opacity: backdropOpacity,
              }}
            />
          ) : (
            <Animated.View
              style={{
                ...StyleSheet.absoluteFill,
                backgroundColor: theme.colors.overlayBackdrop,
                opacity: backdropOpacity,
              }}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Dismiss overlay"
                disabled={overlay.phase === 'closing'}
                onPress={cancelActiveOverlay}
                style={{ flex: theme.layout.fill }}
              />
            </Animated.View>
          )}

          {overlay.kind === 'sheet' ? (
            <View
              pointerEvents={overlay.phase === 'closing' ? 'none' : 'box-none'}
              style={{ flex: theme.layout.fill, justifyContent: 'flex-end' }}
            >
              <Animated.View
                onLayout={(event) => {
                  const measured = event.nativeEvent.layout.height;
                  if (measured > 0 && Math.abs(measured - measuredSheetHeight.current) > overlayTiming.layoutEpsilon) {
                    measuredSheetHeight.current = measured;
                    setSheetHeight(measured);
                  }
                }}
                style={{
                  width: '100%',
                  maxHeight: height * overlayTiming.sheetMaxHeightRatio,
                  borderTopLeftRadius: theme.radius.xl,
                  borderTopRightRadius: theme.radius.xl,
                  backgroundColor: theme.colors.surface,
                  paddingBottom: insets.bottom + theme.spacing.lg,
                  transform: [{ translateY: sheetTranslation }],
                }}
              >
                <View
                  accessibilityRole="button"
                  accessibilityLabel="Drag down to dismiss sheet"
                  accessible
                  style={{
                    height: theme.size.sheetHandleHeight,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  {...sheetResponder.panHandlers}
                >
                  <View
                    style={{
                      width: theme.size.sheetHandleWidth,
                      height: theme.size.sheetHandleThickness,
                      borderRadius: theme.radius.pill,
                      backgroundColor: theme.colors.border,
                    }}
                  />
                </View>
                {overlay.title ? (
                  <Text
                    style={{
                      paddingHorizontal: theme.spacing.xl,
                      paddingTop: theme.spacing.sm,
                      paddingBottom: theme.spacing.md,
                      color: theme.colors.textPrimary,
                      fontFamily: theme.fontFamily.semibold,
                      fontSize: theme.typography.overlayTitle.fontSize,
                      lineHeight: theme.typography.overlayTitle.lineHeight * fontScale,
                    }}
                  >
                    {overlay.title}
                  </Text>
                ) : null}
                <ScrollView
                  style={{ flexShrink: theme.layout.fill }}
                  contentContainerStyle={{ paddingHorizontal: theme.spacing.xl }}
                  keyboardShouldPersistTaps="handled"
                >
                  {overlay.content}
                </ScrollView>
              </Animated.View>
            </View>
          ) : overlay.kind === 'loader' ? (
            <Animated.View
              accessibilityRole="alert"
              accessibilityViewIsModal
              style={{
                ...StyleSheet.absoluteFill,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: backdropOpacity,
              }}
            >
              <View
                style={{
                  width: dialogWidth,
                  alignItems: 'center',
                  borderRadius: theme.radius.xl,
                  padding: theme.spacing.xl,
                  backgroundColor: theme.colors.surface,
                  ...theme.shadow.card,
                }}
              >
                <ActivityIndicator size={theme.size.loaderSpinner} color={theme.colors.primary} />
                {overlay.message ? (
                  <Text
                    style={{
                      marginTop: theme.spacing.lg,
                      color: theme.colors.textPrimary,
                      fontFamily: theme.fontFamily.medium,
                      fontSize: theme.typography.body.fontSize,
                      lineHeight: theme.typography.body.lineHeight * fontScale,
                      textAlign: 'center',
                    }}
                  >
                    {overlay.message}
                  </Text>
                ) : null}
              </View>
            </Animated.View>
          ) : (
            <Animated.View
              pointerEvents="box-none"
              accessibilityRole="alert"
              accessibilityViewIsModal
              style={{
                flex: theme.layout.fill,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: theme.spacing.xl,
                opacity: backdropOpacity,
                transform: [{ translateY: dialogTranslateY }, { scale: dialogScale }],
              }}
            >
              <View
                style={{
                  width: dialogWidth,
                  borderRadius: theme.radius.xl,
                  padding: theme.spacing.xl,
                  backgroundColor: theme.colors.surface,
                  ...theme.shadow.card,
                }}
              >
                <DialogContent
                  overlay={overlay}
                  dismiss={dismiss}
                  theme={theme}
                  fontScale={fontScale}
                />
              </View>
            </Animated.View>
          )}
        </View>
      ) : null}
    </Modal>
  );
}

function DialogContent({
  overlay,
  dismiss,
  theme,
  fontScale,
}: {
  overlay: Exclude<OverlayInstance, { kind: 'sheet' | 'loader' }>;
  dismiss: (onComplete?: () => void) => void;
  theme: ReturnType<typeof useTheme>['theme'];
  fontScale: number;
}) {
  const title = overlay.title;
  const message = overlay.message;
  const actions = getDialogActions(overlay);

  return (
    <View>
      {title ? (
        <Text
          style={{
            color: theme.colors.textPrimary,
            fontFamily: theme.fontFamily.semibold,
            fontSize: theme.typography.overlayTitle.fontSize,
            lineHeight: theme.typography.overlayTitle.lineHeight * fontScale,
            marginBottom: message ? theme.spacing.sm : theme.spacing.xl,
          }}
        >
          {title}
        </Text>
      ) : null}
      {message ? (
        <Text
          style={{
            color: theme.colors.textSecondary,
            fontFamily: theme.fontFamily.regular,
            fontSize: theme.typography.body.fontSize,
            lineHeight: theme.typography.body.lineHeight * fontScale,
            marginBottom: actions.length ? theme.spacing.xl : theme.spacing.md,
          }}
        >
          {message}
        </Text>
      ) : null}
      {overlay.kind === 'modal' ? overlay.content : null}
      {actions.length ? (
        <View style={{ flexDirection: 'row', gap: theme.spacing.md, marginTop: theme.spacing.lg }}>
          {actions.map((action, index) => (
            <OverlayActionButton
              key={`${action.label}-${index}`}
              action={action}
              onPress={() => dismiss(action.onPress)}
              theme={theme}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

function OverlayActionButton({
  action,
  onPress,
  theme,
}: {
  action: OverlayAction;
  onPress: () => void;
  theme: ReturnType<typeof useTheme>['theme'];
}) {
  const variant = action.variant ?? 'primary';
  const danger = variant === 'danger';
  const secondary = variant === 'secondary';
  const backgroundColor = danger
    ? theme.colors.danger
    : secondary
      ? theme.colors.surfaceSubtle
      : theme.colors.primary;
  const foregroundColor = danger
    ? theme.colors.onDanger
    : secondary
      ? theme.colors.textPrimary
      : theme.colors.onPrimary;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({
        flex: theme.layout.fill,
        minHeight: theme.size.overlayActionHeight,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: theme.radius.md,
        borderWidth: secondary ? theme.layout.standardBorderWidth : theme.layout.noBorder,
        borderColor: theme.colors.border,
        paddingHorizontal: theme.spacing.md,
        backgroundColor,
        opacity: pressed ? theme.opacity.pressed : theme.opacity.full,
      })}
    >
      <Text
        style={{
          color: foregroundColor,
          fontFamily: theme.fontFamily.semibold,
          fontSize: theme.typography.caption.fontSize,
          lineHeight: theme.typography.caption.lineHeight,
          textAlign: 'center',
        }}
      >
        {action.label}
      </Text>
    </Pressable>
  );
}

function ToastHost() {
  const context = useContext(OverlayContext);
  if (!context) {
    throw new Error('ToastHost must be rendered within an OverlayProvider.');
  }

  const { toastState, dismissToast, completeToastExit } = context;
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { fontScale } = useWindowDimensions();
  const progress = useRef(new Animated.Value(0)).current;
  const currentToastId = useRef<number | null>(null);

  useEffect(() => {
    if (!toastState) {
      currentToastId.current = null;
      return;
    }

    if (currentToastId.current !== toastState.id) {
      currentToastId.current = toastState.id;
      progress.setValue(overlayTiming.hiddenProgress);
    }

    const closing = toastState.phase === 'closing';
    Animated.timing(progress, {
      toValue: closing ? overlayTiming.hiddenProgress : overlayTiming.shownProgress,
      duration: closing ? overlayTiming.exitMs : overlayTiming.enterMs,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && closing) completeToastExit(toastState.id);
    });
  }, [completeToastExit, progress, toastState?.id, toastState?.phase]);

  if (!toastState) return null;

  const toneColor = theme.colors[toastState.tone];
  const softColor = theme.colors[`${toastState.tone}Soft` as 'successSoft' | 'dangerSoft' | 'warningSoft' | 'infoSoft'];
  const iconName = {
    success: 'check-circle-outline',
    danger: 'alert-circle-outline',
    warning: 'alert-outline',
    info: 'information-outline',
  }[toastState.tone] as keyof typeof MaterialCommunityIcons.glyphMap;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: insets.top + theme.spacing.md,
        right: theme.spacing.lg,
        left: theme.spacing.lg,
        opacity: progress,
        transform: [{ translateY: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [-overlayTiming.toastOffset, overlayTiming.hiddenProgress],
        }) }],
      }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${toastState.tone} message: ${toastState.message}. Tap to dismiss.`}
        accessibilityLiveRegion="polite"
        onPress={() => dismissToast(toastState.id)}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing.md,
          borderRadius: theme.radius.lg,
          borderWidth: theme.layout.standardBorderWidth,
          borderColor: theme.colors.border,
          padding: theme.spacing.lg,
          backgroundColor: softColor,
          opacity: pressed ? theme.opacity.pressed : theme.opacity.full,
          ...theme.shadow.card,
        })}
      >
        <MaterialCommunityIcons
          name={iconName}
          size={theme.size.supportActionIcon}
          color={toneColor}
        />
        <Text
          style={{
            flex: theme.layout.fill,
            color: theme.colors.textPrimary,
            fontFamily: theme.fontFamily.medium,
            fontSize: theme.typography.body.fontSize,
            lineHeight: theme.typography.body.lineHeight * fontScale,
          }}
        >
          {toastState.message}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

function getDialogActions(overlay: Exclude<OverlayInstance, { kind: 'sheet' | 'loader' }>): OverlayAction[] {
  switch (overlay.kind) {
    case 'alert':
      return [{ label: overlay.confirmLabel ?? 'OK', onPress: overlay.onConfirm }];
    case 'confirm':
      return [
        { label: overlay.cancelLabel ?? 'Cancel', onPress: overlay.onCancel, variant: 'secondary' },
        { label: overlay.confirmLabel ?? 'Confirm', onPress: overlay.onConfirm },
      ];
    case 'destructiveConfirm':
      return [
        { label: overlay.cancelLabel ?? 'Cancel', onPress: overlay.onCancel, variant: 'secondary' },
        { label: overlay.confirmLabel ?? 'Delete', onPress: overlay.onConfirm, variant: 'danger' },
      ];
    case 'modal':
      return overlay.actions ?? [];
  }
}

function getCancelCallback(overlay: OverlayInstance): (() => void) | undefined {
  if ('onCancel' in overlay) return overlay.onCancel;
  return undefined;
}
