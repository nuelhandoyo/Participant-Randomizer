import React from 'react';
import { Download, RotateCcw, Play, Shuffle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useRandomSelection } from '../../hooks/useRandomSelection';
import { exportToCSV } from '../../utils/csvUtils';
import { SelectionAnimation } from '../shared/SelectionAnimation';
import { ParticipantList } from '../shared/ParticipantList';
import { FileUpload } from './FileUpload';
import { ManualEntry } from './ManualEntry';
import { HolographicCard } from '../shared/HolographicCard';

export function PresenterInterface() {
  const { state, dispatch } = useApp();
  const { startRandomSelection, shuffleParticipants, isSelecting, shuffleCount } = useRandomSelection();

  const handleExport = () => {
    exportToCSV(state.participants, `participants-${new Date().toISOString().split('T')[0]}`);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all selections?')) {
      dispatch({ type: 'RESET_SELECTION' });
    }
  };

  const handleSelectionComplete = (participantId: string) => {
    dispatch({ type: 'SELECT_PARTICIPANT', payload: participantId });
  };

  const selectedParticipants = state.participants.filter(p => p.selected);
  const unselectedParticipants = state.participants.filter(p => !p.selected);

  return (
    <div className="min-h-screen bg-transparent p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">
            Presenter Control Panel
          </h1>
          <p className="text-gray-300">
            Upload participants and control the selection process
          </p>
        </div>

        {/* Control Panel */}
        <HolographicCard className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upload Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Import Participants</h3>
              <FileUpload />
            </div>

            {/* Manual Entry Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Manual Entry</h3>
              <ManualEntry />
            </div>

            {/* Actions Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={startRandomSelection}
                  disabled={isSelecting || unselectedParticipants.length === 0}
                  className="
                    w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600
                    hover:from-green-500 hover:to-emerald-500
                    disabled:from-gray-600 disabled:to-gray-600
                    text-white rounded-lg font-medium
                    transition-all duration-300 flex items-center justify-center gap-2
                    disabled:cursor-not-allowed
                  "
                >
                  <Play className="w-5 h-5" />
                  {isSelecting ? 'Selecting...' : 'Start Selection'}
                </button>

                <button
                  onClick={shuffleParticipants}
                  disabled={state.participants.length === 0 || isSelecting}
                  className="
                    w-full px-4 py-3 bg-gradient-to-r from-orange-600 to-yellow-600
                    hover:from-orange-500 hover:to-yellow-500
                    disabled:from-gray-600 disabled:to-gray-600
                    text-white rounded-lg font-medium
                    transition-all duration-300 flex items-center justify-center gap-2
                    disabled:cursor-not-allowed
                  "
                >
                  <Shuffle className="w-5 h-5" />
                  Shuffle List
                </button>

                <button
                  onClick={handleExport}
                  disabled={state.participants.length === 0}
                  className="
                    w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600
                    hover:from-blue-500 hover:to-cyan-500
                    disabled:from-gray-600 disabled:to-gray-600
                    text-white rounded-lg font-medium
                    transition-all duration-300 flex items-center justify-center gap-2
                    disabled:cursor-not-allowed
                  "
                >
                  <Download className="w-5 h-5" />
                  Export CSV
                </button>

                <button
                  onClick={handleReset}
                  disabled={selectedParticipants.length === 0}
                  className="
                    w-full px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600
                    hover:from-red-500 hover:to-pink-500
                    disabled:from-gray-600 disabled:to-gray-600
                    text-white rounded-lg font-medium
                    transition-all duration-300 flex items-center justify-center gap-2
                    disabled:cursor-not-allowed
                  "
                >
                  <RotateCcw className="w-5 h-5" />
                  Reset Selections
                </button>
              </div>
            </div>
          </div>
        </HolographicCard>

        {/* Selection Animation */}
        <SelectionAnimation onSelectionComplete={handleSelectionComplete} shuffleCount={shuffleCount} />

        {/* Participant Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <HolographicCard className="p-6" glowColor="#FFA500">
            <ParticipantList
              participants={unselectedParticipants}
              title="Waiting to be Selected"
              emptyMessage="No participants waiting"
              glowColor="#FFA500"
            />
          </HolographicCard>

          <HolographicCard className="p-6" glowColor="#00FFA3">
            <ParticipantList
              participants={selectedParticipants}
              title="Selected Participants"
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