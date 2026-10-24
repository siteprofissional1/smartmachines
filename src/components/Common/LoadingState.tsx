import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Processando telemetria e sincronizando dados da planta...' 
}) => {
  return (
    <div 
      className="card flex flex-col items-center justify-center p-12 text-center"
      style={{ minHeight: '260px' }}
    >
      <Loader2 className="w-10 h-10 animate-spin text-[var(--brand-primary)] mb-4" />
      <p className="text-[var(--text-secondary)] font-medium text-sm">{message}</p>
    </div>
  );
};
