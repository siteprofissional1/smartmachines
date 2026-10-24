# SOP Modelo Mestre — Arquitetura de 3 Camadas Antigravity

> Este documento serve como modelo padronizado e reutilizável para projetos industriais e corporativos desenvolvidos no ecossistema Antigravity.

---

## 1. Visão Geral
- **Nome do Projeto:** [Nome da Solução]
- **Objetivo Primário:** [Resumo em 1 parágrafo do problema resolvido]
- **Público-Alvo:** [Personas atendidas]

---

## 2. Arquitetura em 3 Camadas
1. **Camada 1 — Diretivas & Estratégia (`/directives`):**
   - Regras de negócio, contratos de dados, design tokens e SOPs descritivos.
2. **Camada 2 — Orquestração & Decisão (`/agents` ou IA Orquestradora):**
   - Agentes inteligentes, seleção de contexto, roteamento de tarefas e integração com LLM.
3. **Camada 3 — Execução Determinística (`/scripts`, `/scraper`, `/src`):**
   - Algoritmos determinísticos, ETL, renderização de UI, persistência e automações de build.

---

## 3. Tech Stack Padronizada
- **Frontend:** React + Vite + TypeScript + Lucide + Tailwind CSS / Vanilla Tokens.
- **Backend / Pipeline:** Python 3 + Pandas + Requests + BeautifulSoup + SDK GenAI + Firebase Admin SDK.
- **Banco de Dados Realtime:** Google Cloud Firestore.
- **Hospedagem & CI/CD:** GitHub Pages + GitHub Actions.

---

## 4. UX/UI & Design System
- Padrão **Industrial Command Center** com suporte completo a Dark e Light Mode.
- Gráficos analíticos de alta densidade de informação (Plotly.js).
- Responsividade estrita para desktop (1920×1080), notebooks (1366×768) e smartphones (< 768px).

---

## 5. Fluxo Operacional
1. Ingestão de dados brutos e validação de schema.
2. Análise estatística determinística e ranqueamento de risco.
3. Scraping de dados complementares externos com cache.
4. Enriquecimento semântico via LLM (Gemini) em ambiente seguro.
5. Sincronização em tempo real via NoSQL.
6. Apresentação reativa no Dashboard do operador.

---

## 6. Entregáveis Obrigatórios
- Código fonte estruturado em pastas padronizadas.
- Diretivas completas documentadas.
- Scripts de execução rápida (`.bat` / `.ps1`).
- Suíte de testes automatizados unitários e de integração.
- Manual bilíngue (`README.md`) e roteiro de instalação (`instruction.md`).

---

## 7. Tratamento de Erros e Degradação Suave
- Estratégia de Fallback local para ambientes sem conexão à internet ou sem chaves de API.
- Sinalização explícita na UI de estados de conexão: `LOCAL`, `CONNECTED`, `OFFLINE`, `CACHED`.
- Timeout e retry exponencial para chamadas de rede.

---

## 8. Self-Annealing Documental
- Quando um erro de infraestrutura ou limitação de API for descoberto, a correção deve ser implementada no código e imediatamente documentada no SOP correspondente, evitando a recorrência do problema.

---

## 9. Governança e Segurança
- Nenhum segredo ou chave privada no bundle do cliente.
- Arquivo `.env` protegido contra sobrescrita e commits.
- Regras de segurança no Firestore bloqueando escritas não autorizadas do cliente.

---

## 10. Testes e Qualidade
- Validação de tipos estáticos (TypeScript / Python Type Hints).
- Testes de lógica de negócio e transformações de dados.
- Verificação de acessibilidade e contraste visual (WCAG AA).

---

## 11. Deploy e Publicação
- Pipeline de CI/CD automatizado via GitHub Actions.
- Build estático otimizado para entrega via CDN global.

---

## 12. Critérios de Sucesso
- 100% dos requisitos funcionais demonstráveis.
- Aplicação sem erros em console e sem telas brancas (*zero crashes*).
- Pitch demonstrável em menos de 5 minutos.
