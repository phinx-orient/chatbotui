import { useState, useEffect, useCallback } from 'react';
import { ChatState, Message } from '../types/chat';
import { WebSocketService } from '../services/socket';

export function useChat() {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [
      {
        id: '1',
        role: 'assistant',
        content: 'Hello! How can I help you today?',
        thought: 'Initiating conversation with a friendly greeting.'
      }
    ],
    isTyping: false
  });

  useEffect(() => {
    const ws = WebSocketService.getInstance();

    ws.subscribeToThoughts((thought, messageId) => {
      setChatState(prev => ({
        ...prev,
        messages: prev.messages.map(msg =>
          msg.id === messageId 
            ? { ...msg, thought } 
            : msg
        ),
        isTyping: true // Keep typing indicator while thoughts are being processed
      }));
    });

    ws.subscribeToResponses((message) => {
      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, message],
        isTyping: false
      }));
    });

    return () => {
      ws.disconnect();
    };
  }, []);

  const sendMessage = useCallback((content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isTyping: true
    }));

    WebSocketService.getInstance().sendMessage(content);
  }, []);

  return {
    messages: chatState.messages,
    isTyping: chatState.isTyping,
    sendMessage
  };
}