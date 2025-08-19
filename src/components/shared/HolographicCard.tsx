import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface HolographicCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  isActive?: boolean;
}

export function HolographicCard({ 
  children, 
  className = '', 
  glowColor = '#00D4FF',
  isActive = false 
}: HolographicCardProps) {
  return (
    <motion.div
      className={`
        relative rounded-2xl backdrop-blur-md
        bg-gradient-to-br from-gray-900/80 to-gray-800/80
        border border-gray-700/50
        transition-all duration-300
        ${isActive ? 'scale-105' : 'hover:scale-102'}
        ${className}
      `}
      style={{
        boxShadow: isActive 
          ? `0 0 30px ${glowColor}50, inset 0 1px 0 rgba(255,255,255,0.1)`
          : '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
      }}
      whileHover={{ y: -2 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {isActive && (
        <div 
          className="absolute inset-0 rounded-2xl opacity-20 animate-pulse"
          style={{
            background: `linear-gradient(45deg, ${glowColor}20, transparent, ${glowColor}20)`
          }}
        />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}