---
mode: 'agent'
description: 'Crea un branch e implementa Lerna + Workspaces + TS paths + alias Vite. Migra il codice in monorepo con pacchetti condivisi. Configura Firebase Hosting **multisito** su progetto unico.'
---

> Rispondi **sempre in italiano**. **Lavora su un branch dedicato** e consegna una PR pronta al merge.

### 0) Branch di lavoro

```bash
git checkout -b chore/monorepo-lerna-setup
```

### 1) Struttura monorepo

> **Nota naming:** tutte le directory/file dentro `firebase/` (rules, indexes, emulators, seed, snapshots, script) devono essere **kebab-case**; rinomina path non conformi.
> Crea cartelle:

```
apps/estecla-universe
apps/glufri-travelers
packages/ui
packages/hooks
packages/types
packages/firebase
packages/utils
packages/theme
packages/config-eslint
packages/config-prettier
firebase/
```

### 2) Configurazione root

- `package.json`:
  - `"private": true`
  - `"workspaces": ["apps/*", "packages/*"]`
  - scripts: `build`, `lint`, `format`, `type-check`, `dev:<app>`
- `lerna.json`:
  ```json
  {
    "version": "independent",
    "npmClient": "npm",
    "useWorkspaces": true,
    "packages": ["apps/*", "packages/*"]
  }
  ```
- `tsconfig.base.json` con `paths` per `@ui`, `@hooks`, `@types`, `@firebase`, `@utils`, `@theme`.

### 3) Config pacchetti condivisi

- **Regole TypeScript/ESLint anti-`any`**: imposta `@typescript-eslint/no-explicit-any: error` nelle config condivise e `noImplicitAny: true` in `tsconfig.base.json`.
- **config-eslint**: TS + react-hooks + import + sonarjs + prettier.
- **config-prettier**: Prettier condiviso.
- **types**: `src` + `index.ts` (barrel).
- **firebase**: init SDK, adapter tipizzati, `FirestoreDataConverter` per entità core.
- **ui**: componenti riusabili + wrappers `VirtualizedList/Grid`.
- **hooks**: hook riusabili (`useDebounce`, `useAuth`, `useInfiniteFeed`, ecc.).
- **theme**: tema Chakra (tokens, component styles).
- **utils**: logger, formatters, validators.

### 4) Migrazione App

Per ciascuna app:

- sposta codice in `apps/<name>/src` organizzando per **FSD**.
- aggiorna `vite.config.ts` con **alias** che puntano ai pacchetti condivisi.
- aggiorna `tsconfig.json` per estendere `tsconfig.base.json`.
- sostituisci import relativi con **alias**.

### 5) Tooling

- Husky + lint-staged (pre-commit: `format && lint`).

### 5b) Hosting multisito (PROGETTO UNICO)

- **Obiettivo:** due siti di Hosting nello **stesso progetto Firebase**: `estecla` e `glufri-travelers` (kebab-case).
- **Creazione Site ID**:

  - **CLI** (consigliato):

    ```bash
    firebase hosting:sites:create estecla-dev
    firebase hosting:sites:create glufri-travelers-dev
    ```

  - **Console**: _Hosting → Aggiungi sito_ (crea i due site-id).

- **Associa target → site-id** (una tantum per alias di progetto in `.firebaserc`):

  ```bash
  firebase target:apply hosting estecla estecla-dev
  firebase target:apply hosting glufri-travelers glufri-travelers-dev
  ```

- **Config file (ESEMPIO)**:

**`.firebaserc`**

```json
{
  "projects": { "default": "mioprogetto-dev", "prod": "mioprogetto-prod" },
  "targets": {
    "mioprogetto-dev": {
      "hosting": {
        "estecla": ["estecla-dev"],
        "glufri-travelers": ["glufri-travelers-dev"]
      }
    }
  }
}
```

**`firebase.json`**

```json
{
  "hosting": [
    {
      "target": "estecla",
      "public": "apps/estecla-universe/dist",
      "ignore": ["**/.*", "**/node_modules/**"],
      "rewrites": [{ "source": "**", "destination": "/index.html" }]
    },
    {
      "target": "glufri-travelers",
      "public": "apps/glufri-travelers/dist",
      "ignore": ["**/.*", "**/node_modules/**"],
      "rewrites": [{ "source": "**", "destination": "/index.html" }]
    }
  ]
}
```

- **Deploy**:

```bash
firebase deploy --only hosting:estecla
firebase deploy --only hosting:glufri-travelers
```

- **Preview per PR**:

```bash
firebase hosting:channel:deploy pr-<numero> --only hosting:estecla
firebase hosting:channel:deploy pr-<numero> --only hosting:glufri-travelers
```

- **Se l’agent può procedere direttamente**: eseguire i comandi CLI di creazione/associazione/deploy. **In alternativa**, indicare i passaggi precisi in Console (menu da cliccare) e richiedere i **site-id** scelti.

### 6) Verifiche locali (dopo OGNI modifica)

Per tutti i pacchetti/app:

```bash
npm run format && npm run lint && npm run type-check && npm run build
```

**Tutti i comandi devono passare senza errori.** Correggi fino a stato verde.

### 7) Consegna PR

- Titolo: `chore: setup monorepo con Lerna + workspaces + hosting multisito`.
- Descrizione: struttura creata, alias e TS paths, pacchetti condivisi, **hosting multisito** configurato, note di migrazione.
- Checklist: comandi passati, import convertiti, doc breve in README root.

### 8) Commit atomici (suggeriti)

- `chore(monorepo): add lerna + workspaces + base tsconfig`
- `feat(packages): add types/firebase/ui/hooks/utils/theme`
- `refactor(apps): migrate imports to aliases and FSD`
- `chore(firebase): configure hosting multisite targets`
- `chore(ci): add husky + lint-staged (+ actions)`
