/// <reference types="vite/client" />

declare module 'vite/client' {
  interface ImportMetaEnv {
    readonly VITE_CLERK_PUBLISHABLE_KEY: string
  }
} 