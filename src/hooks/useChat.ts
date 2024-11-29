import { useCallback, useEffect, useState } from "react";
import { WebSocketService } from "../services/socket";
import { Message, ChatState } from "../types/chat";

export function useChat() {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isTyping: false,
  });

  const conversationId = Date.now().toString();
  const webSocketService = WebSocketService.getInstance(conversationId);

  useEffect(() => {
    const handleThoughtUpdate = (thought: string, messageId: string) => {
      setChatState((prev) => ({
        ...prev,
        messages: prev.messages.map((msg) =>
          msg.id === messageId ? { ...msg, thought } : msg
        ),
        isTyping: true,
      }));
    };

    const handleBotResponse = (message: Message) => {
      setChatState((prev) => ({
        ...prev,
        messages: [...prev.messages, message],
        isTyping: false,
      }));
    };

    webSocketService.subscribeToThoughts(handleThoughtUpdate);
    webSocketService.subscribeToResponses(handleBotResponse);

    return () => {
      webSocketService.disconnect();
    };
  }, [webSocketService]);

  const sendMessage = useCallback(
    (content: string) => {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content,
      };

      setChatState((prev) => ({
        ...prev,
        messages: [...prev.messages, userMessage],
        isTyping: true,
      }));

      webSocketService.sendMessage(content);
    },
    [webSocketService]
  );

  return { messages: chatState.messages, sendMessage };
}
