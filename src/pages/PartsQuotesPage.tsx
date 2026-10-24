import React from 'react';
import { ShoppingBag, ExternalLink, RefreshCw, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { PartQuote } from '../types/machine';
import { formatBRL, formatDateTime } from '../utils/formatters';

interface PartsQuotesPageProps {
  parts: PartQuote[];
  onRefreshQuotes?: () => void;
}

export const PartsQuotesPage: React.FC<PartsQuotesPageProps> = ({
  parts,
  onRefreshQuotes,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-[var(--text-primary)]">
            Cotações de Peças Industriais Sobressalentes
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            Comparativo de custo histórico com preços em tempo real coletados pelo Scraper Agent (SEW, Siemens, SKF, WEG, FESTO)
          </p>
        </div>
        {onRefreshQuotes && (
          <button onClick={onRefreshQuotes} className="btn btn-secondary text-xs flex items-center gap-1.5 self-start sm:self-auto">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Atualizar Cotações</span>
          </button>
        )}
      </div>

      {/* Cards de Resumo de Suprimentos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4 border-l-4 border-l-blue-500">
          <span className="text-xs text-[var(--text-secondary)] uppercase font-semibold">Peças Homologadas</span>
          <div className="text-2xl font-black text-[var(--text-primary)] mt-1">{parts.length}</div>
          <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Componentes de reposição crítica</p>
        </div>

        <div className="card p-4 border-l-4 border-l-green-500">
          <span className="text-xs text-[var(--text-secondary)] uppercase font-semibold">Status do Scraper</span>
          <div className="text-2xl font-black text-green-400 mt-1 flex items-center gap-2">
            <span>ATIVO</span>
            <span className="badge badge-normal text-[10px]">CACHE RESILIENTE</span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Degradação suave ativada</p>
        </div>

        <div className="card p-4 border-l-4 border-l-amber-500">
          <span className="text-xs text-[var(--text-secondary)] uppercase font-semibold">Variação Média de Mercado</span>
          <div className="text-2xl font-black text-amber-400 mt-1">+4.2%</div>
          <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Impacto inflacionário setorial</p>
        </div>
      </div>

      {/* Tabela Comparativa de Preços */}
      <div className="card p-0 overflow-hidden">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Código Peça</th>
                <th>Componente Crítico</th>
                <th>Fornecedor Homologado</th>
                <th className="text-right">Custo Histórico</th>
                <th className="text-right">Preço Mercado</th>
                <th className="text-right">Diferença (R$)</th>
                <th className="text-right">Variação (%)</th>
                <th>Fonte / Canal</th>
                <th className="text-center">Status</th>
                <th className="text-center">Link</th>
              </tr>
            </thead>
            <tbody>
              {parts.map((p) => {
                const price = p.price ?? p.external_price;
                return (
                  <tr key={p.part_code} className="hover:bg-[var(--bg-hover)]">
                    <td className="font-mono font-bold text-xs text-[var(--brand-primary)]">
                      {p.part_code}
                    </td>
                    <td className="text-xs font-semibold text-[var(--text-primary)]">
                      {p.component}
                    </td>
                    <td className="text-xs text-[var(--text-secondary)]">
                      {p.supplier}
                    </td>
                    <td className="text-right font-mono text-xs text-[var(--text-secondary)]">
                      {formatBRL(p.historical_cost)}
                    </td>
                    <td className="text-right font-mono text-xs font-bold text-[var(--text-primary)]">
                      {price !== null && price !== undefined ? formatBRL(price) : '—'}
                    </td>
                    <td className="text-right font-mono text-xs font-medium text-amber-400">
                      {p.diff_value ? `+${formatBRL(p.diff_value)}` : '—'}
                    </td>
                    <td className="text-right font-mono text-xs font-bold text-amber-400">
                      {p.diff_percent ? `+${p.diff_percent.toFixed(1)}%` : '—'}
                    </td>
                    <td className="text-xs text-[var(--text-muted)]">
                      {p.source}
                    </td>
                    <td className="text-center">
                      <span className={`badge ${
                        p.status === 'LIVE' 
                          ? 'badge-normal' 
                          : p.status === 'CACHED' 
                          ? 'badge-alert' 
                          : 'badge-neutral'
                      }`}>
                        {p.status === 'LIVE' ? 'AO VIVO' : p.status === 'CACHED' ? 'EM CACHE' : 'CATÁLOGO'}
                      </span>
                    </td>
                    <td className="text-center">
                      {p.url ? (
                        <a 
                          href={p.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-1 rounded text-[var(--brand-primary)] hover:text-white inline-flex items-center"
                          title="Abrir cotação pública"
                          aria-label={`Abrir cotação ${p.part_code}`}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <span className="text-[var(--text-muted)] text-xs">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
