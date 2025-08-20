---
applyTo: '**'
---

# EsteCla Universe – Repo Best Practices (feature-sliced)

## Struttura & convenzioni

- **Feature-sliced:** `src/features/<feature>/{api,hooks,ui}`.
  - `api/`: chiamate e mapper (no UI, no stato React).
  - `hooks/`: logica di stato/effects della feature.
  - `ui/`: componenti presentational/container della feature.
- **Riutilizzo cross-feature**
  - Hook riusabili → `src/hooks/`.
  - Tipi/interfacce/DTO riusabili → **`src/types/`** (esporta da un barrel `src/types/index.ts`).
- **Regola fondamentale**

  - Ogni modifica o nuovo codice **deve rispettare la struttura delle cartelle** e le **best practices** del repo.
  - Nuove feature → `src/features/<feature>/{api,hooks,ui}`.
  - Hook riusabili → `src/hooks/`.
  - Tipi riusabili → `src/types/` (con export nel barrel).

- **React 19 + Chakra**
  - Componenti funzionali + hooks; niente side-effect nel render.
  - Componenti **~≤400 righe** e funzioni **~≤150 righe**.
  - Estrai sottocomponenti/hook se >5 props o JSX troppo annidato.
  - Usa token del tema (no “magic numbers” inline).
- **Routing**
  - Rotte modulari in `src/routes`; lazy per pagine pesanti.
- **Alias Vite (import puliti)**
  - **Usa gli alias di Vite** al posto di percorsi relativi profondi; **converti** gli import esistenti dove applicabile.
  - Esempio (estratto da `vite.config.ts`):
    ```ts
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
        '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
        '@routes': fileURLToPath(new URL('./src/routes', import.meta.url)),
        '@hooks': fileURLToPath(new URL('./src/hooks', import.meta.url)),
        '@context': fileURLToPath(new URL('./src/context', import.meta.url)),
        '@features': fileURLToPath(new URL('./src/features', import.meta.url)),
        '@services': fileURLToPath(new URL('./src/lib', import.meta.url)),
        '@theme': fileURLToPath(new URL('./src/styles/theme.ts', import.meta.url)),
        '@models': fileURLToPath(new URL('./src/types', import.meta.url)),
        '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      },
    }
    ```
- **Qualità & comandi obbligatori**
  - Formattazione **DEVE** passare con `npm run format`.
  - Lint **DEVE** passare con `npm run lint`.
  - Build **DEVE** passare con `npm run build`.
- **Git**
  - Commit **Conventional Commits**: `feat|fix|chore|refactor|test|docs` + `:`.
  - PR: Obiettivo, Cambiamenti, Motivazione tecnica, Impatti (API/DB/breaking), Test, Checklist.

## TypeScript

- Evita `any` non tipizzato; preferisci `unknown` + type guards.
- `interface` per DTO/Props; `type` per unioni/intersezioni/utility.
- Se un tipo è riusabile → **spostalo in `src/types`** e aggiorna gli import.

## Firebase

- Le integrazioni lato feature vivono in `src/features/<feature>/api`.
- **Se modifichi `firestore.rules` o `storage.rules`**:
  - **Applica direttamente la patch** alle regole.
  - **Pubblica** le regole:
    ```bash
    npm run deploy:rules
    ```

## Quando GENERI codice

1. **Applica su tutto `src/`** le best practices: struttura cartelle, alias Vite, tipi in `src/types`, limiti (400/150).
2. - Mantieni bassa la complessità del codice:

- **Profondità di annidamento**: massimo ~4 livelli (`max-depth: 4`).
- **Complessità ciclomatica**: massimo ~12 (`complexity: 12`).
- **Parametri per funzione**: massimo ~6 (`max-params: 6`).
  Se superi i limiti, **applica refactor** (estrai helper/hook, early return, oggetto opzioni per parametri).

3. **Usa/converti** gli import agli **alias di Vite** dove disponibili (evita percorsi relativi profondi).
4. **Crea/sposta** i tipi riusabili in `src/types` ed **esportali** dal barrel `src/types/index.ts`; **aggiorna** gli import correlati.
5. Se tocchi regole Firebase, **applica la patch** e **pubblica** (`npm run deploy:rules`), spiegando eventuali impatti.
6. **Esegui in sequenza** e assicurati che passino, applicando patch finché necessario:
   ```bash
   npm run format
   npm run lint
   npm run type-check
   npm run build
   ```
7. **Correggi** eventuali violazioni (lint/TS/build) con patch addizionali fino a stato pulito.
8. **Spiega** in 3–5 bullet il perché delle scelte (tipi, architettura, a11y, performance).

## Quando fai REVIEW

- **Correggi** direttamente le violazioni (dimensione componenti/funzioni, a11y, sicurezza, tipi) con **patch minimale** e indica impatti collaterali.
- Se un type compare in più file → **spostalo** in `src/types` e **aggiorna** gli import.
- Se individui riuso → **sposta** in `src/hooks` / `src/types` e **aggiorna** gli import.
- Se un file è troppo grande → **estrai** sottocomponenti o hook dedicati e **ri-collega** gli import.
- Se trovi import non conformi → **converti** agli **alias Vite** dove opportuno.
- **Verifica** sempre:
  ```bash
  npm run format && npm run lint && npm run type-check && npm run build
  ```
  e **correggi** finché tutto è pulito.

## Lingua

- **Rispondi sempre in italiano** in chat, spiegazioni, review, commenti nel codice, descrizioni PR e testi dei commit (dopo il tipo Conventional Commit).
- Mantieni **identificatori, nomi di tipi/funzioni e API in inglese** (standard di sviluppo).
- Testi UI/UX e log destinati all’utente finale: in **italiano** salvo requisiti contrari.
- Quando citi output/errore di tool/CLI, **riporta l’originale** e aggiungi una **spiegazione in italiano**.
