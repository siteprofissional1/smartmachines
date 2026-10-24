import React from 'react';
import { 
  LayoutDashboard, 
  Cpu, 
  Gauge, 
  Wrench, 
  ShoppingBag, 
  Sparkles, 
  Layers, 
  X
} from 'lucide-react';
import { ActiveTab } from '../types/machine';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  mobileOpen,
  onCloseMobile,
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'overview', label: 'Visão Geral', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'machines', label: 'Inventário de Máquinas', icon: <Cpu className="w-4 h-4" />, badge: '400' },
    { id: 'telemetry', label: 'Telemetria & Sensores', icon: <Gauge className="w-4 h-4" /> },
    { id: 'predictive', label: 'Manutenção Preditiva', icon: <Wrench className="w-4 h-4" /> },
    { id: 'parts', label: 'Cotações de Peças', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'insights', label: 'Diagnósticos com IA', icon: <Sparkles className="w-4 h-4" />, badge: 'Gemini' },
    { id: 'system', label: 'Arquitetura & 9 Pilares', icon: <Layers className="w-4 h-4" /> },
  ];

  const handleSelect = (tab: ActiveTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  const content = (
    <div className="flex flex-col h-full justify-between">
      <div>
        <div className="flex items-center justify-between px-3 py-4 lg:hidden border-b border-[var(--border-default)] mb-2">
          <span className="font-bold text-sm text-[var(--text-primary)]">Navegação</span>
          <button 
            onClick={onCloseMobile}
            className="p-1 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            aria-label="Fechar Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="space-y-1 px-2 py-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[var(--brand-primary)]/15 text-[var(--brand-primary)] border border-[var(--brand-primary)]/30'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-[var(--brand-primary)]' : 'text-[var(--text-muted)]'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    isActive 
                      ? 'bg-[var(--brand-primary)] text-[#070B11]' 
                      : 'bg-[var(--bg-elevated)] text-[var(--text-muted)]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Informações da Planta no rodapé da Sidebar */}
      <div className="p-3 m-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
        <div className="font-bold text-[var(--text-primary)] mb-1 flex items-center justify-between">
          <span>Planta Industrial</span>
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        </div>
        <p className="text-[11px] text-[var(--text-muted)]">5 Linhas de Produção</p>
        <p className="text-[11px] text-[var(--text-muted)]">Operação 24/7 (3 Turnos)</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Sidebar Desktop Fixa Otimizada */}
      <aside 
        id="app-sidebar"
        className="hidden lg:block w-56 xl:w-60 flex-shrink-0 bg-[var(--bg-surface)] border-r border-[var(--border-default)] h-[calc(100vh-57px)] sticky top-[57px]"
      >
        {content}
      </aside>

      {/* Drawer Mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onCloseMobile}
          ></div>
          <div className="relative w-72 max-w-[80%] bg-[var(--bg-surface)] h-full z-10 border-r border-[var(--border-default)] shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
