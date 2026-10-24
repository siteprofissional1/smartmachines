# SOP 01 — Dados & RAG Local

## 1. Origem e Localização do Dataset
- Arquivo: `data/data_smartmachines_manutencao.csv`
- Codificação: `latin-1` / `cp1252` (preservando caracteres da língua portuguesa).
- Volume: 1.200 linhas de telemetria, 400 identificadores únicos de máquinas (`EQP-0001` a `EQP-0400`), 20 tipos de equipamentos industriais, 5 linhas produtivas (Linhas A a E), 3 turnos (Manhã, Tarde, Noite).
- Regra de Integridade: O arquivo original nunca deve ser sobrescrito ou modificado.

---

## 2. Esquema de Atributos e Tipos
1. `registro_id` (string): Identificador único da leitura (ex: `MNT-2026-0001`).
2. `timestamp_leitura` (datetime): Data e hora da leitura (período: Julho a Outubro de 2026).
3. `maquina_id` (string): Identificador do equipamento (ex: `EQP-0215`).
4. `tipo_equipamento` (string): Categoria do equipamento (ex: `Paletizador Robótico ABB`).
5. `linha_producao` (string): Linha de montagem/fabricação (Linha A a E).
6. `turno_operacao` (string): Manhã (06h-14h), Tarde (14h-22h), Noite (22h-06h).
7. `sensor_temp_c` (float): Temperatura do mancais/carcaça em Celsius.
8. `sensor_vibracao_mm_s` (float): Velocidade RMS de vibração em mm/s.
9. `pressao_psi` (float): Pressão hidráulica/pneumática em PSI.
10. `corrente_eletrica_amp` (float): Corrente de consumo do motor em Ampères.
11. `nivel_ruido_db` (float): Nível de pressão sonora em decibéis.
12. `status_operacional` (string): `Operando Normal`, `Alerta de Vibração`, `Atenção - Temperatura`, `Risco Crítico de Falha`.
13. `horas_uso` (int): Horímetro total acumulado.
14. `mtbf_horas` (float): Tempo Médio Entre Falhas (*Mean Time Between Failures*).
15. `mttr_horas` (float): Tempo Médio Para Reparo (*Mean Time To Repair*).
16. `eficiencia_oee_percent` (float): Eficiência Global do Equipamento (OEE).
17. `componente_critico` (string): Nome do componente com maior desgaste.
18. `codigo_peca_reposicao` (string): Código do part-number sobressalente.
19. `fornecedor_homologado` (string): Fabricante homologado para compra da peça.
20. `custo_estimado_peca_r$` (float): Custo de referência de catálogo em Reais.
21. `lead_time_fornecedor_dias` (int): Prazo de entrega previsto em dias.
22. `historico_falhas_30d` (int): Quantidade de ocorrências nos últimos 30 dias.
23. `risco_parada_percent` (float): Probabilidade estimada de parada catastrófica (0 a 100%).
24. `proxima_manutencao_dias` (int): Dias restantes para a intervenção obrigatória.
25. `diagnostico_preditivo_ia` (string): Diagnóstico histórico pré-existente no dataset.

---

## 3. Mecanismo de RAG Local (Retrieval Compacto)
Para evitar o consumo excessivo de tokens e custos de contexto:
1. Quando uma máquina `EQP-XXXX` é requisitada, o `data_agent.py` filtra exclusivamente os registros daquela máquina no CSV.
2. Os registros são ordenados temporalmente.
3. Extrai-se a leitura mais recente de telemetria, médias de vibração e temperatura e os valores de confiabilidade.
4. Constrói-se um payload compacto em JSON (inferior a 1.000 tokens) contendo:
   - Identidade da máquina e componente crítico;
   - Leituras atuais e médias;
   - Histórico de falhas e prazo de manutenção;
   - Diagnóstico baseline do dataset;
   - Cotação externa atual (caso disponível via Scraper).
5. Esse payload é repassado ao `maintenance_agent.py` para consulta pontual ao Gemini.
