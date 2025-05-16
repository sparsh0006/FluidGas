
import React from 'react';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'system';
  timestamp: Date;
}

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="flex flex-col space-y-4 pt-4 pb-24">
      {messages.map((message, index) => (
        <div 
          key={message.id}
          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          style={{ 
            animationDelay: `${index * 0.1}s`,
            opacity: 0,
            animation: 'fade-in 0.3s ease-out forwards'
          }}
        >
          <div 
            className={`rounded-2xl px-4 py-3 max-w-[80%] ${
              message.sender === 'user' 
                ? 'bg-gradient-accent text-white' 
                : 'bg-white/10 backdrop-blur-sm'
            }`}
          >
            <p className="text-sm">{message.content}</p>
            <span className="text-xs opacity-60 mt-1 block text-right">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      ))}
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-white/60 text-lg mb-2">Welcome to FluidGas Bridge Assistant</p>
          <p className="text-white/40 max-w-md">Ask about cross-chain transfers, gas optimization, or bridging assets between networks.</p>
        </div>
      )}
    </div>
  );
};

export default MessageList;
