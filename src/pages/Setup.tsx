import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift } from 'lucide-react';
import { AddParticipantForm } from '../components/AddParticipantForm';
import { ParticipantList } from '../components/ParticipantList';
import { useSecretSantaStore } from '../store/secretSantaStore';

export const Setup: React.FC = () => {
  const navigate = useNavigate();
  const { currentDraw, shuffleParticipants } = useSecretSantaStore();
  const hasAssignments = currentDraw?.participants && currentDraw.participants.some(p => p.assignedTo);

  const handleStart = () => {
    if (currentDraw?.participants && currentDraw.participants.length >= 3) {
      shuffleParticipants();
      navigate('/reveal');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <Gift className="mx-auto h-12 w-12 text-blue-400" />
          <h1 className="mt-4 text-3xl font-bold text-white">Amigo Secreto</h1>
          {hasAssignments ? (
            <p className="mt-2 text-gray-300">
              O sorteio já foi realizado! Clique em "Ver Sorteio" para descobrir seu amigo secreto.
            </p>
          ) : (
            <p className="mt-2 text-gray-300">
              Adicione os participantes para começar o sorteio
            </p>
          )}
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
          {!hasAssignments && (
            <>
              <AddParticipantForm />
              <div className="divide-y divide-gray-700">
                <ParticipantList />
              </div>
            </>
          )}

          <button
            onClick={handleStart}
            disabled={!hasAssignments && currentDraw?.participants && currentDraw.participants.length < 3}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {hasAssignments
              ? 'Ver Sorteio'
              : currentDraw?.participants && currentDraw.participants.length < 3
                ? `Adicione pelo menos ${3 - currentDraw.participants.length} participante${3 - currentDraw.participants.length === 1 ? '' : 's'}`
                : 'Iniciar Sorteio'}
          </button>
        </div>
      </div>
    </div>
  );
};