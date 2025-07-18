from django.db import models
from django.conf import settings

# Create your models here.

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "categories"

class Course(models.Model):
    LEVEL_CHOICES = [
        ('BEGINNER', 'Débutant'),
        ('INTERMEDIATE', 'Intermédiaire'),
        ('ADVANCED', 'Avancé')
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    mentor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='courses_taught')
    students = models.ManyToManyField(settings.AUTH_USER_MODEL, through='CourseEnrollment', related_name='courses_enrolled')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='courses')
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default='BEGINNER')
    image = models.ImageField(upload_to='courses/', null=True, blank=True)
    
    def __str__(self):
        return self.title
    
    @property
    def enrolled_students(self):
        return self.students.all()
    
    def get_level_display(self):
        return dict(self.LEVEL_CHOICES)[self.level]

class CourseEnrollment(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    progress = models.IntegerField(default=0)
    enrolled_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['student', 'course']

class Training(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    mentor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='trainings_conducted')
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    max_participants = models.IntegerField()
    participants = models.ManyToManyField(settings.AUTH_USER_MODEL, through='TrainingRegistration', related_name='trainings')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='trainings')
    image = models.ImageField(upload_to='trainings/', null=True, blank=True)
    
    def __str__(self):
        return self.title

class TrainingRegistration(models.Model):
    participant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    training = models.ForeignKey(Training, on_delete=models.CASCADE)
    registered_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=[
        ('pending', 'En attente'),
        ('confirmed', 'Confirmé'),
        ('cancelled', 'Annulé')
    ], default='pending')
    
    class Meta:
        unique_together = ['participant', 'training']
