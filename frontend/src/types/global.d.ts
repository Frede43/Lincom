// Types globaux pour Community Laboratory Burundi

/// <reference types="vite/client" />
/// <reference types="vitest/globals" />

// Variables d'environnement Vite
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_WS_URL: string
  readonly VITE_MEDIA_URL: string
  readonly VITE_NODE_ENV: string
  readonly VITE_APP_VERSION: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ENABLE_PWA: string
  readonly VITE_ENABLE_NOTIFICATIONS: string
  readonly VITE_ENABLE_OFFLINE_MODE: string
  readonly VITE_GOOGLE_ANALYTICS_ID: string
  readonly VITE_SENTRY_DSN: string
  readonly VITE_STRIPE_PUBLIC_KEY: string
  readonly VITE_CSP_ENABLED: string
  readonly VITE_RATE_LIMIT_ENABLED: string
  readonly VITE_DEBUG_MODE: string
  readonly VITE_MOCK_API: string
  readonly VITE_DEFAULT_LANGUAGE: string
  readonly VITE_SUPPORTED_LANGUAGES: string
  readonly VITE_MAX_FILE_SIZE: string
  readonly VITE_ALLOWED_FILE_TYPES: string
  readonly VITE_GOOGLE_CLIENT_ID: string
  readonly VITE_LINKEDIN_CLIENT_ID: string
  readonly VITE_MAPBOX_TOKEN: string
  readonly VITE_CONTACT_EMAIL: string
  readonly VITE_SUPPORT_EMAIL: string
  readonly VITE_ORG_NAME: string
  readonly VITE_ORG_ADDRESS: string
  readonly VITE_ORG_PHONE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Extensions globales pour les tests
declare global {
  // Mock des APIs du navigateur pour les tests
  interface Window {
    matchMedia: (query: string) => MediaQueryList
  }

  // Types pour les Web APIs mockées
  interface IntersectionObserver {
    observe: (target: Element) => void
    unobserve: (target: Element) => void
    disconnect: () => void
  }

  interface ResizeObserver {
    observe: (target: Element) => void
    unobserve: (target: Element) => void
    disconnect: () => void
  }

  // Service Worker types
  interface ServiceWorkerGlobalScope {
    skipWaiting(): Promise<void>
  }

  // Notification API
  interface NotificationOptions {
    body?: string
    icon?: string
    badge?: string
    data?: any
    actions?: NotificationAction[]
    requireInteraction?: boolean
  }

  interface NotificationAction {
    action: string
    title: string
    icon?: string
  }
}

// Types pour les modules CSS
declare module '*.module.css' {
  const classes: { [key: string]: string }
  export default classes
}

declare module '*.module.scss' {
  const classes: { [key: string]: string }
  export default classes
}

// Types pour les assets
declare module '*.svg' {
  import React = require('react')
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>
  const src: string
  export default src
}

declare module '*.png' {
  const src: string
  export default src
}

declare module '*.jpg' {
  const src: string
  export default src
}

declare module '*.jpeg' {
  const src: string
  export default src
}

declare module '*.gif' {
  const src: string
  export default src
}

declare module '*.webp' {
  const src: string
  export default src
}

// Types pour les Web Workers
declare module '*.worker.ts' {
  class WebpackWorker extends Worker {
    constructor()
  }
  export default WebpackWorker
}

// Types pour les fichiers JSON
declare module '*.json' {
  const value: any
  export default value
}

// Extension des types React pour les props personnalisées
declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // Attributs personnalisés pour l'analytics
    'data-analytics-event'?: string
    'data-analytics-category'?: string
    'data-analytics-label'?: string
  }
}

// Types pour les librairies externes sans types
declare module 'lovable-tagger' {
  export function tagElement(element: HTMLElement, tag: string): void
  export function removeTag(element: HTMLElement, tag: string): void
}

// Types pour les APIs expérimentales
interface Navigator {
  // Web Share API
  share?: (data: ShareData) => Promise<void>
  canShare?: (data: ShareData) => boolean
  
  // Permissions API
  permissions?: Permissions
  
  // Network Information API
  connection?: NetworkInformation
}

interface ShareData {
  title?: string
  text?: string
  url?: string
  files?: File[]
}

interface NetworkInformation {
  effectiveType: 'slow-2g' | '2g' | '3g' | '4g'
  downlink: number
  rtt: number
  saveData: boolean
}

// Types pour les Custom Elements
declare namespace JSX {
  interface IntrinsicElements {
    'comlab-widget': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
  }
}

export {}
