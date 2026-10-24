# SOP 02 — Motor de Risco & Saúde Operacional

## 1. Princípio Fundamental
A classificação de risco e cálculo de saúde de máquinas deve ser **estritamente determinística**, transparente e auditável. Nenhum cálculo matemático deve ser inferido probabilisticamente por LLMs.

---

## 2. Indicadores Primários de Risco
O dataset original já fornece o indicador preditivo consolidado:
`risco_parada_percent` (float entre 0% e 100%).

### 2.1 Machine Health Score
Para fornecer aos operadores um índice intuitivo de saúde da máquina:
$$\text{Machine Health Score} = 100 - \text{risco\_parada\_percent}$$

- **Saúde Excelente (Verde):** Score $\ge 80.0$ (Risco $\le 20.0\%$)
- **Atenção Operacional (Âmbar):** $50.0 \le \text{Score} < 80.0$ ($20.0\% < \text{Risco} \le 50.0\%$)
- **Alerta Severo (Laranja):** $30.0 \le \text{Score} < 50.0$ ($50.0\% < \text{Risco} \le 70.0\%$)
- **Risco Crítico de Falha (Vermelho):** $\text{Score} < 30.0$ (Risco $> 70.0\%$)

### 2.2 Plant Health Score (Saúde Global da Fábrica)
$$\text{Plant Health Score} = \frac{1}{N} \sum_{i=1}^{N} \text{Machine Health Score}_i$$
Onde $N$ é o número total de máquinas ativas monitoradas na planta (400 máquinas).

---

## 3. Matriz de Priorização para Ação Imediata
O `risk_agent.py` ranqueia as máquinas que exigem intervenção urgente calculando um escore ponderado de criticidade operacional:
$$\text{Criticidade} = (\text{risco\_parada\_percent} \times 0.40) + (\text{peso\_status} \times 0.25) + (\text{peso\_manutencao} \times 0.20) + (\text{peso\_falhas} \times 0.15)$$

Onde:
- `peso_status`: Risco Crítico = 100, Alerta Vibração = 75, Atenção Temperatura = 60, Normal = 10.
- `peso_manutencao`: $100 \times \max(0, 1 - \frac{\text{proxima\_manutencao\_dias}}{30})$.
- `peso_falhas`: $\min(100, \text{historico\_falhas\_30d} \times 25)$.

As máquinas no topo deste ranking são destacadas na área **"Attention Required"** na tela inicial do sistema.
