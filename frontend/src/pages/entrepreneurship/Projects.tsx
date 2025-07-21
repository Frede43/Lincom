import React, { useState } from 'react'
import { Search, Rocket, MapPin, ExternalLink, Plus, Award, Loader2, Calendar, DollarSign, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ProjectImagePlaceholder, AvatarPlaceholder } from '@/components/ui/placeholder-image'
import { Link } from 'react-router-dom'
import { useProjects, useStartups, entrepreneurshipUtils } from '@/hooks/useEntrepreneurship'

const Projects: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStage, setSelectedStage] = useState('all')

  // Récupération des données réelles
  const {
    data: projects = [],
    isLoading: projectsLoading,
    error
  } = useProjects({
    search: searchQuery,
    status: selectedStage !== 'all' ? selectedStage : undefined,
  })

  const {
    data: startups = [],
    isLoading: startupsLoading
  } = useStartups()

  const isLoading = projectsLoading || startupsLoading

  // Fonction pour obtenir la startup associée à un projet
  const getStartupForProject = (projectStartupId: number) => {
    return startups.find(startup => startup.id === projectStartupId)
  }
  // Filtrage des projets avec les vraies données
  const filteredProjects = (projects || []).filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStage = selectedStage === 'all' || project.status === selectedStage
    return matchesSearch && matchesStage
  })

  const statuses = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'not_started', label: 'Non commencé' },
    { value: 'in_progress', label: 'En cours' },
    { value: 'on_hold', label: 'En pause' },
    { value: 'completed', label: 'Terminé' },
    { value: 'cancelled', label: 'Annulé' }
  ]

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
                  <div className="text-2xl font-bold text-purple-600">{(projects || []).length}</div>
                  <div className="text-sm text-muted-foreground">Projets totaux</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {(projects || []).filter(p => p.status === 'in_progress').length}
                  </div>
                  <div className="text-sm text-muted-foreground">En cours</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {(projects || []).filter(p => p.status === 'completed').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Terminés</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {entrepreneurshipUtils.formatFunding(
                      (projects || []).reduce((sum: number, p: any) => sum + parseFloat(p.budget || '0'), 0).toString()
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">Budget total</div>
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
            <Select value={selectedStage} onValueChange={setSelectedStage}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
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
              {filteredProjects.map(project => {
                const startup = getStartupForProject(project.startup)
                return (
                  <Card key={project.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="relative">
                      <ProjectImagePlaceholder
                        title={project.title}
                        type={startup?.industry || 'Projet'}
                        className="w-full h-48 rounded-t-lg"
                      />
                      <Badge className={`absolute top-2 left-2 bg-${entrepreneurshipUtils.getStatusColor(project.status)}-500 text-white`}>
                        {entrepreneurshipUtils.getStatusLabel(project.status)}
                      </Badge>
                      <Badge className={`absolute top-2 right-2 bg-${entrepreneurshipUtils.getStatusColor(project.priority)}-500 text-white`}>
                        {entrepreneurshipUtils.getPriorityLabel(project.priority)}
                      </Badge>
                    </div>
                  
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-bold text-lg group-hover:text-purple-600 transition-colors">
                          {project.title}
                        </h3>
                        <Badge variant="outline">{startup?.industry || 'Projet'}</Badge>
                      </div>

                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {project.description}
                      </p>

                      {/* Informations du projet */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(project.start_date).toLocaleDateString('fr-FR')} - {new Date(project.end_date).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <DollarSign className="w-4 h-4" />
                          <span>{entrepreneurshipUtils.formatFunding(project.budget)}</span>
                        </div>
                        {startup && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="w-4 h-4" />
                            <span>{startup.name} • {startup.team_size} personnes</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button asChild className="flex-1" size="sm">
                          <Link to={`/projects/${project.id}`}>
                            Voir le projet
                          </Link>
                        </Button>
                        {startup?.website && (
                          <Button asChild variant="outline" size="sm">
                            <a href={startup.website} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
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
