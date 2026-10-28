import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View, useWindowDimensions, type ScrollViewInstance } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { chatSteps, type ChatSession } from '../../constants/chat';
import { useChat } from '../../hooks/useChat';
import { useOverlay } from '../../hooks/useOverlay';
import { useTheme } from '../../hooks/useTheme';

export function ChatConversation({ session }: { session: ChatSession | null }) {
  const { typingSessionId, choose, sendText } = useChat();
  const overlay = useOverlay();
  const { theme } = useTheme();
  const { fontScale } = useWindowDimensions();
  const [draft, setDraft] = useState('');
  const listRef = useRef<ScrollViewInstance>(null);
  const isTyping = session !== null && typingSessionId === session.id;
  const isReadOnly = session !== null && session.status !== 'active';
  const currentStep = session?.currentStepId ? chatSteps[session.currentStepId] : null;

  useEffect(() => setDraft(''), [session?.id]);
  useEffect(() => {
    listRef.current?.scrollToEnd({ animated: true });
  }, [isTyping, session?.messages.length]);

  const handleChoice = (choiceId: string) => {
    if (!session || !choose(session.id, choiceId)) {
      overlay.alert({ title: 'Chat choice unavailable', message: 'This session is no longer active. Return to your chat records to choose another session.' });
    }
  };

  const handleSend = () => {
    if (!session || isReadOnly || isTyping) return;
    if (!sendText(session.id, draft)) {
      overlay.alert({ title: 'Message not sent', message: 'This simulated message could not be added to the local conversation.' });
      return;
    }
    setDraft('');
  };

  if (!session) {
    return (
      <View style={{ flex: theme.layout.fill, justifyContent: 'center', gap: theme.spacing.lg, borderWidth: theme.layout.standardBorderWidth, borderColor: theme.colors.border, borderRadius: theme.radius.xl, padding: theme.spacing.xl, backgroundColor: theme.colors.surface }}>
        <MaterialCommunityIcons name="chat-alert-outline" size={theme.size.supportIcon} color={theme.colors.warning} />
        <Text style={{ color: theme.colors.textPrimary, fontFamily: theme.fontFamily.semibold, fontSize: theme.typography.heading.fontSize }}>No chat session selected</Text>
        <Text style={{ color: theme.colors.textSecondary, fontFamily: theme.fontFamily.regular, fontSize: theme.typography.body.fontSize, lineHeight: theme.typography.body.lineHeight * fontScale }}>
          Return to Home and choose Chat us to review the prototype notice before starting a conversation.
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: theme.layout.fill }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={{ flex: theme.layout.fill, gap: theme.spacing.sm }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, borderRadius: theme.radius.md, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, backgroundColor: theme.colors.infoSoft }}>
          <MaterialCommunityIcons name="shield-check-outline" size={theme.size.themeToggleIcon} color={theme.colors.info} />
          <Text style={{ flex: theme.layout.fill, color: theme.colors.info, fontFamily: theme.fontFamily.medium, fontSize: theme.typography.caption.fontSize, lineHeight: theme.typography.caption.lineHeight * fontScale }}>
            Simulated chat · Messages stay in this app unless you share them. Avoid personal or account details.
          </Text>
        </View>

        <ScrollView
          ref={listRef}
          style={{ flex: theme.layout.fill }}
          contentContainerStyle={{ gap: theme.spacing.md, paddingVertical: theme.spacing.sm }}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          accessibilityLabel="Chat messages"
        >
          {session.messages.map((message) => {
            const fromSystem = message.sender === 'system';
            return (
              <View key={message.id} style={{ alignSelf: fromSystem ? 'flex-start' : 'flex-end', maxWidth: '88%', gap: theme.spacing.xs }}>
                <View style={{ borderRadius: theme.radius.lg, borderBottomLeftRadius: fromSystem ? theme.radius.sm : theme.radius.lg, borderBottomRightRadius: fromSystem ? theme.radius.lg : theme.radius.sm, paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.md, backgroundColor: fromSystem ? theme.colors.surface : theme.colors.surfaceSubtle, borderWidth: fromSystem ? theme.layout.standardBorderWidth : theme.layout.noBorder, borderColor: theme.colors.border }}>
                  <Text style={{ color: theme.colors.textPrimary, fontFamily: fromSystem ? theme.fontFamily.regular : theme.fontFamily.medium, fontSize: theme.typography.body.fontSize, lineHeight: theme.typography.body.lineHeight * fontScale }}>{message.text}</Text>
                  <Text style={{ alignSelf: 'flex-end', marginTop: theme.spacing.xs, color: theme.colors.textMuted, fontFamily: theme.fontFamily.regular, fontSize: theme.typography.caption.fontSize }}>{new Date(message.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</Text>
                </View>
              </View>
            );
          })}
          {isTyping ? (
            <View accessibilityLabel="Direct support guide is typing" style={{ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, borderRadius: theme.radius.pill, paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.md, backgroundColor: theme.colors.surface, borderWidth: theme.layout.standardBorderWidth, borderColor: theme.colors.border }}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
              <Text style={{ color: theme.colors.textSecondary, fontFamily: theme.fontFamily.regular, fontSize: theme.typography.caption.fontSize }}>Direct is typing…</Text>
            </View>
          ) : null}
        </ScrollView>

        {session.status === 'active' && currentStep?.choices && !isTyping ? (
          <View style={{ gap: theme.spacing.xs }}>
            <Text style={{ color: theme.colors.textMuted, fontFamily: theme.fontFamily.semibold, fontSize: theme.typography.caption.fontSize }}>QUICK REPLIES</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: theme.spacing.sm }} accessibilityLabel="Suggested quick replies">
              {currentStep.choices.map((choice) => (
                <Pressable
                  key={choice.id}
                  accessibilityRole="button"
                  onPress={() => handleChoice(choice.id)}
                  style={({ pressed }) => ({ minHeight: theme.size.touchTarget, justifyContent: 'center', borderWidth: theme.layout.standardBorderWidth, borderColor: theme.colors.primary, borderRadius: theme.radius.pill, paddingHorizontal: theme.spacing.lg, backgroundColor: theme.colors.surface, opacity: pressed ? theme.opacity.pressed : theme.opacity.full })}
                >
                  <Text style={{ color: theme.colors.primary, fontFamily: theme.fontFamily.semibold, fontSize: theme.typography.caption.fontSize, lineHeight: theme.typography.caption.lineHeight * fontScale }}>{choice.label}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        ) : null}

        {isReadOnly ? (
          <View style={{ borderRadius: theme.radius.md, padding: theme.spacing.md, backgroundColor: theme.colors.surfaceSubtle }}>
            <Text style={{ color: theme.colors.textSecondary, fontFamily: theme.fontFamily.medium, fontSize: theme.typography.caption.fontSize, textAlign: 'center' }}>This chat is {session.status}. The transcript is read-only.</Text>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: theme.spacing.sm, borderWidth: theme.layout.standardBorderWidth, borderColor: theme.colors.border, borderRadius: theme.radius.xl, padding: theme.spacing.xs, backgroundColor: theme.colors.surface }}>
            <TextInput
              accessibilityLabel="Type a simulated chat message"
              editable={!isTyping}
              value={draft}
              onChangeText={setDraft}
              placeholder={isTyping ? 'Waiting for reply…' : 'Message'}
              placeholderTextColor={theme.colors.textMuted}
              multiline
              maxLength={500}
              style={{ flex: theme.layout.fill, maxHeight: theme.spacing.xxl * 3, minHeight: theme.size.touchTarget, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.md, color: theme.colors.textPrimary, fontFamily: theme.fontFamily.regular, fontSize: theme.typography.body.fontSize, lineHeight: theme.typography.body.lineHeight * fontScale }}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Send simulated message"
              accessibilityState={{ disabled: !draft.trim() || isTyping }}
              disabled={!draft.trim() || isTyping}
              onPress={handleSend}
              style={({ pressed }) => ({ width: theme.size.touchTarget, height: theme.size.touchTarget, alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.pill, backgroundColor: theme.colors.primary, opacity: !draft.trim() || isTyping ? theme.opacity.disabled : pressed ? theme.opacity.pressed : theme.opacity.full })}
            >
              <MaterialCommunityIcons name="send" size={theme.size.supportActionIcon} color={theme.colors.onPrimary} />
            </Pressable>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
