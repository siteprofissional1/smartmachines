# SOP 08 — CI/CD, Automação & Deploy em Nuvem

## 1. Arquitetura de Publicação
- **Hospedagem Frontend:** GitHub Pages (Single Page Application com base URL configurável).
- **Pipeline de Integração Contínua:** GitHub Actions (`.github/workflows/deploy-pages.yml`).
- **Pipeline de Inteligência Opcional:** `.github/workflows/sync-intelligence.yml` (acionado via `workflow_dispatch` ou cron para executar o pipeline Python com secrets protegidos no GitHub).

---

## 2. Etapas do Workflow de Deploy do Frontend
1. **Checkout:** Clona o repositório com profundidade total.
2. **Setup Node.js:** Instala a versão LTS do Node.js (v20 ou superior).
3. **Dependências:** Executa `npm ci` ou `npm install`.
4. **Verificação de Qualidade:**
   - Linting do código.
   - Execução dos testes automatizados (`npm test`).
5. **Build Estático:** Executa `npm run build` gerando a pasta `dist/`.
6. **Publicação no GitHub Pages:** Faz o upload dos artefatos estáticos para o serviço Pages da GitHub.

---

## 3. Scripts de Inicialização Rápida no Windows
Para desenvolvedores e avaliadores do Hackathon:
- `executar.bat`: Menu interativo no Prompt de Comando (CMD).
- `executar.ps1`: Script PowerShell robusto com suporte a parâmetros diretos (`-Action Frontend`, `-Action Test`, `-Action Build`).
