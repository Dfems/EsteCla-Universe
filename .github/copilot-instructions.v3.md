---
applyTo: '**'
---

# EsteCla Monorepo — Linee guida per l’Agent (FSD + Monorepo, React/TS/Firebase/Chakra)

> **Parla sempre in italiano.** Mantieni **identificatori/types/API in inglese**. Testi UI destinati all’utente: italiano.

## 1) Architettura & Struttura cartelle

### Monorepo (Lerna + npm workspaces)
```
/apps/
  estecla-universe/     # app principale (tipo Instagram)
  glufri-travelers/     # seconda app (ex "Senza Glutine")
/packages/
  ui/                   # componenti riusabili (Chakra + wrappers React Window)
  hooks/                # hook riusabili cross-app
  types/                # tipi/DTO/schemas + barrel exports
  firebase/             # init SDK + adapter tipizzati (auth/firestore/storage)
  utils/                # pure utils (formatters, validators, logger)
  theme/                # tema Chakra condiviso (tokens, component styles)
  config-eslint/        # ESLint condiviso
  config-prettier/      # Prettier condiviso
/firebase/              # rules/indexes/emulators/seed/snapshots/script + config hosting
```

> **Firebase selezionato:** *Progetto unico + Hosting Multisito*. Ogni app ha un **sito Hosting** dedicato nello **stesso progetto Firebase**.

### FSD dentro ogni app
```
src/
  app/                 # entrypoint, providers, layout, error boundaries
  routes/              # definizione rotte + lazy loading
  features/
    <feature>/
      api/             # chiamate + mapper + converters (NO UI, NO React state)
      hooks/           # stato/effects specifici della feature
      ui/              # componenti presentational/container della feature
  shared/              # helpers specifici dell’app (se non meritano un package)
  pages/               # schermate composte (orchestrano features)
```

**Dipendenze consentite (FSD-like):**
- `pages` → usa `features`, `shared`, `@packages/*`.
- `features` → usa `shared`, `@packages/*` (mai dipendere da `pages`).
- `shared` → solo utilities, nessun side-effect d’avvio app.

## 2) Naming & Convenzioni

- **Directory:** `kebab-case` (es. `user-profile`, `infinite-feed`).  
- **Cartelle/file in `/firebase`** (rules, indexes, emulators, seed, snapshots, script): **solo `kebab-case`**. **Rinomina** path non conformi.
- **File componenti React:** `PascalCase.tsx` (es. `UserCard.tsx`).  
- **File hook:** `useXxx.ts` (es. `useInfiniteFeed.ts`).  
- **File types:** `*.types.ts` oppure per dominio (es. `user.ts`) in `packages/types/src`.  
- **Test:** `*.test.ts[x]`, **mocks** in `__mocks__/`.  
- **Barrel:** `packages/types/src/index.ts` esporta tutto ciò che è pubblico.  
- **Esportazioni:** **named exports** (no `default` dove possibile) per tree‑shaking.  
- **Componenti:** *un componente principale per file*; sottocomponenti estratti in file propri.  

## 3) React & Chakra

- **Function Components only.** **Non usare `React.FC<Props>`** → usa:
  ```ts
  type Props = { /* ... */ }
  export function ComponentName(props: Props) { /* ... */ }
  ```
- **Niente side‑effect nel render**; usa `useEffect` con deps corrette. Evita `useEffect` superflui.
- **Props:** se >5 props o JSX molto annidato → estrai sottocomponente/hook.
- **Stato/Performance:** `useMemo`/`useCallback` con deps **minime stabili**; preferisci derived state calcolate nel render se economiche.
- **Chakra:** usa **token del tema** e component styles (niente “magic numbers” inline). Centralizza colori/spaziature in `packages/theme`.
- **A11y:** alt text per immagini, ruoli ARIA, focus management su modali/drawer.

## 4) Import & Alias (Vite + TS Paths)

- **Usa SEMPRE gli alias**, evita percorsi relativi oltre `../..`.
- Alias tipici (per app):
  ```ts
  '@':             './src'
  '@features':     './src/features'
  '@routes':       './src/routes'
  '@pages':        './src/pages'
  '@hooks-local':  './src/hooks'        // hook *locali all’app*
  '@ui':           '../../packages/ui/src'
  '@hooks':        '../../packages/hooks/src'
  '@types':        '../../packages/types/src'
  '@firebase':     '../../packages/firebase/src'
  '@utils':        '../../packages/utils/src'
  '@theme':        '../../packages/theme/src'
  ```
- **Conversione obbligatoria**: trasforma gli import relativi profondi in alias durante i refactor.

## 5) TypeScript

- `strict: true`, `exactOptionalPropertyTypes: true`, `noUncheckedIndexedAccess: true`, **`noImplicitAny: true`**.
- **Vietato `any`** (esplicito o implicito): usa `unknown` + type guards o generics/DTO precisi.
- `interface` per Props/DTO; `type` per union/intersection/utility.
- **Consistent Type Imports:** `@typescript-eslint/consistent-type-imports` (usa `import type`).
- **Converter Firestore** obbligatorio: tipizza read/write con `FirestoreDataConverter<T>` in `packages/firebase`.

## 6) Firebase

### Hosting multisito (stesso progetto)
- Ogni app ha un **target** Hosting (es. `estecla`, `glufri-travelers`). I **site‑id** devono essere `kebab-case`.
- `.firebaserc` associa target → site‑id; `firebase.json` contiene l’array `hosting` con due voci (una per app).
- Comandi tipici:
  ```bash
  firebase hosting:sites:create estecla-dev
  firebase hosting:sites:create glufri-travelers-dev
  firebase target:apply hosting estecla estecla-dev
  firebase target:apply hosting glufri-travelers glufri-travelers-dev
  firebase deploy --only hosting:estecla
  firebase deploy --only hosting:glufri-travelers
  ```

### Integrazione codice
- **Integrazioni** per feature in `features/<feature>/api` che **chiamano adapter** da `@firebase`.
- Credenziali/env **solo** via `.env*` (mai hardcodate). Per Vite usa prefisso `VITE_`.
- Se modifichi `firestore.rules` o `storage.rules`: fornisci patch, aggiorna test emulator (se presenti) e **pubblica**:
  ```bash
  npm run deploy:rules
  ```

## 7) Qualità Codice (ESLint/Prettier)

- **Dimensioni:** componenti **≤ ~400 righe**, funzioni **≤ ~150**.
- **Complessità:** `max-depth: 4`, `complexity: 12`, `max-params: 6` → estrai helper/hook quando superi i limiti.
- **Logging:** **non usare `console.log`**. Usa `console.warn`/`console.error` o un `logger` da `@utils`.
- **Import:** `import/no-relative-parent-imports: warn`; preferisci alias.
- **Regole consigliate:** `sonarjs/recommended`, `react-hooks/recommended`, `@typescript-eslint/recommended`, `@typescript-eslint/no-explicit-any: error`.
- **Style:** Prettier come single source of truth.

## 8) Routing & Code Splitting

- Rotte modulari in `src/routes`; **lazy** per pagine pesanti (`React.lazy` + `Suspense`).
- ErrorBoundary a livello app e per boundary critici (fetch/IO).

## 9) React Window

- Usa **wrappers** in `@ui` (`VirtualizedList`, `VirtualizedGrid`) tipizzati. Le feature non dipendono direttamente da `react-window`.

## 10) Git & PR

- Conventional Commits: `feat|fix|chore|refactor|test|docs: <descrizione in italiano>`.
- Branch naming: `feat/<kebab>`, `chore/<kebab>`, `fix/<kebab>`.
- PR: Obiettivo → Cambiamenti → Motivazione tecnica → Impatti (API/DB/breaking) → Test → Checklist.

## 11) Workflow comandi (obbligatori **dopo OGNI modifica**)

```bash
npm run format && npm run lint && npm run type-check && npm run build
# (facoltativo) npm run preview
```
**Tutti i comandi devono passare senza errori.** Se falliscono, **applica patch** finché tornano verdi.

## 12) Cose da EVITARE

- `React.FC`, `any` non tipizzato, default export superflui, side‑effect nel render,
- inline style con “magic numbers”, prop drilling profondo (valuta context mirati),
- `console.log`, import relativi lunghi, funzioni monolitiche.

## 13) Consegne dell’Agent

- Applica patch **coerenti con questa guida**.
- Se sposti tipi in `@types`, **aggiorna gli import** e il `barrel`.
- Se estrai sottocomponenti/hook, **crea file dedicati** e aggiorna i percorsi FSD.
- Al termine, **riporta l’esito** dei comandi (lint/type-check/build) e il reasoning in 3–5 bullet.
