import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, MessageCircle, Tag, Eye, Save, Send, 
  Bold, Italic, Link as LinkIcon, Image, Code, List,
  AlertCircle, Info, CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'

const CreateTopic: React.FC = () => {
  const navigate = useNavigate()
  
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [notifyReplies, setNotifyReplies] = useState(true)
  const [isDraft, setIsDraft] = useState(false)

  // Mock data - sera remplacé par les vrais hooks
  const categories = [
    { id: '1', name: 'Général', icon: '💬' },
    { id: '2', name: 'Entrepreneuriat', icon: '🚀' },
    { id: '3', name: 'Technologie', icon: '💻' },
    { id: '4', name: 'Fab Lab', icon: '🔧' },
    { id: '5', name: 'Formations', icon: '📚' },
    { id: '6', name: 'Événements', icon: '📅' }
  ]

  const suggestedTags = [
    'Startup', 'Innovation', 'Financement', 'Mentorat', 'Partenariat',
    'AgriTech', 'FinTech', 'HealthTech', 'EdTech', 'CleanTech',
    'Python', 'JavaScript', 'React', 'Mobile', 'Web',
    'Impression 3D', 'IoT', 'Arduino', 'Prototype', 'Design',
    'Formation', 'Certification', 'Atelier', 'Cours', 'Tutoriel'
  ]

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !content.trim() || !category) {
      alert('Veuillez remplir tous les champs obligatoires')
      return
    }

    // Logique de création du sujet
    const topicData = {
      title: title.trim(),
      content: content.trim(),
      category,
      tags,
      isAnonymous,
      notifyReplies,
      isDraft
    }

    console.log('Nouveau sujet:', topicData)

    if (isDraft) {
      // Sauvegarder comme brouillon
      alert('Sujet sauvegardé comme brouillon')
    } else {
      // Publier le sujet
      alert('Sujet publié avec succès !')
      navigate('/forum')
    }
  }

  const saveDraft = () => {
    setIsDraft(true)
    handleSubmit(new Event('submit') as any)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/forum" className="hover:text-primary flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              Forum
            </Link>
            <span>/</span>
            <span className="text-foreground">Créer une discussion</span>
          </div>
        </div>
      </div>

      {/* Header de création */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-2 flex items-center justify-center">
              <MessageCircle className="mr-3" />
              Créer une nouvelle discussion
            </h1>
            <p className="text-xl text-white/90">
              Partagez vos idées, posez vos questions et engagez la conversation
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Formulaire principal */}
              <div className="lg:col-span-2 space-y-6">
                {/* Titre */}
                <Card>
                  <CardHeader>
                    <CardTitle>Titre de la discussion *</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ex: Comment développer l'écosystème tech au Burundi ?"
                      className="text-lg"
                      maxLength={200}
                      required
                    />
                    <div className="text-sm text-muted-foreground mt-2">
                      {title.length}/200 caractères
                    </div>
                  </CardContent>
                </Card>

                {/* Catégorie */}
                <Card>
                  <CardHeader>
                    <CardTitle>Catégorie *</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select value={category} onValueChange={setCategory} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>
                            <div className="flex items-center gap-2">
                              <span>{cat.icon}</span>
                              {cat.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                {/* Contenu */}
                <Card>
                  <CardHeader>
                    <CardTitle>Contenu de la discussion *</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Barre d'outils simple */}
                    <div className="flex items-center gap-2 mb-3 p-2 border rounded-lg bg-muted/50">
                      <Button type="button" variant="ghost" size="sm" title="Gras">
                        <Bold className="w-4 h-4" />
                      </Button>
                      <Button type="button" variant="ghost" size="sm" title="Italique">
                        <Italic className="w-4 h-4" />
                      </Button>
                      <Button type="button" variant="ghost" size="sm" title="Lien">
                        <LinkIcon className="w-4 h-4" />
                      </Button>
                      <Button type="button" variant="ghost" size="sm" title="Image">
                        <Image className="w-4 h-4" />
                      </Button>
                      <Button type="button" variant="ghost" size="sm" title="Code">
                        <Code className="w-4 h-4" />
                      </Button>
                      <Button type="button" variant="ghost" size="sm" title="Liste">
                        <List className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <Textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Décrivez votre sujet en détail. Soyez clair et précis pour encourager les réponses constructives..."
                      rows={12}
                      className="resize-none"
                      required
                    />
                    
                    <div className="text-sm text-muted-foreground mt-2">
                      {content.length} caractères • Markdown supporté
                    </div>
                  </CardContent>
                </Card>

                {/* Tags */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Tag className="w-5 h-5" />
                      Tags (optionnel)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Tags actuels */}
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                              {tag} ×
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      {/* Ajouter un tag */}
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Ajouter un tag..."
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              addTag(newTag)
                            }
                          }}
                          disabled={tags.length >= 5}
                        />
                        <Button
                          type="button"
                          onClick={() => addTag(newTag)}
                          disabled={!newTag.trim() || tags.length >= 5}
                        >
                          Ajouter
                        </Button>
                      </div>
                      
                      {/* Tags suggérés */}
                      <div>
                        <Label className="text-sm text-muted-foreground mb-2 block">
                          Tags suggérés (cliquez pour ajouter) :
                        </Label>
                        <div className="flex flex-wrap gap-1">
                          {suggestedTags
                            .filter(tag => !tags.includes(tag))
                            .slice(0, 10)
                            .map(tag => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="cursor-pointer hover:bg-muted"
                                onClick={() => addTag(tag)}
                              >
                                {tag}
                              </Badge>
                            ))
                          }
                        </div>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        Maximum 5 tags • {5 - tags.length} restants
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Options */}
                <Card>
                  <CardHeader>
                    <CardTitle>Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="anonymous"
                        checked={isAnonymous}
                        onCheckedChange={setIsAnonymous}
                      />
                      <Label htmlFor="anonymous" className="text-sm">
                        Publier anonymement
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="notify"
                        checked={notifyReplies}
                        onCheckedChange={setNotifyReplies}
                      />
                      <Label htmlFor="notify" className="text-sm">
                        M'envoyer des notifications pour les réponses
                      </Label>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <Button type="button" variant="outline" onClick={saveDraft}>
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder comme brouillon
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" asChild>
                      <Link to="/forum">Annuler</Link>
                    </Button>
                    <Button type="button" variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      Prévisualiser
                    </Button>
                    <Button type="submit">
                      <Send className="w-4 h-4 mr-2" />
                      Publier la discussion
                    </Button>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-4 space-y-6">
                  {/* Conseils */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Info className="w-5 h-5" />
                        Conseils
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-3">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Choisissez un titre clair et descriptif</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Sélectionnez la bonne catégorie</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Détaillez votre question ou sujet</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Utilisez des tags pertinents</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Respectez les règles de la communauté</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Règles */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        Règles importantes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                      <p>• Respectez les autres membres</p>
                      <p>• Pas de contenu offensant ou spam</p>
                      <p>• Restez dans le sujet de la catégorie</p>
                      <p>• Partagez des informations utiles</p>
                      <p>• Utilisez un langage professionnel</p>
                      
                      <div className="mt-4">
                        <Button variant="outline" size="sm" className="w-full">
                          Voir toutes les règles
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Statistiques */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Vos statistiques</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Discussions créées:</span>
                        <span className="font-medium">12</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Réponses données:</span>
                        <span className="font-medium">45</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Likes reçus:</span>
                        <span className="font-medium">89</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Réputation:</span>
                        <span className="font-medium text-green-600">Excellente</span>
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

export default CreateTopic
