# SOP 03 — Web Scraping & Cotações de Peças Industriais

## 1. Missão do Scraper
Pesquisar cotações e estimativas de preços de peças de reposição de componentes críticos homologados da planta:
- `SEW-Eurodrive Brasil` (ex: `SEW-R47-AD2`, `SEW-WA37`)
- `Siemens Brasil` (ex: `SIEMENS-3RT2026`, `SIEMENS-S7-1200`)
- `SKF do Brasil` (ex: `SKF-6205-2RSH`, `SKF-22216-E`)
- `WEG Motores` (ex: `WEG-W22-10CV`, `WEG-CFW500`)
- `Festo Brasil` (ex: `FESTO-DSBC-32`, `FESTO-VUVG`)

---

## 2. Princípios de Acesso Ético e Resiliência
1. Apenas páginas e catálogos públicos indexáveis podem ser consultados.
2. É expressamente proibido tentar quebrar proteções anti-bot, decifrar CAPTCHAs ou violar termos de serviço.
3. Requisições HTTP devem possuir cabeçalho `User-Agent` descritivo, timeout explícito (máximo de 5 segundos) e retry limitado com backoff exponencial.

---

## 3. Estrutura de Retorno do Scraper
Cada cotação coletada deve produzir o seguinte objeto JSON estrito:

```json
{
  "part_code": "SEW-R47-AD2",
  "component": "Redutor Planetário SEW-Eurodrive",
  "supplier": "SEW-Eurodrive Brasil",
  "title": "Redutor de Velocidade Helicoidal SEW R47",
  "price": 5480.00,
  "currency": "BRL",
  "historical_cost": 5224.09,
  "diff_value": 255.91,
  "diff_percent": 4.90,
  "source": "Catálogo Industrial E-Commerce",
  "url": "https://www.distribuidores-industriais.com.br/pecas/SEW-R47-AD2",
  "searched_at": "2026-10-24T10:30:00Z",
  "status": "LIVE"
}
```

---

## 4. Política de Cache e Fallback Suave
Arquivo de Cache: `data/cache/parts_prices.json`

- **LIVE:** Preço obtido com sucesso em tempo real durante a execução atual.
- **CACHED:** Se a requisição de rede falhar, sofrer timeout ou encontrar indisponibilidade do fornecedor, o sistema consulta `data/cache/parts_prices.json`, utiliza o último valor válido e sinaliza o status `CACHED`.
- **UNAVAILABLE:** Caso não exista cotação em cache para a peça, o sistema preenche `price: null` e status `UNAVAILABLE`, sem interromper a execução do pipeline ou dashboard.
