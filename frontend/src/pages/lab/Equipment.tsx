import React, { useState } from 'react'
import { Search, Filter, Wrench, Calendar, Clock, CheckCircle, AlertTriangle, Users, BookOpen, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PlaceholderImage } from '@/components/ui/placeholder-image'
import { Link } from 'react-router-dom'
import { useEquipment } from '@/hooks/useEquipment'

const Equipment: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  // Utilisation des vraies APIs Django
  const {
    data: equipment = [],
    isLoading,
    error
  } = useEquipment({
    search: searchQuery,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    status: selectedStatus !== 'all' ? selectedStatus : undefined,
  })

  // Mock data de fallback si pas de données
  const mockEquipment = [
    {
      id: '1',
      name: 'Imprimante 3D Prusa i3 MK3S+',
      description: 'Imprimante 3D haute précision pour prototypage rapide et fabrication de pièces.',
      image: null,
      category: 'Impression 3D',
      status: 'available',
      location: 'Atelier Principal',
      manufacturer: 'Prusa Research',
      model: 'i3 MK3S+',
      serialNumber: 'PR-001-2024',
      acquisitionDate: '2024-01-15',
      lastMaintenance: '2024-01-10',
      nextMaintenance: '2024-04-10',
      specifications: {
        'Volume d\'impression': '250 × 210 × 210 mm',
        'Précision': '±0.1 mm',
        'Matériaux': 'PLA, PETG, ABS, ASA, PC, CPE, PVA, HIPS, PP, Flex',
        'Connectivité': 'USB, Ethernet, Wi-Fi'
      },
      certificationRequired: true,
      maxReservationHours: 8,
      hourlyRate: 5000, // BIF
      currency: 'BIF',
      currentReservations: 3,
      totalUsageHours: 156,
      averageRating: 4.8,
      reviewsCount: 23
    },
    {
      id: '2',
      name: 'Découpeuse Laser CO2 40W',
      description: 'Découpeuse laser pour matériaux fins : bois, acrylique, carton, tissu.',
      image: null,
      category: 'Découpe Laser',
      status: 'maintenance',
      location: 'Atelier Laser',
      manufacturer: 'K40',
      model: 'CO2-40W',
      serialNumber: 'K40-002-2024',
      acquisitionDate: '2023-12-01',
      lastMaintenance: '2024-01-18',
      nextMaintenance: '2024-02-18',
      specifications: {
        'Puissance': '40W CO2',
        'Surface de travail': '300 × 200 mm',
        'Épaisseur max': '6 mm (bois), 3 mm (acrylique)',
        'Précision': '±0.1 mm',
        'Logiciel': 'LaserGRBL, LightBurn'
      },
      certificationRequired: true,
      maxReservationHours: 4,
      hourlyRate: 8000, // BIF
      currency: 'BIF',
      currentReservations: 0,
      totalUsageHours: 89,
      averageRating: 4.6,
      reviewsCount: 15
    },
    {
      id: '3',
      name: 'Arduino Starter Kit',
      description: 'Kit complet pour débuter en électronique et programmation avec Arduino.',
      image: null,
      category: 'Électronique',
      status: 'available',
      location: 'Espace Électronique',
      manufacturer: 'Arduino',
      model: 'Starter Kit Rev3',
      serialNumber: 'ARD-003-2024',
      acquisitionDate: '2024-01-20',
      lastMaintenance: '2024-01-20',
      nextMaintenance: '2024-07-20',
      specifications: {
        'Microcontrôleur': 'Arduino Uno R3',
        'Composants': '200+ composants électroniques',
        'Capteurs': 'Température, lumière, mouvement',
        'Actuateurs': 'LEDs, servomoteurs, buzzer',
        'Documentation': 'Guide complet + projets'
      },
      certificationRequired: false,
      maxReservationHours: 24,
      hourlyRate: 1000, // BIF
      currency: 'BIF',
      currentReservations: 1,
      totalUsageHours: 45,
      averageRating: 4.9,
      reviewsCount: 31
    },
    {
      id: '4',
      name: 'Oscilloscope Numérique',
      description: 'Oscilloscope 2 canaux pour analyse de signaux électroniques.',
      image: null,
      category: 'Mesure',
      status: 'reserved',
      location: 'Laboratoire Électronique',
      manufacturer: 'Rigol',
      model: 'DS1054Z',
      serialNumber: 'RIG-004-2024',
      acquisitionDate: '2023-11-15',
      lastMaintenance: '2024-01-05',
      nextMaintenance: '2024-04-05',
      specifications: {
        'Canaux': '4 canaux analogiques',
        'Bande passante': '50 MHz',
        'Échantillonnage': '1 GSa/s',
        'Mémoire': '24 Mpts',
        'Écran': '7" couleur TFT'
      },
      certificationRequired: true,
      maxReservationHours: 6,
      hourlyRate: 3000, // BIF
      currency: 'BIF',
      currentReservations: 2,
      totalUsageHours: 78,
      averageRating: 4.7,
      reviewsCount: 12
    }
  ]

  const categories = [
    { value: 'all', label: 'Toutes les catégories' },
    { value: 'impression-3d', label: 'Impression 3D' },
    { value: 'decoupe-laser', label: 'Découpe Laser' },
    { value: 'electronique', label: 'Électronique' },
    { value: 'mesure', label: 'Instruments de Mesure' },
    { value: 'usinage', label: 'Usinage CNC' },
    { value: 'textile', label: 'Textile & Broderie' }
  ]

  const statuses = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'available', label: 'Disponible' },
    { value: 'reserved', label: 'Réservé' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'out-of-order', label: 'Hors service' }
  ]

  // Utiliser les vraies données ou les données mockées en fallback
  const displayEquipment = Array.isArray(equipment) && equipment.length > 0 ? equipment : mockEquipment

  const filteredEquipment = displayEquipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || 
                           item.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'reserved': return 'bg-yellow-100 text-yellow-800'
      case 'maintenance': return 'bg-orange-100 text-orange-800'
      case 'out-of-order': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available': return 'Disponible'
      case 'reserved': return 'Réservé'
      case 'maintenance': return 'Maintenance'
      case 'out-of-order': return 'Hors service'
      default: return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="w-4 h-4" />
      case 'reserved': return <Clock className="w-4 h-4" />
      case 'maintenance': return <Wrench className="w-4 h-4" />
      case 'out-of-order': return <AlertTriangle className="w-4 h-4" />
      default: return <CheckCircle className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center">
              <Wrench className="mr-3" />
              Équipements Fab Lab
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Accédez aux outils de fabrication numérique de pointe du Community Lab
            </p>
            
            {/* Barre de recherche */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Rechercher un équipement, une catégorie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg bg-white text-gray-900"
              />
            </div>
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
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
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

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-48">
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

          <Button variant="outline" onClick={() => {
            setSearchQuery('')
            setSelectedCategory('all')
            setSelectedStatus('all')
          }}>
            Réinitialiser
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{filteredEquipment.length}</div>
              <div className="text-sm text-muted-foreground">Équipements</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredEquipment.filter(e => e.status === 'available').length}
              </div>
              <div className="text-sm text-muted-foreground">Disponibles</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {filteredEquipment.filter(e => e.status === 'reserved').length}
              </div>
              <div className="text-sm text-muted-foreground">Réservés</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">368h</div>
              <div className="text-sm text-muted-foreground">Utilisation totale</div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des équipements */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEquipment.map(item => (
            <Card key={item.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="relative">
                <PlaceholderImage
                  width={400}
                  height={200}
                  text={item.category}
                  backgroundColor="#3B82F6"
                  className="w-full h-48 rounded-t-lg"
                />
                <div className="absolute top-2 left-2">
                  <Badge className={getStatusColor(item.status)}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(item.status)}
                      {getStatusLabel(item.status)}
                    </span>
                  </Badge>
                </div>
                {item.certificationRequired && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-purple-100 text-purple-800">
                      <BookOpen className="w-3 h-3 mr-1" />
                      Certification requise
                    </Badge>
                  </div>
                )}
              </div>

              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline">{item.category}</Badge>
                  <div className="text-sm text-muted-foreground">
                    {item.location}
                  </div>
                </div>

                <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                  {item.name}
                </h3>
                
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {item.description}
                </p>

                {/* Spécifications clés */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Fabricant:</span>
                    <span className="font-medium">{item.manufacturer}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Modèle:</span>
                    <span className="font-medium">{item.model}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tarif/heure:</span>
                    <span className="font-medium">{item.hourlyRate.toLocaleString()} {item.currency}</span>
                  </div>
                </div>

                {/* Métadonnées */}
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {item.currentReservations} réservations
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {item.totalUsageHours}h utilisées
                  </div>
                </div>

                {/* Prochaine maintenance */}
                {item.status !== 'maintenance' && (
                  <div className="text-xs text-muted-foreground mb-4">
                    <Calendar className="w-3 h-3 inline mr-1" />
                    Prochaine maintenance: {new Date(item.nextMaintenance).toLocaleDateString('fr-FR')}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button asChild className="flex-1" size="sm">
                    <Link to={`/lab/equipment/${item.id}`}>
                      Voir détails
                    </Link>
                  </Button>
                  {item.status === 'available' && (
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/lab/equipment/${item.id}/reserve`}>
                        <Calendar className="w-4 h-4 mr-1" />
                        Réserver
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Message si aucun résultat */}
        {filteredEquipment.length === 0 && (
          <div className="text-center py-12">
            <Wrench className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Aucun équipement trouvé</h3>
            <p className="text-muted-foreground mb-4">
              Essayez de modifier vos critères de recherche ou explorez nos catégories.
            </p>
            <Button onClick={() => {
              setSearchQuery('')
              setSelectedCategory('all')
              setSelectedStatus('all')
            }}>
              Voir tous les équipements
            </Button>
          </div>
        )}

        {/* Section informative */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Formations & Certifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Certains équipements nécessitent une formation préalable pour garantir la sécurité et la qualité d'utilisation.
              </p>
              <Button asChild variant="outline">
                <Link to="/lab/certifications">
                  Voir les formations
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Réservations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Planifiez vos sessions de travail et optimisez votre temps au Fab Lab avec notre système de réservation.
              </p>
              <Button asChild variant="outline">
                <Link to="/lab/reservations">
                  Mes réservations
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Equipment
