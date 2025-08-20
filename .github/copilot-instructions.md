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
- **React 19 + Chakra**
  - Componenti funzionali + hooks; niente side-effect nel render.
  - Componenti piccoli (~≤200 righe) e funzioni brevi (~≤75 righe).
  - Estrai sottocomponenti/hook se >5 props o JSX troppo annidato.
  - Usa token del tema (no “magic numbers” inline).
- **Routing**
  - Rotte modulari in `src/routes`; lazy per pagine pesanti.
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

## Quando **generi** codice

1. Conforma a ESLint/Prettier del repo; se violi regole, proponi **patch**.
2. Mantieni dimensione/complessità entro i limiti; se serve, proponi **estrazioni** (subcomponenti/hook) e indica percorso file.
3. Crea tipi riusabili direttamente in `src/types` ed esportali dal barrel `src/types/index.ts`.
4. Spiega in 3–5 bullet _perché_ (tipi, architettura, a11y, performance).

## Quando fai **review**

- Evidenzia violazioni (dimensione/complessità, architettura, a11y, sicurezza, tipi).
- Proponi **patch minima** + impatti collaterali.
- Suggerisci spostamento in `src/hooks` / `src/types` quando individui riuso.
