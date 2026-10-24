// SmartMachines — Integração Segura com Firebase Web SDK
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot, query, limit, orderBy } from 'firebase/firestore';
import { Machine, AIInsight, PartQuote } from '../types/machine';

// Configuração pública do Firebase Web SDK
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
};

let app = null;
let db: any = null;
let isConfigured = false;

try {
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== 'your_firebase_api_key_here') {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    isConfigured = true;
    console.info('[SmartMachines] Firebase Web SDK inicializado com sucesso.');
  } else {
    console.info('[SmartMachines] Firebase não configurado. Operando em modo LOCAL DATA.');
  }
} catch (error) {
  console.warn('[SmartMachines] Falha ao inicializar Firebase. Modo LOCAL DATA ativado.', error);
  isConfigured = false;
  db = null;
}

export { db, isConfigured as isFirebaseConfigured };

// Listeners em tempo real via onSnapshot
export function subscribeToMachines(onUpdate: (machines: Machine[]) => void, onError?: (err: any) => void) {
  if (!db || !isConfigured) return () => {};

  try {
    const q = collection(db, 'machines');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Machine[] = [];
      snapshot.forEach((doc) => {
        data.push(doc.data() as Machine);
      });
      if (data.length > 0) {
        onUpdate(data);
      }
    }, (err) => {
      console.warn('[SmartMachines] Listener machines Firestore:', err);
      if (onError) onError(err);
    });
    return unsubscribe;
  } catch (err) {
    console.warn('[SmartMachines] Erro ao subscrever em machines:', err);
    return () => {};
  }
}

export function subscribeToAIInsights(onUpdate: (insights: AIInsight[]) => void) {
  if (!db || !isConfigured) return () => {};

  try {
    const q = collection(db, 'ai_insights');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: AIInsight[] = [];
      snapshot.forEach((doc) => {
        data.push(doc.data() as AIInsight);
      });
      if (data.length > 0) {
        onUpdate(data);
      }
    });
    return unsubscribe;
  } catch {
    return () => {};
  }
}

export function subscribeToPartsQuotes(onUpdate: (quotes: PartQuote[]) => void) {
  if (!db || !isConfigured) return () => {};

  try {
    const q = collection(db, 'parts_quotes');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: PartQuote[] = [];
      snapshot.forEach((doc) => {
        data.push(doc.data() as PartQuote);
      });
      if (data.length > 0) {
        onUpdate(data);
      }
    });
    return unsubscribe;
  } catch {
    return () => {};
  }
}
