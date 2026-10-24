# Ideia de Design — SmartMachines Industrial Command Center

## 1. Filosofia Visual
A interface do **SmartMachines** foi projetada para emular as telas de supervisório e controle de plantas industriais modernas de classe mundial (Siemens Sinumerik, ABB Ability, Schneider EcoStruxure) combinadas com a elegância minimalista de plataformas SaaS modernas (Datadog, Grafana Enterprise, Linear).

### Princípios Norteadores:
- **Alta Densidade de Informação sem Poluição:** Apresentar dados vitais de 400 máquinas de forma clara, utilizando hierarquia tipográfica precisa e agrupamentos visuais intuitivos.
- **Destaque Semafórico de Risco:** Cores funcionais reservadas exclusivamente para expressar status físico dos equipamentos:
  - 🟢 **Verde (#22C55E):** Operando Normal (Saúde > 80%)
  - 🟡 **Âmbar/Laranja (#F59E0B):** Atenção - Temperatura ou Risco Médio
  - 🟠 **Laranja Escuro (#F97316):** Alerta de Vibração
  - 🔴 **Vermelho (#EF4444):** Risco Crítico de Falha (Ação imediata)
- **Modo Escuro como Padrão Imersivo:** Reduz o cansaço visual em salas de controle fabril operando 24/7.
- **Modo Claro de Alto Contraste:** Para uso sob iluminação natural ou em tablets na fábrica durante inspeções de campo.
- **Interatividade & Feedback Tátil:** Efeitos suaves de hover em cards, transições suaves de abas e gráficos com tooltips customizados no Plotly.
