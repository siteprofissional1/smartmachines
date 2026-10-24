# Diretivas Operacionais — SmartMachines

Este diretório contém a **Camada 1 (Diretivas & Estratégia)** da arquitetura Antigravity para o projeto **SmartMachines: Predictive Maintenance Intelligence**.

---

## 🎯 Objetivo da Pasta

Centralizar as especificações conceituais, regras de negócio, contratos de dados, arquiteturas de design e Procedimentos Operacionais Padrão (SOPs) que guiam o raciocínio da IA (Camada 2 - Orquestração) e a implementação em código (Camada 3 - Execução).

---

## ⚖️ Precedência das Diretivas

Em caso de divergência ou ambiguidade, aplique estritamente esta ordem de prioridade:

1. **Requisitos Oficiais do Hackathon:** Escopo, entregas e critérios de avaliação do SENAI Ourinhos.
2. **Dados Reais Disponíveis:** Esquema e integridade do arquivo `data/data_smartmachines_manutencao.csv`.
3. **`directives/projeto.md`:** SOP Mestre e documento central de arquitetura.
4. **SOP Específico (`directives/SOP/*.md`):** Regras detalhadas de subsistemas (RAG, Scraper, Firestore, etc.).
5. **`directives/design/design.md`:** Especificação visual, design system, tokens e componentes.
6. **Implementação de Código:** Scripts Python, componentes React e configurações de deploy.

> **Política de Drift:** Qualquer alteração na implementação que introduza novas restrições técnicas ou modelos de dados deve ser refletida de volta nas diretivas (Self-Annealing).

---

## 📂 Mapa de Documentos

| Arquivo / Pasta | Responsabilidade |
|---|---|
| [`directives/ideia-projeto.md`](ideia-projeto.md) | Proposta de valor, problema industrial, persona e diferenciais competitivos |
| [`directives/projeto-modelo.md`](projeto-modelo.md) | Template reutilizável mestre de SOP em 3 camadas |
| [`directives/projeto.md`](projeto.md) | SOP Mestre do SmartMachines com especificação técnica completa |
| [`directives/prompt-iaexterna-gemini.md`](prompt-iaexterna-gemini.md) | Diretriz de revisão e auditoria externa via Google Gemini |
| [`directives/design/`](design/) | Design system, UI/UX, tokens, visual command center e prompts |
| [`directives/SOP/`](SOP/) | Procedimentos operacionais detalhados de 01 a 08 |

---

*Assinado: Orquestrador Antigravity — SmartMachines SENAI Edition*
