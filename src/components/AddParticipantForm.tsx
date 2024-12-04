import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { useSecretSantaStore } from '../store/secretSantaStore';

export const AddParticipantForm: React.FC = () => {
  const [name, setName] = useState('');
  const addParticipant = useSecretSantaStore((state) => state.addParticipant);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      addParticipant(name.trim());
      setName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome do participante"
          className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={!name.trim()}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <UserPlus size={20} />
        Adicionar
      </button>
    </form>
  );
}