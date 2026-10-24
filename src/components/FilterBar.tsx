import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { FilterState } from '../types/machine';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  totalFiltered: number;
  totalTotal: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  totalFiltered,
  totalTotal,
}) => {
  const handleLineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, linha: e.target.value });
  };

  const handleTurnoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, turno: e.target.value });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, status: e.target.value });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, searchQuery: e.target.value });
  };

  const resetFilters = () => {
    onFilterChange({
      linha: 'ALL',
      turno: 'ALL',
      status: 'ALL',
      searchQuery: '',
    });
  };

  const hasActiveFilters = 
    filters.linha !== 'ALL' || 
    filters.turno !== 'ALL' || 
    filters.status !== 'ALL' || 
    filters.searchQuery.trim() !== '';

  return (
    <div 
      id="global-filter-bar"
      className="card mb-3.5 p-2.5 sm:p-3 flex flex-col md:flex-row gap-2.5 items-stretch md:items-center justify-between"
    >
      <div className="flex flex-wrap items-center gap-2.5 flex-1">
        {/* Campo de Busca Rápida */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={handleSearchChange}
            placeholder="Buscar por ID (ex: EQP-0215), equipamento ou peça..."
            className="w-full bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--brand-primary)] focus:outline-none transition-colors"
          />
        </div>

        {/* Filtro Linha de Produção */}
        <select
          value={filters.linha}
          onChange={handleLineChange}
          className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)] focus:border-[var(--brand-primary)] focus:outline-none"
        >
          <option value="ALL">Todas as Linhas (5)</option>
          <option value="Linha A - Estamparia">Linha A - Estamparia</option>
          <option value="Linha B - Solda Robótica">Linha B - Solda Robótica</option>
          <option value="Linha C - Embalagem">Linha C - Embalagem</option>
          <option value="Linha D - Usinagem CNC">Linha D - Usinagem CNC</option>
          <option value="Linha E - Utilidades e Caldeira">Linha E - Utilidades e Caldeira</option>
        </select>

        {/* Filtro Status Operacional */}
        <select
          value={filters.status}
          onChange={handleStatusChange}
          className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)] focus:border-[var(--brand-primary)] focus:outline-none"
        >
          <option value="ALL">Todos os Status</option>
          <option value="Operando Normal">Operando Normal</option>
          <option value="Alerta de Vibração">Alerta de Vibração</option>
          <option value="Atenção - Temperatura">Atenção - Temperatura</option>
          <option value="Risco Crítico de Falha">Risco Crítico de Falha</option>
        </select>

        {/* Filtro Turno */}
        <select
          value={filters.turno}
          onChange={handleTurnoChange}
          className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)] focus:border-[var(--brand-primary)] focus:outline-none"
        >
          <option value="ALL">Todos os Turnos</option>
          <option value="Manhã (06h-14h)">Manhã (06h-14h)</option>
          <option value="Tarde (14h-22h)">Tarde (14h-22h)</option>
          <option value="Noite (22h-06h)">Noite (22h-06h)</option>
        </select>

        {/* Botão Reset */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="btn btn-secondary btn-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            title="Limpar todos os filtros"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Limpar
          </button>
        )}
      </div>

      {/* Contagem de Resultados */}
      <div className="text-xs text-[var(--text-secondary)] whitespace-nowrap self-end md:self-center">
        Exibindo <strong>{totalFiltered}</strong> de <strong>{totalTotal}</strong> máquinas
      </div>
    </div>
  );
};
