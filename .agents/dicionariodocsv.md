smartmachines Ourinhos — Manutenção Preditiva & Indústria 4.0
Arquivo: data_smartplant_manutencao_2.csv
Base indicada: 1.200 registros × 25 colunas.
1. registro_id
   - Tipo: string
   - Versão: Nova
   - Descrição: Identificador único da leitura de telemetria no banco histórico.
   - Exemplo: TEL-100001
2. timestamp_leitura
   - Tipo: datetime
   - Versão: Nova
   - Descrição: Data e hora exata da coleta do pacote IIoT.
   - Formato: YYYY-MM-DD HH:MM:SS
   - Exemplo: 2026-01-15 14:22:00
3. maquina_id
   - Tipo: string
   - Versão: Original
   - Descrição: Código patrimonial do ativo industrial, de MAQ-01 a MAQ-20.
   - Exemplo: MAQ-01
4. tipo_equipamento
   - Tipo: string
   - Versão: Nova
   - Descrição: Modelo e função da máquina, como Enchedora, Paletizador, Compressor etc.
   - Exemplo: Enchedora Rotativa Krones
5. linha_producao
   - Tipo: string
   - Versão: Original
   - Descrição: Setor produtivo onde a máquina opera, como Envase, Caldeiraria, Usinagem etc.
   - Exemplo: Linha A - Envase
6. turno_operacao
   - Tipo: string
   - Versão: Nova
   - Descrição: Turno de trabalho no momento da leitura.
   - Valores: Manhã, Tarde ou Noite.
   - Exemplo: Turno 1 (Manhã)
7. sensor_temp_c
   - Tipo: float
   - Versão: Original
   - Descrição: Temperatura superficial do componente crítico em graus Celsius.
   - Exemplo: 92.8
8. sensor_vibracao_mm_s
   - Tipo: float
   - Versão: Original
   - Descrição: Velocidade global de vibração RMS em milímetros por segundo, relacionada à ISO 10816.
   - Exemplo: 6.85
9. pressao_psi
   - Tipo: int
   - Versão: Original
   - Descrição: Pressão pneumática ou hidráulica da linha principal em PSI.
   - Exemplo: 118
10. corrente_eletrica_amp
    - Tipo: float
    - Versão: Nova
    - Descrição: Corrente elétrica consumida pelo motor principal em ampères.
    - Exemplo: 48.5
11. nivel_ruido_db
    - Tipo: float
    - Versão: Nova
    - Descrição: Pressão sonora emitida pelo equipamento em decibéis.
    - Exemplo: 91.4     Guia Técnico e Dicionário de Da…
12. status_operacional
    - Tipo: string
    - Versão: Original
    - Descrição: Estado operacional do ativo.
    - Exemplos de valores: Operando Normal, Alerta de Vibração, Risco Crítico etc.
    - Exemplo: Risco Crítico
13. horas_uso
    - Tipo: int
    - Versão: Original
    - Descrição: Horímetro acumulado desde a última revisão geral/overhaul.
    - Exemplo: 4120
14. mtbf_horas
    - Tipo: float
    - Versão: Nova
    - Descrição: Mean Time Between Failures — Tempo Médio Entre Falhas em horas.
    - Exemplo: 340.5
15. mttr_horas
    - Tipo: float
    - Versão: Nova
    - Descrição: Mean Time To Repair — Tempo Médio de Reparo estimado em horas.
    - Exemplo: 6.2
16. eficiencia_oee_percent
    - Tipo: float
    - Versão: Nova
    - Descrição: Overall Equipment Effectiveness — Eficiência Global do Equipamento em percentual.
    - Exemplo: 64.8
17. componente_critico
    - Tipo: string
    - Versão: Original
    - Descrição: Subconjunto mecânico ou elétrico monitorado, como rolamento, inversor, selo etc.
    - Exemplo: Rolamento Eixo Principal
18. codigo_peca_reposicao
    - Tipo: string
    - Versão: Nova
    - Descrição: Part Number comercial da peça, destinado inclusive à cotação via Web Scraper.
    - Exemplo: SKF-6208-2Z
19. fornecedor_homologado
    - Tipo: string
    - Versão: Nova
    - Descrição: Fabricante ou distribuidor industrial homologado no ERP.
    - Exemplo: SKF Industrial Brasil
20. custo_estimado_peca_r$
    - Tipo: float
    - Versão: Nova
    - Descrição: Preço-base de referência da peça de reposição em reais.
    - Exemplo: 195.50