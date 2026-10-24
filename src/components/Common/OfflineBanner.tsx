import React from 'react';
import { Database, Zap, Sparkles, Activity } from 'lucide-react';
import { AppMode } from '../../types/machine';

interface OfflineBannerProps {
  appMode: AppMode;
  isFirebaseActive: boolean;
  isDemoActive: boolean;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  appMode,
  isFirebaseActive,
  isDemoActive,
}) => {
  if (isDemoActive) {
    return (
      <div 
        className="flex items-center justify-between px-4 py-2 mb-4 rounded-lg bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-semibold"
        style={{ animation: 'pulse-demo 2s infinite' }}
      >
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 animate-spin" />
          <span>MODO DEMO ATIVO: Telemetria simulada para apresentação em tempo real (dados identificados como demoMode: true).</span>
        </div>
        <span className="badge badge-demo">MODO DEMONSTRAÇÃO</span>
      </div>
    );
  }

  if (appMode === 'LOCAL' || !isFirebaseActive) {
    return (
      <div className="flex items-center justify-between px-4 py-2 mb-4 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] text-xs">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-[var(--brand-primary)]" />
          <span>
            <strong>MODO LOCAL ATIVO:</strong> Operando com dados históricos locais e snapshots otimizados de 400 máquinas (100% resiliente).
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge badge-neutral">DADOS LOCAIS</span>
        </div>
      </div>
    );
  }

  return null;
};
