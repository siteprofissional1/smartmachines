import React from 'react';
import { Wrench, AlertTriangle, Clock, RotateCw, ArrowRight } from 'lucide-react';
import { Machine } from '../types/machine';
import { MTBFvsMTTRChart } from '../components/Charts/MTBFvsMTTRChart';
import { OEEByLineChart } from '../components/Charts/OEEByLineChart';
import { formatDays, formatHours } from '../utils/formatters';

interface PredictiveMaintenancePageProps {
  machines: Machine[];
  onSelectMachine: (machineId: string) => void;
}

export const PredictiveMaintenancePage: React.FC<PredictiveMaintenancePageProps> = ({
  machines,
  onSelectMachine,
}) => {
  // Ranking de criticidade operacional
  const immediateAttention = [...machines]
    .sort((a, b) => b.risco_parada_percent - a.risco_parada_percent)
    .slice(0, 8);

  const due7Days = machines.filter((m) => m.proxima_manutencao_dias <= 7);
  const recurrentFailures = machines.filter((m) => (m.historico_falhas_30d || 0) >= 2);
  const lowOEE = machines.filter((m) => m.eficiencia_oee_percent < 70);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-[var(--text-primary)]">
          Manutenção Preditiva & Confiabilidade
        </h2>
        <p className="text-xs text-[var(--text-secondary)]">
          Planejamento de paradas preventivas e análise preditiva de MTBF, MTTR e OEE
        </p>
      </div>

      {/* Cards de Métricas de Confiabilidade */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4 border-l-4 border-l-red-500 bg-red-500/5">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-1">
            <span className="font-semibold uppercase tracking-wider">Parada Iminente (&le; 7 dias)</span>
            <Clock className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-black text-red-400">{due7Days.length}</div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            Requerem agendamento obrigatório de equipe técnica
          </p>
        </div>

        <div className="card p-4 border-l-4 border-l-amber-500 bg-amber-500/5">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-1">
            <span className="font-semibold uppercase tracking-wider">Falhas Recorrentes (&ge; 2 em 30d)</span>
            <RotateCw className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{recurrentFailures.length}</div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            Histórico repetitivo de paradas no último mês
          </p>
        </div>

        <div className="card p-4 border-l-4 border-l-cyan-500 bg-cyan-500/5">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-1">
            <span className="font-semibold uppercase tracking-wider">OEE Crítico (&lt; 70%)</span>
            <AlertTriangle className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">{lowOEE.length}</div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            Máquinas abaixo da meta de produtividade global
          </p>
        </div>
      </div>

      {/* Gráficos de Confiabilidade */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MTBFvsMTTRChart machines={machines} />
        <OEEByLineChart machines={machines} />
      </div>

      {/* Ranking: Machines Requiring Immediate Attention */}
      <div className="card p-4">
        <h3 className="text-sm font-extrabold text-[var(--text-primary)] uppercase tracking-wider mb-3 flex items-center gap-2">
          <Wrench className="w-4 h-4 text-red-400" />
          Equipamentos que Exigem Atenção Imediata (Ranking Preditivo)
        </h3>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Máquina</th>
                <th>Equipamento</th>
                <th>Linha</th>
                <th>Componente Crítico</th>
                <th className="text-right">Risco Parada</th>
                <th className="text-center">Janela Manutenção</th>
                <th className="text-right">MTBF</th>
                <th className="text-right">MTTR</th>
                <th className="text-center">Ação</th>
              </tr>
            </thead>
            <tbody>
              {immediateAttention.map((m) => (
                <tr 
                  key={m.maquina_id}
                  onClick={() => onSelectMachine(m.maquina_id)}
                  className="hover:bg-[var(--bg-hover)] cursor-pointer"
                >
                  <td className="font-mono font-bold text-[var(--brand-primary)] text-xs">
                    {m.maquina_id}
                  </td>
                  <td className="text-xs font-semibold">{m.tipo_equipamento}</td>
                  <td className="text-xs text-[var(--text-secondary)]">{m.linha_producao}</td>
                  <td className="text-xs text-[var(--text-secondary)]">
                    {m.componente_critico} <span className="font-mono text-[10px] text-[var(--brand-primary)]">({m.codigo_peca_reposicao})</span>
                  </td>
                  <td className="text-right font-mono font-bold text-xs text-[var(--status-critical)]">
                    {m.risco_parada_percent.toFixed(1)}%
                  </td>
                  <td className="text-center">
                    <span className={`text-[11px] px-2 py-0.5 rounded font-bold ${
                      m.proxima_manutencao_dias <= 7 ? 'bg-red-500/20 text-red-400' : 'text-[var(--text-secondary)]'
                    }`}>
                      {formatDays(m.proxima_manutencao_dias)}
                    </span>
                  </td>
                  <td className="text-right font-mono text-xs">{formatHours(m.mtbf_horas)}</td>
                  <td className="text-right font-mono text-xs">{m.mttr_horas.toFixed(1)} h</td>
                  <td className="text-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onSelectMachine(m.maquina_id)}
                      className="btn btn-secondary btn-sm text-[11px] py-1 px-2 flex items-center gap-1 mx-auto"
                    >
                      <span>Inspecionar</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
