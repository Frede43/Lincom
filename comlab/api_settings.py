from rest_framework import permissions
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView
from drf_spectacular.openapi import AutoSchema

# Configuration pour drf-spectacular
class CustomAutoSchema(AutoSchema):
    def get_info(self):
        return {
            'title': 'ComLab API',
            'version': 'v1',
            'description': """
            ComLab est une plateforme collaborative d'apprentissage qui offre des fonctionnalités de formation,
            de mentorat et de développement professionnel.

            ## Fonctionnalités principales

            * 👩‍🎓 **Formation** : Accès à des cours, des ressources et des parcours d'apprentissage
            * 👥 **Mentorat** : Mise en relation avec des mentors et suivi des sessions
            * 📊 **Tableau de bord** : Vue personnalisée des activités et de la progression
            * 🔍 **Recherche** : Recherche avancée dans tout le contenu de la plateforme
            * 🏢 **Organisations** : Gestion des organisations et des compétitions
            * 📢 **Forum** : Espace de discussion et d'échange

            ## Authentication

            La plupart des points d'accès nécessitent une authentification. Utilisez le point d'accès
            `/api/token/` pour obtenir un token JWT, puis incluez-le dans l'en-tête Authorization :

            ```
            Authorization: Bearer <votre_token>
            ```
            """,
            'contact': {'email': 'contact@comlab.com'},
            'license': {'name': 'MIT License'},
        }

# Vues pour la documentation API
schema_view = SpectacularAPIView.as_view()
swagger_view = SpectacularSwaggerView.as_view(url_name='schema')
redoc_view = SpectacularRedocView.as_view(url_name='schema')
