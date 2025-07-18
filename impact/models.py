# Modèle suggéré pour mesurer l'impact social et économique
from django.db import models
from django.conf import settings

class SDGGoal(models.Model):
    """Objectifs de Développement Durable (ODD/SDGs)"""
    number = models.IntegerField(unique=True)  # 1-17
    title = models.CharField(max_length=200)
    description = models.TextField()
    icon = models.CharField(max_length=50)
    color = models.CharField(max_length=7)  # Hex color
    
    def __str__(self):
        return f"SDG {self.number}: {self.title}"

class ImpactMetric(models.Model):
    """Métriques d'impact du Community Lab"""
    METRIC_TYPES = [
        ('social', 'Impact Social'),
        ('economic', 'Impact Économique'),
        ('environmental', 'Impact Environnemental'),
        ('educational', 'Impact Éducatif'),
    ]
    
    name = models.CharField(max_length=200)
    description = models.TextField()
    metric_type = models.CharField(max_length=20, choices=METRIC_TYPES)
    unit = models.CharField(max_length=50)  # personnes, emplois, tonnes CO2, etc.
    sdg_goals = models.ManyToManyField(SDGGoal, blank=True)
    target_value = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    current_value = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    
    def __str__(self):
        return self.name

class ProjectImpact(models.Model):
    """Impact d'un projet spécifique"""
    project = models.ForeignKey('entrepreneurship.Project', on_delete=models.CASCADE)
    metric = models.ForeignKey(ImpactMetric, on_delete=models.CASCADE)
    value = models.DecimalField(max_digits=15, decimal_places=2)
    measurement_date = models.DateField()
    evidence = models.TextField(blank=True)  # Preuves/sources
    verified = models.BooleanField(default=False)
    verified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True
    )
    
    def __str__(self):
        return f"{self.project.title} - {self.metric.name}: {self.value}"

class CommunityImpactReport(models.Model):
    """Rapports d'impact périodiques"""
    PERIOD_CHOICES = [
        ('monthly', 'Mensuel'),
        ('quarterly', 'Trimestriel'),
        ('annual', 'Annuel'),
    ]
    
    title = models.CharField(max_length=200)
    period = models.CharField(max_length=20, choices=PERIOD_CHOICES)
    start_date = models.DateField()
    end_date = models.DateField()
    summary = models.TextField()
    
    # Métriques clés
    startups_created = models.IntegerField(default=0)
    jobs_created = models.IntegerField(default=0)
    people_trained = models.IntegerField(default=0)
    projects_completed = models.IntegerField(default=0)
    funding_raised = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    
    # Données démographiques
    gender_distribution = models.JSONField(default=dict)  # {"male": 60, "female": 40}
    age_distribution = models.JSONField(default=dict)
    education_levels = models.JSONField(default=dict)
    
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.title} ({self.start_date} - {self.end_date})"
