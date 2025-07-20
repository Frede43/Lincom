import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { QueryProvider } from './QueryProvider'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'sonner'
import { useAppStore } from '@/store/appStore'
import { useUserStore } from '@/store/userStore'

// Provider pour l'internationalisation
import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n'

// Provider pour les erreurs globales
import { ErrorBoundary } from 'react-error-boundary'

// Composant d'erreur fallback
function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  const { addNotification } = useAppStore()

  React.useEffect(() => {
    // Logger l'erreur
    console.error('Application Error:', error)
    
    // Ajouter une notification d'erreur
    addNotification({
      type: 'error',
      title: 'Erreur inattendue',
      message: 'Une erreur est survenue. L\'équipe technique a été notifiée.',
    })
  }, [error, addNotification])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Oops! Une erreur est survenue
          </h2>
          
          <p className="text-muted-foreground mb-6">
            Nous nous excusons pour ce désagrément. L'équipe technique a été automatiquement notifiée.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={resetErrorBoundary}
              className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Réessayer
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/90 transition-colors"
            >
              Recharger la page
            </button>
          </div>
          
          {import.meta.env.DEV && (
            <details className="mt-6 text-left">
              <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                Détails de l'erreur (développement)
              </summary>
              <pre className="mt-2 p-3 bg-muted rounded text-xs overflow-auto">
                {error.stack}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  )
}

// Provider pour la synchronisation des stores avec l'API
function StoreSync({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useUserStore()
  const { setOnlineStatus, updateLastSyncTime } = useAppStore()

  // Synchroniser l'état de connexion
  React.useEffect(() => {
    const handleOnline = () => setOnlineStatus(true)
    const handleOffline = () => setOnlineStatus(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [setOnlineStatus])

  // Synchroniser les données utilisateur au démarrage
  React.useEffect(() => {
    if (isAuthenticated && user) {
      updateLastSyncTime()
    }
  }, [isAuthenticated, user, updateLastSyncTime])

  return <>{children}</>
}

// Provider pour les raccourcis clavier globaux
function KeyboardShortcuts({ children }: { children: React.ReactNode }) {
  const { setCommandPaletteOpen, setSearchOpen } = useAppStore()

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd/Ctrl + K pour ouvrir la palette de commandes
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        setCommandPaletteOpen(true)
      }
      
      // Cmd/Ctrl + / pour ouvrir la recherche
      if ((event.metaKey || event.ctrlKey) && event.key === '/') {
        event.preventDefault()
        setSearchOpen(true)
      }
      
      // Échap pour fermer les modales
      if (event.key === 'Escape') {
        setCommandPaletteOpen(false)
        setSearchOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [setCommandPaletteOpen, setSearchOpen])

  return <>{children}</>
}

// Provider principal qui combine tous les providers
interface AppProvidersProps {
  children: React.ReactNode
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        // Logger l'erreur pour le monitoring
        console.error('React Error Boundary:', error, errorInfo)
        
        // Ici on pourrait envoyer l'erreur à Sentry ou autre service
        if (import.meta.env.PROD) {
          // Exemple: Sentry.captureException(error, { extra: errorInfo })
        }
      }}
      onReset={() => {
        // Nettoyer l'état si nécessaire lors du reset
        window.location.reload()
      }}
    >
      <BrowserRouter>
        <QueryProvider>
          <I18nextProvider i18n={i18n}>
            <ThemeProvider defaultTheme="system" storageKey="comlab-ui-theme">
              <StoreSync>
                <KeyboardShortcuts>
                  {children}
                  
                  {/* Toaster pour les notifications */}
                  <Toaster
                    position="top-right"
                    expand={true}
                    richColors={true}
                    closeButton={true}
                    toastOptions={{
                      duration: 5000,
                      style: {
                        background: 'hsl(var(--background))',
                        color: 'hsl(var(--foreground))',
                        border: '1px solid hsl(var(--border))',
                      },
                    }}
                  />
                </KeyboardShortcuts>
              </StoreSync>
            </ThemeProvider>
          </I18nextProvider>
        </QueryProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

// Hook pour utiliser les providers dans les composants
export const useAppContext = () => {
  const userStore = useUserStore()
  const appStore = useAppStore()
  
  return {
    // État utilisateur
    user: userStore.user,
    isAuthenticated: userStore.isAuthenticated,
    isLoading: userStore.isLoading,
    
    // État application
    isOnline: appStore.isOnline,
    notifications: appStore.notifications,
    settings: appStore.settings,
    
    // Actions
    addNotification: appStore.addNotification,
    updateSettings: appStore.updateSettings,
  }
}

// Hook pour les raccourcis clavier
export const useKeyboardShortcuts = () => {
  const { commandPaletteOpen, searchOpen, setCommandPaletteOpen, setSearchOpen } = useAppStore()
  
  return {
    commandPaletteOpen,
    searchOpen,
    openCommandPalette: () => setCommandPaletteOpen(true),
    closeCommandPalette: () => setCommandPaletteOpen(false),
    openSearch: () => setSearchOpen(true),
    closeSearch: () => setSearchOpen(false),
  }
}

export default AppProviders
