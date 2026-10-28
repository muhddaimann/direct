import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';
import { chatConfig } from '../../constants/chat';
import { useChat } from '../../hooks/useChat';
import { useTheme } from '../../hooks/useTheme';

export function ChatHomeSection() {
  const router = useRouter();
  const { activeSession, sessions } = useChat();
  const { theme } = useTheme();
  const { fontScale } = useWindowDimensions();
  const recentSession = [...sessions].sort((a, b) => b.updatedAt - a.updatedAt)[0];
  const session = activeSession ?? recentSession;

  if (!session) return null;

  const active = session.status === 'active';

  return (
    <View style={{ gap: theme.spacing.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: theme.spacing.md }}>
        <Text style={{ color: theme.colors.textPrimary, fontFamily: theme.fontFamily.bold, fontSize: theme.typography.overlayTitle.fontSize, lineHeight: theme.typography.overlayTitle.lineHeight * fontScale }}>{active ? 'Continue your chat' : 'Recent chat'}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="View all chat records" onPress={() => router.push('/(tabs)/home/chat/record')} style={({ pressed }) => ({ minHeight: theme.size.touchTarget, justifyContent: 'center', opacity: pressed ? theme.opacity.pressed : theme.opacity.full })}>
          <Text style={{ color: theme.colors.primary, fontFamily: theme.fontFamily.semibold, fontSize: theme.typography.caption.fontSize }}>View all</Text>
        </Pressable>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, borderWidth: theme.layout.standardBorderWidth, borderColor: theme.colors.border, borderRadius: theme.radius.lg, padding: theme.spacing.lg, backgroundColor: theme.colors.surface, ...theme.shadow.card }}>
        <View style={{ width: theme.size.brandMark, height: theme.size.brandMark, alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.md, backgroundColor: theme.colors.surfaceSubtle }}>
          <MaterialCommunityIcons name={chatConfig.icon} size={theme.size.supportActionIcon} color={theme.mode === 'light' ? chatConfig.accent : theme.colors.primary} />
        </View>
        <View style={{ flex: theme.layout.fill, gap: theme.spacing.xs }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs }}>
            <Text style={{ color: theme.colors.textPrimary, fontFamily: theme.fontFamily.semibold, fontSize: theme.typography.body.fontSize }}>{active ? 'Direct support guide' : session.status === 'completed' ? 'Completed chat' : 'Ended chat'}</Text>
            {active ? <MaterialCommunityIcons name="circle" size={theme.size.eyebrowDot} color={theme.colors.success} /> : null}
          </View>
          <Text style={{ color: theme.colors.textSecondary, fontFamily: theme.fontFamily.regular, fontSize: theme.typography.caption.fontSize, lineHeight: theme.typography.caption.lineHeight * fontScale }}>{active ? 'Session-only · Ready to continue' : 'Session-only · View transcript'}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={active ? 'Continue active chat' : 'View recent chat'}
          onPress={() => router.push({ pathname: '/(tabs)/home/chat', params: { sessionId: session.id } })}
          style={({ pressed }) => ({ width: theme.size.touchTarget, height: theme.size.touchTarget, alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.pill, backgroundColor: theme.colors.surfaceSubtle, opacity: pressed ? theme.opacity.pressed : theme.opacity.full })}
        >
          <MaterialCommunityIcons name={active ? 'arrow-right' : 'text-box-outline'} size={theme.size.supportActionIcon} color={theme.colors.primary} />
        </Pressable>
      </View>
    </View>
  );
}
