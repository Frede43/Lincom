import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { equipmentAPI } from '@/lib/api'
import { Equipment, EquipmentReservation, PaginatedResponse } from '@/types/api'
import { toast } from 'sonner'

// Query keys
export const equipmentKeys = {
  all: ['equipment'] as const,
  lists: () => [...equipmentKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...equipmentKeys.lists(), { filters }] as const,
  details: () => [...equipmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...equipmentKeys.details(), id] as const,
  categories: () => [...equipmentKeys.all, 'categories'] as const,
  reservations: () => [...equipmentKeys.all, 'reservations'] as const,
  userReservations: () => [...equipmentKeys.all, 'user-reservations'] as const,
  availability: (equipmentId: string, date?: string) => 
    [...equipmentKeys.all, 'availability', equipmentId, date] as const,
  reviews: (equipmentId: string) => [...equipmentKeys.all, 'reviews', equipmentId] as const,
  stats: () => [...equipmentKeys.all, 'stats'] as const,
}

// Hooks pour les équipements
export const useEquipment = (filters?: {
  category?: string
  status?: string
  location?: string
  search?: string
  available_only?: boolean
}) => {
  return useQuery({
    queryKey: equipmentKeys.list(filters || {}),
    queryFn: () => equipmentAPI.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useEquipmentDetail = (id: string) => {
  return useQuery({
    queryKey: equipmentKeys.detail(id),
    queryFn: () => equipmentAPI.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export const useEquipmentCategories = () => {
  return useQuery({
    queryKey: equipmentKeys.categories(),
    queryFn: () => equipmentAPI.getCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}

export const useEquipmentAvailability = (equipmentId: string, date?: string) => {
  return useQuery({
    queryKey: equipmentKeys.availability(equipmentId, date),
    queryFn: () => equipmentAPI.getAvailability(equipmentId, date),
    enabled: !!equipmentId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useReservations = (filters?: {
  equipment?: string
  user?: string
  status?: string
  date_from?: string
  date_to?: string
}) => {
  return useQuery({
    queryKey: equipmentKeys.reservations(),
    queryFn: () => equipmentAPI.getReservations(filters),
    staleTime: 2 * 60 * 1000,
  })
}

export const useUserReservations = () => {
  return useQuery({
    queryKey: equipmentKeys.userReservations(),
    queryFn: () => equipmentAPI.getUserReservations(),
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

export const useEquipmentReviews = (equipmentId: string) => {
  return useQuery({
    queryKey: equipmentKeys.reviews(equipmentId),
    queryFn: () => equipmentAPI.getReviews(equipmentId),
    enabled: !!equipmentId,
    staleTime: 5 * 60 * 1000,
  })
}

export const useEquipmentStats = () => {
  return useQuery({
    queryKey: equipmentKeys.stats(),
    queryFn: () => equipmentAPI.getStats(),
    staleTime: 5 * 60 * 1000,
  })
}

// Mutations pour les équipements
export const useCreateReservation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ equipmentId, reservationData }: { 
      equipmentId: string; 
      reservationData: any 
    }) =>
      equipmentAPI.reserve(equipmentId, reservationData),
    onSuccess: (data, { equipmentId }) => {
      // Invalider les caches pertinents
      queryClient.invalidateQueries({ queryKey: equipmentKeys.reservations() })
      queryClient.invalidateQueries({ queryKey: equipmentKeys.userReservations() })
      queryClient.invalidateQueries({ queryKey: equipmentKeys.availability(equipmentId) })
      queryClient.invalidateQueries({ queryKey: equipmentKeys.detail(equipmentId) })
      
      toast.success('Réservation créée avec succès !')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la création de la réservation')
    },
  })
}

export const useUpdateReservation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      equipmentAPI.updateReservation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: equipmentKeys.reservations() })
      queryClient.invalidateQueries({ queryKey: equipmentKeys.userReservations() })
      
      toast.success('Réservation mise à jour avec succès !')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la mise à jour de la réservation')
    },
  })
}

export const useCancelReservation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => equipmentAPI.cancelReservation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: equipmentKeys.reservations() })
      queryClient.invalidateQueries({ queryKey: equipmentKeys.userReservations() })
      
      toast.success('Réservation annulée avec succès !')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de l\'annulation de la réservation')
    },
  })
}

export const useCreateEquipment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (equipmentData: any) => equipmentAPI.create(equipmentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: equipmentKeys.lists() })
      queryClient.invalidateQueries({ queryKey: equipmentKeys.stats() })
      
      toast.success('Équipement créé avec succès !')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la création de l\'équipement')
    },
  })
}

export const useUpdateEquipment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      equipmentAPI.update(id, data),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: equipmentKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: equipmentKeys.lists() })
      
      toast.success('Équipement mis à jour avec succès !')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la mise à jour de l\'équipement')
    },
  })
}

export const useDeleteEquipment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => equipmentAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: equipmentKeys.lists() })
      queryClient.invalidateQueries({ queryKey: equipmentKeys.stats() })
      
      toast.success('Équipement supprimé avec succès !')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la suppression de l\'équipement')
    },
  })
}

export const useAddEquipmentReview = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ 
      equipmentId, 
      review 
    }: { 
      equipmentId: string; 
      review: { rating: number; comment: string } 
    }) =>
      equipmentAPI.addReview(equipmentId, review),
    onSuccess: (data, { equipmentId }) => {
      queryClient.invalidateQueries({ queryKey: equipmentKeys.reviews(equipmentId) })
      queryClient.invalidateQueries({ queryKey: equipmentKeys.detail(equipmentId) })
      
      toast.success('Avis ajouté avec succès !')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de l\'ajout de l\'avis')
    },
  })
}
