# Especificação de Design — SmartMachines Design System

---

## 1. Filosofia Visual e Diretrizes de Marca
O design system do **SmartMachines** adota a linguagem de design **Industrial Command Center & Observability Enterprise**. Ele equilibra alta densidade de métricas analíticas com excelente ergonomia visual, permitindo que operadores de manutenção identifiquem criticidades em menos de 2 segundos.

---

## 2. Paleta de Cores e Tokens CSS

### 2.1 Dark Mode (Tema Padrão)
```css
:root[data-theme="dark"] {
  --bg-canvas: #070B11;          /* Fundo principal profundo */
  --bg-surface: #0D131C;         /* Cartões e painéis de controle */
  --bg-elevated: #131C28;        /* Elementos destacados e modais */
  --bg-hover: #1A2636;           /* Hover em linhas e botões */
  
  --border-subtle: #182333;      /* Bordas discretas */
  --border-default: #233044;     /* Bordas padrão dos cards */
  --border-highlight: #38BDF8;   /* Bordas de foco ativo */

  --text-primary: #F8FAFC;       /* Títulos e valores de destaque */
  --text-secondary: #94A3B8;     /* Subtítulos e rótulos */
  --text-muted: #64748B;         /* Metadados e rodapés */

  --brand-primary: #22D3EE;      /* Ciano industrial tecnológico */
  --brand-primary-strong: #0891B2;
  --brand-accent: #38BDF8;

  /* Estados Operacionais & Semáforo Industrial */
  --status-normal: #22C55E;      /* Operando Normal */
  --status-normal-bg: rgba(34, 197, 94, 0.12);
  --status-normal-border: rgba(34, 197, 94, 0.3);

  --status-warning: #F59E0B;     /* Atenção - Temperatura */
  --status-warning-bg: rgba(245, 158, 11, 0.12);
  --status-warning-border: rgba(245, 158, 11, 0.3);

  --status-alert: #F97316;       /* Alerta de Vibração */
  --status-alert-bg: rgba(249, 115, 22, 0.12);
  --status-alert-border: rgba(249, 115, 22, 0.3);

  --status-critical: #EF4444;    /* Risco Crítico de Falha */
  --status-critical-bg: rgba(239, 68, 68, 0.15);
  --status-critical-border: rgba(239, 68, 68, 0.4);
}
```

### 2.2 Light Mode
```css
:root[data-theme="light"] {
  --bg-canvas: #F8FAFC;
  --bg-surface: #FFFFFF;
  --bg-elevated: #F1F5F9;
  --bg-hover: #E2E8F0;

  --border-subtle: #E2E8F0;
  --border-default: #CBD5E1;
  --border-highlight: #0284C7;

  --text-primary: #0F172A;
  --text-secondary: #475569;
  --text-muted: #94A3B8;

  --brand-primary: #0284C7;
  --brand-primary-strong: #0369A1;
  --brand-accent: #0EA5E9;

  --status-normal: #16A34A;
  --status-normal-bg: #DCFCE7;
  --status-normal-border: #86EFAC;

  --status-warning: #D97706;
  --status-warning-bg: #FEF3C7;
  --status-warning-border: #FCD34D;

  --status-alert: #EA580C;
  --status-alert-bg: #FFEDD5;
  --status-alert-border: #FDBA74;

  --status-critical: #DC2626;
  --status-critical-bg: #FEE2E2;
  --status-critical-border: #FCA5A5;
}
```

---

## 3. Tipografia
- **Família Tipográfica Primária:** `Inter`, system-ui, -apple-system, sans-serif.
- **Família Numérica / Monospaçada:** `JetBrains Mono`, `Fira Code`, monospace (utilizada para IDs de equipamento como `EQP-0215`, códigos de peças sobressalentes como `SEW-R47-AD2` e telemetria pura).
- **Escala de Tamanhos:**
  - `Display / KPI`: 32px / 2rem, Peso 700
  - `H1`: 24px / 1.5rem, Peso 700
  - `H2`: 18px / 1.125rem, Peso 600
  - `H3`: 15px / 0.9375rem, Peso 600
  - `Body`: 14px / 0.875rem, Peso 400
  - `Caption / Badge`: 12px / 0.75rem, Peso 500
  - `Micro / Code`: 11px / 0.6875rem, Peso 600

---

## 4. Breakpoints e Responsividade

| Nome | Faixa | Comportamento Layout |
|---|---|---|
| Mobile | `< 768px` | Sidebar oculta (abre via Drawer móvel); Gráficos em pilha vertical; Tabelas com rolagem horizontal touch. |
| Tablet | `768px - 1024px` | Sidebar colapsável; Grid de KPIs em 2 colunas; Gráficos empilhados 1 ou 2 por linha. |
| Desktop Notebook | `1024px - 1440px` | Sidebar fixa visível (240px); KPIs em 4 colunas; Layout analítico em 2 colunas. |
| Wide Desktop | `> 1440px` | Aproveitamento estendido com visualizações em múltiplos painéis lado a lado. |

---

## 5. Componentes Estruturais

### 5.1 Navbar Superior (`#main-header`)
- Logotipo SmartMachines com indicador luminoso da planta.
- Badges de conectividade ativa: `Firebase [CONNECTED/OFFLINE]`, `AI [ONLINE/OFFLINE]`, `Scraper [LIVE/CACHED]`.
- Botão seletor de tema Dark/Light com persistência em `localStorage`.
- Botão do menu móvel (hambúrguer) visível em telas menores que 768px.

### 5.2 Sidebar Lateral (`#app-sidebar`)
- Links de navegação com ícones Lucide:
  - **Overview** (Geral da fábrica)
  - **Machines** (Catálogo das 400 máquinas com filtros)
  - **Telemetry** (Telemetria detalhada e gráficos avançados)
  - **Predictive Maintenance** (Ranking de criticidade e MTBF/MTTR)
  - **Parts & Quotes** (Cotações e fornecedores homologados)
  - **AI Insights** (Recomendações estruturadas do Gemini)
  - **System** (Diagnóstico dos 9 pilares e arquitetura)

### 5.3 Painel de Filtros Globais (`#global-filter-bar`)
- Filtro por Linha de Produção (Linhas A, B, C, D, E).
- Filtro por Status Operacional (Normal, Alerta Vibração, Atenção Temperatura, Risco Crítico).
- Filtro por Turno (Manhã, Tarde, Noite).
- Campo de busca instantânea por ID da Máquina ou Tipo de Equipamento.

### 5.4 Cards de KPI
- Valor numérico destacado com indicador semafórico.
- Rótulo claro e variação percentual ou métrica de contexto.
- Exemplo: `Plant Health: 73.8%`, `Máquinas Críticas: 116`, `OEE Médio: 74.2%`.

### 5.5 Gráficos com Plotly.js
- Cores configuradas dinamicamente com base nas variáveis CSS do tema ativo.
- Fundo transparente integrado à superfície do card.
- Tooltips ricos exibindo: Identificador da máquina, linha, equipamento e valores físicos com unidade (ex: `°C`, `mm/s`, `PSI`).

### 5.6 Tabela de Máquinas
- Cabeçalhos ordenáveis com indicadores visuais de ordenação.
- Badges de status coloridos com cantos arredondados.
- Linhas clicáveis que abrem a gaveta/modal de detalhes completos da máquina selecionada.

### 5.7 Modal / Drawer de Detalhes da Máquina (`#machine-detail-modal`)
- **Seção de Identidade:** ID, Equipamento, Linha, Turno e Horas de Uso.
- **Seção de Telemetria Atual:** Temperatura, Vibração, Pressão, Corrente, Ruído.
- **Confiabilidade:** OEE, MTBF, MTTR, Risco de Parada e Próxima Manutenção.
- **Componente & Peça Sobressalente:** Peça homologada, custo original e cotação externa atualizada com status `LIVE` ou `CACHED`.
- **Diagnóstico Comparativo:**
  - *Dataset Baseline Diagnosis* (Registro original do CSV).
  - *Gemini Predictive Insight* (Síntese estruturada da IA generativa).

---

## 6. Estados de Interface (Feedback ao Usuário)

- **LoadingState:** Spinner suave ciano acompanhado de texto instrutivo ("Processando telemetria...").
- **SkeletonLoader:** Retângulos animados com efeito de pulso (*shimmer*) respeitando o formato dos cards e gráficos.
- **ErrorState:** Caixa de alerta com ícone de advertência, mensagem amigável e botão de recarregar ("Tentar novamente").
- **EmptyState:** Ilustração sutil de equipamento industrial com texto orientando ajuste nos filtros de pesquisa.
- **OfflineBanner:** Notificação flutuante avisando que a aplicação está executando em `LOCAL DATA MODE`.

---

## 7. Acessibilidade (WCAG 2.1 AA)
- Relação de contraste mínimo de 4.5:1 para todo texto informativo.
- Rótulos textuais `aria-label` em todos os botões de ação e ícones.
- Semáforo com suporte a identificação textual (não depender exclusivamente da cor para expressar o risco).
- Foco visível (`focus-visible`) com anel ciano de 2px para navegação via teclado.

---

## 8. Rodapé Obrigatório
Todo o layout da aplicação exibe na última linha, centralizado:
`desenvolvido por siteprofissional` (onde "siteprofissional" é um hiperlink azul para `https://siteprofissional.pro`).
