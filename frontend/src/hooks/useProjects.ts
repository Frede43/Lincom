import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { projectsAPI } from '@/lib/api'
import { queryKeys } from '@/providers/QueryProvider'
import { useAppStore } from '@/store/appStore'
import { useUserStore } from '@/store/userStore'

// Types pour les projets
export interface Project {
  id: string
  title: string
  description: string
  category: string
  type: 'startup' | 'student' | 'research' | 'social'
  status: 'idea' | 'prototype' | 'mvp' | 'launched' | 'paused' | 'completed'
  progress: number
  owner: {
    id: string
    name: string
    avatar: string
    role: string
  }
  team: TeamMember[]
  funding: {
    target: number
    raised: number
    currency: string
    sources: string[]
  }
  milestones: Milestone[]
  tags: string[]
  thumbnail: string
  createdAt: string
  updatedAt: string
  isPublic: boolean
  lookingForMembers: boolean
  requiredSkills: string[]
}

export interface TeamMember {
  id: string
  userId: string
  name: string
  avatar: string
  role: string
  skills: string[]
  joinedAt: string
  isActive: boolean
  permissions: string[]
}

export interface Milestone {
  id: string
  title: string
  description: string
  dueDate: string
  completed: boolean
  completedAt?: string
  assignedTo: string[]
  priority: 'low' | 'medium' | 'high' | 'critical'
}

export interface ProjectTask {
  id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'review' | 'done'
  priority: 'low' | 'medium' | 'high' | 'critical'
  assignedTo: string[]
  dueDate?: string
  tags: string[]
  estimatedHours?: number
  actualHours?: number
  createdAt: string
  updatedAt: string
}

export interface ProjectStats {
  totalProjects: number
  activeProjects: number
  completedProjects: number
  totalFunding: number
  teamMembers: number
  averageProgress: number
}

// Hook principal pour les projets
export const useProjects = (params?: {
  page?: number
  status?: string
  category?: string
  search?: string
  userId?: string
}) => {
  return useQuery({
    queryKey: [...queryKeys.projects, params],
    queryFn: () => projectsAPI.getAll(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Hook pour un projet spécifique
export const useProject = (projectId: string) => {
  return useQuery({
    queryKey: queryKeys.project(projectId),
    queryFn: () => projectsAPI.getById(projectId),
    enabled: !!projectId,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

// Hook pour les projets de l'utilisateur
export const useUserProjects = () => {
  const { user } = useUserStore()
  
  return useQuery({
    queryKey: queryKeys.userProjects(user?.id || ''),
    queryFn: () => projectsAPI.getUserProjects(),
    enabled: !!user?.id,
    staleTime: 1 * 60 * 1000,
  })
}

// Hook pour créer un projet
export const useCreateProject = () => {
  const queryClient = useQueryClient()
  const { addNotification } = useAppStore()
  const { user } = useUserStore()

  return useMutation({
    mutationFn: (projectData: Partial<Project>) => projectsAPI.create(projectData),
    onSuccess: (data) => {
      // Invalider les caches
      queryClient.invalidateQueries({ queryKey: queryKeys.projects })
      queryClient.invalidateQueries({ queryKey: queryKeys.userProjects(user?.id || '') })
      
      // Notification de succès
      addNotification({
        type: 'success',
        title: 'Projet créé !',
        message: `Le projet "${data.title}" a été créé avec succès.`,
        actionUrl: `/projects/${data.id}`,
      })
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Erreur de création',
        message: error?.response?.data?.message || 'Impossible de créer le projet',
      })
    },
  })
}

// Hook pour mettre à jour un projet
export const useUpdateProject = () => {
  const queryClient = useQueryClient()
  const { addNotification } = useAppStore()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Project> }) =>
      projectsAPI.update(id, data),
    onSuccess: (data, { id }) => {
      // Mettre à jour le cache du projet spécifique
      queryClient.setQueryData(queryKeys.project(id), data)
      
      // Invalider les listes
      queryClient.invalidateQueries({ queryKey: queryKeys.projects })
      
      addNotification({
        type: 'success',
        title: 'Projet mis à jour',
        message: 'Les modifications ont été sauvegardées.',
      })
    },
  })
}

// Hook pour supprimer un projet
export const useDeleteProject = () => {
  const queryClient = useQueryClient()
  const { addNotification } = useAppStore()
  const { user } = useUserStore()

  return useMutation({
    mutationFn: (projectId: string) => projectsAPI.delete(projectId),
    onSuccess: (_, projectId) => {
      // Supprimer du cache
      queryClient.removeQueries({ queryKey: queryKeys.project(projectId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.projects })
      queryClient.invalidateQueries({ queryKey: queryKeys.userProjects(user?.id || '') })
      
      addNotification({
        type: 'success',
        title: 'Projet supprimé',
        message: 'Le projet a été supprimé définitivement.',
      })
    },
  })
}

// Hook pour rejoindre un projet
export const useJoinProject = () => {
  const queryClient = useQueryClient()
  const { addNotification } = useAppStore()

  return useMutation({
    mutationFn: ({ projectId, message }: { projectId: string; message?: string }) =>
      projectsAPI.joinRequest(projectId, message),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.project(projectId) })
      
      addNotification({
        type: 'success',
        title: 'Demande envoyée',
        message: 'Votre demande pour rejoindre le projet a été envoyée.',
      })
    },
  })
}

// Hook pour les tâches d'un projet
export const useProjectTasks = (projectId: string) => {
  return useQuery({
    queryKey: ['projects', projectId, 'tasks'],
    queryFn: () => projectsAPI.getTasks(projectId),
    enabled: !!projectId,
    staleTime: 30 * 1000, // 30 secondes
  })
}

// Hook pour créer une tâche
export const useCreateTask = () => {
  const queryClient = useQueryClient()
  const { addNotification } = useAppStore()

  return useMutation({
    mutationFn: ({ projectId, taskData }: { projectId: string; taskData: Partial<ProjectTask> }) =>
      projectsAPI.createTask(projectId, taskData),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'tasks'] })
      
      addNotification({
        type: 'success',
        title: 'Tâche créée',
        message: 'La nouvelle tâche a été ajoutée au projet.',
      })
    },
  })
}

// Hook pour mettre à jour une tâche
export const useUpdateTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ 
      projectId, 
      taskId, 
      data 
    }: { 
      projectId: string
      taskId: string
      data: Partial<ProjectTask> 
    }) => projectsAPI.updateTask(projectId, taskId, data),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'tasks'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.project(projectId) })
    },
  })
}

// Hook pour les statistiques des projets
export const useProjectStats = () => {
  const { user } = useUserStore()
  
  return useQuery({
    queryKey: ['projects', 'stats', user?.id],
    queryFn: () => projectsAPI.getStats(),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook pour les projets recommandés
export const useRecommendedProjects = () => {
  const { user } = useUserStore()
  
  return useQuery({
    queryKey: ['projects', 'recommended', user?.id],
    queryFn: () => projectsAPI.getRecommended(),
    enabled: !!user?.id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hook pour rechercher des projets
export const useSearchProjects = (query: string) => {
  return useQuery({
    queryKey: [...queryKeys.search(query), 'projects'],
    queryFn: () => projectsAPI.search(query),
    enabled: query.length >= 2,
    staleTime: 5 * 60 * 1000,
  })
}

// Utilitaires pour les projets
export const projectUtils = {
  // Calculer la progression basée sur les milestones
  calculateProgress: (milestones: Milestone[]): number => {
    if (!milestones.length) return 0
    const completed = milestones.filter(m => m.completed).length
    return Math.round((completed / milestones.length) * 100)
  },
  
  // Obtenir le statut coloré
  getStatusColor: (status: Project['status']): string => {
    const colors = {
      idea: 'bg-gray-100 text-gray-800',
      prototype: 'bg-blue-100 text-blue-800',
      mvp: 'bg-yellow-100 text-yellow-800',
      launched: 'bg-green-100 text-green-800',
      paused: 'bg-orange-100 text-orange-800',
      completed: 'bg-purple-100 text-purple-800',
    }
    return colors[status] || colors.idea
  },
  
  // Formater le financement
  formatFunding: (amount: number, currency: string = 'BIF'): string => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M ${currency}`
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K ${currency}`
    }
    return `${amount} ${currency}`
  },
  
  // Vérifier si l'utilisateur peut modifier le projet
  canEdit: (project: Project, userId: string): boolean => {
    return project.owner.id === userId || 
           project.team.some(member => 
             member.userId === userId && 
             member.permissions.includes('edit')
           )
  },
  
  // Obtenir les prochaines échéances
  getUpcomingDeadlines: (milestones: Milestone[]): Milestone[] => {
    const now = new Date()
    return milestones
      .filter(m => !m.completed && new Date(m.dueDate) > now)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 3)
  },
}
