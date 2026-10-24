"""
SmartMachines — Helper Seguro de Variáveis de Ambiente
Lê e carrega variáveis sem poluir logs do terminal e protegendo segredos.
"""

import os
import re


def load_env_safely(env_path: str = ".env"):
    """
    Carrega variáveis do arquivo .env preservando o formato existente
    sem disparar avisos no console e sem expor credenciais.
    """
    if not os.path.exists(env_path):
        return

    try:
        with open(env_path, "r", encoding="utf-8") as f:
            lines = f.readlines()
    except Exception:
        return

    for line in lines:
        line = line.strip()
        if not line or line.startswith("//") or line.startswith("#"):
            continue

        # Formato KEY=VALUE
        if "=" in line and not line.startswith("const") and not line.startswith("import"):
            parts = line.split("=", 1)
            k = parts[0].strip()
            v = parts[1].strip().strip('"').strip("'")
            if k and k not in os.environ:
                os.environ[k] = v

        # Formato JS do Firebase: apiKey: "..."
        elif ":" in line and ('"' in line or "'" in line):
            m = re.match(r'^\s*([a-zA-Z0-9_]+)\s*:\s*["\']([^"\']+)["\']', line)
            if m:
                k, v = m.group(1), m.group(2)
                # Mapeia para variáveis VITE caso apropriado
                env_map = {
                    "apiKey": "VITE_FIREBASE_API_KEY",
                    "authDomain": "VITE_FIREBASE_AUTH_DOMAIN",
                    "projectId": "VITE_FIREBASE_PROJECT_ID",
                    "storageBucket": "VITE_FIREBASE_STORAGE_BUCKET",
                    "messagingSenderId": "VITE_FIREBASE_MESSAGING_SENDER_ID",
                    "appId": "VITE_FIREBASE_APP_ID",
                    "measurementId": "VITE_FIREBASE_MEASUREMENT_ID"
                }
                mapped_key = env_map.get(k, k.upper())
                if mapped_key not in os.environ:
                    os.environ[mapped_key] = v
