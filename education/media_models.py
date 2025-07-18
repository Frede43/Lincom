from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from .integrations import VideoIntegrationFactory, DocumentIntegration

class MediaResource(models.Model):
    """Modèle pour gérer les ressources multimédias"""
    
    RESOURCE_TYPES = [
        ('video', 'Video'),
        ('document', 'Document'),
        ('image', 'Image'),
        ('audio', 'Audio'),
    ]
    
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    resource_type = models.CharField(max_length=20, choices=RESOURCE_TYPES)
    file = models.FileField(upload_to='media_resources/', null=True, blank=True)
    url = models.URLField(null=True, blank=True)
    thumbnail = models.ImageField(upload_to='thumbnails/', null=True, blank=True)
    
    # Champs pour les vidéos
    video_provider = models.CharField(max_length=50, null=True, blank=True)
    video_id = models.CharField(max_length=100, null=True, blank=True)
    embed_url = models.URLField(null=True, blank=True)
    
    # Champs pour les documents
    mime_type = models.CharField(max_length=100, null=True, blank=True)
    preview_url = models.URLField(null=True, blank=True)
    
    # Liaison générique pour associer la ressource à n'importe quel modèle
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    
    # Métadonnées
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_media'
    )
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['resource_type']),
            models.Index(fields=['content_type', 'object_id']),
        ]
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        # Traitement des vidéos
        if self.resource_type == 'video' and self.url:
            video_info = VideoIntegrationFactory.process_video_url(self.url)
            if video_info:
                self.video_provider = video_info['provider']
                self.video_id = video_info['video_id']
                self.embed_url = video_info['embed_url']
                if video_info.get('thumbnail_url') and not self.thumbnail:
                    # TODO: Télécharger la miniature depuis l'URL
                    pass
        
        # Traitement des documents
        elif self.resource_type == 'document' and self.file:
            if DocumentIntegration.is_supported(self.file.name):
                self.mime_type = DocumentIntegration.get_mime_type(self.file.name)
                if self.mime_type == 'application/pdf':
                    self.preview_url = DocumentIntegration.get_preview_url(
                        self.file.url,
                        'pdf'
                    )
        
        super().save(*args, **kwargs)

class MediaCollection(models.Model):
    """Modèle pour regrouper plusieurs ressources multimédias"""
    
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    resources = models.ManyToManyField(
        MediaResource,
        through='MediaCollectionItem'
    )
    
    # Liaison générique optionnelle
    content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    object_id = models.PositiveIntegerField(null=True, blank=True)
    content_object = GenericForeignKey('content_type', 'object_id')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_collections'
    )
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title

class MediaCollectionItem(models.Model):
    """Modèle pour gérer l'ordre des ressources dans une collection"""
    
    collection = models.ForeignKey(MediaCollection, on_delete=models.CASCADE)
    resource = models.ForeignKey(MediaResource, on_delete=models.CASCADE)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order']
        unique_together = ['collection', 'resource']
    
    def __str__(self):
        return f"{self.collection.title} - {self.resource.title}"
