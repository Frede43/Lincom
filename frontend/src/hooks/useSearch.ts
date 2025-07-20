import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { searchAPI } from '@/lib/api'
import { SearchResult, SearchFilters, PaginatedResponse } from '@/types/api'
import { useState, useEffect, useMemo } from 'react'
import { useDebounce } from './useDebounce'

// Query keys
export const searchKeys = {
  all: ['search'] as const,
  results: () => [...searchKeys.all, 'results'] as const,
  result: (query: string, filters: SearchFilters) => 
    [...searchKeys.results(), { query, filters }] as const,
  suggestions: () => [...searchKeys.all, 'suggestions'] as const,
  suggestion: (query: string) => [...searchKeys.suggestions(), query] as const,
  trending: () => [...searchKeys.all, 'trending'] as const,
  recent: () => [...searchKeys.all, 'recent'] as const,
}

// Hook principal pour la recherche
export const useSearch = (
  query: string,
  filters?: SearchFilters,
  options?: {
    enabled?: boolean
    page?: number
    page_size?: number
  }
) => {
  const debouncedQuery = useDebounce(query, 300) // Debounce de 300ms

  return useQuery({
    queryKey: searchKeys.result(debouncedQuery, filters || {}),
    queryFn: () => searchAPI.search(debouncedQuery, {
      ...filters,
      page: options?.page,
      page_size: options?.page_size,
    }),
    enabled: (options?.enabled !== false) && debouncedQuery.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook pour les suggestions de recherche
export const useSearchSuggestions = (query: string) => {
  const debouncedQuery = useDebounce(query, 200) // Debounce plus court pour les suggestions

  return useQuery({
    queryKey: searchKeys.suggestion(debouncedQuery),
    queryFn: () => searchAPI.suggestions(debouncedQuery),
    enabled: debouncedQuery.length >= 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hook pour les recherches tendances
export const useTrendingSearches = () => {
  return useQuery({
    queryKey: searchKeys.trending(),
    queryFn: () => searchAPI.trending(),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 heure
  })
}

// Hook pour les recherches récentes de l'utilisateur
export const useRecentSearches = () => {
  return useQuery({
    queryKey: searchKeys.recent(),
    queryFn: () => searchAPI.recent(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  })
}

// Hook personnalisé pour la recherche avec état local
export const useSearchWithState = () => {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({})
  const [page, setPage] = useState(1)
  const [isSearching, setIsSearching] = useState(false)

  // Recherche principale
  const searchQuery = useSearch(query, filters, { page, page_size: 20 })

  // Suggestions
  const suggestionsQuery = useSearchSuggestions(query)

  // Recherches tendances
  const trendingQuery = useTrendingSearches()

  // Recherches récentes
  const recentQuery = useRecentSearches()

  // Fonction pour effectuer une recherche
  const performSearch = (newQuery: string, newFilters?: SearchFilters) => {
    setQuery(newQuery)
    if (newFilters) {
      setFilters(newFilters)
    }
    setPage(1)
    setIsSearching(true)
  }

  // Fonction pour changer de page
  const changePage = (newPage: number) => {
    setPage(newPage)
  }

  // Fonction pour mettre à jour les filtres
  const updateFilters = (newFilters: SearchFilters) => {
    setFilters(newFilters)
    setPage(1)
  }

  // Fonction pour réinitialiser la recherche
  const resetSearch = () => {
    setQuery('')
    setFilters({})
    setPage(1)
    setIsSearching(false)
  }

  // Effet pour arrêter l'état de recherche quand les résultats arrivent
  useEffect(() => {
    if (searchQuery.data || searchQuery.error) {
      setIsSearching(false)
    }
  }, [searchQuery.data, searchQuery.error])

  // Résultats groupés par type
  const resultsByType = useMemo(() => {
    if (!searchQuery.data?.results) return {}

    return searchQuery.data.results.reduce((acc, result) => {
      if (!acc[result.type]) {
        acc[result.type] = []
      }
      acc[result.type].push(result)
      return acc
    }, {} as Record<string, SearchResult[]>)
  }, [searchQuery.data?.results])

  return {
    // État
    query,
    filters,
    page,
    isSearching: isSearching || searchQuery.isFetching,

    // Données
    results: searchQuery.data?.results || [],
    totalResults: searchQuery.data?.count || 0,
    totalPages: searchQuery.data?.total_pages || 0,
    resultsByType,
    suggestions: suggestionsQuery.data || [],
    trending: trendingQuery.data || [],
    recent: recentQuery.data || [],

    // États de chargement
    isLoadingResults: searchQuery.isLoading,
    isLoadingSuggestions: suggestionsQuery.isLoading,
    isLoadingTrending: trendingQuery.isLoading,
    isLoadingRecent: recentQuery.isLoading,

    // Erreurs
    searchError: searchQuery.error,
    suggestionsError: suggestionsQuery.error,

    // Actions
    performSearch,
    changePage,
    updateFilters,
    resetSearch,
    setQuery,

    // Refetch functions
    refetchResults: searchQuery.refetch,
    refetchSuggestions: suggestionsQuery.refetch,
    refetchTrending: trendingQuery.refetch,
    refetchRecent: recentQuery.refetch,
  }
}

// Hook pour la recherche par type spécifique
export const useSearchByType = (
  query: string,
  type: string,
  options?: { enabled?: boolean }
) => {
  return useSearch(
    query,
    { type: [type] },
    { enabled: options?.enabled }
  )
}

// Hooks spécialisés pour chaque type de contenu
export const useSearchCourses = (query: string, enabled = true) => {
  return useSearchByType(query, 'course', { enabled })
}

export const useSearchProjects = (query: string, enabled = true) => {
  return useSearchByType(query, 'project', { enabled })
}

export const useSearchForumTopics = (query: string, enabled = true) => {
  return useSearchByType(query, 'forum_topic', { enabled })
}

export const useSearchEquipment = (query: string, enabled = true) => {
  return useSearchByType(query, 'equipment', { enabled })
}

export const useSearchOrganizations = (query: string, enabled = true) => {
  return useSearchByType(query, 'organization', { enabled })
}

export const useSearchUsers = (query: string, enabled = true) => {
  return useSearchByType(query, 'user', { enabled })
}

// Hook pour la recherche avancée avec filtres multiples
export const useAdvancedSearch = () => {
  const [searchState, setSearchState] = useState({
    query: '',
    filters: {} as SearchFilters,
    page: 1,
  })

  const searchQuery = useSearch(
    searchState.query,
    searchState.filters,
    { page: searchState.page }
  )

  const updateSearch = (updates: Partial<typeof searchState>) => {
    setSearchState(prev => ({
      ...prev,
      ...updates,
      page: updates.query !== undefined || updates.filters !== undefined ? 1 : prev.page,
    }))
  }

  return {
    ...searchQuery,
    searchState,
    updateSearch,
  }
}
