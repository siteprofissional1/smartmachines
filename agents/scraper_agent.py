"""
SmartMachines — Scraper Agent
Agente responsável por coordenar a busca de cotações para peças sobressalentes.
"""

from typing import Dict, Any, List
from scraper.parts_scraper import PartsScraper


class ScraperAgent:
    def __init__(self, cache_path: str = "data/cache/parts_prices.json"):
        self.scraper = PartsScraper(cache_path=cache_path)

    def quote_machine_part(self, machine: Dict[str, Any]) -> Dict[str, Any]:
        """Obtém cotação do componente crítico de uma máquina."""
        part_code = machine.get("codigo_peca_reposicao", "")
        component = machine.get("componente_critico", "")
        supplier = machine.get("fornecedor_homologado", "")
        hist_cost = float(machine.get("custo_estimado_peca_r$", 0.0))

        return self.scraper.get_quote(part_code, component, supplier, hist_cost)

    def quote_multiple_parts(self, machines: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Efetua cotação para uma lista de máquinas evitando requisições duplicadas."""
        seen_parts = set()
        quotes = []
        for m in machines:
            p_code = m.get("codigo_peca_reposicao")
            if p_code and p_code not in seen_parts:
                seen_parts.add(p_code)
                q = self.quote_machine_part(m)
                quotes.append(q)
        return quotes
