import React, { useState, useMemo } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  ArrowUpDown, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Machine } from '../types/machine';
import { formatTemp, formatVibration, formatDays } from '../utils/formatters';
import { getStatusBadgeClass } from '../utils/calculations';

interface MachineTableProps {
  machines: Machine[];
  onSelectMachine: (machineId: string) => void;
  pageSize?: number;
}

type SortField = 
  | 'maquina_id' 
  | 'tipo_equipamento' 
  | 'linha_producao' 
  | 'status_operacional' 
  | 'sensor_temp_c' 
  | 'sensor_vibracao_mm_s' 
  | 'eficiencia_oee_percent' 
  | 'risco_parada_percent' 
  | 'proxima_manutencao_dias';

export const MachineTable: React.FC<MachineTableProps> = ({
  machines,
  onSelectMachine,
  pageSize = 15,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('risco_parada_percent');
  const [sortAsc, setSortAsc] = useState(false); // Padrão: maior risco primeiro

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
    setCurrentPage(1);
  };

  const sortedMachines = useMemo(() => {
    return [...machines].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === 'string') {
        return sortAsc
          ? (valA as string).localeCompare(valB as string)
          : (valB as string).localeCompare(valA as string);
      }

      return sortAsc
        ? (valA as number) - (valB as number)
        : (valB as number) - (valA as number);
    });
  }, [machines, sortField, sortAsc]);

  const totalPages = Math.ceil(sortedMachines.length / pageSize) || 1;
  const paginatedMachines = sortedMachines.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-[var(--text-muted)] opacity-50" />;
    }
    return sortAsc ? (
      <ChevronUp className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
    ) : (
      <ChevronDown className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
    );
  };

  return (
    <div className="card p-0 overflow-hidden flex flex-col justify-between">
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('maquina_id')} className="cursor-pointer hover:text-[var(--text-primary)]">
                <div className="flex items-center gap-1.5">
                  <span>ID Máquina</span>
                  {renderSortIcon('maquina_id')}
                </div>
              </th>
              <th onClick={() => handleSort('tipo_equipamento')} className="cursor-pointer hover:text-[var(--text-primary)]">
                <div className="flex items-center gap-1.5">
                  <span>Equipamento</span>
                  {renderSortIcon('tipo_equipamento')}
                </div>
              </th>
              <th onClick={() => handleSort('linha_producao')} className="cursor-pointer hover:text-[var(--text-primary)]">
                <div className="flex items-center gap-1.5">
                  <span>Linha</span>
                  {renderSortIcon('linha_producao')}
                </div>
              </th>
              <th onClick={() => handleSort('status_operacional')} className="cursor-pointer hover:text-[var(--text-primary)]">
                <div className="flex items-center gap-1.5">
                  <span>Status</span>
                  {renderSortIcon('status_operacional')}
                </div>
              </th>
              <th onClick={() => handleSort('sensor_temp_c')} className="cursor-pointer hover:text-[var(--text-primary)] text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <span>Temp.</span>
                  {renderSortIcon('sensor_temp_c')}
                </div>
              </th>
              <th onClick={() => handleSort('sensor_vibracao_mm_s')} className="cursor-pointer hover:text-[var(--text-primary)] text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <span>Vibração</span>
                  {renderSortIcon('sensor_vibracao_mm_s')}
                </div>
              </th>
              <th onClick={() => handleSort('eficiencia_oee_percent')} className="cursor-pointer hover:text-[var(--text-primary)] text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <span>OEE</span>
                  {renderSortIcon('eficiencia_oee_percent')}
                </div>
              </th>
              <th onClick={() => handleSort('risco_parada_percent')} className="cursor-pointer hover:text-[var(--text-primary)] text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <span>Risco</span>
                  {renderSortIcon('risco_parada_percent')}
                </div>
              </th>
              <th onClick={() => handleSort('proxima_manutencao_dias')} className="cursor-pointer hover:text-[var(--text-primary)] text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <span>Manutenção</span>
                  {renderSortIcon('proxima_manutencao_dias')}
                </div>
              </th>
              <th className="text-center">Ação</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMachines.map((m) => (
              <tr 
                key={m.maquina_id}
                className="hover:bg-[var(--bg-hover)] cursor-pointer transition-colors"
                onClick={() => onSelectMachine(m.maquina_id)}
              >
                <td className="font-mono font-bold text-[var(--brand-primary)] text-xs">
                  {m.maquina_id}
                  {m.demoMode && (
                    <span className="ml-1 text-[9px] px-1 py-0.2 rounded bg-pink-500/20 text-pink-400 font-sans font-bold">
                      DEMO
                    </span>
                  )}
                </td>
                <td className="font-semibold text-xs text-[var(--text-primary)]">
                  {m.tipo_equipamento}
                </td>
                <td className="text-xs text-[var(--text-secondary)] whitespace-nowrap">
                  {m.linha_producao}
                </td>
                <td>
                  <span className={getStatusBadgeClass(m.status_operacional)}>
                    {m.status_operacional}
                  </span>
                </td>
                <td className={`text-right text-xs font-mono font-medium ${
                  m.sensor_temp_c >= 80 ? 'text-amber-400 font-bold' : ''
                }`}>
                  {formatTemp(m.sensor_temp_c)}
                </td>
                <td className={`text-right text-xs font-mono font-medium ${
                  m.sensor_vibracao_mm_s >= 4.0 ? 'text-red-400 font-bold' : ''
                }`}>
                  {formatVibration(m.sensor_vibracao_mm_s)}
                </td>
                <td className="text-right text-xs font-mono font-medium text-[var(--text-primary)]">
                  {m.eficiencia_oee_percent.toFixed(1)}%
                </td>
                <td className={`text-right text-xs font-mono font-bold ${
                  m.risco_parada_percent >= 70 ? 'text-[var(--status-critical)]' : 
                  m.risco_parada_percent >= 30 ? 'text-[var(--status-warning)]' : 'text-[var(--status-normal)]'
                }`}>
                  {m.risco_parada_percent.toFixed(1)}%
                </td>
                <td className="text-center text-xs font-mono font-medium">
                  <span className={`px-2 py-0.5 rounded text-[11px] ${
                    m.proxima_manutencao_dias <= 7 
                      ? 'bg-red-500/15 text-red-400 font-bold' 
                      : 'text-[var(--text-secondary)]'
                  }`}>
                    {formatDays(m.proxima_manutencao_dias)}
                  </span>
                </td>
                <td className="text-center" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onSelectMachine(m.maquina_id)}
                    className="p-1.5 rounded-lg bg-[var(--bg-elevated)] hover:bg-[var(--brand-primary)]/15 text-[var(--text-secondary)] hover:text-[var(--brand-primary)] transition-colors"
                    title={`Inspecionar máquina ${m.maquina_id}`}
                    aria-label={`Inspecionar máquina ${m.maquina_id}`}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginação Compacta */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 p-2.5 sm:p-3 border-t border-[var(--border-default)] bg-[var(--bg-elevated)]">
        <span className="text-xs text-[var(--text-secondary)]">
          Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong> ({sortedMachines.length} registros)
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="btn btn-secondary btn-sm p-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Página Anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex gap-1 text-xs">
            {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
              const pageNum = Math.min(
                Math.max(1, currentPage - 2) + idx,
                totalPages
              );
              if (pageNum > totalPages) return null;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 rounded text-xs font-semibold ${
                    currentPage === pageNum
                      ? 'bg-[var(--brand-primary)] text-[#070B11]'
                      : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="btn btn-secondary btn-sm p-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Próxima Página"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
