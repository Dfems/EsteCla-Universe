# @estecla/ui

— Italiano —

## A cosa serve
Libreria di componenti UI condivisi, pensata per essere tree-shakeable. Esporta solo entrypoint a sottopercorso.

## Beginner
- Installazione
  - Monorepo: aggiungi @estecla/ui alle dipendenze dell’app
  - Esterno: npm i @estecla/ui
- Import
  - Importa dai subpath pubblici:
    - import { LoadingSpinner } from '@estecla/ui/feedback'
    - import { ButtonX } from '@estecla/ui/buttons'
- Regole
  - Non importare da src o percorsi profondi non documentati

## Expert
- Design system
  - Componenti tipizzati, sideEffects: false per tree-shaking
- API surface
  - Solo subpath in package.json "exports"
- Build
  - tsc (composite) → dist; dichiarazioni .d.ts emesse
- Consistenza
  - Seguire le linee guida di naming, props stabili, no breaking senza semver

— English —

## What it is
Shared UI components library. Tree-shakeable. Exposes only subpath entrypoints.

## Beginner
- Install
  - In monorepo: add @estecla/ui to your app dependencies
  - External: npm i @estecla/ui
- Import
  - Use subpaths:
    - import { LoadingSpinner } from '@estecla/ui/feedback'
    - import { ButtonX } from '@estecla/ui/buttons'
- Rules
  - Do not import from src or undocumented deep paths

## Expert
- Design system
  - Strongly typed components, sideEffects: false
- API surface
  - Subpath-only entries via package.json "exports"
- Build
  - tsc (composite) → dist; .d.ts emitted
- Consistency
  - Follow naming and prop stability; avoid breaking changes