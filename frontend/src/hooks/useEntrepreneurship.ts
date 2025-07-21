import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAppStore } from '@/store/appStore'
import { startupsAPI, projectsAPI } from '@/lib/api'

const API_BASE_URL = 'http://localhost:8000/api/entrepreneurship'

// Types basés sur l'API Django réelle
export interface Startup {
  id: number
  name: string
  description: string
  industry: string
  founding_date: string
  website: string
  logo?: string | null
  pitch_deck?: string | null
  team_size: number
  funding_stage: string
  total_funding: string
  status: string
  founder: number
  mentors: number[]
}

export interface Project {
  id: number
  startup: number
  title: string
  description: string
  status: string
  priority: string
  start_date: string
  end_date: string
  budget: string
  manager: number
  team_members: number[]
  milestones: any[]
}

// API functions
const entrepreneurshipAPI = {
  // Startups
  getStartups: async (params?: any) => {
    const url = new URL(`${API_BASE_URL}/startups/`)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, String(value))
      })
    }
    const response = await fetch(url.toString())
    if (!response.ok) throw new Error('Failed to fetch startups')
    const data = await response.json()
    // Retourner directement le tableau si c'est un tableau, sinon extraire results
    return Array.isArray(data) ? data : data.results || []
  },

  getStartupById: async (startupId: string) => {
    const response = await fetch(`${API_BASE_URL}/startups/${startupId}/`)
    if (!response.ok) throw new Error('Failed to fetch startup')
    return response.json()
  },

  // Projects
  getProjects: async (params?: any) => {
    const url = new URL(`${API_BASE_URL}/projects/`)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, String(value))
      })
    }
    const response = await fetch(url.toString())
    if (!response.ok) throw new Error('Failed to fetch projects')
    const data = await response.json()
    // Retourner directement le tableau si c'est un tableau, sinon extraire results
    return Array.isArray(data) ? data : data.results || []
  },

  getProjectById: async (projectId: string) => {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/`)
    if (!response.ok) throw new Error('Failed to fetch project')
    return response.json()
  },

  getProjectsByStartup: async (startupId: string) => {
    const response = await fetch(`${API_BASE_URL}/projects/?startup=${startupId}`)
    if (!response.ok) throw new Error('Failed to fetch startup projects')
    const data = await response.json()
    // Retourner directement le tableau si c'est un tableau, sinon extraire results
    return Array.isArray(data) ? data : data.results || []
  }
}

// Hooks pour les startups
export const useStartups = (params?: {
  page?: number
  search?: string
  industry?: string
  status?: string
  funding_stage?: string
}) => {
  return useQuery({
    queryKey: ['startups', params],
    queryFn: () => entrepreneurshipAPI.getStartups(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useStartup = (startupId: string) => {
  return useQuery({
    queryKey: ['startup', startupId],
    queryFn: () => startupsAPI.getById(startupId),
    enabled: !!startupId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hooks pour les projets
export const useProjects = (params?: {
  page?: number
  search?: string
  status?: string
  priority?: string
  startup?: string
}) => {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: () => entrepreneurshipAPI.getProjects(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useProject = (projectId: string) => {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: () => entrepreneurshipAPI.getProjectById(projectId),
    enabled: !!projectId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useStartupProjects = (startupId: string) => {
  return useQuery({
    queryKey: ['startup-projects', startupId],
    queryFn: () => entrepreneurshipAPI.getProjectsByStartup(startupId),
    enabled: !!startupId,
    staleTime: 5 * 60 * 1000,
  })
}

// Hook pour créer une startup (simulation)
export const useCreateStartup = () => {
  const queryClient = useQueryClient()
  const { addNotification } = useAppStore()

  return useMutation({
    mutationFn: async (startupData: Partial<Startup>) => {
      // Simulation de création pour le moment
      return { success: true, id: Date.now(), ...startupData }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['startups'] })
      addNotification({
        type: 'success',
        title: 'Startup créée !',
        message: 'Votre startup a été ajoutée avec succès.',
      })
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Erreur de création',
        message: 'Impossible de créer la startup',
      })
    },
  })
}

// Hook pour créer un projet (simulation)
export const useCreateProject = () => {
  const queryClient = useQueryClient()
  const { addNotification } = useAppStore()

  return useMutation({
    mutationFn: async (projectData: Partial<Project>) => {
      // Simulation de création pour le moment
      return { success: true, id: Date.now(), ...projectData }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      addNotification({
        type: 'success',
        title: 'Projet créé !',
        message: 'Votre projet a été ajouté avec succès.',
      })
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Erreur de création',
        message: 'Impossible de créer le projet',
      })
    },
  })
}

// Utilitaires
export const entrepreneurshipUtils = {
  // Formater le montant de financement
  formatFunding: (amount: string): string => {
    const num = parseFloat(amount)
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M BIF`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K BIF`
    }
    return `${num.toLocaleString()} BIF`
  },

  // Obtenir le label du stage de financement
  getFundingStageLabel: (stage: string): string => {
    const stages: Record<string, string> = {
      'pre_seed': 'Pré-amorçage',
      'seed': 'Amorçage',
      'series_a': 'Série A',
      'series_b': 'Série B',
      'series_c': 'Série C',
      'ipo': 'Introduction en bourse'
    }
    return stages[stage] || stage
  },

  // Obtenir le label du statut
  getStatusLabel: (status: string): string => {
    const statuses: Record<string, string> = {
      'active': 'Active',
      'inactive': 'Inactive',
      'paused': 'En pause',
      'completed': 'Terminée'
    }
    return statuses[status] || status
  },

  // Obtenir le label de priorité
  getPriorityLabel: (priority: string): string => {
    const priorities: Record<string, string> = {
      'low': 'Faible',
      'medium': 'Moyenne',
      'high': 'Élevée',
      'critical': 'Critique'
    }
    return priorities[priority] || priority
  },

  // Obtenir la couleur du statut
  getStatusColor: (status: string): string => {
    const colors: Record<string, string> = {
      'active': 'green',
      'inactive': 'gray',
      'paused': 'yellow',
      'completed': 'blue',
      'not_started': 'gray',
      'in_progress': 'blue',
      'on_hold': 'yellow',
      'cancelled': 'red'
    }
    return colors[status] || 'gray'
  },

  // Calculer les jours restants
  getDaysRemaining: (endDate: string): number => {
    const end = new Date(endDate)
    const now = new Date()
    const diffTime = end.getTime() - now.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }
}
