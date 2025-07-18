from django_filters import rest_framework as filters
from django.db.models import Q
from .models import Startup, Project, Milestone, Resource

class StartupFilter(filters.FilterSet):
    name = filters.CharFilter(lookup_expr='icontains')
    description = filters.CharFilter(lookup_expr='icontains')
    industry = filters.CharFilter(lookup_expr='icontains')
    status = filters.ChoiceFilter(choices=Startup.STATUS_CHOICES)
    funding_stage = filters.ChoiceFilter(choices=Startup.FUNDING_STAGE_CHOICES)
    team_size_min = filters.NumberFilter(field_name='team_size', lookup_expr='gte')
    team_size_max = filters.NumberFilter(field_name='team_size', lookup_expr='lte')
    total_funding_min = filters.NumberFilter(field_name='total_funding', lookup_expr='gte')
    total_funding_max = filters.NumberFilter(field_name='total_funding', lookup_expr='lte')
    search = filters.CharFilter(method='search_filter')

    class Meta:
        model = Startup
        fields = {
            'status': ['exact'],
            'industry': ['exact'],
            'funding_stage': ['exact'],
            'team_size': ['exact', 'gte', 'lte'],
            'total_funding': ['exact', 'gte', 'lte'],
            'founder': ['exact'],
        }

    def search_filter(self, queryset, name, value):
        return queryset.filter(
            Q(name__icontains=value) |
            Q(description__icontains=value) |
            Q(industry__icontains=value) |
            Q(founder__username__icontains=value)
        )

class ProjectFilter(filters.FilterSet):
    title = filters.CharFilter(lookup_expr='icontains')
    description = filters.CharFilter(lookup_expr='icontains')
    status = filters.ChoiceFilter(choices=Project.STATUS_CHOICES)
    priority = filters.ChoiceFilter(choices=Project.PRIORITY_CHOICES)
    budget_min = filters.NumberFilter(field_name='budget', lookup_expr='gte')
    budget_max = filters.NumberFilter(field_name='budget', lookup_expr='lte')
    start_date_after = filters.DateFilter(field_name='start_date', lookup_expr='gte')
    start_date_before = filters.DateFilter(field_name='start_date', lookup_expr='lte')
    end_date_after = filters.DateFilter(field_name='end_date', lookup_expr='gte')
    end_date_before = filters.DateFilter(field_name='end_date', lookup_expr='lte')
    search = filters.CharFilter(method='search_filter')

    class Meta:
        model = Project
        fields = {
            'status': ['exact'],
            'priority': ['exact'],
            'startup': ['exact'],
            'budget': ['exact', 'gte', 'lte'],
            'manager': ['exact'],
        }

    def search_filter(self, queryset, name, value):
        return queryset.filter(
            Q(title__icontains=value) |
            Q(description__icontains=value) |
            Q(startup__name__icontains=value) |
            Q(manager__username__icontains=value)
        )

class MilestoneFilter(filters.FilterSet):
    title = filters.CharFilter(lookup_expr='icontains')
    description = filters.CharFilter(lookup_expr='icontains')
    status = filters.ChoiceFilter(choices=Milestone.STATUS_CHOICES)
    priority = filters.ChoiceFilter(choices=Milestone.PRIORITY_CHOICES)
    due_date_after = filters.DateFilter(field_name='due_date', lookup_expr='gte')
    due_date_before = filters.DateFilter(field_name='due_date', lookup_expr='lte')
    completion_date_after = filters.DateFilter(field_name='completion_date', lookup_expr='gte')
    completion_date_before = filters.DateFilter(field_name='completion_date', lookup_expr='lte')
    search = filters.CharFilter(method='search_filter')

    class Meta:
        model = Milestone
        fields = {
            'status': ['exact'],
            'priority': ['exact'],
            'project': ['exact'],
            'assignee': ['exact'],
        }

    def search_filter(self, queryset, name, value):
        return queryset.filter(
            Q(title__icontains=value) |
            Q(description__icontains=value) |
            Q(project__title__icontains=value) |
            Q(assignee__username__icontains=value)
        )

class ResourceFilter(filters.FilterSet):
    title = filters.CharFilter(lookup_expr='icontains')
    description = filters.CharFilter(lookup_expr='icontains')
    resource_type = filters.ChoiceFilter(choices=Resource.RESOURCE_TYPE_CHOICES)
    visibility = filters.ChoiceFilter(choices=Resource.VISIBILITY_CHOICES)
    search = filters.CharFilter(method='search_filter')

    class Meta:
        model = Resource
        fields = {
            'resource_type': ['exact'],
            'visibility': ['exact'],
            'startup': ['exact'],
            'owner': ['exact'],
        }

    def search_filter(self, queryset, name, value):
        return queryset.filter(
            Q(title__icontains=value) |
            Q(description__icontains=value) |
            Q(startup__name__icontains=value) |
            Q(owner__username__icontains=value)
        )
