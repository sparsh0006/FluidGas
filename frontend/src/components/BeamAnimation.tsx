
import React, { useEffect, useRef } from 'react';

interface BeamAnimationProps {
  isActive?: boolean;
  elementRef: React.RefObject<HTMLDivElement>;
}

const BeamAnimation: React.FC<BeamAnimationProps> = ({ isActive = false, elementRef }) => {
  const beamsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!beamsRef.current || !elementRef.current) return;
    
    const element = elementRef.current;
    const beamsContainer = beamsRef.current;
    
    // Clear existing beams
    beamsContainer.innerHTML = '';
    
    // Create orbiting beams
    const beamCount = isActive ? 12 : 8;
    
    for (let i = 0; i < beamCount; i++) {
      const beam = document.createElement('div');
      beam.classList.add('beam');
      
      const angle = (i / beamCount) * 2 * Math.PI;
      const radius = element.offsetWidth / 2 + 15;
      
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      
      beam.style.left = `calc(50% + ${x}px)`;
      beam.style.top = `calc(50% + ${y}px)`;
      
      // Apply the animation with delay based on position
      beam.style.animation = `orbit ${isActive ? 2 : 3}s linear infinite`;
      beam.style.animationDelay = `${i * (1 / beamCount)}s`;
      
      // Add pulsing effect
      beam.style.opacity = '0.8';
      if (isActive) {
        beam.classList.add('animate-pulse-glow');
      }
      
      beamsContainer.appendChild(beam);
    }
  }, [isActive, elementRef]);
  
  return (
    <div 
      ref={beamsRef}
      className="absolute inset-0 pointer-events-none"
      style={{ 
        opacity: isActive ? 1 : 0.6,
        transition: 'opacity 0.3s ease-in-out'
      }}
    />
  );
};

export default BeamAnimation;
