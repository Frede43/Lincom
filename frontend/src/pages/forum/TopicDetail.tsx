import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  MessageSquare, 
  Eye, 
  Heart, 
  Pin, 
  Lock, 
  Clock, 
  User,
  Reply,
  MoreVertical,
  Flag,
  Edit,
  Trash2,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { AvatarPlaceholder } from '@/components/ui/placeholder-image'
import { useForumTopic, useForumPosts } from '@/hooks/useForum'

const TopicDetail: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>()
  const navigate = useNavigate()
  const [replyContent, setReplyContent] = useState('')
  const [isReplying, setIsReplying] = useState(false)

  // Récupérer les données du topic
  const {
    data: topic,
    isLoading: topicLoading,
    error: topicError
  } = useForumTopic(topicId!)

  // Récupérer les posts du topic
  const {
    data: posts = [],
    isLoading: postsLoading,
    error: postsError
  } = useForumPosts(topicId!)

  const isLoading = topicLoading || postsLoading
  const error = topicError || postsError

  // Fonctions utilitaires
  const getTimeAgo = (date: string) => {
    const now = new Date()
    const past = new Date(date)
    const diffInHours = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Il y a moins d\'une heure'
    if (diffInHours < 24) return `Il y a ${diffInHours}h`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `Il y a ${diffInDays}j`
    return past.toLocaleDateString('fr-FR')
  }

  const handleReply = async () => {
    if (!replyContent.trim()) return
    
    setIsReplying(true)
    try {
      // TODO: Implémenter l'API pour créer une réponse
      console.log('Réponse:', replyContent)
      setReplyContent('')
      // Recharger les posts après la réponse
    } catch (error) {
      console.error('Erreur lors de la réponse:', error)
    } finally {
      setIsReplying(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Chargement du sujet...</span>
      </div>
    )
  }

  if (error || !topic) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Erreur de chargement</h1>
        <p className="text-muted-foreground mb-4">Impossible de charger ce sujet.</p>
        <Button onClick={() => navigate('/forum')}>
          Retour au forum
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/forum')}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour au forum
              </Button>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {topic.is_pinned && <Pin className="w-5 h-5 text-yellow-300" />}
                  {topic.is_locked && <Lock className="w-5 h-5 text-red-300" />}
                  <h1 className="text-2xl font-bold">{topic.title}</h1>
                </div>
                
                <div className="flex items-center gap-4 text-white/80">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>Par {topic.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{getTimeAgo(topic.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{topic.reply_count || 0} réponses</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{topic.view_count || 0} vues</span>
                  </div>
                </div>
              </div>
              
              <Badge variant="secondary" className="bg-white/10 text-white">
                {topic.category_name || 'Général'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Post principal */}
          <Card>
            <CardHeader>
              <div className="flex items-start gap-4">
                <AvatarPlaceholder name={`Auteur ${topic.author}`} size={48} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">Auteur {topic.author}</span>
                    <Badge variant="outline">Auteur</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {getTimeAgo(topic.created_at)}
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap">{topic.content}</p>
              </div>
              
              <div className="flex items-center gap-4 mt-6 pt-4 border-t">
                <Button variant="ghost" size="sm">
                  <Heart className="w-4 h-4 mr-2" />
                  J'aime
                </Button>
                <Button variant="ghost" size="sm">
                  <Reply className="w-4 h-4 mr-2" />
                  Répondre
                </Button>
                <Button variant="ghost" size="sm">
                  <Flag className="w-4 h-4 mr-2" />
                  Signaler
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Réponses */}
          {posts.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">
                {posts.length} réponse{posts.length > 1 ? 's' : ''}
              </h2>
              
              {posts.map((post, index) => (
                <Card key={post.id}>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <AvatarPlaceholder name={`Utilisateur ${post.author}`} size={40} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">Utilisateur {post.author}</span>
                          <Badge variant="secondary">#{index + 1}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {getTimeAgo(post.created_at)}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <p className="whitespace-pre-wrap">{post.content}</p>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                      <Button variant="ghost" size="sm">
                        <Heart className="w-4 h-4 mr-2" />
                        J'aime
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Reply className="w-4 h-4 mr-2" />
                        Répondre
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Flag className="w-4 h-4 mr-2" />
                        Signaler
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Formulaire de réponse */}
          {!topic.is_locked && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Répondre à ce sujet</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Écrivez votre réponse..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    rows={6}
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setReplyContent('')}
                    >
                      Annuler
                    </Button>
                    <Button
                      onClick={handleReply}
                      disabled={!replyContent.trim() || isReplying}
                    >
                      {isReplying ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Publication...
                        </>
                      ) : (
                        <>
                          <Reply className="w-4 h-4 mr-2" />
                          Publier la réponse
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {topic.is_locked && (
            <Card className="bg-muted/50">
              <CardContent className="py-6">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Lock className="w-5 h-5" />
                  <span>Ce sujet est verrouillé. Aucune nouvelle réponse n'est autorisée.</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default TopicDetail
