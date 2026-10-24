import React from 'react';
import { AlertTriangle, ArrowRight, Flame, Activity } from 'lucide-react';
import { Machine } from '../types/machine';
import { formatTemp, formatVibration, formatDays } from '../utils/formatters';

interface AttentionBannerProps {
  criticalMachines: Machine[];
  onSelectMachine: (machineId: string) => void;
}

export const AttentionBanner: React.FC<AttentionBannerProps> = ({
  criticalMachines,
  onSelectMachine,
}) => {
  if (!criticalMachines || criticalMachines.length === 0) return null;

  // Seleciona as 3 mais críticas
  const topCritical = criticalMachines.slice(0, 3);

  return (
    <div className="card mb-4 border-[var(--status-critical-border)] bg-[var(--status-critical-bg)]/30 p-3 sm:p-3.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-[var(--status-critical)]/20 text-[var(--status-critical)]">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-xs sm:text-sm text-[var(--text-primary)] tracking-tight">
              Atenção Imediata — Risco de Parada Crítica
            </h3>
            <p className="text-[11px] text-[var(--text-secondary)]">
              Equipamentos com probabilidade crítica de falha ou desvio severo de vibração/temperatura
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--status-critical)] text-white self-start sm:self-auto">
          PRIORIDADE MÁXIMA
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3">
        {topCritical.map((machine) => (
          <div
            key={machine.maquina_id}
            className="card p-2.5 bg-[var(--bg-surface)] border-[var(--border-default)] hover:border-[var(--status-critical)] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-bold text-[var(--brand-primary)]">
                  {machine.maquina_id}
                </span>
                <span className="badge badge-critical text-[10px] py-0 px-1.5">
                  Risco: {machine.risco_parada_percent.toFixed(1)}%
                </span>
              </div>

              <h4 className="text-xs font-bold text-[var(--text-primary)] line-clamp-1 mb-1">
                {machine.tipo_equipamento}
              </h4>
              <p className="text-[11px] text-[var(--text-muted)] mb-2">
                {machine.linha_producao}
              </p>

              <div className="grid grid-cols-2 gap-1.5 py-1.5 mb-2 rounded bg-[var(--bg-elevated)] px-2 text-[11px]">
                <div className="flex items-center gap-1 text-[var(--text-secondary)]">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>{formatTemp(machine.sensor_temp_c)}</span>
                </div>
                <div className="flex items-center gap-1 text-[var(--text-secondary)]">
                  <Activity className="w-3.5 h-3.5 text-red-400" />
                  <span>{formatVibration(machine.sensor_vibracao_mm_s)}</span>
                </div>
              </div>

              <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 italic mb-2">
                "{machine.diagnostico_preditivo_ia}"
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] mt-1">
              <span className="text-[10px] text-[var(--text-muted)] font-medium">
                Manutenção em: <strong>{formatDays(machine.proxima_manutencao_dias)}</strong>
              </span>
              <button
                onClick={() => onSelectMachine(machine.maquina_id)}
                className="btn btn-primary btn-sm text-[11px] py-1 px-2.5 flex items-center gap-1"
              >
                <span>Inspecionar</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
