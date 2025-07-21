import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, Filter, BookOpen, Clock, Users, Star, ChevronRight, Play, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CourseImagePlaceholder, AvatarPlaceholder } from '@/components/ui/placeholder-image'
import { useCourses } from '@/hooks/useCourses'
import { Link } from 'react-router-dom'

const Courses: React.FC = () => {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')

  // Utilisation des vraies APIs
  const { data: coursesData, isLoading, error } = useCourses({
    search: searchQuery || undefined,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    level: selectedLevel !== 'all' ? selectedLevel : undefined,
  })
  // Extraire les cours des données de l'API
  const courses = coursesData?.results || []

  const categories = [
    { value: 'all', label: 'Toutes les catégories' },
    { value: 'programmation', label: 'Programmation' },
    { value: 'business', label: 'Business & Entrepreneuriat' },
    { value: 'technologie', label: 'Technologie & Innovation' },
    { value: 'agriculture', label: 'Agriculture Intelligente' },
    { value: 'design', label: 'Design & Créativité' }
  ]

  const levels = [
    { value: 'all', label: 'Tous les niveaux' },
    { value: 'debutant', label: 'Débutant' },
    { value: 'intermediaire', label: 'Intermédiaire' },
    { value: 'avance', label: 'Avancé' }
  ]

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' ||
                           course.level.toLowerCase() === selectedCategory
    const matchesLevel = selectedLevel === 'all' || 
                        course.level.toLowerCase() === selectedLevel
    
    return matchesSearch && matchesCategory && matchesLevel
  })

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'débutant': return 'bg-green-100 text-green-800'
      case 'intermédiaire': return 'bg-yellow-100 text-yellow-800'
      case 'avancé': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center">
              <BookOpen className="mr-3" />
              Cours & Formations
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Développez vos compétences avec nos formations adaptées au contexte burundais
            </p>
            
            {/* Barre de recherche */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Rechercher un cours, une compétence, un instructeur..."
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

          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Niveau" />
            </SelectTrigger>
            <SelectContent>
              {levels.map(level => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={() => {
            setSearchQuery('')
            setSelectedCategory('all')
            setSelectedLevel('all')
          }}>
            Réinitialiser
          </Button>
        </div>

        {/* États de chargement et d'erreur */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Chargement des cours...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-2 text-red-800 mb-2">
              <span className="font-medium">Erreur de chargement</span>
            </div>
            <p className="text-red-700 text-sm">
              Impossible de charger les cours. Veuillez réessayer plus tard.
            </p>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{filteredCourses.length}</div>
              <div className="text-sm text-muted-foreground">Cours disponibles</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">2,707</div>
              <div className="text-sm text-muted-foreground">Étudiants actifs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">15</div>
              <div className="text-sm text-muted-foreground">Instructeurs experts</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">4.8</div>
              <div className="text-sm text-muted-foreground">Note moyenne</div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des cours */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <Card key={course.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="relative">
                <CourseImagePlaceholder
                  title={course.title}
                  category={course.level}
                  className="w-full h-48 rounded-t-lg"
                />
                {course.isEnrolled && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-green-500">Inscrit</Badge>
                  </div>
                )}
                {course.price === 0 && (
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-blue-500">Gratuit</Badge>
                  </div>
                )}
              </div>

              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={getLevelColor(course.level)}>
                    {course.level}
                  </Badge>
                  <Badge variant="outline">Cours</Badge>
                </div>

                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>

                {/* Instructeur */}
                <div className="flex items-center gap-3 mb-4">
                  <AvatarPlaceholder name={`Instructeur ${course.instructor}`} size={32} />
                  <div>
                    <div className="font-medium text-sm">Instructeur {course.instructor}</div>
                    <div className="text-xs text-muted-foreground">Expert en innovation</div>
                  </div>
                </div>

                {/* Métadonnées */}
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {course.duration_weeks} semaines
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {course.studentsCount ? course.studentsCount.toLocaleString() : '0'}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {course.rating || '4.5'}
                  </div>
                </div>

                {/* Progression si inscrit */}
                {course.isEnrolled && course.progress && course.progress > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progression</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  {course.isEnrolled ? (
                    <Button asChild className="flex-1">
                      <Link to={`/courses/${course.id}/learn`}>
                        <Play className="w-4 h-4 mr-2" />
                        Continuer
                      </Link>
                    </Button>
                  ) : (
                    <Button asChild className="flex-1">
                      <Link to={`/courses/${course.id}`}>
                        Voir le cours
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Message si aucun résultat */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Aucun cours trouvé</h3>
            <p className="text-muted-foreground mb-4">
              Essayez de modifier vos critères de recherche ou explorez nos catégories.
            </p>
            <Button onClick={() => {
              setSearchQuery('')
              setSelectedCategory('all')
              setSelectedLevel('all')
            }}>
              Voir tous les cours
            </Button>
          </div>
        )}
          </>
        )}
      </div>
    </div>
  )
}

export default Courses
