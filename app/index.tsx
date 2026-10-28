import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { ThemeToggle } from '../src/components/theme/themeToggle';
import { appAbout, appName, appVersion } from '../src/constants/about';
import { useTheme } from '../src/hooks/useTheme';

export default function LandingScreen() {
  const { theme } = useTheme();
  const { colors } = theme;
  const { fontScale } = useWindowDimensions();

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: theme.layout.fill,
        paddingHorizontal: theme.spacing.xl,
        paddingTop: theme.layout.screenTop,
        paddingBottom: theme.layout.screenBottom,
        backgroundColor: colors.background,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
        <View
          style={{
            width: theme.size.brandMark,
            height: theme.size.brandMark,
            borderRadius: theme.radius.md,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.primary,
          }}
        >
          <MaterialCommunityIcons
            name="message-processing"
            size={theme.size.messageIcon}
            color={colors.onPrimary}
          />
        </View>
        <Text
          style={{
            color: colors.textPrimary,
            fontFamily: theme.fontFamily.bold,
            fontSize: theme.typography.wordmark.fontSize,
            lineHeight: theme.typography.wordmark.lineHeight * fontScale,
            letterSpacing: theme.typography.wordmark.letterSpacing,
          }}
        >
          {appName}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.sm,
            marginLeft: 'auto',
          }}
        >
          <ThemeToggle />
          <View
            style={{
              borderRadius: theme.radius.pill,
              backgroundColor: colors.secondary,
              paddingHorizontal: theme.spacing.md,
              paddingVertical: theme.spacing.sm,
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
              PROTOTYPE
            </Text>
          </View>
        </View>
      </View>

      <View style={{ paddingTop: theme.layout.heroTop, paddingBottom: theme.spacing.xxl }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.sm,
            marginBottom: theme.spacing.lg,
          }}
        >
          <View
            style={{
              width: theme.size.eyebrowDot,
              height: theme.size.eyebrowDot,
              borderRadius: theme.radius.pill,
              backgroundColor: colors.secondary,
            }}
          />
          <Text
            style={{
              color: colors.textSecondary,
              fontFamily: theme.fontFamily.semibold,
              fontSize: theme.typography.eyebrow.fontSize,
              lineHeight: theme.typography.eyebrow.lineHeight * fontScale,
              letterSpacing: theme.typography.eyebrow.letterSpacing,
            }}
          >
            SUPPORT, BUILT IN
          </Text>
        </View>
        <Text
          style={{
            color: colors.textPrimary,
            fontFamily: theme.fontFamily.bold,
            fontSize: theme.typography.title.fontSize,
            lineHeight: theme.typography.title.lineHeight * fontScale,
            letterSpacing: theme.typography.title.letterSpacing,
          }}
        >
          {'Help is closer\nthan ever.'}
        </Text>
        <Text
          style={{
            marginTop: theme.spacing.lg,
            color: colors.textSecondary,
            fontFamily: theme.fontFamily.regular,
            fontSize: theme.typography.body.fontSize,
            lineHeight: theme.typography.body.lineHeight * fontScale,
          }}
        >
          {appAbout}
        </Text>
      </View>

      <View
        style={{
          borderRadius: theme.radius.xl,
          padding: theme.spacing.xl,
          backgroundColor: colors.surface,
          ...theme.shadow.card,
        }}
      >
        <Text
          style={{
            color: colors.textPrimary,
            fontFamily: theme.fontFamily.semibold,
            fontSize: theme.typography.heading.fontSize,
            lineHeight: theme.typography.heading.lineHeight * fontScale,
          }}
        >
          One place to get support
        </Text>
        <Text
          style={{
            marginTop: theme.spacing.xs,
            color: colors.textSecondary,
            fontFamily: theme.fontFamily.regular,
            fontSize: theme.typography.caption.fontSize,
            lineHeight: theme.typography.caption.lineHeight * fontScale,
          }}
        >
          Choose the way you want to connect.
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: theme.spacing.xl,
          }}
        >
          <View style={{ flex: theme.layout.fill, alignItems: 'center' }}>
            <View
              style={{
                width: theme.size.supportIcon,
                height: theme.size.supportIcon,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: theme.radius.lg,
                marginBottom: theme.spacing.sm,
                backgroundColor: colors.surfaceSubtle,
              }}
            >
              <MaterialCommunityIcons
                name="headset"
                size={theme.size.supportActionIcon}
                color={colors.primary}
              />
            </View>
            <Text
              style={{
                color: colors.textPrimary,
                fontFamily: theme.fontFamily.semibold,
                fontSize: theme.typography.supportTitle.fontSize,
                lineHeight: theme.typography.supportTitle.lineHeight * fontScale,
              }}
            >
              IMR
            </Text>
            <Text
              style={{
                marginTop: theme.spacing.xs,
                color: colors.textMuted,
                fontFamily: theme.fontFamily.regular,
                fontSize: theme.typography.supportCaption.fontSize,
                lineHeight: theme.typography.supportCaption.lineHeight * fontScale,
              }}
            >
              In-app support
            </Text>
          </View>
          <View
            style={{
              width: theme.size.supportDividerWidth,
              height: theme.size.supportDividerHeight,
              backgroundColor: colors.border,
              marginHorizontal: theme.spacing.sm,
            }}
          />
          <View style={{ flex: theme.layout.fill, alignItems: 'center' }}>
            <View
              style={{
                width: theme.size.supportIcon,
                height: theme.size.supportIcon,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: theme.radius.lg,
                marginBottom: theme.spacing.sm,
                backgroundColor: colors.secondary,
              }}
            >
              <MaterialCommunityIcons
                name="chat-outline"
                size={theme.size.supportActionIcon}
                color={colors.onSecondary}
              />
            </View>
            <Text
              style={{
                color: colors.textPrimary,
                fontFamily: theme.fontFamily.semibold,
                fontSize: theme.typography.supportTitle.fontSize,
                lineHeight: theme.typography.supportTitle.lineHeight * fontScale,
              }}
            >
              Live chat
            </Text>
            <Text
              style={{
                marginTop: theme.spacing.xs,
                color: colors.textMuted,
                fontFamily: theme.fontFamily.regular,
                fontSize: theme.typography.supportCaption.fontSize,
                lineHeight: theme.typography.supportCaption.lineHeight * fontScale,
              }}
            >
              Talk to our team
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 'auto',
          paddingTop: theme.layout.footerTop,
        }}
      >
        <Text
          style={{
            color: colors.textMuted,
            fontFamily: theme.fontFamily.semibold,
            fontSize: theme.typography.footerLabel.fontSize,
            lineHeight: theme.typography.footerLabel.lineHeight * fontScale,
            letterSpacing: theme.typography.footerLabel.letterSpacing,
          }}
        >
          APP VERSION
        </Text>
        <Text
          style={{
            color: colors.textPrimary,
            fontFamily: theme.fontFamily.medium,
            fontSize: theme.typography.caption.fontSize,
          }}
        >
          {appVersion}
        </Text>
      </View>
    </ScrollView>
  );
}
