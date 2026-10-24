<#
.SYNOPSIS
    SmartMachines — Script PowerShell de Execução e Automação
.DESCRIPTION
    Permite iniciar e validar todos os subsistemas do projeto SmartMachines.
.PARAMETER Action
    Ação a executar: Frontend, Analyze, Machine, Snapshots, Sync, Seed, Demo, Test, Build, All
#>

param(
    [ValidateSet("Frontend", "Analyze", "Machine", "Snapshots", "Sync", "Seed", "Demo", "Test", "Build", "All")]
    [string]$Action = "Frontend",
    [string]$Target = "EQP-0215"
)

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "  SMARTMACHINES — POWERSHELL AUTOMATION RUNNER" -ForegroundColor Cyan
Write-Host "  Hackathon Antigravity — SENAI Ourinhos" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "[*] Executando Ação: $Action" -ForegroundColor Yellow

switch ($Action) {
    "Frontend" {
        Write-Host "[*] Iniciando servidor Vite..." -ForegroundColor Green
        npm run dev
    }
    "Analyze" {
        python scripts/analyze_dataset.py
    }
    "Machine" {
        python -m agents.orchestrator machine $Target
    }
    "Snapshots" {
        python scripts/build_frontend_data.py
    }
    "Sync" {
        python scripts/sync_intelligence.py
    }
    "Seed" {
        python scripts/seed_firestore.py
    }
    "Demo" {
        python scripts/simulate_realtime.py $Target vibration
    }
    "Test" {
        python -m pytest tests/
    }
    "Build" {
        npm run build
    }
    "All" {
        python -m agents.orchestrator all
    }
}
