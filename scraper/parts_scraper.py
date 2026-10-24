"""
SmartMachines — Parts Scraper Principal
Orquestra provedores de cotação externa com gerenciamento de cache local e fallback resiliente.
"""

import json
import os
from datetime import datetime
from typing import Dict, Any, Optional
from scraper.providers.distributor_provider import DistributorProvider


class PartsScraper:
    def __init__(self, cache_path: str = "data/cache/parts_prices.json"):
        self.cache_path = cache_path
        self.provider = DistributorProvider()
        self._cache: Dict[str, Any] = {}
        self._load_cache()

    def _load_cache(self):
        """Carrega cotações persistidas em cache local."""
        if os.path.exists(self.cache_path):
            try:
                with open(self.cache_path, "r", encoding="utf-8") as f:
                    self._cache = json.load(f)
            except Exception:
                self._cache = {}
        else:
            self._cache = {}

    def _save_cache(self):
        """Persiste o cache atualizado em disco."""
        os.makedirs(os.path.dirname(self.cache_path), exist_ok=True)
        try:
            with open(self.cache_path, "w", encoding="utf-8") as f:
                json.dump(self._cache, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"[!] Aviso: Não foi possível gravar cache: {e}")

    def get_quote(self, part_code: str, component: str, supplier: str, historical_cost: float) -> Dict[str, Any]:
        """
        Obtém a cotação de mercado da peça.
        Fluxo de resiliência:
        1. Tenta consulta via provedor web (LIVE);
        2. Em caso de falha/timeout, utiliza o cache local (CACHED);
        3. Se não houver cache, retorna status UNAVAILABLE sem quebrar a execução.
        """
        # 1. Tenta buscar cotação ao vivo
        live_result = self.provider.search_quote(part_code, component, supplier, historical_cost)
        if live_result and live_result.get("price") is not None:
            self._cache[part_code] = live_result
            self._save_cache()
            return live_result

        # 2. Fallback para cache local
        if part_code in self._cache:
            cached_item = dict(self._cache[part_code])
            cached_item["status"] = "CACHED"
            return cached_item

        # 3. Fallback final quando indisponível
        return {
            "part_code": part_code,
            "component": component,
            "supplier": supplier,
            "title": f"{component} ({part_code})",
            "price": None,
            "currency": "BRL",
            "historical_cost": historical_cost,
            "diff_value": 0.0,
            "diff_percent": 0.0,
            "source": "Catálogo Homologado Fabril (Offline)",
            "url": "",
            "searched_at": datetime.now().isoformat(),
            "status": "UNAVAILABLE"
        }
