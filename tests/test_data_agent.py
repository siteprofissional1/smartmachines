"""
SmartMachines — Testes Unitários: Data Agent
Valida carregamento, conformidade de schema, integridade de tipos e RAG local.
"""

import pytest
from agents.data_agent import DataAgent


@pytest.fixture
def data_agent():
    return DataAgent(csv_path="data/data_smartmachines_manutencao.csv")


def test_data_load_and_shape(data_agent):
    df = data_agent.load_data()
    assert len(df) == 1200
    assert df["maquina_id"].nunique() == 400
    assert df["tipo_equipamento"].nunique() == 20


def test_schema_columns(data_agent):
    df = data_agent.load_data()
    for col in DataAgent.EXPECTED_COLUMNS:
        assert col in df.columns, f"Coluna esperada ausente: {col}"


def test_get_machine(data_agent):
    data_agent.load_data()
    m = data_agent.get_machine("EQP-0215")
    assert m is not None
    assert m["maquina_id"] == "EQP-0215"
    assert "health_score" in m
    assert 0.0 <= m["health_score"] <= 100.0


def test_build_rag_context(data_agent):
    data_agent.load_data()
    ctx = data_agent.build_rag_context("EQP-0215")
    assert ctx["maquina_id"] == "EQP-0215"
    assert "telemetria_atual" in ctx
    assert "confiabilidade" in ctx
    assert "componente_sobressalente" in ctx
    assert "diagnostico_baseline" in ctx
