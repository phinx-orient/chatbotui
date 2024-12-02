import React, { useState } from 'react';
import { Message } from '../types/chat';
import { Bot, ChevronDown, ChevronUp } from 'lucide-react';
import { User } from 'lucide-react'; 

interface ChatMessageProps {
  message: Message;
}
// ... existing imports ...

export function ChatMessage({ message }: ChatMessageProps) {
  const [isThoughtExpanded, setIsThoughtExpanded] = useState(false);
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
          <p className="text-gray-800">{message.content}</p>
          <p className="text-sm text-gray-500">{message.type}</p>
        </div>
        
        {isBot && message.type === "thought_update" && (
          <div className="mt-2">
            <button
              onClick={() => setIsThoughtExpanded(!isThoughtExpanded)}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200"
            >
              {isThoughtExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Hide thought process
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Show thought process
                </>
              )}
            </button>
            
            {isThoughtExpanded && (
              <div className="mt-2 p-3 bg-blue-100 rounded-md animate-fadeIn">
                <p className="text-sm text-gray-700">{message.type}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}