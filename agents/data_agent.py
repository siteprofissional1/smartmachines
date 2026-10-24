"""
SmartMachines — Data Agent
Responsável por ingestão, validação estrutural, limpeza e retrieval RAG local.
"""

import os
import pandas as pd
from typing import Dict, Any, List, Optional


class DataAgent:
    EXPECTED_COLUMNS = [
        "registro_id", "timestamp_leitura", "maquina_id", "tipo_equipamento",
        "linha_producao", "turno_operacao", "sensor_temp_c", "sensor_vibracao_mm_s",
        "pressao_psi", "corrente_eletrica_amp", "nivel_ruido_db", "status_operacional",
        "horas_uso", "mtbf_horas", "mttr_horas", "eficiencia_oee_percent",
        "componente_critico", "codigo_peca_reposicao", "fornecedor_homologado",
        "custo_estimado_peca_r$", "lead_time_fornecedor_dias", "historico_falhas_30d",
        "risco_parada_percent", "proxima_manutencao_dias", "diagnostico_preditivo_ia"
    ]

    def __init__(self, csv_path: str = "data/data_smartmachines_manutencao.csv"):
        self.csv_path = csv_path
        self._df: Optional[pd.DataFrame] = None

    def load_data(self) -> pd.DataFrame:
        """Carrega o dataset e valida conformidade estrutural."""
        if not os.path.exists(self.csv_path):
            raise FileNotFoundError(f"Arquivo CSV não encontrado: {self.csv_path}")

        try:
            df = pd.read_csv(self.csv_path, encoding="utf-8")
        except Exception:
            df = pd.read_csv(self.csv_path, encoding="latin-1")

        self.validate_schema(df)
        self._df = df
        return self._df

    @property
    def df(self) -> pd.DataFrame:
        if self._df is None:
            return self.load_data()
        return self._df

    def validate_schema(self, df: pd.DataFrame) -> bool:
        """Valida se todas as colunas obrigatórias estão presentes."""
        missing = [col for col in self.EXPECTED_COLUMNS if col not in df.columns]
        if missing:
            raise ValueError(f"Dataset inválido! Colunas ausentes: {missing}")
        return True

    def get_all_machines(self) -> List[Dict[str, Any]]:
        """Retorna o estado mais recente de cada máquina única (400 máquinas)."""
        df_sorted = self.df.sort_values(by="timestamp_leitura", ascending=False)
        latest_df = df_sorted.drop_duplicates(subset=["maquina_id"]).copy()
        latest_df["health_score"] = (100.0 - latest_df["risco_parada_percent"]).round(2)
        return latest_df.to_dict(orient="records")

    def get_machine(self, maquina_id: str) -> Optional[Dict[str, Any]]:
        """Recupera a leitura mais recente de uma máquina específica."""
        records = self.df[self.df["maquina_id"] == maquina_id].sort_values(
            by="timestamp_leitura", ascending=False
        )
        if records.empty:
            return None
        latest = records.iloc[0].to_dict()
        latest["health_score"] = round(100.0 - float(latest["risco_parada_percent"]), 2)
        return latest

    def get_machine_history(self, maquina_id: str) -> List[Dict[str, Any]]:
        """Retorna o histórico cronológico completo de leituras da máquina."""
        records = self.df[self.df["maquina_id"] == maquina_id].sort_values(
            by="timestamp_leitura", ascending=True
        )
        return records.to_dict(orient="records")

    def build_rag_context(self, maquina_id: str, quote_data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Monta um contexto RAG compacto para a máquina solicitada.
        Consome menos de 1.000 tokens e evita enviar dados irrelevantes ao Gemini.
        """
        machine = self.get_machine(maquina_id)
        if not machine:
            raise ValueError(f"Máquina {maquina_id} não encontrada no dataset.")

        history = self.get_machine_history(maquina_id)

        # Médias da máquina ao longo do tempo registrado
        avg_temp = round(sum(r["sensor_temp_c"] for r in history) / len(history), 2)
        avg_vib = round(sum(r["sensor_vibracao_mm_s"] for r in history) / len(history), 2)

        context = {
            "maquina_id": machine["maquina_id"],
            "tipo_equipamento": machine["tipo_equipamento"],
            "linha_producao": machine["linha_producao"],
            "turno_operacao": machine["turno_operacao"],
            "telemetria_atual": {
                "temperatura_c": round(float(machine["sensor_temp_c"]), 2),
                "vibracao_mm_s": round(float(machine["sensor_vibracao_mm_s"]), 2),
                "pressao_psi": round(float(machine["pressao_psi"]), 2),
                "corrente_amp": round(float(machine["corrente_eletrica_amp"]), 2),
                "ruido_db": round(float(machine["nivel_ruido_db"]), 2),
                "media_historica_temp_c": avg_temp,
                "media_historica_vib_mm_s": avg_vib,
            },
            "confiabilidade": {
                "status_operacional": machine["status_operacional"],
                "horas_uso": int(machine["horas_uso"]),
                "mtbf_horas": round(float(machine["mtbf_horas"]), 2),
                "mttr_horas": round(float(machine["mttr_horas"]), 2),
                "eficiencia_oee_percent": round(float(machine["eficiencia_oee_percent"]), 2),
                "risco_parada_percent": round(float(machine["risco_parada_percent"]), 2),
                "health_score": round(float(machine["health_score"]), 2),
                "historico_falhas_30d": int(machine["historico_falhas_30d"]),
                "proxima_manutencao_dias": int(machine["proxima_manutencao_dias"]),
            },
            "componente_sobressalente": {
                "componente": machine["componente_critico"],
                "codigo_peca": machine["codigo_peca_reposicao"],
                "fornecedor_homologado": machine["fornecedor_homologado"],
                "custo_historico_r$": round(float(machine["custo_estimado_peca_r$"]), 2),
                "lead_time_dias": int(machine["lead_time_fornecedor_dias"]),
                "cotacao_mercado": quote_data if quote_data else "Não consultada"
            },
            "diagnostico_baseline": machine["diagnostico_preditivo_ia"]
        }
        return context
