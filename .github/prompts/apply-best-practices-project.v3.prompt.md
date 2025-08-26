---
mode: 'agent'
description: 'Applica le best practices a TUTTO il progetto: FSD, alias, tipi condivisi, split componenti, niente React.FC, niente console.log, no any, hosting multisito'
---

> Rispondi e commenta **sempre in italiano**.

**Obiettivo:** porta **tutto `src/`** allo standard definito in `.github/copilot-instructions.v3.md` (se assente, usa `.github/copilot-instructions.md`). Copertura **totale**, non solo file “più critici”.

### Istruzioni operative (lotto per lotto)
1. **Mappa `src/`** e individua violazioni:
   - struttura FSD (file nei folder sbagliati),
   - import relativi profondi (→ **converti ad alias**),
   - uso `React.FC` (→ **rimuovi**),
   - componenti/funzioni troppo grandi (→ **estrai** in file dedicati),
   - tipi duplicati locali (→ sposta in `@types` + barrel), **`any` espliciti o impliciti** (→ rimuovi/converti con `unknown` + guardie o generics),
   - `console.log` (→ **sostituisci** con `console.warn/error` o `logger`),
   - magic numbers / Chakra tokens non usati,
   - `useEffect` con deps errate o superfluo,
   - mancanza `import type` per i soli tipi.
2. **Applica patch** organizzate per lotti (es. “Lotto 1: features/feed/*”). Per ogni lotto:
   - Sposta/crea file rispettando FSD.
   - Aggiorna tutti gli import agli **alias**.
   - Estrai sottocomponenti/hook in file separati (un componente principale per file).
   - Sposta tipi riusabili in `packages/types` (se monorepo) o `src/types` (se single app) e aggiorna **barrel**.
3. **Esegui** dopo **ogni modifica e ogni lotto**:
   ```bash
   npm run format && npm run lint
   ```
   I comandi **devono passare senza errori**; applica patch finché il lint è pulito.
4. A copertura completa, **verifica**:
   ```bash
   npm run type-check && npm run build
   ```
   Entrambi **devono passare senza errori**. Applica patch finché tornano verdi.
5. **Consegna finale**:
   - elenco file toccati per lotto,
   - patch principali (diff riassuntivo),
   - esito comandi (`lint/type-check/build`) **OK**,
   - sintesi decisioni (3–5 bullet: tipi/architettura/a11y/performance).

**Note:**
- Se il repo è monorepo, usa `@ui`, `@hooks`, `@types`, `@firebase`, `@utils`, `@theme` per i riusi. In caso contrario, usa `src/hooks`, `src/types`, `src/components` locali.
- **Naming Firebase:** in `firebase/` usa **solo `kebab-case`** per cartelle/file (rules/indexes/emulators/seed/snapshots/script) e **correggi** eventuali nomi non conformi.
- **Firebase Hosting (progetto unico + multisito):** verifica `.firebaserc` e `firebase.json` per i target `estecla` e `glufri-travelers`. Se mancano, proponi/crea la config e istruisci sulla creazione dei **site-id** via CLI o Console.
