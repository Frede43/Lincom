import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { organizationsAPI } from '@/lib/api'
import { Organization, PaginatedResponse } from '@/types/api'
import { toast } from 'sonner'

// Query keys
export const organizationKeys = {
  all: ['organizations'] as const,
  lists: () => [...organizationKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...organizationKeys.lists(), { filters }] as const,
  details: () => [...organizationKeys.all, 'detail'] as const,
  detail: (id: string) => [...organizationKeys.details(), id] as const,
  projects: (orgId: string) => [...organizationKeys.all, 'projects', orgId] as const,
  stats: () => [...organizationKeys.all, 'stats'] as const,
}

// Hooks pour les organisations
export const useOrganizations = (filters?: {
  type?: string
  location?: string
  search?: string
  page?: number
}) => {
  return useQuery({
    queryKey: organizationKeys.list(filters || {}),
    queryFn: () => organizationsAPI.getAll(filters),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })
}

export const useOrganization = (id: string) => {
  return useQuery({
    queryKey: organizationKeys.detail(id),
    queryFn: () => organizationsAPI.getById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useOrganizationProjects = (orgId: string) => {
  return useQuery({
    queryKey: organizationKeys.projects(orgId),
    queryFn: () => organizationsAPI.getProjects(orgId),
    enabled: !!orgId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useOrganizationStats = () => {
  return useQuery({
    queryKey: organizationKeys.stats(),
    queryFn: () => organizationsAPI.getStats(),
    staleTime: 15 * 60 * 1000, // 15 minutes
  })
}

// Mutations pour les organisations
export const useCreateOrganization = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (orgData: {
      name: string
      description: string
      type: string
      website_url?: string
      location: string
      contact_email: string
      contact_phone?: string
      partnership_type: string
    }) => organizationsAPI.create(orgData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.lists() })
      queryClient.invalidateQueries({ queryKey: organizationKeys.stats() })
      
      toast.success('Organisation créée avec succès !')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la création de l\'organisation')
    },
  })
}

export const useUpdateOrganization = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      organizationsAPI.update(id, data),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: organizationKeys.lists() })
      
      toast.success('Organisation mise à jour avec succès !')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la mise à jour de l\'organisation')
    },
  })
}

export const useDeleteOrganization = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => organizationsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.lists() })
      queryClient.invalidateQueries({ queryKey: organizationKeys.stats() })
      
      toast.success('Organisation supprimée avec succès !')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la suppression de l\'organisation')
    },
  })
}

// Hooks spécialisés pour différents types d'organisations
export const useUniversities = () => {
  return useOrganizations({ type: 'university' })
}

export const useCompanies = () => {
  return useOrganizations({ type: 'company' })
}

export const useNGOs = () => {
  return useOrganizations({ type: 'ngo' })
}

export const useGovernmentOrgs = () => {
  return useOrganizations({ type: 'government' })
}

export const useInternationalOrgs = () => {
  return useOrganizations({ type: 'international' })
}

// Hook pour les organisations par type de partenariat
export const useOrganizationsByPartnership = (partnershipType: string) => {
  return useQuery({
    queryKey: organizationKeys.list({ partnership_type: partnershipType }),
    queryFn: () => organizationsAPI.getAll({ partnership_type: partnershipType }),
    staleTime: 10 * 60 * 1000,
  })
}

// Hook pour les sponsors
export const useSponsors = () => {
  return useOrganizationsByPartnership('sponsor')
}

// Hook pour les mentors organisationnels
export const useMentorOrganizations = () => {
  return useOrganizationsByPartnership('mentor')
}

// Hook pour les partenaires académiques
export const useAcademicPartners = () => {
  return useOrganizationsByPartnership('academic')
}

// Hook pour les partenaires techniques
export const useTechnicalPartners = () => {
  return useOrganizationsByPartnership('technical')
}

// Hook pour les partenaires ressources
export const useResourcePartners = () => {
  return useOrganizationsByPartnership('resource')
}
