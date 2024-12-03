import React, { useState } from 'react';
import { Gift, Eye, EyeOff } from 'lucide-react';
import { useSecretSantaStore } from '../store/secretSantaStore';
import { SetPasswordForm } from './SetPasswordForm';

export const AssignmentReveal: React.FC = () => {
  const [selectedId, setSelectedId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [revealed, setRevealed] = useState(false);
  const { currentDraw, getAssignment } = useSecretSantaStore();

  const selectedParticipant = currentDraw?.participants && currentDraw.participants.find(p => p.id === selectedId);

  const handleReveal = () => {
    const assignment = getAssignment(selectedId, password);
    if (assignment) {
      setRevealed(true);
      setError('');
    } else {
      setError('Senha incorreta');
      setRevealed(false);
    }
  };

  if (selectedId && selectedParticipant && !selectedParticipant.hasSetPassword) {
    return <SetPasswordForm participantId={selectedId} />;
  }

  return (
    <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-white">Descubra seu Amigo Secreto</h2>

      <div className="space-y-4">
        <select
          value={selectedId}
          onChange={(e) => {
            setSelectedId(e.target.value);
            setRevealed(false);
            setError('');
            setPassword('');
          }}
          className="w-full p-2 rounded-lg bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Selecione seu nome</option>
          {currentDraw?.participants && currentDraw.participants.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        {selectedId && selectedParticipant?.hasSetPassword && (
          <>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Digite sua senha"
                className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 pr-10 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              onClick={handleReveal}
              disabled={!selectedId || !password}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Gift size={20} />
              Revelar Amigo Secreto
            </button>

            {revealed && getAssignment(selectedId, password) && (
              <div className="mt-6 text-center">
                <p className="text-gray-300">Você tirou:</p>
                <p className="text-2xl font-bold text-green-400 mt-2">
                  {getAssignment(selectedId, password)?.name}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}