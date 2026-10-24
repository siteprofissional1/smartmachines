import React from 'react';
import { Flame, Activity, Gauge, Zap, Volume2 } from 'lucide-react';
import { Machine, TelemetryReading } from '../types/machine';
import { ScatterVibrationTempChart } from '../components/Charts/ScatterVibrationTempChart';
import { formatTemp, formatVibration, formatPSI, formatCurrent, formatNoise, formatDateTime } from '../utils/formatters';

interface TelemetryPageProps {
  machines: Machine[];
  telemetry: TelemetryReading[];
  onSelectMachine: (machineId: string) => void;
}

export const TelemetryPage: React.FC<TelemetryPageProps> = ({
  machines,
  telemetry,
  onSelectMachine,
}) => {
  // Médias dos sensores físicos da amostra atual
  const avgTemp = machines.reduce((acc, m) => acc + m.sensor_temp_c, 0) / (machines.length || 1);
  const avgVib = machines.reduce((acc, m) => acc + m.sensor_vibracao_mm_s, 0) / (machines.length || 1);
  const avgPsi = machines.reduce((acc, m) => acc + m.pressao_psi, 0) / (machines.length || 1);
  const avgAmp = machines.reduce((acc, m) => acc + m.corrente_eletrica_amp, 0) / (machines.length || 1);
  const avgDb = machines.reduce((acc, m) => acc + m.nivel_ruido_db, 0) / (machines.length || 1);

  const highVibration = machines.filter((m) => m.sensor_vibracao_mm_s >= 4.0);
  const highTemp = machines.filter((m) => m.sensor_temp_c >= 80.0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-[var(--text-primary)]">
          Telemetria e Sensores Industriais
        </h2>
        <p className="text-xs text-[var(--text-secondary)]">
          Análise de variáveis físicas (Norma ISO 10816 para vibração mecânica e limites térmicos)
        </p>
      </div>

      {/* Médias Físicas Globais */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="card p-3 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-1">
            <span>Temperatura Média</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold font-mono text-[var(--text-primary)]">
            {formatTemp(avgTemp)}
          </div>
          <span className="text-[10px] text-amber-400">
            {highTemp.length} máquinas &ge; 80 °C
          </span>
        </div>

        <div className="card p-3 border-l-4 border-l-red-500">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-1">
            <span>Vibração Média</span>
            <Activity className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-xl font-bold font-mono text-[var(--text-primary)]">
            {formatVibration(avgVib)}
          </div>
          <span className="text-[10px] text-red-400">
            {highVibration.length} máquinas &ge; 4.0 mm/s
          </span>
        </div>

        <div className="card p-3 border-l-4 border-l-cyan-500">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-1">
            <span>Pressão Média</span>
            <Gauge className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-xl font-bold font-mono text-[var(--text-primary)]">
            {formatPSI(avgPsi)}
          </div>
          <span className="text-[10px] text-[var(--text-muted)]">Faixa: 90 - 150 PSI</span>
        </div>

        <div className="card p-3 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-1">
            <span>Corrente Média</span>
            <Zap className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-bold font-mono text-[var(--text-primary)]">
            {formatCurrent(avgAmp)}
          </div>
          <span className="text-[10px] text-[var(--text-muted)]">Faixa: 15 - 35 A</span>
        </div>

        <div className="card p-3 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-1">
            <span>Ruído Médio</span>
            <Volume2 className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-xl font-bold font-mono text-[var(--text-primary)]">
            {formatNoise(avgDb)}
          </div>
          <span className="text-[10px] text-[var(--text-muted)]">Faixa: 70 - 90 dB</span>
        </div>
      </div>

      {/* Gráfico de Dispersão Destaque */}
      <ScatterVibrationTempChart machines={machines} onSelectMachine={onSelectMachine} />

      {/* Tabela de Leituras Físicas Recentes */}
      <div className="card p-4">
        <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3">
          Últimas Leituras de Sensores por Equipamento
        </h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Máquina</th>
                <th>Equipamento</th>
                <th className="text-right">Temp. (°C)</th>
                <th className="text-right">Vibração (mm/s)</th>
                <th className="text-right">Pressão (PSI)</th>
                <th className="text-right">Corrente (A)</th>
                <th className="text-right">Ruído (dB)</th>
                <th>Data e Hora</th>
              </tr>
            </thead>
            <tbody>
              {machines.slice(0, 15).map((m) => (
                <tr 
                  key={m.maquina_id}
                  onClick={() => onSelectMachine(m.maquina_id)}
                  className="cursor-pointer hover:bg-[var(--bg-hover)]"
                >
                  <td className="font-mono font-bold text-[var(--brand-primary)] text-xs">
                    {m.maquina_id}
                  </td>
                  <td className="text-xs">{m.tipo_equipamento}</td>
                  <td className={`text-right font-mono text-xs ${m.sensor_temp_c >= 80 ? 'text-amber-400 font-bold' : ''}`}>
                    {formatTemp(m.sensor_temp_c)}
                  </td>
                  <td className={`text-right font-mono text-xs ${m.sensor_vibracao_mm_s >= 4.0 ? 'text-red-400 font-bold' : ''}`}>
                    {formatVibration(m.sensor_vibracao_mm_s)}
                  </td>
                  <td className="text-right font-mono text-xs">{formatPSI(m.pressao_psi)}</td>
                  <td className="text-right font-mono text-xs">{formatCurrent(m.corrente_eletrica_amp)}</td>
                  <td className="text-right font-mono text-xs">{formatNoise(m.nivel_ruido_db)}</td>
                  <td className="text-xs text-[var(--text-muted)]">{formatDateTime(m.timestamp_leitura)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
