# SOP 06 — Dashboard Frontend & Visualizações Analíticas

## 1. Stack Tecnológica do Cliente
- **Core:** React 19 / 18 + Vite + TypeScript.
- **Gráficos:** Plotly.js (`react-plotly.js` ou wrapper customizado de alto desempenho).
- **Ícones:** Lucide React.
- **Roteamento:** Abas reativas ou React Router (Overview, Machines, Telemetry, Predictive Maintenance, Parts & Quotes, AI Insights, System).
- **Estilos:** Modern CSS Tokens integrados ao Tailwind CSS e variáveis CSS para suporte instantâneo a Dark/Light Mode.

---

## 2. Páginas e Telas Obrigatórias

### 2.1 Overview (Painel Geral da Fábrica)
- KPIs de topo: `Plant Health Score`, `Máquinas Críticas`, `OEE Médio`, `Falhas 30 Dias`.
- Banner de Máquinas Prioritárias (*Attention Required*).
- Gráficos analíticos:
  - Donut com distribuição dos estados operacionais.
  - Scatter Vibração vs. Temperatura.
  - Risco médio agrupado por Linha de Produção (Linhas A a E).
  - Histograma de distribuição do risco de parada.

### 2.2 Machines (Inventário Operacional)
- Tabela interativa com busca, filtros por linha, turno e status.
- Linhas clicáveis abrindo a visualização 360° em Drawer/Modal.

### 2.3 Machine Detail (Gaveta de Inspeção da Máquina)
- Identificação da máquina, linha e turno.
- Telemetria atual com indicadores semafóricos.
- Métricas de confiabilidade (OEE, MTBF, MTTR, Horas).
- Peça de reposição com cotação atual do Scraper.
- Diagnóstico original do dataset (*Baseline*) vs. Recomendação estruturada do Gemini (*Predictive AI*).

### 2.4 Predictive Maintenance (Confiabilidade & Planejamento)
- Ranking de equipamentos com manutenção prevista para os próximos 7 e 30 dias.
- Gráfico de dispersão MTBF vs. MTTR para identificação de gargalos de reparo.

### 2.5 Parts & Quotes (Gestão de Sobressalentes)
- Tabela comparativa entre custo histórico homologado e cotações externas com status `LIVE`, `CACHED` ou `UNAVAILABLE`.

### 2.6 AI Insights (Central de Recomendações Preditivas)
- Feed de insights categorizados por criticidade.
- Visão executiva da planta inteira gerada por IA.

### 2.7 System (Monitor dos 9 Pilares & Governança)
- Painel técnico mostrando o status operacional de cada um dos 9 pilares do Hackathon.
- Diagrama da arquitetura e diagnóstico de conexões ativas.

---

## 3. Rodapé Obrigatório
Todo layout deve incluir na base da página:
`desenvolvido por siteprofissional` com link clicável azul para `https://siteprofissional.pro`.
