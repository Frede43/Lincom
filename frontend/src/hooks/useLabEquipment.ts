import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAppStore } from '@/store/appStore'

const API_BASE_URL = 'http://localhost:8000/api/lab-equipment'

// Types basés sur l'API Django réelle
export interface EquipmentCategory {
  id: number
  name: string
  category_type: string
  description: string
  icon: string
  color: string
  requires_training: boolean
  safety_level: string
  equipment_count: number
  created_at: string
}

export interface Equipment {
  id: number
  name: string
  description: string
  brand: string
  model: string
  serial_number: string
  specifications: any
  status: string
  condition: string
  location: string
  qr_code?: string
  purchase_date: string
  purchase_price: string
  warranty_expiry?: string
  last_maintenance?: string
  next_maintenance?: string
  maintenance_interval_days: number
  manual_url?: string
  training_materials?: string
  safety_instructions?: string
  image?: string
  total_usage_hours: number
  total_reservations: number
  created_at: string
  updated_at: string
  responsible_person: number
  category: number
  category_name?: string
  category_color?: string
  is_available: boolean
  needs_maintenance: boolean
  current_reservation?: any
  recent_reservations?: any[]
  maintenance_history?: any[]
  usage_stats?: any
}

export interface EquipmentReservation {
  id: number
  equipment: number
  user: number
  start_time: string
  end_time: string
  purpose: string
  status: string
  notes?: string
  created_at: string
  updated_at: string
}

// API functions
const labEquipmentAPI = {
  // Categories
  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/categories/`)
    if (!response.ok) throw new Error('Failed to fetch categories')
    const data = await response.json()
    return Array.isArray(data) ? data : data.results || []
  },

  // Equipment
  getEquipment: async (params?: any) => {
    const url = new URL(`${API_BASE_URL}/equipment/`)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, String(value))
      })
    }
    const response = await fetch(url.toString())
    if (!response.ok) throw new Error('Failed to fetch equipment')
    const data = await response.json()
    return Array.isArray(data) ? data : data.results || []
  },

  getEquipmentById: async (equipmentId: string) => {
    const response = await fetch(`${API_BASE_URL}/equipment/${equipmentId}/`)
    if (!response.ok) throw new Error('Failed to fetch equipment')
    return response.json()
  },

  getAvailableEquipment: async () => {
    const response = await fetch(`${API_BASE_URL}/equipment/available/`)
    if (!response.ok) throw new Error('Failed to fetch available equipment')
    const data = await response.json()
    return Array.isArray(data) ? data : data.results || []
  },

  getEquipmentStats: async () => {
    const response = await fetch(`${API_BASE_URL}/equipment/stats/`)
    if (!response.ok) throw new Error('Failed to fetch equipment stats')
    return response.json()
  },

  // Reservations (nécessitent authentification)
  getReservations: async (params?: any) => {
    const url = new URL(`${API_BASE_URL}/reservations/`)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, String(value))
      })
    }
    const response = await fetch(url.toString())
    if (!response.ok) throw new Error('Failed to fetch reservations')
    const data = await response.json()
    return Array.isArray(data) ? data : data.results || []
  },

  createReservation: async (reservationData: Partial<EquipmentReservation>) => {
    const response = await fetch(`${API_BASE_URL}/reservations/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservationData),
    })
    if (!response.ok) throw new Error('Failed to create reservation')
    return response.json()
  }
}

// Hooks pour les catégories
export const useEquipmentCategories = () => {
  return useQuery({
    queryKey: ['equipment-categories'],
    queryFn: labEquipmentAPI.getCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hooks pour les équipements
export const useEquipment = (params?: {
  category?: string
  status?: string
  condition?: string
  location?: string
  search?: string
}) => {
  return useQuery({
    queryKey: ['equipment', params],
    queryFn: () => labEquipmentAPI.getEquipment(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useEquipmentDetail = (equipmentId: string) => {
  return useQuery({
    queryKey: ['equipment', equipmentId],
    queryFn: () => labEquipmentAPI.getEquipmentById(equipmentId),
    enabled: !!equipmentId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useAvailableEquipment = () => {
  return useQuery({
    queryKey: ['equipment', 'available'],
    queryFn: labEquipmentAPI.getAvailableEquipment,
    staleTime: 2 * 60 * 1000, // 2 minutes (plus fréquent car la disponibilité change)
  })
}

export const useEquipmentStats = () => {
  return useQuery({
    queryKey: ['equipment', 'stats'],
    queryFn: labEquipmentAPI.getEquipmentStats,
    staleTime: 15 * 60 * 1000, // 15 minutes
  })
}

// Hooks pour les réservations
export const useReservations = (params?: {
  equipment?: string
  status?: string
  user?: string
}) => {
  return useQuery({
    queryKey: ['reservations', params],
    queryFn: () => labEquipmentAPI.getReservations(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useCreateReservation = () => {
  const queryClient = useQueryClient()
  const { addNotification } = useAppStore()

  return useMutation({
    mutationFn: labEquipmentAPI.createReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] })
      queryClient.invalidateQueries({ queryKey: ['equipment'] })
      addNotification({
        type: 'success',
        title: 'Réservation créée !',
        message: 'Votre réservation a été enregistrée avec succès.',
      })
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Erreur de réservation',
        message: 'Impossible de créer la réservation',
      })
    },
  })
}

// Utilitaires
export const labEquipmentUtils = {
  // Obtenir le label du statut
  getStatusLabel: (status: string): string => {
    const statuses: Record<string, string> = {
      'available': 'Disponible',
      'in_use': 'En cours d\'utilisation',
      'maintenance': 'En maintenance',
      'out_of_order': 'Hors service',
      'reserved': 'Réservé'
    }
    return statuses[status] || status
  },

  // Obtenir la couleur du statut
  getStatusColor: (status: string): string => {
    const colors: Record<string, string> = {
      'available': 'green',
      'in_use': 'blue',
      'maintenance': 'yellow',
      'out_of_order': 'red',
      'reserved': 'orange'
    }
    return colors[status] || 'gray'
  },

  // Obtenir le label de la condition
  getConditionLabel: (condition: string): string => {
    const conditions: Record<string, string> = {
      'excellent': 'Excellent',
      'good': 'Bon',
      'fair': 'Correct',
      'poor': 'Mauvais',
      'needs_repair': 'Nécessite réparation'
    }
    return conditions[condition] || condition
  },

  // Obtenir la couleur de la condition
  getConditionColor: (condition: string): string => {
    const colors: Record<string, string> = {
      'excellent': 'green',
      'good': 'blue',
      'fair': 'yellow',
      'poor': 'orange',
      'needs_repair': 'red'
    }
    return colors[condition] || 'gray'
  },

  // Obtenir le label du niveau de sécurité
  getSafetyLevelLabel: (level: string): string => {
    const levels: Record<string, string> = {
      'low': 'Faible',
      'medium': 'Moyen',
      'high': 'Élevé',
      'critical': 'Critique'
    }
    return levels[level] || level
  },

  // Formater les heures d'utilisation
  formatUsageHours: (hours: number): string => {
    if (hours < 1) {
      return `${Math.round(hours * 60)} min`
    } else if (hours < 24) {
      return `${hours.toFixed(1)}h`
    } else {
      const days = Math.floor(hours / 24)
      const remainingHours = hours % 24
      return `${days}j ${remainingHours.toFixed(1)}h`
    }
  },

  // Calculer les jours jusqu'à la prochaine maintenance
  getDaysUntilMaintenance: (nextMaintenance: string): number => {
    const next = new Date(nextMaintenance)
    const now = new Date()
    const diffTime = next.getTime() - now.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  },

  // Vérifier si l'équipement nécessite une formation
  requiresTraining: (equipment: Equipment, categories: EquipmentCategory[]): boolean => {
    const category = categories.find(cat => cat.id === equipment.category)
    return category?.requires_training || false
  }
}
