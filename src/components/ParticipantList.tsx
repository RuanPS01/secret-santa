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
          className="flex items-center justify-between bg-gray-700 p-3 rounded-lg shadow-sm hover:bg-gray-600 transition-colors"
        >
          <span className="text-gray-200">{participant.name}</span>
          <button
            onClick={() => removeParticipant(participant.id)}
            className="text-red-400 hover:text-red-300 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}