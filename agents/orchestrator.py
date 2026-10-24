"""
SmartMachines — Orchestrator CLI
Coordena os agentes especializados (Data, Risk, Scraper, Maintenance)
em uma interface de linha de comando robusta e demonstrável.
"""

import argparse
import json
import sys
from typing import Optional
from utils.env_helper import load_env_safely
load_env_safely()

from agents.data_agent import DataAgent
from agents.risk_agent import RiskAgent
from agents.scraper_agent import ScraperAgent
from agents.maintenance_agent import MaintenanceAgent
from scripts.analyze_dataset import analyze_dataset
from scripts.build_frontend_data import build_frontend_data


class Orchestrator:
    def __init__(self, csv_path: str = "data/data_smartmachines_manutencao.csv"):
        self.data_agent = DataAgent(csv_path=csv_path)
        self.risk_agent = RiskAgent()
        self.scraper_agent = ScraperAgent()
        self.maintenance_agent = MaintenanceAgent()

    def run_analyze(self):
        """Executa a análise estatística completa do dataset."""
        print("\n=======================================================")
        print("  SMARTMACHINES — ORCHESTRATOR: ANÁLISE DO DATASET")
        print("=======================================================")
        summary = analyze_dataset()
        print(f"\n[*] Saúde Global da Planta: {summary['kpis_globais']['plant_health_score']}%")
        print(f"[*] Risco Médio Operacional: {summary['kpis_globais']['risco_medio_percent']}%")
        print(f"[*] Total de Falhas em 30d: {summary['kpis_globais']['total_falhas_30d']}")
        return summary

    def run_machine_diagnosis(self, maquina_id: str):
        """Diagnóstico 360° de uma máquina com cotação e insight preditivo."""
        print("\n=======================================================")
        print(f"  SMARTMACHINES — DIAGNÓSTICO DA MÁQUINA: {maquina_id}")
        print("=======================================================")
        machine = self.data_agent.get_machine(maquina_id)
        if not machine:
            print(f"[!] Erro: Máquina {maquina_id} não encontrada.", file=sys.stderr)
            return None

        print(f"[*] Equipamento: {machine['tipo_equipamento']}")
        print(f"[*] Linha: {machine['linha_producao']} | Turno: {machine['turno_operacao']}")
        print(f"[*] Status: {machine['status_operacional']}")
        print(f"[*] Risco de Parada: {machine['risco_parada_percent']}% (Health Score: {machine['health_score']}%)")
        print(f"[*] Telemetria: Temp={machine['sensor_temp_c']}°C | Vibração={machine['sensor_vibracao_mm_s']}mm/s | Pressão={machine['pressao_psi']}PSI")

        # 1. Cotação externa da peça sobressalente
        print("\n[+] Consultando Scraper Agent para peça de reposição...")
        quote = self.scraper_agent.quote_machine_part(machine)
        price = quote.get("price") if quote.get("price") is not None else quote.get("external_price")
        print(f"    - Peça: {quote.get('component')} ({quote.get('part_code')})")
        print(f"    - Fornecedor: {quote.get('supplier')}")
        print(f"    - Custo Histórico: R$ {quote.get('historical_cost')}")
        if price is not None:
            print(f"    - Preço Atual de Mercado: R$ {price} ({quote.get('status')})")
            print(f"    - Variação: R$ {quote.get('diff_value')} ({quote.get('diff_percent')}%)")
        else:
            print(f"    - Cotação: {quote.get('status')}")

        # 2. Contexto RAG Compacto
        print("\n[+] Construindo contexto RAG local...")
        rag_context = self.data_agent.build_rag_context(maquina_id, quote_data=quote)

        # 3. Consulta ao Maintenance Agent (Gemini)
        print("[+] Acionando Maintenance Agent (Gemini AI)...")
        recommendation = self.maintenance_agent.generate_recommendation(rag_context)
        print(f"\n--- PARECER PREDITIVO ({recommendation.get('model', 'Engine')}) ---")
        print(f"Prioridade: {recommendation.get('priority', 'N/A').upper()}")
        print(f"Resumo: {recommendation.get('summary', '')}")
        print("Ações Recomendadas:")
        for act in recommendation.get("recommended_actions", []):
            print(f"  • {act}")
        print(f"Janela de Intervenção: {recommendation.get('recommended_window', 'N/A')}")
        print(f"Recomendação de Compras: {recommendation.get('purchase_recommendation', 'N/A')}")

        return {
            "machine": machine,
            "quote": quote,
            "recommendation": recommendation
        }

    def run_quotes(self):
        """Cota peças sobressalentes para as máquinas de maior risco."""
        print("\n=======================================================")
        print("  SMARTMACHINES — ORCHESTRATOR: COTAÇÃO DE PEÇAS")
        print("=======================================================")
        machines = self.data_agent.get_all_machines()
        critical_machines = self.risk_agent.prioritize_machines(machines, top_n=8)
        quotes = self.scraper_agent.quote_multiple_parts(critical_machines)
        print(f"[+] Total de peças cotadas: {len(quotes)}")
        for q in quotes:
            print(f"  • [{q['part_code']}] {q['component']}: Histórico=R$ {q['historical_cost']} | Mercado=R$ {q['price']} ({q['status']})")
        return quotes

    def run_sync(self):
        """Gera os snapshots otimizados para o frontend e fallback local."""
        print("\n=======================================================")
        print("  SMARTMACHINES — ORCHESTRATOR: SINCRONIZAÇÃO DE SNAPSHOTS")
        print("=======================================================")
        build_frontend_data(self.data_agent.csv_path)
        print("[+] Sincronização concluída com sucesso!")

    def run_all(self):
        """Executa o pipeline completo ponta a ponta."""
        print("\n=======================================================")
        print("  SMARTMACHINES — PIPELINE COMPLETO MULTIAGENTE")
        print("=======================================================")
        self.run_analyze()
        self.run_quotes()
        self.run_sync()
        # Demonstração detalhada da máquina EQP-0215
        self.run_machine_diagnosis("EQP-0215")
        print("\n[OK] Pipeline completo finalizado com sucesso!")


def main():
    parser = argparse.ArgumentParser(description="SmartMachines — Orchestrator CLI")
    parser.add_argument("command", choices=["analyze", "machine", "quotes", "sync", "all"],
                        help="Comando a ser executado pelo orquestrador")
    parser.add_argument("target", nargs="?", default="EQP-0215",
                        help="Identificador da máquina (ex: EQP-0215) para o comando 'machine'")

    args = parser.parse_args()
    orchestrator = Orchestrator()

    if args.command == "analyze":
        orchestrator.run_analyze()
    elif args.command == "machine":
        orchestrator.run_machine_diagnosis(args.target)
    elif args.command == "quotes":
        orchestrator.run_quotes()
    elif args.command == "sync":
        orchestrator.run_sync()
    elif args.command == "all":
        orchestrator.run_all()


if __name__ == "__main__":
    main()
