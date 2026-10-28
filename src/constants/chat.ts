import type { MaterialCommunityIcons } from '@expo/vector-icons';

export type ChatChoice = {
  id: string;
  label: string;
  nextStepId: string;
};

export type ChatStep = {
  id: string;
  prompt: string;
  choices?: ChatChoice[];
  response?: string;
};

export type ChatMessage = {
  id: string;
  sender: 'system' | 'you';
  text: string;
  createdAt: number;
};

export type ChatSession = {
  id: string;
  status: 'active' | 'completed' | 'ended';
  messages: ChatMessage[];
  currentStepId: string | null;
  updatedAt: number;
};

export const chatConfig = {
  icon: 'chat-processing-outline' as React.ComponentProps<typeof MaterialCommunityIcons>['name'],
  accent: '#0057B8',
  prototypeNotice: 'This is a simulated chat for a prototype. No real enquiry is sent and no live agent will respond.',
  typingDelayMs: 850,
} as const;

export const chatSteps: Record<string, ChatStep> = {
  start: {
    id: 'start',
    prompt: 'Hi! I’m Direct’s virtual support guide. What can I help you with today?',
    choices: [
      { id: 'mobile', label: 'Mobile service', nextStepId: 'mobile' },
      { id: 'billing', label: 'Bills and payments', nextStepId: 'billing' },
      { id: 'account', label: 'My account', nextStepId: 'account' },
    ],
  },
  mobile: {
    id: 'mobile',
    prompt: 'Which mobile service topic should we explore?',
    choices: [
      { id: 'coverage', label: 'Coverage or connection', nextStepId: 'coverage' },
      { id: 'data', label: 'Data and usage', nextStepId: 'data' },
    ],
  },
  billing: {
    id: 'billing',
    prompt: 'What would you like help understanding?',
    choices: [
      { id: 'bill', label: 'A bill amount', nextStepId: 'bill' },
      { id: 'payment', label: 'A payment', nextStepId: 'payment' },
    ],
  },
  account: {
    id: 'account',
    prompt: 'Choose an account topic.',
    choices: [
      { id: 'profile', label: 'Profile details', nextStepId: 'profile' },
      { id: 'security', label: 'Account access', nextStepId: 'security' },
    ],
  },
  coverage: { id: 'coverage', prompt: 'For this prototype, try checking your device network settings and coverage map. This is general guidance, not a live service check.' },
  data: { id: 'data', prompt: 'You can review data usage in your account’s usage section. This prototype cannot access your plan or usage.' },
  bill: { id: 'bill', prompt: 'Review the itemised bill in your account for charge details. This prototype cannot view or explain a real bill.' },
  payment: { id: 'payment', prompt: 'Payment status can be checked in your account after processing. This prototype does not take or verify payments.' },
  profile: { id: 'profile', prompt: 'You can manage the fictional profile in Settings. This chat does not access real account details.' },
  security: { id: 'security', prompt: 'Use the official account recovery options for access issues. This prototype cannot verify identity or change account access.' },
};

export function formatChatTranscript(session: ChatSession) {
  const lines = session.messages.map((message) => `${message.sender === 'system' ? 'Direct support guide' : 'You'}: ${message.text}`);
  return [
    'Direct — simulated chat transcript',
    'Prototype only. No real enquiry was sent and no live agent responded.',
    '',
    ...lines,
  ].join('\n');
}
