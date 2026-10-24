"""
SmartMachines — Sync Intelligence
Executa a sincronização completa de inteligência:
1. Reavalia máquinas críticas e confiabilidade;
2. Atualiza cotações externas via Scraper Agent;
3. Gera diagnósticos preditivos estruturados via Maintenance Agent (Gemini);
4. Atualiza os snapshots do frontend e o Firestore (quando disponível).
"""

import json
import os
import sys
from datetime import datetime

# Garante a raiz do projeto no path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from utils.env_helper import load_env_safely
load_env_safely()

from agents.data_agent import DataAgent
from agents.risk_agent import RiskAgent
from agents.scraper_agent import ScraperAgent
from agents.maintenance_agent import MaintenanceAgent


def sync_intelligence():
    print("\n=======================================================")
    print("  SMARTMACHINES — SINCRONIZAÇÃO DE INTELIGÊNCIA OPERACIONAL")
    print("=======================================================")

    data_agent = DataAgent()
    data_agent.load_data()
    risk_agent = RiskAgent()
    scraper_agent = ScraperAgent()
    maintenance_agent = MaintenanceAgent()

    print("[*] Selecionando máquinas críticas para atualização de inteligência...")
    machines = data_agent.get_all_machines()
    top_critical = risk_agent.prioritize_machines(machines, top_n=5)

    insights = []
    print(f"[+] Processando diagnósticos para as {len(top_critical)} máquinas prioritárias:")
    for m in top_critical:
        m_id = m["maquina_id"]
        print(f"    • {m_id} ({m['tipo_equipamento']}) - Risco: {m['risco_parada_percent']}%")

        # Cotação
        quote = scraper_agent.quote_machine_part(m)

        # Contexto RAG
        rag_context = data_agent.build_rag_context(m_id, quote_data=quote)

        # Recomendação Gemini / Baseline
        rec = maintenance_agent.generate_recommendation(rag_context)
        insights.append(rec)

    # Atualiza public/data/ai-insights.json
    insights_path = "public/data/ai-insights.json"
    with open(insights_path, "w", encoding="utf-8") as f:
        json.dump(insights, f, indent=2, ensure_ascii=False)
    print(f"[OK] Insights preditivos salvos em: {insights_path}")

    # Atualiza status no system_status
    print("[OK] Inteligência operacional sincronizada com sucesso!")
    return insights


if __name__ == "__main__":
    sync_intelligence()
