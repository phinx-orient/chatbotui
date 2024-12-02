// src/components/ChatMessage.tsx
import React from 'react';
import { Message } from '../types/chat';
import { Bot } from 'lucide-react';
import { User } from 'lucide-react'; 

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.role === 'assistant';

  return (
    <div className={`flex gap-3 ${isBot ? 'bg-blue-50' : 'bg-white'} p-4 rounded-lg transition-all duration-200`}>
      <div className="flex-shrink-0">
        {isBot ? (
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
        ) : (
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        )}
      </div>
      
      <div className="flex-1">
        <div className="prose max-w-none">
          {/* Always display message.content */}
          <p className="text-gray-800">{message.content}</p>
          <p className="text-sm text-gray-500">{message.type}</p>
        </div>
      </div>
    </div>
  );
}