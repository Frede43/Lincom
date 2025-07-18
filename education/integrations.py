import re
from urllib.parse import urlparse, parse_qs
from django.conf import settings

class YouTubeIntegration:
    """Classe pour gérer l'intégration avec YouTube"""
    
    @staticmethod
    def extract_video_id(url):
        """Extrait l'ID de la vidéo YouTube depuis une URL"""
        if not url:
            return None
            
        # Patterns d'URL YouTube possibles
        patterns = [
            r'^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([^&]+)',
            r'^https?:\/\/(?:www\.)?youtube\.com\/embed\/([^?]+)',
            r'^https?:\/\/youtu\.be\/([^?]+)',
        ]
        
        for pattern in patterns:
            match = re.match(pattern, url)
            if match:
                return match.group(1)
                
        return None
    
    @staticmethod
    def get_embed_url(video_id):
        """Génère l'URL d'intégration pour une vidéo YouTube"""
        if not video_id:
            return None
        return f"https://www.youtube.com/embed/{video_id}"
    
    @staticmethod
    def get_thumbnail_url(video_id):
        """Récupère l'URL de la miniature d'une vidéo YouTube"""
        if not video_id:
            return None
        return f"https://img.youtube.com/vi/{video_id}/hqdefault.jpg"

class VimeoIntegration:
    """Classe pour gérer l'intégration avec Vimeo"""
    
    @staticmethod
    def extract_video_id(url):
        """Extrait l'ID de la vidéo Vimeo depuis une URL"""
        if not url:
            return None
            
        patterns = [
            r'^https?:\/\/(?:www\.)?vimeo\.com\/(\d+)',
            r'^https?:\/\/player\.vimeo\.com\/video\/(\d+)',
        ]
        
        for pattern in patterns:
            match = re.match(pattern, url)
            if match:
                return match.group(1)
                
        return None
    
    @staticmethod
    def get_embed_url(video_id):
        """Génère l'URL d'intégration pour une vidéo Vimeo"""
        if not video_id:
            return None
        return f"https://player.vimeo.com/video/{video_id}"

class VideoIntegrationFactory:
    """Factory pour créer l'intégration vidéo appropriée"""
    
    PROVIDERS = {
        'youtube': YouTubeIntegration,
        'vimeo': VimeoIntegration,
    }
    
    @classmethod
    def get_integration(cls, url):
        """Retourne l'intégration appropriée basée sur l'URL"""
        if not url:
            return None
            
        domain = urlparse(url).netloc.lower()
        
        if 'youtube' in domain or 'youtu.be' in domain:
            return YouTubeIntegration
        elif 'vimeo' in domain:
            return VimeoIntegration
            
        return None
    
    @classmethod
    def process_video_url(cls, url):
        """Traite une URL vidéo et retourne les informations d'intégration"""
        integration = cls.get_integration(url)
        if not integration:
            return None
            
        video_id = integration.extract_video_id(url)
        if not video_id:
            return None
            
        return {
            'provider': integration.__name__.lower().replace('integration', ''),
            'video_id': video_id,
            'embed_url': integration.get_embed_url(video_id),
            'thumbnail_url': getattr(integration, 'get_thumbnail_url', lambda x: None)(video_id),
        }

class DocumentIntegration:
    """Classe pour gérer l'intégration de documents"""
    
    SUPPORTED_EXTENSIONS = {
        'pdf': 'application/pdf',
        'doc': 'application/msword',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'xls': 'application/vnd.ms-excel',
        'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'ppt': 'application/vnd.ms-powerpoint',
        'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    }
    
    @classmethod
    def is_supported(cls, filename):
        """Vérifie si le type de fichier est supporté"""
        ext = filename.split('.')[-1].lower()
        return ext in cls.SUPPORTED_EXTENSIONS
    
    @classmethod
    def get_mime_type(cls, filename):
        """Retourne le type MIME pour un fichier"""
        ext = filename.split('.')[-1].lower()
        return cls.SUPPORTED_EXTENSIONS.get(ext)
    
    @staticmethod
    def get_preview_url(file_url, file_type):
        """Génère une URL de prévisualisation pour un document"""
        if file_type == 'pdf':
            return f"https://docs.google.com/viewer?url={file_url}&embedded=true"
        return None
