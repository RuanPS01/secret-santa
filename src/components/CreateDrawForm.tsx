import React, { useState } from 'react';
import { Gift } from 'lucide-react';
import { useSecretSantaStore } from '../store/secretSantaStore';
import { useNavigate } from 'react-router-dom';

export const CreateDrawForm: React.FC = () => {
  const [name, setName] = useState('');
  const createDraw = useSecretSantaStore((state) => state.createDraw);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      await createDraw(name.trim());
      navigate('/setup');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="drawName" className="block text-sm font-medium text-gray-300 mb-1">
          Nome do Sorteio
        </label>
        <input
          id="drawName"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Natal 2024"
          className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
        />
      </div>

      <button
        type="submit"
        disabled={!name.trim()}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Gift size={20} />
        Criar Novo Sorteio
      </button>
    </form>
  );
};