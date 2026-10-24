import React from 'react';
import { 
  Activity, 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  Gauge, 
  Wrench, 
  Flame, 
  RotateCw 
} from 'lucide-react';
import { Machine } from '../types/machine';
import { calculatePlantHealth, calculateAverageRisk, calculateAverageOEE } from '../utils/calculations';

interface KPICardsProps {
  machines: Machine[];
  totalAllMachines: number;
}

export const KPICards: React.FC<KPICardsProps> = ({ machines, totalAllMachines }) => {
  const plantHealth = calculatePlantHealth(machines);
  const averageRisk = calculateAverageRisk(machines);
  const averageOEE = calculateAverageOEE(machines);

  const criticalCount = machines.filter(m => m.status_operacional === 'Risco Crítico de Falha').length;
  const vibrationCount = machines.filter(m => m.status_operacional === 'Alerta de Vibração').length;
  const temperatureCount = machines.filter(m => m.status_operacional === 'Atenção - Temperatura').length;
  const normalCount = machines.filter(m => m.status_operacional === 'Operando Normal').length;
  const maintenanceSoon = machines.filter(m => m.proxima_manutencao_dias <= 7).length;
  const totalFailures30d = machines.reduce((acc, m) => acc + (m.historico_falhas_30d || 0), 0);

  return (
    <div className="space-y-2.5 mb-4">
      {/* Linha 1: 4 KPIs Estratégicos */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {/* 1. Saúde Geral da Planta */}
        <div className="card p-3 sm:p-3.5 flex flex-col justify-between border-l-4 border-l-[var(--brand-primary)]">
          <div className="flex items-center justify-between text-[var(--text-secondary)] mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Saúde da Planta</span>
            <Activity className="w-4 h-4 text-[var(--brand-primary)]" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]">
              {plantHealth.toFixed(1)}%
            </div>
            <div className="text-[10px] text-[var(--text-muted)] mt-0.5 flex items-center justify-between">
              <span>Risco Médio: {averageRisk.toFixed(1)}%</span>
              <span className="text-green-400 font-semibold">100 - Risco</span>
            </div>
          </div>
        </div>

        {/* 2. Máquinas Críticas */}
        <div className="card p-3 sm:p-3.5 flex flex-col justify-between border-l-4 border-l-[var(--status-critical)]">
          <div className="flex items-center justify-between text-[var(--text-secondary)] mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Risco Crítico</span>
            <AlertOctagon className="w-4 h-4 text-[var(--status-critical)]" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-[var(--status-critical)]">
              {criticalCount}
            </div>
            <div className="text-[10px] text-[var(--text-muted)] mt-0.5 flex items-center justify-between">
              <span>{((criticalCount / (machines.length || 1)) * 100).toFixed(1)}% do filtro</span>
              <span className="text-[var(--status-critical)] font-semibold">Ação Imediata</span>
            </div>
          </div>
        </div>

        {/* 3. Alertas de Vibração & Temperatura */}
        <div className="card p-3 sm:p-3.5 flex flex-col justify-between border-l-4 border-l-[var(--status-alert)]">
          <div className="flex items-center justify-between text-[var(--text-secondary)] mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Vibração & Temperatura</span>
            <Flame className="w-4 h-4 text-[var(--status-alert)]" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]">
              {vibrationCount + temperatureCount}
            </div>
            <div className="text-[10px] text-[var(--text-muted)] mt-0.5 flex items-center justify-between">
              <span>Vibração: {vibrationCount}</span>
              <span>Temperatura: {temperatureCount}</span>
            </div>
          </div>
        </div>

        {/* 4. Eficiência Média (OEE) */}
        <div className="card p-3 sm:p-3.5 flex flex-col justify-between border-l-4 border-l-[var(--status-normal)]">
          <div className="flex items-center justify-between text-[var(--text-secondary)] mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Eficiência Global (OEE)</span>
            <Gauge className="w-4 h-4 text-[var(--status-normal)]" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]">
              {averageOEE.toFixed(1)}%
            </div>
            <div className="text-[10px] text-[var(--text-muted)] mt-0.5 flex items-center justify-between">
              <span>Normais: {normalCount}</span>
              <span className="text-green-400 font-semibold">Meta &gt; 80%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Linha 2: 4 Indicadores Rápidos em Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5">
        <div className="card p-2 sm:p-2.5 flex items-center justify-between bg-[var(--bg-elevated)] border-dashed">
          <div className="flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] text-[var(--text-secondary)]">Manutenção &le; 7 dias:</span>
          </div>
          <span className="text-xs font-bold text-amber-400">{maintenanceSoon} un.</span>
        </div>

        <div className="card p-2 sm:p-2.5 flex items-center justify-between bg-[var(--bg-elevated)] border-dashed">
          <div className="flex items-center gap-1.5">
            <RotateCw className="w-3.5 h-3.5 text-red-400" />
            <span className="text-[11px] text-[var(--text-secondary)]">Falhas 30 dias:</span>
          </div>
          <span className="text-xs font-bold text-red-400">{totalFailures30d} un.</span>
        </div>

        <div className="card p-2 sm:p-2.5 flex items-center justify-between bg-[var(--bg-elevated)] border-dashed">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
            <span className="text-[11px] text-[var(--text-secondary)]">Operando Normal:</span>
          </div>
          <span className="text-xs font-bold text-green-400">{normalCount} un.</span>
        </div>

        <div className="card p-2 sm:p-2.5 flex items-center justify-between bg-[var(--bg-elevated)] border-dashed">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
            <span className="text-[11px] text-[var(--text-secondary)]">Total Monitoradas:</span>
          </div>
          <span className="text-xs font-bold text-[var(--text-primary)]">{totalAllMachines} ativas</span>
        </div>
      </div>
    </div>
  );
};
