import { ChatContainer } from './components/ChatContainer';
import { ChatInput } from './components/ChatInput';
import { useChat } from './hooks/useChat';

function App() {
  const { messages, sendMessage } = useChat();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col"> 
      <div className="w-full h-full bg-white rounded-xl shadow-lg overflow-hidden flex flex-col flex-grow"> 
        <div className="bg-blue-600 p-4">
          <h1 className="text-white text-xl font-semibold">Neurond Ba Miền</h1>
        </div>
        
        <ChatContainer messages={messages} />
        
        <div className="p-4 border-t">
          <ChatInput 
            onSendMessage={sendMessage}
            disabled={false}
          />
        </div>
      </div>
    </div>
  );
}

export default App;