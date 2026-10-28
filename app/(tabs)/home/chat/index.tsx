import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { AppScreen } from '../../../../src/components/shared/appScreen';
import { ChatConversation } from '../../../../src/components/chat/chatConversation';
import { useChat } from '../../../../src/hooks/useChat';
import { useTheme } from '../../../../src/hooks/useTheme';

export default function ChatScreen() {
  const router = useRouter();
  const { sessionId } = useLocalSearchParams<{ sessionId?: string }>();
  const { activeSession, getSession } = useChat();
  const { theme } = useTheme();
  const session = sessionId ? getSession(sessionId) : activeSession;

  return (
    <AppScreen
      scrollable={false}
      title="Chat us"
      subtitle="Your guided support conversation."
      showBack
      rightSlot={(
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open chat records"
          onPress={() => router.push('/(tabs)/home/chat/record')}
          style={({ pressed }) => ({ width: theme.size.touchTarget, height: theme.size.touchTarget, alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.pill, backgroundColor: theme.colors.surface, opacity: pressed ? theme.opacity.pressed : theme.opacity.full })}
        >
          <MaterialCommunityIcons name="text-box-multiple-outline" size={theme.size.supportActionIcon} color={theme.colors.primary} />
        </Pressable>
      )}
    >
      <ChatConversation session={session} />
    </AppScreen>
  );
}
