import React from 'react';
import { 
  Activity, 
  Cpu, 
  Database, 
  Sun, 
  Moon, 
  Menu, 
  RefreshCw,
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { formatDateTime } from '../utils/formatters';

interface HeaderProps {
  isFirebaseActive: boolean;
  isDemoActive: boolean;
  lastSyncTime: Date;
  onRefresh: () => void;
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isFirebaseActive,
  isDemoActive,
  lastSyncTime,
  onRefresh,
  onToggleMobileMenu,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header 
      id="main-header"
      className="sticky top-0 z-40 w-full bg-[var(--bg-surface)] border-b border-[var(--border-default)] px-4 py-3 flex items-center justify-between"
      style={{ backdropFilter: 'blur(8px)' }}
    >
      <div className="flex items-center gap-3">
        {/* Botão Hambúrguer para Mobile */}
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          aria-label="Abrir Menu Lateral"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Marca SmartMachines */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[var(--brand-primary)]/15 border border-[var(--brand-primary)]/30 flex items-center justify-center text-[var(--brand-primary)]">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-[var(--text-primary)]">
                SmartMachines
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--brand-primary)]/15 text-[var(--brand-primary)] border border-[var(--brand-primary)]/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] hidden sm:block">
              Inteligência em Manutenção Preditiva
            </p>
          </div>
        </div>
      </div>

      {/* Indicadores de Status e Conexões */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Status Firebase */}
        <div 
          className="hidden md:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-default)]"
          title={isFirebaseActive ? 'Firebase Firestore conectado em tempo real' : 'Operando no modo local resiliente'}
        >
          <Database className={`w-3.5 h-3.5 ${isFirebaseActive ? 'text-green-400' : 'text-amber-400'}`} />
          <span className="text-[11px] text-[var(--text-secondary)]">
            Firebase: <strong className={isFirebaseActive ? 'text-green-400' : 'text-amber-400'}>
              {isFirebaseActive ? 'CONECTADO' : 'LOCAL'}
            </strong>
          </span>
        </div>

        {/* Status AI */}
        <div 
          className="hidden lg:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-default)]"
          title="Agente Gemini AI para recomendações preditivas"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px] text-[var(--text-secondary)]">
            IA: <strong className="text-cyan-400">ONLINE</strong>
          </span>
        </div>

        {/* Status Scraper */}
        <div 
          className="hidden xl:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-default)]"
          title="Scraper de cotações com cache inteligente"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-[11px] text-[var(--text-secondary)]">
            Cotações: <strong className="text-blue-400">EM CACHE</strong>
          </span>
        </div>

        {/* Badge Demo */}
        {isDemoActive && (
          <span className="badge badge-demo">
            MODO DEMONSTRAÇÃO
          </span>
        )}

        {/* Botão Atualizar */}
        <button
          onClick={onRefresh}
          className="p-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-highlight)] transition-colors"
          title="Recarregar Dados"
          aria-label="Recarregar Dados"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Alternador de Tema Dark / Light */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-highlight)] transition-colors"
          title={`Alternar para tema ${theme === 'dark' ? 'claro' : 'escuro'}`}
          aria-label="Alternar Tema"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-blue-400" />
          )}
        </button>
      </div>
    </header>
  );
};
