from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils.text import slugify
from django.urls import reverse
from django.utils import timezone

User = get_user_model()

class Industry(models.Model):
    name = models.CharField(max_length=100, verbose_name="Nom")
    description = models.TextField(blank=True, verbose_name="Description")
    icon = models.CharField(max_length=50, blank=True, help_text="Classe Font Awesome (ex: fa-industry)")

    class Meta:
        verbose_name = "Secteur d'activité"
        verbose_name_plural = "Secteurs d'activité"
        ordering = ['name']

    def __str__(self):
        return self.name

class Stage(models.Model):
    name = models.CharField(max_length=100, verbose_name="Nom")
    description = models.TextField(verbose_name="Description")
    order = models.PositiveIntegerField(default=0, verbose_name="Ordre")

    class Meta:
        verbose_name = "Stade de développement"
        verbose_name_plural = "Stades de développement"
        ordering = ['order']

    def __str__(self):
        return self.name

class Startup(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Brouillon'),
        ('pending', 'En attente de validation'),
        ('active', 'Actif'),
        ('inactive', 'Inactif'),
    ]

    # Informations de base
    name = models.CharField(max_length=200, verbose_name="Nom")
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    logo = models.ImageField(upload_to='startups/logos/', blank=True, verbose_name="Logo")
    tagline = models.CharField(max_length=200, default="", verbose_name="Slogan")
    description = models.TextField(verbose_name="Description")
    pitch_video = models.URLField(blank=True, verbose_name="Vidéo pitch")
    address = models.CharField(max_length=255, default="", verbose_name="Adresse")
    
    # Classification
    industry = models.ForeignKey(Industry, on_delete=models.SET_NULL, null=True, verbose_name="Secteur")
    stage = models.ForeignKey(Stage, on_delete=models.SET_NULL, null=True, verbose_name="Stade")
    business_model = models.TextField(default="", verbose_name="Modèle d'affaires")
    
    # Équipe et gestion
    founder = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='founded_startups',
        verbose_name="Fondateur"
    )
    team_members = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        through='TeamMember',
        related_name='startup_teams',
        verbose_name="Membres de l'équipe"
    )
    mentors = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        through='StartupMentor',
        related_name='mentored_startups',
        verbose_name="Mentors"
    )
    
    # Détails business
    founding_date = models.DateField(default='2024-01-01', verbose_name="Date de création")
    market_opportunity = models.TextField(default="Une opportunité de marché", verbose_name="Opportunité de marché")
    competitive_advantage = models.TextField(default="", verbose_name="Avantage concurrentiel")
    revenue_model = models.TextField(default="Modèle de revenus par défaut", verbose_name="Modèle de revenus")
    customer_segment = models.TextField(default="", verbose_name="Segment client")
    revenue = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        verbose_name="Chiffre d'affaires"
    )
    FUNDING_STAGE_CHOICES = [
        ('pre_seed', 'Pré-amorçage'),
        ('seed', 'Amorçage'),
        ('series-a', 'Série A'),
        ('series-b', 'Série B'),
        ('series-c', 'Série C+'),
    ]
    funding_stage = models.CharField(
        max_length=20,
        choices=FUNDING_STAGE_CHOICES,
        default='pre_seed',
        verbose_name="Stade de financement"
    )
    funding_raised = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        verbose_name="Fonds levés"
    )
    
    # Contact et présence en ligne
    website = models.URLField(blank=True, verbose_name="Site web")
    email = models.EmailField(default="contact@example.com", verbose_name="Email de contact")
    phone = models.CharField(max_length=20, blank=True, verbose_name="Téléphone")
    social_facebook = models.URLField(blank=True, verbose_name="Facebook")
    social_twitter = models.URLField(blank=True, verbose_name="Twitter")
    social_linkedin = models.URLField(blank=True, verbose_name="LinkedIn")
    
    # Localisation
    city = models.CharField(max_length=100, default="Bujumbura", verbose_name="Ville")
    country = models.CharField(max_length=100, default="Burundi", verbose_name="Pays")
    
    # Gestion et suivi
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='draft',
        verbose_name="Statut"
    )
    featured = models.BooleanField(default=False, verbose_name="Mis en avant")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Startup"
        verbose_name_plural = "Startups"
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('startups:startup_detail', args=[self.slug])

    @property
    def team_size(self):
        return self.team_members.count()

    @property
    def mentor_count(self):
        return self.mentors.count()

class TeamMember(models.Model):
    ROLE_CHOICES = [
        ('founder', 'Fondateur'),
        ('cofounder', 'Co-fondateur'),
        ('cto', 'Directeur technique'),
        ('ceo', 'Directeur général'),
        ('coo', 'Directeur des opérations'),
        ('cfo', 'Directeur financier'),
        ('developer', 'Développeur'),
        ('designer', 'Designer'),
        ('marketing', 'Marketing'),
        ('sales', 'Commercial'),
        ('other', 'Autre'),
    ]

    startup = models.ForeignKey(Startup, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    joined_date = models.DateField(auto_now_add=True)
    equity_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name="Pourcentage d'actions"
    )
    responsibilities = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Membre de l'équipe"
        verbose_name_plural = "Membres de l'équipe"
        unique_together = ['startup', 'user']

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.get_role_display()} chez {self.startup.name}"

class StartupMentor(models.Model):
    startup = models.ForeignKey(Startup, on_delete=models.CASCADE)
    mentor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    expertise = models.TextField(verbose_name="Domaines d'expertise")
    start_date = models.DateField(auto_now_add=True)
    end_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    hours_per_month = models.PositiveIntegerField(default=0)
    notes = models.TextField(blank=True)

    class Meta:
        verbose_name = "Mentor de startup"
        verbose_name_plural = "Mentors de startup"
        unique_together = ['startup', 'mentor']

    def __str__(self):
        return f"{self.mentor.get_full_name()} - Mentor pour {self.startup.name}"

class Milestone(models.Model):
    startup = models.ForeignKey(Startup, on_delete=models.CASCADE, related_name='milestones')
    title = models.CharField(max_length=200)
    description = models.TextField()
    target_date = models.DateField()
    achieved_date = models.DateField(null=True, blank=True)
    is_achieved = models.BooleanField(default=False)
    proof = models.FileField(upload_to='startups/milestone_proofs/', blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        verbose_name = "Jalon"
        verbose_name_plural = "Jalons"
        ordering = ['target_date']

    def __str__(self):
        return f"{self.startup.name} - {self.title}"

class Investment(models.Model):
    INVESTMENT_TYPE_CHOICES = [
        ('equity', 'Actions'),
        ('convertible_note', 'Note convertible'),
        ('safe', 'SAFE'),
        ('debt', 'Dette'),
        ('grant', 'Subvention'),
    ]

    startup = models.ForeignKey(Startup, on_delete=models.CASCADE, related_name='investments')
    investor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='investments_made'
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    investment_type = models.CharField(max_length=20, choices=INVESTMENT_TYPE_CHOICES)
    investment_date = models.DateField()
    equity_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True
    )
    valuation = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    terms = models.TextField(blank=True)
    documents = models.FileField(upload_to='startups/investment_docs/', blank=True)

    class Meta:
        verbose_name = "Investissement"
        verbose_name_plural = "Investissements"
        ordering = ['-investment_date']

    def __str__(self):
        return f"{self.startup.name} - {self.amount} ({self.get_investment_type_display()})"

class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    startup = models.ForeignKey(Startup, on_delete=models.CASCADE, related_name='projects')
    project_lead = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='led_projects')
    team_members = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='project_memberships')
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=[
        ('planning', 'En planification'),
        ('in_progress', 'En cours'),
        ('completed', 'Terminé'),
        ('on_hold', 'En pause')
    ])
    budget = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.title} - {self.startup.name}"

class ProjectUpdate(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='updates')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Mise à jour du {self.created_at.strftime('%Y-%m-%d')} - {self.project.title}"

class JoinRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('accepted', 'Acceptée'),
        ('rejected', 'Rejetée'),
    ]

    startup = models.ForeignKey(
        Startup,
        on_delete=models.CASCADE,
        related_name='join_requests',
        verbose_name="Startup"
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='startup_join_requests',
        verbose_name="Utilisateur"
    )
    role = models.CharField(
        max_length=20,
        choices=TeamMember.ROLE_CHOICES,
        verbose_name="Rôle souhaité"
    )
    motivation = models.TextField(verbose_name="Motivation")
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name="Statut"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reviewed_join_requests',
        verbose_name="Examiné par"
    )
    review_date = models.DateTimeField(null=True, blank=True)
    review_notes = models.TextField(blank=True, verbose_name="Notes d'examen")

    class Meta:
        verbose_name = "Demande de participation"
        verbose_name_plural = "Demandes de participation"
        ordering = ['-created_at']
        unique_together = ['startup', 'user', 'status']

    def __str__(self):
        return f"Demande de {self.user.get_full_name()} pour rejoindre {self.startup.name}"

class MentorRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('accepted', 'Acceptée'),
        ('rejected', 'Rejetée')
    ]
    
    startup = models.ForeignKey(Startup, on_delete=models.CASCADE, related_name='mentor_requests')
    mentor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='mentor_requests')
    message = models.TextField(verbose_name="Message de motivation")
    expertise_areas = models.TextField(verbose_name="Domaines d'expertise")
    availability = models.TextField(verbose_name="Disponibilité")
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reviewed_mentor_requests'
    )

    class Meta:
        ordering = ['-created_at']
        unique_together = ['startup', 'mentor', 'status']

    def __str__(self):
        return f"Demande de mentorat de {self.mentor.get_full_name()} pour {self.startup.name}"
