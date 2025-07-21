import { describe, it, expect, beforeEach } from 'vitest'
import { useUserStore } from '../userStore'

// Mock localStorage pour les tests
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('UserStore', () => {
  beforeEach(() => {
    // Réinitialiser le store avant chaque test
    useUserStore.getState().logout()
    vi.clearAllMocks()
  })

  it('should have initial state', () => {
    const state = useUserStore.getState()
    
    expect(state.user).toBeNull()
    expect(state.isAuthenticated).toBe(false)
    expect(state.isLoading).toBe(false)
    expect(state.error).toBeNull()
  })

  it('should set user and authenticate', () => {
    const mockUser = {
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

    useUserStore.getState().setUser(mockUser)
    const state = useUserStore.getState()

    expect(state.user).toEqual(mockUser)
    expect(state.isAuthenticated).toBe(true)
    expect(state.error).toBeNull()
  })

  it('should update user', () => {
    const mockUser = {
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

    useUserStore.getState().setUser(mockUser)
    useUserStore.getState().updateUser({ firstName: 'Updated' })
    
    const state = useUserStore.getState()
    expect(state.user?.firstName).toBe('Updated')
    expect(state.user?.lastName).toBe('User') // Autres propriétés inchangées
  })

  it('should set loading state', () => {
    useUserStore.getState().setLoading(true)
    expect(useUserStore.getState().isLoading).toBe(true)

    useUserStore.getState().setLoading(false)
    expect(useUserStore.getState().isLoading).toBe(false)
  })

  it('should set error', () => {
    const errorMessage = 'Test error'
    useUserStore.getState().setError(errorMessage)
    
    const state = useUserStore.getState()
    expect(state.error).toBe(errorMessage)
    expect(state.isLoading).toBe(false)
  })

  it('should logout user', () => {
    const mockUser = {
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

    // D'abord connecter l'utilisateur
    useUserStore.getState().setUser(mockUser)
    expect(useUserStore.getState().isAuthenticated).toBe(true)

    // Puis le déconnecter
    useUserStore.getState().logout()
    const state = useUserStore.getState()

    expect(state.user).toBeNull()
    expect(state.isAuthenticated).toBe(false)
    expect(state.error).toBeNull()
  })

  it('should check user roles correctly', () => {
    const studentUser = {
      id: '1',
      email: 'student@comlab.bi',
      firstName: 'Student',
      lastName: 'User',
      role: 'student' as const,
      avatar: 'https://example.com/avatar.jpg',
      isEmailVerified: true,
      profile: {
        bio: 'Student bio',
        skills: ['Learning'],
        interests: ['Education'],
        location: 'Bujumbura, Burundi',
        institution: 'Université du Burundi',
      },
    }

    useUserStore.getState().setUser(studentUser)
    const state = useUserStore.getState()

    expect(state.isStudent()).toBe(true)
    expect(state.isEntrepreneur()).toBe(false)
    expect(state.isMentor()).toBe(false)
    expect(state.isAdmin()).toBe(false)
  })

  it('should handle entrepreneur role', () => {
    const entrepreneurUser = {
      id: '2',
      email: 'entrepreneur@comlab.bi',
      firstName: 'Entrepreneur',
      lastName: 'User',
      role: 'entrepreneur' as const,
      avatar: 'https://example.com/avatar.jpg',
      isEmailVerified: true,
      profile: {
        bio: 'Entrepreneur bio',
        skills: ['Business'],
        interests: ['Startup'],
        location: 'Bujumbura, Burundi',
      },
    }

    useUserStore.getState().setUser(entrepreneurUser)
    const state = useUserStore.getState()

    expect(state.isStudent()).toBe(false)
    expect(state.isEntrepreneur()).toBe(true)
    expect(state.isMentor()).toBe(false)
    expect(state.isAdmin()).toBe(false)
  })

  it('should handle mentor role', () => {
    const mentorUser = {
      id: '3',
      email: 'mentor@comlab.bi',
      firstName: 'Mentor',
      lastName: 'User',
      role: 'mentor' as const,
      avatar: 'https://example.com/avatar.jpg',
      isEmailVerified: true,
      profile: {
        bio: 'Mentor bio',
        skills: ['Teaching', 'Python'],
        interests: ['Education', 'AI'],
        location: 'Bujumbura, Burundi',
      },
    }

    useUserStore.getState().setUser(mentorUser)
    const state = useUserStore.getState()

    expect(state.isStudent()).toBe(false)
    expect(state.isEntrepreneur()).toBe(false)
    expect(state.isMentor()).toBe(true)
    expect(state.isAdmin()).toBe(false)
  })

  it('should handle admin role', () => {
    const adminUser = {
      id: '4',
      email: 'admin@comlab.bi',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin' as const,
      avatar: 'https://example.com/avatar.jpg',
      isEmailVerified: true,
      profile: {
        bio: 'Admin bio',
        skills: ['Management'],
        interests: ['Platform'],
        location: 'Bujumbura, Burundi',
      },
    }

    useUserStore.getState().setUser(adminUser)
    const state = useUserStore.getState()

    expect(state.isStudent()).toBe(false)
    expect(state.isEntrepreneur()).toBe(false)
    expect(state.isMentor()).toBe(false)
    expect(state.isAdmin()).toBe(true)
  })
})
