import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Handshake, 
  Users, 
  BookOpen, 
  Briefcase,
  TrendingUp,
  Award,
  Globe,
  Search,
  Filter,
  Calendar,
  MapPin,
  ExternalLink,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AvatarPlaceholder } from '@/components/ui/placeholder-image'
import { useOrganizations } from '@/hooks/useOrganizations'

const OrganizationPartnership: React.FC = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  // Récupérer les données des organisations
  const {
    data: organizations = [],
    isLoading,
    error
  } = useOrganizations()

  // Filtrer les organisations
  const filteredOrganizations = Array.isArray(organizations) 
    ? organizations.filter(org =>
        org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.sector.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  // Statistiques des partenariats
  const partnershipStats = {
    totalPartners: filteredOrganizations.length,
    totalProjects: filteredOrganizations.reduce((sum, org) => sum + (org.partnership?.projects || 0), 0),
    totalStudents: filteredOrganizations.reduce((sum, org) => sum + (org.partnership?.students || 0), 0),
    totalCourses: filteredOrganizations.reduce((sum, org) => sum + (org.partnership?.courses || 0), 0)
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Chargement des partenariats...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Erreur de chargement</h1>
        <p className="text-muted-foreground mb-4">Impossible de charger les partenariats.</p>
        <Button onClick={() => navigate('/organizations')}>
          Retour aux organisations
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-12">
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
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Handshake className="w-12 h-12" />
                <h1 className="text-4xl font-bold">Partenariats</h1>
              </div>
              <p className="text-xl text-white/90 mb-8">
                Découvrez nos collaborations avec les organisations burundaises et internationales
              </p>
              
              {/* Barre de recherche */}
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Rechercher un partenaire..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 text-lg bg-white/10 border-white/20 text-white placeholder:text-white/70"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Handshake className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-blue-600">{partnershipStats.totalPartners}</div>
                <div className="text-sm text-muted-foreground">Partenaires</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Briefcase className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-green-600">{partnershipStats.totalProjects}</div>
                <div className="text-sm text-muted-foreground">Projets collaboratifs</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <BookOpen className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-orange-600">{partnershipStats.totalCourses}</div>
                <div className="text-sm text-muted-foreground">Cours partagés</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-purple-600">{partnershipStats.totalStudents}</div>
                <div className="text-sm text-muted-foreground">Étudiants bénéficiaires</div>
              </CardContent>
            </Card>
          </div>

          {/* Contenu principal */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3 mx-auto mb-8">
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="active">Actifs</TabsTrigger>
              <TabsTrigger value="strategic">Stratégiques</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {/* Liste des partenaires */}
              {filteredOrganizations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredOrganizations.map(organization => (
                    <Card key={organization.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <AvatarPlaceholder name={organization.name} size={48} />
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg line-clamp-1">{organization.name}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getTypeColor(organization.type)} variant="secondary">
                                {getTypeName(organization.type)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {organization.description}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{organization.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(organization.founding_date).getFullYear()}</span>
                          </div>
                        </div>

                        {/* Statistiques du partenariat */}
                        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                          <div className="bg-blue-50 rounded p-2">
                            <div className="text-lg font-bold text-blue-600">
                              {organization.partnership?.projects || 0}
                            </div>
                            <div className="text-xs text-muted-foreground">Projets</div>
                          </div>
                          <div className="bg-green-50 rounded p-2">
                            <div className="text-lg font-bold text-green-600">
                              {organization.partnership?.courses || 0}
                            </div>
                            <div className="text-xs text-muted-foreground">Cours</div>
                          </div>
                          <div className="bg-purple-50 rounded p-2">
                            <div className="text-lg font-bold text-purple-600">
                              {organization.partnership?.students || 0}
                            </div>
                            <div className="text-xs text-muted-foreground">Étudiants</div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button asChild size="sm" className="flex-1">
                            <Link to={`/organizations/${organization.id}`}>
                              Voir détails
                            </Link>
                          </Button>
                          {organization.website && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={organization.website} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Handshake className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Aucun partenaire trouvé</h3>
                  <p className="text-muted-foreground">
                    {searchQuery ? 'Essayez avec d\'autres mots-clés' : 'Les partenariats seront bientôt disponibles'}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="active" className="mt-6">
              <div className="text-center py-12">
                <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Partenariats actifs</h3>
                <p className="text-muted-foreground">
                  Les partenariats actifs seront bientôt disponibles
                </p>
              </div>
            </TabsContent>

            <TabsContent value="strategic" className="mt-6">
              <div className="text-center py-12">
                <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Partenariats stratégiques</h3>
                <p className="text-muted-foreground">
                  Les partenariats stratégiques seront bientôt disponibles
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default OrganizationPartnership
