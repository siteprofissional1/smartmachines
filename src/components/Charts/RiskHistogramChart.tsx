import React from 'react';
import { PlotlyChartWrapper } from './PlotlyChartWrapper';
import { Machine } from '../../types/machine';

interface RiskHistogramChartProps {
  machines: Machine[];
}

export const RiskHistogramChart: React.FC<RiskHistogramChartProps> = ({ machines }) => {
  const risks = machines.map((m) => m.risco_parada_percent);

  const data = [
    {
      x: risks,
      type: 'histogram',
      nbinsx: 20,
      marker: {
        color: 'rgba(34, 211, 238, 0.75)',
        line: { color: '#0891B2', width: 1 },
      },
      hoverinfo: 'x+y',
    },
  ];

  const layout = {
    title: { text: 'Distribuição Estatística de Risco (Histograma)', font: { size: 13, weight: 700 } },
    xaxis: {
      title: { text: 'Faixa de Risco (%)', font: { size: 11 } },
      gridcolor: 'var(--border-subtle)',
    },
    yaxis: {
      title: { text: 'Qtd. Máquinas', font: { size: 11 } },
      gridcolor: 'var(--border-subtle)',
    },
    margin: { t: 30, r: 15, b: 40, l: 35 },
  };

  return (
    <div className="card h-full flex flex-col justify-between">
      <PlotlyChartWrapper data={data} layout={layout} style={{ minHeight: '220px' }} />
    </div>
  );
};
