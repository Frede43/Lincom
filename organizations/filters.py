from django_filters import rest_framework as filters
from django.db.models import Q
from .models import Organization, CallForProject, Competition, Submission

class OrganizationFilter(filters.FilterSet):
    name = filters.CharFilter(lookup_expr='icontains')
    description = filters.CharFilter(lookup_expr='icontains')
    sector = filters.CharFilter(lookup_expr='icontains')
    location = filters.CharFilter(lookup_expr='icontains')
    type = filters.ChoiceFilter(choices=Organization.TYPE_CHOICES)
    search = filters.CharFilter(method='search_filter')

    class Meta:
        model = Organization
        fields = {
            'type': ['exact'],
            'sector': ['exact'],
            'location': ['exact'],
            'is_active': ['exact'],
        }

    def search_filter(self, queryset, name, value):
        return queryset.filter(
            Q(name__icontains=value) |
            Q(description__icontains=value) |
            Q(sector__icontains=value) |
            Q(location__icontains=value)
        )

class CallForProjectFilter(filters.FilterSet):
    title = filters.CharFilter(lookup_expr='icontains')
    description = filters.CharFilter(lookup_expr='icontains')
    status = filters.ChoiceFilter(choices=CallForProject.STATUS_CHOICES)
    start_date_after = filters.DateFilter(field_name='start_date', lookup_expr='gte')
    start_date_before = filters.DateFilter(field_name='start_date', lookup_expr='lte')
    end_date_after = filters.DateFilter(field_name='end_date', lookup_expr='gte')
    end_date_before = filters.DateFilter(field_name='end_date', lookup_expr='lte')
    search = filters.CharFilter(method='search_filter')

    class Meta:
        model = CallForProject
        fields = {
            'status': ['exact'],
            'organization': ['exact'],
            'budget_min': ['exact', 'gte', 'lte'],
            'budget_max': ['exact', 'gte', 'lte'],
        }

    def search_filter(self, queryset, name, value):
        return queryset.filter(
            Q(title__icontains=value) |
            Q(description__icontains=value) |
            Q(organization__name__icontains=value)
        )

class CompetitionFilter(filters.FilterSet):
    title = filters.CharFilter(lookup_expr='icontains')
    description = filters.CharFilter(lookup_expr='icontains')
    status = filters.ChoiceFilter(choices=Competition.STATUS_CHOICES)
    start_date_after = filters.DateFilter(field_name='start_date', lookup_expr='gte')
    start_date_before = filters.DateFilter(field_name='start_date', lookup_expr='lte')
    end_date_after = filters.DateFilter(field_name='end_date', lookup_expr='gte')
    end_date_before = filters.DateFilter(field_name='end_date', lookup_expr='lte')
    search = filters.CharFilter(method='search_filter')

    class Meta:
        model = Competition
        fields = {
            'status': ['exact'],
            'organization': ['exact'],
            'prize_pool': ['exact', 'gte', 'lte'],
            'max_participants': ['exact', 'gte', 'lte'],
        }

    def search_filter(self, queryset, name, value):
        return queryset.filter(
            Q(title__icontains=value) |
            Q(description__icontains=value) |
            Q(organization__name__icontains=value)
        )

class SubmissionFilter(filters.FilterSet):
    title = filters.CharFilter(lookup_expr='icontains')
    description = filters.CharFilter(lookup_expr='icontains')
    status = filters.ChoiceFilter(choices=Submission.STATUS_CHOICES)
    submitted_after = filters.DateTimeFilter(field_name='submitted_at', lookup_expr='gte')
    submitted_before = filters.DateTimeFilter(field_name='submitted_at', lookup_expr='lte')
    search = filters.CharFilter(method='search_filter')

    class Meta:
        model = Submission
        fields = {
            'status': ['exact'],
            'competition': ['exact'],
            'submitter': ['exact'],
            'score': ['exact', 'gte', 'lte'],
        }

    def search_filter(self, queryset, name, value):
        return queryset.filter(
            Q(title__icontains=value) |
            Q(description__icontains=value) |
            Q(competition__title__icontains=value) |
            Q(submitter__username__icontains=value)
        )
