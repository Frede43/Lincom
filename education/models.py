from django.db import models
from django.conf import settings
from django.utils import timezone

class Course(models.Model):
    LEVEL_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default='beginner')
    instructor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='courses_teaching')
    thumbnail = models.ImageField(upload_to='course_thumbnails/', null=True, blank=True)
    syllabus = models.TextField(help_text="Detailed course syllabus")
    prerequisites = models.TextField(blank=True)
    objectives = models.TextField(help_text="Learning objectives")
    duration_weeks = models.IntegerField(default=1)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']

class Module(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='modules')
    title = models.CharField(max_length=255)
    description = models.TextField()
    content = models.TextField()
    order = models.IntegerField()
    duration_hours = models.DecimalField(max_digits=4, decimal_places=2, help_text="Estimated duration in hours")
    resources = models.ManyToManyField('Resource', blank=True, related_name='modules')

    def __str__(self):
        return f"{self.course.title} - {self.title}"

    class Meta:
        ordering = ['order']
        unique_together = ['course', 'order']

class Lesson(models.Model):
    """Model for a lesson within a module."""
    title = models.CharField(max_length=255)
    content = models.TextField()
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='lessons')
    order = models.IntegerField(default=0)
    duration_minutes = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.module.title} - {self.title}"

    class Meta:
        ordering = ['order']
        unique_together = ['module', 'order']

class Quiz(models.Model):
    """Model for a quiz within a module."""
    title = models.CharField(max_length=255)
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='quizzes')
    description = models.TextField(blank=True)
    passing_score = models.IntegerField(default=70)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.module.title} - {self.title}"

    class Meta:
        ordering = ['order']

class Question(models.Model):
    QUESTION_TYPE_CHOICES = [
        ('multiple_choice', 'Multiple Choice'),
        ('true_false', 'True/False'),
        ('short_answer', 'Short Answer'),
        ('essay', 'Essay'),
    ]

    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField()
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPE_CHOICES, default='multiple_choice')
    correct_answer = models.TextField()
    points = models.IntegerField(default=1)
    explanation = models.TextField(blank=True)
    order = models.IntegerField()

    def __str__(self):
        return f"{self.quiz.title} - Question {self.order}"

    class Meta:
        ordering = ['order']
        unique_together = ['quiz', 'order']

class Resource(models.Model):
    RESOURCE_TYPE_CHOICES = [
        ('video', 'Video'),
        ('document', 'Document'),
        ('quiz', 'Quiz'),
        ('assignment', 'Assignment'),
        ('link', 'External Link'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    type = models.CharField(max_length=20, choices=RESOURCE_TYPE_CHOICES)
    file = models.FileField(upload_to='course_resources/', null=True, blank=True)
    url = models.URLField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Training(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='trainings')
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    max_participants = models.IntegerField()
    current_participants = models.IntegerField(default=0)
    location = models.CharField(max_length=255, blank=True)
    is_online = models.BooleanField(default=False)
    meeting_link = models.URLField(blank=True)
    registration_deadline = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    description = models.TextField(help_text="Additional information about this training session")

    def __str__(self):
        return f"{self.course.title} ({self.start_date.strftime('%Y-%m-%d')})"

    class Meta:
        ordering = ['-start_date']

class Enrollment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='course_enrollments')
    training = models.ForeignKey(Training, on_delete=models.CASCADE, related_name='enrollments')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    enrollment_date = models.DateTimeField(auto_now_add=True)
    completion_date = models.DateTimeField(null=True, blank=True)
    certificate_issued = models.BooleanField(default=False)
    feedback = models.TextField(blank=True)
    rating = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.student.username} - {self.training.course.title}"

    class Meta:
        unique_together = ['student', 'training']
        ordering = ['-enrollment_date']

class Progress(models.Model):
    STATUS_CHOICES = [
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]

    enrollment = models.ForeignKey(Enrollment, on_delete=models.CASCADE, related_name='progress_records')
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='progress_records')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started')
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    time_spent = models.DurationField(null=True, blank=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.enrollment.student.username} - {self.module.title}"

    class Meta:
        unique_together = ['enrollment', 'module']
        ordering = ['module__order']

class UserProgress(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='education_progress')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='user_progress')
    completed_modules = models.ManyToManyField(Module, related_name='completed_by_users', blank=True)
    completed_lessons = models.ManyToManyField(Lesson, related_name='completed_by_users', blank=True)
    completed_quizzes = models.ManyToManyField(Quiz, related_name='completed_by_users', blank=True)
    last_activity = models.DateTimeField(auto_now=True)
    progress_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    def __str__(self):
        return f"{self.user.username} - {self.course.title} Progress"

    class Meta:
        unique_together = ['user', 'course']
        ordering = ['-last_activity']

class QuizAttempt(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='quiz_attempts')
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='attempts')
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    score = models.DecimalField(max_digits=5, decimal_places=2)
    passed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.quiz.title} Attempt"

    class Meta:
        ordering = ['-start_time']

class QuestionResponse(models.Model):
    attempt = models.ForeignKey(QuizAttempt, on_delete=models.CASCADE, related_name='responses')
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='responses')
    answer = models.TextField()
    is_correct = models.BooleanField()
    points_earned = models.IntegerField()

    def __str__(self):
        return f"{self.attempt} - Question {self.question.order}"

    class Meta:
        unique_together = ['attempt', 'question']
