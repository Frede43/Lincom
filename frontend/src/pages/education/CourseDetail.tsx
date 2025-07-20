import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  BookOpen, Clock, Users, Star, Play, Download, Share2, 
  CheckCircle, Lock, ArrowLeft, Calendar, Globe, Award,
  MessageCircle, Heart, Bookmark
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { CourseImagePlaceholder, AvatarPlaceholder } from '@/components/ui/placeholder-image'

const CourseDetail: React.FC = () => {
  const { courseId } = useParams()
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  // Mock data - sera remplacé par les vrais hooks
  const course = {
    id: courseId,
    title: 'Python pour l\'Agriculture Intelligente',
    description: 'Apprenez Python en développant des solutions concrètes pour l\'agriculture burundaise moderne. Ce cours combine théorie et pratique avec des projets réels.',
    longDescription: `Ce cours complet vous permettra de maîtriser Python tout en développant des solutions innovantes pour l'agriculture burundaise. Vous apprendrez à créer des systèmes de monitoring des cultures, des applications de gestion agricole, et des outils d'analyse de données pour optimiser les rendements.

Le programme est spécialement conçu pour le contexte burundais, avec des exemples concrets et des projets qui répondent aux défis locaux de l'agriculture.`,
    thumbnail: null,
    instructor: {
      id: '1',
      name: 'Dr. Jean NKURUNZIZA',
      avatar: null,
      bio: 'Expert en AgriTech au Burundi, PhD en Informatique Appliquée',
      experience: '8 ans d\'expérience',
      studentsCount: 2500,
      coursesCount: 12,
      rating: 4.9
    },
    duration: '8 semaines',
    totalHours: 32,
    level: 'Débutant',
    rating: 4.8,
    reviewsCount: 124,
    studentsCount: 1250,
    price: 0,
    currency: 'BIF',
    language: 'Français',
    category: 'Programmation',
    tags: ['Python', 'Agriculture', 'IoT', 'Data', 'Burundi'],
    lastUpdated: '2024-01-15',
    certificate: true,
    prerequisites: ['Notions de base en informatique', 'Motivation pour l\'agriculture'],
    learningObjectives: [
      'Maîtriser les bases de Python',
      'Développer des applications agricoles',
      'Analyser des données de production',
      'Créer des systèmes IoT pour l\'agriculture',
      'Comprendre les enjeux AgriTech au Burundi'
    ],
    modules: [
      {
        id: '1',
        title: 'Introduction à Python et l\'AgriTech',
        duration: '4h',
        lessonsCount: 6,
        isCompleted: false,
        isLocked: false,
        lessons: [
          { id: '1', title: 'Bienvenue dans le cours', duration: '10min', type: 'video', isCompleted: false },
          { id: '2', title: 'Installation de Python', duration: '15min', type: 'video', isCompleted: false },
          { id: '3', title: 'Premier programme Python', duration: '20min', type: 'video', isCompleted: false },
          { id: '4', title: 'Variables et types de données', duration: '25min', type: 'video', isCompleted: false },
          { id: '5', title: 'Quiz : Bases de Python', duration: '10min', type: 'quiz', isCompleted: false },
          { id: '6', title: 'Projet : Calculateur de rendement', duration: '30min', type: 'project', isCompleted: false }
        ]
      },
      {
        id: '2',
        title: 'Structures de données pour l\'agriculture',
        duration: '5h',
        lessonsCount: 7,
        isCompleted: false,
        isLocked: true,
        lessons: []
      },
      {
        id: '3',
        title: 'Collecte et analyse de données agricoles',
        duration: '6h',
        lessonsCount: 8,
        isCompleted: false,
        isLocked: true,
        lessons: []
      }
    ],
    reviews: [
      {
        id: '1',
        user: { name: 'Marie UWIMANA', avatar: null },
        rating: 5,
        comment: 'Excellent cours ! J\'ai pu développer une app pour mon exploitation de café.',
        date: '2024-01-10',
        helpful: 12
      },
      {
        id: '2',
        user: { name: 'Paul NDAYISENGA', avatar: null },
        rating: 5,
        comment: 'Très pratique et adapté au contexte burundais. Recommandé !',
        date: '2024-01-08',
        helpful: 8
      }
    ]
  }

  const handleEnroll = () => {
    setIsEnrolled(true)
    // Logique d'inscription
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="w-4 h-4" />
      case 'quiz': return <CheckCircle className="w-4 h-4" />
      case 'project': return <Award className="w-4 h-4" />
      default: return <BookOpen className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/courses" className="hover:text-primary flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              Cours
            </Link>
            <span>/</span>
            <span className="text-foreground">{course.title}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2">
            {/* Header du cours */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-green-100 text-green-800">{course.level}</Badge>
                <Badge variant="outline">{course.category}</Badge>
                <Badge variant="outline">{course.language}</Badge>
              </div>

              <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
              
              <p className="text-lg text-muted-foreground mb-6">
                {course.description}
              </p>

              {/* Métadonnées */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {course.duration} • {course.totalHours}h
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {course.studentsCount.toLocaleString()} étudiants
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {course.rating} ({course.reviewsCount} avis)
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Mis à jour le {new Date(course.lastUpdated).toLocaleDateString('fr-FR')}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {course.tags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>

            {/* Onglets */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Aperçu</TabsTrigger>
                <TabsTrigger value="curriculum">Programme</TabsTrigger>
                <TabsTrigger value="instructor">Instructeur</TabsTrigger>
                <TabsTrigger value="reviews">Avis</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Description du cours</CardTitle>
                  </CardHeader>
                  <CardContent className="prose max-w-none">
                    <p className="whitespace-pre-line">{course.longDescription}</p>
                    
                    <h3 className="text-lg font-semibold mt-6 mb-3">Objectifs d'apprentissage</h3>
                    <ul className="space-y-2">
                      {course.learningObjectives.map((objective, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          {objective}
                        </li>
                      ))}
                    </ul>

                    <h3 className="text-lg font-semibold mt-6 mb-3">Prérequis</h3>
                    <ul className="space-y-2">
                      {course.prerequisites.map((prerequisite, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <BookOpen className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          {prerequisite}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="curriculum" className="mt-6">
                <div className="space-y-4">
                  {course.modules.map((module, index) => (
                    <Card key={module.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </span>
                            {module.title}
                            {module.isLocked && <Lock className="w-4 h-4 text-muted-foreground" />}
                          </CardTitle>
                          <div className="text-sm text-muted-foreground">
                            {module.duration} • {module.lessonsCount} leçons
                          </div>
                        </div>
                      </CardHeader>
                      {module.lessons.length > 0 && (
                        <CardContent>
                          <div className="space-y-2">
                            {module.lessons.map((lesson) => (
                              <div key={lesson.id} className="flex items-center justify-between p-2 rounded hover:bg-muted/50">
                                <div className="flex items-center gap-3">
                                  {getLessonIcon(lesson.type)}
                                  <span className={lesson.isCompleted ? 'line-through text-muted-foreground' : ''}>
                                    {lesson.title}
                                  </span>
                                  {lesson.isCompleted && <CheckCircle className="w-4 h-4 text-green-500" />}
                                </div>
                                <span className="text-sm text-muted-foreground">{lesson.duration}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="instructor" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <AvatarPlaceholder name={course.instructor.name} size={80} />
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{course.instructor.name}</h3>
                        <p className="text-muted-foreground mb-4">{course.instructor.bio}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-primary">{course.instructor.rating}</div>
                            <div className="text-sm text-muted-foreground">Note instructeur</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-primary">{course.instructor.studentsCount.toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground">Étudiants</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-primary">{course.instructor.coursesCount}</div>
                            <div className="text-sm text-muted-foreground">Cours</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-primary">{course.instructor.experience}</div>
                            <div className="text-sm text-muted-foreground">Expérience</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-6">
                  {course.reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <AvatarPlaceholder name={review.user.name} size={40} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium">{review.user.name}</span>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {new Date(review.date).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                            <p className="text-muted-foreground mb-3">{review.comment}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <button className="flex items-center gap-1 hover:text-primary">
                                <Heart className="w-4 h-4" />
                                Utile ({review.helpful})
                              </button>
                              <button className="flex items-center gap-1 hover:text-primary">
                                <MessageCircle className="w-4 h-4" />
                                Répondre
                              </button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Aperçu du cours */}
              <Card>
                <div className="relative">
                  <CourseImagePlaceholder
                    title={course.title}
                    category={course.category}
                    className="w-full h-48 rounded-t-lg"
                  />
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute top-2 right-2"
                    onClick={toggleFavorite}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                </div>
                
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {course.price === 0 ? 'Gratuit' : `${course.price.toLocaleString()} ${course.currency}`}
                    </div>
                    {course.certificate && (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <Award className="w-3 h-3 mr-1" />
                        Certificat inclus
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-4">
                    {!isEnrolled ? (
                      <>
                        <Button onClick={handleEnroll} className="w-full" size="lg">
                          S'inscrire maintenant
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Bookmark className="w-4 h-4 mr-2" />
                          Ajouter à la liste de souhaits
                        </Button>
                      </>
                    ) : (
                      <Button asChild className="w-full" size="lg">
                        <Link to={`/courses/${course.id}/learn`}>
                          <Play className="w-4 h-4 mr-2" />
                          Commencer le cours
                        </Link>
                      </Button>
                    )}

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Share2 className="w-4 h-4 mr-2" />
                        Partager
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger
                      </Button>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Informations du cours */}
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Durée :</span>
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Niveau :</span>
                      <span>{course.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Langue :</span>
                      <span className="flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        {course.language}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Étudiants :</span>
                      <span>{course.studentsCount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Certificat :</span>
                      <span>{course.certificate ? 'Oui' : 'Non'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cours similaires */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cours similaires</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex gap-3">
                        <CourseImagePlaceholder
                          title={`Cours ${i}`}
                          category="Tech"
                          className="w-16 h-12 rounded flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-2 mb-1">
                            Cours similaire {i}
                          </h4>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            4.{8 + i}
                          </div>
                        </div>
                      </div>
                    ))}
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

export default CourseDetail
