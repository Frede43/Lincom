import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// Types pour l'état de l'application
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system'
  language: 'fr' | 'en' | 'rn'
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
    marketing: boolean
  }
  privacy: {
    profileVisibility: 'public' | 'private' | 'members'
    showOnlineStatus: boolean
    allowDirectMessages: boolean
  }
  accessibility: {
    reducedMotion: boolean
    highContrast: boolean
    fontSize: 'small' | 'medium' | 'large'
  }
}

interface AppState {
  // État UI
  sidebarOpen: boolean
  mobileMenuOpen: boolean
  searchOpen: boolean
  commandPaletteOpen: boolean
  
  // Notifications
  notifications: Notification[]
  unreadCount: number
  
  // Paramètres
  settings: AppSettings
  
  // État de connexion
  isOnline: boolean
  lastSyncTime: Date | null
  
  // Actions UI
  setSidebarOpen: (open: boolean) => void
  setMobileMenuOpen: (open: boolean) => void
  setSearchOpen: (open: boolean) => void
  setCommandPaletteOpen: (open: boolean) => void
  toggleSidebar: () => void
  
  // Actions notifications
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
  
  // Actions paramètres
  updateSettings: (settings: Partial<AppSettings>) => void
  resetSettings: () => void
  
  // Actions connexion
  setOnlineStatus: (online: boolean) => void
  updateLastSyncTime: () => void
}

// Paramètres par défaut
const defaultSettings: AppSettings = {
  theme: 'system',
  language: 'fr',
  notifications: {
    email: true,
    push: true,
    sms: false,
    marketing: false,
  },
  privacy: {
    profileVisibility: 'members',
    showOnlineStatus: true,
    allowDirectMessages: true,
  },
  accessibility: {
    reducedMotion: false,
    highContrast: false,
    fontSize: 'medium',
  },
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // État initial UI
      sidebarOpen: true,
      mobileMenuOpen: false,
      searchOpen: false,
      commandPaletteOpen: false,
      
      // État initial notifications
      notifications: [],
      unreadCount: 0,
      
      // Paramètres par défaut
      settings: defaultSettings,
      
      // État de connexion
      isOnline: navigator.onLine,
      lastSyncTime: null,
      
      // Actions UI
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
      setSearchOpen: (open) => set({ searchOpen: open }),
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      
      // Actions notifications
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: crypto.randomUUID(),
          timestamp: new Date(),
          read: false,
        }
        
        set((state) => ({
          notifications: [newNotification, ...state.notifications].slice(0, 50), // Garder max 50
          unreadCount: state.unreadCount + 1,
        }))
      },
      
      markNotificationRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((notif) =>
            notif.id === id ? { ...notif, read: true } : notif
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        }))
      },
      
      markAllNotificationsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((notif) => ({ ...notif, read: true })),
          unreadCount: 0,
        }))
      },
      
      removeNotification: (id) => {
        set((state) => {
          const notification = state.notifications.find((n) => n.id === id)
          const wasUnread = notification && !notification.read
          
          return {
            notifications: state.notifications.filter((notif) => notif.id !== id),
            unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
          }
        })
      },
      
      clearNotifications: () => {
        set({ notifications: [], unreadCount: 0 })
      },
      
      // Actions paramètres
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }))
      },
      
      resetSettings: () => {
        set({ settings: defaultSettings })
      },
      
      // Actions connexion
      setOnlineStatus: (online) => {
        set({ isOnline: online })
      },
      
      updateLastSyncTime: () => {
        set({ lastSyncTime: new Date() })
      },
    }),
    {
      name: 'comlab-app-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        settings: state.settings,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
)

// Hook pour écouter les changements de connexion
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    useAppStore.getState().setOnlineStatus(true)
  })
  
  window.addEventListener('offline', () => {
    useAppStore.getState().setOnlineStatus(false)
  })
}

// Sélecteurs utiles
export const useNotifications = () => {
  const { notifications, unreadCount, addNotification, markNotificationRead, markAllNotificationsRead, removeNotification, clearNotifications } = useAppStore()
  
  return {
    notifications,
    unreadCount,
    addNotification,
    markNotificationRead,
    markAllNotificationsRead,
    removeNotification,
    clearNotifications,
  }
}

export const useSettings = () => {
  const { settings, updateSettings, resetSettings } = useAppStore()
  
  return {
    settings,
    updateSettings,
    resetSettings,
  }
}

export const useUIState = () => {
  const { 
    sidebarOpen, 
    mobileMenuOpen, 
    searchOpen, 
    commandPaletteOpen,
    setSidebarOpen,
    setMobileMenuOpen,
    setSearchOpen,
    setCommandPaletteOpen,
    toggleSidebar
  } = useAppStore()
  
  return {
    sidebarOpen,
    mobileMenuOpen,
    searchOpen,
    commandPaletteOpen,
    setSidebarOpen,
    setMobileMenuOpen,
    setSearchOpen,
    setCommandPaletteOpen,
    toggleSidebar,
  }
}
