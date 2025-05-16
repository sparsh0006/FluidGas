
import React from 'react';
import { Button } from '@/components/ui/button';
import ParticleBackground from './ParticleBackground';

interface HeroProps {
  onLaunchApp: () => void;
}

const Hero: React.FC<HeroProps> = ({ onLaunchApp }) => {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      <ParticleBackground />
      
      <div className="relative z-10 text-center px-4">
        <div className="flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-fade-in">
            FluidGas
          </h1>
          
          <p className="text-lg md:text-xl text-white/80 max-w-lg mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Seamless cross-chain asset transfers with optimized gas efficiency
          </p>
          
          <Button 
            onClick={onLaunchApp}
            className="bg-gradient-accent hover:opacity-90 text-white px-8 py-6 rounded-lg text-lg transition-all duration-300 animate-fade-in purple-glow"
            style={{ animationDelay: '0.4s' }}
          >
            Launch App
          </Button>
        </div>
        
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 rounded-lg backdrop-blur-sm bg-white/5 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <h3 className="text-xl font-semibold mb-2">Optimized Bridging</h3>
            <p className="text-white/70">Advanced gas optimization across multiple blockchain networks</p>
          </div>
          
          <div className="p-6 rounded-lg backdrop-blur-sm bg-white/5 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <h3 className="text-xl font-semibold mb-2">Multi-Chain Support</h3>
            <p className="text-white/70">Seamlessly bridge assets across all major blockchain ecosystems</p>
          </div>
          
          <div className="p-6 rounded-lg backdrop-blur-sm bg-white/5 animate-fade-in" style={{ animationDelay: '1s' }}>
            <h3 className="text-xl font-semibold mb-2">Secure Transfers</h3>
            <p className="text-white/70">Industry-leading security protocols for all cross-chain operations</p>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-0 right-0 text-center text-white/50 text-sm animate-fade-in" style={{ animationDelay: '1.2s' }}>
        © 2025 FluidGas Protocol
      </div>
    </div>
  );
};

export default Hero;
