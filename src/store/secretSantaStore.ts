import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SecretSantaState, Participant, SecretSanta } from "../types";
import { SecretSantaModel, connectDB } from "../lib/db";
import { generateId, shuffleArray } from "../lib/utils";

export const useSecretSantaStore = create<SecretSantaState>()(
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
  )
);
