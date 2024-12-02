// src/hooks/useChat.ts
import { useState, useCallback, useEffect } from "react";
import { v4 as uuidv4 } from "uuid"; // Import UUID package
import { Message } from "../types/chat";
import { WebSocketService } from "../services/socket";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);

  const existingConversationId = sessionStorage.getItem("conversationId");

  const conversationId = existingConversationId || uuidv4(); // Use existing or generate a new UUID
  if (!existingConversationId) {
    sessionStorage.setItem("conversationId", conversationId); // Store the new UUID in sessionStorage
  }

  const webSocketService = WebSocketService.getInstance(conversationId); // Use the UUID for the WebSocket connection
  console.log(`conversationId: ${conversationId}`);
  useEffect(() => {
    // Set up WebSocket listener
    webSocketService.onMessage(handleIncomingMessage);

    return () => {
      webSocketService.disconnect(); // Clean up on unmount
    };
  }, [webSocketService]);

  const sendMessage = useCallback(
    (content: string) => {
      // Removed conversationId parameter
      const userMessage: Message = {
        conversationId: conversationId, // Use the generated UUID
        role: "user",
        content,
        type: "user_response",
      };

      // Send message to WebSocket
      webSocketService.sendMessage(
        JSON.stringify({
          type: "bot_response",
          role: "assistant",
          content: `${content}`,
          conversationId,
        })
      );

      // Update state with the user message
      setMessages((prevMessages) => [...prevMessages, userMessage]);
    },
    [webSocketService, conversationId] // Added conversationId to dependencies
  );

  const handleIncomingMessage = (data: any) => {
    // Ensure data has the expected structure
    if (data && data.role) {
      const incomingMessage: Message = {
        conversationId: data.conversationId,
        role: data.role,
        content: data.content || "", // Default to empty string if content is not provided
        type: data.type || "bot_response", // Default type if not provided
      };

      // Update state with the incoming message
      setMessages((prevMessages) => [...prevMessages, incomingMessage]);
    } else {
      console.error("Invalid message format:", data); // Log error for invalid data
    }
  };

  return {
    messages,
    sendMessage,
  };
}
