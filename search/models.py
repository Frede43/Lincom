from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.utils.text import slugify

class SearchIndex(models.Model):
    """
    Modèle pour indexer les éléments recherchables dans l'application
    """
    CONTENT_TYPES = [
        ('course', 'Course'),
        ('startup', 'Startup'),
        ('project', 'Project'),
        ('competition', 'Competition'),
        ('resource', 'Resource'),
        ('user', 'User'),
        ('organization', 'Organization'),
    ]

    title = models.CharField(max_length=255)
    content = models.TextField()
    summary = models.TextField(blank=True)
    keywords = models.TextField(blank=True, help_text="Comma-separated keywords")
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    category = models.CharField(max_length=20, choices=CONTENT_TYPES)
    url = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    search_vector = models.JSONField(null=True, blank=True, help_text="Stockage du vecteur de recherche")
    
    class Meta:
        indexes = [
            models.Index(fields=['category']),
            models.Index(fields=['content_type', 'object_id']),
            models.Index(fields=['-updated_at']),
        ]
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.category} - {self.title}"

    def save(self, *args, **kwargs):
        if not self.url:
            # Génère une URL basée sur la catégorie et le titre
            slug = slugify(self.title)
            self.url = f"/{self.category}/{slug}/"
        super().save(*args, **kwargs)

class SearchQuery(models.Model):
    """
    Modèle pour suivre les requêtes de recherche des utilisateurs
    """
    query = models.CharField(max_length=255)
    user = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True)
    category = models.CharField(max_length=20, choices=SearchIndex.CONTENT_TYPES, null=True, blank=True)
    filters = models.JSONField(null=True, blank=True)
    results_count = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['query']),
        ]
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.query} ({self.results_count} results)"

class SearchFilter(models.Model):
    """
    Modèle pour définir les filtres disponibles pour chaque type de contenu
    """
    category = models.CharField(max_length=20, choices=SearchIndex.CONTENT_TYPES)
    name = models.CharField(max_length=100)
    field = models.CharField(max_length=100)
    filter_type = models.CharField(
        max_length=20,
        choices=[
            ('text', 'Text'),
            ('number', 'Number'),
            ('date', 'Date'),
            ('boolean', 'Boolean'),
            ('choice', 'Choice'),
            ('range', 'Range'),
        ]
    )
    choices = models.JSONField(null=True, blank=True, help_text="Options pour les filtres de type choice")
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['category', 'order']
        unique_together = ['category', 'field']

    def __str__(self):
        return f"{self.category} - {self.name}"
