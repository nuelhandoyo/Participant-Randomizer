import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Participant, AppState } from '../types';

type AppAction = 
  | { type: 'SET_PARTICIPANTS'; payload: Participant[] }
  | { type: 'ADD_PARTICIPANT'; payload: string }
  | { type: 'SELECT_PARTICIPANT'; payload: string }
  | { type: 'SET_SELECTING'; payload: boolean }
  | { type: 'RESET_SELECTION' }
  | { type: 'LOAD_STATE'; payload: AppState };

const initialState: AppState = {
  participants: [],
  isSelecting: false,
  selectedParticipant: null
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_PARTICIPANTS':
      return {
        ...state,
        participants: action.payload
      };
    
    case 'ADD_PARTICIPANT': {
      const newParticipant: Participant = {
        id: Date.now().toString(),
        name: action.payload,
        selected: false
      };
      return {
        ...state,
        participants: [...state.participants, newParticipant]
      };
    }
    
    case 'SELECT_PARTICIPANT': {
      const updatedParticipants = state.participants.map(p => 
        p.id === action.payload 
          ? { ...p, selected: true, selectedAt: new Date().toISOString() }
          : p
      );
      const selectedParticipant = updatedParticipants.find(p => p.id === action.payload) || null;
      
      return {
        ...state,
        participants: updatedParticipants,
        selectedParticipant,
        isSelecting: false
      };
    }
    
    case 'SET_SELECTING':
      return {
        ...state,
        isSelecting: action.payload
      };
    
    case 'RESET_SELECTION':
      return {
        ...state,
        participants: state.participants.map(p => ({ 
          ...p, 
          selected: false, 
          selectedAt: undefined 
        })),
        selectedParticipant: null,
        isSelecting: false
      };
    
    case 'LOAD_STATE':
      return action.payload;
    
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem('randomizer-state', JSON.stringify(state));
    
    // Emit custom event for real-time sync
    window.dispatchEvent(new CustomEvent('randomizer-update', { 
      detail: state 
    }));
  }, [state]);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('randomizer-state');
    if (savedState) {
      try {
        dispatch({ type: 'LOAD_STATE', payload: JSON.parse(savedState) });
      } catch (error) {
        console.error('Failed to load saved state:', error);
      }
    }
  }, []);

  // Listen for real-time updates
  useEffect(() => {
    const handleUpdate = (event: CustomEvent) => {
      dispatch({ type: 'LOAD_STATE', payload: event.detail });
    };

    window.addEventListener('randomizer-update', handleUpdate as EventListener);
    
    return () => {
      window.removeEventListener('randomizer-update', handleUpdate as EventListener);
    };
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}