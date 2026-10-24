import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Ocorreu um erro ao carregar os dados de telemetria.',
  onRetry,
}) => {
  return (
    <div className="card border-[var(--status-critical-border)] bg-[var(--status-critical-bg)] p-8 text-center flex flex-col items-center">
      <AlertTriangle className="w-10 h-10 text-[var(--status-critical)] mb-3" />
      <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Falha na Operação</h3>
      <p className="text-[var(--text-secondary)] text-sm mb-4 max-w-md">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-secondary text-sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Tentar Novamente
        </button>
      )}
    </div>
  );
};
