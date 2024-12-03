import React from 'react';
import { Trash2 } from 'lucide-react';
import { useSecretSantaStore } from '../store/secretSantaStore';

export const ParticipantList: React.FC = () => {
  const { currentDraw, removeParticipant } = useSecretSantaStore();

  return (
    <div className="space-y-2">
      {currentDraw?.participants && currentDraw.participants.map((participant) => (
        <div
          key={participant.id}
          className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm"
        >
          <span className="text-gray-800">{participant.name}</span>
          <button
            onClick={() => removeParticipant(participant.id)}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}