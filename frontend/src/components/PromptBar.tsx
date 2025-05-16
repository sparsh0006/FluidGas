
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import BeamAnimation from './BeamAnimation';

interface PromptBarProps {
  onSendMessage: (message: string) => void;
}

const PromptBar: React.FC<PromptBarProps> = ({ onSendMessage }) => {
  const [prompt, setPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const promptContainerRef = useRef<HTMLDivElement>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (prompt.trim()) {
      onSendMessage(prompt);
      setPrompt('');
      setIsTyping(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 pb-6 px-4">
      <div 
        ref={promptContainerRef}
        className="relative max-w-2xl mx-auto"
      >
        <BeamAnimation isActive={isTyping} elementRef={promptContainerRef} />
        
        <form 
          onSubmit={handleSubmit}
          className="relative backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl overflow-hidden purple-glow"
          style={{ 
            boxShadow: isTyping 
              ? '0 0 15px rgba(155, 135, 245, 0.4)' 
              : '0 0 5px rgba(155, 135, 245, 0.2)'
          }}
        >
          <textarea
            value={prompt}
            onChange={handleChange}
            placeholder="Ask about bridging assets..."
            className="w-full bg-transparent text-white p-4 pr-16 outline-none resize-none max-h-32 min-h-[60px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            rows={1}
            style={{
              height: prompt.length > 80 ? '120px' : '60px',
              transition: 'height 0.2s ease'
            }}
          />
          
          <Button
            type="submit"
            disabled={!prompt.trim()}
            className="absolute right-2 bottom-2 p-2 rounded-lg bg-accent text-white opacity-90 hover:opacity-100 transition-opacity"
            aria-label="Send message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" />
            </svg>
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PromptBar;
