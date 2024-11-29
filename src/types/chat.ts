export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  thought?: string;
  type: "thought_update" | "bot_response"; // Add this line
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
}
