# SOP 04 — Agentes Multi-IA & Integração Gemini

## 1. Responsabilidade do Maintenance Agent
O `maintenance_agent.py` é responsável por receber o contexto RAG filtrado pelo `data_agent.py` e consultar a API do Google Gemini para enriquecer a telemetria com recomendações técnicas especializadas.

---

## 2. System Prompt Oficial do Gemini

```text
Você atua como um assistente sênior especialista em engenharia de manutenção preditiva e confiabilidade industrial (Indústria 4.0).
Analise exclusivamente os dados de telemetria, histórico de falhas, confiabilidade e cotação fornecidos no contexto.
Diretrizes Obrigatórias:
1. Não invente sensores, variáveis ausentes, quebras não registradas ou histórico fictício.
2. Não afirme certeza absoluta sobre causas mecânicas; utilize linguagem técnica probabilística fundamentada em evidências ("sinais sugerem folga", "elevação térmica compatível com sobrecarga").
3. Diferencie rigorosamente os dados medidos dos sensores das hipóteses diagnósticas.
4. Estruture a resposta estritamente em formato JSON com o schema especificado.
5. Deixe claro que a validação final cabe à equipe de engenharia e técnicos qualificados no local.
```

---

## 3. Contrato de Entrada (Contexto RAG)
```json
{
  "maquina_id": "EQP-0215",
  "tipo_equipamento": "Paletizador Robótico ABB",
  "linha_producao": "Linha C - Embalagem",
  "turno_operacao": "Manhã (06h-14h)",
  "telemetria": {
    "temperatura_c": 77.5,
    "vibracao_mm_s": 4.22,
    "pressao_psi": 125.9,
    "corrente_amp": 27.3,
    "ruido_db": 83.7
  },
  "confiabilidade": {
    "status": "Alerta de Vibração",
    "horas_uso": 1658,
    "oee_percent": 69.3,
    "mtbf_horas": 250.4,
    "mttr_horas": 2.6,
    "risco_parada_percent": 51.3,
    "falhas_30d": 1,
    "proxima_manutencao_dias": 3
  },
  "componente": {
    "nome": "Redutor Planetário SEW-Eurodrive",
    "codigo_peca": "SEW-R47-AD2",
    "fornecedor": "SEW-Eurodrive Brasil",
    "custo_historico_brl": 5224.09,
    "cotacao_atual_brl": 5480.00
  },
  "diagnostico_baseline": "Harmônicas de vibração acima de 3.8 mm/s detectadas no eixo..."
}
```

---

## 4. Contrato de Saída (JSON Estruturado)
```json
{
  "priority": "critical",
  "summary": "Vibração anômala de 4.22 mm/s combinada com temperatura elevada no Paletizador Robótico ABB.",
  "observed_signals": [
    "Vibração RMS em 4.22 mm/s (acima do limite seguro de 3.5 mm/s)",
    "Temperatura atingindo 77.5 °C no mancal",
    "Prazo de manutenção preventiva em apenas 3 dias"
  ],
  "probable_causes": [
    "Desalinhamento angular ou folga nas engrenagens planetárias do redutor",
    "Degradação da lubrificação sintética por calor acumulado"
  ],
  "recommended_actions": [
    "Realizar análise espectral de vibração (FFT) em regime de carga plena",
    "Inspecionar visualmente o Redutor Planetário SEW-Eurodrive (SEW-R47-AD2)",
    "Verificar o nível e a viscosidade do óleo lubrificante",
    "Aprovar requisição de reserva da peça SEW-R47-AD2 antecipando o lead time"
  ],
  "component_to_inspect": "Redutor Planetário SEW-Eurodrive (SEW-R47-AD2)",
  "recommended_window": "Intervenção obrigatória em até 48 horas (antes do 3º dia)",
  "purchase_recommendation": "Aquisição recomendada: variação de mercado de +4.9% em relação ao histórico.",
  "reasoning_summary": "Evidências mecânicas claras de vibração acima do limiar da norma ISO 10816 para robôs industriais em operação contínua.",
  "limitations": "Telemetria instantânea; não inclui curva espectral detalhada por frequência."
}
```

---

## 5. Resiliência do Parseamento
- O código Python utiliza limpeza de delimitadores Markdown (```json ... ```).
- Caso o JSON retornado esteja mal formatado, um parser seguro com fallback reconstrói o insight a partir do `diagnostico_baseline` sem quebrar o sistema.
