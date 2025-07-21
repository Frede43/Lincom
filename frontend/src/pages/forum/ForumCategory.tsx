import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  MessageCircle, Users, TrendingUp, Pin, Plus, Eye, Heart, 
  MessageSquare, Clock, ArrowLeft, Filter, Search, Calendar
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AvatarPlaceholder } from '@/components/ui/placeholder-image'

const ForumCategory: React.FC = () => {
  const { categoryId } = useParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('recent')

  // Mock data - sera remplacé par les vrais hooks
  const category = {
    id: categoryId,
    name: 'Entrepreneuriat',
    description: 'Partagez vos idées business et projets entrepreneuriaux',
    icon: '🚀',
    color: 'bg-orange-100 text-orange-800',
    topicsCount: 89,
    postsCount: 567,
    followersCount: 234
  }

  const topics = [
    {
      id: '1',
      title: 'Comment développer l\'écosystème tech au Burundi ?',
      author: {
        name: 'Alice NIYONKURU',
        avatar: null,
        role: 'Entrepreneur'
      },
      isPinned: true,
      replies: 23,
      views: 456,
      likes: 12,
      lastActivity: '2024-01-20T08:30:00Z',
      lastReply: {
        author: 'Marie UWIMANA',
        date: '2024-01-20T08:30:00Z'
      },
      tags: ['Écosystème', 'Tech', 'Burundi', 'Innovation'],
      isHot: true
    },
    {
      id: '2',
      title: 'Recherche co-fondateur pour startup AgriTech',
      author: {
        name: 'Jean NKURUNZIZA',
        avatar: null,
        role: 'Founder'
      },
      isPinned: false,
      replies: 15,
      views: 234,
      likes: 8,
      lastActivity: '2024-01-19T16:45:00Z',
      lastReply: {
        author: 'Paul NDAYISENGA',
        date: '2024-01-19T16:45:00Z'
      },
      tags: ['Co-fondateur', 'AgriTech', 'Startup', 'Partenariat'],
      isHot: false
    },
    {
      id: '3',
      title: 'Financement startup au Burundi : guide complet',
      author: {
        name: 'Marie UWIMANA',
        avatar: null,
        role: 'Investor'
      },
      isPinned: false,
      replies: 31,
      views: 789,
      likes: 25,
      lastActivity: '2024-01-19T14:20:00Z',
      lastReply: {
        author: 'David HAKIZIMANA',
        date: '2024-01-19T14:20:00Z'
      },
      tags: ['Financement', 'Guide', 'Investissement', 'Startup'],
      isHot: true
    },
    {
      id: '4',
      title: 'Retour d\'expérience : Mon échec entrepreneurial',
      author: {
        name: 'Paul NDAYISENGA',
        avatar: null,
        role: 'Entrepreneur'
      },
      isPinned: false,
      replies: 18,
      views: 345,
      likes: 14,
      lastActivity: '2024-01-18T18:30:00Z',
      lastReply: {
        author: 'Sarah NDAYISHIMIYE',
        date: '2024-01-18T18:30:00Z'
      },
      tags: ['Expérience', 'Échec', 'Apprentissage', 'Motivation'],
      isHot: false
    }
  ]

  const sortOptions = [
    { value: 'recent', label: 'Plus récent' },
    { value: 'popular', label: 'Plus populaire' },
    { value: 'replies', label: 'Plus de réponses' },
    { value: 'views', label: 'Plus de vues' }
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
      case 'founder': return 'bg-purple-100 text-purple-800'
      case 'investor': return 'bg-green-100 text-green-800'
      case 'student': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredTopics = topics.filter(topic =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/forum" className="hover:text-primary flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              Forum
            </Link>
            <span>/</span>
            <span className="text-foreground">{category.name}</span>
          </div>
        </div>
      </div>

      {/* Header de catégorie */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl">{category.icon}</div>
              <div>
                <h1 className="text-3xl font-bold">{category.name}</h1>
                <p className="text-xl text-white/90">{category.description}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-white/90">
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                {category.topicsCount} sujets
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                {category.postsCount} messages
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {category.followersCount} abonnés
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-3">
            {/* Barre d'actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Rechercher dans cette catégorie..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button asChild>
                <Link to="/forum/create">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau sujet
                </Link>
              </Button>
            </div>

            {/* Liste des sujets */}
            <div className="space-y-4">
              {filteredTopics.map(topic => (
                <Card key={topic.id} className="hover:shadow-md transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <AvatarPlaceholder name={topic.author.name} size={40} />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {topic.isPinned && (
                            <Pin className="w-4 h-4 text-yellow-500" />
                          )}
                          {topic.isHot && (
                            <Badge className="bg-red-100 text-red-800">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Hot
                            </Badge>
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

                        <div className="flex items-center justify-between">
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
                          
                          <div className="text-sm text-muted-foreground">
                            Dernière réponse par <span className="font-medium">{topic.lastReply.author}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Message si aucun résultat */}
            {filteredTopics.length === 0 && (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Aucun sujet trouvé</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? 
                    'Essayez de modifier votre recherche ou explorez d\'autres sujets.' :
                    'Soyez le premier à créer un sujet dans cette catégorie !'
                  }
                </p>
                <Button asChild>
                  <Link to="/forum/create">
                    <Plus className="w-4 h-4 mr-2" />
                    Créer le premier sujet
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Statistiques de la catégorie */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Statistiques</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sujets:</span>
                    <span className="font-semibold">{category.topicsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Messages:</span>
                    <span className="font-semibold">{category.postsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Abonnés:</span>
                    <span className="font-semibold">{category.followersCount}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Membres actifs */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Membres actifs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['Alice NIYONKURU', 'Marie UWIMANA', 'Jean NKURUNZIZA', 'Paul NDAYISENGA'].map((name, index) => (
                      <div key={name} className="flex items-center gap-3">
                        <AvatarPlaceholder name={name} size={32} />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{name}</div>
                          <div className="text-xs text-muted-foreground">
                            {Math.floor(Math.random() * 20) + 5} contributions
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Actions rapides */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button asChild className="w-full">
                    <Link to="/forum/create">
                      <Plus className="w-4 h-4 mr-2" />
                      Nouveau sujet
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Heart className="w-4 h-4 mr-2" />
                    S'abonner à la catégorie
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtres avancés
                  </Button>
                </CardContent>
              </Card>

              {/* Règles de la catégorie */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Règles</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>• Restez dans le thème entrepreneurial</p>
                  <p>• Partagez des expériences constructives</p>
                  <p>• Respectez la confidentialité</p>
                  <p>• Pas de promotion excessive</p>
                  <p>• Encouragez l'entraide</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForumCategory
