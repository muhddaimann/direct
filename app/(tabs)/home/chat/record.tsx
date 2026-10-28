import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Share, Pressable, Text, View, useWindowDimensions } from 'react-native';
import { useState } from 'react';
import { AppScreen } from '../../../../src/components/shared/appScreen';
import { formatChatTranscript, type ChatSession } from '../../../../src/constants/chat';
import { useChat } from '../../../../src/hooks/useChat';
import { useOverlay } from '../../../../src/hooks/useOverlay';
import { useTheme } from '../../../../src/hooks/useTheme';

type RecordTab = 'active' | 'inactive';

export default function ChatRecordScreen() {
  const router = useRouter();
  const { sessions, activeSession, restart, end } = useChat();
  const overlay = useOverlay();
  const { theme } = useTheme();
  const { fontScale } = useWindowDimensions();
  const [selectedTab, setSelectedTab] = useState<RecordTab>('active');
  const visibleSessions = sessions
    .filter((item) => selectedTab === 'active' ? item.status === 'active' : item.status !== 'active')
    .sort((a, b) => b.updatedAt - a.updatedAt);

  const shareSession = async (item: ChatSession) => {
    try {
      await Share.share({ title: 'Simulated chat transcript', message: formatChatTranscript(item) });
    } catch {
      overlay.alert({ title: 'Could not share transcript', message: 'The native share sheet could not be opened. Your chat remains saved locally for this session.' });
    }
  };

  const confirmRestart = () => {
    if (!activeSession) return;
    overlay.confirm({
      title: 'Restart this chat?',
      message: 'The active transcript will be cleared and the simulated greeting will start again.',
      confirmLabel: 'Restart chat',
      cancelLabel: 'Keep chat',
      onConfirm: () => restart(activeSession.id),
    });
  };

  const confirmEnd = () => {
    if (!activeSession) return;
    overlay.confirmDestructive({
      title: 'End this chat?',
      message: 'This moves the conversation to Inactive. It remains in memory until you sign out or restart the app. No enquiry is sent.',
      confirmLabel: 'End chat',
      cancelLabel: 'Keep chat',
      onConfirm: () => end(activeSession.id),
    });
  };

  const openSession = (item: ChatSession) => {
    router.push({ pathname: '/(tabs)/home/chat', params: { sessionId: item.id } });
  };

  return (
    <AppScreen title="Chat records" subtitle="Session-only simulated conversations." showBack>
      <View accessibilityRole="tablist" style={{ flexDirection: 'row', gap: theme.spacing.xs, borderRadius: theme.radius.pill, padding: theme.spacing.xs, backgroundColor: theme.colors.surfaceSubtle }}>
        {(['active', 'inactive'] as const).map((tab) => {
          const selected = selectedTab === tab;
          const count = sessions.filter((item) => tab === 'active' ? item.status === 'active' : item.status !== 'active').length;
          return (
            <Pressable
              key={tab}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              accessibilityLabel={`${tab === 'active' ? 'Active' : 'Inactive'} chats, ${count}`}
              onPress={() => setSelectedTab(tab)}
              style={({ pressed }) => ({ flex: theme.layout.fill, minHeight: theme.size.touchTarget, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: theme.spacing.xs, borderRadius: theme.radius.pill, backgroundColor: selected ? theme.colors.surface : 'transparent', opacity: pressed ? theme.opacity.pressed : theme.opacity.full, ...(selected ? theme.shadow.card : {}) })}
            >
              <Text style={{ color: selected ? theme.colors.primary : theme.colors.textSecondary, fontFamily: theme.fontFamily.semibold, fontSize: theme.typography.body.fontSize }}>{tab === 'active' ? 'Active' : 'Inactive'}</Text>
              <Text style={{ color: selected ? theme.colors.primary : theme.colors.textMuted, fontFamily: theme.fontFamily.medium, fontSize: theme.typography.caption.fontSize }}>{count}</Text>
            </Pressable>
          );
        })}
      </View>

      {selectedTab === 'active' && activeSession ? (
        <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
          <Pressable
            accessibilityRole="button"
            onPress={confirmRestart}
            style={({ pressed }) => ({ flex: theme.layout.fill, minHeight: theme.size.touchTarget, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: theme.spacing.xs, borderWidth: theme.layout.standardBorderWidth, borderColor: theme.colors.border, borderRadius: theme.radius.pill, backgroundColor: theme.colors.surface, opacity: pressed ? theme.opacity.pressed : theme.opacity.full })}
          >
            <MaterialCommunityIcons name="restart" size={theme.size.themeToggleIcon} color={theme.colors.primary} />
            <Text style={{ color: theme.colors.primary, fontFamily: theme.fontFamily.semibold, fontSize: theme.typography.caption.fontSize }}>Restart</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={confirmEnd}
            style={({ pressed }) => ({ flex: theme.layout.fill, minHeight: theme.size.touchTarget, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: theme.spacing.xs, borderWidth: theme.layout.standardBorderWidth, borderColor: theme.colors.danger, borderRadius: theme.radius.pill, backgroundColor: theme.colors.dangerSoft, opacity: pressed ? theme.opacity.pressed : theme.opacity.full })}
          >
            <MaterialCommunityIcons name="close-circle-outline" size={theme.size.themeToggleIcon} color={theme.colors.danger} />
            <Text style={{ color: theme.colors.danger, fontFamily: theme.fontFamily.semibold, fontSize: theme.typography.caption.fontSize }}>End chat</Text>
          </Pressable>
        </View>
      ) : null}

      {visibleSessions.length === 0 ? (
        <View style={{ alignItems: 'center', gap: theme.spacing.md, borderWidth: theme.layout.standardBorderWidth, borderColor: theme.colors.border, borderRadius: theme.radius.xl, padding: theme.spacing.xl, backgroundColor: theme.colors.surface }}>
          <MaterialCommunityIcons name={selectedTab === 'active' ? 'chat-plus-outline' : 'archive-outline'} size={theme.size.supportIcon} color={theme.colors.textMuted} />
          <Text style={{ color: theme.colors.textPrimary, fontFamily: theme.fontFamily.semibold, fontSize: theme.typography.heading.fontSize }}>{selectedTab === 'active' ? 'No active chat' : 'No inactive chats'}</Text>
          <Text style={{ color: theme.colors.textSecondary, fontFamily: theme.fontFamily.regular, fontSize: theme.typography.body.fontSize, lineHeight: theme.typography.body.lineHeight * fontScale, textAlign: 'center' }}>
            {selectedTab === 'active' ? 'Start a simulated chat from Home to see it here.' : 'Completed and ended chats appear here until you sign out or restart the app.'}
          </Text>
        </View>
      ) : (
        <View style={{ gap: theme.spacing.sm }}>
          {visibleSessions.map((item) => (
            <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, borderWidth: theme.layout.standardBorderWidth, borderColor: theme.colors.border, borderRadius: theme.radius.lg, padding: theme.spacing.sm, backgroundColor: theme.colors.surface }}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Open ${item.status} chat session`}
                onPress={() => openSession(item)}
                style={({ pressed }) => ({ flex: theme.layout.fill, minHeight: theme.size.touchTarget + theme.spacing.sm, flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, paddingHorizontal: theme.spacing.sm, opacity: pressed ? theme.opacity.pressed : theme.opacity.full })}
              >
                <MaterialCommunityIcons name={item.status === 'active' ? 'chat-processing-outline' : 'chat-outline'} size={theme.size.supportActionIcon} color={item.status === 'active' ? theme.colors.success : theme.colors.textMuted} />
                <View style={{ flex: theme.layout.fill, gap: theme.spacing.xs }}>
                  <Text style={{ color: theme.colors.textPrimary, fontFamily: theme.fontFamily.semibold, fontSize: theme.typography.body.fontSize }}>{item.status === 'active' ? 'Active chat' : item.status === 'completed' ? 'Completed chat' : 'Ended chat'}</Text>
                  <Text numberOfLines={1} style={{ color: theme.colors.textSecondary, fontFamily: theme.fontFamily.regular, fontSize: theme.typography.caption.fontSize }}>{item.messages.at(-1)?.text ?? 'Waiting for the simulated greeting…'}</Text>
                  <Text style={{ color: theme.colors.textMuted, fontFamily: theme.fontFamily.regular, fontSize: theme.typography.caption.fontSize }}>{new Date(item.updatedAt).toLocaleString()}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={theme.size.supportActionIcon} color={theme.colors.textMuted} />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Share chat transcript"
                accessibilityState={{ disabled: item.messages.length === 0 }}
                disabled={item.messages.length === 0}
                onPress={() => { void shareSession(item); }}
                style={({ pressed }) => ({ width: theme.size.touchTarget, height: theme.size.touchTarget, alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.pill, backgroundColor: theme.colors.surfaceSubtle, opacity: item.messages.length === 0 ? theme.opacity.disabled : pressed ? theme.opacity.pressed : theme.opacity.full })}
              >
                <MaterialCommunityIcons name="share-variant-outline" size={theme.size.themeToggleIcon} color={theme.colors.primary} />
              </Pressable>
            </View>
          ))}
        </View>
      )}
      <Text style={{ color: theme.colors.textMuted, fontFamily: theme.fontFamily.regular, fontSize: theme.typography.caption.fontSize, lineHeight: theme.typography.caption.lineHeight * fontScale }}>
        Sharing opens your device’s share sheet. Only share content you’re comfortable sending outside this app.
      </Text>
    </AppScreen>
  );
}
