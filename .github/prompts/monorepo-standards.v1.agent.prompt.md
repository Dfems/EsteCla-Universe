# Prompt: Monorepo Cleanup & Standards Enforcement (EsteCla‑Universe)

**Ruolo dell’Agent (VS Code + GitHub Copilot Pro)**  
Applica in autonomia e **fino al completamento** tutte le best practices di monorepo definite qui sotto per EsteCla‑Universe (Lerna + npm workspaces, React, TypeScript, Firebase, Chakra).  
**Parla sempre in italiano.**  
**Commit:** usa **commit atomici** con messaggi in **inglese** nello stile Conventional Commits (`feat|fix|chore|refactor|docs|test|ci|build`).  
**Cancellazioni:** quando devi eliminare file/cartelle, **usa la shell** (`git rm -rf ...`) e non l’UI.  
**Non fermarti** finché tutti i task sono completati e la build è verde.

---

## Contesto Monorepo
- Apps: `apps/estecla-universe`, `apps/glufri-travelers`
- Packages: `packages/{ui, hooks, firebase, firebase-react, types, utils, theme, pwa, config-eslint, config-prettier}`
- Tooling: **npm workspaces + Lerna**, **Vite** (ESM), **ESLint flat**, **Prettier**, **TypeScript 5**, **Firebase Hosting multisito**

## Modalità Operativa
1. Lavora su branch: `chore/cleanup-and-standards` (crealo se manca).
2. Procedi **per step** (vedi roadmap sotto). **Dopo ogni step**:
   - Esegui: `npm run format:all && npm run lint:all && npm run type-check:all && npm run build:all`.
   - Se fallisce, **correggi e ripeti** finché passa.
3. Effettua **commit piccoli e coerenti** (uno scopo = un commit). Esempi:
   - `chore(root): remove legacy single-app artifacts`
   - `feat(theme): switch exports to dist build`
   - `ci: add workspace-wide lint/type-check/build pipeline`
4. Apri PR interne se opportuno, ma **non interrompere il flusso** finché tutti i task di questo prompt non sono completati.

---

## Roadmap (step-by-step)

### 1) Pulizia root (artefatti app singola)
- **Rimuovi** dal root: `vite.config.ts`, `tsconfig.app.json`, `tsconfig.node.json`, e qualsiasi `public/` o `src/` residuo non usato. **Usa shell**:
  ```bash
  git rm -f vite.config.ts tsconfig.app.json tsconfig.node.json || true
  git rm -rf public src || true
  ```
- Sovrascrivi `tsconfig.json` root con:
  ```json
  {
    "extends": "./tsconfig.base.json",
    "files": [],
    "references": []
  }
  ```
- **Commit:** `chore(root): remove legacy single-app leftovers and simplify tsconfig`

### 2) TypeScript standard per tutti i package
Per **ogni** package in `packages/*` (eccetto quelli già a posto):
- Crea/Aggiorna `packages/<name>/tsconfig.json`:
  ```json
  {
    "extends": "../../tsconfig.base.json",
    "compilerOptions": {
      "composite": true,
      "declaration": true,
      "declarationMap": true,
      "outDir": "./dist",
      "rootDir": "./src"
    },
    "include": ["src"]
  }
  ```
- Aggiorna `package.json` del package per esportare da **dist** e avere script coerenti:
  ```json
  {
    "scripts": {
      "build": "tsc -b",
      "type-check": "tsc --noEmit",
      "lint": "eslint . --max-warnings=0",
      "format": "prettier --write . --ignore-path ../../.prettierignore"
    },
    "exports": {
      ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" }
    },
    "sideEffects": false
  }
  ```
- Per `@estecla/ui`: mantieni i **subpath exports** (`./feedback`, `./navigation`, `./profile`, …) tutti puntati a `dist`.  
- **Commit (per package):** `feat(<pkg>): switch exports to dist and enable TS composite build`

### 3) App: alias TS e Vite puliti
- Verifica `apps/estecla-universe/tsconfig.json` e `vite.config.ts` → alias coerenti, nessun riferimento a `../..` verso cartelle non più valide.
- **Glufri Travelers:** rimuovi `publicDir` custom o crea `apps/glufri-travelers/public` e sposta lì asset statici.
  - Soluzione preferita: **rimuovi** `publicDir` dal `vite.config.ts` e usa la `public/` locale dell’app.
- **Commit:** `chore(apps): fix TS paths and Vite aliases; clean glufri publicDir`

### 4) ESLint & Prettier (lint per ogni package)
- Assicurati che **ogni** app/package abbia uno `eslint.config.js` minimale che estende il config condiviso:
  ```js
  // eslint.config.js (in ogni package/app)
  import shared from '@estecla/config-eslint'
  export default shared
  ```
- In **ogni** `package.json`:
  ```json
  { "scripts": {
    "lint": "eslint . --max-warnings=0",
    "type-check": "tsc --noEmit",
    "build": "tsc -b",
    "format": "prettier --write . --ignore-path ../../.prettierignore"
  }}
  ```
- **Commit:** `chore(lint): enable per-package ESLint with shared flat config`

### 5) Script root coerenti
Aggiorna gli script nel root `package.json` per lavorare su tutte le workspace:
```json
{
  "scripts": {
    "dev:estecla": "npm run dev -w apps/estecla-universe",
    "dev:glufri": "npm run dev -w apps/glufri-travelers",
    "format:all": "lerna run format --stream || echo 'ok'",
    "lint:all": "lerna run lint --stream || echo 'ok'",
    "type-check:all": "lerna run type-check --stream || echo 'ok'",
    "build:all": "lerna run build --stream",
    "clean": "rimraf **/dist **/.turbo node_modules **/node_modules",
    "check": "npm run format:all && npm run lint:all && npm run type-check:all && npm run build:all"
  },
  "devDependencies": { "rimraf": "^5.0.0" }
}
```
- **Commit:** `chore(root): align workspace scripts and add clean/check`

### 6) CI GitHub Actions
Crea `.github/workflows/ci.yml`:
```yaml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run format:all
      - run: npm run lint:all
      - run: npm run type-check:all
      - run: npm run build:all
```
- **Commit:** `ci: add workspace-wide lint/type-check/build pipeline`

### 7) Firebase Hosting multisito
- Verifica `.firebaserc` (target in kebab-case) e `firebase.json` con due siti: `estecla` e `glufri-travelers` (SPA rewrites + cache headers).
- Comandi shell utili (se necessario):
  ```bash
  firebase target:apply hosting estecla <site-id-estecla>
  firebase target:apply hosting glufri-travelers <site-id-glufri>
  npm run build -w apps/estecla-universe && firebase deploy --only hosting:estecla
  npm run build -w apps/glufri-travelers && firebase deploy --only hosting:glufri-travelers
  ```
- **Commit:** `chore(firebase): ensure multi-site hosting config`

### 8) README/Docs
- Sostituisci il `README.md` root con una guida del monorepo: struttura, comandi (`dev:*`, `format/lint/type-check/build :all`), policy “no any”, subpath per `@estecla/ui`, hosting multisito, convenzioni FSD.
- **Commit:** `docs: rewrite root README for monorepo standards`

### 9) Validazione finale (blocking)
Esegui, in ordine:
```bash
npm ci
npm run format:all
npm run lint:all
npm run type-check:all
npm run build:all
```
Se qualsiasi comando fallisce, **correggi e ripeti**. Non chiudere i lavori finché **tutto** è verde.

---

## Definition of Done
- Nessun artefatto “app singola” nel root.
- Ogni package **compila in `dist`** ed **esporta da `dist`** (export map corretta).
- ESLint attivo in **ogni** package/app con config condiviso; `lint:all` verde.
- Alias TS/Vite coerenti nelle app (nessun path rotto, niente `publicDir` errato).
- CI attiva su push/PR con format/lint/type-check/build.
- README aggiornato.
- `npm run check` **verde** al root.

## Regole di Sicurezza & Qualità
- Mantieni i commit **atomici** e sempre revertibili.
- Evita side effects top-level nei package; `sideEffects: false` per favorire tree‑shaking.
- Import da `@estecla/ui/<subpath>` (mai dal root del package).
- Nessun `any` introdotto; segui le regole ESLint/TS già configurate.

## Nota
Questo prompt integra lo stile dei prompt agent già usati nel progetto (struttura a livelli, step, deliverables) e li estende con le regole operative richieste (shell per delete, lingua, commit, completezza).
