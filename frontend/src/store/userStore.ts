import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'student' | 'entrepreneur' | 'mentor' | 'admin'
  avatar?: string
  isEmailVerified: boolean
  profile: {
    bio?: string
    skills: string[]
    interests: string[]
    location?: string
    institution?: string
  }
}

interface UserState {
  // État
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  setUser: (user: User) => void
  updateUser: (updates: Partial<User>) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  logout: () => void
  
  // Computed
  isStudent: () => boolean
  isEntrepreneur: () => boolean
  isMentor: () => boolean
  isAdmin: () => boolean
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // État initial
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      // Actions
      setUser: (user) => set({ 
        user, 
        isAuthenticated: true, 
        error: null 
      }),
      
      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      })),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error, isLoading: false }),
      
      logout: () => set({ 
        user: null, 
        isAuthenticated: false, 
        error: null 
      }),
      
      // Computed
      isStudent: () => get().user?.role === 'student',
      isEntrepreneur: () => get().user?.role === 'entrepreneur',
      isMentor: () => get().user?.role === 'mentor',
      isAdmin: () => get().user?.role === 'admin',
    }),
    {
      name: 'comlab-user-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
)
