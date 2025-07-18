from django.db import models
from django.conf import settings
from learning.models import Course, Training
from startups.models import Startup, Project
from organizations.models import ProjectCall, Competition

# Create your models here.

class UserActivity(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    activity_type = models.CharField(max_length=50)
    activity_id = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.JSONField(default=dict)
    
    def __str__(self):
        return f"Activité de {self.user.username} - {self.activity_type}"

class CourseAnalytics(models.Model):
    course = models.OneToOneField(Course, on_delete=models.CASCADE)
    total_students = models.IntegerField(default=0)
    average_progress = models.FloatField(default=0)
    completion_rate = models.FloatField(default=0)
    last_updated = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Analytiques - {self.course.title}"

class TrainingAnalytics(models.Model):
    training = models.OneToOneField(Training, on_delete=models.CASCADE)
    total_participants = models.IntegerField(default=0)
    attendance_rate = models.FloatField(default=0)
    satisfaction_score = models.FloatField(default=0)
    last_updated = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Analytiques - {self.training.title}"

class StartupMetrics(models.Model):
    startup = models.OneToOneField(Startup, on_delete=models.CASCADE)
    total_projects = models.IntegerField(default=0)
    active_projects = models.IntegerField(default=0)
    team_size = models.IntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Métriques - {self.startup.name}"

class ProjectCallMetrics(models.Model):
    project_call = models.OneToOneField(ProjectCall, on_delete=models.CASCADE)
    total_submissions = models.IntegerField(default=0)
    accepted_submissions = models.IntegerField(default=0)
    total_budget_requested = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    last_updated = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Métriques - {self.project_call.title}"

class CompetitionMetrics(models.Model):
    competition = models.OneToOneField(Competition, on_delete=models.CASCADE)
    total_registrations = models.IntegerField(default=0)
    confirmed_participants = models.IntegerField(default=0)
    participation_rate = models.FloatField(default=0)
    last_updated = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Métriques - {self.competition.title}"

class PlatformStatistics(models.Model):
    date = models.DateField(unique=True)
    total_users = models.IntegerField(default=0)
    active_users = models.IntegerField(default=0)
    total_startups = models.IntegerField(default=0)
    total_projects = models.IntegerField(default=0)
    total_courses = models.IntegerField(default=0)
    total_trainings = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['-date']
    
    def __str__(self):
        return f"Statistiques du {self.date}"
