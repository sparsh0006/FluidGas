
import React, { useState } from 'react';
import MessageList, { Message } from './MessageList';
import PromptBar from './PromptBar';

interface ChatInterfaceProps {
  onBack: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  
  const handleSendMessage = (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate response (in a real app, this would be an API call)
    setTimeout(() => {
      const systemMessage: Message = {
        id: `system-${Date.now()}`,
        content: getSimulatedResponse(content),
        sender: 'system',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, systemMessage]);
    }, 1000);
  };
  
  const getSimulatedResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('bridge') || lowerMessage.includes('transfer')) {
      return "FluidGas supports bridging assets across Ethereum, Polygon, Arbitrum, Optimism, and Avalanche. To initiate a bridge, you'll need to connect your wallet first and select the source and destination chains.";
    }
    
    if (lowerMessage.includes('gas') || lowerMessage.includes('fee')) {
      return "FluidGas optimizes gas fees by batching transactions and finding the most efficient routes. Our protocol typically saves 15-30% on cross-chain transfer gas costs compared to traditional bridges.";
    }
    
    if (lowerMessage.includes('wallet') || lowerMessage.includes('connect')) {
      return "FluidGas supports MetaMask, WalletConnect, Coinbase Wallet, and other major Web3 wallets. To connect, you would click the 'Connect Wallet' button in the top right corner.";
    }
    
    return "I'm your FluidGas assistant, here to help with cross-chain bridging and gas optimization. Can you provide more details about what you're trying to accomplish?";
  };
  
  return (
    <div className="min-h-screen bg-black relative">
      <div className="fixed top-0 left-0 right-0 p-6 z-10 backdrop-blur-sm bg-black/50">
        <div className="flex items-center">
          <button 
            onClick={onBack}
            className="text-white/70 hover:text-white transition-colors"
          >
            ← Back
          </button>
          <h1 className="ml-4 text-xl font-bold">FluidGas Bridge Assistant</h1>
        </div>
      </div>
      
      <div className="container max-w-2xl mx-auto px-4 pt-24 pb-4">
        <MessageList messages={messages} />
      </div>
      
      <PromptBar onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatInterface;
