import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AssignmentReveal } from '../components/AssignmentReveal';
import { ArrowLeft, RotateCcw, Gift } from 'lucide-react';
import { useSecretSantaStore } from '../store/secretSantaStore';

export const Reveal: React.FC = () => {
  const navigate = useNavigate();
  const { resetDraw, currentDraw } = useSecretSantaStore();

  const handleReset = async () => {
    if (window.confirm('Tem certeza que deseja resetar o sorteio? Todos os participantes serão mantidos, mas precisarão definir novas senhas.')) {
      try {
        const success = await resetDraw();
        if (success) {
          navigate('/setup');
        } else {
          alert('Não foi possível resetar o sorteio. Por favor, tente novamente.');
        }
      } catch (error) {
        console.error('Error in handleReset:', error);
        alert('Ocorreu um erro ao resetar o sorteio. Por favor, tente novamente.');
      }
    }
  };

  const totalParticipants = currentDraw?.participants?.length || 0;

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-blue-400 hover:text-blue-300"
          >
            <ArrowLeft size={20} className="mr-2" />
            Voltar para o início
          </Link>

          <button
            onClick={handleReset}
            className="inline-flex items-center text-red-400 hover:text-red-300"
          >
            <RotateCcw size={20} className="mr-2" />
            Resetar Sorteio
          </button>
        </div>

        <div className="text-center mb-8">
          <Gift className="mx-auto h-12 w-12 text-blue-400" />
          <h1 className="mt-4 text-3xl font-bold text-white">
            {currentDraw?.name}
          </h1>
          <div className="mt-2 text-gray-300 space-y-1">
            <p>O sorteio já foi realizado!</p>
            <p className="text-sm">
              {totalParticipants} participante{totalParticipants !== 1 ? 's' : ''} neste amigo secreto
            </p>
          </div>
        </div>

        <AssignmentReveal />
      </div>
    </div>
  );
};