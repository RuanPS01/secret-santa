export interface Participant {
  id: string;
  name: string;
  password?: string;
  assignedTo?: string;
  hasSetPassword: boolean;
}

export interface SecretSanta {
  id: string;
  name: string;
  participants: Participant[];
  createdAt: Date;
}

export interface SecretSantaState {
  currentDraw: SecretSanta | null;
  draws: SecretSanta[];
  setDraws: (draws: SecretSanta[]) => void;
  createDraw: (name: string) => Promise<void>;
  loadDraw: (id: string) => Promise<void>;
  addParticipant: (name: string) => Promise<void>;
  removeParticipant: (id: string) => Promise<void>;
  setPassword: (participantId: string, password: string) => Promise<void>;
  shuffleParticipants: () => Promise<void>;
  verifyPassword: (participantId: string, password: string) => boolean;
  getAssignment: (
    participantId: string,
    password: string
  ) => Participant | undefined;
  reset: () => void;
}
