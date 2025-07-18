from django.db import models
from django.conf import settings
from django.utils import timezone

class Organization(models.Model):
    TYPE_CHOICES = [
        ('startup', 'Startup'),
        ('company', 'Company'),
        ('university', 'University'),
        ('ngo', 'NGO'),
        ('government', 'Government'),
        ('other', 'Other'),
    ]
    
    STAGE_CHOICES = [
        ('idea', 'Idea Stage'),
        ('mvp', 'MVP'),
        ('seed', 'Seed Stage'),
        ('early', 'Early Stage'),
        ('growth', 'Growth Stage'),
        ('scale', 'Scale Up'),
    ]
    
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, null=True, blank=True)
    sector = models.CharField(max_length=100, null=True, blank=True)
    location = models.CharField(max_length=255, null=True, blank=True)
    website = models.URLField(blank=True, null=True)
    logo = models.ImageField(upload_to='organization_logos/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    contact_email = models.EmailField(null=True, blank=True)
    contact_phone = models.CharField(max_length=20, blank=True, null=True)
    
    # Champs spécifiques aux startups
    founding_date = models.DateField(null=True, blank=True)
    stage = models.CharField(max_length=20, choices=STAGE_CHOICES, null=True, blank=True)
    team_size = models.IntegerField(null=True, blank=True)
    funding_raised = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    pitch_deck = models.FileField(upload_to='pitch_decks/', null=True, blank=True)
    social_links = models.JSONField(default=dict, blank=True, null=True)
    market_size = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    revenue = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    patents = models.IntegerField(default=0, blank=True)
    tech_stack = models.JSONField(default=list, blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']

class CallForProject(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('open', 'Open'),
        ('closed', 'Closed'),
        ('cancelled', 'Cancelled'),
    ]
    
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='call_for_projects')
    title = models.CharField(max_length=255)
    description = models.TextField()
    requirements = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    budget_min = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    budget_max = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['start_date']

class Competition(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    title = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='competitions', null=True, blank=True)
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    registration_deadline = models.DateTimeField(null=True, blank=True)
    prize_description = models.TextField(null=True, blank=True)
    rules = models.TextField(null=True, blank=True)
    eligibility_criteria = models.TextField(null=True, blank=True)
    max_participants = models.IntegerField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='created_competitions')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-start_date']

class CompetitionParticipant(models.Model):
    STATUS_CHOICES = [
        ('registered', 'Registered'),
        ('in_progress', 'In Progress'),
        ('submitted', 'Submitted'),
        ('evaluated', 'Evaluated'),
        ('winner', 'Winner'),
        ('eliminated', 'Eliminated'),
    ]
    
    competition = models.ForeignKey(Competition, on_delete=models.CASCADE, related_name='participants')
    participant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='competition_participations')
    startup = models.ForeignKey('entrepreneurship.Startup', on_delete=models.SET_NULL, null=True, blank=True, related_name='competition_participations')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='registered')
    registration_date = models.DateTimeField(auto_now_add=True)
    submission_date = models.DateTimeField(null=True, blank=True)
    final_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    feedback = models.TextField(blank=True)
    rank = models.PositiveIntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.participant.username} - {self.competition.title}"

    class Meta:
        unique_together = ['competition', 'participant']
        ordering = ['rank', 'final_score']

class CompetitionJudge(models.Model):
    competition = models.ForeignKey(Competition, on_delete=models.CASCADE, related_name='judges')
    judge = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='judged_competitions')
    expertise = models.CharField(max_length=100)
    assigned_categories = models.TextField(help_text="Categories or aspects to evaluate")
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.judge.username} - {self.competition.title}"

    class Meta:
        unique_together = ['competition', 'judge']

class EvaluationCriteria(models.Model):
    competition = models.ForeignKey(Competition, on_delete=models.CASCADE, related_name='evaluation_criteria')
    name = models.CharField(max_length=100)
    description = models.TextField()
    weight = models.DecimalField(max_digits=5, decimal_places=2, help_text="Percentage weight in final score")
    max_score = models.IntegerField(default=10)
    order = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.competition.title} - {self.name}"

    class Meta:
        unique_together = ['competition', 'order']
        ordering = ['order']

class Evaluation(models.Model):
    participant = models.ForeignKey(CompetitionParticipant, on_delete=models.CASCADE, related_name='evaluations')
    judge = models.ForeignKey(CompetitionJudge, on_delete=models.CASCADE, related_name='evaluations')
    criteria = models.ForeignKey(EvaluationCriteria, on_delete=models.CASCADE, related_name='evaluations')
    score = models.DecimalField(max_digits=5, decimal_places=2)
    comments = models.TextField(blank=True)
    evaluated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.participant} - {self.criteria.name} - {self.score}"

    class Meta:
        unique_together = ['participant', 'judge', 'criteria']

class Submission(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('under_review', 'Under Review'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]
    
    competition = models.ForeignKey(Competition, on_delete=models.CASCADE, related_name='submissions')
    submitter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='competition_submissions')
    title = models.CharField(max_length=255)
    description = models.TextField()
    file = models.FileField(upload_to='competition_submissions/', blank=True, null=True)
    url = models.URLField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    feedback = models.TextField(blank=True)
    submitted_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-submitted_at']
