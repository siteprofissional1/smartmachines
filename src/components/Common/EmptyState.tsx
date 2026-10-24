import React from 'react';
import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onClearFilters?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Nenhuma máquina encontrada',
  description = 'Nenhum equipamento corresponde aos filtros aplicados. Tente ajustar os termos de busca ou selecionar todas as linhas de produção.',
  onClearFilters,
}) => {
  return (
    <div className="card p-12 text-center flex flex-col items-center justify-center">
      <div className="w-14 h-14 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center mb-4">
        <SearchX className="w-7 h-7 text-[var(--text-muted)]" />
      </div>
      <h3 className="text-base font-bold text-[var(--text-primary)] mb-2">{title}</h3>
      <p className="text-[var(--text-secondary)] text-sm max-w-md mb-4">{description}</p>
      {onClearFilters && (
        <button onClick={onClearFilters} className="btn btn-secondary text-sm">
          Limpar Filtros
        </button>
      )}
    </div>
  );
};
