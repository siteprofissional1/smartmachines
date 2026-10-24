import React from 'react';
import { Machine } from '../types/machine';
import { MachineTable } from '../components/MachineTable';
import { EmptyState } from '../components/Common/EmptyState';

interface MachinesPageProps {
  machines: Machine[];
  totalAll: number;
  onSelectMachine: (machineId: string) => void;
  onClearFilters: () => void;
}

export const MachinesPage: React.FC<MachinesPageProps> = ({
  machines,
  totalAll,
  onSelectMachine,
  onClearFilters,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
        <div>
          <h2 className="text-xl font-extrabold text-[var(--text-primary)]">
            Inventário Geral de Máquinas
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            Monitoramento de 400 ativos industriais em 5 linhas produtivas contínuas
          </p>
        </div>
        <div className="text-xs text-[var(--text-muted)]">
          Total de registros filtrados: <strong>{machines.length}</strong> de {totalAll}
        </div>
      </div>

      {machines.length === 0 ? (
        <EmptyState onClearFilters={onClearFilters} />
      ) : (
        <MachineTable
          machines={machines}
          onSelectMachine={onSelectMachine}
          pageSize={20}
        />
      )}
    </div>
  );
};
