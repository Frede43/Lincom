import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { coursesAPI } from '@/lib/api'
import { queryKeys } from '@/providers/QueryProvider'
import { useAppStore } from '@/store/appStore'
import { useUserStore } from '@/store/userStore'

// Types pour les cours
export interface Course {
  id: string
  title: string
  description: string
  thumbnail: string
  instructor: {
    id: string
    name: string
    avatar: string
    bio: string
  }
  duration: string
  level: 'Débutant' | 'Intermédiaire' | 'Avancé'
  rating: number
  reviewsCount: number
  studentsCount: number
  price: number
  currency: string
  language: string
  category: string
  tags: string[]
  modules: CourseModule[]
  createdAt: string
  updatedAt: string
  isEnrolled?: boolean
  progress?: number
}

export interface CourseModule {
  id: string
  title: string
  description: string
  order: number
  lessons: Lesson[]
  quiz?: Quiz
  estimatedDuration: string
}

export interface Lesson {
  id: string
  title: string
  description: string
  type: 'video' | 'text' | 'interactive' | 'quiz'
  content: string
  duration: string
  order: number
  resources: LessonResource[]
  completed?: boolean
}

export interface LessonResource {
  id: string
  title: string
  type: 'pdf' | 'link' | 'code' | 'image'
  url: string
  description?: string
}

export interface Quiz {
  id: string
  title: string
  questions: QuizQuestion[]
  passingScore: number
  timeLimit?: number
}

export interface QuizQuestion {
  id: string
  question: string
  type: 'multiple-choice' | 'true-false' | 'short-answer'
  options?: string[]
  correctAnswer: string | string[]
  explanation?: string
}

export interface CourseProgress {
  courseId: string
  userId: string
  progress: number
  completedLessons: string[]
  currentLesson?: string
  quizScores: Record<string, number>
  certificateEarned: boolean
  enrolledAt: string
  lastAccessedAt: string
}

// Hook principal pour les cours
export const useCourses = (params?: {
  page?: number
  search?: string
  category?: string
  level?: string
  language?: string
  instructor?: string
}) => {
  return useQuery({
    queryKey: [...queryKeys.courses, params],
    queryFn: () => coursesAPI.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook pour un cours spécifique
export const useCourse = (courseId: string) => {
  return useQuery({
    queryKey: queryKeys.course(courseId),
    queryFn: () => coursesAPI.getById(courseId),
    enabled: !!courseId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hook pour les cours de l'utilisateur
export const useUserCourses = () => {
  const { user } = useUserStore()
  
  return useQuery({
    queryKey: queryKeys.userCourses(user?.id || ''),
    queryFn: () => coursesAPI.getUserCourses(),
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Hook pour la progression d'un cours
export const useCourseProgress = (courseId: string) => {
  const { user } = useUserStore()
  
  return useQuery({
    queryKey: queryKeys.courseProgress(courseId),
    queryFn: () => coursesAPI.getProgress(courseId),
    enabled: !!user?.id && !!courseId,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

// Hook pour s'inscrire à un cours
export const useEnrollCourse = () => {
  const queryClient = useQueryClient()
  const { addNotification } = useAppStore()
  const { user } = useUserStore()

  return useMutation({
    mutationFn: (courseId: string) => coursesAPI.enroll(courseId),
    onSuccess: (data, courseId) => {
      // Invalider les caches pertinents
      queryClient.invalidateQueries({ queryKey: queryKeys.course(courseId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.userCourses(user?.id || '') })
      
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
        message: error?.response?.data?.message || 'Impossible de s\'inscrire au cours',
      })
    },
  })
}

// Hook pour marquer une leçon comme terminée
export const useCompleteLesson = () => {
  const queryClient = useQueryClient()
  const { addNotification } = useAppStore()

  return useMutation({
    mutationFn: ({ courseId, lessonId }: { courseId: string; lessonId: string }) =>
      coursesAPI.completeLesson(courseId, lessonId),
    onSuccess: (data, { courseId }) => {
      // Invalider la progression du cours
      queryClient.invalidateQueries({ queryKey: queryKeys.courseProgress(courseId) })
      
      // Notification de succès
      addNotification({
        type: 'success',
        title: 'Leçon terminée !',
        message: 'Félicitations ! Vous avez terminé cette leçon.',
      })
    },
  })
}

// Hook pour soumettre un quiz
export const useSubmitQuiz = () => {
  const queryClient = useQueryClient()
  const { addNotification } = useAppStore()

  return useMutation({
    mutationFn: ({ 
      courseId, 
      quizId, 
      answers 
    }: { 
      courseId: string
      quizId: string
      answers: Record<string, string | string[]>
    }) => coursesAPI.submitQuiz(courseId, quizId, answers),
    onSuccess: (data, { courseId }) => {
      // Invalider la progression
      queryClient.invalidateQueries({ queryKey: queryKeys.courseProgress(courseId) })
      
      // Notification basée sur le score
      const passed = data.score >= data.passingScore
      addNotification({
        type: passed ? 'success' : 'warning',
        title: passed ? 'Quiz réussi !' : 'Quiz à refaire',
        message: `Score: ${data.score}/${data.totalScore} (${Math.round((data.score / data.totalScore) * 100)}%)`,
      })
    },
  })
}

// Hook pour les cours recommandés
export const useRecommendedCourses = () => {
  const { user } = useUserStore()
  
  return useQuery({
    queryKey: ['courses', 'recommended', user?.id],
    queryFn: () => coursesAPI.getRecommended(),
    enabled: !!user?.id,
    staleTime: 15 * 60 * 1000, // 15 minutes
  })
}

// Hook pour les catégories de cours
export const useCourseCategories = () => {
  return useQuery({
    queryKey: ['courses', 'categories'],
    queryFn: () => coursesAPI.getCategories(),
    staleTime: 60 * 60 * 1000, // 1 heure
  })
}

// Hook pour rechercher des cours
export const useSearchCourses = (query: string) => {
  return useQuery({
    queryKey: [...queryKeys.search(query), 'courses'],
    queryFn: () => coursesAPI.search(query),
    enabled: query.length >= 2,
    staleTime: 5 * 60 * 1000,
  })
}

// Utilitaires
export const courseUtils = {
  // Calculer la progression totale d'un cours
  calculateProgress: (progress: CourseProgress, course: Course): number => {
    if (!course.modules.length) return 0
    
    const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0)
    const completedLessons = progress.completedLessons.length
    
    return Math.round((completedLessons / totalLessons) * 100)
  },
  
  // Obtenir la prochaine leçon
  getNextLesson: (course: Course, progress: CourseProgress): Lesson | null => {
    for (const module of course.modules) {
      for (const lesson of module.lessons) {
        if (!progress.completedLessons.includes(lesson.id)) {
          return lesson
        }
      }
    }
    return null
  },
  
  // Vérifier si un cours est terminé
  isCourseCompleted: (progress: CourseProgress, course: Course): boolean => {
    const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0)
    return progress.completedLessons.length === totalLessons
  },
  
  // Formater la durée
  formatDuration: (minutes: number): string => {
    if (minutes < 60) return `${minutes}min`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h${remainingMinutes}min` : `${hours}h`
  },
}
