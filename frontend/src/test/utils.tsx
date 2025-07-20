import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'

// Mock du store Zustand pour les tests
import { useUserStore } from '@/store/userStore'

// Configuration du QueryClient pour les tests
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
  })

// Wrapper personnalisé avec tous les providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

// Fonction de render personnalisée
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Mock des données utilisateur pour les tests
export const mockUser = {
  id: '1',
  email: 'test@comlab.bi',
  firstName: 'Test',
  lastName: 'User',
  role: 'student' as const,
  avatar: 'https://example.com/avatar.jpg',
  isEmailVerified: true,
  profile: {
    bio: 'Test bio',
    skills: ['React', 'TypeScript'],
    interests: ['Web Development', 'AI'],
    location: 'Bujumbura, Burundi',
    institution: 'Université du Burundi',
  },
}

export const mockEntrepreneur = {
  ...mockUser,
  id: '2',
  email: 'entrepreneur@comlab.bi',
  role: 'entrepreneur' as const,
  profile: {
    ...mockUser.profile,
    bio: 'Entrepreneur passionné',
    skills: ['Business Development', 'Marketing'],
    interests: ['Startup', 'Innovation'],
  },
}

export const mockMentor = {
  ...mockUser,
  id: '3',
  email: 'mentor@comlab.bi',
  role: 'mentor' as const,
  profile: {
    ...mockUser.profile,
    bio: 'Mentor expérimenté',
    skills: ['Python', 'Machine Learning', 'Mentoring'],
    interests: ['Teaching', 'AI', 'Data Science'],
  },
}

export const mockAdmin = {
  ...mockUser,
  id: '4',
  email: 'admin@comlab.bi',
  role: 'admin' as const,
  profile: {
    ...mockUser.profile,
    bio: 'Administrateur système',
    skills: ['System Administration', 'Management'],
    interests: ['Platform Management', 'Analytics'],
  },
}

// Utilitaires pour mocker le store
export const mockAuthenticatedUser = (user = mockUser) => {
  useUserStore.setState({
    user,
    isAuthenticated: true,
    isLoading: false,
    error: null,
  })
}

export const mockUnauthenticatedUser = () => {
  useUserStore.setState({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  })
}

// Mock des données de cours
export const mockCourse = {
  id: '1',
  title: 'Python pour Débutants',
  description: 'Apprenez les bases de Python',
  instructor: {
    id: '3',
    name: 'Jean NKURUNZIZA',
    avatar: 'https://example.com/instructor.jpg',
  },
  duration: '8 heures',
  level: 'Débutant',
  rating: 4.8,
  studentsCount: 1234,
  price: 0,
  thumbnail: 'https://example.com/course.jpg',
  modules: [
    {
      id: '1',
      title: 'Introduction à Python',
      lessons: [
        { id: '1', title: 'Qu\'est-ce que Python?', duration: '12min' },
        { id: '2', title: 'Installation et setup', duration: '8min' },
      ],
    },
  ],
}

// Mock des données de projet
export const mockProject = {
  id: '1',
  title: 'EcoFarm Solutions',
  description: 'Application mobile pour agriculteurs',
  status: 'active',
  progress: 80,
  team: [
    { id: '1', name: 'Marie K.', role: 'CTO', avatar: 'https://example.com/marie.jpg' },
    { id: '2', name: 'Paul M.', role: 'Designer', avatar: 'https://example.com/paul.jpg' },
  ],
  funding: {
    target: 50000,
    raised: 15000,
    currency: 'USD',
  },
  milestones: [
    { id: '1', title: 'MVP', completed: true, dueDate: '2024-04-15' },
    { id: '2', title: 'Beta Testing', completed: false, dueDate: '2024-05-01' },
  ],
}

// Utilitaires pour les tests d'API
export const mockApiResponse = <T>(data: T, delay = 0) => {
  return new Promise<T>((resolve) => {
    setTimeout(() => resolve(data), delay)
  })
}

export const mockApiError = (message = 'API Error', status = 500, delay = 0) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject({
        response: {
          status,
          data: { message },
        },
      })
    }, delay)
  })
}

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }
