from django.db import models
from django.conf import settings
from startups.models import Startup, Project
from django.utils import timezone

# Create your models here.

class ProjectCall(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    organization = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='project_calls')
    start_date = models.DateField()
    end_date = models.DateField()
    budget = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    requirements = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=[
        ('draft', 'Brouillon'),
        ('published', 'Publié'),
        ('closed', 'Fermé'),
        ('cancelled', 'Annulé')
    ], default='draft')
    
    def __str__(self):
        return self.title

class ProjectSubmission(models.Model):
    project_call = models.ForeignKey(ProjectCall, on_delete=models.CASCADE, related_name='submissions')
    startup = models.ForeignKey(Startup, on_delete=models.CASCADE, related_name='project_submissions')
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='submissions', null=True, blank=True)
    submitted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    proposal = models.TextField()
    budget_proposal = models.DecimalField(max_digits=10, decimal_places=2)
    submitted_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=[
        ('pending', 'En attente'),
        ('under_review', 'En cours d\'évaluation'),
        ('accepted', 'Accepté'),
        ('rejected', 'Rejeté')
    ], default='pending')
    
    def __str__(self):
        return f"Soumission pour {self.project_call.title} par {self.startup.name}"

class ProjectSubmissionReview(models.Model):
    submission = models.ForeignKey(ProjectSubmission, on_delete=models.CASCADE, related_name='reviews')
    reviewer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    innovation_score = models.PositiveIntegerField(
        choices=[(i, i) for i in range(1, 6)],
        help_text="Note sur l'innovation (1-5)"
    )
    feasibility_score = models.PositiveIntegerField(
        choices=[(i, i) for i in range(1, 6)],
        help_text="Note sur la faisabilité (1-5)"
    )
    market_potential_score = models.PositiveIntegerField(
        choices=[(i, i) for i in range(1, 6)],
        help_text="Note sur le potentiel du marché (1-5)"
    )
    team_score = models.PositiveIntegerField(
        choices=[(i, i) for i in range(1, 6)],
        help_text="Note sur l'équipe (1-5)"
    )
    comments = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Évaluation de soumission"
        verbose_name_plural = "Évaluations de soumissions"
        unique_together = ['submission', 'reviewer']

    def __str__(self):
        return f"Évaluation de {self.reviewer.username} pour {self.submission}"

    @property
    def total_score(self):
        return (self.innovation_score + self.feasibility_score + 
                self.market_potential_score + self.team_score) / 4.0

class Competition(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    organization = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='competitions')
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    prize = models.TextField()
    max_participants = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    type = models.CharField(max_length=20, choices=[
        ('pitch', 'Pitch'),
        ('hackathon', 'Hackathon'),
        ('challenge', 'Challenge')
    ])
    status = models.CharField(max_length=20, choices=[
        ('upcoming', 'À venir'),
        ('ongoing', 'En cours'),
        ('completed', 'Terminé'),
        ('cancelled', 'Annulé')
    ], default='upcoming')
    
    def __str__(self):
        return self.title

class CompetitionRegistration(models.Model):
    competition = models.ForeignKey(Competition, on_delete=models.CASCADE, related_name='registrations')
    startup = models.ForeignKey(Startup, on_delete=models.CASCADE, related_name='competition_registrations')
    registered_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    registered_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=[
        ('pending', 'En attente'),
        ('confirmed', 'Confirmé'),
        ('cancelled', 'Annulé')
    ], default='pending')
    
    class Meta:
        unique_together = ['competition', 'startup']
    
    def __str__(self):
        return f"{self.startup.name} - {self.competition.title}"

class OrganizationMetrics(models.Model):
    organization = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    total_project_calls = models.PositiveIntegerField(default=0)
    active_project_calls = models.PositiveIntegerField(default=0)
    total_submissions = models.PositiveIntegerField(default=0)
    accepted_submissions = models.PositiveIntegerField(default=0)
    total_competitions = models.PositiveIntegerField(default=0)
    active_competitions = models.PositiveIntegerField(default=0)
    total_participants = models.PositiveIntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Métriques pour {self.organization.username}"

    def update_metrics(self):
        self.total_project_calls = self.organization.project_calls.count()
        self.active_project_calls = self.organization.project_calls.filter(status='published').count()
        self.total_submissions = ProjectSubmission.objects.filter(project_call__organization=self.organization).count()
        self.accepted_submissions = ProjectSubmission.objects.filter(
            project_call__organization=self.organization,
            status='accepted'
        ).count()
        self.total_competitions = self.organization.competitions.count()
        self.active_competitions = self.organization.competitions.filter(
            end_date__gte=timezone.now()
        ).count()
        self.total_participants = CompetitionRegistration.objects.filter(
            competition__organization=self.organization
        ).count()
        self.save()
