# @estecla/pwa

— Italiano —

## A cosa serve
Helper per Progressive Web App (registrazione SW, update flow). Peer dependency: workbox-window.

## Beginner
- Installazione
  - npm i @estecla/pwa
  - npm i -D workbox-window
- Uso rapido
  - import { registerPWA } from '@estecla/pwa'
- Note tipi
  - "types" punta a ./src/index.d.ts; "import" a ./dist/index.js

## Expert
- Architettura
  - Wrapper leggero sopra Workbox (senza lock-in)
- Peer deps
  - workbox-window >= 7 come peer opzionale
- Build
  - tsc (composite) → dist

— English —

## What it is
PWA helpers (SW registration, update flow). Peer dep: workbox-window.

## Beginner
- Install
  - npm i @estecla/pwa
  - npm i -D workbox-window
- Quick use
  - import { registerPWA } from '@estecla/pwa'
- Types note
  - "types" points to ./src/index.d.ts; "import" to ./dist/index.js

## Expert
- Architecture
  - Thin wrapper on top of Workbox (no lock‑in)
- Peer deps
  - workbox-window >= 7 as optional peer
- Build
  - tsc (composite) → dist
