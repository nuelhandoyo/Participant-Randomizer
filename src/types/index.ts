export interface Participant {
  id: string;
  name: string;
  selected: boolean;
  selectedAt?: string;
}

export interface AppState {
  participants: Participant[];
  isSelecting: boolean;
  selectedParticipant: Participant | null;
}

export interface AnimationConfig {
  duration: number;
  delay: number;
  particles: boolean;
}