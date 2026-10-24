// SmartMachines — Definições de Tipos TypeScript

export type OperationalStatus = 
  | 'Operando Normal' 
  | 'Alerta de Vibração' 
  | 'Atenção - Temperatura' 
  | 'Risco Crítico de Falha';

export type QuoteStatus = 'LIVE' | 'CACHED' | 'UNAVAILABLE';

export type AppMode = 'LOCAL' | 'CONNECTED' | 'DEMO' | 'PRODUCTION';

export interface Machine {
  registro_id: string;
  maquina_id: string;
  tipo_equipamento: string;
  linha_producao: string;
  turno_operacao: string;
  status_operacional: OperationalStatus;
  sensor_temp_c: number;
  sensor_vibracao_mm_s: number;
  pressao_psi: number;
  corrente_eletrica_amp: number;
  nivel_ruido_db: number;
  horas_uso: number;
  mtbf_horas: number;
  mttr_horas: number;
  eficiencia_oee_percent: number;
  risco_parada_percent: number;
  health_score: number;
  proxima_manutencao_dias: number;
  historico_falhas_30d: number;
  componente_critico: string;
  codigo_peca_reposicao: string;
  fornecedor_homologado: string;
  'custo_estimado_peca_r$': number;
  lead_time_fornecedor_dias: number;
  timestamp_leitura: string;
  diagnostico_preditivo_ia: string;
  demoMode?: boolean;
  demoEventAt?: string;
}

export interface TelemetryReading {
  registro_id: string;
  timestamp_leitura: string;
  maquina_id: string;
  tipo_equipamento: string;
  linha_producao: string;
  status_operacional: string;
  sensor_temp_c: number;
  sensor_vibracao_mm_s: number;
  pressao_psi: number;
  corrente_eletrica_amp: number;
  nivel_ruido_db: number;
  risco_parada_percent: number;
  eficiencia_oee_percent: number;
  demoMode?: boolean;
}

export interface PartQuote {
  part_code: string;
  component: string;
  supplier: string;
  historical_cost: number;
  price: number | null;
  external_price?: number | null;
  diff_value: number;
  diff_percent: number;
  currency: string;
  lead_time_days: number;
  source: string;
  url: string;
  updated_at: string;
  status: QuoteStatus;
}

export interface AIInsight {
  insight_id: string;
  machine_id: string;
  equipment_type: string;
  line?: string;
  priority: 'critical' | 'warning' | 'normal';
  summary: string;
  observed_signals: string[];
  probable_causes: string[];
  recommended_actions: string[];
  component_to_inspect: string;
  recommended_window: string;
  purchase_recommendation: string;
  reasoning_summary: string;
  limitations: string;
  generated_at: string;
  model: string;
  status?: string;
}

export interface StatusDistributionItem {
  status: OperationalStatus;
  count: number;
  color: string;
}

export interface LinhaProducaoData {
  linha: string;
  risco_medio: number;
  oee_medio: number;
  total_maquinas: number;
}

export interface PlantSummary {
  kpis: {
    total_machines: number;
    plant_health: number;
    critical_machines: number;
    vibration_alerts: number;
    temperature_alerts: number;
    normal_machines: number;
    average_risk: number;
    average_oee: number;
    average_mtbf: number;
    average_mttr: number;
    failures_last_30d: number;
    maintenance_due_7d: number;
    maintenance_due_30d: number;
  };
  status_distribution: StatusDistributionItem[];
  linhas_producao: LinhaProducaoData[];
  attention_required: Machine[];
  last_updated: string;
}

export interface FilterState {
  linha: string;
  turno: string;
  status: string;
  searchQuery: string;
}

export type ActiveTab = 
  | 'overview' 
  | 'machines' 
  | 'telemetry' 
  | 'predictive' 
  | 'parts' 
  | 'insights' 
  | 'system';
