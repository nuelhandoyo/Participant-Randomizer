import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../contexts/AppContext';
import { getRandomParticipant } from '../../utils/animations';
import { ParticleEffect } from '../animations/ParticleEffect';
import { HolographicCard } from './HolographicCard';

interface SelectionAnimationProps {
  onSelectionComplete?: (participantId: string) => void;
  shuffleCount?: number;
}

export function SelectionAnimation({ onSelectionComplete, shuffleCount = 0 }: SelectionAnimationProps) {
  const { state } = useApp();
  const [shufflingName, setShufflingName] = useState<string>('');
  const [isShuffling, setIsShuffling] = useState(false);

  useEffect(() => {
    // Reset shuffling name when animation starts fresh
    if (shuffleCount === 0 && state.isSelecting) {
      setShufflingName('');
    }
  }, [shuffleCount, state.isSelecting]);

  useEffect(() => {
    if (!state.isSelecting) return;

    setIsShuffling(true);
    const unselectedParticipants = state.participants.filter(p => !p.selected);
    
    if (unselectedParticipants.length === 0) {
      setIsShuffling(false);
      return;
    }

    let currentShuffleCount = 0;
    const maxShuffles = 20;
    const shuffleInterval = setInterval(() => {
      const randomParticipant = getRandomParticipant(state.participants);
      if (randomParticipant) {
        setShufflingName(randomParticipant.name);
      }
      
      currentShuffleCount++;
      if (currentShuffleCount >= maxShuffles) {
        clearInterval(shuffleInterval);
        setIsShuffling(false);
        
        // Final selection
        const finalParticipant = getRandomParticipant(state.participants);
        if (finalParticipant && onSelectionComplete) {
          onSelectionComplete(finalParticipant.id);
        }
      }
    }, 150);

    return () => clearInterval(shuffleInterval);
  }, [state.isSelecting, state.participants, onSelectionComplete]);

  const displayName = state.selectedParticipant?.name || shufflingName || 'Click to select...';
  const isActive = state.isSelecting || Boolean(state.selectedParticipant);

  return (
    <div className="relative min-h-[200px] flex items-center justify-center bg-transparent">
      <ParticleEffect isActive={isActive} intensity={15} />
      
      <HolographicCard 
        className="p-8 min-w-[300px] text-center"
        isActive={isActive}
        glowColor={state.selectedParticipant ? '#00FFA3' : '#00D4FF'}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${displayName}-${shuffleCount}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              textShadow: isActive ? '0 0 20px currentColor' : 'none'
            }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.3 }}
            className={`
              text-2xl font-bold
              ${state.selectedParticipant 
                ? 'text-emerald-400' 
                : isShuffling 
                  ? 'text-cyan-400' 
                  : 'text-gray-400'
              }
            `}
          >
            {displayName}
          </motion.div>
        </AnimatePresence>
        
        {state.selectedParticipant && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-sm text-emerald-300"
          >
            Selected at {new Date(state.selectedParticipant.selectedAt!).toLocaleTimeString()}
          </motion.div>
        )}
      </HolographicCard>
    </div>
  );
}