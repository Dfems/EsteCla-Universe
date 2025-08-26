# Monorepo setup (Lerna + Workspaces)

Workspaces: apps/_, packages/_
Shared tsconfig at tsconfig.base.json with strict rules (noImplicitAny)
Firebase hosting multi-sito: estecla, glufri-travelers

Comandi principali
npm run format:all; npm run lint:all; npm run type-check:all; npm run build:all

Firebase
Creare i site-id e associare i target come da .firebaserc
Deploy per site: firebase deploy --only hosting:estecla | hosting:glufri-travelers
