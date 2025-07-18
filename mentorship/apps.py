from django.apps import AppConfig

class MentorshipConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'mentorship'
    verbose_name = 'Mentorship'

    def ready(self):
        import mentorship.signals  # noqa
