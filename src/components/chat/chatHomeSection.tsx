import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';
import { chatConfig } from '../../constants/chat';
import { useChat } from '../../hooks/useChat';
import { useOverlay } from '../../hooks/useOverlay';
import { useTheme } from '../../hooks/useTheme';

export function ChatHomeSection() {
  const router = useRouter();
  const { activeSession, sessions, start } = useChat();
  const overlay = useOverlay();
  const { theme } = useTheme();
  const { fontScale } = useWindowDimensions();
  const latestRecord = [...sessions].sort((a, b) => b.updatedAt - a.updatedAt)[0];
  const preview = activeSession?.messages.at(-1)?.text ?? latestRecord?.messages.at(-1)?.text;
  const hasRecords = sessions.length > 0;

  const openChat = () => {
    if (activeSession) {
      router.push({ pathname: '/(tabs)/home/chat', params: { sessionId: activeSession.id } });
      return;
    }

    overlay.confirm({
      title: 'Start simulated chat?',
      message: `${chatConfig.prototypeNotice} Continuing acknowledges this prototype notice only; it is not legal Terms and Conditions or stored consent.`,
      confirmLabel: 'I understand, continue',
      cancelLabel: 'Cancel',
      onConfirm: () => {
        const sessionId = start();
        router.push({ pathname: '/(tabs)/home/chat', params: { sessionId } });
      },
    });
  };

  return (
    <View style={{ gap: theme.spacing.md }}>
      <Text style={{ color: theme.colors.textPrimary, fontFamily: theme.fontFamily.bold, fontSize: theme.typography.overlayTitle.fontSize, lineHeight: theme.typography.overlayTitle.lineHeight * fontScale }}>
        {activeSession ? 'Continue your chat' : hasRecords ? 'Your chat records' : 'Get support'}
      </Text>
      <View style={{ gap: theme.spacing.sm, borderWidth: theme.layout.standardBorderWidth, borderColor: theme.colors.border, borderRadius: theme.radius.lg, padding: theme.spacing.lg, backgroundColor: theme.colors.surface }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md }}>
          <View style={{ width: theme.size.brandMark, height: theme.size.brandMark, alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.md, backgroundColor: theme.colors.surfaceSubtle }}>
            <MaterialCommunityIcons name={chatConfig.icon} size={theme.size.supportActionIcon} color={theme.mode === 'light' ? chatConfig.accent : theme.colors.primary} />
          </View>
          <View style={{ flex: theme.layout.fill, gap: theme.spacing.xs }}>
            <Text style={{ color: theme.colors.textPrimary, fontFamily: theme.fontFamily.semibold, fontSize: theme.typography.body.fontSize }}>{activeSession ? 'Direct support guide' : hasRecords ? 'Recent simulated chat' : 'Chat us'}</Text>
            <Text style={{ color: theme.colors.textSecondary, fontFamily: theme.fontFamily.regular, fontSize: theme.typography.caption.fontSize }}>
              {activeSession ? 'Simulated chat · Active' : hasRecords ? `${sessions.length} local ${sessions.length === 1 ? 'record' : 'records'}` : 'Guided simulated support'}
            </Text>
          </View>
          {activeSession ? <MaterialCommunityIcons name="circle" size={theme.size.eyebrowDot} color={theme.colors.success} /> : null}
        </View>
        {preview ? (
          <Text numberOfLines={2} style={{ color: theme.colors.textSecondary, fontFamily: theme.fontFamily.regular, fontSize: theme.typography.caption.fontSize, lineHeight: theme.typography.caption.lineHeight * fontScale }}>{preview}</Text>
        ) : (
          <Text style={{ color: theme.colors.textSecondary, fontFamily: theme.fontFamily.regular, fontSize: theme.typography.caption.fontSize, lineHeight: theme.typography.caption.lineHeight * fontScale }}>{chatConfig.prototypeNotice}</Text>
        )}
        <View style={{ flexDirection: 'row', gap: theme.spacing.sm, marginTop: theme.spacing.xs }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={activeSession ? 'Continue chat' : 'Start chat'}
            onPress={openChat}
            style={({ pressed }) => ({ flex: theme.layout.fill, minHeight: theme.size.touchTarget, alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.pill, paddingHorizontal: theme.spacing.md, backgroundColor: theme.colors.primary, opacity: pressed ? theme.opacity.pressed : theme.opacity.full })}
          >
            <Text style={{ color: theme.colors.onPrimary, fontFamily: theme.fontFamily.semibold, fontSize: theme.typography.caption.fontSize }}>{activeSession ? 'Continue chat' : 'Chat us'}</Text>
          </Pressable>
          {hasRecords ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Manage chat records"
              onPress={() => router.push('/(tabs)/home/chat/record')}
              style={({ pressed }) => ({ flex: theme.layout.fill, minHeight: theme.size.touchTarget, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: theme.spacing.xs, borderWidth: theme.layout.standardBorderWidth, borderColor: theme.colors.border, borderRadius: theme.radius.pill, paddingHorizontal: theme.spacing.md, backgroundColor: theme.colors.surface, opacity: pressed ? theme.opacity.pressed : theme.opacity.full })}
            >
              <MaterialCommunityIcons name="text-box-edit-outline" size={theme.size.supportActionIcon} color={theme.colors.primary} />
              <Text style={{ color: theme.colors.primary, fontFamily: theme.fontFamily.semibold, fontSize: theme.typography.caption.fontSize }}>Manage chat</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
}
