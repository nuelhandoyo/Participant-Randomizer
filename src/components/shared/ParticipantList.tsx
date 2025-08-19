import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Participant } from '../../types';
import { HolographicCard } from './HolographicCard';

interface ParticipantListProps {
  participants: Participant[];
  title: string;
  emptyMessage: string;
  showTimestamp?: boolean;
  glowColor?: string;
}

export function ParticipantList({ 
  participants, 
  title, 
  emptyMessage, 
  showTimestamp = false,
  glowColor = '#8B5FFF'
}: ParticipantListProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white flex items-center gap-2">
        <div 
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: glowColor, boxShadow: `0 0 10px ${glowColor}` }}
        />
        {title} ({participants.length})
      </h3>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {participants.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-500 text-center py-8"
            >
              {emptyMessage}
            </motion.div>
          ) : (
            participants.map((participant, index) => (
              <motion.div
                key={participant.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
              >
                <HolographicCard 
                  className="p-3"
                  glowColor={glowColor}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">
                      {participant.name}
                    </span>
                    {showTimestamp && participant.selectedAt && (
                      <span className="text-xs text-gray-400">
                        {new Date(participant.selectedAt).toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                </HolographicCard>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}