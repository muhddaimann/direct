import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { Animated, Image, Pressable, Text, View, useWindowDimensions } from 'react-native';
import { ChatHomeSection } from '../chat/chatHomeSection';
import { chatConfig } from '../../constants/chat';
import { homeDemoAccount, homeMotion, type HomeQuickActionId } from '../../constants/home';
import { profileConfig } from '../../constants/profile';
import { useChat } from '../../hooks/useChat';
import { useOverlay } from '../../hooks/useOverlay';
import { useProfile } from '../../hooks/useProfile';
import { useTheme } from '../../hooks/useTheme';
import { useScreenPresence } from '../../helpers/animate';

const quickActions: { id: HomeQuickActionId; label: string; description: string; icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'] }[] = [
  { id: 'payments', label: 'Pay bill', description: 'Preview only', icon: 'receipt-text-outline' },
  { id: 'usage', label: 'Data usage', description: 'View sample usage', icon: 'chart-donut' },
  { id: 'chat', label: 'Chat us', description: 'Guided support', icon: chatConfig.icon },
  { id: 'profile', label: 'My profile', description: 'Personal details', icon: profileConfig.icon },
];

export function HomeDashboard() {
  const router = useRouter();
  const overlay = useOverlay();
  const { activeSession, sessions, start } = useChat();
  const { theme } = useTheme();
  const { fontScale } = useWindowDimensions();

  const handleAction = (id: HomeQuickActionId) => {
    if (id === 'profile') {
      router.push('/(tabs)/settings/profile');
      return;
    }
    if (id === 'chat') {
      if (activeSession) {
        router.push({ pathname: '/(tabs)/home/chat', params: { sessionId: activeSession.id } });
        return;
      }
      overlay.confirm({
        title: 'Start simulated chat?',
        message: 'This chat is a prototype. No real enquiry is sent and no live agent will respond. Continuing acknowledges this notice only; it is not legal Terms and Conditions or stored consent.',
        confirmLabel: 'I understand, continue',
        cancelLabel: 'Cancel',
        onConfirm: () => {
          const sessionId = start();
          router.push({ pathname: '/(tabs)/home/chat', params: { sessionId } });
        },
      });
      return;
    }
    if (id === 'usage') {
      overlay.alert({
        title: 'Sample data usage',
        message: 'The data allowance and usage shown on Home are fictional. Direct is not connected to a mobile line and cannot check real usage.',
      });
      return;
    }
    overlay.alert({
      title: 'Bill payment preview',
      message: 'The bill amount is fictional. Payment is unavailable in this prototype; no payment method is collected and no transaction can be made.',
    });
  };

  const viewBill = () => overlay.alert({
    title: 'Demo bill details',
    message: `Sample total due: ${homeDemoAccount.totalDue}, due ${homeDemoAccount.dueDate}. This is fictional account information; no real bill is available in this prototype.`,
  });

  return (
    <View style={{ gap: theme.spacing.lg }}>
      <AnimatedDashboardSection>
        <AccountOverviewCard onViewBill={viewBill} />
      </AnimatedDashboardSection>

      <AnimatedDashboardSection delayMs={homeMotion.sectionStaggerMs}>
        <View style={{ gap: theme.spacing.md }}>
          <Text style={{ color: theme.colors.textPrimary, fontFamily: theme.fontFamily.bold, fontSize: theme.typography.overlayTitle.fontSize, lineHeight: theme.typography.overlayTitle.lineHeight * fontScale }}>Quick actions</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}>
            {quickActions.map((action) => (
              <Pressable
                key={action.id}
                accessibilityRole="button"
                accessibilityLabel={`${action.label}, ${action.description}`}
                onPress={() => handleAction(action.id)}
                style={({ pressed }) => ({ flexBasis: '48%', flexGrow: theme.layout.fill, minHeight: theme.size.touchTarget + theme.spacing.md, flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, borderRadius: theme.radius.lg, padding: theme.spacing.md, backgroundColor: theme.colors.surface, opacity: pressed ? theme.opacity.pressed : theme.opacity.full })}
              >
                <View style={{ width: theme.size.brandMark, height: theme.size.brandMark, alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.md, backgroundColor: theme.colors.surfaceSubtle }}>
                  <MaterialCommunityIcons name={action.icon} size={theme.size.supportActionIcon} color={action.id === 'payments' ? theme.colors.warning : action.id === 'usage' ? theme.colors.info : theme.colors.primary} />
                </View>
                <View style={{ flex: theme.layout.fill, gap: theme.spacing.xs }}>
                  <Text style={{ color: theme.colors.textPrimary, fontFamily: theme.fontFamily.semibold, fontSize: theme.typography.caption.fontSize, lineHeight: theme.typography.caption.lineHeight * fontScale }}>{action.label}</Text>
                  <Text style={{ color: theme.colors.textMuted, fontFamily: theme.fontFamily.regular, fontSize: theme.typography.footerLabel.fontSize, lineHeight: theme.typography.footerLabel.lineHeight * fontScale }}>{action.description}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </AnimatedDashboardSection>

      {sessions.length > 0 ? (
        <AnimatedDashboardSection delayMs={homeMotion.sectionStaggerMs * 2}>
          <ChatHomeSection />
        </AnimatedDashboardSection>
      ) : null}

      <AnimatedDashboardSection delayMs={homeMotion.sectionStaggerMs * 3}>
        <AdvertisementBanner />
      </AnimatedDashboardSection>
    </View>
  );
}

function AnimatedDashboardSection({ children, delayMs = 0 }: { children: ReactNode; delayMs?: number }) {
  const { theme } = useTheme();
  const presence = useScreenPresence(theme.motion.presenceDurationMs, theme.spacing.md, theme.motion.normalScale, delayMs);
  return <Animated.View style={presence}>{children}</Animated.View>;
}

function AccountOverviewCard({ onViewBill }: { onViewBill: () => void }) {
  const { theme } = useTheme();
  const { fontScale } = useWindowDimensions();

  return (
    <View style={{ gap: theme.spacing.lg, overflow: 'hidden', borderRadius: theme.radius.xl, padding: theme.spacing.xl, backgroundColor: theme.colors.primary, ...theme.shadow.card }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
          <MaterialCommunityIcons name="sim-outline" size={theme.size.supportActionIcon} color={theme.colors.onPrimary} />
          <Text style={{ color: theme.colors.onPrimary, fontFamily: theme.fontFamily.semibold, fontSize: theme.typography.body.fontSize }}>{homeDemoAccount.planName}</Text>
        </View>
        <View style={{ borderRadius: theme.radius.pill, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.xs, backgroundColor: theme.colors.secondary }}>
          <Text style={{ color: theme.colors.onSecondary, fontFamily: theme.fontFamily.bold, fontSize: theme.typography.prototypeLabel.fontSize, lineHeight: theme.typography.prototypeLabel.lineHeight * fontScale, letterSpacing: theme.typography.prototypeLabel.letterSpacing }}>{homeDemoAccount.label}</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing.md }}>
        <View style={{ flex: theme.layout.fill, gap: theme.spacing.xs }}>
          <Text style={{ color: theme.colors.onPrimary, fontFamily: theme.fontFamily.medium, fontSize: theme.typography.caption.fontSize }}>TOTAL DUE</Text>
          <Text style={{ color: theme.colors.onPrimary, fontFamily: theme.fontFamily.bold, fontSize: theme.typography.title.fontSize, lineHeight: theme.typography.title.lineHeight * fontScale, letterSpacing: theme.typography.title.letterSpacing }}>{homeDemoAccount.totalDue}</Text>
          <Text style={{ color: theme.colors.onPrimary, fontFamily: theme.fontFamily.regular, fontSize: theme.typography.caption.fontSize, opacity: theme.opacity.muted }}>Demo bill · Due {homeDemoAccount.dueDate}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Preview bill payment; no transaction will be made"
          onPress={onViewBill}
          style={({ pressed }) => ({ minHeight: theme.size.touchTarget, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: theme.spacing.xs, borderRadius: theme.radius.pill, paddingHorizontal: theme.spacing.md, backgroundColor: theme.colors.secondary, opacity: pressed ? theme.opacity.pressed : theme.opacity.full })}
        >
          <Text style={{ color: theme.colors.onSecondary, fontFamily: theme.fontFamily.semibold, fontSize: theme.typography.caption.fontSize }}>View bill</Text>
          <MaterialCommunityIcons name="arrow-up-right" size={theme.size.themeToggleIcon} color={theme.colors.onSecondary} />
        </Pressable>
      </View>

      <View style={{ height: theme.layout.standardBorderWidth, backgroundColor: theme.colors.onPrimary, opacity: theme.opacity.muted }} />

      <View style={{ gap: theme.spacing.sm }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing.md }}>
          <Text style={{ color: theme.colors.onPrimary, fontFamily: theme.fontFamily.semibold, fontSize: theme.typography.caption.fontSize }}>Data remaining</Text>
          <Text style={{ color: theme.colors.onPrimary, fontFamily: theme.fontFamily.medium, fontSize: theme.typography.caption.fontSize }}>{homeDemoAccount.dataRemaining} of {homeDemoAccount.dataTotal}</Text>
        </View>
        <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: Math.round((1 - homeDemoAccount.dataUsedRatio) * 100) }} accessibilityLabel="Sample data remaining" style={{ height: theme.size.eyebrowDot, overflow: 'hidden', borderRadius: theme.radius.pill, backgroundColor: theme.colors.onPrimary, opacity: theme.opacity.muted }}>
          <View style={{ width: `${(1 - homeDemoAccount.dataUsedRatio) * 100}%`, height: theme.layout.fill, borderRadius: theme.radius.pill, backgroundColor: theme.colors.secondary }} />
        </View>
        <Text style={{ color: theme.colors.onPrimary, fontFamily: theme.fontFamily.regular, fontSize: theme.typography.caption.fontSize, opacity: theme.opacity.muted }}>{homeDemoAccount.renewalLabel} · sample usage</Text>
      </View>
    </View>
  );
}

function AdvertisementBanner() {
  const { theme } = useTheme();
  const { fontScale } = useWindowDimensions();

  return (
    <View style={{ gap: theme.spacing.sm }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs }}>
        <MaterialCommunityIcons name="bullhorn-outline" size={theme.size.themeToggleIcon} color={theme.colors.textMuted} />
        <Text style={{ color: theme.colors.textMuted, fontFamily: theme.fontFamily.semibold, fontSize: theme.typography.prototypeLabel.fontSize, lineHeight: theme.typography.prototypeLabel.lineHeight * fontScale, letterSpacing: theme.typography.prototypeLabel.letterSpacing }}>ADVERTISEMENT</Text>
      </View>
      <View style={{ width: '100%', aspectRatio: 2, overflow: 'hidden', borderRadius: theme.radius.lg, backgroundColor: theme.colors.surface }}>
        <Image
          source={require('../../../assets/ads/00.png')}
          accessibilityRole="image"
          accessibilityLabel="CelcomDigi advertisement: iPhone 18 Pro preorder promotion with offers worth up to RM7,105. See the image for offer details."
          resizeMode="cover"
          style={{ width: '100%', height: '100%' }}
        />
      </View>
    </View>
  );
}
