"""
SmartMachines — Risk Agent
Responsável pelo cálculo determinístico de risco operacional,
saúde das máquinas (Health Score) e priorização para intervenção mecânica.
"""

from typing import Dict, Any, List


class RiskAgent:
    STATUS_WEIGHTS = {
        "Risco Crítico de Falha": 100.0,
        "Alerta de Vibração": 75.0,
        "Atenção - Temperatura": 60.0,
        "Operando Normal": 10.0,
    }

    @staticmethod
    def calculate_machine_health(risco_parada_percent: float) -> float:
        """
        Calcula o Machine Health Score:
        Health Score = 100 - risco_parada_percent (limitado entre 0 e 100)
        """
        score = 100.0 - float(risco_parada_percent)
        return round(max(0.0, min(100.0, score)), 2)

    @staticmethod
    def calculate_plant_health(machines: List[Dict[str, Any]]) -> float:
        """Calcula a média de saúde de todas as máquinas da planta."""
        if not machines:
            return 100.0
        scores = [RiskAgent.calculate_machine_health(m["risco_parada_percent"]) for m in machines]
        return round(sum(scores) / len(scores), 2)

    @classmethod
    def calculate_priority_score(cls, machine: Dict[str, Any]) -> float:
        """
        Calcula o escore de prioridade de intervenção (0 a 100).
        Fórmula determinística e auditável:
        - 40% Risco de Parada
        - 25% Gravidade do Status Operacional
        - 20% Urgência de Manutenção (<= 30 dias)
        - 15% Histórico de Falhas Recentes (últimos 30 dias)
        """
        risco = float(machine.get("risco_parada_percent", 0.0))
        status = machine.get("status_operacional", "Operando Normal")
        peso_status = cls.STATUS_WEIGHTS.get(status, 10.0)

        proxima_manut = float(machine.get("proxima_manutencao_dias", 30))
        urgencia_manut = max(0.0, 1.0 - (proxima_manut / 30.0)) * 100.0

        falhas = min(4, int(machine.get("historico_falhas_30d", 0)))
        peso_falhas = (falhas / 4.0) * 100.0

        score = (
            (risco * 0.40) +
            (peso_status * 0.25) +
            (urgencia_manut * 0.20) +
            (peso_falhas * 0.15)
        )
        return round(score, 2)

    @classmethod
    def prioritize_machines(cls, machines: List[Dict[str, Any]], top_n: int = 10) -> List[Dict[str, Any]]:
        """Ranqueia as máquinas que exigem intervenção mecânica imediata."""
        evaluated = []
        for m in machines:
            item = dict(m)
            item["priority_score"] = cls.calculate_priority_score(m)
            item["health_score"] = cls.calculate_machine_health(m["risco_parada_percent"])
            evaluated.append(item)

        evaluated.sort(key=lambda x: x["priority_score"], reverse=True)
        return evaluated[:top_n]
