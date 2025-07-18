from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', _('Administrator')),
        ('mentor', _('Mentor')),
        ('entrepreneur', _('Entrepreneur')),
        ('stakeholder', _('Stakeholder')),
        ('student', _('Student')),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    bio = models.TextField(blank=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.username

    class Meta:
        ordering = ['-date_joined']

class Mentor(models.Model):
    EXPERTISE_CHOICES = [
        ('business', _('Business Development')),
        ('technology', _('Technology')),
        ('marketing', _('Marketing')),
        ('finance', _('Finance')),
        ('legal', _('Legal')),
        ('other', _('Other')),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='mentor_profile')
    expertise = models.CharField(max_length=20, choices=EXPERTISE_CHOICES, default='other')
    experience_years = models.PositiveIntegerField(null=True, blank=True)
    linkedin_profile = models.URLField(blank=True)
    availability = models.TextField(help_text="Describe your availability for mentoring", blank=True)
    rating = models.FloatField(default=0.0)
    total_reviews = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.user.username} - {self.expertise}"

class Entrepreneur(models.Model):
    COMPANY_STAGE_CHOICES = [
        ('idea', 'Idea Stage'),
        ('mvp', 'MVP'),
        ('early', 'Early Stage'),
        ('growth', 'Growth Stage'),
        ('mature', 'Mature'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='entrepreneur_profile')
    company_name = models.CharField(max_length=200, blank=True)
    industry = models.CharField(max_length=100, null=True, blank=True)
    company_stage = models.CharField(max_length=50, choices=COMPANY_STAGE_CHOICES, default='idea')
    company_website = models.URLField(blank=True)
    linkedin_profile = models.URLField(blank=True)
    interests = models.TextField(help_text="Areas of interest or needed support", blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.company_name if self.company_name else 'No Company'}"

class Stakeholder(models.Model):
    POSITION_CHOICES = [
        ('manager', 'Manager'),
        ('director', 'Director'),
        ('executive', 'Executive'),
        ('other', 'Other'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='stakeholder_profile')
    organization = models.ForeignKey('organizations.Organization', on_delete=models.SET_NULL, null=True, related_name='organization_stakeholders')
    position = models.CharField(max_length=20, choices=POSITION_CHOICES, default='other')
    department = models.CharField(max_length=100, null=True, blank=True)
    linkedin_profile = models.URLField(blank=True)
    interests = models.TextField(help_text="Areas of interest or expertise", blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.organization.name if self.organization else 'No Organization'}"
        
