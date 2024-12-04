import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Gift, ArrowLeft } from 'lucide-react';
import { AddParticipantForm } from '../components/AddParticipantForm';
import { ParticipantList } from '../components/ParticipantList';
import { useSecretSantaStore } from '../store/secretSantaStore';

export const Setup: React.FC = () => {
  const navigate = useNavigate();
  const { currentDraw, shuffleParticipants } = useSecretSantaStore();
  const hasAssignments = currentDraw?.participants?.some(p => p.assignedTo);

  const handleStart = () => {
    if (currentDraw?.participants && currentDraw.participants.length >= 3) {
      shuffleParticipants();
      navigate('/reveal');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-md mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Voltar para o início
        </Link>

        <div className="text-center mb-8">
          <Gift className="mx-auto h-12 w-12 text-blue-400" />
          <h1 className="mt-4 text-3xl font-bold text-white">{currentDraw?.name}</h1>
          <p className="mt-2 text-gray-300">
            {hasAssignments ? (
              'O sorteio já foi realizado! Clique em "Ver Sorteio" para descobrir seu amigo secreto.'
            ) : (
              'Adicione os participantes e depois inicie o sorteio'
            )}
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
          <AddParticipantForm disabled={hasAssignments} />
          <div className="divide-y divide-gray-700">
            <ParticipantList />
          </div>

          {hasAssignments ? (
            <button
              onClick={() => navigate('/reveal')}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ver Sorteio
            </button>
          ) : (
            <button
              onClick={handleStart}
              disabled={currentDraw?.participants && currentDraw.participants.length < 3}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentDraw?.participants && currentDraw.participants.length < 3
                ? `Adicione pelo menos ${3 - currentDraw.participants.length} participante${3 - currentDraw.participants.length === 1 ? '' : 's'
                }`
                : 'Iniciar Sorteio'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};