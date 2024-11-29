import { ChatMessage } from './ChatMessage';
import { Message } from '../types/chat';
import React, { useState } from 'react';

interface ChatContainerProps {
  messages: Message[];
}

export function ChatContainer({ messages }: ChatContainerProps) {
  const thoughtUpdates = messages.filter(message => message.type === "thought_update");

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((message) => {
        if (message.type === "bot_response") {
          // Render bot response normally
          return (
            <ChatMessage key={message.id} message={message} />
          );
        }
      })}
      {thoughtUpdates.length > 0 && (
        <ThoughtUpdateContainer thoughtUpdates={thoughtUpdates} />
      )}
    </div>
  );
}

const ThoughtUpdateContainer: React.FC<{ thoughtUpdates: Message[] }> = ({ thoughtUpdates }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-2">
      <div className="p-2 bg-yellow-100 border border-yellow-300 rounded">
        <strong onClick={() => setIsExpanded(!isExpanded)} className="cursor-pointer">
          Thought Updates {isExpanded ? '▲' : '▼'}
        </strong>
        {isExpanded && (
          <div className="mt-2">
            {thoughtUpdates.map((update) => (
              <div key={update.id}>{update.thought || "No thought provided."}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};