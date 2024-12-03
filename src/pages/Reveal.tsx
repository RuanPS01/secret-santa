import React from 'react';
import { Link } from 'react-router-dom';
import { AssignmentReveal } from '../components/AssignmentReveal';
import { ArrowLeft } from 'lucide-react';

export const Reveal: React.FC = () => {
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

        <AssignmentReveal />
      </div>
    </div>
  );
};