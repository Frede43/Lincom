import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/providers/QueryProvider'
import { useAppStore } from '@/store/appStore'
import { useUserStore } from '@/store/userStore'
import { Course } from '@/types/api'

const API_BASE_URL = 'http://localhost:8000/api/education'

// API functions
const coursesAPI = {
  getAll: async (params?: any) => {
    const url = new URL(`${API_BASE_URL}/courses/`)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, String(value))
      })
    }
    const response = await fetch(url.toString())
    if (!response.ok) throw new Error('Failed to fetch courses')
    return response.json()
  },

  getById: async (courseId: string) => {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}/`)
    if (!response.ok) throw new Error('Failed to fetch course')
    return response.json()
  },

  getModules: async (courseId: string) => {
    const response = await fetch(`${API_BASE_URL}/modules/?course=${courseId}`)
    if (!response.ok) throw new Error('Failed to fetch modules')
    return response.json()
  },

  getLessons: async (moduleId: string) => {
    const response = await fetch(`${API_BASE_URL}/lessons/?module=${moduleId}`)
    if (!response.ok) throw new Error('Failed to fetch lessons')
    return response.json()
  }
}

// Types basés sur l'API Django réelle
export interface CourseModule {
  id: number
  title: string
  description: string
  content: string
  order: number
  duration_hours: number
  course: number
  lessons?: Lesson[]
  resources?: any[]
}

export interface Lesson {
  id: number
  title: string
  content: string
  order: number
  duration_minutes: number
  created_at: string
  updated_at: string
  module: number
}

export interface Quiz {
  id: number
  title: string
  description: string
  questions: any[]
  passing_score: number
  time_limit?: number
}

export interface CourseProgress {
  courseId: string
  userId: string
  progress: number
  completedLessons: string[]
  currentLesson?: string
  enrolledAt: string
  lastAccessedAt: string
}

// Hook principal pour les cours
export const useCourses = (params?: {
  page?: number
  search?: string
  level?: string
}) => {
  return useQuery({
    queryKey: ['courses', params],
    queryFn: () => coursesAPI.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook pour un cours spécifique avec ses modules
export const useCourse = (courseId: string) => {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: () => coursesAPI.getById(courseId),
    enabled: !!courseId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hook pour les modules d'un cours
export const useCourseModules = (courseId: string) => {
  return useQuery({
    queryKey: ['modules', courseId],
    queryFn: () => coursesAPI.getModules(courseId),
    enabled: !!courseId,
    staleTime: 10 * 60 * 1000,
  })
}

// Hook pour les leçons d'un module
export const useModuleLessons = (moduleId: string) => {
  return useQuery({
    queryKey: ['lessons', moduleId],
    queryFn: () => coursesAPI.getLessons(moduleId),
    enabled: !!moduleId,
    staleTime: 10 * 60 * 1000,
  })
}

// Hook pour s'inscrire à un cours (simplifié)
export const useEnrollCourse = () => {
  const queryClient = useQueryClient()
  const { addNotification } = useAppStore()

  return useMutation({
    mutationFn: async (courseId: string) => {
      // Simulation d'inscription pour le moment
      return { success: true, courseId }
    },
    onSuccess: (data, courseId) => {
      // Invalider les caches pertinents
      queryClient.invalidateQueries({ queryKey: ['course', courseId] })

      // Notification de succès
      addNotification({
        type: 'success',
        title: 'Inscription réussie !',
        message: 'Vous êtes maintenant inscrit à ce cours. Bon apprentissage !',
      })
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Erreur d\'inscription',
        message: 'Impossible de s\'inscrire au cours',
      })
    },
  })
}

// Utilitaires pour les cours
export const courseUtils = {
  // Formater la durée en semaines
  formatDuration: (weeks: number): string => {
    if (weeks === 1) return '1 semaine'
    return `${weeks} semaines`
  },

  // Formater la durée en minutes
  formatMinutes: (minutes: number): string => {
    if (minutes < 60) return `${minutes}min`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h${remainingMinutes}min` : `${hours}h`
  },

  // Obtenir le niveau en français
  getLevelLabel: (level: string): string => {
    const levels: Record<string, string> = {
      'beginner': 'Débutant',
      'intermediate': 'Intermédiaire',
      'advanced': 'Avancé'
    }
    return levels[level] || level
  },

  // Calculer le nombre total de leçons dans les modules
  getTotalLessons: (modules: CourseModule[] | undefined): number => {
    if (!modules || !Array.isArray(modules)) return 0
    return modules.reduce((total, module) => total + (module.lessons?.length || 0), 0)
  },

  // Calculer la durée totale en heures
  getTotalDuration: (modules: CourseModule[] | undefined): number => {
    if (!modules || !Array.isArray(modules)) return 0
    return modules.reduce((total, module) => total + module.duration_hours, 0)
  }
}


