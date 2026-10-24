import React from 'react';
import { Sparkles, AlertOctagon, CheckCircle2, ShoppingBag, Eye, ShieldAlert, Cpu } from 'lucide-react';
import { AIInsight, Machine } from '../types/machine';
import { formatDateTime } from '../utils/formatters';

interface AIInsightsPageProps {
  insights: AIInsight[];
  onSelectMachine: (machineId: string) => void;
}

export const AIInsightsPage: React.FC<AIInsightsPageProps> = ({
  insights,
  onSelectMachine,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1 rounded bg-cyan-500/20 text-cyan-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-extrabold text-[var(--text-primary)]">
            Diagnósticos Preditivos com IA — Recomendações Gemini
          </h2>
        </div>
        <p className="text-xs text-[var(--text-secondary)]">
          Síntese preditiva gerada pelo Maintenance Agent (Google Gemini) a partir da telemetria e dados de confiabilidade
        </p>
      </div>

      {/* Síntese Executiva da Planta (Plant AI Insight) */}
      <div className="card p-5 border-l-4 border-l-cyan-400 bg-cyan-950/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h3 className="font-extrabold text-sm sm:text-base text-[var(--text-primary)]">
              Síntese Executiva da Planta Fabril
            </h3>
          </div>
          <span className="badge badge-normal text-[10px] bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
            MOTOR PREDITIVO ATIVO
          </span>
        </div>

        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
          A planta opera com <strong>Saúde Global estimada em 73.8%</strong>. As maiores vulnerabilidades operacionais concentram-se na <strong>Linha C (Embalagem)</strong> e <strong>Linha E (Utilidades)</strong>, com anomalias de vibração mecânica em redutores planetários SEW e aquecimento em contatores Siemens. Recomenda-se aprovação imediata das cotações de reposição para evitar paradas não planejadas nas próximas 72 horas.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[var(--border-subtle)] text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Ação Primária</span>
            <p className="font-semibold text-cyan-300">Balanceamento & Lubrificação</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Suprimentos</span>
            <p className="font-semibold text-cyan-300">Aprovar Reserva SEW & Siemens</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Limitações</span>
            <p className="text-[11px] text-[var(--text-muted)]">Validação física obrigatória</p>
          </div>
        </div>
      </div>

      {/* Feed de Insights por Máquina */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold text-[var(--text-primary)] uppercase tracking-wider">
          Diagnósticos Específicos por Ativo
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {insights.map((ins) => (
            <div
              key={ins.insight_id}
              className={`card p-4 border-l-4 transition-all ${
                ins.priority === 'critical'
                  ? 'border-l-[var(--status-critical)]'
                  : 'border-l-[var(--status-warning)]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[var(--brand-primary)]">
                    {ins.machine_id}
                  </span>
                  <span className="text-xs font-bold text-[var(--text-primary)]">
                    {ins.equipment_type}
                  </span>
                  {ins.line && (
                    <span className="text-[11px] text-[var(--text-muted)]">({ins.line})</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`badge ${
                    ins.priority === 'critical' ? 'badge-critical' : 'badge-warning'
                  }`}>
                    {ins.priority === 'critical' ? 'CRÍTICO' : 'ALERTA'}
                  </span>
                  <button
                    onClick={() => onSelectMachine(ins.machine_id)}
                    className="btn btn-secondary btn-sm text-[11px] py-1 px-2.5 flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspecionar</span>
                  </button>
                </div>
              </div>

              <p className="text-xs font-semibold text-[var(--text-primary)] mb-3">
                {ins.summary}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mb-3">
                {/* Sinais Observados */}
                <div className="p-2.5 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                  <span className="text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1.5 block">
                    Sinais Físicos Observados
                  </span>
                  <ul className="space-y-1 text-[var(--text-secondary)] pl-2">
                    {ins.observed_signals.map((sig, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-[var(--brand-primary)]">&bull;</span>
                        <span>{sig}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Causas Prováveis */}
                <div className="p-2.5 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                  <span className="text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1.5 block">
                    Hipóteses Diagnósticas
                  </span>
                  <ul className="space-y-1 text-[var(--text-secondary)] pl-2">
                    {ins.probable_causes.map((cause, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-400">&bull;</span>
                        <span>{cause}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Ações Recomendadas */}
              <div className="mb-3">
                <span className="text-[11px] font-bold text-[var(--text-muted)] block mb-1">
                  Plano de Ação Recomendado:
                </span>
                <div className="space-y-1">
                  {ins.recommended_actions.map((act, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)]">
                <span>Janela: <strong>{ins.recommended_window}</strong></span>
                <span>Componente: <strong>{ins.component_to_inspect}</strong></span>
                <span>Modelo: <strong>{ins.model}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
