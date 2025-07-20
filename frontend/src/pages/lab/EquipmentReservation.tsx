import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Calendar, Clock, ArrowLeft, CheckCircle, AlertCircle,
  DollarSign, User, FileText, Settings, Info, CreditCard,
  MapPin, Wrench, Shield, Zap, Plus, Minus, Calculator
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { PlaceholderImage } from '@/components/ui/placeholder-image'

const EquipmentReservation: React.FC = () => {
  const { equipmentId } = useParams()
  const navigate = useNavigate()
  
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [duration, setDuration] = useState(2)
  const [projectTitle, setProjectTitle] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [materials, setMaterials] = useState([{ type: 'PLA', quantity: 100, color: 'Blanc' }])
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isStudent, setIsStudent] = useState(false)

  // Mock data - sera remplacé par les vrais hooks
  const equipment = {
    id: equipmentId,
    name: 'Imprimante 3D Prusa i3 MK3S+',
    category: 'Impression 3D',
    location: 'Atelier Principal - Zone A',
    maxReservationHours: 8,
    pricing: {
      hourlyRate: 5000, // BIF
      currency: 'BIF',
      materialCost: 2000, // BIF par gramme
      setupFee: 3000, // BIF
      discounts: {
        student: 50, // 50% de réduction
        member: 30 // 30% pour membres premium
      }
    },
    certificationRequired: true,
    availableSlots: [
      { date: '2024-01-25', slots: ['09:00', '10:00', '14:00', '15:00', '16:00'] },
      { date: '2024-01-26', slots: ['09:00', '11:00', '13:00', '14:00', '15:00', '16:00'] },
      { date: '2024-01-27', slots: ['10:00', '11:00', '14:00', '15:00'] }
    ],
    materials: [
      { type: 'PLA', colors: ['Blanc', 'Noir', 'Rouge', 'Bleu', 'Vert'], pricePerGram: 2000 },
      { type: 'PETG', colors: ['Transparent', 'Blanc', 'Noir'], pricePerGram: 2500 },
      { type: 'ABS', colors: ['Blanc', 'Noir', 'Gris'], pricePerGram: 2200 }
    ]
  }

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ]

  const calculateCost = () => {
    let baseCost = equipment.pricing.setupFee + (duration * equipment.pricing.hourlyRate)
    let materialCost = materials.reduce((sum, material) => sum + (material.quantity * equipment.pricing.materialCost), 0)
    let totalCost = baseCost + materialCost
    
    if (isStudent) {
      totalCost *= (1 - equipment.pricing.discounts.student / 100)
    }
    
    return {
      baseCost,
      materialCost,
      discount: isStudent ? (baseCost * equipment.pricing.discounts.student / 100) : 0,
      totalCost
    }
  }

  const addMaterial = () => {
    setMaterials([...materials, { type: 'PLA', quantity: 50, color: 'Blanc' }])
  }

  const removeMaterial = (index: number) => {
    if (materials.length > 1) {
      setMaterials(materials.filter((_, i) => i !== index))
    }
  }

  const updateMaterial = (index: number, field: string, value: any) => {
    const updated = materials.map((material, i) => 
      i === index ? { ...material, [field]: value } : material
    )
    setMaterials(updated)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedDate || !selectedTime || !projectTitle || !agreedToTerms) {
      alert('Veuillez remplir tous les champs obligatoires')
      return
    }

    // Logique de soumission de réservation
    console.log('Réservation soumise:', {
      equipmentId,
      date: selectedDate,
      time: selectedTime,
      duration,
      project: { title: projectTitle, description: projectDescription },
      materials,
      cost: calculateCost(),
      isStudent
    })

    // Redirection vers confirmation
    navigate(`/lab/reservations/confirmation`)
  }

  const cost = calculateCost()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/lab/equipment" className="hover:text-primary">Équipements</Link>
            <span>/</span>
            <Link to={`/lab/equipment/${equipmentId}`} className="hover:text-primary">
              {equipment.name}
            </Link>
            <span>/</span>
            <span className="text-foreground">Réservation</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header de réservation */}
          <div className="mb-8">
            <Button asChild variant="ghost" className="mb-4">
              <Link to={`/lab/equipment/${equipmentId}`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à l'équipement
              </Link>
            </Button>
            
            <div className="flex items-start gap-4">
              <PlaceholderImage
                width={80}
                height={80}
                text={equipment.category}
                backgroundColor="#3B82F6"
                className="rounded-lg flex-shrink-0"
              />
              <div>
                <h1 className="text-2xl font-bold mb-2">Réserver {equipment.name}</h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {equipment.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Max {equipment.maxReservationHours}h par réservation
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Certification warning */}
          {equipment.certificationRequired && (
            <Card className="mb-6 border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-orange-800 mb-1">Certification requise</h3>
                    <p className="text-sm text-orange-700 mb-3">
                      Vous devez être certifié pour utiliser cet équipement. Si vous n'êtes pas encore certifié, 
                      vous pouvez vous inscrire à la prochaine formation.
                    </p>
                    <Button size="sm" variant="outline" className="border-orange-300 text-orange-700">
                      <Shield className="w-4 h-4 mr-2" />
                      Voir les formations
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Formulaire principal */}
              <div className="lg:col-span-2 space-y-6">
                {/* Date et heure */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Date et heure
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="date">Date *</Label>
                        <Select value={selectedDate} onValueChange={setSelectedDate}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une date" />
                          </SelectTrigger>
                          <SelectContent>
                            {equipment.availableSlots.map(slot => (
                              <SelectItem key={slot.date} value={slot.date}>
                                {new Date(slot.date).toLocaleDateString('fr-FR', {
                                  weekday: 'long',
                                  day: 'numeric',
                                  month: 'long'
                                })}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="time">Heure de début *</Label>
                        <Select value={selectedTime} onValueChange={setSelectedTime}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner l'heure" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedDate && equipment.availableSlots
                              .find(slot => slot.date === selectedDate)?.slots
                              .map(time => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))
                            }
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="duration">Durée (heures) *</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setDuration(Math.max(1, duration - 1))}
                          disabled={duration <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <Input
                          type="number"
                          value={duration}
                          onChange={(e) => setDuration(Math.min(equipment.maxReservationHours, Math.max(1, parseInt(e.target.value) || 1)))}
                          className="w-20 text-center"
                          min="1"
                          max={equipment.maxReservationHours}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setDuration(Math.min(equipment.maxReservationHours, duration + 1))}
                          disabled={duration >= equipment.maxReservationHours}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <span className="text-sm text-muted-foreground ml-2">
                          (max {equipment.maxReservationHours}h)
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Projet */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Détails du projet
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="projectTitle">Titre du projet *</Label>
                      <Input
                        id="projectTitle"
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        placeholder="Ex: Prototype capteur IoT pour agriculture"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="projectDescription">Description du projet</Label>
                      <Textarea
                        id="projectDescription"
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        placeholder="Décrivez brièvement votre projet et ce que vous comptez imprimer..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Matériaux */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wrench className="w-5 h-5" />
                      Matériaux requis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {materials.map((material, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">Matériau {index + 1}</h4>
                          {materials.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeMaterial(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <Label>Type</Label>
                            <Select
                              value={material.type}
                              onValueChange={(value) => updateMaterial(index, 'type', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {equipment.materials.map(mat => (
                                  <SelectItem key={mat.type} value={mat.type}>
                                    {mat.type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label>Couleur</Label>
                            <Select
                              value={material.color}
                              onValueChange={(value) => updateMaterial(index, 'color', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {equipment.materials
                                  .find(mat => mat.type === material.type)?.colors
                                  .map(color => (
                                    <SelectItem key={color} value={color}>
                                      {color}
                                    </SelectItem>
                                  ))
                                }
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label>Quantité (g)</Label>
                            <Input
                              type="number"
                              value={material.quantity}
                              onChange={(e) => updateMaterial(index, 'quantity', parseInt(e.target.value) || 0)}
                              min="1"
                              max="1000"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addMaterial}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter un matériau
                    </Button>
                  </CardContent>
                </Card>

                {/* Statut utilisateur */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Informations utilisateur
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="student"
                        checked={isStudent}
                        onCheckedChange={setIsStudent}
                      />
                      <Label htmlFor="student" className="text-sm">
                        Je suis étudiant (réduction de {equipment.pricing.discounts.student}%)
                      </Label>
                    </div>
                  </CardContent>
                </Card>

                {/* Conditions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Conditions d'utilisation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="terms"
                          checked={agreedToTerms}
                          onCheckedChange={setAgreedToTerms}
                          required
                        />
                        <Label htmlFor="terms" className="text-sm">
                          J'accepte les{' '}
                          <Link to="/lab/terms" className="text-primary hover:underline">
                            conditions d'utilisation du Fab Lab
                          </Link>{' '}
                          et je m'engage à respecter les règles de sécurité *
                        </Label>
                      </div>
                      
                      <div className="bg-muted/50 rounded-lg p-3 text-sm">
                        <h4 className="font-medium mb-2">Points importants :</h4>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Arrivez 10 minutes avant votre créneau</li>
                          <li>• Nettoyez l'équipement après utilisation</li>
                          <li>• Signalez tout problème technique</li>
                          <li>• Annulation gratuite jusqu'à 24h avant</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar - Récapitulatif */}
              <div className="lg:col-span-1">
                <div className="sticky top-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calculator className="w-5 h-5" />
                        Récapitulatif
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Détails réservation */}
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Équipement:</span>
                          <span className="font-medium text-right">{equipment.name}</span>
                        </div>
                        {selectedDate && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Date:</span>
                            <span className="font-medium">
                              {new Date(selectedDate).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        )}
                        {selectedTime && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Heure:</span>
                            <span className="font-medium">{selectedTime}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Durée:</span>
                          <span className="font-medium">{duration}h</span>
                        </div>
                      </div>

                      <Separator />

                      {/* Calcul des coûts */}
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Frais de setup:</span>
                          <span>{equipment.pricing.setupFee.toLocaleString()} {equipment.pricing.currency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Utilisation ({duration}h):</span>
                          <span>{(duration * equipment.pricing.hourlyRate).toLocaleString()} {equipment.pricing.currency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Matériaux:</span>
                          <span>{cost.materialCost.toLocaleString()} {equipment.pricing.currency}</span>
                        </div>
                        
                        {cost.discount > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Réduction étudiant:</span>
                            <span>-{cost.discount.toLocaleString()} {equipment.pricing.currency}</span>
                          </div>
                        )}
                      </div>

                      <Separator />

                      {/* Total */}
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span className="text-primary">
                          {cost.totalCost.toLocaleString()} {equipment.pricing.currency}
                        </span>
                      </div>

                      {/* Informations de paiement */}
                      <div className="bg-muted/50 rounded-lg p-3 text-xs">
                        <div className="flex items-center gap-2 mb-2">
                          <CreditCard className="w-4 h-4" />
                          <span className="font-medium">Paiement</span>
                        </div>
                        <p className="text-muted-foreground">
                          Le paiement se fait sur place avant utilisation. 
                          Modes acceptés : espèces, mobile money, carte bancaire.
                        </p>
                      </div>

                      {/* Bouton de réservation */}
                      <Button 
                        type="submit" 
                        className="w-full" 
                        size="lg"
                        disabled={!selectedDate || !selectedTime || !projectTitle || !agreedToTerms}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Confirmer la réservation
                      </Button>

                      {/* Aide */}
                      <div className="text-center">
                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                          <Info className="w-4 h-4 mr-2" />
                          Besoin d'aide ?
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EquipmentReservation
