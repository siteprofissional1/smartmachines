# Ideia de Projeto — SmartMachines: Predictive Maintenance Intelligence

## 1. Problema Industrial
Em operações industriais contemporâneas, o tempo de inatividade não planejado (*unplanned downtime*) representa um dos maiores custos operacionais, consumindo até 20% da capacidade produtiva global. Falhas mecânicas repentinas em redutores, motores elétricos, bombas e robôs industriais geram perdas financeiras astronômicas, além de riscos de segurança e atrasos em cadeia na cadeia de suprimentos.

O processo tradicional de manutenção enfrenta gargalos severos:
1. **Manutenção Reativa:** Ação apenas após a quebra catastrófica, com MTTR elevado e custo de reposição urgente.
2. **Manutenção Preventiva Tradicional:** Troca prematura de peças baseada em tempo de calendário, desperdiçando componentes em bom estado e gerando custos desnecessários.
3. **Desconexão entre Telemetria e Suprimentos:** Técnicos detectam anomalias, mas a equipe de compras (PCM) demora dias para cotar peças críticas com fornecedores homologados.
4. **Sobrecarga Cognitiva:** Supervisores precisam analisar centenas de variáveis de telemetria sem síntese preditiva inteligível em tempo real.

---

## 2. Contexto
No âmbito do **Hackathon Antigravity do SENAI Ourinhos** (Curso de Desenvolvimento de Aplicações com IA Generativa), propõe-se uma plataforma de manutenção preditiva para uma planta fabril com 400 máquinas, 20 tipos de equipamentos e 5 linhas de produção contínua.

A solução é batizada como **SmartMachines**, posicionando-se como uma evolução moderna e enterprise das diretrizes da Indústria 4.0.

---

## 3. Proposta de Valor
A **SmartMachines** transforma telemetria de sensores (temperatura, vibração, pressão, corrente elétrica, ruído) e dados históricos de confiabilidade (OEE, MTBF, MTTR, horas de uso) em **inteligência operacional acionável** com assistência de IA Generativa multimodal e sincronização em tempo real.

### Principais Ganhos:
- **Redução de Downtime:** Antecipação de falhas em até 30 dias antes do colapso.
- **Otimização de OEE:** Elevação da eficiência global dos equipamentos monitorados.
- **Conexão Realtime com Cotações de Mercado:** Scraper automatizado que pesquisa peças de reposição (SEW, Siemens, SKF, WEG, FESTO) em fontes públicas e compara custos históricos com valores atuais de mercado.
- **Recomendações Transparentes:** Diagnósticos do Gemini com foco em inspeção e hipóteses operacionais fundamentadas em evidências.

---

## 4. Público-Alvo (Personas)
- **Técnico de Manutenção Mecânica/Elétrica:** Acessa no celular ou tablet os alertas de vibração e temperatura e o componente exato a inspecionar.
- **Engenheiro de Confiabilidade / PCM:** Analisa gráficos de dispersão (Vibração × Temperatura, MTBF × MTTR), programa paradas preventivas e aprova ordens de serviço.
- **Gerente de Planta Industrial:** Visualiza KPIs consolidados de saúde da fábrica (*Plant Health*), risco agregado e máquinas críticas.
- **Analista de Suprimentos / Compras:** Avalia discrepâncias de custos e lead times de fornecedores homologados para manter estoque de segurança (*safety stock*).

---

## 5. Diferenciais Tecnológicos
1. **Separação Rigorosa Determinístico vs. Probabilístico:** Cálculos de saúde, OEE e índices de risco são executados deterministicamente em Python; o Gemini atua na síntese contextualizada e geração de planos de ação.
2. **RAG Local de Baixa Latência:** Busca orientada ao histórico da máquina sem saturação de tokens.
3. **Web Scraping com Fallback Resiliente:** Coleta cotações ao vivo de peças industriais, com cache local e degradação suave (*graceful degradation*).
4. **Comunicação Realtime NoSQL:** Firestore com listeners `onSnapshot` para atualização sem refresh de tela.
5. **UI Enterprise Command Center:** Interface escura de alta fidelidade visual, com suporte a Light Mode e total responsividade para dispositivos móveis.
