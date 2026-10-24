// SmartMachines — Data Service Unificado (Local, Fetch & Firestore)
import { 
  FALLBACK_PLANT_SUMMARY, 
  FALLBACK_MACHINES, 
  FALLBACK_TELEMETRY, 
  FALLBACK_PARTS, 
  FALLBACK_AI_INSIGHTS 
} from '../data/fallbackData';
import { 
  Machine, 
  PlantSummary, 
  TelemetryReading, 
  PartQuote, 
  AIInsight,
  AppMode
} from '../types/machine';
import { isFirebaseConfigured, subscribeToMachines, subscribeToAIInsights, subscribeToPartsQuotes } from './firebase';

export interface DataServiceState {
  plantSummary: PlantSummary;
  machines: Machine[];
  telemetry: TelemetryReading[];
  parts: PartQuote[];
  aiInsights: AIInsight[];
  appMode: AppMode;
  isFirebaseActive: boolean;
  isDemoActive: boolean;
  lastSyncTime: Date;
}

export class DataService {
  private static instance: DataService;
  private state: DataServiceState;
  private listeners: ((state: DataServiceState) => void)[] = [];

  private constructor() {
    this.state = {
      plantSummary: FALLBACK_PLANT_SUMMARY as unknown as PlantSummary,
      machines: FALLBACK_MACHINES as unknown as Machine[],
      telemetry: FALLBACK_TELEMETRY as unknown as TelemetryReading[],
      parts: FALLBACK_PARTS as unknown as PartQuote[],
      aiInsights: FALLBACK_AI_INSIGHTS as unknown as AIInsight[],
      appMode: isFirebaseConfigured ? 'CONNECTED' : 'LOCAL',
      isFirebaseActive: isFirebaseConfigured,
      isDemoActive: false,
      lastSyncTime: new Date()
    };

    this.init();
  }

  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  private async init() {
    // 1. Tenta carregar snapshots atualizados via fetch HTTP
    await this.loadSnapshotsFromPublic();

    // 2. Se Firebase estiver configurado, inicia listeners em tempo real
    if (isFirebaseConfigured) {
      this.initFirestoreListeners();
    }
  }

  private async loadSnapshotsFromPublic() {
    try {
      const baseUrl = import.meta.env.BASE_URL || './';
      const [sumRes, machRes, telemRes, partsRes, aiRes] = await Promise.all([
        fetch(`${baseUrl}data/plant-summary.json`).catch(() => null),
        fetch(`${baseUrl}data/machines.json`).catch(() => null),
        fetch(`${baseUrl}data/telemetry.json`).catch(() => null),
        fetch(`${baseUrl}data/parts.json`).catch(() => null),
        fetch(`${baseUrl}data/ai-insights.json`).catch(() => null)
      ]);

      if (sumRes && sumRes.ok) {
        this.state.plantSummary = await sumRes.json();
      }
      if (machRes && machRes.ok) {
        const machines = await machRes.json();
        this.updateMachines(machines);
      }
      if (telemRes && telemRes.ok) {
        this.state.telemetry = await telemRes.json();
      }
      if (partsRes && partsRes.ok) {
        this.state.parts = await partsRes.json();
      }
      if (aiRes && aiRes.ok) {
        this.state.aiInsights = await aiRes.json();
      }

      this.state.lastSyncTime = new Date();
      this.notify();
    } catch (e) {
      console.warn('[SmartMachines] Erro ao carregar snapshots públicos, fallback estático mantido.', e);
    }
  }

  private initFirestoreListeners() {
    subscribeToMachines((machines) => {
      this.updateMachines(machines);
      this.state.appMode = 'CONNECTED';
      this.state.isFirebaseActive = true;
      this.notify();
    }, (err) => {
      console.warn('[SmartMachines] Falha no listener Firestore. Alternando para LOCAL.', err);
      this.state.appMode = 'LOCAL';
      this.state.isFirebaseActive = false;
      this.notify();
    });

    subscribeToAIInsights((insights) => {
      this.state.aiInsights = insights;
      this.notify();
    });

    subscribeToPartsQuotes((quotes) => {
      this.state.parts = quotes;
      this.notify();
    });
  }

  private updateMachines(machines: Machine[]) {
    this.state.machines = machines;
    // Detecta se há evento de simulação ativo
    const hasDemo = machines.some(m => m.demoMode);
    this.state.isDemoActive = hasDemo;
    if (hasDemo) {
      this.state.appMode = 'DEMO';
    }
    this.state.lastSyncTime = new Date();
  }

  public getState(): DataServiceState {
    return { ...this.state };
  }

  public subscribe(listener: (state: DataServiceState) => void): () => void {
    this.listeners.push(listener);
    listener(this.state);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    const currentState = this.getState();
    this.listeners.forEach(l => l(currentState));
  }

  public async reloadData() {
    await this.loadSnapshotsFromPublic();
  }
}

export const dataService = DataService.getInstance();
