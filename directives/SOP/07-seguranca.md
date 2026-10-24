# SOP 07 — Governança, Segurança e Proteção de Segredos

## 1. Regra Fundamental de Segredos
Nenhuma chave de API privada, token de acesso pessoal (PAT), chave privada do Firebase Admin ou credencial de serviço administrativo pode ser injetada no código ou bundle do cliente web (Vite/React).

---

## 2. Separação de Contextos de Execução
- **Lado Cliente (Frontend Web):**
  - Hospedado estaticamente no GitHub Pages.
  - Consome apenas as chaves públicas de inicialização do Firebase Web SDK (`apiKey`, `projectId`, `authDomain`, `appId`).
  - Executa apenas leituras do Firestore.
- **Lado Servidor / Pipeline Seguro (Python / GitHub Actions):**
  - Executa em ambiente protegido com acesso às variáveis de ambiente:
    - `GEMINI_API_KEY`
    - Credenciais administrativas de escrita do Firestore.
  - Efetua web scraping, aciona os agentes do Gemini e persiste os documentos.

---

## 3. Regras de Segurança do Firestore (`firestore.rules`)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Leitura pública permitida para o painel de demonstração
    match /{document=**} {
      allow read: if true;
      allow write: if false; // Escrita bloqueada para clientes web não autenticados
    }
  }
}
```

---

## 4. Auditoria de Arquivos e `.gitignore`
O arquivo `.gitignore` deve garantir o bloqueio categórico de:
- `.env` e variações;
- Arquivos de credenciais (`*adminsdk*.json`, `service-account*.json`);
- Pastas transitórias e de cache (`.tmp/`, `data/cache/`, `node_modules/`, `dist/`).
