---
mode: 'agent'
description: 'Adegua il codice alle Best Practices del repo (feature-sliced)'
---

Leggi `.github/copilot-instructions.md` e sul codice selezionato (o file corrente):

1. Elenca violazioni (dimensione/complessità, architettura feature-sliced, a11y/sicurezza).
2. Proponi **patch minima** conforme a ESLint/Prettier.
3. Indica eventuali **estrazioni** (subcomponenti/hook) e i percorsi consigliati.
4. Se trovi tipi riusabili → crea/sposta in `src/types` e aggiorna gli import (usa `src/types/index.ts` come barrel).
5. Riassumi il perché delle modifiche in 3–5 bullet.
