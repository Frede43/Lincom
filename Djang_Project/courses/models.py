from django.db import models
from django.conf import settings
from django.utils.text import slugify
from django.urls import reverse

class Course(models.Model):
    LEVEL_CHOICES = [
        ('beginner', 'Débutant'),
        ('intermediate', 'Intermédiaire'),
        ('advanced', 'Avancé')
    ]
    
    STATUS_CHOICES = [
        ('draft', 'Brouillon'),
        ('published', 'Publié'),
        ('archived', 'Archivé')
    ]

    title = models.CharField(max_length=200, verbose_name="Titre")
    slug = models.SlugField(max_length=200, unique=True)
    instructor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='courses_teaching',
        verbose_name="Instructeur"
    )
    overview = models.TextField(verbose_name="Aperçu")
    description = models.TextField(verbose_name="Description détaillée")
    learning_objectives = models.TextField(verbose_name="Objectifs d'apprentissage")
    prerequisites = models.TextField(verbose_name="Prérequis", blank=True)
    level = models.CharField(
        max_length=20,
        choices=LEVEL_CHOICES,
        default='beginner',
        verbose_name="Niveau"
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='draft',
        verbose_name="Statut"
    )
    image = models.ImageField(
        upload_to='courses/%Y/%m',
        blank=True,
        verbose_name="Image"
    )
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    start_date = models.DateField(verbose_name="Date de début", null=True, blank=True)
    end_date = models.DateField(verbose_name="Date de fin", null=True, blank=True)
    is_featured = models.BooleanField(default=False, verbose_name="Mis en avant")
    language = models.CharField(max_length=50, default='Français', verbose_name="Langue")
    
    class Meta:
        ordering = ['-created']
        verbose_name = "Cours"
        verbose_name_plural = "Cours"

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('courses:course_detail', args=[self.slug])

class Module(models.Model):
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='modules',
        verbose_name="Cours"
    )
    title = models.CharField(max_length=200, verbose_name="Titre")
    description = models.TextField(verbose_name="Description")
    order = models.PositiveIntegerField(default=0, verbose_name="Ordre")
    
    class Meta:
        ordering = ['order']
        verbose_name = "Module"
        verbose_name_plural = "Modules"

    def __str__(self):
        return f'{self.order}. {self.title}'

class Content(models.Model):
    module = models.ForeignKey(
        Module,
        on_delete=models.CASCADE,
        related_name='contents',
        verbose_name="Module"
    )
    title = models.CharField(max_length=200, verbose_name="Titre")
    content_type = models.CharField(
        max_length=20,
        choices=[
            ('text', 'Texte'),
            ('video', 'Vidéo'),
            ('file', 'Fichier'),
            ('assignment', 'Devoir')
        ],
        verbose_name="Type de contenu"
    )
    text_content = models.TextField(blank=True, verbose_name="Contenu texte")
    video_url = models.URLField(blank=True, verbose_name="URL de la vidéo")
    file = models.FileField(
        upload_to='course_files/%Y/%m',
        blank=True,
        verbose_name="Fichier"
    )
    order = models.PositiveIntegerField(default=0, verbose_name="Ordre")
    
    class Meta:
        ordering = ['order']
        verbose_name = "Contenu"
        verbose_name_plural = "Contenus"

    def __str__(self):
        return self.title

class Enrollment(models.Model):
    STATUS_CHOICES = [
        ('enrolled', 'Inscrit'),
        ('completed', 'Terminé'),
        ('dropped', 'Abandonné')
    ]
    
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='courses_enrolled',
        verbose_name="Étudiant"
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='enrollments',
        verbose_name="Cours"
    )
    enrolled_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='enrolled',
        verbose_name="Statut"
    )
    completion_date = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        unique_together = [['student', 'course']]
        verbose_name = "Inscription"
        verbose_name_plural = "Inscriptions"

    def __str__(self):
        return f'{self.student.username} - {self.course.title}'

class Progress(models.Model):
    enrollment = models.ForeignKey(
        Enrollment,
        on_delete=models.CASCADE,
        related_name='progress',
        verbose_name="Inscription"
    )
    content = models.ForeignKey(
        Content,
        on_delete=models.CASCADE,
        related_name='student_progress',
        verbose_name="Contenu"
    )
    completed = models.BooleanField(default=False, verbose_name="Terminé")
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        unique_together = [['enrollment', 'content']]
        verbose_name = "Progrès"
        verbose_name_plural = "Progrès"

    def __str__(self):
        return f'{self.enrollment.student.username} - {self.content.title}'

class Assignment(models.Model):
    content = models.OneToOneField(
        Content,
        on_delete=models.CASCADE,
        related_name='assignment',
        verbose_name="Contenu"
    )
    description = models.TextField(verbose_name="Description")
    due_date = models.DateTimeField(verbose_name="Date limite")
    max_score = models.PositiveIntegerField(default=100, verbose_name="Score maximum")
    
    class Meta:
        verbose_name = "Devoir"
        verbose_name_plural = "Devoirs"

    def __str__(self):
        return f'Devoir: {self.content.title}'

class Submission(models.Model):
    STATUS_CHOICES = [
        ('submitted', 'Soumis'),
        ('graded', 'Noté'),
        ('returned', 'Retourné')
    ]
    
    assignment = models.ForeignKey(
        Assignment,
        on_delete=models.CASCADE,
        related_name='submissions',
        verbose_name="Devoir"
    )
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='submissions',
        verbose_name="Étudiant"
    )
    submitted_at = models.DateTimeField(auto_now_add=True)
    file = models.FileField(
        upload_to='submissions/%Y/%m',
        verbose_name="Fichier"
    )
    comments = models.TextField(blank=True, verbose_name="Commentaires")
    score = models.PositiveIntegerField(null=True, blank=True, verbose_name="Score")
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='submitted',
        verbose_name="Statut"
    )
    graded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='graded_submissions',
        verbose_name="Noté par"
    )
    graded_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        verbose_name = "Soumission"
        verbose_name_plural = "Soumissions"

    def __str__(self):
        return f'{self.student.username} - {self.assignment.content.title}'
