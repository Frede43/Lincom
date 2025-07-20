import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search as SearchIcon, Filter, Clock, TrendingUp, BookOpen, Rocket, Users, Wrench, MessageCircle, Building, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CourseImagePlaceholder, ProjectImagePlaceholder, AvatarPlaceholder, PlaceholderImage } from '@/components/ui/placeholder-image'
import { Link } from 'react-router-dom'
import { useSearch } from '@/hooks/useSearch'

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [category, setCategory] = useState(searchParams.get('category') || 'all')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'relevance')

  // Utilisation des vraies APIs Django
  const {
    data: searchResults,
    isLoading,
    error
  } = useSearch(
    query,
    {
      category: category !== 'all' ? category : undefined,
      sort_by: sortBy,
    },
    {
      enabled: query.length > 0, // Seulement rechercher si il y a une query
    }
  )

  // Mock data de fallback si pas de données
  const mockSearchResults = {
    courses: [
      {
        id: '1',
        title: 'Python pour l\'Agriculture Intelligente',
        description: 'Apprenez Python en développant des solutions pour l\'agriculture burundaise moderne.',
        instructor: 'Dr. Jean NKURUNZIZA',
        rating: 4.8,
        studentsCount: 1250,
        category: 'Programmation',
        level: 'Débutant',
        duration: '8 semaines'
      },
      {
        id: '2',
        title: 'Entrepreneuriat Social au Burundi',
        description: 'Créez votre entreprise sociale et générez un impact positif dans votre communauté.',
        instructor: 'Marie UWIMANA',
        rating: 4.9,
        studentsCount: 890,
        category: 'Business',
        level: 'Intermédiaire',
        duration: '6 semaines'
      }
    ],
    projects: [
      {
        id: '1',
        title: 'EcoFarm Solutions',
        description: 'Plateforme digitale pour optimiser la production agricole au Burundi avec IoT et IA.',
        founder: 'Marie UWIMANA',
        category: 'AgriTech',
        stage: 'MVP',
        followers: 156,
        fundingRaised: 15000,
        fundingGoal: 50000
      },
      {
        id: '2',
        title: 'BurundiCraft Marketplace',
        description: 'Marketplace en ligne pour promouvoir l\'artisanat burundais à l\'international.',
        founder: 'Jean NKURUNZIZA',
        category: 'E-commerce',
        stage: 'Prototype',
        followers: 89,
        fundingRaised: 8000,
        fundingGoal: 25000
      }
    ],
    users: [
      {
        id: '1',
        name: 'Dr. Jean NKURUNZIZA',
        title: 'Expert en AgriTech',
        bio: 'Spécialiste en agriculture intelligente et développement durable au Burundi.',
        role: 'Mentor',
        location: 'Bujumbura',
        skills: ['Python', 'Agriculture', 'IoT', 'Data Science'],
        coursesCount: 12,
        studentsCount: 2500
      },
      {
        id: '2',
        name: 'Marie UWIMANA',
        title: 'Entrepreneure Sociale',
        bio: 'Fondatrice de plusieurs startups à impact social au Burundi.',
        role: 'Entrepreneur',
        location: 'Gitega',
        skills: ['Business Development', 'Impact Social', 'Leadership'],
        coursesCount: 5,
        studentsCount: 890
      }
    ],
    equipment: [
      {
        id: '1',
        name: 'Imprimante 3D Prusa i3 MK3S+',
        description: 'Imprimante 3D haute précision pour prototypage rapide.',
        category: 'Impression 3D',
        status: 'available',
        location: 'Atelier Principal',
        hourlyRate: 5000
      },
      {
        id: '2',
        name: 'Découpeuse Laser CO2 40W',
        description: 'Découpeuse laser pour matériaux fins : bois, acrylique, carton.',
        category: 'Découpe Laser',
        status: 'maintenance',
        location: 'Atelier Laser',
        hourlyRate: 8000
      }
    ],
    discussions: [
      {
        id: '1',
        title: 'Comment développer l\'écosystème tech au Burundi ?',
        author: 'Alice NIYONKURU',
        category: 'Entrepreneuriat',
        replies: 23,
        views: 456,
        lastActivity: '2024-01-20T08:30:00Z'
      },
      {
        id: '2',
        title: 'Partage d\'expérience: Mon premier prototype avec Arduino',
        author: 'David HAKIZIMANA',
        category: 'Technologie',
        replies: 15,
        views: 234,
        lastActivity: '2024-01-19T16:45:00Z'
      }
    ],
    organizations: [
      {
        id: '1',
        name: 'Université du Burundi',
        description: 'Première université publique du Burundi, partenaire académique principal.',
        type: 'Université',
        sector: 'Éducation',
        location: 'Bujumbura',
        partnership: 'Partenaire Académique'
      }
    ]
  }

  const categories = [
    { value: 'all', label: 'Tout', icon: SearchIcon },
    { value: 'courses', label: 'Cours', icon: BookOpen },
    { value: 'projects', label: 'Projets', icon: Rocket },
    { value: 'users', label: 'Utilisateurs', icon: Users },
    { value: 'equipment', label: 'Équipements', icon: Wrench },
    { value: 'discussions', label: 'Discussions', icon: MessageCircle },
    { value: 'organizations', label: 'Organisations', icon: Building }
  ]

  const sortOptions = [
    { value: 'relevance', label: 'Pertinence' },
    { value: 'date', label: 'Date' },
    { value: 'popularity', label: 'Popularité' },
    { value: 'rating', label: 'Note' }
  ]

  const trendingSearches = [
    'Python agriculture',
    'Impression 3D',
    'Startup Burundi',
    'Arduino IoT',
    'Entrepreneuriat social',
    'Fab Lab',
    'AgriTech',
    'Innovation'
  ]

  const recentSearches = [
    'cours python',
    'imprimante 3d',
    'mentorat',
    'projet agriculture'
  ]

  useEffect(() => {
    // Mettre à jour l'URL quand les paramètres changent
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (category !== 'all') params.set('category', category)
    if (sortBy !== 'relevance') params.set('sort', sortBy)
    setSearchParams(params)
  }, [query, category, sortBy, setSearchParams])

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery)
  }

  const getTotalResults = () => {
    // Utiliser les vraies données ou les données mockées en fallback
    const displayResults = searchResults || mockSearchResults

    if (category === 'all') {
      return Object.values(displayResults).reduce((total, items) => total + (Array.isArray(items) ? items.length : 0), 0)
    }
    return displayResults[category as keyof typeof displayResults]?.length || 0
  }

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const past = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Il y a moins d\'une heure'
    if (diffInHours < 24) return `Il y a ${diffInHours}h`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `Il y a ${diffInDays}j`
    return past.toLocaleDateString('fr-FR')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center">
              <SearchIcon className="mr-3" />
              Recherche Globale
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Trouvez tout ce dont vous avez besoin dans l'écosystème Community Lab
            </p>
            
            {/* Barre de recherche principale */}
            <div className="relative max-w-2xl mx-auto">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Rechercher des cours, projets, utilisateurs, équipements..."
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg bg-white text-gray-900"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-3">
            {/* Filtres et tri */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">Filtres :</span>
                </div>
                
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        <div className="flex items-center gap-2">
                          <cat.icon className="w-4 h-4" />
                          {cat.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

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

              <div className="text-sm text-muted-foreground">
                {getTotalResults()} résultat{getTotalResults() > 1 ? 's' : ''} 
                {query && ` pour "${query}"`}
              </div>
            </div>

            {/* Résultats */}
            {query ? (
              <Tabs value={category} onValueChange={setCategory} className="w-full">
                <TabsList className="grid w-full grid-cols-7">
                  {categories.map(cat => (
                    <TabsTrigger key={cat.value} value={cat.value} className="text-xs">
                      <cat.icon className="w-3 h-3 mr-1" />
                      {cat.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="all" className="mt-6">
                  <div className="space-y-8">
                    {/* Cours */}
                    {(searchResults?.courses || mockSearchResults.courses).length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <BookOpen className="w-5 h-5" />
                          Cours ({(searchResults?.courses || mockSearchResults.courses).length})
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(searchResults?.courses || mockSearchResults.courses).map(course => (
                            <Card key={course.id} className="hover:shadow-md transition-all">
                              <CardContent className="p-4">
                                <div className="flex gap-3">
                                  <CourseImagePlaceholder
                                    title={course.title}
                                    category={course.category}
                                    className="w-16 h-12 rounded flex-shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <Link 
                                      to={`/courses/${course.id}`}
                                      className="font-medium hover:text-primary line-clamp-1"
                                    >
                                      {course.title}
                                    </Link>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                      {course.description}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                      <span>{course.instructor}</span>
                                      <span>•</span>
                                      <span>{course.studentsCount} étudiants</span>
                                      <span>•</span>
                                      <span>⭐ {course.rating}</span>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Projets */}
                    {(searchResults?.projects || mockSearchResults.projects).length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Rocket className="w-5 h-5" />
                          Projets ({(searchResults?.projects || mockSearchResults.projects).length})
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(searchResults?.projects || mockSearchResults.projects).map(project => (
                            <Card key={project.id} className="hover:shadow-md transition-all">
                              <CardContent className="p-4">
                                <div className="flex gap-3">
                                  <ProjectImagePlaceholder
                                    title={project.title}
                                    type={project.category.toLowerCase()}
                                    className="w-16 h-12 rounded flex-shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <Link 
                                      to={`/projects/${project.id}`}
                                      className="font-medium hover:text-primary line-clamp-1"
                                    >
                                      {project.title}
                                    </Link>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                      {project.description}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                      <span>{project.founder}</span>
                                      <span>•</span>
                                      <Badge variant="secondary" className="text-xs">{project.stage}</Badge>
                                      <span>•</span>
                                      <span>{project.followers} followers</span>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Utilisateurs */}
                    {(searchResults?.users || mockSearchResults.users).length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Users className="w-5 h-5" />
                          Utilisateurs ({(searchResults?.users || mockSearchResults.users).length})
                        </h3>
                        <div className="space-y-4">
                          {(searchResults?.users || mockSearchResults.users).map(user => (
                            <Card key={user.id} className="hover:shadow-md transition-all">
                              <CardContent className="p-4">
                                <div className="flex gap-4">
                                  <AvatarPlaceholder name={user.name} size={48} />
                                  <div className="flex-1">
                                    <Link 
                                      to={`/users/${user.id}`}
                                      className="font-medium hover:text-primary"
                                    >
                                      {user.name}
                                    </Link>
                                    <p className="text-sm text-muted-foreground mb-2">{user.title}</p>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                      {user.bio}
                                    </p>
                                    <div className="flex flex-wrap gap-1 mb-2">
                                      {user.skills.slice(0, 3).map(skill => (
                                        <Badge key={skill} variant="secondary" className="text-xs">
                                          {skill}
                                        </Badge>
                                      ))}
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                      <span>{user.coursesCount} cours</span>
                                      <span>{user.studentsCount} étudiants</span>
                                      <span>{user.location}</span>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Onglets spécifiques pour chaque catégorie */}
                {categories.slice(1).map(cat => (
                  <TabsContent key={cat.value} value={cat.value} className="mt-6">
                    <div className="text-center py-8">
                      <cat.icon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        Résultats pour {cat.label}
                      </h3>
                      <p className="text-muted-foreground">
                        Implémentation spécifique pour {cat.label.toLowerCase()} à venir...
                      </p>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            ) : (
              /* Page d'accueil de recherche */
              <div className="text-center py-12">
                <SearchIcon className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
                <h2 className="text-2xl font-bold mb-4">Que recherchez-vous ?</h2>
                <p className="text-muted-foreground mb-8">
                  Explorez notre vaste collection de cours, projets, utilisateurs et ressources.
                </p>
                
                {/* Suggestions de recherche */}
                <div className="max-w-2xl mx-auto">
                  <h3 className="text-lg font-semibold mb-4">Recherches populaires</h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {trendingSearches.map(search => (
                      <Button
                        key={search}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSearch(search)}
                        className="text-sm"
                      >
                        {search}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Recherches récentes */}
              {recentSearches.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Recherches récentes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(search)}
                        className="block w-full text-left text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Recherches tendances */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Tendances
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {trendingSearches.slice(0, 5).map((search, index) => (
                    <button
                      key={search}
                      onClick={() => handleSearch(search)}
                      className="flex items-center justify-between w-full text-left text-sm hover:text-primary transition-colors"
                    >
                      <span>{search}</span>
                      <Badge variant="secondary" className="text-xs">
                        #{index + 1}
                      </Badge>
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Catégories populaires */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Catégories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {categories.slice(1).map(cat => (
                    <button
                      key={cat.value}
                      onClick={() => setCategory(cat.value)}
                      className="flex items-center gap-2 w-full text-left text-sm hover:text-primary transition-colors"
                    >
                      <cat.icon className="w-4 h-4" />
                      {cat.label}
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Search
