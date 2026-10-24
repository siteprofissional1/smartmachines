"""
SmartMachines — Análise Automatizada do Dataset
Carrega e processa telemetria histórica industrial (1.200 leituras, 400 máquinas).
Gera sumário estatístico em data/processed/dataset_summary.json.
"""

import json
import os
import sys
from datetime import datetime
import pandas as pd


def analyze_dataset(csv_path="data/data_smartmachines_manutencao.csv", output_path="data/processed/dataset_summary.json"):
    print(f"[*] Carregando dataset industrial: {csv_path}")
    if not os.path.exists(csv_path):
        print(f"[!] Erro: Arquivo CSV não encontrado em {csv_path}", file=sys.stderr)
        sys.exit(1)

    # Carrega com codificação UTF-8
    try:
        df = pd.read_csv(csv_path, encoding="utf-8")
    except Exception:
        df = pd.read_csv(csv_path, encoding="latin-1")

    total_registros = len(df)
    total_maquinas = df["maquina_id"].nunique()
    total_equipamentos = df["tipo_equipamento"].nunique()
    total_linhas = df["linha_producao"].nunique()
    total_turnos = df["turno_operacao"].nunique()

    # Período temporal
    periodo_inicio = str(df["timestamp_leitura"].min())
    periodo_fim = str(df["timestamp_leitura"].max())

    # Distribuição de estados operacionais
    distribuicao_status = df["status_operacional"].value_counts().to_dict()

    # Médias de confiabilidade e risco
    risco_medio = round(float(df["risco_parada_percent"].mean()), 2)
    oee_medio = round(float(df["eficiencia_oee_percent"].mean()), 2)
    mtbf_medio = round(float(df["mtbf_horas"].mean()), 2)
    mttr_medio = round(float(df["mttr_horas"].mean()), 2)
    total_falhas_30d = int(df["historico_falhas_30d"].sum())

    # Indicador derivado: Saúde da Planta
    plant_health_score = round(100.0 - risco_medio, 2)

    # Próximas manutenções
    manutencao_7d = int((df["proxima_manutencao_dias"] <= 7).sum())
    manutencao_30d = int((df["proxima_manutencao_dias"] <= 30).sum())
    dias_manutencao_medio = round(float(df["proxima_manutencao_dias"].mean()), 1)

    # Telemetria média
    temp_media = round(float(df["sensor_temp_c"].mean()), 2)
    vibracao_media = round(float(df["sensor_vibracao_mm_s"].mean()), 2)
    pressao_media = round(float(df["pressao_psi"].mean()), 2)
    corrente_media = round(float(df["corrente_eletrica_amp"].mean()), 2)
    ruido_medio = round(float(df["nivel_ruido_db"].mean()), 2)

    # Componentes e Fornecedores
    top_componentes = df["componente_critico"].value_counts().head(10).to_dict()
    fornecedores = df["fornecedor_homologado"].value_counts().to_dict()

    # Métricas agregadas por Linha de Produção
    linhas_metricas = {}
    for linha, grupo in df.groupby("linha_producao"):
        linhas_metricas[linha] = {
            "total_maquinas": int(grupo["maquina_id"].nunique()),
            "risco_medio": round(float(grupo["risco_parada_percent"].mean()), 2),
            "oee_medio": round(float(grupo["eficiencia_oee_percent"].mean()), 2),
            "falhas_30d": int(grupo["historico_falhas_30d"].sum()),
            "status": grupo["status_operacional"].value_counts().to_dict(),
        }

    # Deduplicação: estado mais recente de cada máquina
    df_sorted = df.sort_values(by="timestamp_leitura", ascending=False)
    latest_machines = df_sorted.drop_duplicates(subset=["maquina_id"]).copy()

    # Top máquinas em risco crítico
    top_risco_df = latest_machines.sort_values(by="risco_parada_percent", ascending=False).head(15)
    top_maquinas_risco = []
    for _, row in top_risco_df.iterrows():
        top_maquinas_risco.append({
            "maquina_id": row["maquina_id"],
            "tipo_equipamento": row["tipo_equipamento"],
            "linha_producao": row["linha_producao"],
            "status_operacional": row["status_operacional"],
            "risco_parada_percent": round(float(row["risco_parada_percent"]), 2),
            "health_score": round(100.0 - float(row["risco_parada_percent"]), 2),
            "proxima_manutencao_dias": int(row["proxima_manutencao_dias"]),
            "sensor_temp_c": round(float(row["sensor_temp_c"]), 2),
            "sensor_vibracao_mm_s": round(float(row["sensor_vibracao_mm_s"]), 2),
            "componente_critico": row["componente_critico"],
            "codigo_peca_reposicao": row["codigo_peca_reposicao"],
            "fornecedor_homologado": row["fornecedor_homologado"],
            "diagnostico_preditivo_ia": row["diagnostico_preditivo_ia"],
        })

    summary = {
        "metadata": {
            "gerado_em": datetime.now().isoformat(),
            "arquivo_fonte": csv_path,
            "versao_schema": "1.0",
        },
        "totais": {
            "registros": total_registros,
            "maquinas_unicas": total_maquinas,
            "tipos_equipamento": total_equipamentos,
            "linhas_producao": total_linhas,
            "turnos": total_turnos,
            "periodo_inicio": periodo_inicio,
            "periodo_fim": periodo_fim,
        },
        "kpis_globais": {
            "plant_health_score": plant_health_score,
            "risco_medio_percent": risco_medio,
            "oee_medio_percent": oee_medio,
            "mtbf_horas_medio": mtbf_medio,
            "mttr_horas_medio": mttr_medio,
            "total_falhas_30d": total_falhas_30d,
            "manutencoes_urgentes_7d": manutencao_7d,
            "manutencoes_mes_30d": manutencao_30d,
            "dias_manutencao_medio": dias_manutencao_medio,
        },
        "telemetria_media": {
            "temperatura_c": temp_media,
            "vibracao_mm_s": vibracao_media,
            "pressao_psi": pressao_media,
            "corrente_amp": corrente_media,
            "ruido_db": ruido_medio,
        },
        "distribuicao_status": distribuicao_status,
        "linhas_producao": linhas_metricas,
        "top_componentes": top_componentes,
        "fornecedores": fornecedores,
        "top_maquinas_risco": top_maquinas_risco,
    }

    # Salva o arquivo de sumário
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)

    print(f"[+] Análise concluída com sucesso! Sumário salvo em: {output_path}")
    print(f"    - Máquinas monitoradas: {total_maquinas}")
    print(f"    - Plant Health Score: {plant_health_score}%")
    print(f"    - Risco Médio da Planta: {risco_medio}%")
    print(f"    - OEE Médio: {oee_medio}%")
    print(f"    - Manutenções em até 7 dias: {manutencao_7d}")
    print(f"    - Status: {distribuicao_status}")

    return summary


if __name__ == "__main__":
    analyze_dataset()
