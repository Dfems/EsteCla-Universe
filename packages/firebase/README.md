# @estecla/firebase

— Italiano —

## A cosa serve
Utilità/SDK wrapper e costanti per integrare Firebase (config, tipi, helper non-React).

## Beginner
- Installazione: npm i @estecla/firebase
- Uso
  - Importa funzioni/oggetti pubblici:
    - import { createFirebaseApp } from '@estecla/firebase'
  - Configura con le variabili .env (VITE_FIREBASE_*)

## Expert
- Scope
  - Layer non-React (initialization helpers, costanti, tipi)
- Separazione
  - Le integrazioni React stanno in @estecla/firebase-react
- Build
  - tsc (composite) → dist

— English —

## What it is
Firebase utilities/wrappers and constants (non‑React layer).

## Beginner
- Install: npm i @estecla/firebase
- Use
  - Import public helpers:
    - import { createFirebaseApp } from '@estecla/firebase'
  - Configure via .env variables (VITE_FIREBASE_*)

## Expert
- Scope
  - Non‑React helpers, constants, types
- Separation
  - React integrations live in @estecla/firebase-react
- Build
  - tsc (composite) → dist

@estecla/firebase profile API

- new: updateUserProfile(current, updates) moves profile edit flow into shared package.
- relies on getServices() init and users.ensureUsernameAvailable.