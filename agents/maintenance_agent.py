"""
SmartMachines — Maintenance Agent
Integração segura com a API do Google Gemini para síntese preditiva de manutenção industrial.
Opera exclusivamente no backend/pipeline Python.
"""

import json
import os
import re
from typing import Dict, Any, Optional
from datetime import datetime


class MaintenanceAgent:
    SYSTEM_PROMPT = """Você atua como assistente sênior especialista em engenharia de manutenção preditiva e confiabilidade industrial (Indústria 4.0).
Analise exclusivamente os dados físicos de telemetria, indicadores de confiabilidade, histórico e cotação fornecidos.
Diretrizes Obrigatórias:
1. Não invente sensores, variáveis ausentes, anomalias não registradas ou histórico fictício.
2. Não afirme certeza mecânica absoluta; utilize termos técnicos adequados ("evidências sugerem folga", "elevação térmica compatível com sobrecarga").
3. Diferencie rigorosamente dados medidos de hipóteses diagnósticas.
4. Retorne a resposta ESTRITAMENTE em formato JSON com o schema solicitado, sem marcações conversacionais adicionais.
5. Deixe claro que a validação final cabe aos profissionais e engenheiros qualificados da planta fabril."""

    JSON_SCHEMA_INSTRUCTION = """Retorne EXCLUSIVAMENTE um objeto JSON válido com este schema:
{
  "priority": "critical" | "warning" | "normal",
  "summary": "Resumo executivo da condição técnica (1 frase)",
  "observed_signals": ["sinal 1", "sinal 2"],
  "probable_causes": ["causa provável 1", "causa provável 2"],
  "recommended_actions": ["ação recomendada 1", "ação 2"],
  "component_to_inspect": "Nome exato do componente e part-number",
  "recommended_window": "Janela recomendada para intervenção",
  "purchase_recommendation": "Recomendação sobre aquisição da peça sobressalente",
  "reasoning_summary": "Justificativa técnica concisa fundamentada nos dados",
  "limitations": "Limitações da análise baseada em telemetria pontual"
}"""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")

    def is_configured(self) -> bool:
        """Verifica se a chave da API Gemini está presente."""
        return bool(self.api_key and len(self.api_key.strip()) > 10)

    def generate_recommendation(self, rag_context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Submete o contexto RAG compacto ao Gemini ou aciona o fallback com base no baseline.
        """
        if not self.is_configured():
            return self._build_baseline_fallback(rag_context, reason="GEMINI_API_KEY_NOT_CONFIGURED")

        try:
            # Tenta utilizar o novo SDK google-genai
            from google import genai
            client = genai.Client(api_key=self.api_key)

            prompt = f"{self.SYSTEM_PROMPT}\n\n{self.JSON_SCHEMA_INSTRUCTION}\n\nCONTEXTO RAG DA MÁQUINA:\n{json.dumps(rag_context, ensure_ascii=False, indent=2)}"

            response = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=prompt
            )
            raw_text = response.text
            parsed = self._clean_and_parse_json(raw_text)
            if parsed:
                parsed["generated_at"] = datetime.now().isoformat()
                parsed["model"] = "Gemini 2.0 Flash (Industrial Agent)"
                parsed["status"] = "AI_GENERATED"
                return parsed
        except Exception as e_genai:
            # Tenta fallback para o SDK legado google-generativeai se disponível
            try:
                import google.generativeai as legacy_genai
                legacy_genai.configure(api_key=self.api_key)
                model = legacy_genai.GenerativeModel("gemini-1.5-flash")

                prompt = f"{self.SYSTEM_PROMPT}\n\n{self.JSON_SCHEMA_INSTRUCTION}\n\nCONTEXTO RAG DA MÁQUINA:\n{json.dumps(rag_context, ensure_ascii=False, indent=2)}"
                response = model.generate_content(prompt)
                parsed = self._clean_and_parse_json(response.text)
                if parsed:
                    parsed["generated_at"] = datetime.now().isoformat()
                    parsed["model"] = "Gemini 1.5 Flash (Legacy)"
                    parsed["status"] = "AI_GENERATED"
                    return parsed
            except Exception as e_legacy:
                return self._build_baseline_fallback(rag_context, reason=f"API_CALL_FAILED: {str(e_genai)[:50]}")

        return self._build_baseline_fallback(rag_context, reason="PARSING_FAILED")

    def _clean_and_parse_json(self, text: str) -> Optional[Dict[str, Any]]:
        """Remove delimitadores Markdown e extrai o JSON estrito."""
        if not text:
            return None
        cleaned = text.strip()
        # Remove blocos ```json ... ```
        if cleaned.startswith("```"):
            cleaned = re.sub(r"^```[a-zA-Z]*\n?", "", cleaned)
            cleaned = re.sub(r"\n?```$", "", cleaned)
        try:
            return json.loads(cleaned)
        except Exception:
            # Tenta encontrar primeiro { e último }
            start = cleaned.find("{")
            end = cleaned.rfind("}")
            if start != -1 and end != -1:
                try:
                    return json.loads(cleaned[start:end+1])
                except Exception:
                    return None
        return None

    def _build_baseline_fallback(self, rag_context: Dict[str, Any], reason: str) -> Dict[str, Any]:
        """
        Gera insight estruturado resiliente a partir do diagnóstico baseline do dataset.
        Garante que a plataforma funcione com perfeição mesmo sem conexão ou chave de API.
        """
        baseline_diag = rag_context.get("diagnostico_baseline", "")
        m_id = rag_context.get("maquina_id", "EQP-UNKNOWN")
        eq_tipo = rag_context.get("tipo_equipamento", "Equipamento Industrial")
        comp = rag_context.get("componente_sobressalente", {})
        conf = rag_context.get("confiabilidade", {})
        telem = rag_context.get("telemetria_atual", {})

        risco = conf.get("risco_parada_percent", 50.0)
        status = conf.get("status_operacional", "Operando Normal")
        dias_manut = conf.get("proxima_manutencao_dias", 7)

        priority = "critical" if risco >= 70.0 else ("warning" if risco >= 30.0 else "normal")

        return {
            "insight_id": f"INS-{m_id}",
            "machine_id": m_id,
            "equipment_type": eq_tipo,
            "priority": priority,
            "summary": f"Diagnóstico preditivo para {eq_tipo} ({status}) com risco de parada estimado em {risco}%.",
            "observed_signals": [
                f"Temperatura em {telem.get('temperatura_c')} °C",
                f"Vibração mecânica em {telem.get('vibracao_mm_s')} mm/s",
                f"Consumo de corrente elétrica em {telem.get('corrente_amp')} A",
                f"Prazo estipulado para manutenção: {dias_manut} dias"
            ],
            "probable_causes": [
                f"Fadiga mecânica ou degradação em {comp.get('componente', 'Componente Crítico')}",
                "Desalinhamento residual ou perda de lubrificação em regime contínuo"
            ],
            "recommended_actions": [
                f"Executar inspeção sensitiva e termográfica em {comp.get('componente', 'Componente Crítico')}",
                f"Verificar disponibilidade da peça sobressalente {comp.get('codigo_peca', 'N/A')}",
                f"Contatar o fornecedor homologado {comp.get('fornecedor_homologado', 'Homologado')} para cotação preventiva",
                f"Programar intervenção de manutenção antes do término do prazo de {dias_manut} dias"
            ],
            "component_to_inspect": f"{comp.get('componente', 'Componente')} ({comp.get('codigo_peca', 'N/A')})",
            "recommended_window": f"Intervenção recomendada em até {dias_manut} dias",
            "purchase_recommendation": f"Cotação com fornecedor homologado {comp.get('fornecedor_homologado')} indicada.",
            "reasoning_summary": f"Baseado na telemetria histórica e no diagnóstico baseline do dataset ({baseline_diag[:100]}...).",
            "limitations": "Modo Local Fallback ativo (análise fundamentada no dataset baseline e telemetria gravada).",
            "generated_at": datetime.now().isoformat(),
            "model": "SmartMachines Baseline Risk Engine",
            "status": "LOCAL_FALLBACK"
        }
