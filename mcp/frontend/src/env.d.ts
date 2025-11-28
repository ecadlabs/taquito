/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.tz?raw' {
  const content: string
  export default content
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
