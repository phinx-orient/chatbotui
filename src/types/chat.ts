export interface Message {
  conversationId: string;
  content: string;
  role: "user" | "assistant";
  type: "thought_update" | "bot_response" | "user_response"; // Add this line
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
}
