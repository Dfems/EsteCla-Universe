# Prompt: Migrazione modulare UI/PWA e consolidamento pacchetti (EsteCla-Universe)

Obiettivo: consolidare componenti/hook/API dentro i pacchetti condivisi esistenti (packages/ui, packages/hooks, packages/firebase, packages/types, packages/utils) e creare un nuovo pacchetto PWA riusabile, minimizzando i rischi. Lavorare per piccoli step, con build sempre verde e refactor non-breaking.

Contesto Monorepo
- App target: apps/estecla-universe
- Pacchetti esistenti: packages/{ui,hooks,firebase,types,utils,theme}
- Nuovo pacchetto: packages/pwa
- Bundler: Vite (ESM)

Linee guida di sicurezza
- Commits piccoli e atomici con messaggi chiari. PR incrementali per ciascun livello (Quick → HardCore).
- Dopo ogni commit: eseguire format, lint, type-check e build. Non lasciare il main branch rotto.
- Evitare side effects a livello di modulo nei pacchetti condivisi. Nessun “barrel” root che re-esporta tutto.
- Evitare import dal root di @estecla/ui: usare sotto-path exports (es. @estecla/ui/social).
- Mantenere React/Router/Icon libs come peerDependencies nei pacchetti condivisi.
- Non spostare file che hanno coupling forte con routing o stato applicativo senza prima decouplarli via props/hooks.

Definizione di Done per ogni step
- Build passa: format, lint, type-check, build senza errori.
- Import aggiornati e dead code rimosso dall’app.
- Esportazioni e tipi presenti nel pacchetto corretto, con subpath exports dove previsto.
- Changelog/README nelle cartelle dei pacchetti se l’API pubblica cambia.

Mappa livelli e attività (eseguire in ordine)

Quick
1) Eliminare duplicati hooks
   - Sostituire apps/estecla-universe/src/hooks/useThemeColors.ts con import da packages/hooks.
   - Aggiornare import in tutta l’app e rimuovere file duplicato.
2) Consolidare SDK Firebase
   - Reindirizzare apps/estecla-universe/src/lib/firebase.ts a usare packages/firebase (sdk.ts). Se è duplicato, rimuoverlo.
3) UI minime e innocue
   - Spostare LoadingSpinner in packages/ui/feedback ed esporlo via subpath @estecla/ui/feedback.
   - Spostare BirthdayBadge in packages/ui/social o packages/ui/feedback (in base all’uso) ed esporlo via subpath.
4) Subpath exports + tree-shaking
   - In packages/ui/package.json aggiungere exports per cartella (navigation, social, profile, feedback, forms, layout) e "sideEffects": false.
   - Evitare export dall’index root del package.
5) Guard-rail ESLint
   - Aggiungere regola no-restricted-imports per vietare "@estecla/ui" root in favore dei sotto-path.

Normal
6) PWA base (nuovo pacchetto)
   - Creare packages/pwa con funzioni: registerSW(options), unregisterSW(), clearCaches(patterns), getSWStatus(), listenForUpdates(cb), promptUpdate(). Niente React.
   - Tipi: SWStatus, RegisterOptions, UpdateInfo.
   - README con esempio Vite e scope.
7) ClearCacheButton
   - Rifattorizzare ClearCacheButton in packages/ui/feedback dipendendo da @estecla/pwa (clearCaches). Esportarlo via @estecla/ui/feedback.
8) Hook follow/notifications
   - Spostare useFollow, useFollowCounts, useSuggestedUsers, useUnreadNotifications in packages/hooks. Dipendere da packages/firebase/{follow,notifications}.
   - Aggiornare import nell’app.

Medium
9) ProtectedRoute/WelcomeGate generici
   - Estrarre ProtectedRoute come wrapper generico in packages/utils-router o in packages/ui/navigation (senza coupling ad auth): accetta isAllowed, fallback.
   - WelcomeGate → Gate generico (predicate, fallback), mantenerlo stateless.
10) Navbar
   - Spostare DesktopBar, MobileBar, NavbarDesktop, NavbarMobile in packages/ui/navigation. Parametrizzare via props: items, onNavigate, currentUser.
11) Post UI
   - Spostare PostCard, PostListItem in packages/ui/social. Tipi da packages/types. Callbacks via props (onOpen, onLike...). Niente import diretti da router o store.

Heavy
12) Profilo (API + hooks + UI)
   - API: creare packages/firebase/profile.ts con funzioni oggi in app/features/profile/api.
   - Hooks: useProfile, useProfileCalendar, useProfileViewMode → packages/hooks.
   - UI: EditProfileModal, ProfileHeader, ProfileDetails, ProfilePostGrid, ProfilePostList, ProfileCalendar, ProfileCalendarModal → packages/ui/profile.
   - Esportare via @estecla/ui/profile; aggiornare import nell’app.
13) Code splitting
   - Aggiornare vite config app per manualChunks separando "@estecla/ui/{social,profile,navigation}".
   - Lazy load di blocchi pesanti via React.lazy.

HardCore
14) Auth context condiviso
   - Creare packages/firebase-react (o auth-context) con AuthProvider e useAuth basati su packages/firebase.
   - App consuma solo il provider condiviso. Back-compat dove necessario.
15) Workbox opzionale
   - Integrare Workbox nel pacchetto @estecla/pwa come peer opzionale. Guide per setup in Vite.
16) Test e documentazione
   - Aggiungere test minimi per hooks e componenti migrati; Storybook opzionale per @estecla/ui.

Esecuzione step-by-step (per ciascun task)
- Preparazione
  - Creare branch dedicato per il livello (es. refactor/ui-quick-1).
- Implementazione
  - Spostare/creare file nei pacchetti target mantenendo lo stesso stile/TS config.
  - Aggiornare package.json (exports, sideEffects, peerDependencies) e barrel per cartella.
  - Aggiornare import nell’app e rimuovere file obsoleti.
- Verifica
  - Eseguire format, lint, type-check, build; correggere errori.
- Commit/PR
  - Commit con messaggi chiari e aprire PR con changelog delle API toccate.

Dettagli tecnici chiave
- packages/ui
  - Struttura: src/{primitives,layout,forms,feedback,navigation,social,profile,pages}/
  - Exports esempio: "exports": { "./feedback": { "types": "./dist/feedback/index.d.ts", "import": "./dist/feedback/index.js" }, ... }
  - Niente index.ts root che re-esporta tutto; solo barrel per cartella.
  - package.json: "sideEffects": false; react e react-dom in peerDependencies.
- packages/pwa
  - Nessuna dipendenza da React. API pure e piccole. Documentare limits di scope SW.
- Tree-shaking e splitting
  - Importare solo sotto-path nei consumer. Usare dynamic import/Lazy per blocchi grossi. manualChunks su Vite.

Criteri di rollback
- Ogni step non-breaking. Se build fallisce, ripristinare all’ultimo commit verde.
- Se un componente non è facilmente decouplabile, annullare lo spostamento e aprire issue con blockers.

Deliverables per ciascun livello
- Code diff con file spostati/creati e import aggiornati.
- README aggiornato nei pacchetti toccati.
- Issue/PR checklist spuntata (Build verde, Imports aggiornati, Docs aggiornate).
