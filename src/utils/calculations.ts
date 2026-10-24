// SmartMachines — Cálculos Determinísticos e Indicadores Operacionais
import { Machine } from '../types/machine';

export function calculatePlantHealth(machines: Machine[]): number {
  if (!machines || machines.length === 0) return 100.0;
  const total = machines.reduce((acc, m) => acc + (m.health_score || (100.0 - m.risco_parada_percent)), 0);
  return Number((total / machines.length).toFixed(2));
}

export function calculateAverageRisk(machines: Machine[]): number {
  if (!machines || machines.length === 0) return 0.0;
  const total = machines.reduce((acc, m) => acc + m.risco_parada_percent, 0);
  return Number((total / machines.length).toFixed(2));
}

export function calculateAverageOEE(machines: Machine[]): number {
  if (!machines || machines.length === 0) return 0.0;
  const total = machines.reduce((acc, m) => acc + m.eficiencia_oee_percent, 0);
  return Number((total / machines.length).toFixed(2));
}

export function getMachinesAtRisk(machines: Machine[], threshold: number = 70.0): Machine[] {
  if (!machines) return [];
  return machines.filter(m => m.risco_parada_percent >= threshold);
}

export function getUpcomingMaintenance(machines: Machine[], days: number = 7): Machine[] {
  if (!machines) return [];
  return machines.filter(m => m.proxima_manutencao_dias <= days);
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'Operando Normal':
      return '#22C55E';
    case 'Alerta de Vibração':
      return '#F97316';
    case 'Atenção - Temperatura':
      return '#F59E0B';
    case 'Risco Crítico de Falha':
      return '#EF4444';
    default:
      return '#94A3B8';
  }
}

export function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'Operando Normal':
      return 'badge badge-normal';
    case 'Alerta de Vibração':
      return 'badge badge-alert';
    case 'Atenção - Temperatura':
      return 'badge badge-warning';
    case 'Risco Crítico de Falha':
      return 'badge badge-critical';
    default:
      return 'badge badge-neutral';
  }
}
