---
mode: 'agent'
description: 'Adegua il file selezionato alle Best Practices (FSD, TypeScript, Chakra, performance, a11y, no-any)'
---

> Rispondi **sempre in italiano** e applica patch **minimali ma complete**.

1) **Analisi rapida del file corrente**
- Elenca violazioni: `React.FC`, import relativi profondi, dimensione componenti (>~400) o funzioni (>~150), **presenza di `any` (espliciti o impliciti)**, `console.log`, assenza `import type`, magic numbers (Chakra), problemi a11y (alt, role, keyboard), chiavi instabili, deps `useEffect` non corrette.

2) **Patch minima proposta**
- Sostituisci `React.FC` → function component tipizzato con `type Props`.
- Converte import relativi in **alias Vite**.
- Estrai sottocomponenti/hook in **file separati** (indica percorsi FSD consigliati).
- Sostituisci `console.log` con `console.warn/error` o `logger`.
- Applica token tema Chakra al posto di valori raw.
- Tipi riusabili → sposta in `src/types` o `@types` e **aggiorna barrel**.
- Se tocchi file/cartelle in `firebase/`, **rinomina** in `kebab-case` (rules/indexes/emulators/seed/snapshots/script).

3) **Refactor tecnico**
- Usa `import type` per i soli tipi.
- Ottimizza deps di `useEffect` / `useCallback` / `useMemo`.
- Preferisci **named exports**.
- Aggiungi test snapshot minimi se il componente è UI-critico (facoltativo).

4) **Consegna**
- Diff sintetico (o snippet) della patch.
- Percorsi di nuovi file (FSD).
- Commit message consigliato (Conventional Commit, italiano).
- **Esegui e riporta l’esito**: `npm run format && npm run lint && npm run type-check && npm run build` → **nessun errore**.

> Consulta `.github/copilot-instructions.v3.md` come fonte normativa principale; se assente, usa `.github/copilot-instructions.md`.
