import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  BookOpen, Clock, Users, Star, Play, Download, Share2,
  CheckCircle, Lock, ArrowLeft, Calendar, Globe, Award,
  MessageCircle, Heart, Bookmark, Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { CourseImagePlaceholder, AvatarPlaceholder } from '@/components/ui/placeholder-image'
import { useCourse, useCourseModules, useEnrollCourse, courseUtils } from '@/hooks/useCourses'

const CourseDetail: React.FC = () => {
  const { courseId } = useParams()
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  // Hooks pour récupérer les données réelles
  const { data: course, isLoading: courseLoading, error: courseError } = useCourse(courseId || '')
  const { data: modules, isLoading: modulesLoading } = useCourseModules(courseId || '')
  const enrollMutation = useEnrollCourse()

  // Loading state
  if (courseLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Chargement du cours...</span>
      </div>
    )
  }

  // Error state
  if (courseError || !course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Cours introuvable</h1>
        <p className="text-muted-foreground mb-4">Le cours demandé n'existe pas ou n'est plus disponible.</p>
        <Link to="/courses">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux cours
          </Button>
        </Link>
      </div>
    )
  }

  // Données calculées
  const safeModules = Array.isArray(modules) ? modules : []
  const totalModules = safeModules.length || course.total_modules || 0
  const totalStudents = course.total_students || 0
  const totalLessons = courseUtils.getTotalLessons(safeModules)
  const totalDuration = courseUtils.getTotalDuration(safeModules)
  // Fonction pour s'inscrire au cours
  const handleEnroll = () => {
    enrollMutation.mutate(courseId || '', {
      onSuccess: () => {
        setIsEnrolled(true)
      }
    })
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
                <Badge className="bg-green-100 text-green-800">
                  {courseUtils.getLevelLabel(course.level)}
                </Badge>
                <Badge variant="outline">Cours</Badge>
                <Badge variant="outline">Français</Badge>
              </div>

              <h1 className="text-3xl font-bold mb-4">{course.title}</h1>

              <p className="text-lg text-muted-foreground mb-6">
                {course.description}
              </p>

              {/* Métadonnées */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {courseUtils.formatDuration(course.duration_weeks)} • {totalDuration}h
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {(totalStudents || 0).toLocaleString()} étudiants
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  4.5 (24 avis)
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Mis à jour le {new Date(course.updated_at).toLocaleDateString('fr-FR')}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="secondary">Python</Badge>
                <Badge variant="secondary">Agriculture</Badge>
                <Badge variant="secondary">Innovation</Badge>
                <Badge variant="secondary">Burundi</Badge>
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
                    <div className="prose prose-sm max-w-none">
                      <p>{course.objectives}</p>
                    </div>

                    <h3 className="text-lg font-semibold mt-6 mb-3">Prérequis</h3>
                    <div className="prose prose-sm max-w-none">
                      <p>{course.prerequisites}</p>
                    </div>

                    <h3 className="text-lg font-semibold mt-6 mb-3">Programme détaillé</h3>
                    <div className="prose prose-sm max-w-none">
                      <p>{course.syllabus}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="curriculum" className="mt-6">
                <div className="space-y-4">
                  {modulesLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span className="ml-2">Chargement des modules...</span>
                    </div>
                  ) : safeModules.length > 0 ? (
                    safeModules.map((module, index) => (
                      <Card key={module.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                              <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                                {module.order || index + 1}
                              </span>
                              {module.title}
                            </CardTitle>
                            <div className="text-sm text-muted-foreground">
                              {courseUtils.formatMinutes(module.duration_hours * 60)} • {module.lessons?.length || 0} leçons
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground mb-4">{module.description}</p>
                          {module.lessons && module.lessons.length > 0 && (
                            <div className="space-y-2">
                              {module.lessons.map((lesson) => (
                                <div key={lesson.id} className="flex items-center justify-between p-2 rounded hover:bg-muted/50">
                                  <div className="flex items-center gap-3">
                                    <BookOpen className="w-4 h-4" />
                                    <span>{lesson.title}</span>
                                  </div>
                                  <span className="text-sm text-muted-foreground">
                                    {courseUtils.formatMinutes(lesson.duration_minutes)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground">Aucun module disponible pour ce cours.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="instructor" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <AvatarPlaceholder name={`Instructeur ${course.instructor}`} size={80} />
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">Instructeur {course.instructor}</h3>
                        <p className="text-muted-foreground mb-4">Expert en innovation technologique et entrepreneuriat au Burundi.</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-primary">{course.instructor?.rating || 'N/A'}</div>
                            <div className="text-sm text-muted-foreground">Note instructeur</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-primary">{(course.instructor?.studentsCount || 0).toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground">Étudiants</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-primary">{course.instructor?.coursesCount || 0}</div>
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
                  {(course.reviews && course.reviews.length > 0) ? (
                    course.reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <AvatarPlaceholder name={review.user?.name || 'Utilisateur'} size={40} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium">{review.user?.name || 'Utilisateur anonyme'}</span>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < (review.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {review.date ? new Date(review.date).toLocaleDateString('fr-FR') : 'Date inconnue'}
                              </span>
                            </div>
                            <p className="text-muted-foreground mb-3">{review.comment || 'Aucun commentaire'}</p>
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
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Aucun avis pour le moment</h3>
                      <p className="text-muted-foreground">
                        Soyez le premier à laisser un avis sur ce cours !
                      </p>
                    </div>
                  )}
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
                    category={courseUtils.getLevelLabel(course.level)}
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
                      Gratuit
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <Award className="w-3 h-3 mr-1" />
                      Certificat inclus
                    </Badge>
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
                      <span>{courseUtils.formatDuration(course.duration_weeks)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Niveau :</span>
                      <span>{courseUtils.getLevelLabel(course.level)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Langue :</span>
                      <span className="flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        Français
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Étudiants :</span>
                      <span>{(totalStudents || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Modules :</span>
                      <span>{totalModules}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Leçons :</span>
                      <span>{totalLessons}</span>
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
