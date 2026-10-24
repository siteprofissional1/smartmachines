# Prompt para Google Stitch — SmartMachines UI Prototyping

Instrução formatada para geração de telas e componentes interativos no Google Stitch utilizando as diretivas de design do SmartMachines:

```text
Gere uma interface de tela completa para a aplicação "SmartMachines: Predictive Maintenance Intelligence" utilizando como fonte única de verdade as especificações do arquivo `directives/design/design.md`.

Telas Requeridas:
1. OVERVIEW:
   - Header com status da conexão (Firebase, AI, Scraper), alternador de tema e marca SmartMachines.
   - 4 KPIs principais: Plant Health Score (73.8%), Máquinas em Risco (116), OEE Médio Fábrica (74.2%), Falhas 30 Dias (342).
   - Banner de "Atenção Requerida" com as 3 máquinas de risco mais elevado.
   - 4 Gráficos analíticos: Distribuição Operacional (Donut), Scatter Vibração vs. Temperatura, Risco por Linha de Produção, Histograma de Risco.
   - Tabela rápida dos 5 equipamentos com maior criticidade.

2. MACHINES:
   - Filtros de busca instantânea, linha de produção, turno e status.
   - Tabela completa de 400 máquinas com colunas: ID, Equipamento, Linha, Status, Temp, Vibração, OEE, Risco, Próxima Manutenção e Ações.
   - Paginação e ordenação por colunas.

3. MACHINE DETAIL (Modal / Drawer):
   - Visão 360° da máquina EQP-0215 (Paletizador Robótico ABB).
   - Telemetria em tempo real vs limites operacionais.
   - Comparativo de diagnóstico: "Dataset Baseline" vs "Gemini AI Predictive Insight".
   - Cotação de peça de reposição (Redutor Planetário SEW-Eurodrive) com preço histórico vs preço atual de mercado.

4. PREDICTIVE MAINTENANCE:
   - Matriz de criticidade industrial, máquinas com manutenção para <= 7 dias e análise de MTBF vs MTTR.

5. PARTS & QUOTES:
   - Comparativo de cotações obtidas pelo web scraper com fornecedores homologados (SEW, Siemens, SKF, WEG, FESTO).

6. AI INSIGHTS:
   - Cartões com recomendações de manutenção preditiva gerados pela IA generativa e síntese executiva da planta.

7. SYSTEM (9 Pilares):
   - Painel técnico de governança e monitoramento dos 9 pilares do Hackathon.

Estética Obrigatória:
- Industrial Command Center Dark (#070B11), com acentos em Ciano (#22D3EE), Verde (#22C55E), Âmbar (#F59E0B) e Vermelho (#EF4444).
- Rodapé obrigatório centralizado: "desenvolvido por siteprofissional" com link azul para "https://siteprofissional.pro".
```
