
import React from 'react';

const Navigation: React.FC = () => {
  return (
    <nav className="fixed top-0 w-full p-6 z-10">
      <div className="flex justify-between items-center">
        <div className="text-xl font-bold tracking-tight">
          FluidGas
        </div>
        <div className="flex space-x-8">
          <a href="#" className="text-white/80 hover:text-white transition-colors">About</a>
          <a href="#" className="text-white/80 hover:text-white transition-colors">Documentation</a>
          <a href="#" className="text-white/80 hover:text-white transition-colors">GitHub</a>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
