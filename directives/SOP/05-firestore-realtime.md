# SOP 05 — Persistência NoSQL Firestore & Sincronização Realtime

## 1. Arquitetura de Coleções
O Google Cloud Firestore é estruturado com foco em leitura reativa e particionamento eficiente:

1. **`machines/{machineId}`:**
   - Documentos identificados por `EQP-0001` até `EQP-0400`.
   - Contém o estado mais recente de cada máquina, última telemetria, indicadores de risco, horímetro e timestamp de sincronização.
2. **`parts_quotes/{partCode}`:**
   - Cotações atualizadas das peças industriais sobressalentes.
3. **`ai_insights/{machineId}`:**
   - Diagnósticos detalhados e planos de ação emitidos pelo Gemini.
4. **`plant_insights/current`:**
   - Visão panorâmica e executiva da fábrica gerada por IA.
5. **`system_status/{service}`:**
   - Batimentos de coração dos serviços (`database`, `gemini_pipeline`, `scraper`).

---

## 2. Seed Automatizado (`scripts/seed_firestore.py`)
- O script lê os dados processados do CSV via `data_agent.py`.
- Utiliza **Batch Writes** (agrupando até 400 operações por lote) para minimizar latência de rede e otimizar limites de cota da Google Cloud.

---

## 3. Escuta Reativa no Cliente (`onSnapshot`)
No frontend React:
```typescript
import { collection, onSnapshot, doc } from 'firebase/firestore';

// Inscrição em tempo real na coleção de máquinas
const unsubscribe = onSnapshot(collection(db, 'machines'), (snapshot) => {
  const updatedMachines = snapshot.docs.map(d => d.data());
  setMachines(updatedMachines);
  setLastSync(new Date());
});
```

---

## 4. Simulação em Tempo Real para Demonstração (`scripts/simulate_realtime.py`)
- Para permitir demonstrações ao vivo sem depender de uma máquina física gerando defeito no momento da apresentação:
  - O script escolhe alternadamente uma máquina (ex: `EQP-0215`);
  - Eleva temporariamente os valores de vibração e temperatura;
  - Marca explicitamente o campo `demoMode: true`;
  - A interface exibe o badge **`DEMO EVENT`** em destaque pulsante.
