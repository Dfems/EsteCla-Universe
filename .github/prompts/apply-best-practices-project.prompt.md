---
mode: 'agent'
description: 'Applica best practices a TUTTO src/, converte import con alias Vite, pulisce lint e verifica build'
---

Obiettivo: applica le best practices del repo **a tutto `src/`** (non solo ai file più critici) e assicurati che **format, lint, type-check e build** vadano a buon fine.

Istruzioni operative:

1. Scansiona `src/` e **APPLICA** le regole di `.github/copilot-instructions.md`:
   - struttura feature-sliced (sposta/crea file dove corretto),
   - alias Vite (CONVERTI import relativi in alias),
   - tipi riusabili in `src/types` (aggiorna import + barrel),
   - limiti 400/150 con estrazioni mirate.
2. Lavora **per lotti** se necessario: elenca il lotto → APPLICA patch → passa al lotto successivo fino a copertura completa.
3. Dopo ogni lotto **ESEGUI**:
   ```bash
   npm run format
   npm run lint
   ```
   Se emergono errori/warning bloccanti, **APPLICA patch** e ripeti fino a lint pulito.
4. A copertura completa **ESEGUI**:
   ```bash
   npm run type-check
   npm run build
   ```
   Se falliscono, **APPLICA patch** e ripeti finché passano.
5. Consegna:
   - elenco file toccati per lotto,
   - patch finali,
   - esito finale dei comandi (`lint/type-check/build`) con stato **OK**.
