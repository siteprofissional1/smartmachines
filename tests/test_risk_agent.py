"""
SmartMachines — Testes Unitários: Risk Agent
Valida cálculos determinísticos de Machine Health Score, Plant Health Score e priorização.
"""

from agents.risk_agent import RiskAgent


def test_calculate_machine_health():
    # Risco 30% -> Saúde 70%
    assert RiskAgent.calculate_machine_health(30.0) == 70.0
    # Risco 0% -> Saúde 100%
    assert RiskAgent.calculate_machine_health(0.0) == 100.0
    # Risco 100% -> Saúde 0%
    assert RiskAgent.calculate_machine_health(100.0) == 0.0


def test_calculate_plant_health():
    machines = [
        {"risco_parada_percent": 10.0},
        {"risco_parada_percent": 30.0},
        {"risco_parada_percent": 50.0},
    ]
    # Médias de saúde: 90 + 70 + 50 = 210 / 3 = 70.0
    assert RiskAgent.calculate_plant_health(machines) == 70.0


def test_prioritize_machines():
    machines = [
        {
            "maquina_id": "M1",
            "risco_parada_percent": 15.0,
            "status_operacional": "Operando Normal",
            "proxima_manutencao_dias": 25,
            "historico_falhas_30d": 0,
        },
        {
            "maquina_id": "M2",
            "risco_parada_percent": 90.0,
            "status_operacional": "Risco Crítico de Falha",
            "proxima_manutencao_dias": 2,
            "historico_falhas_30d": 3,
        },
    ]
    ranked = RiskAgent.prioritize_machines(machines, top_n=2)
    assert ranked[0]["maquina_id"] == "M2"
    assert ranked[0]["priority_score"] > ranked[1]["priority_score"]
