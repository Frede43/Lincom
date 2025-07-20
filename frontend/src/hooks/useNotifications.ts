import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationsAPI } from '@/lib/api'
import { Notification, NotificationSettings, PaginatedResponse } from '@/types/api'
import { toast } from 'sonner'

// Query keys
export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...notificationKeys.lists(), { filters }] as const,
  detail: (id: string) => [...notificationKeys.all, 'detail', id] as const,
  settings: () => [...notificationKeys.all, 'settings'] as const,
  unreadCount: () => [...notificationKeys.all, 'unread-count'] as const,
}

// Hooks pour les notifications
export const useNotifications = (filters?: {
  is_read?: boolean
  notification_type?: string
  page?: number
}) => {
  return useQuery({
    queryKey: notificationKeys.list(filters || {}),
    queryFn: () => notificationsAPI.getAll(filters),
    staleTime: 30 * 1000, // 30 secondes
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 60 * 1000, // Refetch toutes les minutes
  })
}

export const useNotification = (id: string) => {
  return useQuery({
    queryKey: notificationKeys.detail(id),
    queryFn: () => notificationsAPI.getById(id),
    enabled: !!id,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

export const useUnreadNotificationsCount = () => {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: () => notificationsAPI.getUnreadCount(),
    staleTime: 30 * 1000, // 30 secondes
    refetchInterval: 30 * 1000, // Refetch toutes les 30 secondes
  })
}

export const useNotificationSettings = () => {
  return useQuery({
    queryKey: notificationKeys.settings(),
    queryFn: () => notificationsAPI.getSettings(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Mutations pour les notifications
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => notificationsAPI.markAsRead(id),
    onSuccess: (data, id) => {
      // Mettre à jour la notification spécifique
      queryClient.setQueryData(
        notificationKeys.detail(id),
        (old: any) => old ? { ...old, is_read: true } : old
      )

      // Invalider les listes de notifications
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() })
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors du marquage comme lu')
    },
  })
}

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => notificationsAPI.markAllAsRead(),
    onSuccess: () => {
      // Invalider toutes les queries de notifications
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
      
      toast.success('Toutes les notifications ont été marquées comme lues')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors du marquage de toutes les notifications')
    },
  })
}

export const useDeleteNotification = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => notificationsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() })
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() })
      
      toast.success('Notification supprimée')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la suppression de la notification')
    },
  })
}

export const useUpdateNotificationSettings = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (settings: Partial<NotificationSettings>) => 
      notificationsAPI.updateSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.settings() })
      
      toast.success('Paramètres de notification mis à jour')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la mise à jour des paramètres')
    },
  })
}

// Hook personnalisé pour gérer les notifications en temps réel
export const useRealtimeNotifications = () => {
  const queryClient = useQueryClient()

  // Fonction pour ajouter une nouvelle notification
  const addNotification = (notification: Notification) => {
    // Ajouter à la liste des notifications
    queryClient.setQueryData(
      notificationKeys.list({}),
      (old: PaginatedResponse<Notification> | undefined) => {
        if (!old) return old
        return {
          ...old,
          results: [notification, ...old.results],
          count: old.count + 1,
        }
      }
    )

    // Mettre à jour le compteur de non lues
    queryClient.setQueryData(
      notificationKeys.unreadCount(),
      (old: { count: number } | undefined) => {
        if (!old) return { count: 1 }
        return { count: old.count + 1 }
      }
    )

    // Afficher une toast pour les notifications importantes
    if (notification.priority === 'high' || notification.priority === 'urgent') {
      toast.info(notification.title, {
        description: notification.message,
        action: notification.action_url ? {
          label: 'Voir',
          onClick: () => window.location.href = notification.action_url!
        } : undefined,
      })
    }
  }

  // Fonction pour marquer une notification comme lue
  const markAsRead = (notificationId: string) => {
    queryClient.setQueryData(
      notificationKeys.list({}),
      (old: PaginatedResponse<Notification> | undefined) => {
        if (!old) return old
        return {
          ...old,
          results: old.results.map(notification =>
            notification.id === notificationId
              ? { ...notification, is_read: true }
              : notification
          ),
        }
      }
    )

    queryClient.setQueryData(
      notificationKeys.unreadCount(),
      (old: { count: number } | undefined) => {
        if (!old || old.count <= 0) return old
        return { count: old.count - 1 }
      }
    )
  }

  return {
    addNotification,
    markAsRead,
  }
}

// Hook pour filtrer les notifications par type
export const useNotificationsByType = (type: string) => {
  return useNotifications({ notification_type: type })
}

// Hook pour les notifications non lues seulement
export const useUnreadNotifications = () => {
  return useNotifications({ is_read: false })
}
