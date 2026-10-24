import React from 'react';
import { PlotlyChartWrapper } from './PlotlyChartWrapper';
import { Machine } from '../../types/machine';

interface StatusDonutChartProps {
  machines: Machine[];
}

export const StatusDonutChart: React.FC<StatusDonutChartProps> = ({ machines }) => {
  const counts: Record<string, number> = {
    'Operando Normal': 0,
    'Alerta de Vibração': 0,
    'Atenção - Temperatura': 0,
    'Risco Crítico de Falha': 0,
  };

  machines.forEach((m) => {
    if (counts[m.status_operacional] !== undefined) {
      counts[m.status_operacional]++;
    } else {
      counts['Operando Normal']++;
    }
  });

  const labels = Object.keys(counts);
  const values = Object.values(counts);
  const colors = ['#22C55E', '#F97316', '#F59E0B', '#EF4444'];

  const data = [
    {
      values,
      labels,
      type: 'pie',
      hole: 0.62,
      marker: {
        colors,
        line: { color: 'var(--border-default)', width: 2 },
      },
      textinfo: 'percent',
      hoverinfo: 'label+value+percent',
      textposition: 'inside',
    },
  ];

  const layout = {
    title: { text: 'Distribuição dos Estados Operacionais', font: { size: 12, weight: 700 } },
    showlegend: true,
    legend: {
      orientation: 'h',
      x: 0,
      y: -0.15,
      font: { size: 9 },
    },
    margin: { t: 30, r: 10, b: 35, l: 10 },
  };

  return (
    <div className="card h-full flex flex-col justify-between">
      <PlotlyChartWrapper data={data} layout={layout} style={{ minHeight: '220px' }} />
    </div>
  );
};
