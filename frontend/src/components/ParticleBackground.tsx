
import React, { useEffect, useRef } from 'react';
import { createNodes, createConnections, animateNodes } from '../utils/animations';

interface ParticleBackgroundProps {
  className?: string;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const nodes = createNodes(container, 30);
    createConnections(container, nodes, 150);
    animateNodes(nodes);
    
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      
      nodes.forEach((node, index) => {
        const nodeX = parseInt(node.style.left);
        const nodeY = parseInt(node.style.top);
        
        const distance = Math.sqrt(Math.pow(nodeX - x, 2) + Math.pow(nodeY - y, 2));
        
        if (distance < 150) {
          const angle = Math.atan2(nodeY - y, nodeX - x);
          const newX = nodeX + Math.cos(angle) * 5;
          const newY = nodeY + Math.sin(angle) * 5;
          
          node.style.left = `${newX}px`;
          node.style.top = `${newY}px`;
        }
      });
    };
    
    container.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className || ''}`}
    />
  );
};

export default ParticleBackground;
