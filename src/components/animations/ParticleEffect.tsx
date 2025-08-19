import React, { useEffect, useRef } from 'react';

interface ParticleEffectProps {
  isActive: boolean;
  intensity?: number;
}

export function ParticleEffect({ isActive, intensity = 20 }: ParticleEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const particles: HTMLDivElement[] = [];

    for (let i = 0; i < intensity; i++) {
      const particle = document.createElement('div');
      particle.className = 'floating-particle';
      particle.style.cssText = `
        position: absolute;
        width: ${2 + Math.random() * 4}px;
        height: ${2 + Math.random() * 4}px;
        background: linear-gradient(45deg, 
          hsl(${190 + Math.random() * 50}, 100%, ${60 + Math.random() * 20}%), 
          hsl(${250 + Math.random() * 50}, 100%, ${60 + Math.random() * 20}%)
        );
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        opacity: ${0.6 + Math.random() * 0.4};
        animation: particleFloat ${3 + Math.random() * 4}s infinite ease-in-out;
        animation-delay: ${Math.random() * 2}s;
        box-shadow: 0 0 ${4 + Math.random() * 6}px currentColor;
      `;
      
      container.appendChild(particle);
      particles.push(particle);
    }

    return () => {
      particles.forEach(particle => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      });
    };
  }, [isActive, intensity]);

  if (!isActive) return null;

  return <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden" />;
}