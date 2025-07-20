import React, { useState } from 'react'
import { Search, MessageCircle, Users, TrendingUp, Pin, Plus, Eye, Heart, MessageSquare, Clock, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AvatarPlaceholder } from '@/components/ui/placeholder-image'
import { Link } from 'react-router-dom'
import { useForum } from '@/hooks/useForum'

const Forum: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')

  // Utilisation des vraies APIs Django
  const {
    data: categories = [],
    isLoading,
    error
  } = useForum({
    search: searchQuery,
  })

  // Mock data de fallback si pas de données
  const mockCategories = [
    {
      id: '1',
      name: 'Général',
      description: 'Discussions générales sur Community Lab',
      icon: '💬',
      topicsCount: 156,
      postsCount: 1240,
      color: 'bg-blue-100 text-blue-800',
      lastPost: {
        title: 'Bienvenue aux nouveaux membres !',
        author: 'Admin',
        date: '2024-01-20T10:30:00Z'
      }
    },
    {
      id: '2',
      name: 'Entrepreneuriat',
      description: 'Partagez vos idées business et projets',
      icon: '🚀',
      topicsCount: 89,
      postsCount: 567,
      color: 'bg-orange-100 text-orange-800',
      lastPost: {
        title: 'Recherche co-fondateur pour startup AgriTech',
        author: 'Marie UWIMANA',
        date: '2024-01-19T15:45:00Z'
      }
    },
    {
      id: '3',
      name: 'Technologie',
      description: 'Discussions techniques et innovations',
      icon: '💻',
      topicsCount: 134,
      postsCount: 892,
      color: 'bg-green-100 text-green-800',
      lastPost: {
        title: 'Tutoriel: Impression 3D pour débutants',
        author: 'Paul NDAYISENGA',
        date: '2024-01-19T14:20:00Z'
      }
    },
    {
      id: '4',
      name: 'Fab Lab',
      description: 'Équipements, projets et fabrication',
      icon: '🔧',
      topicsCount: 67,
      postsCount: 423,
      color: 'bg-purple-100 text-purple-800',
      lastPost: {
        title: 'Nouveau: Découpeuse laser disponible',
        author: 'Fab Manager',
        date: '2024-01-18T16:10:00Z'
      }
    },
    {
      id: '5',
      name: 'Formations',
      description: 'Cours, ateliers et apprentissage',
      icon: '📚',
      topicsCount: 45,
      postsCount: 298,
      color: 'bg-yellow-100 text-yellow-800',
      lastPost: {
        title: 'Nouveau cours Python disponible',
        author: 'Dr. Jean NKURUNZIZA',
        date: '2024-01-18T11:30:00Z'
      }
    },
    {
      id: '6',
      name: 'Événements',
      description: 'Annonces et discussions sur les événements',
      icon: '📅',
      topicsCount: 23,
      postsCount: 156,
      color: 'bg-pink-100 text-pink-800',
      lastPost: {
        title: 'Hackathon Innovation Burundi 2024',
        author: 'Event Team',
        date: '2024-01-17T09:15:00Z'
      }
    }
  ]

  const recentTopics = [
    {
      id: '1',
      title: 'Comment développer l\'écosystème tech au Burundi ?',
      author: {
        name: 'Alice NIYONKURU',
        avatar: null,
        role: 'Entrepreneur'
      },
      category: 'Entrepreneuriat',
      isPinned: true,
      replies: 23,
      views: 456,
      likes: 12,
      lastActivity: '2024-01-20T08:30:00Z',
      tags: ['Écosystème', 'Tech', 'Burundi', 'Innovation']
    },
    {
      id: '2',
      title: 'Partage d\'expérience: Mon premier prototype avec Arduino',
      author: {
        name: 'David HAKIZIMANA',
        avatar: null,
        role: 'Student'
      },
      category: 'Technologie',
      isPinned: false,
      replies: 15,
      views: 234,
      likes: 8,
      lastActivity: '2024-01-19T16:45:00Z',
      tags: ['Arduino', 'Prototype', 'IoT', 'Débutant']
    },
    {
      id: '3',
      title: 'Recherche mentor en développement mobile',
      author: {
        name: 'Sarah NDAYISHIMIYE',
        avatar: null,
        role: 'Student'
      },
      category: 'Général',
      isPinned: false,
      replies: 7,
      views: 123,
      likes: 5,
      lastActivity: '2024-01-19T14:20:00Z',
      tags: ['Mentorat', 'Mobile', 'Flutter', 'React Native']
    },
    {
      id: '4',
      title: 'Problème avec l\'imprimante 3D - Filament qui colle pas',
      author: {
        name: 'Pierre NZEYIMANA',
        avatar: null,
        role: 'Maker'
      },
      category: 'Fab Lab',
      isPinned: false,
      replies: 11,
      views: 189,
      likes: 3,
      lastActivity: '2024-01-19T12:10:00Z',
      tags: ['Impression 3D', 'Problème', 'Filament', 'Aide']
    },
    {
      id: '5',
      title: 'Idée de startup: Application pour agriculteurs burundais',
      author: {
        name: 'Emmanuel BIZIMANA',
        avatar: null,
        role: 'Entrepreneur'
      },
      category: 'Entrepreneuriat',
      isPinned: false,
      replies: 19,
      views: 345,
      likes: 14,
      lastActivity: '2024-01-18T18:30:00Z',
      tags: ['Agriculture', 'Mobile App', 'Startup', 'AgriTech']
    }
  ]

  const trendingTopics = [
    { tag: 'Intelligence Artificielle', count: 45 },
    { tag: 'Entrepreneuriat Social', count: 38 },
    { tag: 'Impression 3D', count: 32 },
    { tag: 'Agriculture Intelligente', count: 28 },
    { tag: 'Financement Startup', count: 25 }
  ]

  const getTimeAgo = (date: string) => {
    const now = new Date()
    const past = new Date(date)
    const diffInHours = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Il y a moins d\'une heure'
    if (diffInHours < 24) return `Il y a ${diffInHours}h`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `Il y a ${diffInDays}j`
    return past.toLocaleDateString('fr-FR')
  }

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'mentor': return 'bg-blue-100 text-blue-800'
      case 'entrepreneur': return 'bg-orange-100 text-orange-800'
      case 'student': return 'bg-green-100 text-green-800'
      case 'maker': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center">
              <MessageCircle className="mr-3" />
              Forum Communautaire
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Échangez, partagez et collaborez avec la communauté burundaise de l'innovation
            </p>
            
            {/* Barre de recherche */}
            <div className="relative max-w-2xl mx-auto mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Rechercher dans les discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg bg-white text-gray-900"
              />
            </div>

            <Button asChild size="lg" className="bg-white text-indigo-600 hover:bg-white/90">
              <Link to="/forum/create">
                <Plus className="w-5 h-5 mr-2" />
                Créer une discussion
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="categories" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="categories">Catégories</TabsTrigger>
                <TabsTrigger value="recent">Récent</TabsTrigger>
                <TabsTrigger value="trending">Tendances</TabsTrigger>
              </TabsList>

              <TabsContent value="categories" className="mt-6">
                {/* Gestion du loading */}
                {isLoading && (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                    <span className="ml-2 text-lg">Chargement des catégories...</span>
                  </div>
                )}

                {/* Gestion des erreurs */}
                {error && (
                  <div className="text-center py-12">
                    <div className="text-red-500 mb-4">
                      ❌ Erreur lors du chargement des catégories
                    </div>
                    <p className="text-muted-foreground">
                      {error.message || 'Une erreur est survenue'}
                    </p>
                  </div>
                )}

                {/* Liste des catégories */}
                {!isLoading && !error && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(Array.isArray(categories) && categories.length > 0 ? categories : mockCategories).map(category => (
                    <Card key={category.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <span className="text-2xl">{category.icon}</span>
                          <div>
                            <h3 className="text-lg font-bold">{category.name}</h3>
                            <p className="text-sm text-muted-foreground font-normal">
                              {category.description}
                            </p>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>{category.topicsCount} sujets</span>
                            <span>{category.postsCount} messages</span>
                          </div>
                          <Badge className={category.color}>
                            {category.name}
                          </Badge>
                        </div>
                        
                        <div className="border-t pt-3">
                          <div className="text-sm">
                            <div className="font-medium text-foreground mb-1">
                              Dernier message: {category.lastPost.title}
                            </div>
                            <div className="text-muted-foreground">
                              Par {category.lastPost.author} • {getTimeAgo(category.lastPost.date)}
                            </div>
                          </div>
                        </div>

                        <Button asChild className="w-full mt-4" variant="outline">
                          <Link to={`/forum/category/${category.id}`}>
                            Voir les discussions
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="recent" className="mt-6">
                <div className="space-y-4">
                  {recentTopics.map(topic => (
                    <Card key={topic.id} className="hover:shadow-md transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <AvatarPlaceholder name={topic.author.name} size={40} />
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              {topic.isPinned && (
                                <Pin className="w-4 h-4 text-yellow-500" />
                              )}
                              <Link 
                                to={`/forum/topic/${topic.id}`}
                                className="font-semibold text-lg hover:text-primary transition-colors line-clamp-1"
                              >
                                {topic.title}
                              </Link>
                            </div>
                            
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-sm font-medium">{topic.author.name}</span>
                              <Badge className={getRoleColor(topic.author.role)} variant="secondary">
                                {topic.author.role}
                              </Badge>
                              <Badge variant="outline">{topic.category}</Badge>
                              <span className="text-sm text-muted-foreground">
                                {getTimeAgo(topic.lastActivity)}
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-1 mb-3">
                              {topic.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>

                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MessageSquare className="w-4 h-4" />
                                {topic.replies} réponses
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {topic.views} vues
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="w-4 h-4" />
                                {topic.likes} likes
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="trending" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Sujets tendances
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {trendingTopics.map((topic, index) => (
                          <div key={topic.tag} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-primary">#{index + 1}</span>
                              <span className="font-medium">{topic.tag}</span>
                            </div>
                            <Badge variant="secondary">{topic.count} posts</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Membres actifs
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {['Marie UWIMANA', 'Jean NKURUNZIZA', 'Paul NDAYISENGA', 'Sarah NDAYISHIMIYE', 'David HAKIZIMANA'].map((name, index) => (
                          <div key={name} className="flex items-center gap-3">
                            <AvatarPlaceholder name={name} size={32} />
                            <div className="flex-1">
                              <div className="font-medium text-sm">{name}</div>
                              <div className="text-xs text-muted-foreground">
                                {Math.floor(Math.random() * 50) + 10} contributions
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Statistiques */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Statistiques</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Discussions:</span>
                    <span className="font-semibold">514</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Messages:</span>
                    <span className="font-semibold">3,576</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Membres:</span>
                    <span className="font-semibold">1,234</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">En ligne:</span>
                    <span className="font-semibold text-green-600">89</span>
                  </div>
                </CardContent>
              </Card>

              {/* Règles du forum */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Règles du Forum</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>• Respectez les autres membres</p>
                  <p>• Utilisez un langage approprié</p>
                  <p>• Restez dans le sujet</p>
                  <p>• Pas de spam ou publicité</p>
                  <p>• Partagez vos connaissances</p>
                  <Button asChild variant="outline" size="sm" className="w-full mt-3">
                    <Link to="/forum/rules">
                      Voir toutes les règles
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Actions rapides */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Actions Rapides</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button asChild className="w-full" size="sm">
                    <Link to="/forum/create">
                      <Plus className="w-4 h-4 mr-2" />
                      Nouvelle discussion
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full" size="sm">
                    <Link to="/forum/my-topics">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Mes discussions
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full" size="sm">
                    <Link to="/forum/notifications">
                      <Clock className="w-4 h-4 mr-2" />
                      Notifications
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Forum
