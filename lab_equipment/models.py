from django.db import models
from django.conf import settings
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator

class EquipmentCategory(models.Model):
    """Catégories d'équipements selon standards Fab Lab"""
    FAB_LAB_CATEGORIES = [
        ('3d_printing', 'Impression 3D'),
        ('laser_cutting', 'Découpe Laser'),
        ('cnc_milling', 'Fraiseuse CNC'),
        ('electronics', 'Électronique'),
        ('textiles', 'Textiles'),
        ('woodworking', 'Menuiserie'),
        ('metalworking', 'Métallurgie'),
        ('computers', 'Informatique'),
        ('measurement', 'Mesure & Test'),
        ('hand_tools', 'Outils Manuels'),
        ('safety', 'Sécurité'),
        ('other', 'Autres'),
    ]

    name = models.CharField(max_length=100)
    category_type = models.CharField(max_length=20, choices=FAB_LAB_CATEGORIES)
    description = models.TextField()
    icon = models.CharField(max_length=50, default='wrench-screwdriver')
    color = models.CharField(max_length=7, default='#2E7D32')  # Hex color
    requires_training = models.BooleanField(default=True)
    safety_level = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        default=1,
        help_text="1=Faible, 5=Très élevé"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']
        verbose_name_plural = 'Equipment Categories'

class Equipment(models.Model):
    """Équipements du Community Lab"""
    STATUS_CHOICES = [
        ('available', 'Disponible'),
        ('in_use', 'En cours d\'utilisation'),
        ('reserved', 'Réservé'),
        ('maintenance', 'En maintenance'),
        ('broken', 'Hors service'),
        ('retired', 'Retiré du service'),
    ]

    CONDITION_CHOICES = [
        ('excellent', 'Excellent'),
        ('good', 'Bon'),
        ('fair', 'Correct'),
        ('poor', 'Mauvais'),
        ('broken', 'Cassé'),
    ]

    # Informations de base
    name = models.CharField(max_length=200)
    category = models.ForeignKey(EquipmentCategory, on_delete=models.CASCADE, related_name='equipment')
    description = models.TextField()

    # Spécifications techniques
    brand = models.CharField(max_length=100, blank=True)
    model = models.CharField(max_length=100, blank=True)
    serial_number = models.CharField(max_length=100, unique=True)
    specifications = models.JSONField(default=dict, blank=True)  # Specs techniques flexibles

    # État et localisation
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES, default='good')
    location = models.CharField(max_length=100, help_text="Emplacement physique dans le lab")
    qr_code = models.CharField(max_length=100, blank=True, help_text="Code QR pour identification rapide")

    # Informations d'achat et maintenance
    purchase_date = models.DateField()
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    warranty_expiry = models.DateField(null=True, blank=True)
    last_maintenance = models.DateField(null=True, blank=True)
    next_maintenance = models.DateField(null=True, blank=True)
    maintenance_interval_days = models.IntegerField(default=90)

    # Documentation
    manual_url = models.URLField(blank=True, help_text="Lien vers le manuel d'utilisation")
    training_materials = models.URLField(blank=True, help_text="Matériels de formation")
    safety_instructions = models.TextField(blank=True)

    # Médias
    image = models.ImageField(upload_to='equipment/', null=True, blank=True)

    # Gestion
    responsible_person = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='managed_equipment',
        help_text="Responsable de cet équipement"
    )

    # Métriques d'utilisation
    total_usage_hours = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_reservations = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.model})" if self.model else self.name

    @property
    def is_available(self):
        return self.status == 'available'

    @property
    def needs_maintenance(self):
        if not self.next_maintenance:
            return False
        return timezone.now().date() >= self.next_maintenance

    class Meta:
        ordering = ['name']

class EquipmentReservation(models.Model):
    """Système de réservation d'équipements"""
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('approved', 'Approuvée'),
        ('active', 'En cours'),
        ('completed', 'Terminée'),
        ('cancelled', 'Annulée'),
        ('no_show', 'Absence non justifiée'),
    ]

    PRIORITY_CHOICES = [
        ('low', 'Basse'),
        ('normal', 'Normale'),
        ('high', 'Haute'),
        ('urgent', 'Urgente'),
    ]

    # Réservation de base
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE, related_name='reservations')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='equipment_reservations')

    # Projet associé (optionnel)
    project = models.ForeignKey(
        'entrepreneurship.Project',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='equipment_reservations'
    )

    # Planification
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    duration_hours = models.DecimalField(max_digits=5, decimal_places=2, editable=False)

    # Détails de la réservation
    purpose = models.TextField(help_text="Objectif d'utilisation de l'équipement")
    materials_needed = models.TextField(blank=True, help_text="Matériaux nécessaires")
    expected_output = models.TextField(blank=True, help_text="Résultat attendu")

    # Gestion
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='normal')

    # Approbation
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='approved_reservations'
    )
    approved_at = models.DateTimeField(null=True, blank=True)
    approval_notes = models.TextField(blank=True)

    # Utilisation réelle
    actual_start_time = models.DateTimeField(null=True, blank=True)
    actual_end_time = models.DateTimeField(null=True, blank=True)
    actual_duration_hours = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

    # Feedback
    user_rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        null=True,
        blank=True,
        help_text="Note de satisfaction (1-5)"
    )
    user_feedback = models.TextField(blank=True)
    issues_reported = models.TextField(blank=True, help_text="Problèmes rencontrés")

    # Métadonnées
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # Calculer la durée automatiquement
        if self.start_time and self.end_time:
            duration = self.end_time - self.start_time
            self.duration_hours = duration.total_seconds() / 3600
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.equipment.name} - {self.user.username} ({self.start_time.date()})"

    @property
    def is_active(self):
        now = timezone.now()
        return (self.status == 'active' and
                self.start_time <= now <= self.end_time)

    class Meta:
        ordering = ['-start_time']
        unique_together = ['equipment', 'start_time', 'end_time']

class EquipmentTraining(models.Model):
    """Formation obligatoire pour utiliser les équipements"""
    TRAINING_TYPES = [
        ('basic', 'Formation de base'),
        ('advanced', 'Formation avancée'),
        ('safety', 'Formation sécurité'),
        ('maintenance', 'Formation maintenance'),
        ('certification', 'Certification'),
    ]

    STATUS_CHOICES = [
        ('scheduled', 'Programmée'),
        ('in_progress', 'En cours'),
        ('completed', 'Terminée'),
        ('cancelled', 'Annulée'),
    ]

    # Formation de base
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE, related_name='trainings')
    title = models.CharField(max_length=200)
    training_type = models.CharField(max_length=20, choices=TRAINING_TYPES)
    description = models.TextField()

    # Planification
    instructor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='equipment_trainings_given'
    )
    scheduled_date = models.DateTimeField()
    duration_hours = models.DecimalField(max_digits=4, decimal_places=2)
    max_participants = models.IntegerField(default=5)

    # Contenu
    prerequisites = models.TextField(blank=True)
    learning_objectives = models.TextField()
    materials_provided = models.TextField(blank=True)
    certification_awarded = models.BooleanField(default=False)

    # État
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.equipment.name}"

    class Meta:
        ordering = ['-scheduled_date']

class UserEquipmentCertification(models.Model):
    """Certifications des utilisateurs pour les équipements"""
    CERTIFICATION_LEVELS = [
        ('basic', 'Utilisateur de base'),
        ('intermediate', 'Utilisateur intermédiaire'),
        ('advanced', 'Utilisateur avancé'),
        ('instructor', 'Instructeur'),
        ('maintainer', 'Mainteneur'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE)
    level = models.CharField(max_length=20, choices=CERTIFICATION_LEVELS)

    # Certification
    training = models.ForeignKey(EquipmentTraining, on_delete=models.SET_NULL, null=True, blank=True)
    certified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='certifications_given'
    )
    certification_date = models.DateTimeField()
    expiry_date = models.DateTimeField(null=True, blank=True)

    # Évaluation
    practical_score = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Score pratique (0-100)"
    )
    theory_score = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Score théorique (0-100)"
    )

    # Statut
    is_active = models.BooleanField(default=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.equipment.name} ({self.level})"

    @property
    def is_expired(self):
        if not self.expiry_date:
            return False
        return timezone.now() > self.expiry_date

    class Meta:
        unique_together = ['user', 'equipment', 'level']
        ordering = ['-certification_date']

class MaintenanceLog(models.Model):
    """Journal de maintenance des équipements"""
    MAINTENANCE_TYPES = [
        ('preventive', 'Maintenance préventive'),
        ('corrective', 'Maintenance corrective'),
        ('calibration', 'Calibration'),
        ('upgrade', 'Mise à niveau'),
        ('repair', 'Réparation'),
        ('inspection', 'Inspection'),
        ('cleaning', 'Nettoyage'),
    ]

    STATUS_CHOICES = [
        ('scheduled', 'Programmée'),
        ('in_progress', 'En cours'),
        ('completed', 'Terminée'),
        ('cancelled', 'Annulée'),
        ('failed', 'Échec'),
    ]

    PRIORITY_CHOICES = [
        ('low', 'Basse'),
        ('normal', 'Normale'),
        ('high', 'Haute'),
        ('critical', 'Critique'),
    ]

    # Maintenance de base
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE, related_name='maintenance_logs')
    maintenance_type = models.CharField(max_length=20, choices=MAINTENANCE_TYPES)
    title = models.CharField(max_length=200)
    description = models.TextField()

    # Planification
    scheduled_date = models.DateTimeField()
    estimated_duration_hours = models.DecimalField(max_digits=5, decimal_places=2)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='normal')

    # Exécution
    performed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='maintenance_performed'
    )
    actual_start_time = models.DateTimeField(null=True, blank=True)
    actual_end_time = models.DateTimeField(null=True, blank=True)
    actual_duration_hours = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

    # Détails techniques
    work_performed = models.TextField(blank=True, help_text="Travail effectué en détail")
    parts_replaced = models.TextField(blank=True, help_text="Pièces remplacées")
    tools_used = models.TextField(blank=True, help_text="Outils utilisés")

    # Coûts
    labor_cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    parts_cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    total_cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    # Résultats
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    issues_found = models.TextField(blank=True, help_text="Problèmes découverts")
    recommendations = models.TextField(blank=True, help_text="Recommandations pour l'avenir")
    next_maintenance_due = models.DateField(null=True, blank=True)

    # Documentation
    before_photos = models.JSONField(default=list, blank=True)  # URLs des photos avant
    after_photos = models.JSONField(default=list, blank=True)   # URLs des photos après
    maintenance_report = models.FileField(upload_to='maintenance_reports/', null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # Calculer le coût total
        if self.labor_cost and self.parts_cost:
            self.total_cost = self.labor_cost + self.parts_cost
        elif self.labor_cost:
            self.total_cost = self.labor_cost
        elif self.parts_cost:
            self.total_cost = self.parts_cost

        # Calculer la durée réelle
        if self.actual_start_time and self.actual_end_time:
            duration = self.actual_end_time - self.actual_start_time
            self.actual_duration_hours = duration.total_seconds() / 3600

        super().save(*args, **kwargs)

        # Mettre à jour l'équipement si maintenance terminée
        if self.status == 'completed' and self.next_maintenance_due:
            self.equipment.last_maintenance = self.actual_end_time.date() if self.actual_end_time else timezone.now().date()
            self.equipment.next_maintenance = self.next_maintenance_due
            self.equipment.save()

    def __str__(self):
        return f"{self.equipment.name} - {self.maintenance_type} - {self.scheduled_date.date()}"

    class Meta:
        ordering = ['-scheduled_date']

class EquipmentUsageLog(models.Model):
    """Journal d'utilisation des équipements"""
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE, related_name='usage_logs')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    reservation = models.ForeignKey(EquipmentReservation, on_delete=models.SET_NULL, null=True, blank=True)

    # Utilisation
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(null=True, blank=True)
    duration_hours = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

    # Détails d'utilisation
    purpose = models.TextField()
    materials_used = models.TextField(blank=True)
    output_produced = models.TextField(blank=True)

    # Métriques
    power_consumption_kwh = models.DecimalField(max_digits=8, decimal_places=3, null=True, blank=True)
    material_waste_kg = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)

    # État après utilisation
    equipment_condition_after = models.CharField(
        max_length=20,
        choices=Equipment.CONDITION_CHOICES,
        default='good'
    )
    issues_reported = models.TextField(blank=True)
    maintenance_needed = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Calculer la durée
        if self.start_time and self.end_time:
            duration = self.end_time - self.start_time
            self.duration_hours = duration.total_seconds() / 3600
        super().save(*args, **kwargs)

        # Mettre à jour les métriques de l'équipement
        if self.duration_hours:
            self.equipment.total_usage_hours += self.duration_hours
            self.equipment.save()

    def __str__(self):
        return f"{self.equipment.name} - {self.user.username} - {self.start_time.date()}"

    class Meta:
        ordering = ['-start_time']
