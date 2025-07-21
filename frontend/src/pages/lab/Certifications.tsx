import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Award, 
  Clock, 
  Users, 
  Calendar,
  DollarSign,
  Search,
  Filter,
  BookOpen,
  CheckCircle,
  Star,
  TrendingUp,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AvatarPlaceholder } from '@/components/ui/placeholder-image'

const Certifications: React.FC = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  // Données mockées des certifications (en attendant l'API)
  const certifications = [
    {
      id: 1,
      name: 'Impression 3D Avancée',
      description: 'Maîtrisez les techniques avancées d\'impression 3D et la conception pour la fabrication additive',
      level: 'Avancé',
      duration: '3 jours',
      cost: 150000,
      currency: 'BIF',
      maxParticipants: 12,
      currentParticipants: 8,
      nextSession: '2024-02-15T09:00:00Z',
      instructor: 'Dr. Jean NKURUNZIZA',
      skills: ['Modélisation 3D', 'Matériaux avancés', 'Post-traitement', 'Optimisation'],
      equipment: ['Imprimante 3D Ultimaker', 'Scanner 3D', 'Logiciels CAO'],
      certification: 'Certificat Community Lab + Badge numérique',
      image: null
    },
    {
      id: 2,
      name: 'Découpe Laser et Gravure',
      description: 'Apprenez à utiliser la découpeuse laser pour créer des prototypes et des produits finis',
      level: 'Intermédiaire',
      duration: '2 jours',
      cost: 100000,
      currency: 'BIF',
      maxParticipants: 10,
      currentParticipants: 6,
      nextSession: '2024-02-20T09:00:00Z',
      instructor: 'Marie UWIMANA',
      skills: ['Conception vectorielle', 'Paramètres de découpe', 'Matériaux', 'Sécurité'],
      equipment: ['Découpeuse laser CO2', 'Logiciels de conception', 'Matériaux divers'],
      certification: 'Certificat Community Lab',
      image: null
    },
    {
      id: 3,
      name: 'Arduino et IoT',
      description: 'Créez des objets connectés avec Arduino et découvrez l\'Internet des Objets',
      level: 'Débutant',
      duration: '4 jours',
      cost: 120000,
      currency: 'BIF',
      maxParticipants: 15,
      currentParticipants: 12,
      nextSession: '2024-02-25T09:00:00Z',
      instructor: 'Paul NDAYISENGA',
      skills: ['Programmation Arduino', 'Capteurs', 'Connectivité', 'Prototypage'],
      equipment: ['Kits Arduino', 'Capteurs IoT', 'Modules WiFi', 'Breadboards'],
      certification: 'Certificat Community Lab + Projet final',
      image: null
    },
    {
      id: 4,
      name: 'Soudure Électronique',
      description: 'Maîtrisez les techniques de soudure pour l\'électronique et la réparation',
      level: 'Débutant',
      duration: '1 jour',
      cost: 50000,
      currency: 'BIF',
      maxParticipants: 8,
      currentParticipants: 3,
      nextSession: '2024-02-18T09:00:00Z',
      instructor: 'David HAKIZIMANA',
      skills: ['Soudure à l\'étain', 'Dessoudage', 'Composants SMD', 'Réparation'],
      equipment: ['Stations de soudure', 'Multimètres', 'Composants', 'Outils'],
      certification: 'Certificat de compétence',
      image: null
    }
  ]

  // Filtrage des certifications
  const filteredCertifications = certifications.filter(cert =>
    cert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cert.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cert.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      'Débutant': 'bg-green-100 text-green-800',
      'Intermédiaire': 'bg-orange-100 text-orange-800',
      'Avancé': 'bg-red-100 text-red-800'
    }
    return colors[level] || 'bg-gray-100 text-gray-800'
  }

  const getAvailabilityColor = (current: number, max: number) => {
    const ratio = current / max
    if (ratio < 0.5) return 'text-green-600'
    if (ratio < 0.8) return 'text-orange-600'
    return 'text-red-600'
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/equipment')}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux équipements
              </Button>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Award className="w-12 h-12" />
                <h1 className="text-4xl font-bold">Certifications</h1>
              </div>
              <p className="text-xl text-white/90 mb-8">
                Développez vos compétences techniques avec nos formations certifiantes
              </p>
              
              {/* Barre de recherche */}
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Rechercher une certification..."
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
                <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-purple-600">{certifications.length}</div>
                <div className="text-sm text-muted-foreground">Certifications</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-blue-600">
                  {certifications.reduce((sum, cert) => sum + cert.currentParticipants, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Participants inscrits</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <BookOpen className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-green-600">
                  {certifications.filter(cert => cert.currentParticipants < cert.maxParticipants).length}
                </div>
                <div className="text-sm text-muted-foreground">Places disponibles</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-orange-600">95%</div>
                <div className="text-sm text-muted-foreground">Taux de réussite</div>
              </CardContent>
            </Card>
          </div>

          {/* Contenu principal */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3 mx-auto mb-8">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="available">Disponibles</TabsTrigger>
              <TabsTrigger value="upcoming">Prochaines</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {/* Liste des certifications */}
              {filteredCertifications.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredCertifications.map(certification => (
                    <Card key={certification.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-xl mb-2">{certification.name}</CardTitle>
                            <div className="flex items-center gap-2 mb-3">
                              <Badge className={getLevelColor(certification.level)}>
                                {certification.level}
                              </Badge>
                              <Badge variant="outline">
                                <Clock className="w-3 h-3 mr-1" />
                                {certification.duration}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                              {certification.cost.toLocaleString()} {certification.currency}
                            </div>
                            <div className="text-sm text-muted-foreground">Prix</div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {certification.description}
                        </p>
                        
                        {/* Informations clés */}
                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span className={getAvailabilityColor(certification.currentParticipants, certification.maxParticipants)}>
                              {certification.currentParticipants}/{certification.maxParticipants} inscrits
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span>{new Date(certification.nextSession).toLocaleDateString('fr-FR')}</span>
                          </div>
                        </div>

                        {/* Compétences */}
                        <div className="mb-4">
                          <div className="text-sm font-medium mb-2">Compétences acquises :</div>
                          <div className="flex flex-wrap gap-1">
                            {certification.skills.slice(0, 3).map(skill => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {certification.skills.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{certification.skills.length - 3} autres
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Instructeur */}
                        <div className="flex items-center gap-3 mb-4 p-3 bg-muted/50 rounded">
                          <AvatarPlaceholder name={certification.instructor} size={32} />
                          <div>
                            <div className="font-medium text-sm">{certification.instructor}</div>
                            <div className="text-xs text-muted-foreground">Instructeur certifié</div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button 
                            className="flex-1"
                            disabled={certification.currentParticipants >= certification.maxParticipants}
                          >
                            {certification.currentParticipants >= certification.maxParticipants ? (
                              'Complet'
                            ) : (
                              <>
                                <Award className="w-4 h-4 mr-2" />
                                S'inscrire
                              </>
                            )}
                          </Button>
                          <Button variant="outline" size="sm">
                            Détails
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Aucune certification trouvée</h3>
                  <p className="text-muted-foreground">
                    {searchQuery ? 'Essayez avec d\'autres mots-clés' : 'Les certifications seront bientôt disponibles'}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="available" className="mt-6">
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Certifications disponibles</h3>
                <p className="text-muted-foreground">
                  Filtrage par disponibilité en cours de développement
                </p>
              </div>
            </TabsContent>

            <TabsContent value="upcoming" className="mt-6">
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Prochaines sessions</h3>
                <p className="text-muted-foreground">
                  Calendrier des prochaines sessions en cours de développement
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default Certifications
