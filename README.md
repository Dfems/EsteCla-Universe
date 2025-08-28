# EsteCla‑Universe Monorepo

Multi-app, multi-package monorepo managed with npm workspaces + Lerna. Tech stack: Vite, React, TypeScript 5, ESLint flat, Prettier, Firebase Hosting (multi-site), Chakra UI.

## Structure

- apps/
  - estecla-universe
  - glufri-travelers
- packages/
  - ui, hooks, firebase, firebase-react, types, utils, theme, pwa, config-eslint, config-prettier

Each package builds to dist and exports from dist using export maps. UI exposes only subpath entrypoints like `@estecla/ui/feedback`.

## Scripts (root)

- dev:estecla – run dev server for EsteCla app
- dev:glufri – run dev server for Glufri app
- format:all – run Prettier in all workspaces
- lint:all – run ESLint in all workspaces
- type-check:all – run TypeScript checks across workspaces
- build:all – build apps and packages
- clean – remove generated artifacts and node_modules
- check – format + lint + type-check + build

## Conventions

- No imports from package sources. Use public exports only, e.g. `@estecla/ui/<subpath>`.
- `sideEffects: false` in packages to enable tree-shaking.
- No `any` added; strict TS and shared ESLint flat config in every workspace.
- Commit messages follow Conventional Commits.

## Firebase Hosting (multi-site)

`firebase.json` defines two sites:

- hosting:estecla -> apps/estecla-universe/dist
- hosting:glufri-travelers -> apps/glufri-travelers/dist

Deploy examples:

```
npm run build -w apps/estecla-universe && firebase deploy --only hosting:estecla
npm run build -w apps/glufri-travelers && firebase deploy --only hosting:glufri-travelers
```

## UI package usage

Always import from subpaths, e.g.: `import { LoadingSpinner } from '@estecla/ui/feedback'`.

## Development

1. npm ci
2. npm run check
3. npm run dev:estecla or npm run dev:glufri

## CI

GitHub Actions runs format, lint, type-check, build on every push/PR.
