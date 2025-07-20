import React, { useState } from 'react'
import { Search, Rocket, MapPin, ExternalLink, Plus, Award, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ProjectImagePlaceholder, AvatarPlaceholder } from '@/components/ui/placeholder-image'
import { Link } from 'react-router-dom'
import { useProjects } from '@/hooks/useProjects'

const Projects: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStage, setSelectedStage] = useState('all')

  // Utilisation des vraies APIs Django
  const { 
    data: projects = [], 
    isLoading, 
    error 
  } = useProjects({
    search: searchQuery,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    status: selectedStage !== 'all' ? selectedStage : undefined,
  })

  // Mock data de fallback
  const mockProjects = [
    {
      id: '1',
      title: 'EcoFarm Solutions',
      description: 'Plateforme digitale pour connecter les agriculteurs burundais aux marchés locaux et internationaux.',
      founder: {
        name: 'Marie UWIMANA',
        avatar: null,
        role: 'CEO & Fondatrice'
      },
      category: 'AgriTech',
      stage: 'Croissance',
      fundingGoal: 50000,
      currentFunding: 32000,
      backers: 127,
      location: 'Bujumbura, Burundi',
      createdAt: '2024-01-10T00:00:00Z',
      tags: ['Agriculture', 'Marketplace', 'Mobile App', 'Sustainability'],
      featured: true,
      website: 'https://ecofarm-solutions.bi'
    },
    {
      id: '2',
      title: 'BurundiCraft Marketplace',
      description: 'Marketplace en ligne pour promouvoir et vendre l\'artisanat traditionnel burundais.',
      founder: {
        name: 'Jean NKURUNZIZA',
        avatar: null,
        role: 'Fondateur'
      },
      category: 'E-commerce',
      stage: 'Lancement',
      fundingGoal: 25000,
      currentFunding: 8500,
      backers: 43,
      location: 'Gitega, Burundi',
      createdAt: '2024-01-08T00:00:00Z',
      tags: ['Artisanat', 'E-commerce', 'Culture', 'Export'],
      featured: false,
      website: null
    },
    {
      id: '3',
      title: 'EduTech Burundi',
      description: 'Plateforme d\'apprentissage en ligne adaptée au contexte éducatif burundais.',
      founder: {
        name: 'Grace NDAYISENGA',
        avatar: null,
        role: 'CTO & Co-fondatrice'
      },
      category: 'EdTech',
      stage: 'Développement',
      fundingGoal: 75000,
      currentFunding: 15000,
      backers: 89,
      location: 'Ngozi, Burundi',
      createdAt: '2024-01-05T00:00:00Z',
      tags: ['Education', 'E-learning', 'Mobile', 'Accessibility'],
      featured: true,
      website: 'https://edutech-burundi.com'
    }
  ]

  // Utiliser les vraies données ou fallback
  const displayProjects = Array.isArray(projects) && projects.length > 0 ? projects : mockProjects

  const filteredProjects = displayProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory
    const matchesStage = selectedStage === 'all' || project.stage === selectedStage
    return matchesSearch && matchesCategory && matchesStage
  })

  const categories = [
    { value: 'all', label: 'Toutes les catégories' },
    { value: 'AgriTech', label: 'AgriTech' },
    { value: 'EdTech', label: 'EdTech' },
    { value: 'FinTech', label: 'FinTech' },
    { value: 'HealthTech', label: 'HealthTech' },
    { value: 'E-commerce', label: 'E-commerce' },
    { value: 'CleanTech', label: 'CleanTech' }
  ]

  const stages = [
    { value: 'all', label: 'Tous les stades' },
    { value: 'Idée', label: 'Idée' },
    { value: 'Développement', label: 'Développement' },
    { value: 'Lancement', label: 'Lancement' },
    { value: 'Croissance', label: 'Croissance' },
    { value: 'Expansion', label: 'Expansion' }
  ]

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Idée': return 'bg-gray-100 text-gray-800'
      case 'Développement': return 'bg-blue-100 text-blue-800'
      case 'Lancement': return 'bg-green-100 text-green-800'
      case 'Croissance': return 'bg-orange-100 text-orange-800'
      case 'Expansion': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center">
              <Rocket className="mr-3" />
              Projets Entrepreneuriaux
            </h1>
            <p className="text-xl opacity-90 mb-6">
              Découvrez et soutenez l'innovation burundaise
            </p>
            
            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{displayProjects.length}</div>
                  <div className="text-sm text-muted-foreground">Projets actifs</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {displayProjects.filter(p => p.stage === 'Croissance').length}
                  </div>
                  <div className="text-sm text-muted-foreground">En croissance</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {displayProjects.reduce((sum, p) => sum + (p.backers || 0), 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Soutiens</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    ${displayProjects.reduce((sum, p) => sum + (p.currentFunding || 0), 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Financés</div>
                </CardContent>
              </Card>
            </div>

            <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              <Link to="/projects/create">
                <Plus className="mr-2 h-5 w-5" />
                Soumettre un projet
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Filtres et recherche */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Rechercher des projets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStage} onValueChange={setSelectedStage}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Stade" />
              </SelectTrigger>
              <SelectContent>
                {stages.map(stage => (
                  <SelectItem key={stage.value} value={stage.value}>
                    {stage.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Gestion du loading */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
              <span className="ml-2 text-lg">Chargement des projets...</span>
            </div>
          )}

          {/* Gestion des erreurs */}
          {error && (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                ❌ Erreur lors du chargement des projets
              </div>
              <p className="text-muted-foreground">
                {error.message || 'Une erreur est survenue'}
              </p>
            </div>
          )}

          {/* Liste des projets */}
          {!isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map(project => (
                <Card key={project.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="relative">
                    <ProjectImagePlaceholder
                      title={project.title}
                      type={project.category}
                      className="w-full h-48 rounded-t-lg"
                    />
                    {project.featured && (
                      <Badge className="absolute top-2 right-2 bg-yellow-500">
                        <Award className="w-3 h-3 mr-1" />
                        Mis en avant
                      </Badge>
                    )}
                    <Badge className={`absolute top-2 left-2 ${getStageColor(project.stage)}`}>
                      {project.stage}
                    </Badge>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-lg group-hover:text-purple-600 transition-colors">
                        {project.title}
                      </h3>
                      <Badge variant="outline">{project.category}</Badge>
                    </div>
                    
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Fondateur */}
                    <div className="flex items-center gap-3 mb-4">
                      <AvatarPlaceholder name={project.founder.name} size={32} />
                      <div>
                        <div className="font-medium text-sm">{project.founder.name}</div>
                        <div className="text-xs text-muted-foreground">{project.founder.role}</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button asChild className="flex-1" size="sm">
                        <Link to={`/projects/${project.id}`}>
                          Voir le projet
                        </Link>
                      </Button>
                      {project.website && (
                        <Button asChild variant="outline" size="sm">
                          <a href={project.website} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Message si aucun résultat */}
          {!isLoading && !error && filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <Rocket className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucun projet trouvé</h3>
              <p className="text-muted-foreground mb-4">
                Essayez de modifier vos critères de recherche ou explorez d'autres catégories.
              </p>
              <Button onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
                setSelectedStage('all')
              }}>
                Voir tous les projets
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Projects
