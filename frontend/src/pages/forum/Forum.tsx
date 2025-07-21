import React, { useState } from 'react'
import { Search, MessageCircle, Users, TrendingUp, Pin, Plus, Eye, Heart, MessageSquare, Clock, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AvatarPlaceholder } from '@/components/ui/placeholder-image'
import { Link } from 'react-router-dom'
import { useForumCategories } from '@/hooks/useForum'

const Forum: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')

  // Utilisation des vraies APIs Django
  const {
    data: categories = [],
    isLoading,
    error
  } = useForumCategories()

  // Gestion sécurisée des données
  const categoriesArray = React.useMemo(() => {
    if (!categories) return []
    if (Array.isArray(categories)) return categories
    if (categories.results && Array.isArray(categories.results)) return categories.results
    if (categories.data && Array.isArray(categories.data)) return categories.data
    console.warn('Categories data is not an array:', categories)
    return []
  }, [categories])

  const filteredCategories = React.useMemo(() => {
    return categoriesArray.filter(category =>
      category?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (category?.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [categoriesArray, searchQuery])

  // Fonctions utilitaires
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

  const getCategoryIcon = (categoryType: string) => {
    const icons: Record<string, string> = {
      'general': '💬',
      'help': '❓',
      'announcement': '📢',
      'feedback': '💭',
      'technical': '🔧',
      'showcase': '🎨'
    }
    return icons[categoryType] || '💬'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Chargement du forum...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Erreur de chargement</h1>
        <p className="text-muted-foreground mb-4">Impossible de charger les données du forum.</p>
        <Button onClick={() => window.location.reload()}>
          Réessayer
        </Button>
      </div>
    )
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
                placeholder="Rechercher dans le forum..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg bg-white/10 border-white/20 text-white placeholder:text-white/70"
              />
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold">{filteredCategories.length}</div>
                <div className="text-white/80">Catégories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {filteredCategories.reduce((sum, cat) => sum + (cat.topic_count || 0), 0)}
                </div>
                <div className="text-white/80">Sujets</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {filteredCategories.reduce((sum, cat) => sum + (cat.post_count || 0), 0)}
                </div>
                <div className="text-white/80">Messages</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="categories" className="w-full">
            <div className="flex justify-between items-center mb-6">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="categories">Catégories</TabsTrigger>
                <TabsTrigger value="recent">Récents</TabsTrigger>
              </TabsList>
              
              <Button asChild>
                <Link to="/forum/create">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau sujet
                </Link>
              </Button>
            </div>

            <TabsContent value="categories" className="mt-6">
              {/* Liste des catégories */}
              {!isLoading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredCategories.map(category => (
                    <Card key={category.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <span className="text-2xl">{getCategoryIcon(category.category_type)}</span>
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
                            <span>{category.topic_count || 0} sujets</span>
                            <span>{category.post_count || 0} messages</span>
                          </div>
                          <Badge style={{ backgroundColor: category.color }} className="text-white">
                            {category.category_type}
                          </Badge>
                        </div>
                        
                        {category.last_post && (
                          <div className="border-t pt-3">
                            <div className="text-sm">
                              <div className="font-medium text-foreground mb-1">
                                Dernier message
                              </div>
                              <div className="text-muted-foreground">
                                {getTimeAgo(category.updated_at)}
                              </div>
                            </div>
                          </div>
                        )}

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

              {filteredCategories.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Aucune catégorie trouvée</h3>
                  <p className="text-muted-foreground">
                    {searchQuery ? 'Essayez avec d\'autres mots-clés' : 'Les catégories seront bientôt disponibles'}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="recent" className="mt-6">
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Sujets récents</h3>
                <p className="text-muted-foreground mb-4">
                  Les discussions récentes apparaîtront ici
                </p>
                <Button asChild>
                  <Link to="/forum/create">
                    <Plus className="w-4 h-4 mr-2" />
                    Créer le premier sujet
                  </Link>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default Forum
