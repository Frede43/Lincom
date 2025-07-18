from django.db.models import Q
from django.contrib.contenttypes.models import ContentType
from django.conf import settings
from .models import SearchIndex, SearchQuery, SearchFilter
from education.models import Course
from entrepreneurship.models import Startup, Project
from organizations.models import Competition, Organization
from users.models import User

class SearchService:
    """Service pour gérer les opérations de recherche"""
    
    @staticmethod
    def index_object(obj, category=None):
        """Indexe un objet dans le système de recherche"""
        content_type = ContentType.objects.get_for_model(obj)
        
        if not category:
            category = content_type.model.lower()
            
        # Prépare les données de base
        data = {
            'title': getattr(obj, 'title', str(obj)),
            'content': '',
            'summary': getattr(obj, 'description', ''),
            'keywords': getattr(obj, 'keywords', ''),
            'content_type': content_type,
            'object_id': obj.id,
            'category': category,
        }
        
        # Ajoute le contenu spécifique selon le type d'objet
        if isinstance(obj, Course):
            data['content'] = f"{obj.description}\n{obj.syllabus}\n{obj.objectives}"
        elif isinstance(obj, Startup):
            data['content'] = f"{obj.description}\n{obj.industry}"
        elif isinstance(obj, Project):
            data['content'] = f"{obj.description}\n{obj.objectives}"
        elif isinstance(obj, Competition):
            data['content'] = f"{obj.description}\n{obj.rules}\n{obj.eligibility_criteria}"
        elif isinstance(obj, User):
            data['content'] = f"{obj.bio}\n{getattr(obj, 'expertise', '')}"
            
        # Crée ou met à jour l'index
        search_index, created = SearchIndex.objects.update_or_create(
            content_type=content_type,
            object_id=obj.id,
            defaults=data
        )
        
        return search_index
        
    @staticmethod
    def search(query, category=None, filters=None, user=None, ip_address=None):
        """Effectue une recherche avec filtres optionnels"""
        base_query = SearchIndex.objects.all()
        
        # Applique les filtres de catégorie
        if category:
            base_query = base_query.filter(category=category)
            
        # Recherche dans le titre, le contenu et les mots-clés
        if query:
            base_query = base_query.filter(
                Q(title__icontains=query) |
                Q(content__icontains=query) |
                Q(keywords__icontains=query) |
                Q(summary__icontains=query)
            )
            
        # Applique les filtres personnalisés
        if filters:
            for field, value in filters.items():
                if value is not None:
                    base_query = base_query.filter(**{field: value})
        
        # Compte les résultats avant de les retourner
        results_count = base_query.count()
                    
        # Enregistre la requête pour l'analyse
        if query:  # N'enregistre que les vraies requêtes
            SearchQuery.objects.create(
                query=query,
                category=category,
                filters=filters,
                results_count=results_count,
                user=user,
                ip_address=ip_address
            )
        
        return base_query.order_by('-updated_at')

    @staticmethod
    def get_filters(category):
        """Récupère les filtres disponibles pour une catégorie"""
        return SearchFilter.objects.filter(
            category=category,
            is_active=True
        ).order_by('order')
        
    @staticmethod
    def get_trending_searches(days=7, limit=10):
        """Récupère les recherches tendance"""
        from django.utils import timezone
        from django.db.models import Count
        from datetime import timedelta
        
        start_date = timezone.now() - timedelta(days=days)
        
        return SearchQuery.objects.filter(
            created_at__gte=start_date
        ).values('query').annotate(
            count=Count('id')
        ).order_by('-count')[:limit]
        
    @staticmethod
    def get_related_content(obj, limit=5):
        """Récupère le contenu connexe basé sur les mots-clés"""
        content_type = ContentType.objects.get_for_model(obj)
        keywords = getattr(obj, 'keywords', '').split(',')
        
        if not keywords:
            return SearchIndex.objects.none()
            
        related = SearchIndex.objects.exclude(
            content_type=content_type,
            object_id=obj.id
        )
        
        for keyword in keywords:
            if keyword.strip():
                related = related.filter(
                    Q(keywords__icontains=keyword.strip()) |
                    Q(title__icontains=keyword.strip())
                )
                
        return related.distinct()[:limit]

    @staticmethod
    def get_suggestions(query, category=None, limit=10):
        """Retourne des suggestions de recherche basées sur la saisie partielle"""
        base_query = SearchIndex.objects.all()
        
        if category:
            base_query = base_query.filter(category=category)
            
        # Recherche les suggestions dans le titre et les mots-clés
        suggestions = base_query.filter(
            Q(title__icontains=query) |
            Q(keywords__icontains=query)
        ).values_list('title', flat=True).distinct()[:limit]
        
        # Ajoute les requêtes populaires similaires
        popular_queries = SearchQuery.objects.filter(
            query__icontains=query,
            category=category if category else None
        ).values('query').annotate(
            count=Count('query')
        ).order_by('-count')[:limit]
        
        # Combine les suggestions
        all_suggestions = list(suggestions)
        for item in popular_queries:
            if len(all_suggestions) >= limit:
                break
            if item['query'] not in all_suggestions:
                all_suggestions.append(item['query'])
        
        return all_suggestions
