import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Globe, 
  Mail, 
  Phone,
  Loader2,
  ExternalLink,
  Building,
  Target,
  Award
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AvatarPlaceholder } from '@/components/ui/placeholder-image'
import { useStartup } from '@/hooks/useEntrepreneurship'

const StartupDetail: React.FC = () => {
  const { startupId } = useParams<{ startupId: string }>()
  const navigate = useNavigate()

  // Récupérer les données de la startup
  const {
    data: startup,
    isLoading,
    error
  } = useStartup(startupId!)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Chargement de la startup...</span>
      </div>
    )
  }

  if (error || !startup) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Erreur de chargement</h1>
        <p className="text-muted-foreground mb-4">Impossible de charger cette startup.</p>
        <Button onClick={() => navigate('/projects')}>
          Retour aux projets
        </Button>
      </div>
    )
  }

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      'idea': 'bg-gray-100 text-gray-800',
      'prototype': 'bg-blue-100 text-blue-800',
      'mvp': 'bg-orange-100 text-orange-800',
      'growth': 'bg-green-100 text-green-800',
      'scale': 'bg-purple-100 text-purple-800'
    }
    return colors[stage] || 'bg-gray-100 text-gray-800'
  }

  const getStageName = (stage: string) => {
    const names: Record<string, string> = {
      'idea': 'Idée',
      'prototype': 'Prototype',
      'mvp': 'MVP',
      'growth': 'Croissance',
      'scale': 'Expansion'
    }
    return names[stage] || stage
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/projects')}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux projets
              </Button>
            </div>
            
            <div className="flex items-start gap-6">
              <AvatarPlaceholder name={startup.name} size={80} />
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{startup.name}</h1>
                  <Badge className={getStageColor(startup.stage)}>
                    {getStageName(startup.stage)}
                  </Badge>
                </div>
                
                <p className="text-xl text-white/90 mb-4">{startup.description}</p>
                
                <div className="flex flex-wrap items-center gap-6 text-white/80">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    <span>{startup.sector}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{startup.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Fondée en {new Date(startup.founding_date).getFullYear()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{startup.team_size} employés</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Description détaillée */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    À propos de {startup.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-muted-foreground leading-relaxed">
                      {startup.description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Projets de la startup */}
              <Card>
                <CardHeader>
                  <CardTitle>Projets en cours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Building className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Les projets de cette startup seront bientôt disponibles</p>
                  </div>
                </CardContent>
              </Card>

              {/* Équipe */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Équipe ({startup.team_size} membres)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Les informations sur l'équipe seront bientôt disponibles</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Informations clés */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations clés</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Secteur</div>
                    <div className="font-medium">{startup.sector}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Stade</div>
                    <Badge className={getStageColor(startup.stage)}>
                      {getStageName(startup.stage)}
                    </Badge>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Localisation</div>
                    <div className="font-medium">{startup.location}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Taille de l'équipe</div>
                    <div className="font-medium">{startup.team_size} personnes</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Date de création</div>
                    <div className="font-medium">
                      {new Date(startup.founding_date).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Financement */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Financement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Fonds levés</div>
                    <div className="text-2xl font-bold text-green-600">
                      {startup.funding_raised?.toLocaleString()} BIF
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Stade de financement</div>
                    <Badge variant="outline">{startup.funding_stage || 'Non spécifié'}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Contact */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {startup.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <a 
                        href={startup.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        Site web
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                  
                  {startup.contact_email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <a 
                        href={`mailto:${startup.contact_email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {startup.contact_email}
                      </a>
                    </div>
                  )}
                  
                  {startup.contact_phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <a 
                        href={`tel:${startup.contact_phone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {startup.contact_phone}
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <Button className="w-full">
                      <Mail className="w-4 h-4 mr-2" />
                      Contacter
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Award className="w-4 h-4 mr-2" />
                      Suivre
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StartupDetail
