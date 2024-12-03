import React from 'react';
import { Gift } from 'lucide-react';
import { CreateDrawForm } from '../components/CreateDrawForm';
import { DrawList } from '../components/DrawList';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <Gift className="mx-auto h-12 w-12 text-blue-400" />
          <h1 className="mt-4 text-3xl font-bold text-white">Amigo Secreto</h1>
          <p className="mt-2 text-gray-300">
            Crie um novo sorteio ou acesse um existente
            <br />
            <div className="text-gray-500 text-sm">
              Site criado por Ruan Patrick
            </div>
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-8">
          <CreateDrawForm />
          <DrawList />
        </div>
      </div>
    </div>
  );
}