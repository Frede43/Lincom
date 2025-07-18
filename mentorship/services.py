from django.db.models import Q, Count, F
from django.utils import timezone
from users.models import Mentor, User
from .models import MentorshipProgram

class MentorMatchingService:
    def __init__(self, user, startup=None):
        self.user = user
        self.startup = startup

    def get_available_mentors(self, expertise_areas=None, max_active_programs=3):
        """
        Find available mentors based on expertise and capacity.
        """
        # Base query for active mentors
        mentors = Mentor.objects.filter(user__is_active=True)

        # Filter by expertise if specified
        if expertise_areas:
            mentors = mentors.filter(expertise__in=expertise_areas)

        # Annotate with active program count
        mentors = mentors.annotate(
            active_programs=Count(
                'mentorship_programs',
                filter=Q(mentorship_programs__status='active')
            )
        )

        # Filter by capacity
        mentors = mentors.filter(active_programs__lt=max_active_programs)

        # Exclude mentors already mentoring this user/startup
        existing_mentors = MentorshipProgram.objects.filter(
            Q(mentee=self.user) | Q(startup=self.startup),
            status='active'
        ).values_list('mentor', flat=True)
        
        mentors = mentors.exclude(id__in=existing_mentors)

        # Order by relevance (fewer active programs first)
        return mentors.order_by('active_programs', '-experience_years')

    def get_mentor_compatibility(self, mentor):
        """
        Calculate compatibility score between mentor and mentee.
        """
        score = 0
        max_score = 0

        # Match expertise with startup industry/needs
        if self.startup and hasattr(self.startup, 'industry'):
            if mentor.expertise == self.startup.industry:
                score += 3
            max_score += 3

        # Consider mentor's experience
        score += min(mentor.experience_years or 0, 10) / 2  # Cap at 5 points
        max_score += 5

        # Consider mentor's current workload
        active_programs = mentor.mentorship_programs.filter(status='active').count()
        workload_score = (3 - active_programs)  # 0-3 points based on availability
        score += max(0, workload_score)
        max_score += 3

        # Calculate percentage
        return (score / max_score) * 100 if max_score > 0 else 0

    def get_matches(self, limit=5):
        """
        Get top mentor matches with compatibility scores.
        """
        mentors = self.get_available_mentors()
        matches = []

        for mentor in mentors[:limit]:
            compatibility = self.get_mentor_compatibility(mentor)
            matches.append({
                'mentor': mentor,
                'compatibility': compatibility,
                'active_programs': mentor.mentorship_programs.filter(
                    status='active'
                ).count()
            })

        # Sort by compatibility score
        matches.sort(key=lambda x: x['compatibility'], reverse=True)
        return matches
