import React from 'react';
import { 
  Layers, 
  CheckCircle2, 
  Database, 
  Sparkles, 
  ShoppingBag, 
  ShieldCheck, 
  Globe, 
  Activity, 
  FileText,
  BarChart3,
  Cpu
} from 'lucide-react';
import { AppMode } from '../types/machine';

interface SystemPageProps {
  appMode: AppMode;
  isFirebaseActive: boolean;
  totalMachines: number;
  totalTelemetry: number;
  lastSyncTime: Date;
}

export const SystemPage: React.FC<SystemPageProps> = ({
  appMode,
  isFirebaseActive,
  totalMachines,
  totalTelemetry,
  lastSyncTime,
}) => {
  const pillars = [
    {
      num: 1,
      title: 'Engenharia & Diretivas',
      desc: 'Arquitetura de 3 Camadas Antigravity, SOPs formais e política de Self-Annealing documental.',
      files: 'directives/projeto.md, directives/SOP/*.md',
      status: 'IMPLEMENTADO',
      icon: <FileText className="w-4 h-4 text-cyan-400" />,
    },
    {
      num: 2,
      title: 'UI/UX & Design System',
      desc: 'Industrial Command Center com Dark Mode padrão (#070B11), Light Mode real, tokens e responsividade móvel.',
      files: 'directives/design/design.md, src/styles/theme.css',
      status: 'IMPLEMENTADO',
      icon: <Layers className="w-4 h-4 text-cyan-400" />,
    },
    {
      num: 3,
      title: 'Base RAG & Mineração de Dados',
      desc: 'Dataset industrial com 1.200 leituras, 400 máquinas, validação de schema e retrieval RAG compacto.',
      files: 'data/data_smartmachines_manutencao.csv, agents/data_agent.py',
      status: 'IMPLEMENTADO',
      icon: <Database className="w-4 h-4 text-cyan-400" />,
    },
    {
      num: 4,
      title: 'Web Scraping / Dados Vivos',
      desc: 'Scraper real de peças industriais (SEW, Siemens, SKF) com cache resiliente e comparação de custo.',
      files: 'scraper/parts_scraper.py, data/cache/parts_prices.json',
      status: 'IMPLEMENTADO',
      icon: <ShoppingBag className="w-4 h-4 text-cyan-400" />,
    },
    {
      num: 5,
      title: 'Multi-Agentes & Gemini AI',
      desc: 'Orquestração de Data, Risk, Scraper e Maintenance Agents com saída em JSON estrito.',
      files: 'agents/orchestrator.py, agents/maintenance_agent.py',
      status: 'IMPLEMENTADO',
      icon: <Sparkles className="w-4 h-4 text-cyan-400" />,
    },
    {
      num: 6,
      title: 'Banco Realtime NoSQL — Firestore',
      desc: 'Persistência no Google Cloud Firestore com batch writes e listeners reativos onSnapshot.',
      files: 'scripts/seed_firestore.py, src/services/firebase.ts',
      status: 'IMPLEMENTADO',
      icon: <Activity className="w-4 h-4 text-cyan-400" />,
    },
    {
      num: 7,
      title: 'Governança & Segurança',
      desc: 'Zero secrets no bundle do cliente, regras de leitura restritas no Firestore e proteção do .env.',
      files: 'firestore.rules, .env.example, .gitignore',
      status: 'IMPLEMENTADO',
      icon: <ShieldCheck className="w-4 h-4 text-cyan-400" />,
    },
    {
      num: 8,
      title: 'CI/CD & Deploy em Nuvem',
      desc: 'Pipeline automatizado no GitHub Actions para testes, build e publicação estática no GitHub Pages.',
      files: '.github/workflows/deploy-pages.yml',
      status: 'IMPLEMENTADO',
      icon: <Globe className="w-4 h-4 text-cyan-400" />,
    },
    {
      num: 9,
      title: 'Analytics & Visualizações',
      desc: 'Dashboard analítico interativo com 6 gráficos Plotly.js, dispersão vibração vs temp e métricas OEE/MTBF.',
      files: 'src/components/Charts/*.tsx, src/pages/OverviewPage.tsx',
      status: 'IMPLEMENTADO',
      icon: <BarChart3 className="w-4 h-4 text-cyan-400" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-[var(--text-primary)]">
          Visão Geral do Sistema & Matriz dos 9 Pilares
        </h2>
        <p className="text-xs text-[var(--text-secondary)]">
          Painel de governança técnica e validação das diretrizes oficiais do Hackathon Antigravity SENAI
        </p>
      </div>

      {/* Painéis de Diagnóstico dos Subsistemas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Dataset */}
        <div className="card p-3.5 bg-[var(--bg-elevated)]">
          <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Base de Dados Local</span>
          <div className="text-base font-bold text-[var(--text-primary)] mt-0.5">
            1.200 Leituras Históricas
          </div>
          <p className="text-xs text-[var(--brand-primary)] font-mono mt-1">
            {totalMachines} Máquinas Monitoradas
          </p>
          <span className="badge badge-normal text-[10px] mt-2">CSV VALIDADO</span>
        </div>

        {/* Firestore */}
        <div className="card p-3.5 bg-[var(--bg-elevated)]">
          <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Firebase Firestore</span>
          <div className="text-base font-bold text-[var(--text-primary)] mt-0.5">
            {isFirebaseActive ? 'Conectado em Tempo Real' : 'Modo Local Ativo'}
          </div>
          <p className="text-xs text-[var(--text-muted)] font-mono mt-1">
            Sincronização Reativa
          </p>
          <span className={`badge text-[10px] mt-2 ${isFirebaseActive ? 'badge-normal' : 'badge-alert'}`}>
            {isFirebaseActive ? 'CONECTADO' : 'MODO LOCAL'}
          </span>
        </div>

        {/* Gemini AI */}
        <div className="card p-3.5 bg-[var(--bg-elevated)]">
          <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Motor Preditivo IA</span>
          <div className="text-base font-bold text-cyan-400 mt-0.5">
            Gemini Multi-Agent
          </div>
          <p className="text-xs text-[var(--text-muted)] font-mono mt-1">
            Pipeline Backend Seguro
          </p>
          <span className="badge badge-normal text-[10px] mt-2">CONFIGURADO</span>
        </div>

        {/* Scraper */}
        <div className="card p-3.5 bg-[var(--bg-elevated)]">
          <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Web Scraper</span>
          <div className="text-base font-bold text-blue-400 mt-0.5">
            Peças Industriais
          </div>
          <p className="text-xs text-[var(--text-muted)] font-mono mt-1">
            SEW, Siemens, SKF, WEG
          </p>
          <span className="badge badge-alert text-[10px] mt-2">CACHE ATIVO</span>
        </div>
      </div>

      {/* Diagrama da Arquitetura em 3 Camadas */}
      <div className="card p-5">
        <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider mb-3 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[var(--brand-primary)]" />
          Arquitetura Operacional Antigravity
        </h3>
        <div className="p-4 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--text-secondary)] overflow-x-auto">
          <pre className="leading-relaxed">
{`[CSV Industrial: 1.200 Leituras]
          ↓
  [Data Agent (Python)] ──→ [RAG Local Compacto (< 1.000 tokens)]
          ↓                                 ↓
  [Risk Agent (Determinístico)]    [Scraper Agent + Cache Local]
          ↓                                 ↓
      [Maintenance Agent (Gemini AI Seguro em Python)]
          ↓
  [Firebase Firestore NoSQL] ──→ [onSnapshot Realtime Sync]
          ↓
  [SmartMachines Dashboard (React + TypeScript + Vite + Plotly)]`}
          </pre>
        </div>
      </div>

      {/* Matriz dos 9 Pilares do Hackathon */}
      <div className="card p-5">
        <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-400" />
          Matriz de Conformidade dos 9 Pilares Obrigatórios
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {pillars.map((p) => (
            <div key={p.num} className="p-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    {p.icon}
                    <span className="text-xs font-bold text-[var(--text-primary)]">
                      {p.num}. {p.title}
                    </span>
                  </div>
                  <span className="badge badge-normal text-[9px] py-0 px-1.5">
                    {p.status}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)] mb-2 leading-relaxed">
                  {p.desc}
                </p>
              </div>
              <div className="pt-2 border-t border-[var(--border-subtle)]">
                <span className="font-mono text-[10px] text-[var(--brand-primary)] line-clamp-1">
                  {p.files}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
