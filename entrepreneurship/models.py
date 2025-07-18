from django.db import models
from django.conf import settings

class Startup(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('pending', 'Pending'),
    ]
    
    FUNDING_STAGE_CHOICES = [
        ('pre_seed', 'Pre-Seed'),
        ('seed', 'Seed'),
        ('series_a', 'Series A'),
        ('series_b', 'Series B'),
        ('series_c', 'Series C'),
        ('series_d', 'Series D+'),
        ('ipo', 'IPO'),
    ]
    
    name = models.CharField(max_length=255)
    description = models.TextField()
    industry = models.CharField(max_length=100)
    founding_date = models.DateField()
    website = models.URLField(blank=True, null=True)
    logo = models.ImageField(upload_to='startup_logos/', blank=True, null=True)
    pitch_deck = models.FileField(upload_to='pitch_decks/', blank=True, null=True)
    team_size = models.IntegerField(default=1)
    funding_stage = models.CharField(max_length=20, choices=FUNDING_STAGE_CHOICES, default='pre_seed')
    total_funding = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    founder = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='founded_startups')
    mentors = models.ManyToManyField('users.Mentor', related_name='mentored_startups', blank=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']

class Project(models.Model):
    STATUS_CHOICES = [
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('on_hold', 'On Hold'),
        ('cancelled', 'Cancelled'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    startup = models.ForeignKey(Startup, on_delete=models.CASCADE, related_name='projects')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    start_date = models.DateField()
    end_date = models.DateField()
    budget = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    manager = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='managed_projects')
    team_members = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='project_memberships', blank=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['start_date']

class Milestone(models.Model):
    STATUS_CHOICES = [
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('delayed', 'Delayed'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='milestones')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    due_date = models.DateField()
    completion_date = models.DateField(null=True, blank=True)
    assignee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='assigned_milestones')

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['due_date']

class Resource(models.Model):
    RESOURCE_TYPE_CHOICES = [
        ('document', 'Document'),
        ('image', 'Image'),
        ('video', 'Video'),
        ('link', 'Link'),
        ('other', 'Other'),
    ]
    
    VISIBILITY_CHOICES = [
        ('public', 'Public'),
        ('private', 'Private'),
        ('team', 'Team Only'),
    ]
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    startup = models.ForeignKey(Startup, on_delete=models.SET_NULL, null=True, related_name='resources')
    resource_type = models.CharField(max_length=20, choices=RESOURCE_TYPE_CHOICES)
    visibility = models.CharField(max_length=20, choices=VISIBILITY_CHOICES, default='private')
    file = models.FileField(upload_to='startup_resources/', blank=True, null=True)
    url = models.URLField(blank=True, null=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='owned_resources')

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['title']
