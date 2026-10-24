@echo off
chcp 65001 > nul
cls
echo =======================================================
echo   SMARTMACHINES — PREDICTIVE MAINTENANCE INTELLIGENCE
echo   Hackathon Antigravity — SENAI Ourinhos
echo =======================================================
echo.
echo Escolha uma opcao:
echo   [1] Iniciar Frontend Web (Vite Dev Server)
echo   [2] Analisar Dataset Industrial (analyze_dataset.py)
echo   [3] Diagnostico de Maquina por IA (Orchestrator EQP-0215)
echo   [4] Gerar Snapshots de Dados (build_frontend_data.py)
echo   [5] Sincronizar Inteligencia Preditiva (sync_intelligence.py)
echo   [6] Executar Seed do Firestore (seed_firestore.py)
echo   [7] Disparar Simulacao Realtime (simulate_realtime.py)
echo   [8] Executar Testes Automatizados (pytest)
echo   [9] Compilar Build de Producao (npm run build)
echo   [0] Sair
echo.
set /p opt="Digite o numero da opcao desejada: "

if "%opt%"=="1" (
    echo [*] Iniciando Frontend Web...
    npm run dev
) else if "%opt%"=="2" (
    echo [*] Executando analise do dataset...
    python scripts/analyze_dataset.py
    pause
) else if "%opt%"=="3" (
    echo [*] Executando diagnostico da maquina EQP-0215...
    python -m agents.orchestrator machine EQP-0215
    pause
) else if "%opt%"=="4" (
    echo [*] Gerando snapshots para o frontend...
    python scripts/build_frontend_data.py
    pause
) else if "%opt%"=="5" (
    echo [*] Sincronizando inteligencia operacional...
    python scripts/sync_intelligence.py
    pause
) else if "%opt%"=="6" (
    echo [*] Populando colecoes do Firestore...
    python scripts/seed_firestore.py
    pause
) else if "%opt%"=="7" (
    echo [*] Disparando simulacao de telemetria realtime...
    python scripts/simulate_realtime.py EQP-0215 vibration
    pause
) else if "%opt%"=="8" (
    echo [*] Executando testes unitarios...
    python -m pytest tests/
    pause
) else if "%opt%"=="9" (
    echo [*] Gerando build de producao...
    npm run build
    pause
) else (
    echo Encerrando.
)
