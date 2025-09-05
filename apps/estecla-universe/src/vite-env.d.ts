/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WELCOME_INACTIVITY_MS?: string
  readonly VITE_WELCOME_AUTO_CONTINUE_MS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
