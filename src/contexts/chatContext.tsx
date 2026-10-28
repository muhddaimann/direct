import { createContext, useCallback, useEffect, useMemo, useRef, useState, type PropsWithChildren } from 'react';
import { chatConfig, chatSteps, type ChatMessage, type ChatSession } from '../constants/chat';
import { useAuth } from '../hooks/useAuth';

export type ChatContextValue = {
  sessions: ChatSession[];
  activeSession: ChatSession | null;
  typingSessionId: string | null;
  getSession: (id: string | undefined) => ChatSession | null;
  start: () => string;
  choose: (sessionId: string, choiceId: string) => boolean;
  sendText: (sessionId: string, text: string) => boolean;
  restart: (sessionId: string) => void;
  end: (sessionId: string) => void;
  clearAll: () => void;
};

export const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: PropsWithChildren) {
  const { session } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [typingSessionId, setTypingSessionId] = useState<string | null>(null);
  const nextSessionId = useRef(0);
  const replyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearReplyTimer = useCallback(() => {
    if (replyTimer.current) clearTimeout(replyTimer.current);
    replyTimer.current = null;
    setTypingSessionId(null);
  }, []);

  const clearAll = useCallback(() => {
    if (replyTimer.current) clearTimeout(replyTimer.current);
    replyTimer.current = null;
    setTypingSessionId(null);
    setSessions([]);
  }, []);

  useEffect(() => {
    clearAll();
  }, [clearAll, session?.createdAt]);

  useEffect(() => () => {
    if (replyTimer.current) clearTimeout(replyTimer.current);
  }, []);

  const getSession = useCallback((id: string | undefined) => {
    if (!id) return null;
    return sessions.find((item) => item.id === id) ?? null;
  }, [sessions]);

  const scheduleReply = useCallback((sessionId: string, text: string, statusAfterReply: ChatSession['status'] = 'active') => {
    if (replyTimer.current) clearTimeout(replyTimer.current);
    setTypingSessionId(sessionId);
    replyTimer.current = setTimeout(() => {
      const createdAt = Date.now();
      const message: ChatMessage = { id: `message-${createdAt}`, sender: 'system', text, createdAt };
      setSessions((current) => current.map((item) => item.id === sessionId
        ? { ...item, messages: [...item.messages, message], status: statusAfterReply, currentStepId: statusAfterReply === 'completed' ? null : item.currentStepId, updatedAt: createdAt }
        : item));
      replyTimer.current = null;
      setTypingSessionId(null);
    }, chatConfig.typingDelayMs);
  }, []);

  const start = useCallback(() => {
    const active = sessions.find((item) => item.status === 'active');
    if (active) return active.id;

    const createdAt = Date.now();
    const id = `chat-${createdAt}-${++nextSessionId.current}`;
    const next: ChatSession = { id, status: 'active', messages: [], currentStepId: 'start', updatedAt: createdAt };
    setSessions((current) => [...current, next]);
    scheduleReply(id, chatSteps.start.prompt);
    return id;
  }, [scheduleReply, sessions]);

  const choose = useCallback((sessionId: string, choiceId: string) => {
    const current = sessions.find((item) => item.id === sessionId && item.status === 'active');
    if (!current || current.currentStepId === null || typingSessionId === sessionId) return false;
    const step = current ? chatSteps[current.currentStepId ?? ''] : undefined;
    const choice = step?.choices?.find((item) => item.id === choiceId);
    const nextStep = choice ? chatSteps[choice.nextStepId] : undefined;
    if (!current || !choice || !nextStep) return false;

    const createdAt = Date.now();
    const replyStatus: ChatSession['status'] = nextStep.choices ? 'active' : 'completed';
    setSessions((all) => all.map((item) => item.id === sessionId
      ? {
          ...item,
          messages: [...item.messages, { id: `message-${createdAt}`, sender: 'you', text: choice.label, createdAt }],
          currentStepId: nextStep.id,
          updatedAt: createdAt,
        }
      : item));
    scheduleReply(sessionId, nextStep.prompt, replyStatus);
    return true;
  }, [scheduleReply, sessions, typingSessionId]);

  const sendText = useCallback((sessionId: string, rawText: string) => {
    const text = rawText.trim();
    const current = sessions.find((item) => item.id === sessionId && item.status === 'active');
    if (!current || !text || typingSessionId === sessionId) return false;
    const createdAt = Date.now();
    setSessions((all) => all.map((item) => item.id === sessionId
      ? { ...item, messages: [...item.messages, { id: `message-${createdAt}`, sender: 'you', text, createdAt }], updatedAt: createdAt }
      : item));
    scheduleReply(sessionId, 'Thanks for sharing. This is a simulated guide and cannot submit or review a real enquiry. You can choose one of the quick replies below.');
    return true;
  }, [scheduleReply, sessions, typingSessionId]);

  const restart = useCallback((sessionId: string) => {
    clearReplyTimer();
    const createdAt = Date.now();
    setSessions((all) => all.map((item) => item.id === sessionId
      ? { ...item, status: 'active', messages: [], currentStepId: 'start', updatedAt: createdAt }
      : item));
    scheduleReply(sessionId, chatSteps.start.prompt);
  }, [clearReplyTimer, scheduleReply]);

  const end = useCallback((sessionId: string) => {
    if (typingSessionId === sessionId) clearReplyTimer();
    const updatedAt = Date.now();
    setSessions((all) => all.map((item) => item.id === sessionId
      ? { ...item, status: 'ended', currentStepId: null, updatedAt }
      : item));
  }, [clearReplyTimer, typingSessionId]);

  const activeSession = sessions.find((item) => item.status === 'active') ?? null;
  const value = useMemo<ChatContextValue>(() => ({
    sessions,
    activeSession,
    typingSessionId,
    getSession,
    start,
    choose,
    sendText,
    restart,
    end,
    clearAll,
  }), [sessions, activeSession, typingSessionId, getSession, start, choose, sendText, restart, end, clearAll]);

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
