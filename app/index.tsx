import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemeToggle } from '../src/components/theme/themeToggle';
import { appAbout, appName, appScheme, appSlug, appVersion, changelog, designDirection } from '../src/constants/about';
import { themes, type ThemeMode, type ThemeTokens } from '../src/constants/theme';
import { useOverlay } from '../src/hooks/useOverlay';
import { useTheme } from '../src/hooks/useTheme';

type TokenEntry = { name: string; value: string };

export default function LandingScreen() {
  const { theme, mode } = useTheme();
  const overlay = useOverlay();
  const { fontScale } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { colors } = theme;

  const sampleOptions = ['Option one', 'Option two'];
  const handleOptionSelect = (label: string) => {
    overlay.dismiss(() => overlay.toast({ message: `${label} selected`, tone: 'success' }));
  };

  const appDetails = [
    ['Name', appName],
    ['About', appAbout],
    ['Slug', appSlug],
    ['Deep-link scheme', appScheme],
    ['Version', appVersion],
    ['Design direction', designDirection],
    ['Changelog', changelog.join('\n')],
  ] as const;

  const overlayExamples = [
    {
      title: 'Alert · alert()',
      subtitle: 'Single acknowledgement dialog',
      onPress: () => overlay.alert({
        title: 'Alert preview',
        message: 'This is a local overlay demonstration. No support request is sent.',
        onConfirm: () => overlay.toast({ message: 'Alert dismissed', tone: 'success' }),
      }),
    },
    {
      title: 'Confirmation · confirm()',
      subtitle: 'Cancel and confirm callback paths',
      onPress: () => overlay.confirm({
        title: 'Confirm preview',
        message: 'Try either action to inspect the exit and callback behavior.',
        onConfirm: () => overlay.toast({ message: 'Confirm action selected', tone: 'success' }),
        onCancel: () => overlay.toast({ message: 'Confirmation cancelled', tone: 'info' }),
      }),
    },
    {
      title: 'Destructive confirmation · confirmDestructive()',
      subtitle: 'Danger action and cancel treatment',
      onPress: () => overlay.confirmDestructive({
        title: 'Remove this preview?',
        message: 'This is a demo only; no data will be removed.',
        confirmLabel: 'Remove',
        onConfirm: () => overlay.toast({ message: 'Demo action completed', tone: 'warning' }),
        onCancel: () => overlay.toast({ message: 'No action taken', tone: 'info' }),
      }),
    },
    {
      title: 'Custom modal · modal()',
      subtitle: 'Custom content and typed actions',
      onPress: () => overlay.modal({
        title: 'Choose an option',
        message: 'Custom OptionPicker content inside a modal.',
        content: <AuditOptionPicker options={sampleOptions} onSelect={handleOptionSelect} theme={theme} fontScale={fontScale} />,
        onCancel: () => overlay.toast({ message: 'Custom modal dismissed', tone: 'info' }),
      }),
    },
    {
      title: 'Bottom sheet · sheet()',
      subtitle: 'Handle drag, backdrop, and dismiss(onComplete)',
      onPress: () => overlay.sheet({
        title: 'Choose an option',
        content: <AuditOptionPicker options={sampleOptions} onSelect={handleOptionSelect} theme={theme} fontScale={fontScale} />,
        onCancel: () => overlay.toast({ message: 'Sheet dismissed without a selection', tone: 'info' }),
      }),
    },
    {
      title: 'Blocking loader · loader()',
      subtitle: 'Auto-dismisses after a short demo interval',
      onPress: () => overlay.loader({ message: 'Preview loading…', durationMs: 1600 }),
    },
  ];

  const toastExamples = [
    { title: 'Success toast · toast()', tone: 'success' as const },
    { title: 'Danger toast · toast()', tone: 'danger' as const },
    { title: 'Warning toast · toast()', tone: 'warning' as const },
    { title: 'Info toast · toast()', tone: 'info' as const },
  ];

  const sharedTokenGroups: [string, object][] = [
    ['spacing', theme.spacing],
    ['size', theme.size],
    ['layout', theme.layout],
    ['fontFamily', theme.fontFamily],
    ['typography', theme.typography],
    ['opacity', theme.opacity],
    ['motion', theme.motion],
    ['radius', theme.radius],
    ['shadow', theme.shadow],
  ];

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: theme.layout.fill,
        paddingHorizontal: theme.spacing.xl,
        paddingTop: theme.layout.screenTop,
        paddingBottom: theme.layout.screenBottom + insets.bottom,
        gap: theme.spacing.xl,
        backgroundColor: colors.background,
      }}
    >
      <View
        style={{
          borderRadius: theme.radius.xl,
          padding: theme.spacing.xl,
          backgroundColor: colors.primary,
          ...theme.shadow.card,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md }}>
          <View
            style={{
              width: theme.size.brandMark,
              height: theme.size.brandMark,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: theme.radius.md,
              backgroundColor: colors.onPrimary,
            }}
          >
            <MaterialCommunityIcons
              name="shield-check-outline"
              size={theme.size.messageIcon}
              color={colors.primary}
            />
          </View>
          <View style={{ flex: theme.layout.fill }}>
            <Text
              style={{
                color: colors.onPrimary,
                fontFamily: theme.fontFamily.bold,
                fontSize: theme.typography.wordmark.fontSize,
                lineHeight: theme.typography.wordmark.lineHeight * fontScale,
                letterSpacing: theme.typography.wordmark.letterSpacing,
              }}
            >
              {appName}
            </Text>
            <Text
              style={{
                color: colors.onPrimary,
                opacity: theme.opacity.muted,
                fontFamily: theme.fontFamily.medium,
                fontSize: theme.typography.caption.fontSize,
                lineHeight: theme.typography.caption.lineHeight * fontScale,
              }}
            >
              NATIVE SUPPORT PROTOTYPE
            </Text>
          </View>
          <ThemeToggle />
        </View>
        <View
          style={{
            alignSelf: 'flex-start',
            marginTop: theme.spacing.xl,
            borderRadius: theme.radius.pill,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.xs,
            backgroundColor: colors.secondary,
          }}
        >
          <Text
            style={{
              color: colors.onSecondary,
              fontFamily: theme.fontFamily.semibold,
              fontSize: theme.typography.prototypeLabel.fontSize,
              lineHeight: theme.typography.prototypeLabel.lineHeight * fontScale,
              letterSpacing: theme.typography.prototypeLabel.letterSpacing,
            }}
          >
            MANUAL AUDIT · {mode.toUpperCase()} MODE
          </Text>
        </View>
      </View>

      <AuditSection title="App about" eyebrow="APP METADATA" theme={theme}>
        <View style={{ gap: theme.spacing.md }}>
          {appDetails.map(([label, value]) => (
            <InfoRow key={label} label={label} value={value} theme={theme} fontScale={fontScale} />
          ))}
        </View>
      </AuditSection>

      <AuditSection title="Theme tokens" eyebrow="LIVE DESIGN SYSTEM" theme={theme}>
        <Text
          style={{
            marginBottom: theme.spacing.lg,
            color: colors.textSecondary,
            fontFamily: theme.fontFamily.regular,
            fontSize: theme.typography.caption.fontSize,
            lineHeight: theme.typography.caption.lineHeight * fontScale,
          }}
        >
          The active UI follows the selected mode. Both semantic palettes and every shared token are listed below.
        </Text>
        <View style={{ gap: theme.spacing.xl }}>
          <TokenGroup title="theme" tokens={{ mode }} theme={theme} fontScale={fontScale} />
          {(['light', 'dark'] as ThemeMode[]).map((paletteMode) => (
            <PaletteAudit key={paletteMode} mode={paletteMode} palette={themes[paletteMode]} theme={theme} />
          ))}
          {sharedTokenGroups.map(([group, tokens]) => (
            <TokenGroup key={group} title={group} tokens={tokens} theme={theme} fontScale={fontScale} />
          ))}
          <View
            style={{
              borderRadius: theme.radius.md,
              padding: theme.spacing.lg,
              backgroundColor: colors.surfaceSubtle,
              ...theme.shadow.card,
            }}
          >
            <Text
              style={{
                marginBottom: theme.spacing.sm,
                color: colors.textSecondary,
                fontFamily: theme.fontFamily.medium,
                fontSize: theme.typography.caption.fontSize,
                lineHeight: theme.typography.caption.lineHeight * fontScale,
              }}
            >
              Shadow specimen · shadow.card
            </Text>
            <Text
              style={{
                color: colors.textPrimary,
                fontFamily: theme.fontFamily.semibold,
                fontSize: theme.typography.heading.fontSize,
                lineHeight: theme.typography.heading.lineHeight * fontScale,
              }}
            >
              Active theme surface
            </Text>
          </View>
        </View>
      </AuditSection>

      <AuditSection title="Overlay tests" eyebrow="INTERACTIVE NATIVE PRIMITIVES" theme={theme}>
        <Text
          style={{
            marginBottom: theme.spacing.lg,
            color: colors.textSecondary,
            fontFamily: theme.fontFamily.regular,
            fontSize: theme.typography.caption.fontSize,
            lineHeight: theme.typography.caption.lineHeight * fontScale,
          }}
        >
          These controls exercise local UI only. They do not contact CelcomDigi or submit support requests.
        </Text>
        <View style={{ gap: theme.spacing.sm }}>
          {overlayExamples.map((example) => (
            <OverlayAuditButton
              key={example.title}
              title={example.title}
              subtitle={example.subtitle}
              onPress={example.onPress}
              theme={theme}
              fontScale={fontScale}
            />
          ))}
        </View>
        <Text
          style={{
            marginTop: theme.spacing.xl,
            marginBottom: theme.spacing.sm,
            color: colors.textPrimary,
            fontFamily: theme.fontFamily.semibold,
            fontSize: theme.typography.heading.fontSize,
            lineHeight: theme.typography.heading.lineHeight * fontScale,
          }}
        >
          Toast tones
        </Text>
        <View style={{ gap: theme.spacing.sm }}>
          {toastExamples.map((example) => (
            <OverlayAuditButton
              key={example.tone}
              title={example.title}
              subtitle={`Theme tokens: colors.${example.tone} / colors.${example.tone}Soft`}
              onPress={() => overlay.toast({ message: `${example.title} preview`, tone: example.tone })}
              theme={theme}
              fontScale={fontScale}
            />
          ))}
        </View>
      </AuditSection>

      <Text
        style={{
          paddingVertical: theme.spacing.lg,
          color: colors.textMuted,
          fontFamily: theme.fontFamily.regular,
          fontSize: theme.typography.caption.fontSize,
          lineHeight: theme.typography.caption.lineHeight * fontScale,
          textAlign: 'center',
        }}
      >
        Direct · {appVersion} · prototype audit screen
      </Text>
    </ScrollView>
  );
}

function AuditSection({
  title,
  eyebrow,
  theme,
  children,
}: {
  title: string;
  eyebrow: string;
  theme: ThemeTokens;
  children: ReactNode;
}) {
  return (
    <View
      style={{
        borderRadius: theme.radius.xl,
        borderWidth: theme.layout.standardBorderWidth,
        borderColor: theme.colors.border,
        padding: theme.spacing.xl,
        backgroundColor: theme.colors.surface,
        ...theme.shadow.card,
      }}
    >
      <Text
        style={{
          marginBottom: theme.spacing.xs,
          color: theme.colors.primary,
          fontFamily: theme.fontFamily.semibold,
          fontSize: theme.typography.prototypeLabel.fontSize,
          lineHeight: theme.typography.prototypeLabel.lineHeight,
          letterSpacing: theme.typography.prototypeLabel.letterSpacing,
        }}
      >
        {eyebrow}
      </Text>
      <Text
        style={{
          marginBottom: theme.spacing.lg,
          color: theme.colors.textPrimary,
          fontFamily: theme.fontFamily.bold,
          fontSize: theme.typography.overlayTitle.fontSize,
          lineHeight: theme.typography.overlayTitle.lineHeight,
        }}
      >
        {title}
      </Text>
      {children}
    </View>
  );
}

function InfoRow({
  label,
  value,
  theme,
  fontScale,
}: {
  label: string;
  value: string;
  theme: ThemeTokens;
  fontScale: number;
}) {
  return (
    <View
      style={{
        gap: theme.spacing.xs,
        paddingBottom: theme.spacing.md,
        borderBottomWidth: theme.layout.standardBorderWidth,
        borderBottomColor: theme.colors.border,
      }}
    >
      <Text
        style={{
          color: theme.colors.textMuted,
          fontFamily: theme.fontFamily.semibold,
          fontSize: theme.typography.caption.fontSize,
          lineHeight: theme.typography.caption.lineHeight * fontScale,
        }}
      >
        {label}
      </Text>
      <Text
        selectable
        style={{
          color: theme.colors.textPrimary,
          fontFamily: theme.fontFamily.regular,
          fontSize: theme.typography.body.fontSize,
          lineHeight: theme.typography.body.lineHeight * fontScale,
        }}
      >
        {value}
      </Text>
    </View>
  );
}

function PaletteAudit({ mode, palette, theme }: { mode: ThemeMode; palette: ThemeTokens; theme: ThemeTokens }) {
  const entries = Object.entries(palette.colors).map(([name, value]) => ({ name: `colors.${name}`, value }));
  return (
    <View style={{ gap: theme.spacing.sm }}>
      <Text
        style={{
          color: theme.colors.textPrimary,
          fontFamily: theme.fontFamily.semibold,
          fontSize: theme.typography.heading.fontSize,
          lineHeight: theme.typography.heading.lineHeight,
          textTransform: 'capitalize',
        }}
      >
        {mode} palette
      </Text>
      {entries.map((entry) => (
        <TokenRow key={entry.name} entry={entry} theme={theme} swatch={entry.value} />
      ))}
    </View>
  );
}

function TokenGroup({
  title,
  tokens,
  theme,
  fontScale,
}: {
  title: string;
  tokens: object;
  theme: ThemeTokens;
  fontScale: number;
}) {
  const entries = flattenTokens(tokens, title);
  return (
    <View style={{ gap: theme.spacing.sm }}>
      <Text
        style={{
          color: theme.colors.textPrimary,
          fontFamily: theme.fontFamily.semibold,
          fontSize: theme.typography.heading.fontSize,
          lineHeight: theme.typography.heading.lineHeight * fontScale,
          textTransform: 'capitalize',
        }}
      >
        {title}
      </Text>
      {entries.map((entry) => {
        const specimen = title === 'fontFamily' ? entry.value : undefined;
        const radiusValue = title === 'radius' ? Number(entry.value) : undefined;
        const opacityValue = title === 'opacity' ? Number(entry.value) : undefined;
        return (
          <TokenRow
            key={entry.name}
            entry={entry}
            theme={theme}
            specimen={specimen}
            radius={radiusValue}
            opacity={opacityValue}
            fontScale={fontScale}
          />
        );
      })}
    </View>
  );
}

function TokenRow({
  entry,
  theme,
  swatch,
  specimen,
  radius,
  opacity,
  fontScale,
}: {
  entry: TokenEntry;
  theme: ThemeTokens;
  swatch?: string;
  specimen?: string;
  radius?: number;
  opacity?: number;
  fontScale?: number;
}) {
  return (
    <View
      style={{
        minHeight: theme.size.touchTarget,
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
        borderRadius: theme.radius.md,
        borderWidth: theme.layout.standardBorderWidth,
        borderColor: theme.colors.border,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        backgroundColor: theme.colors.background,
      }}
    >
      {swatch ? (
        <View
          style={{
            width: theme.size.themeToggleIcon,
            height: theme.size.themeToggleIcon,
            borderRadius: theme.radius.sm,
            borderWidth: theme.layout.standardBorderWidth,
            borderColor: theme.colors.border,
            backgroundColor: swatch,
          }}
        />
      ) : null}
      {radius !== undefined ? (
        <View
          style={{
            width: theme.size.themeToggleIcon,
            height: theme.size.themeToggleIcon,
            borderRadius: radius,
            borderWidth: theme.layout.standardBorderWidth,
            borderColor: theme.colors.primary,
            backgroundColor: theme.colors.surfaceSubtle,
          }}
        />
      ) : null}
      <View style={{ flex: theme.layout.fill }}>
        <Text
          style={{
            color: theme.colors.textPrimary,
            fontFamily: theme.fontFamily.medium,
            fontSize: theme.typography.caption.fontSize,
            lineHeight: theme.typography.caption.lineHeight * (fontScale ?? theme.opacity.full),
          }}
        >
          {entry.name}
        </Text>
        <Text
          selectable
          style={{
            color: theme.colors.textMuted,
            fontFamily: specimen ?? theme.fontFamily.regular,
            fontSize: theme.typography.caption.fontSize,
            lineHeight: theme.typography.caption.lineHeight * (fontScale ?? theme.opacity.full),
            opacity: opacity ?? theme.opacity.full,
          }}
        >
          {entry.value}
        </Text>
      </View>
    </View>
  );
}

function OverlayAuditButton({
  title,
  subtitle,
  onPress,
  theme,
  fontScale,
}: {
  title: string;
  subtitle: string;
  onPress: () => void;
  theme: ThemeTokens;
  fontScale: number;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: theme.size.touchTarget,
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
        borderRadius: theme.radius.md,
        borderWidth: theme.layout.standardBorderWidth,
        borderColor: theme.colors.border,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        backgroundColor: theme.colors.surface,
        opacity: pressed ? theme.opacity.pressed : theme.opacity.full,
      })}
    >
      <View style={{ flex: theme.layout.fill }}>
        <Text
          style={{
            color: theme.colors.textPrimary,
            fontFamily: theme.fontFamily.semibold,
            fontSize: theme.typography.body.fontSize,
            lineHeight: theme.typography.body.lineHeight * fontScale,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            marginTop: theme.spacing.xs,
            color: theme.colors.textMuted,
            fontFamily: theme.fontFamily.regular,
            fontSize: theme.typography.caption.fontSize,
            lineHeight: theme.typography.caption.lineHeight * fontScale,
          }}
        >
          {subtitle}
        </Text>
      </View>
      <MaterialCommunityIcons
        name="chevron-right"
        size={theme.size.themeToggleIcon}
        color={theme.colors.primary}
      />
    </Pressable>
  );
}

function AuditOptionPicker({
  options,
  onSelect,
  theme,
  fontScale,
}: {
  options: string[];
  onSelect: (label: string) => void;
  theme: ThemeTokens;
  fontScale: number;
}) {
  return (
    <View style={{ gap: theme.spacing.sm }}>
      {options.map((label) => (
        <Pressable
          key={label}
          accessibilityRole="button"
          accessibilityLabel={`Select ${label}`}
          onPress={() => onSelect(label)}
          style={({ pressed }) => ({
            minHeight: theme.size.touchTarget,
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.md,
            borderRadius: theme.radius.md,
            borderWidth: theme.layout.standardBorderWidth,
            borderColor: theme.colors.border,
            paddingHorizontal: theme.spacing.lg,
            paddingVertical: theme.spacing.sm,
            backgroundColor: theme.colors.surface,
            opacity: pressed ? theme.opacity.pressed : theme.opacity.full,
          })}
        >
          <View style={{ flex: theme.layout.fill }}>
            <Text
              style={{
                color: theme.colors.textPrimary,
                fontFamily: theme.fontFamily.semibold,
                fontSize: theme.typography.body.fontSize,
                lineHeight: theme.typography.body.lineHeight * fontScale,
              }}
            >
              {label}
            </Text>
            <Text
              style={{
                color: theme.colors.textMuted,
                fontFamily: theme.fontFamily.regular,
                fontSize: theme.typography.caption.fontSize,
                lineHeight: theme.typography.caption.lineHeight * fontScale,
              }}
            >
              Local audit example · no data saved
            </Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={theme.size.themeToggleIcon}
            color={theme.colors.primary}
          />
        </Pressable>
      ))}
    </View>
  );
}

function flattenTokens(value: object, prefix: string): TokenEntry[] {
  return Object.entries(value).flatMap(([key, nestedValue]) => {
    const name = `${prefix}.${key}`;
    if (nestedValue !== null && typeof nestedValue === 'object') {
      return flattenTokens(nestedValue, name);
    }
    return [{ name, value: String(nestedValue) }];
  });
}
