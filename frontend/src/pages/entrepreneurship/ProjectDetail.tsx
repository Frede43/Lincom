import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  Heart, Share2, MessageCircle, Users, Calendar, MapPin, 
  DollarSign, TrendingUp, Award, Eye, ArrowLeft, ExternalLink,
  Github, Globe, Mail, Phone, Linkedin, Twitter, Plus,
  CheckCircle, Clock, AlertCircle, Target, Lightbulb, Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { ProjectImagePlaceholder, AvatarPlaceholder } from '@/components/ui/placeholder-image'
import { useProject, useStartup, entrepreneurshipUtils } from '@/hooks/useEntrepreneurship'

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams()
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  // Hooks pour récupérer les données réelles
  const { data: project, isLoading: projectLoading, error: projectError } = useProject(projectId || '')
  const { data: startup, isLoading: startupLoading } = useStartup(project?.startup?.toString() || '')

  const isLoading = projectLoading || startupLoading

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Chargement du projet...</span>
      </div>
    )
  }

  // Error state
  if (projectError || !project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Projet introuvable</h1>
        <p className="text-muted-foreground mb-4">Le projet demandé n'existe pas ou n'est plus disponible.</p>
        <Link to="/projects">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux projets
          </Button>
        </Link>
      </div>
    )
  }

  // Données calculées
  const daysRemaining = entrepreneurshipUtils.getDaysRemaining(project.end_date)
  const progressPercentage = Math.max(0, Math.min(100, 
    ((new Date().getTime() - new Date(project.start_date).getTime()) / 
     (new Date(project.end_date).getTime() - new Date(project.start_date).getTime())) * 100
  ))

  const toggleFollow = () => {
    setIsFollowing(!isFollowing)
  }

  const toggleLike = () => {
    setIsLiked(!isLiked)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/projects" className="hover:text-foreground">Projets</Link>
            <span>/</span>
            <span className="text-foreground">{project.title}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header du projet */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">{project.title}</h1>
                    <Badge className={`bg-${entrepreneurshipUtils.getStatusColor(project.status)}-500 text-white`}>
                      {entrepreneurshipUtils.getStatusLabel(project.status)}
                    </Badge>
                  </div>
                  <p className="text-lg text-muted-foreground mb-4">
                    {project.description}
                  </p>
                  
                  {/* Informations du projet */}
                  <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(project.start_date).toLocaleDateString('fr-FR')} - {new Date(project.end_date).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      Budget: {entrepreneurshipUtils.formatFunding(project.budget)}
                    </div>
                    {startup && (
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {startup.name}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant={isLiked ? "default" : "outline"}
                    size="sm"
                    onClick={toggleLike}
                  >
                    <Heart className={`w-4 h-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                    J'aime
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-1" />
                    Partager
                  </Button>
                </div>
              </div>

              {/* Image du projet */}
              <ProjectImagePlaceholder
                title={project.title}
                type={startup?.industry || 'Projet'}
                className="w-full h-64 rounded-lg mb-6"
              />
            </div>

            {/* Tabs avec contenu détaillé */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="progress">Progression</TabsTrigger>
                <TabsTrigger value="team">Équipe</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Description du projet</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {project.description}
                    </p>
                    
                    {startup && (
                      <div className="mt-6">
                        <h3 className="font-semibold mb-2">Startup associée</h3>
                        <div className="flex items-center gap-3 p-4 border rounded-lg">
                          <AvatarPlaceholder name={startup.name} size={48} />
                          <div>
                            <h4 className="font-medium">{startup.name}</h4>
                            <p className="text-sm text-muted-foreground">{startup.industry}</p>
                            <p className="text-sm text-muted-foreground">
                              {startup.team_size} personnes • {entrepreneurshipUtils.getFundingStageLabel(startup.funding_stage)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="progress" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Progression du projet</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progression temporelle</span>
                          <span>{Math.round(progressPercentage)}%</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Date de début:</span>
                          <p className="font-medium">{new Date(project.start_date).toLocaleDateString('fr-FR')}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Date de fin:</span>
                          <p className="font-medium">{new Date(project.end_date).toLocaleDateString('fr-FR')}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Jours restants:</span>
                          <p className="font-medium">{daysRemaining > 0 ? `${daysRemaining} jours` : 'Terminé'}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Priorité:</span>
                          <Badge variant="outline" className={`bg-${entrepreneurshipUtils.getStatusColor(project.priority)}-100`}>
                            {entrepreneurshipUtils.getPriorityLabel(project.priority)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="team" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Équipe du projet</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {startup ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <AvatarPlaceholder name={`Manager ${project.manager}`} size={40} />
                          <div>
                            <h4 className="font-medium">Manager {project.manager}</h4>
                            <p className="text-sm text-muted-foreground">Chef de projet</p>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h4 className="font-medium mb-3">Startup: {startup.name}</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Équipe:</span>
                              <p className="font-medium">{startup.team_size} personnes</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Secteur:</span>
                              <p className="font-medium">{startup.industry}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Fondée:</span>
                              <p className="font-medium">{new Date(startup.founding_date).toLocaleDateString('fr-FR')}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Statut:</span>
                              <Badge variant="outline">
                                {entrepreneurshipUtils.getStatusLabel(startup.status)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Informations sur l'équipe non disponibles.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informations rapides */}
            <Card>
              <CardHeader>
                <CardTitle>Informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Statut:</span>
                  <Badge className={`bg-${entrepreneurshipUtils.getStatusColor(project.status)}-500 text-white`}>
                    {entrepreneurshipUtils.getStatusLabel(project.status)}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Priorité:</span>
                  <Badge variant="outline">
                    {entrepreneurshipUtils.getPriorityLabel(project.priority)}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Budget:</span>
                  <span className="font-medium">{entrepreneurshipUtils.formatFunding(project.budget)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Durée:</span>
                  <span className="font-medium">
                    {Math.ceil((new Date(project.end_date).getTime() - new Date(project.start_date).getTime()) / (1000 * 60 * 60 * 24))} jours
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <Button 
                    className="w-full" 
                    variant={isFollowing ? "outline" : "default"}
                    onClick={toggleFollow}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {isFollowing ? 'Ne plus suivre' : 'Suivre le projet'}
                  </Button>
                  
                  {startup?.website && (
                    <Button asChild variant="outline" className="w-full">
                      <a href={startup.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="w-4 h-4 mr-2" />
                        Site web
                      </a>
                    </Button>
                  )}
                  
                  <Button variant="outline" className="w-full">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contacter l'équipe
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetail
