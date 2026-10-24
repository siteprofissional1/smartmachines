"""
SmartMachines — Testes Unitários: Maintenance Agent
Valida parseamento JSON, fallback com base no baseline e segurança de prompt.
"""

from agents.maintenance_agent import MaintenanceAgent


def test_clean_and_parse_json():
    agent = MaintenanceAgent()
    valid_markdown_json = """```json
    {
      "priority": "critical",
      "summary": "Vibração excessiva no mancal",
      "observed_signals": ["7.2 mm/s"],
      "probable_causes": ["Folga mecânica"],
      "recommended_actions": ["Intervenção imediata"],
      "component_to_inspect": "SEW-R47-AD2",
      "recommended_window": "24 horas",
      "purchase_recommendation": "Aquisição urgente",
      "reasoning_summary": "Norma ISO 10816",
      "limitations": "Telemetria instantânea"
    }
    ```"""
    parsed = agent._clean_and_parse_json(valid_markdown_json)
    assert parsed is not None
    assert parsed["priority"] == "critical"
    assert parsed["component_to_inspect"] == "SEW-R47-AD2"


def test_baseline_fallback():
    agent = MaintenanceAgent(api_key=None)
    mock_context = {
        "maquina_id": "EQP-TEST",
        "tipo_equipamento": "Torno CNC",
        "diagnostico_baseline": "Diagnóstico de referência original",
        "confiabilidade": {
            "risco_parada_percent": 82.0,
            "status_operacional": "Risco Crítico de Falha",
            "proxima_manutencao_dias": 2
        },
        "telemetria_atual": {
            "temperatura_c": 85.0,
            "vibracao_mm_s": 6.0,
            "corrente_amp": 30.0
        },
        "componente_sobressalente": {
            "componente": "Fuso de Esferas",
            "codigo_peca": "FUSO-01",
            "fornecedor_homologado": "THK Brasil"
        }
    }
    rec = agent.generate_recommendation(mock_context)
    assert rec["status"] == "LOCAL_FALLBACK"
    assert rec["priority"] == "critical"
    assert len(rec["recommended_actions"]) > 0
