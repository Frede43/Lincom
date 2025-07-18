from django.db import models
from django.conf import settings
from django.utils import timezone

class MentorshipProgram(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('on_hold', 'On Hold'),
    ]

    mentor = models.ForeignKey('users.Mentor', on_delete=models.CASCADE, related_name='mentorship_programs')
    mentee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='mentee_programs')
    startup = models.ForeignKey('entrepreneurship.Startup', on_delete=models.CASCADE, related_name='mentorship_programs', null=True, blank=True)
    start_date = models.DateField()
    end_date = models.DateField()
    objectives = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.mentor.user.username} mentoring {self.mentee.username}"

    class Meta:
        ordering = ['-created_at']
        unique_together = ['mentor', 'mentee', 'startup']

class MentorshipSession(models.Model):
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('rescheduled', 'Rescheduled'),
    ]

    MEETING_TYPE_CHOICES = [
        ('in_person', 'In Person'),
        ('virtual', 'Virtual'),
        ('hybrid', 'Hybrid'),
    ]

    program = models.ForeignKey(MentorshipProgram, on_delete=models.CASCADE, related_name='sessions')
    date = models.DateTimeField()
    duration = models.DurationField()
    meeting_type = models.CharField(max_length=20, choices=MEETING_TYPE_CHOICES)
    location = models.CharField(max_length=255, blank=True)
    meeting_link = models.URLField(blank=True)
    agenda = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    notes = models.TextField(blank=True)
    next_steps = models.TextField(blank=True)
    materials = models.ManyToManyField('Resource', blank=True, related_name='sessions')

    def __str__(self):
        return f"Session: {self.program.mentor.user.username} - {self.date.strftime('%Y-%m-%d %H:%M')}"

    class Meta:
        ordering = ['-date']

class Resource(models.Model):
    RESOURCE_TYPE_CHOICES = [
        ('document', 'Document'),
        ('presentation', 'Presentation'),
        ('template', 'Template'),
        ('link', 'External Link'),
        ('other', 'Other'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    type = models.CharField(max_length=20, choices=RESOURCE_TYPE_CHOICES)
    file = models.FileField(upload_to='mentorship_resources/', null=True, blank=True)
    url = models.URLField(null=True, blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']

class ActionItem(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]

    session = models.ForeignKey(MentorshipSession, on_delete=models.CASCADE, related_name='action_items')
    title = models.CharField(max_length=255)
    description = models.TextField()
    assignee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='assigned_actions')
    due_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    completed_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.title} - {self.assignee.username}"

    class Meta:
        ordering = ['due_date', '-priority']

class MentorshipRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('cancelled', 'Cancelled'),
    ]

    mentor = models.ForeignKey('users.Mentor', on_delete=models.CASCADE, related_name='mentorship_requests_received')
    mentee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='mentorship_requests_sent')
    startup = models.ForeignKey('entrepreneurship.Startup', on_delete=models.CASCADE, related_name='mentorship_requests', null=True, blank=True)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    response_message = models.TextField(blank=True)
    response_date = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Request from {self.mentee.username} to {self.mentor.user.username}"

    def accept(self):
        if self.status == 'pending':
            self.status = 'accepted'
            self.response_date = timezone.now()
            self.save()
            return True
        return False

    def reject(self, message=''):
        if self.status == 'pending':
            self.status = 'rejected'
            self.response_message = message
            self.response_date = timezone.now()
            self.save()
            return True
        return False

    def cancel(self):
        if self.status == 'pending':
            self.status = 'cancelled'
            self.response_date = timezone.now()
            self.save()
            return True
        return False

    class Meta:
        ordering = ['-created_at']
        unique_together = ['mentor', 'mentee', 'startup']

class Feedback(models.Model):
    RATING_CHOICES = [(i, str(i)) for i in range(1, 6)]

    program = models.ForeignKey(MentorshipProgram, on_delete=models.CASCADE, related_name='feedbacks')
    session = models.ForeignKey(MentorshipSession, on_delete=models.CASCADE, related_name='feedbacks', null=True, blank=True)
    from_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='given_feedbacks')
    to_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_feedbacks')
    rating = models.IntegerField(choices=RATING_CHOICES)
    comments = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_anonymous = models.BooleanField(default=False)

    def __str__(self):
        return f"Feedback from {self.from_user.username} to {self.to_user.username}"

    class Meta:
        ordering = ['-created_at']
        unique_together = ['program', 'session', 'from_user', 'to_user']
