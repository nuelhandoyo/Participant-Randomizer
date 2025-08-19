import React, { useState } from 'react';
import { Plus, UserPlus } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export function ManualEntry() {
  const { dispatch } = useApp();
  const [inputValue, setInputValue] = useState('');
  const [bulkInput, setBulkInput] = useState('');

  const handleAddSingle = () => {
    if (inputValue.trim()) {
      dispatch({ type: 'ADD_PARTICIPANT', payload: inputValue.trim() });
      setInputValue('');
    }
  };

  const handleAddBulk = () => {
    if (bulkInput.trim()) {
      const names = bulkInput
        .split('\n')
        .map(name => name.trim())
        .filter(name => name !== '');
      
      const participants = names.map(name => ({
        id: Date.now().toString() + Math.random(),
        name,
        selected: false
      }));
      
      dispatch({ type: 'SET_PARTICIPANTS', payload: participants });
      setBulkInput('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Single Entry */}
      <div className="space-y-3">
        <h4 className="text-lg font-semibold text-white flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-cyan-400" />
          Add Single Participant
        </h4>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddSingle()}
            placeholder="Enter participant name..."
            className="
              flex-1 px-4 py-2 rounded-lg
              bg-gray-800/80 border border-gray-600/50
              text-white placeholder-gray-400
              focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20
              focus:outline-none transition-all duration-300
            "
          />
          <button
            onClick={handleAddSingle}
            className="
              px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600
              hover:from-cyan-500 hover:to-blue-500
              text-white rounded-lg font-medium
              transition-all duration-300 flex items-center gap-2
              disabled:opacity-50 disabled:cursor-not-allowed
            "
            disabled={!inputValue.trim()}
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      {/* Bulk Entry */}
      <div className="space-y-3">
        <h4 className="text-lg font-semibold text-white">Bulk Entry</h4>
        <textarea
          value={bulkInput}
          onChange={(e) => setBulkInput(e.target.value)}
          placeholder="Paste participant names (one per line)..."
          rows={6}
          className="
            w-full px-4 py-3 rounded-lg
            bg-gray-800/80 border border-gray-600/50
            text-white placeholder-gray-400
            focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20
            focus:outline-none transition-all duration-300
            resize-none
          "
        />
        <button
          onClick={handleAddBulk}
          className="
            w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600
            hover:from-purple-500 hover:to-pink-500
            text-white rounded-lg font-medium
            transition-all duration-300
            disabled:opacity-50 disabled:cursor-not-allowed
          "
          disabled={!bulkInput.trim()}
        >
          Add All Participants
        </button>
      </div>
    </div>
  );
}