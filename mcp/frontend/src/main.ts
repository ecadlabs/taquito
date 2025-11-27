// Polyfills for Node.js globals (required by Beacon SDK / Taquito)
import { Buffer } from 'buffer'
globalThis.Buffer = Buffer
// @ts-expect-error - process shim for browser
globalThis.process = globalThis.process || { env: {}, browser: true }

import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'

// Create and mount the Vue application
createApp(App).mount('#app')
