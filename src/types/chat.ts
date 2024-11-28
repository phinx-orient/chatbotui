export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  thought?: string;
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
}