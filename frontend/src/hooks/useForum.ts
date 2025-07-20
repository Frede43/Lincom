import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { forumAPI } from '@/lib/api'
import { ForumCategory, ForumTopic, ForumPost, PaginatedResponse } from '@/types/api'
import { toast } from 'sonner'

// Query keys
export const forumKeys = {
  all: ['forum'] as const,
  categories: () => [...forumKeys.all, 'categories'] as const,
  category: (id: string) => [...forumKeys.all, 'category', id] as const,
  topics: () => [...forumKeys.all, 'topics'] as const,
  topicsList: (filters: Record<string, any>) => [...forumKeys.topics(), { filters }] as const,
  topic: (id: string) => [...forumKeys.all, 'topic', id] as const,
  posts: (topicId: string) => [...forumKeys.all, 'posts', topicId] as const,
  userTopics: () => [...forumKeys.all, 'user-topics'] as const,
  userPosts: () => [...forumKeys.all, 'user-posts'] as const,
}

// Hooks pour les catégories
export const useForumCategories = () => {
  return useQuery({
    queryKey: forumKeys.categories(),
    queryFn: () => forumAPI.getCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  })
}

// Alias pour useForum (utilisé dans Forum.tsx)
export const useForum = useForumCategories

export const useForumCategory = (id: string) => {
  return useQuery({
    queryKey: forumKeys.category(id),
    queryFn: () => forumAPI.getCategoryById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hooks pour les topics
export const useForumTopics = (filters?: {
  category?: string
  author?: string
  search?: string
  page?: number
  ordering?: string
}) => {
  return useQuery({
    queryKey: forumKeys.topicsList(filters || {}),
    queryFn: () => forumAPI.getTopics(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useForumTopic = (id: string) => {
  return useQuery({
    queryKey: forumKeys.topic(id),
    queryFn: () => forumAPI.getTopicById(id),
    enabled: !!id,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

// Hooks pour les posts
export const useForumPosts = (topicId: string, params?: { page?: number }) => {
  return useQuery({
    queryKey: forumKeys.posts(topicId),
    queryFn: () => forumAPI.getPosts(topicId, params),
    enabled: !!topicId,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

// Hooks pour les contenus utilisateur
export const useUserTopics = () => {
  return useQuery({
    queryKey: forumKeys.userTopics(),
    queryFn: () => forumAPI.getUserTopics(),
    staleTime: 2 * 60 * 1000,
  })
}

export const useUserPosts = () => {
  return useQuery({
    queryKey: forumKeys.userPosts(),
    queryFn: () => forumAPI.getUserPosts(),
    staleTime: 2 * 60 * 1000,
  })
}

// Mutations pour les topics
export const useCreateTopic = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (topicData: {
      title: string
      content: string
      category: string
      tags?: string[]
      is_anonymous?: boolean
    }) => forumAPI.createTopic(topicData),
    onSuccess: (data) => {
      // Invalider les listes de topics
      queryClient.invalidateQueries({ queryKey: forumKeys.topics() })
      queryClient.invalidateQueries({ queryKey: forumKeys.userTopics() })
      
      // Invalider la catégorie si spécifiée
      if (data.category) {
        queryClient.invalidateQueries({ queryKey: forumKeys.category(data.category) })
      }
      
      toast.success('Discussion créée avec succès !')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la création de la discussion')
    },
  })
}

export const useUpdateTopic = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      forumAPI.updateTopic(id, data),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: forumKeys.topic(id) })
      queryClient.invalidateQueries({ queryKey: forumKeys.topics() })
      queryClient.invalidateQueries({ queryKey: forumKeys.userTopics() })
      
      toast.success('Discussion mise à jour avec succès !')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la mise à jour de la discussion')
    },
  })
}

export const useDeleteTopic = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => forumAPI.deleteTopic(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: forumKeys.topics() })
      queryClient.invalidateQueries({ queryKey: forumKeys.userTopics() })
      
      toast.success('Discussion supprimée avec succès !')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la suppression de la discussion')
    },
  })
}

// Mutations pour les posts
export const useCreatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ 
      topicId, 
      postData 
    }: { 
      topicId: string; 
      postData: {
        content: string
        parent?: string
      }
    }) => forumAPI.createPost(topicId, postData),
    onSuccess: (data, { topicId }) => {
      queryClient.invalidateQueries({ queryKey: forumKeys.posts(topicId) })
      queryClient.invalidateQueries({ queryKey: forumKeys.topic(topicId) })
      queryClient.invalidateQueries({ queryKey: forumKeys.userPosts() })
      
      toast.success('Réponse ajoutée avec succès !')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de l\'ajout de la réponse')
    },
  })
}

export const useUpdatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ 
      topicId, 
      postId, 
      data 
    }: { 
      topicId: string; 
      postId: string; 
      data: any 
    }) => forumAPI.updatePost(topicId, postId, data),
    onSuccess: (data, { topicId }) => {
      queryClient.invalidateQueries({ queryKey: forumKeys.posts(topicId) })
      queryClient.invalidateQueries({ queryKey: forumKeys.userPosts() })
      
      toast.success('Message mis à jour avec succès !')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la mise à jour du message')
    },
  })
}

export const useDeletePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ topicId, postId }: { topicId: string; postId: string }) =>
      forumAPI.deletePost(topicId, postId),
    onSuccess: (data, { topicId }) => {
      queryClient.invalidateQueries({ queryKey: forumKeys.posts(topicId) })
      queryClient.invalidateQueries({ queryKey: forumKeys.topic(topicId) })
      queryClient.invalidateQueries({ queryKey: forumKeys.userPosts() })
      
      toast.success('Message supprimé avec succès !')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la suppression du message')
    },
  })
}

// Mutations pour les interactions
export const useLikeTopic = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (topicId: string) => forumAPI.likeTopic(topicId),
    onSuccess: (data, topicId) => {
      queryClient.invalidateQueries({ queryKey: forumKeys.topic(topicId) })
      queryClient.invalidateQueries({ queryKey: forumKeys.topics() })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors du like')
    },
  })
}

export const useUnlikeTopic = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (topicId: string) => forumAPI.unlikeTopic(topicId),
    onSuccess: (data, topicId) => {
      queryClient.invalidateQueries({ queryKey: forumKeys.topic(topicId) })
      queryClient.invalidateQueries({ queryKey: forumKeys.topics() })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors du unlike')
    },
  })
}

export const useLikePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ topicId, postId }: { topicId: string; postId: string }) =>
      forumAPI.likePost(topicId, postId),
    onSuccess: (data, { topicId }) => {
      queryClient.invalidateQueries({ queryKey: forumKeys.posts(topicId) })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors du like')
    },
  })
}

export const useUnlikePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ topicId, postId }: { topicId: string; postId: string }) =>
      forumAPI.unlikePost(topicId, postId),
    onSuccess: (data, { topicId }) => {
      queryClient.invalidateQueries({ queryKey: forumKeys.posts(topicId) })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors du unlike')
    },
  })
}
