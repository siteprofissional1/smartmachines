# Instruções de Execução Rápida — SmartMachines

Guia operacional direto para desenvolvedores e avaliadores do **Hackathon Antigravity SENAI Ourinhos**.

---

## 1. Primeira Instalação

### Dependências Node.js / Frontend
```bash
npm install
```

### Dependências Python
```bash
pip install -r requirements.txt
```

---

## 2. Frontend Web (Dashboard)

### Iniciar Servidor de Desenvolvimento
```bash
npm run dev
```
Acesse em: `http://localhost:3000` ou `http://localhost:5173`

### Compilar Build de Produção
```bash
npm run build
```

---

## 3. Dataset & Data Pipeline

### Analisar Dataset Industrial (Gera `data/processed/dataset_summary.json`)
```bash
python scripts/analyze_dataset.py
```

### Gerar Snapshots de Dados para o Frontend (Modo Local / Fallback)
```bash
python scripts/build_frontend_data.py
```

---

## 4. Multi-Agentes & Diagnóstico Preditivo (Orchestrator)

### Executar Pipeline Completo
```bash
python -m agents.orchestrator all
```

### Diagnosticar uma Máquina Específica com RAG + Gemini AI
```bash
python -m agents.orchestrator machine EQP-0215
```

### Atualizar Cotações de Peças Críticas via Scraper
```bash
python -m agents.orchestrator quotes
```

---

## 5. Google Cloud Firestore

### Popular Coleções do Firestore (Batch Seed)
```bash
python scripts/seed_firestore.py
```

---

## 6. Sincronização de Inteligência (Sync Intelligence)
```bash
python scripts/sync_intelligence.py
```

---

## 7. Simulação Realtime para Demonstração (Pitch Flow)
```bash
python scripts/simulate_realtime.py EQP-0215 vibration
```

---

## 8. Testes Automatizados

### Executar Suíte de Testes Unitários em Python
```bash
python -m pytest tests/
```

### Validar Tipos TypeScript no Frontend
```bash
npm run lint
```

---

## 9. Scripts Rápidos no Windows

- **CMD Interativo:** execute `executar.bat`
- **PowerShell:** execute `.\executar.ps1 -Action Frontend` ou `.\executar.ps1 -Action All`
