# SOP Mestre — SmartMachines: Predictive Maintenance Intelligence

## 1. Visão Geral
O **SmartMachines** é uma plataforma analítica de Indústria 4.0 desenvolvida para monitoramento operacional, diagnóstico preditivo de falhas mecânicas/elétricas e otimização de suprimentos de manutenção para equipamentos industriais contínuos.

---

## 2. Objetivo
Responder com agilidade operacional e rigor técnico às seguintes perguntas da planta:
- Quais máquinas apresentam risco iminente de quebra não planejada?
- Quais variáveis físicas de telemetria (vibração, temperatura, pressão, corrente, ruído) indicam a anomalia?
- Quando a intervenção de manutenção preventiva deve ser agendada?
- Quais peças sobressalentes e componentes críticos devem ser cotados e comprados imediatamente?
- Como está a saúde global da planta fabril (*Plant Health Score*) e a distribuição de OEE nas 5 linhas de produção?

---

## 3. Arquitetura em 3 Camadas Antigravity

```mermaid
flowchart TD
    subgraph Camada 1: Diretivas & Estratégia
        D1[directives/projeto.md]
        D2[directives/design/design.md]
        D3[directives/SOP/*.md]
    end

    subgraph Camada 2: Orquestração & Inteligência
        O1[agents/orchestrator.py]
        O2[agents/data_agent.py]
        O3[agents/risk_agent.py]
        O4[agents/scraper_agent.py]
        O5[agents/maintenance_agent.py - Gemini]
    end

    subgraph Camada 3: Execução Determinística
        E1[scripts/analyze_dataset.py]
        E2[scripts/build_frontend_data.py]
        E3[scraper/parts_scraper.py]
        E4[scripts/seed_firestore.py]
        E5[scripts/simulate_realtime.py]
        E6[React Frontend + Vite + Plotly]
        E7[Firebase Firestore Realtime]
    end

    Camada 1 --> Camada 2
    Camada 2 --> Camada 3
```

---

## 4. Componentes do Sistema

### 4.1 Data Pipeline (ETL & RAG Local)
- **Origem:** `data/data_smartmachines_manutencao.csv` (1.200 leituras, 400 máquinas, 20 equipamentos, 5 linhas, 3 turnos, encoding Latin-1/CP1252).
- **Tratamento:** Limpeza de tipos, datas, agregação de leituras por máquina e cálculo de KPIs históricos.
- **Saídas:**
  - `data/processed/dataset_summary.json`: Sumário analítico global.
  - `data/processed/machines_processed.json`: Snapshot estruturado de todas as 400 máquinas.
  - `public/data/*.json`: Snapshots estáticos para suporte ao modo `LOCAL DATA`.

### 4.2 Multi-Agentes Python
- **Data Agent:** Ingestão do CSV, validação estrutural e recuperação de contexto RAG compacto (apenas os registros pertinentes à máquina alvo).
- **Risk Agent:** Cálculo determinístico de prioridade de intervenção e normalização do `Machine Health Score = 100 - risco_parada_percent`.
- **Scraper Agent:** Consulta cotações reais de componentes críticos em canais públicos, gerencia cache local (`data/cache/parts_prices.json`) e calcula variações percentuais.
- **Maintenance Agent (Gemini):** Síntese contextualizada de telemetria, causas prováveis e planos de ação mecânica com saída em JSON estrito.
- **Orchestrator:** Ponto de entrada CLI unificado com comandos para execução individual e pipeline completo.

### 4.3 Camada de Persistência NoSQL (Firebase Firestore)
- Coleção `machines/{machineId}`: Metadados, última leitura de telemetria, indicadores de confiabilidade, componente crítico e status.
- Coleção `parts_quotes/{partCode}`: Dados da peça, fornecedor, preço histórico, preço cotado, data e status (`LIVE`, `CACHED`, `UNAVAILABLE`).
- Coleção `ai_insights/{machineId}`: Recomendações estruturadas emitidas pelo Gemini.
- Coleção `plant_insights/current`: Síntese executiva do estado geral da fábrica.
- Coleção `system_status/{service}`: Heartbeat e integridade dos serviços integrados.

### 4.4 Frontend Command Center (React + TypeScript + Vite)
- **Tema Dual:** Dark Mode padrão com alta legibilidade (#070B11 canvas) e Light Mode limpo (#F8FAFC canvas).
- **Visualizações Analíticas (Plotly.js):**
  - Donut de distribuição operacional.
  - Dispersão Vibração × Temperatura com destaque para outliers críticos.
  - Barras horizontais do ranking de risco por equipamento.
  - Dispersão MTBF × MTTR.
  - Histograma de risco e barras de OEE por linha.
- **Tabelas Interativas:** Busca instantânea, ordenação por múltiplas colunas e paginação responsiva.
- **Sincronização Reativa:** Listeners `onSnapshot` que atualizam a tela sem recarregar a página.

---

## 5. Fluxo de Dados Ponta a Ponta

1. **Ingestão:** `data_agent.py` lê o CSV com codificação correta e cria o índice de busca em memória.
2. **Priorização:** `risk_agent.py` ranqueia as máquinas que exigem atenção imediata (risco > 70%, manutenção <= 7 dias, alertas de vibração/temperatura).
3. **Cotação Externa:** `scraper_agent.py` verifica se há cotações recentes para o código da peça sobressalente. Se necessário, efetua busca pública ou carrega do cache seguro.
4. **Inteligência Preditiva:** `maintenance_agent.py` injeta no Gemini 2.0 / 1.5 Flash um contexto compacto contendo apenas os dados da máquina selecionada.
5. **Persistência Segura:** O pipeline no lado Python grava os documentos no Firestore via credencial administrativa ou Firebase Web.
6. **Consumo no Cliente:** O dashboard React consome o Firestore via `onSnapshot` ou carrega o snapshot estático se o Firebase estiver desativado/offline.

---

## 6. Governança de Segredos e Segurança

- O arquivo `.env` já presente na raiz é estritamente protegido.
- Valores de chaves de API (`GEMINI_API_KEY`, tokens, service accounts) **NUNCA** são empacotados no bundle do cliente nem enviados ao Git.
- O frontend consome apenas variáveis públicas do Firebase Web SDK.
- `firestore.rules` bloqueia escritas arbitrárias oriundas do navegador.

---

## 7. Critérios de Sucesso e Demonstração do Hackathon

1. **Demonstração em 3 a 5 Minutos:** Fluxo fluido cobrindo visão executiva da fábrica, isolamento de máquina crítica (ex: EQP-0215 com alerta de vibração), análise de cotação de redutor SEW, insight do Gemini e simulação de telemetria em tempo real.
2. **Resiliência Extrema:** Funcionamento garantido em modo offline / local data sem falhas caso conexões externas oscilem.
3. **Padrão SENAI:** Código limpo, comentado em português, boas práticas de IA responsável e rastreabilidade total de diretivas.
