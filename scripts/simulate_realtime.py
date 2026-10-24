"""
SmartMachines — Simulador de Telemetria Realtime para Apresentação
Gera anomalias e variações de sensores temporárias para demonstração em tempo real.
Todos os dados simulados são explicitamente sinalizados com `demoMode: true`.
"""

import json
import os
import sys
import random
from datetime import datetime

# Garante a raiz do projeto no path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from utils.env_helper import load_env_safely
load_env_safely()


def simulate_realtime_event(target_machine_id: str = "EQP-0215", anomaly_type: str = "vibration"):
    print("\n=======================================================")
    print("  SMARTMACHINES — SIMULADOR REALTIME (DEMO EVENT)")
    print("=======================================================")
    print(f"[*] Gerando evento simulado para máquina: {target_machine_id}")

    machines_file = "public/data/machines.json"
    if not os.path.exists(machines_file):
        print(f"[!] Erro: Arquivo {machines_file} não encontrado. Execute scripts/build_frontend_data.py primeiro.")
        return

    with open(machines_file, "r", encoding="utf-8") as f:
        machines = json.load(f)

    target_machine = None
    for m in machines:
        if m["maquina_id"] == target_machine_id:
            target_machine = m
            break

    if not target_machine:
        print(f"[!] Máquina {target_machine_id} não encontrada.")
        return

    now_iso = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    if anomaly_type == "vibration":
        target_machine["sensor_vibracao_mm_s"] = round(random.uniform(5.2, 7.8), 2)
        target_machine["sensor_temp_c"] = round(random.uniform(82.0, 91.5), 2)
        target_machine["status_operacional"] = "Alerta de Vibração"
        target_machine["risco_parada_percent"] = round(random.uniform(78.0, 94.0), 2)
        target_machine["health_score"] = round(100.0 - target_machine["risco_parada_percent"], 2)
        target_machine["proxima_manutencao_dias"] = 1
    elif anomaly_type == "temperature":
        target_machine["sensor_temp_c"] = round(random.uniform(88.0, 98.0), 2)
        target_machine["status_operacional"] = "Atenção - Temperatura"
        target_machine["risco_parada_percent"] = round(random.uniform(72.0, 89.0), 2)
        target_machine["health_score"] = round(100.0 - target_machine["risco_parada_percent"], 2)
        target_machine["proxima_manutencao_dias"] = 2
    else:
        # Reset para normal
        target_machine["sensor_temp_c"] = 62.0
        target_machine["sensor_vibracao_mm_s"] = 1.4
        target_machine["status_operacional"] = "Operando Normal"
        target_machine["risco_parada_percent"] = 12.0
        target_machine["health_score"] = 88.0
        target_machine["proxima_manutencao_dias"] = 28

    target_machine["timestamp_leitura"] = now_iso
    target_machine["demoMode"] = True
    target_machine["demoEventAt"] = now_iso

    # Salva machines.json atualizado
    with open(machines_file, "w", encoding="utf-8") as f:
        json.dump(machines, f, indent=2, ensure_ascii=False)

    # Adiciona leitura ao telemetry.json
    telemetry_file = "public/data/telemetry.json"
    if os.path.exists(telemetry_file):
        with open(telemetry_file, "r", encoding="utf-8") as f:
            telemetry = json.load(f)
        telemetry.insert(0, {
            "registro_id": f"DEMO-{random.randint(1000, 9999)}",
            "timestamp_leitura": now_iso,
            "maquina_id": target_machine_id,
            "tipo_equipamento": target_machine["tipo_equipamento"],
            "linha_producao": target_machine["linha_producao"],
            "status_operacional": target_machine["status_operacional"],
            "sensor_temp_c": target_machine["sensor_temp_c"],
            "sensor_vibracao_mm_s": target_machine["sensor_vibracao_mm_s"],
            "pressao_psi": target_machine.get("pressao_psi", 120.0),
            "corrente_eletrica_amp": target_machine.get("corrente_eletrica_amp", 25.0),
            "nivel_ruido_db": target_machine.get("nivel_ruido_db", 84.0),
            "risco_parada_percent": target_machine["risco_parada_percent"],
            "eficiencia_oee_percent": target_machine.get("eficiencia_oee_percent", 70.0),
            "demoMode": True
        })
        with open(telemetry_file, "w", encoding="utf-8") as f:
            json.dump(telemetry[:1500], f, indent=2, ensure_ascii=False)

    print(f"[OK] Evento de demonstracao disparado com sucesso para {target_machine_id}:")
    print(f"    - Status: {target_machine['status_operacional']}")
    print(f"    - Vibração: {target_machine['sensor_vibracao_mm_s']} mm/s")
    print(f"    - Temperatura: {target_machine['sensor_temp_c']} °C")
    print(f"    - Risco: {target_machine['risco_parada_percent']}%")
    print(f"    - Sinalizador: demoMode: true")


if __name__ == "__main__":
    m_id = sys.argv[1] if len(sys.argv) > 1 else "EQP-0215"
    a_type = sys.argv[2] if len(sys.argv) > 2 else "vibration"
    simulate_realtime_event(m_id, a_type)
