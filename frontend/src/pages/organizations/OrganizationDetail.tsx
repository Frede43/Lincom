import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Users, 
  Globe, 
  Mail, 
  Phone,
  Loader2,
  ExternalLink,
  Building,
  Target,
  Award,
  Handshake,
  TrendingUp,
  BookOpen,
  Briefcase
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AvatarPlaceholder } from '@/components/ui/placeholder-image'
import { useOrganization } from '@/hooks/useOrganizations'

const OrganizationDetail: React.FC = () => {
  const { organizationId } = useParams<{ organizationId: string }>()
  const navigate = useNavigate()

  // Récupérer les données de l'organisation
  const {
    data: organization,
    isLoading,
    error
  } = useOrganization(organizationId!)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Chargement de l'organisation...</span>
      </div>
    )
  }

  if (error || !organization) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Erreur de chargement</h1>
        <p className="text-muted-foreground mb-4">Impossible de charger cette organisation.</p>
        <Button onClick={() => navigate('/organizations')}>
          Retour aux organisations
        </Button>
      </div>
    )
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'university': 'bg-blue-100 text-blue-800',
      'government': 'bg-green-100 text-green-800',
      'ngo': 'bg-orange-100 text-orange-800',
      'private': 'bg-purple-100 text-purple-800',
      'international': 'bg-red-100 text-red-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  const getTypeName = (type: string) => {
    const names: Record<string, string> = {
      'university': 'Université',
      'government': 'Gouvernement',
      'ngo': 'ONG',
      'private': 'Privé',
      'international': 'International'
    }
    return names[type] || type
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/organizations')}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux organisations
              </Button>
            </div>
            
            <div className="flex items-start gap-6">
              <AvatarPlaceholder name={organization.name} size={80} />
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{organization.name}</h1>
                  <Badge className={getTypeColor(organization.type)}>
                    {getTypeName(organization.type)}
                  </Badge>
                </div>
                
                <p className="text-xl text-white/90 mb-4">{organization.description}</p>
                
                <div className="flex flex-wrap items-center gap-6 text-white/80">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    <span>{organization.sector}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{organization.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Depuis {new Date(organization.founding_date).getFullYear()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{organization.team_size} employés</span>
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
                    À propos de {organization.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-muted-foreground leading-relaxed">
                      {organization.description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Partenariats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Handshake className="w-5 h-5" />
                    Partenariats avec Community Lab
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-600">
                        {organization.partnership?.courses || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Cours collaboratifs</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <Briefcase className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-600">
                        {organization.partnership?.projects || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Projets communs</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-purple-600">
                        {organization.partnership?.students || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Étudiants bénéficiaires</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Projets récents */}
              <Card>
                <CardHeader>
                  <CardTitle>Projets récents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Les projets récents seront bientôt disponibles</p>
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
                    <div className="text-sm text-muted-foreground mb-1">Type</div>
                    <Badge className={getTypeColor(organization.type)}>
                      {getTypeName(organization.type)}
                    </Badge>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Secteur</div>
                    <div className="font-medium">{organization.sector}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Localisation</div>
                    <div className="font-medium">{organization.location}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Taille</div>
                    <div className="font-medium">{organization.team_size} employés</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Fondée en</div>
                    <div className="font-medium">
                      {new Date(organization.founding_date).getFullYear()}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {organization.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <a 
                        href={organization.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        Site web
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                  
                  {organization.contact_email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <a 
                        href={`mailto:${organization.contact_email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {organization.contact_email}
                      </a>
                    </div>
                  )}
                  
                  {organization.contact_phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <a 
                        href={`tel:${organization.contact_phone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {organization.contact_phone}
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
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/organizations/partnership">
                        <Handshake className="w-4 h-4 mr-2" />
                        Voir partenariats
                      </Link>
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

export default OrganizationDetail
