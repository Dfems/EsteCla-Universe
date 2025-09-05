# EsteCla‑Universe Monorepo

Monorepo multi‑app e multi‑package gestito con npm workspaces + Lerna. Stack: Vite, React, TypeScript 5, ESLint flat, Prettier, Firebase Hosting (multi‑site), Chakra UI.

— Italiano —

## Panoramica
Questo repository contiene:
- apps/
  - estecla-universe
  - glufri-travelers
- packages/
  - ui, hooks, firebase, firebase-react, types, utils, theme, pwa

Ogni package espone un’API pubblica via export maps (da dist) e mantiene i confini interni: non importare dai loro src.

## Per principiante (Beginner)
- Requisiti: Node 18+ (LTS), npm 10+, Git.
- Setup
  1) Clona il repo
  2) npm ci
  3) Copia .env (vedi esempio in root) e compila le variabili
- Sviluppo
  - Se modifichi i packages: in una finestra avvia il watcher dei packages
    - npm run dev:watch
  - Avvia l’app desiderata
    - npm run dev:estecla
    - npm run dev:glufri
- Regole d’oro
  - Import solo da entrypoints pubblici, es: 
    - @estecla/utils, @estecla/types, @estecla/theme, @estecla/firebase, @estecla/firebase-react
    - per UI usa subpath: @estecla/ui/<subpath>
  - Non importare da packages/*/src
  - Esegui i check prima di commit: npm run check

## Per esperto (Expert)
- TypeScript
  - Packages: build composite, outDir dist, declarationMap; tsBuildInfo in node_modules/.tmp
  - Entry points: definiti in "exports" dei package.json
- Tooling
  - ESLint flat centralizzato a root; Prettier centralizzato
  - Scripts root: format, lint, type-check, build, clean, check; deploy:estecla, deploy:glufri
- Apps
  - Vite 6 con import dai package (no alias su src)
  - UI: subpath exports per tree-shaking
- Firebase Hosting (multi‑site)
  - .firebaserc con target: hosting:estecla e hosting:glufri-travelers
  - firebase.json mappa dist delle due app

## Comandi principali
- Sviluppo
  - npm run dev:watch        # build in watch dei packages
  - npm run dev:estecla
  - npm run dev:glufri
- Qualità
  - npm run format
  - npm run lint
  - npm run type-check
  - npm run build
  - npm run check            # tutti i precedenti in sequenza
- Deploy (Firebase)
  - npm run build -w apps/estecla-universe
  - firebase deploy --only hosting:estecla -P estecla-universe
  - npm run build -w apps/glufri-travelers
  - firebase deploy --only hosting:glufri-travelers -P estecla-universe

## Variabili d’ambiente (indicative)
- VITE_FIREBASE_* per configurare SDK Firebase web
- Altre chiavi (Unsplash, ecc.) come da .env di esempio

## Convenzioni
- Strict TS; niente any non necessario
- sideEffects: false nei packages
- Conventional Commits

## Troubleshooting
- Import dai src → errore ESLint: passare agli entrypoints pubblici
- Tipi non trovati → assicurarsi che dev:watch sia attivo o che i packages siano buildati
- Deploy Hosting fallisce → verificare Project ID e Site ID in .firebaserc

## License / Licenza
- Proprietary, permission-required. See `LICENSE` for full terms (IT/EN).
- No use without written permission from the Author (Francisco Esteban Mosquera Sancan, "Dfems").
- PRs must be submitted from a dedicated branch; see `CONTRIBUTING.md`.

— English —

## Overview
This repository hosts:
- apps/
  - estecla-universe
  - glufri-travelers
- packages/
  - ui, hooks, firebase, firebase-react, types, utils, theme, pwa

Each package exposes a public API via export maps (from dist). Do not import from package sources.

## Beginner
- Requirements: Node 18+ (LTS), npm 10+, Git.
- Setup
  1) Clone the repo
  2) npm ci
  3) Copy .env and fill required variables
- Development
  - If you edit packages, run the packages watcher:
    - npm run dev:watch
  - Start your app:
    - npm run dev:estecla
    - npm run dev:glufri
- Golden rules
  - Import only from public entrypoints:
    - @estecla/utils, @estecla/types, @estecla/theme, @estecla/firebase, @estecla/firebase-react
    - UI uses subpaths: @estecla/ui/<subpath>
  - Do not import from packages/*/src
  - Run checks before committing: npm run check

## Expert
- TypeScript
  - Packages: composite builds, outDir dist, declarationMap; tsBuildInfo under node_modules/.tmp
  - Entry points: defined via package.json "exports"
- Tooling
  - Centralized flat ESLint and Prettier at repo root
  - Root scripts: format, lint, type-check, build, clean, check; deploy:estecla, deploy:glufri
- Apps
  - Vite 6, imports resolved via package exports (no src aliases)
  - UI exposes subpath entries for tree-shaking
- Firebase Hosting (multi-site)
  - .firebaserc targets: hosting:estecla and hosting:glufri-travelers
  - firebase.json maps each app’s dist

## Commands
- Development
  - npm run dev:watch
  - npm run dev:estecla
  - npm run dev:glufri
- Quality
  - npm run format
  - npm run lint
  - npm run type-check
  - npm run build
  - npm run check
- Deploy (Firebase)
  - npm run build -w apps/estecla-universe
  - firebase deploy --only hosting:estecla -P estecla-universe
  - npm run build -w apps/glufri-travelers
  - firebase deploy --only hosting:glufri-travelers -P estecla-universe

## License / Licenza
- Proprietary, permission-required. See `LICENSE` for full terms (IT/EN).
- No use without written permission from the Author (Francisco Esteban Mosquera Sancan, "Dfems").
- PRs must be submitted from a dedicated branch; see `CONTRIBUTING.md`.
