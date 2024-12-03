import React, { useEffect, useState } from 'react';
import { Gift, Search } from 'lucide-react';
import { useSecretSantaStore } from '../store/secretSantaStore';
import { useNavigate } from 'react-router-dom';
import { SecretSantaModel } from '../lib/db';

export const DrawList: React.FC = () => {
  const draws = useSecretSantaStore((state) => state.draws);
  const loadDraw = useSecretSantaStore((state) => state.loadDraw);
  const setDraws = useSecretSantaStore((state) => state.setDraws);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDraws = async () => {
      try {
        setIsLoading(true);
        const allDraws = await SecretSantaModel.findAll();
        setDraws(allDraws);
      } catch (error) {
        console.error('Error loading draws:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDraws();
  }, [setDraws]);

  const handleSelectDraw = async (id: string) => {
    await loadDraw(id);
    navigate('/reveal');
  };

  const filteredDraws = draws.filter(draw =>
    draw.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-400">
        Carregando sorteios...
      </div>
    );
  }

  if (!draws?.length) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>Nenhum sorteio encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-200">Sorteios Existentes</h2>

      <div className="relative w-full">
        <input
          type="text"
          placeholder="Buscar sorteio..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
        />
        <Search
          size={20}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
      </div>

      <div className="space-y-2">
        {filteredDraws.length === 0 ? (
          <div className="text-center py-4 text-gray-400">
            Nenhum sorteio encontrado com "{searchTerm}"
          </div>
        ) : (
          filteredDraws.map((draw) => (
            <button
              key={draw.id}
              onClick={() => handleSelectDraw(draw.id)}
              className="w-full flex items-center justify-between p-4 bg-gray-700 rounded-lg shadow-sm hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Gift size={20} className="text-blue-400" />
                <div className="text-left">
                  <h3 className="font-medium text-white">{draw.name}</h3>
                  <p className="text-sm text-gray-400">
                    {new Date(draw.createdAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-sm text-gray-300">
                  {draw.participants?.length || 0} participante{draw.participants?.length !== 1 ? 's' : ''}
                </span>
                {draw.participants?.some(p => p.assignedTo) && (
                  <span className="text-xs text-green-400">
                    Sorteio realizado
                  </span>
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};