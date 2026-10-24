import React from 'react';
import { PlotlyChartWrapper } from './PlotlyChartWrapper';
import { Machine } from '../../types/machine';

interface MTBFvsMTTRChartProps {
  machines: Machine[];
}

export const MTBFvsMTTRChart: React.FC<MTBFvsMTTRChartProps> = ({ machines }) => {
  const data = [
    {
      x: machines.map((m) => m.mtbf_horas),
      y: machines.map((m) => m.mttr_horas),
      text: machines.map(
        (m) =>
          `<b>${m.maquina_id}</b> (${m.tipo_equipamento})<br>` +
          `MTBF: ${m.mtbf_horas.toFixed(1)} h<br>` +
          `MTTR: ${m.mttr_horas.toFixed(1)} h<br>` +
          `OEE: ${m.eficiencia_oee_percent.toFixed(1)}%`
      ),
      mode: 'markers',
      type: 'scatter',
      marker: {
        size: 7,
        color: machines.map((m) => m.eficiencia_oee_percent),
        colorscale: 'Viridis',
        colorbar: {
          title: { text: 'OEE %', font: { size: 10 } },
          len: 0.8,
          thickness: 10,
        },
        opacity: 0.8,
      },
      hoverinfo: 'text',
    },
  ];

  const layout = {
    title: { text: 'Confiabilidade: MTBF (X) × MTTR (Y)', font: { size: 13, weight: 700 } },
    xaxis: {
      title: { text: 'MTBF - Tempo Médio Entre Falhas (horas)', font: { size: 11 } },
      gridcolor: 'var(--border-subtle)',
    },
    yaxis: {
      title: { text: 'MTTR - Tempo Médio de Reparo (horas)', font: { size: 11 } },
      gridcolor: 'var(--border-subtle)',
    },
    margin: { t: 30, r: 40, b: 40, l: 40 },
  };

  return (
    <div className="card h-full flex flex-col justify-between">
      <PlotlyChartWrapper data={data} layout={layout} style={{ minHeight: '230px' }} />
    </div>
  );
};
