import React from 'react';
import { PlotlyChartWrapper } from './PlotlyChartWrapper';
import { Machine } from '../../types/machine';

interface RiskByLineChartProps {
  machines: Machine[];
}

export const RiskByLineChart: React.FC<RiskByLineChartProps> = ({ machines }) => {
  const lineStats: Record<string, { totalRisk: number; count: number }> = {};

  machines.forEach((m) => {
    const line = m.linha_producao || 'Outras';
    if (!lineStats[line]) {
      lineStats[line] = { totalRisk: 0, count: 0 };
    }
    lineStats[line].totalRisk += m.risco_parada_percent;
    lineStats[line].count++;
  });

  const lines = Object.keys(lineStats).sort();
  const avgRisks = lines.map((l) =>
    Number((lineStats[l].totalRisk / (lineStats[l].count || 1)).toFixed(1))
  );

  // Formata os nomes para caberem no eixo sem quebrar no mobile
  const shortNames = lines.map((l) => l.replace('Linha ', 'L-').replace(' - ', ' '));

  const data = [
    {
      x: shortNames,
      y: avgRisks,
      type: 'bar',
      marker: {
        color: avgRisks.map((r) =>
          r >= 45 ? '#EF4444' : r >= 30 ? '#F97316' : '#22D3EE'
        ),
        line: { color: 'var(--border-default)', width: 1 },
      },
      text: avgRisks.map((r) => `${r}%`),
      textposition: 'auto',
      hovertext: lines.map((l, i) => `${l}: ${avgRisks[i]}% de risco médio`),
      hoverinfo: 'text',
    },
  ];

  const layout = {
    title: { text: 'Risco Médio por Linha de Produção (%)', font: { size: 13, weight: 700 } },
    xaxis: {
      gridcolor: 'transparent',
      tickangle: -20,
      tickfont: { size: 10 },
    },
    yaxis: {
      title: { text: 'Risco (%)', font: { size: 11 } },
      gridcolor: 'var(--border-subtle)',
      range: [0, 100],
    },
    margin: { t: 30, r: 10, b: 45, l: 35 },
  };

  return (
    <div className="card h-full flex flex-col justify-between">
      <PlotlyChartWrapper data={data} layout={layout} style={{ minHeight: '220px' }} />
    </div>
  );
};
