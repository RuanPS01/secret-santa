import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { useSecretSantaStore } from '../store/secretSantaStore';

interface SetPasswordFormProps {
  participantId: string;
}

export const SetPasswordForm: React.FC<SetPasswordFormProps> = ({ participantId }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const { setPassword: storeSetPassword, currentDraw } = useSecretSantaStore();

  const participant = currentDraw?.participants && currentDraw.participants.find(p => p.id === participantId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    if (password.length < 4) {
      setError('A senha deve ter pelo menos 4 caracteres');
      return;
    }
    storeSetPassword(participantId, password);
  };

  return (
    <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <Lock className="mx-auto h-12 w-12 text-blue-400" />
        <h2 className="text-2xl font-bold mt-4 text-white">Definir Senha</h2>
        <p className="text-gray-300 mt-2">
          Olá {participant?.name}, defina sua senha para acessar seu amigo secreto
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setError('');
            }}
            placeholder="Confirme sua senha"
            className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 pr-10 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={!password || !confirmPassword}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Lock size={20} />
          Definir Senha
        </button>
      </form>
    </div>
  );
}