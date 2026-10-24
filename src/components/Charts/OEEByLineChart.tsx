import React from 'react';
import { PlotlyChartWrapper } from './PlotlyChartWrapper';
import { Machine } from '../../types/machine';

interface OEEByLineChartProps {
  machines: Machine[];
}

export const OEEByLineChart: React.FC<OEEByLineChartProps> = ({ machines }) => {
  const lineStats: Record<string, { totalOee: number; count: number }> = {};

  machines.forEach((m) => {
    const line = m.linha_producao || 'Outras';
    if (!lineStats[line]) {
      lineStats[line] = { totalOee: 0, count: 0 };
    }
    lineStats[line].totalOee += m.eficiencia_oee_percent;
    lineStats[line].count++;
  });

  const lines = Object.keys(lineStats).sort();
  const avgOee = lines.map((l) =>
    Number((lineStats[l].totalOee / (lineStats[l].count || 1)).toFixed(1))
  );

  const shortNames = lines.map((l) => l.replace('Linha ', 'L-').replace(' - ', ' '));

  const data = [
    {
      x: shortNames,
      y: avgOee,
      type: 'bar',
      marker: {
        color: avgOee.map((o) =>
          o >= 80 ? '#22C55E' : o >= 70 ? '#F59E0B' : '#EF4444'
        ),
        line: { color: 'var(--border-default)', width: 1 },
      },
      text: avgOee.map((o) => `${o}%`),
      textposition: 'auto',
      hovertext: lines.map((l, i) => `${l}: ${avgOee[i]}% OEE médio`),
      hoverinfo: 'text',
    },
  ];

  const layout = {
    title: { text: 'Eficiência Global (OEE) por Linha (%)', font: { size: 13, weight: 700 } },
    xaxis: {
      gridcolor: 'transparent',
      tickangle: -20,
      tickfont: { size: 10 },
    },
    yaxis: {
      title: { text: 'OEE (%)', font: { size: 11 } },
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
