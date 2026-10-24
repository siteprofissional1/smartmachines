"""
SmartMachines — Testes Unitários: Parts Scraper
Valida o retorno estruturado, a política de cache e degradação suave.
"""

from scraper.parts_scraper import PartsScraper


def test_scraper_cache_fallback(tmp_path):
    cache_file = tmp_path / "test_parts_prices.json"
    scraper = PartsScraper(cache_path=str(cache_file))

    # Consulta peça com cache inicial vazio
    quote = scraper.get_quote(
        part_code="SEW-R47-AD2",
        component="Redutor Planetário",
        supplier="SEW-Eurodrive Brasil",
        historical_cost=5224.09
    )

    assert "part_code" in quote
    assert quote["part_code"] == "SEW-R47-AD2"
    assert quote["currency"] == "BRL"
    assert quote["historical_cost"] == 5224.09
    assert quote["status"] in ["LIVE", "CACHED", "UNAVAILABLE"]
