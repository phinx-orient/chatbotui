import { useState, useCallback, useEffect } from "react";
import { v4 as uuidv4 } from "uuid"; // Import UUID package
import { Message } from "../types/chat";
import { WebSocketService } from "../services/socket";
import axios from "axios";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);

  const existingConversationId = sessionStorage.getItem("conversationId");
  const conversationId = existingConversationId || uuidv4();

  if (!existingConversationId) {
    sessionStorage.setItem("conversationId", conversationId); // Store the new UUID in sessionStorage
  }

  const webSocketService = WebSocketService.getInstance(conversationId); // Use the UUID for the WebSocket connection
  console.log(`conversationId: ${conversationId}`);

  useEffect(() => {
    webSocketService.onMessage(handleIncomingMessage);

    return () => {
      webSocketService.disconnect(); // Clean up on unmount
    };
  }, [webSocketService]);

  const sendMessage = useCallback(
    async (content: string) => {
      const userMessage: Message = {
        conversationId: conversationId,
        role: "user",
        content,
        type: "user_response",
        tool_kwargs: "",
        tool_name: "",
      };

      // Update state with the user message immediately
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      // Send message to WebSocket
      webSocketService.sendMessage(
        JSON.stringify({
          type: "user_response",
          role: "user", // Corrected role to "user"
          content: `${content}`,
          conversationId,
        })
      );

      const baseUrl = "http://localhost:8007/api/llm/stream/default"; // Endpoint URL

      try {
        const request_user_id = "85223331-fe08-4cae-b95c-7dfc1b23d622";
        const requestBody = {
          request_message: content,
          model_id: 1,
          conversation_id: conversationId,
        };

        // Make the POST request with headers
        const response = await axios.post(baseUrl, requestBody, {
          headers: {
            "request-user-id": request_user_id,
          },
        });

        if (response.status === 405) {
          console.error("Method Not Allowed");
        } else {
          console.log("Response:", response.data);
          return response.data; // Return the data from the response
        }
      } catch (error) {
        console.error("Error calling streaming endpoint:", error);
      }
    }, // Fixed the missing comma here
    [webSocketService, conversationId] // Added conversationId to dependencies
  );

  const handleIncomingMessage = (data: any) => {
    try {
      console.log("Raw incoming data:", data); // Log the raw incoming data
      const parsedData = typeof data === "string" ? JSON.parse(data) : data; // Check if data is a string before parsing

      if (parsedData && parsedData.type === "thought_update") {
        const incomingMessage: Message = {
          conversationId: parsedData.conversation_id,
          role: "assistant",
          type: "thought_update",
          tool_kwargs: JSON.stringify(parsedData.tool_kwargs || {}), // Ensure tool_kwargs is in JSON format
          tool_name: parsedData.tool_name || "",
          content: "",
        };

        // Update state with the incoming message
        setMessages((prevMessages) => [...prevMessages, incomingMessage]);
      } else {
        console.error("Invalid message format:", parsedData);
      }
    } catch (error) {
      console.error("Error parsing incoming message:", error);
    }
  };

  return {
    messages,
    sendMessage,
  };
}
