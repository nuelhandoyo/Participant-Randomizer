import React, { useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { SelectionAnimation } from '../shared/SelectionAnimation';
import { ParticipantList } from '../shared/ParticipantList';
import { HolographicCard } from '../shared/HolographicCard';

export function ParticipantInterface() {
  const { state, dispatch } = useApp();

  // Listen for real-time updates from presenter
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'randomizer-state' && e.newValue) {
        try {
          const newState = JSON.parse(e.newValue);
          dispatch({ type: 'LOAD_STATE', payload: newState });
        } catch (error) {
          console.error('Failed to sync with presenter:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [dispatch]);

  const selectedParticipants = state.participants.filter(p => p.selected);
  const unselectedParticipants = state.participants.filter(p => !p.selected);

  return (
    <div className="min-h-screen bg-transparent p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">
            Participant View
          </h1>
          <p className="text-gray-300">
            Watch the selection process in real-time
          </p>
        </div>

        {/* Selection Animation */}
        <SelectionAnimation />

        {/* Status */}
        <div className="text-center">
          <HolographicCard className="p-4 inline-block">
            <div className="text-white">
              <span className="text-2xl font-bold">
                {unselectedParticipants.length}
              </span>
              <span className="text-gray-400 ml-2">participants remaining</span>
            </div>
            <div className="text-white mt-2">
              <span className="text-2xl font-bold text-emerald-400">
                {selectedParticipants.length}
              </span>
              <span className="text-gray-400 ml-2">selected</span>
            </div>
          </HolographicCard>
        </div>

        {/* Participant Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <HolographicCard className="p-6" glowColor="#FFA500">
            <ParticipantList
              participants={unselectedParticipants}
              title="Not Selected"
              emptyMessage="All participants have been selected!"
              glowColor="#FFA500"
            />
          </HolographicCard>

          <HolographicCard className="p-6" glowColor="#00FFA3">
            <ParticipantList
              participants={selectedParticipants}
              title="Selected"
              emptyMessage="No participants selected yet"
              showTimestamp={true}
              glowColor="#00FFA3"
            />
          </HolographicCard>
        </div>
      </div>
    </div>
  );
}