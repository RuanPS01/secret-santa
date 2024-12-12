import { StateCreator, create } from "zustand";
import { persist } from "zustand/middleware";
import { SecretSantaState, Participant, SecretSanta } from "../types";
import { SecretSantaModel, connectDB } from "../lib/db";
import { generateId, shuffleArray } from "../lib/utils";

interface StoreState {
  currentDraw: SecretSanta | null;
  draws: SecretSanta[];
}

interface StoreActions {
  createDraw: (name: string) => Promise<void>;
  loadDraw: (id: string) => Promise<void>;
  addParticipant: (name: string) => Promise<void>;
  removeParticipant: (id: string) => Promise<void>;
  setPassword: (participantId: string, password: string) => Promise<void>;
  shuffleParticipants: () => Promise<void>;
  verifyPassword: (participantId: string, password: string) => boolean;
  getAssignment: (participantId: string, password: string) => Participant | undefined;
  reset: () => void;
  setDraws: (draws: SecretSanta[]) => void;
  resetDraw: () => Promise<boolean>;
}

type Store = StoreState & StoreActions;

type PersistStore = StateCreator<
  Store,
  [],
  [["zustand/persist", Store]],
  Store
>;

export const useSecretSantaStore = create<Store>()(
  persist(
    (set, get) => ({
      currentDraw: null,
      draws: [],

      createDraw: async (name: string) => {
        await connectDB();
        const newDraw: SecretSanta = {
          id: generateId(),
          name,
          participants: [],
          createdAt: new Date(),
        };

        await SecretSantaModel.create(newDraw);

        set((state) => ({
          draws: [...state.draws, newDraw],
          currentDraw: newDraw,
        }));
      },

      loadDraw: async (id: string) => {
        await connectDB();
        const draw = await SecretSantaModel.findOne({ id });
        if (draw) {
          set({
            currentDraw: { ...draw, participants: draw.participants || [] },
          });
        }
      },

      addParticipant: async (name: string) => {
        const { currentDraw } = get();
        if (!currentDraw) return;

        const newParticipant: Participant = {
          id: generateId(),
          name,
          hasSetPassword: false,
        };

        await connectDB();
        await SecretSantaModel.addParticipant(currentDraw.id, newParticipant);

        set((state) => ({
          currentDraw: state.currentDraw
            ? {
                ...state.currentDraw,
                participants: [
                  ...(state.currentDraw.participants || []),
                  newParticipant,
                ],
              }
            : null,
        }));
      },

      removeParticipant: async (id: string) => {
        const { currentDraw } = get();
        if (!currentDraw) return;

        await connectDB();
        await SecretSantaModel.findOneAndUpdate(
          { id: currentDraw.id },
          { $pull: { participants: { id } } }
        );

        set((state) => ({
          currentDraw: state.currentDraw
            ? {
                ...state.currentDraw,
                participants: (state.currentDraw.participants || []).filter(
                  (p) => p.id !== id
                ),
              }
            : null,
        }));
      },

      setPassword: async (participantId: string, password: string) => {
        const { currentDraw } = get();
        if (!currentDraw) return;

        await connectDB();
        await SecretSantaModel.updateParticipant(
          currentDraw.id,
          participantId,
          {
            password,
            hasSetPassword: true,
          }
        );

        set((state) => ({
          currentDraw: state.currentDraw
            ? {
                ...state.currentDraw,
                participants: (state.currentDraw.participants || []).map((p) =>
                  p.id === participantId
                    ? { ...p, password, hasSetPassword: true }
                    : p
                ),
              }
            : null,
        }));
      },

      resetDraw: async () => {
        const { currentDraw } = get();
        if (!currentDraw) return false;

        try {
          const resetParticipants = currentDraw.participants.map(p => ({
            id: p.id,
            name: p.name,
            hasSetPassword: false,
            createdAt: p.createdAt
          }));

          await connectDB();
          const updated = await SecretSantaModel.findOneAndUpdate(
            { id: currentDraw.id },
            { $set: { participants: resetParticipants } }
          );

          if (!updated) {
            throw new Error('Failed to update draw');
          }

          set((state) => ({
            currentDraw: state.currentDraw
              ? {
                  ...state.currentDraw,
                  participants: resetParticipants,
                }
              : null,
          }));

          return true;
        } catch (error) {
          console.error('Error resetting draw:', error);
          return false;
        }
      },

      shuffleParticipants: async () => {
        const { currentDraw } = get();
        if (
          !currentDraw ||
          !currentDraw.participants ||
          currentDraw.participants.some((p) => p.assignedTo)
        ) {
          return;
        }

        const shuffled = shuffleArray([...currentDraw.participants]);
        const assigned = shuffled.map((participant, index) => ({
          ...participant,
          assignedTo: shuffled[(index + 1) % shuffled.length].id,
        }));

        await connectDB();
        await SecretSantaModel.findOneAndUpdate(
          { id: currentDraw.id },
          { $set: { participants: assigned } }
        );

        set((state) => ({
          currentDraw: state.currentDraw
            ? {
                ...state.currentDraw,
                participants: assigned,
              }
            : null,
        }));
      },

      verifyPassword: (participantId: string, password: string) => {
        const { currentDraw } = get();
        if (!currentDraw || !currentDraw.participants) return false;
        const participant = currentDraw.participants.find(
          (p) => p.id === participantId
        );
        return participant?.password === password;
      },

      getAssignment: (participantId: string, password: string) => {
        const { currentDraw, verifyPassword } = get();
        if (!currentDraw || !verifyPassword(participantId, password))
          return undefined;

        const participant = currentDraw.participants?.find(
          (p) => p.id === participantId
        );
        if (!participant?.assignedTo) return undefined;
        return currentDraw.participants?.find(
          (p) => p.id === participant.assignedTo
        );
      },

      reset: () => {
        set({ currentDraw: null, draws: [] });
      },

      setDraws: (draws: SecretSanta[]) => {
        set({ draws });
      },
    }),
    {
      name: "secret-santa-storage",
      skipHydration: false,
    }
  ) as PersistStore
);