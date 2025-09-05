Firebase configuration and Functions

- Rules: `firebase/rules/*.rules`
- Indexes: `firebase/indexes/*.json`
- Cloud Functions (Node 22, v2 API): `firebase/functions`

Commands (from `firebase/functions`):

- Build: `npm run build`
- Emulators (functions only): `npm run serve`
- Shell: `npm run shell`
- Deploy: `npm run deploy`

The root `firebase.json` points functions `source` to `firebase/functions`.

# Firebase workspace

- Regole, indici, emulator, seed vanno qui (kebab-case)
- Hosting multi-sito configurato in firebase.json e .firebaserc
