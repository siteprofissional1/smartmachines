import React from 'react';
import { 
  X, 
  Flame, 
  Activity, 
  Gauge, 
  Wrench, 
  ShoppingBag, 
  Sparkles, 
  ExternalLink,
  ShieldAlert,
  Clock,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { Machine, PartQuote, AIInsight, TelemetryReading } from '../types/machine';
import { 
  formatTemp, 
  formatVibration, 
  formatPSI, 
  formatCurrent, 
  formatNoise, 
  formatHours, 
  formatDays, 
  formatBRL, 
  formatDateTime 
} from '../utils/formatters';
import { getStatusBadgeClass } from '../utils/calculations';
import { PlotlyChartWrapper } from './Charts/PlotlyChartWrapper';

interface MachineDetailModalProps {
  machine: Machine | null;
  quote?: PartQuote;
  insight?: AIInsight;
  telemetryHistory: TelemetryReading[];
  onClose: () => void;
}

export const MachineDetailModal: React.FC<MachineDetailModalProps> = ({
  machine,
  quote,
  insight,
  telemetryHistory,
  onClose,
}) => {
  if (!machine) return null;

  // Filtra histórico de telemetria desta máquina
  const machineHistory = telemetryHistory
    .filter((t) => t.maquina_id === machine.maquina_id)
    .sort((a, b) => new Date(a.timestamp_leitura).getTime() - new Date(b.timestamp_leitura).getTime());

  // Gráfico mini de evolução histórica
  const historyData = [
    {
      x: machineHistory.map((t) => t.timestamp_leitura),
      y: machineHistory.map((t) => t.sensor_vibracao_mm_s),
      name: 'Vibração (mm/s)',
      type: 'scatter',
      mode: 'lines+markers',
      line: { color: '#EF4444', width: 2 },
      marker: { size: 6 },
    },
    {
      x: machineHistory.map((t) => t.timestamp_leitura),
      y: machineHistory.map((t) => t.sensor_temp_c),
      name: 'Temp (°C)',
      yaxis: 'y2',
      type: 'scatter',
      mode: 'lines+markers',
      line: { color: '#F59E0B', width: 2 },
      marker: { size: 6 },
    },
  ];

  const historyLayout = {
    title: { text: 'Histórico Recente de Sensores', font: { size: 12, weight: 700 } },
    xaxis: { gridcolor: 'var(--border-subtle)', tickfont: { size: 9 } },
    yaxis: { title: { text: 'Vibração', font: { size: 10 } }, gridcolor: 'var(--border-subtle)' },
    yaxis2: {
      title: { text: 'Temp (°C)', font: { size: 10 } },
      overlaying: 'y',
      side: 'right',
      gridcolor: 'transparent',
    },
    showlegend: true,
    legend: { orientation: 'h', x: 0, y: -0.2, font: { size: 9 } },
    margin: { t: 30, r: 40, b: 40, l: 40 },
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        id="machine-detail-modal"
        className="modal-drawer" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Topo do Drawer */}
        <div className="flex items-start justify-between pb-3 border-b border-[var(--border-default)]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-lg font-black text-[var(--brand-primary)]">
                {machine.maquina_id}
              </span>
              <span className={getStatusBadgeClass(machine.status_operacional)}>
                {machine.status_operacional}
              </span>
              {machine.demoMode && (
                <span className="badge badge-demo">MODO DEMONSTRAÇÃO</span>
              )}
            </div>
            <h2 className="text-base font-bold text-[var(--text-primary)]">
              {machine.tipo_equipamento}
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              {machine.linha_producao} &bull; {machine.turno_operacao} &bull; Leitura: {formatDateTime(machine.timestamp_leitura)}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            aria-label="Fechar Gaveta"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. KPIs de Confiabilidade & Saúde */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="card p-2.5 bg-[var(--bg-elevated)] text-center">
            <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Saúde do Ativo</span>
            <div className="text-lg font-black text-[var(--brand-primary)]">
              {machine.health_score.toFixed(1)}%
            </div>
          </div>
          <div className="card p-2.5 bg-[var(--bg-elevated)] text-center">
            <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Risco de Parada</span>
            <div className={`text-lg font-black ${
              machine.risco_parada_percent >= 70 ? 'text-[var(--status-critical)]' : 'text-amber-400'
            }`}>
              {machine.risco_parada_percent.toFixed(1)}%
            </div>
          </div>
          <div className="card p-2.5 bg-[var(--bg-elevated)] text-center">
            <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Eficiência (OEE)</span>
            <div className="text-lg font-black text-green-400">
              {machine.eficiencia_oee_percent.toFixed(1)}%
            </div>
          </div>
          <div className="card p-2.5 bg-[var(--bg-elevated)] text-center">
            <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Próxima Manutenção</span>
            <div className={`text-lg font-black ${
              machine.proxima_manutencao_dias <= 7 ? 'text-red-400' : 'text-[var(--text-primary)]'
            }`}>
              {formatDays(machine.proxima_manutencao_dias)}
            </div>
          </div>
        </div>

        {/* 2. Telemetria Física Instantânea */}
        <div className="card p-3.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-3 flex items-center gap-1.5">
            <Gauge className="w-4 h-4 text-[var(--brand-primary)]" />
            Sensores Físicos de Telemetria
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <div className="p-2 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
              <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400" /> Temp.
              </span>
              <div className="font-mono text-sm font-bold text-[var(--text-primary)] mt-0.5">
                {formatTemp(machine.sensor_temp_c)}
              </div>
            </div>

            <div className="p-2 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
              <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                <Activity className="w-3 h-3 text-red-400" /> Vibração
              </span>
              <div className="font-mono text-sm font-bold text-[var(--text-primary)] mt-0.5">
                {formatVibration(machine.sensor_vibracao_mm_s)}
              </div>
            </div>

            <div className="p-2 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
              <span className="text-[10px] text-[var(--text-muted)]">Pressão</span>
              <div className="font-mono text-sm font-bold text-[var(--text-primary)] mt-0.5">
                {formatPSI(machine.pressao_psi)}
              </div>
            </div>

            <div className="p-2 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
              <span className="text-[10px] text-[var(--text-muted)]">Corrente</span>
              <div className="font-mono text-sm font-bold text-[var(--text-primary)] mt-0.5">
                {formatCurrent(machine.corrente_eletrica_amp)}
              </div>
            </div>

            <div className="p-2 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
              <span className="text-[10px] text-[var(--text-muted)]">Ruído</span>
              <div className="font-mono text-sm font-bold text-[var(--text-primary)] mt-0.5">
                {formatNoise(machine.nivel_ruido_db)}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-3 pt-2 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-secondary)]">
            <span>Horímetro: <strong>{formatHours(machine.horas_uso)}</strong></span>
            <span>MTBF: <strong>{machine.mtbf_horas.toFixed(1)} h</strong></span>
            <span>MTTR: <strong>{machine.mttr_horas.toFixed(1)} h</strong></span>
            <span>Falhas 30d: <strong>{machine.historico_falhas_30d}</strong></span>
          </div>
        </div>

        {/* 3. Peça de Reposição & Cotação Externa */}
        <div className="card p-3.5 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-blue-400" />
              Componente Crítico & Cotação de Reposição
            </h3>
            {quote && (
              <span className={`badge ${
                quote.status === 'LIVE' ? 'badge-normal' : quote.status === 'CACHED' ? 'badge-alert' : 'badge-neutral'
              }`}>
                {quote.status === 'LIVE' ? 'AO VIVO' : quote.status === 'CACHED' ? 'EM CACHE' : 'CATÁLOGO'}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-3">
            <div>
              <p className="text-[11px] text-[var(--text-muted)]">Componente</p>
              <p className="font-semibold text-[var(--text-primary)]">{machine.componente_critico}</p>
              <p className="text-[11px] font-mono text-[var(--brand-primary)] mt-0.5">
                Código da Peça: {machine.codigo_peca_reposicao}
              </p>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Fornecedor Homologado: {machine.fornecedor_homologado}
              </p>
            </div>

            <div className="p-2.5 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-1">
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Custo Médio de Catálogo:</span>
                <span className="font-mono font-medium">{formatBRL(machine['custo_estimado_peca_r$'])}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Preço Atual de Mercado:</span>
                <span className="font-mono font-bold text-blue-400">
                  {formatBRL(quote?.price || (machine['custo_estimado_peca_r$'] * 1.049))}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">Variação de Mercado:</span>
                <span className="font-mono font-bold text-amber-400">
                  +4.9% (+{formatBRL(machine['custo_estimado_peca_r$'] * 0.049)})
                </span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[var(--text-muted)]">Prazo de Entrega do Fornecedor:</span>
                <span className="font-medium text-[var(--text-secondary)]">{machine.lead_time_fornecedor_dias} dias</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Diagnóstico Comparativo: Baseline Dataset vs. Gemini AI */}
        <div className="space-y-3">
          {/* Baseline Original */}
          <div className="card p-3.5 bg-[var(--bg-elevated)] border-dashed">
            <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              Diagnóstico Histórico da Máquina (Base de Dados)
            </h4>
            <p className="text-xs text-[var(--text-secondary)] italic leading-relaxed">
              "{machine.diagnostico_preditivo_ia}"
            </p>
          </div>

          {/* Gemini AI Predictive Insight */}
          <div className="card p-3.5 border-l-4 border-l-cyan-400 bg-cyan-950/15">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-extrabold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Diagnóstico e Plano de Ação da IA Gemini
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                {insight?.model || 'Gemini 2.0 Flash'}
              </span>
            </div>

            <p className="text-xs font-semibold text-[var(--text-primary)] mb-2">
              {insight?.summary || 'Intervenção preventiva recomendada por divergência paramétrica.'}
            </p>

            <div className="space-y-1.5 mb-2.5">
              <span className="text-[11px] font-bold text-[var(--text-muted)]">Ações Mecânicas Recomendadas:</span>
              <ul className="text-xs space-y-1 text-[var(--text-secondary)] pl-3">
                {(insight?.recommended_actions || [
                  `Inspecionar visualmente e executar termografia em ${machine.componente_critico}`,
                  `Verificar folga angular e nível de lubrificação no part-number ${machine.codigo_peca_reposicao}`,
                  `Solicitar cotação de reserva preventiva junto ao fornecedor ${machine.fornecedor_homologado}`,
                  `Programar janela de parada em até ${machine.proxima_manutencao_dias} dias`
                ]).map((act, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-2 rounded bg-[var(--bg-surface)] text-[11px] text-[var(--text-muted)] flex items-center justify-between">
              <span>Janela Crítica: <strong>{insight?.recommended_window || `Em até ${machine.proxima_manutencao_dias} dias`}</strong></span>
              <span className="italic">Validação técnica presencial obrigatória</span>
            </div>
          </div>
        </div>

        {/* 5. Mini Gráfico Histórico */}
        {machineHistory.length > 1 && (
          <div className="card p-2">
            <PlotlyChartWrapper data={historyData} layout={historyLayout} style={{ minHeight: '220px' }} />
          </div>
        )}
      </div>
    </div>
  );
};
