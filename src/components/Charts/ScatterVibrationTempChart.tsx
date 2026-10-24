import React from 'react';
import { PlotlyChartWrapper } from './PlotlyChartWrapper';
import { Machine } from '../../types/machine';
import { getStatusColor } from '../../utils/calculations';

interface ScatterVibrationTempChartProps {
  machines: Machine[];
  onSelectMachine?: (machineId: string) => void;
}

export const ScatterVibrationTempChart: React.FC<ScatterVibrationTempChartProps> = ({
  machines,
  onSelectMachine,
}) => {
  // Separa por categoria de status para ter legenda interativa
  const categories = [
    'Operando Normal',
    'Alerta de Vibração',
    'Atenção - Temperatura',
    'Risco Crítico de Falha',
  ];

  const traces = categories.map((cat) => {
    const subset = machines.filter((m) => m.status_operacional === cat);
    return {
      x: subset.map((m) => m.sensor_vibracao_mm_s),
      y: subset.map((m) => m.sensor_temp_c),
      text: subset.map(
        (m) =>
          `<b>${m.maquina_id}</b> (${m.tipo_equipamento})<br>` +
          `Linha: ${m.linha_producao}<br>` +
          `Vibração: ${m.sensor_vibracao_mm_s.toFixed(2)} mm/s<br>` +
          `Temperatura: ${m.sensor_temp_c.toFixed(1)} °C<br>` +
          `Risco: <b>${m.risco_parada_percent.toFixed(1)}%</b>`
      ),
      mode: 'markers',
      type: 'scatter',
      name: cat,
      marker: {
        size: subset.map((m) => (m.status_operacional === 'Risco Crítico de Falha' ? 10 : 7)),
        color: getStatusColor(cat),
        opacity: 0.85,
        line: {
          color: cat === 'Risco Crítico de Falha' ? '#FFFFFF' : 'rgba(0,0,0,0.3)',
          width: 1,
        },
      },
      hoverinfo: 'text',
    };
  });

  const layout = {
    title: { text: 'Dispersão: Vibração (X) × Temperatura (Y)', font: { size: 13, weight: 700 } },
    xaxis: {
      title: { text: 'Vibração (mm/s)', font: { size: 11 } },
      gridcolor: 'var(--border-subtle)',
      zerolinecolor: 'var(--border-default)',
    },
    yaxis: {
      title: { text: 'Temperatura (°C)', font: { size: 11 } },
      gridcolor: 'var(--border-subtle)',
      zerolinecolor: 'var(--border-default)',
    },
    showlegend: true,
    legend: {
      orientation: 'h',
      x: 0,
      y: -0.22,
      font: { size: 10 },
    },
    margin: { t: 30, r: 15, b: 45, l: 45 },
    // Linhas de alarme referencial industrial
    shapes: [
      {
        type: 'line',
        x0: 4.5,
        x1: 4.5,
        y0: 30,
        y1: 105,
        line: { color: 'rgba(239, 68, 68, 0.4)', width: 1.5, dash: 'dash' },
      },
      {
        type: 'line',
        x0: 0,
        x1: 8.5,
        y0: 80,
        y1: 80,
        line: { color: 'rgba(245, 158, 11, 0.4)', width: 1.5, dash: 'dash' },
      },
    ],
  };

  return (
    <div className="card h-full flex flex-col justify-between">
      <PlotlyChartWrapper data={traces} layout={layout} style={{ minHeight: '240px' }} />
    </div>
  );
};
