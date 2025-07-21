import React, { useState } from 'react'
import { Search, Filter, Building, Users, MapPin, Globe, Phone, Mail, ExternalLink, Plus, Star, Calendar, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PlaceholderImage } from '@/components/ui/placeholder-image'
import { Link } from 'react-router-dom'
import { useOrganizations } from '@/hooks/useOrganizations'

const Organizations: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedSector, setSelectedSector] = useState('all')

  // Utilisation des vraies APIs Django
  const {
    data: organizations = [],
    isLoading,
    error
  } = useOrganizations({
    search: searchQuery,
    type: selectedType !== 'all' ? selectedType : undefined,
    sector: selectedSector !== 'all' ? selectedSector : undefined,
  })

  // Mock data de fallback si pas de données
  const mockOrganizations = [
    {
      id: '1',
      name: 'Université du Burundi',
      description: 'Première université publique du Burundi, partenaire académique principal du Community Lab.',
      logo: null,
      type: 'Université',
      sector: 'Éducation',
      location: 'Bujumbura, Burundi',
      website: 'https://ub.edu.bi',
      email: 'info@ub.edu.bi',
      phone: '+257 22 22 30 54',
      foundedYear: 1964,
      employeesCount: '2000+',
      studentsCount: '15000+',
      partnership: {
        type: 'Partenaire Académique',
        since: '2023-01-15',
        status: 'active',
        projects: 12,
        students: 450
      },
      tags: ['Recherche', 'Formation', 'Innovation', 'Académique'],
      rating: 4.8,
      reviewsCount: 23
    },
    {
      id: '2',
      name: 'ARCT (Agence de Régulation des Communications et Technologies)',
      description: 'Agence gouvernementale chargée de la régulation des télécommunications et des TIC au Burundi.',
      logo: null,
      type: 'Agence Gouvernementale',
      sector: 'Télécommunications',
      location: 'Bujumbura, Burundi',
      website: 'https://arct.gov.bi',
      email: 'info@arct.gov.bi',
      phone: '+257 22 21 65 00',
      foundedYear: 2010,
      employeesCount: '150+',
      studentsCount: null,
      partnership: {
        type: 'Partenaire Institutionnel',
        since: '2023-03-20',
        status: 'active',
        projects: 5,
        students: 0
      },
      tags: ['Régulation', 'TIC', 'Gouvernement', 'Politique'],
      rating: 4.5,
      reviewsCount: 12
    },
    {
      id: '3',
      name: 'MIT Fab Foundation',
      description: 'Organisation internationale qui soutient le développement des Fab Labs dans le monde entier.',
      logo: null,
      type: 'ONG Internationale',
      sector: 'Technologie',
      location: 'Cambridge, USA',
      website: 'https://www.fabfoundation.org',
      email: 'info@fabfoundation.org',
      phone: '+1 617 253 1000',
      foundedYear: 2009,
      employeesCount: '50+',
      studentsCount: null,
      partnership: {
        type: 'Partenaire Technique',
        since: '2022-11-10',
        status: 'active',
        projects: 8,
        students: 200
      },
      tags: ['Fab Lab', 'Innovation', 'Formation', 'International'],
      rating: 4.9,
      reviewsCount: 45
    },
    {
      id: '4',
      name: 'USAID Burundi',
      description: 'Agence américaine pour le développement international, soutient les initiatives de développement au Burundi.',
      logo: null,
      type: 'Agence de Développement',
      sector: 'Développement',
      location: 'Bujumbura, Burundi',
      website: 'https://www.usaid.gov/burundi',
      email: 'info@usaid.gov',
      phone: '+257 22 20 76 00',
      foundedYear: 1961,
      employeesCount: '100+',
      studentsCount: null,
      partnership: {
        type: 'Bailleur de Fonds',
        since: '2023-02-01',
        status: 'active',
        projects: 15,
        students: 300
      },
      tags: ['Financement', 'Développement', 'Capacitation', 'International'],
      rating: 4.7,
      reviewsCount: 18
    },
    {
      id: '5',
      name: 'Econet Leo',
      description: 'Opérateur de télécommunications leader au Burundi, partenaire pour la connectivité et l\'innovation.',
      logo: null,
      type: 'Entreprise Privée',
      sector: 'Télécommunications',
      location: 'Bujumbura, Burundi',
      website: 'https://leo.bi',
      email: 'info@leo.bi',
      phone: '+257 75 000 000',
      foundedYear: 2014,
      employeesCount: '500+',
      studentsCount: null,
      partnership: {
        type: 'Partenaire Technologique',
        since: '2023-04-15',
        status: 'active',
        projects: 6,
        students: 150
      },
      tags: ['Télécoms', 'Connectivité', 'Innovation', 'Mobile'],
      rating: 4.6,
      reviewsCount: 28
    },
    {
      id: '6',
      name: 'UNDP Burundi',
      description: 'Programme des Nations Unies pour le Développement, soutient les initiatives de développement durable.',
      logo: null,
      type: 'Organisation Internationale',
      sector: 'Développement',
      location: 'Bujumbura, Burundi',
      website: 'https://www.undp.org/burundi',
      email: 'registry.bi@undp.org',
      phone: '+257 22 20 29 00',
      foundedYear: 1965,
      employeesCount: '80+',
      studentsCount: null,
      partnership: {
        type: 'Partenaire Stratégique',
        since: '2022-12-01',
        status: 'active',
        projects: 10,
        students: 250
      },
      tags: ['ODD', 'Développement Durable', 'Capacitation', 'Gouvernance'],
      rating: 4.8,
      reviewsCount: 22
    }
  ]

  const types = [
    { value: 'all', label: 'Tous les types' },
    { value: 'universite', label: 'Universités' },
    { value: 'entreprise-privee', label: 'Entreprises Privées' },
    { value: 'ong-internationale', label: 'ONG Internationales' },
    { value: 'agence-gouvernementale', label: 'Agences Gouvernementales' },
    { value: 'organisation-internationale', label: 'Organisations Internationales' },
    { value: 'agence-de-developpement', label: 'Agences de Développement' }
  ]

  const sectors = [
    { value: 'all', label: 'Tous les secteurs' },
    { value: 'education', label: 'Éducation' },
    { value: 'technologie', label: 'Technologie' },
    { value: 'telecommunications', label: 'Télécommunications' },
    { value: 'developpement', label: 'Développement' },
    { value: 'finance', label: 'Finance' },
    { value: 'agriculture', label: 'Agriculture' }
  ]

  // Utiliser les vraies données ou les données mockées en fallback
  const displayOrganizations = Array.isArray(organizations) && organizations.length > 0 ? organizations : mockOrganizations

  const filteredOrganizations = displayOrganizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         org.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === 'all' || 
                       org.type.toLowerCase().replace(/\s+/g, '-') === selectedType
    const matchesSector = selectedSector === 'all' || 
                         org.sector.toLowerCase() === selectedSector
    
    return matchesSearch && matchesType && matchesSector
  })

  const getPartnershipColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'partenaire académique': return 'bg-blue-100 text-blue-800'
      case 'partenaire technique': return 'bg-green-100 text-green-800'
      case 'bailleur de fonds': return 'bg-yellow-100 text-yellow-800'
      case 'partenaire technologique': return 'bg-purple-100 text-purple-800'
      case 'partenaire institutionnel': return 'bg-orange-100 text-orange-800'
      case 'partenaire stratégique': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Actif'
      case 'pending': return 'En attente'
      case 'inactive': return 'Inactif'
      default: return status
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center">
              <Building className="mr-3" />
              Organisations Partenaires
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Découvrez notre réseau de partenaires qui soutiennent l'innovation au Burundi
            </p>
            
            {/* Barre de recherche */}
            <div className="relative max-w-2xl mx-auto mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Rechercher une organisation, un secteur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg bg-white text-gray-900"
              />
            </div>

            <Button asChild size="lg" className="bg-white text-green-600 hover:bg-white/90">
              <Link to="/organizations/partnership">
                <Plus className="w-5 h-5 mr-2" />
                Devenir partenaire
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filtres */}
        <div className="flex flex-wrap gap-4 mb-8 p-4 bg-card rounded-lg border">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">Filtres :</span>
          </div>
          
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Type d'organisation" />
            </SelectTrigger>
            <SelectContent>
              {types.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSector} onValueChange={setSelectedSector}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Secteur" />
            </SelectTrigger>
            <SelectContent>
              {sectors.map(sector => (
                <SelectItem key={sector.value} value={sector.value}>
                  {sector.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={() => {
            setSearchQuery('')
            setSelectedType('all')
            setSelectedSector('all')
          }}>
            Réinitialiser
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{filteredOrganizations.length}</div>
              <div className="text-sm text-muted-foreground">Partenaires</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Array.isArray(organizations) ? organizations.reduce((sum, org) => sum + (org.partnership?.projects || 0), 0) : 0}
              </div>
              <div className="text-sm text-muted-foreground">Projets collaboratifs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Array.isArray(organizations) ? organizations.reduce((sum, org) => sum + (org.partnership?.students || 0), 0) : 0}
              </div>
              <div className="text-sm text-muted-foreground">Étudiants bénéficiaires</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">12</div>
              <div className="text-sm text-muted-foreground">Pays représentés</div>
            </CardContent>
          </Card>
        </div>

        {/* Gestion du loading */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            <span className="ml-2 text-lg">Chargement des organisations...</span>
          </div>
        )}

        {/* Gestion des erreurs */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              ❌ Erreur lors du chargement des organisations
            </div>
            <p className="text-muted-foreground">
              {error.message || 'Une erreur est survenue'}
            </p>
          </div>
        )}

        {/* Liste des organisations */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrganizations.map(org => (
            <Card key={org.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="relative">
                <PlaceholderImage
                  width={400}
                  height={200}
                  text={org.name}
                  backgroundColor="#10B981"
                  className="w-full h-48 rounded-t-lg"
                />
                <div className="absolute top-2 left-2">
                  <Badge className={getPartnershipColor(org.partnership.type)}>
                    {org.partnership.type}
                  </Badge>
                </div>
                <div className="absolute top-2 right-2">
                  <Badge className={getStatusColor(org.partnership.status)}>
                    {getStatusLabel(org.partnership.status)}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline">{org.type}</Badge>
                  <Badge variant="outline">{org.sector}</Badge>
                </div>

                <h3 className="font-bold text-lg mb-2 group-hover:text-green-600 transition-colors">
                  {org.name}
                </h3>
                
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {org.description}
                </p>

                {/* Informations de contact */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {org.location}
                  </div>
                  {org.website && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Globe className="w-4 h-4" />
                      <a 
                        href={org.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-primary truncate"
                      >
                        {org.website.replace('https://', '')}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    Fondée en {org.foundedYear}
                  </div>
                </div>

                {/* Statistiques du partenariat */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-primary">{org.partnership.projects}</div>
                    <div className="text-xs text-muted-foreground">Projets</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-primary">{org.partnership.students}</div>
                    <div className="text-xs text-muted-foreground">Étudiants</div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {org.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {org.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{org.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.floor(org.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {org.rating} ({org.reviewsCount} avis)
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button asChild className="flex-1" size="sm">
                    <Link to={`/organizations/${org.id}`}>
                      Voir profil
                    </Link>
                  </Button>
                  {org.website && (
                    <Button asChild variant="outline" size="sm">
                      <a href={org.website} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Message si aucun résultat */}
          {filteredOrganizations.length === 0 && (
            <div className="text-center py-12">
              <Building className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucune organisation trouvée</h3>
              <p className="text-muted-foreground mb-4">
                Essayez de modifier vos critères de recherche ou explorez nos secteurs.
              </p>
              <Button onClick={() => {
                setSearchQuery('')
                setSelectedType('all')
                setSelectedSector('all')
              }}>
                Voir toutes les organisations
              </Button>
            </div>
          )}
          </div>
        )}

        {/* Section informative */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Devenir Partenaire
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Rejoignez notre réseau de partenaires et contribuez au développement de l'écosystème d'innovation burundais.
              </p>
              <Button asChild variant="outline">
                <Link to="/organizations/partnership">
                  En savoir plus
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Collaborations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Découvrez les projets collaboratifs en cours et les opportunités de partenariat.
              </p>
              <Button asChild variant="outline">
                <Link to="/projects?filter=collaborative">
                  Voir les projets
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Organizations
