/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_RPC_URL?: string
  readonly VITE_NETWORK_TYPE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Node.js process shim for browser
declare const process: {
  env: Record<string, string | undefined>
  browser: boolean
}
