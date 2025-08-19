import { useState, useCallback } from 'react';
import { useApp } from '../contexts/AppContext';
import { getRandomParticipant } from '../utils/animations';

export function useRandomSelection() {
  const { state, dispatch } = useApp();
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'shuffling' | 'selecting' | 'selected'>('idle');
  const [shuffleCount, setShuffleCount] = useState(0);

  const startRandomSelection = useCallback(async () => {
    const unselectedParticipants = state.participants.filter(p => !p.selected);
    if (unselectedParticipants.length === 0) return;

    // Reset animation state to ensure consistent restart
    setAnimationPhase('idle');
    setShuffleCount(0);
    
    // Small delay to ensure state reset is processed
    await new Promise(resolve => setTimeout(resolve, 100));

    dispatch({ type: 'SET_SELECTING', payload: true });
    setAnimationPhase('shuffling');

    // Shuffling phase - show multiple names rapidly
    const shuffleDuration = 3000;
    const shuffleInterval = 150;
    let currentShuffleCount = 0;
    const maxShuffles = shuffleDuration / shuffleInterval;

    const shuffleTimer = setInterval(() => {
      currentShuffleCount++;
      setShuffleCount(currentShuffleCount);
      
      if (currentShuffleCount >= maxShuffles) {
        clearInterval(shuffleTimer);
        setAnimationPhase('selecting');
        
        // Final selection
        setTimeout(() => {
          const selectedParticipant = getRandomParticipant(state.participants);
          if (selectedParticipant) {
            dispatch({ type: 'SELECT_PARTICIPANT', payload: selectedParticipant.id });
            setAnimationPhase('selected');
            
            setTimeout(() => {
              setAnimationPhase('idle');
              setShuffleCount(0);
            }, 2000);
          }
        }, 500);
      }
    }, shuffleInterval);
  }, [state.participants, dispatch]);

  // New shuffle function for reordering participants without selection
  const shuffleParticipants = useCallback(() => {
    const shuffledParticipants = [...state.participants].sort(() => Math.random() - 0.5);
    dispatch({ type: 'SET_PARTICIPANTS', payload: shuffledParticipants });
  }, [state.participants, dispatch]);

  return {
    startRandomSelection,
    shuffleParticipants,
    animationPhase,
    isSelecting: state.isSelecting,
    shuffleCount
  };
}