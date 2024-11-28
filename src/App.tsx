import React from 'react';
import { ChatContainer } from './components/ChatContainer';
import { ChatInput } from './components/ChatInput';
import { useChat } from './hooks/useChat';

function App() {
  const { messages, isTyping, sendMessage } = useChat();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-[80vh]">
        <div className="bg-blue-600 p-4">
          <h1 className="text-white text-xl font-semibold">AI Assistant</h1>
        </div>
        
        <ChatContainer messages={messages} />
        
        <div className="p-4 border-t">
          <ChatInput 
            onSendMessage={sendMessage}
            disabled={isTyping}
          />
        </div>
      </div>
    </div>
  );
}

export default App;