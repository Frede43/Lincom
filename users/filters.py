from django_filters import rest_framework as filters
from django.db.models import Q
from .models import User, Mentor, Entrepreneur, Stakeholder

class UserFilter(filters.FilterSet):
    username = filters.CharFilter(lookup_expr='icontains')
    email = filters.CharFilter(lookup_expr='icontains')
    role = filters.ChoiceFilter(choices=User.ROLE_CHOICES)
    date_joined_after = filters.DateTimeFilter(field_name='date_joined', lookup_expr='gte')
    date_joined_before = filters.DateTimeFilter(field_name='date_joined', lookup_expr='lte')
    search = filters.CharFilter(method='search_filter')

    class Meta:
        model = User
        fields = {
            'is_active': ['exact'],
            'is_staff': ['exact'],
        }

    def search_filter(self, queryset, name, value):
        return queryset.filter(
            Q(username__icontains=value) |
            Q(email__icontains=value) |
            Q(first_name__icontains=value) |
            Q(last_name__icontains=value)
        )

class MentorFilter(filters.FilterSet):
    expertise = filters.ChoiceFilter(choices=Mentor.EXPERTISE_CHOICES)
    experience_years_min = filters.NumberFilter(field_name='experience_years', lookup_expr='gte')
    experience_years_max = filters.NumberFilter(field_name='experience_years', lookup_expr='lte')
    rating_min = filters.NumberFilter(field_name='rating', lookup_expr='gte')
    rating_max = filters.NumberFilter(field_name='rating', lookup_expr='lte')
    search = filters.CharFilter(method='search_filter')

    class Meta:
        model = Mentor
        fields = {
            'expertise': ['exact'],
            'experience_years': ['exact', 'gte', 'lte'],
            'rating': ['exact', 'gte', 'lte'],
            'total_reviews': ['exact', 'gte', 'lte'],
        }

    def search_filter(self, queryset, name, value):
        return queryset.filter(
            Q(user__username__icontains=value) |
            Q(user__email__icontains=value) |
            Q(availability__icontains=value)
        )

class EntrepreneurFilter(filters.FilterSet):
    company_name = filters.CharFilter(lookup_expr='icontains')
    industry = filters.CharFilter(lookup_expr='icontains')
    company_stage = filters.ChoiceFilter(choices=Entrepreneur.COMPANY_STAGE_CHOICES)
    search = filters.CharFilter(method='search_filter')

    class Meta:
        model = Entrepreneur
        fields = {
            'industry': ['exact'],
            'company_stage': ['exact'],
        }

    def search_filter(self, queryset, name, value):
        return queryset.filter(
            Q(user__username__icontains=value) |
            Q(user__email__icontains=value) |
            Q(company_name__icontains=value) |
            Q(industry__icontains=value) |
            Q(interests__icontains=value)
        )

class StakeholderFilter(filters.FilterSet):
    position = filters.ChoiceFilter(choices=Stakeholder.POSITION_CHOICES)
    department = filters.CharFilter(lookup_expr='icontains')
    search = filters.CharFilter(method='search_filter')

    class Meta:
        model = Stakeholder
        fields = {
            'position': ['exact'],
            'department': ['exact'],
            'organization': ['exact'],
        }

    def search_filter(self, queryset, name, value):
        return queryset.filter(
            Q(user__username__icontains=value) |
            Q(user__email__icontains=value) |
            Q(department__icontains=value) |
            Q(interests__icontains=value) |
            Q(organization__name__icontains=value)
        )
