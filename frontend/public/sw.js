// Service Worker pour Community Laboratory Burundi
const CACHE_NAME = 'comlab-v1.0.0'
const STATIC_CACHE = 'comlab-static-v1.0.0'
const DYNAMIC_CACHE = 'comlab-dynamic-v1.0.0'

// Ressources à mettre en cache immédiatement
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/offline.html',
  // Les assets seront ajoutés automatiquement par Vite
]

// Stratégies de cache
const CACHE_STRATEGIES = {
  // Cache First - pour les assets statiques
  CACHE_FIRST: 'cache-first',
  // Network First - pour les données dynamiques
  NETWORK_FIRST: 'network-first',
  // Stale While Revalidate - pour les ressources semi-statiques
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
}

// Configuration des routes
const ROUTE_CONFIG = [
  {
    pattern: /^https:\/\/api\.comlab\.bi\/api\/courses\//,
    strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
    cacheName: 'courses-cache',
  },
  {
    pattern: /^https:\/\/api\.comlab\.bi\/api\/projects\//,
    strategy: CACHE_STRATEGIES.NETWORK_FIRST,
    cacheName: 'projects-cache',
  },
  {
    pattern: /\.(js|css|woff2?|png|jpg|jpeg|svg|ico)$/,
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    cacheName: STATIC_CACHE,
  },
]

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('📦 Service Worker: Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('✅ Service Worker: Installation complete')
        return self.skipWaiting()
      })
  )
})

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activating...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Supprimer les anciens caches
            if (cacheName !== CACHE_NAME && 
                cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE) {
              console.log('🗑️ Service Worker: Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('✅ Service Worker: Activation complete')
        return self.clients.claim()
      })
  )
})

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Ignorer les requêtes non-HTTP
  if (!request.url.startsWith('http')) {
    return
  }

  // Trouver la stratégie appropriée
  const routeConfig = ROUTE_CONFIG.find(config => 
    config.pattern.test(request.url)
  )

  if (routeConfig) {
    event.respondWith(
      handleRequest(request, routeConfig.strategy, routeConfig.cacheName)
    )
  } else {
    // Stratégie par défaut pour les pages
    event.respondWith(
      handlePageRequest(request)
    )
  }
})

// Gestion des requêtes selon la stratégie
async function handleRequest(request, strategy, cacheName) {
  const cache = await caches.open(cacheName || DYNAMIC_CACHE)

  switch (strategy) {
    case CACHE_STRATEGIES.CACHE_FIRST:
      return cacheFirst(request, cache)
    
    case CACHE_STRATEGIES.NETWORK_FIRST:
      return networkFirst(request, cache)
    
    case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
      return staleWhileRevalidate(request, cache)
    
    default:
      return fetch(request)
  }
}

// Cache First - pour les assets statiques
async function cacheFirst(request, cache) {
  const cachedResponse = await cache.match(request)
  
  if (cachedResponse) {
    return cachedResponse
  }

  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    console.error('Cache First failed:', error)
    throw error
  }
}

// Network First - pour les données dynamiques
async function networkFirst(request, cache) {
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    console.log('Network failed, trying cache:', error)
    const cachedResponse = await cache.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    throw error
  }
}

// Stale While Revalidate - pour les ressources semi-statiques
async function staleWhileRevalidate(request, cache) {
  const cachedResponse = await cache.match(request)
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  }).catch(() => {
    // Ignorer les erreurs réseau en arrière-plan
  })

  return cachedResponse || fetchPromise
}

// Gestion spéciale pour les pages
async function handlePageRequest(request) {
  try {
    return await fetch(request)
  } catch (error) {
    // Si la requête échoue, servir la page offline
    if (request.mode === 'navigate') {
      const cache = await caches.open(STATIC_CACHE)
      return cache.match('/offline.html')
    }
    throw error
  }
}

// Gestion des messages du client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME })
  }
})

// Synchronisation en arrière-plan
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  // Synchroniser les données en attente
  console.log('🔄 Background sync triggered')
  
  // Ici, on pourrait synchroniser les données offline
  // comme les formulaires sauvegardés, les analytics, etc.
}

// Notifications push
self.addEventListener('push', (event) => {
  if (!event.data) return

  const data = event.data.json()
  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    data: data.data,
    actions: data.actions || [],
    requireInteraction: data.requireInteraction || false,
  }

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const urlToOpen = event.notification.data?.url || '/'

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Chercher une fenêtre ouverte avec l'URL
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus()
        }
      }
      
      // Ouvrir une nouvelle fenêtre
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen)
      }
    })
  )
})
