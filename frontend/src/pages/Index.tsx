
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import ChatInterface from '@/components/ChatInterface';

const Index = () => {
  const [showChat, setShowChat] = useState(false);
  
  const handleLaunchApp = () => {
    setShowChat(true);
  };
  
  const handleBackToLanding = () => {
    setShowChat(false);
  };
  
  return (
    <div className="min-h-screen bg-black text-white">
      {showChat ? (
        <ChatInterface onBack={handleBackToLanding} />
      ) : (
        <>
          <Navigation />
          <Hero onLaunchApp={handleLaunchApp} />
        </>
      )}
    </div>
  );
};

export default Index;
