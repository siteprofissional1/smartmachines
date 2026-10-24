"""
SmartMachines — Base Provider para Cotações Industriais
Define a interface abstrata para provedores de dados de peças sobressalentes.
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, Optional


class BasePartsProvider(ABC):
    @abstractmethod
    def search_quote(self, part_code: str, component: str, supplier: str, historical_cost: float) -> Optional[Dict[str, Any]]:
        """
        Efetua busca da cotação para o código da peça informado.
        Retorna dicionário estruturado ou None em caso de falha.
        """
        pass
