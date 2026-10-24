import React from 'react';
import { Machine } from '../types/machine';
import { KPICards } from '../components/KPICards';
import { AttentionBanner } from '../components/AttentionBanner';
import { StatusDonutChart } from '../components/Charts/StatusDonutChart';
import { ScatterVibrationTempChart } from '../components/Charts/ScatterVibrationTempChart';
import { RiskByLineChart } from '../components/Charts/RiskByLineChart';
import { RiskHistogramChart } from '../components/Charts/RiskHistogramChart';
import { MachineTable } from '../components/MachineTable';

interface OverviewPageProps {
  machines: Machine[];
  allMachines: number;
  onSelectMachine: (machineId: string) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  machines,
  allMachines,
  onSelectMachine,
}) => {
  // Máquinas críticas para o banner de atenção
  const criticalMachines = machines.filter(
    (m) => m.status_operacional === 'Risco Crítico de Falha' || m.risco_parada_percent >= 70
  );

  return (
    <div className="space-y-4">
      {/* KPIs Globais Calculados */}
      <KPICards machines={machines} totalAllMachines={allMachines} />

      {/* Banner de Atenção Requerida (Pitch Highlight) */}
      <AttentionBanner
        criticalMachines={criticalMachines}
        onSelectMachine={onSelectMachine}
      />

      {/* Grid de Gráficos Analíticos com Plotly.js */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4">
        <StatusDonutChart machines={machines} />
        <ScatterVibrationTempChart machines={machines} onSelectMachine={onSelectMachine} />
        <RiskByLineChart machines={machines} />
        <RiskHistogramChart machines={machines} />
      </div>

      {/* Tabela dos Equipamentos com Maior Criticidade */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-bold text-base text-[var(--text-primary)]">
              Equipamentos Monitorados
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Ordenados por risco de parada preditivo e severidade física
            </p>
          </div>
        </div>
        <MachineTable
          machines={machines}
          onSelectMachine={onSelectMachine}
          pageSize={10}
        />
      </div>
    </div>
  );
};
