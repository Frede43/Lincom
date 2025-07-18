# API Forum ComLab

Cette documentation décrit les endpoints de l'API Forum de ComLab.

## Catégories

### Lister les catégories
```http
GET /api/forum/categories/
```

#### Réponse
```json
[
    {
        "id": 1,
        "name": "Général",
        "description": "Discussion générale",
        "order": 0,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
    }
]
```

### Créer une catégorie
```http
POST /api/forum/categories/
```

#### Corps de la requête
```json
{
    "name": "Général",
    "description": "Discussion générale",
    "order": 0
}
```

## Sujets

### Lister les sujets
```http
GET /api/forum/topics/
```

#### Paramètres de requête
- `category` (optionnel) : ID de la catégorie pour filtrer les sujets

#### Réponse
```json
[
    {
        "id": 1,
        "title": "Mon sujet",
        "content": "Contenu du sujet",
        "category": 1,
        "author": {
            "id": 1,
            "username": "user1"
        },
        "course": null,
        "is_pinned": false,
        "is_locked": false,
        "views_count": 0,
        "posts_count": 0,
        "last_post": null,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z",
        "last_activity": "2024-01-01T00:00:00Z"
    }
]
```

### Créer un sujet
```http
POST /api/forum/topics/
```

#### Corps de la requête
```json
{
    "title": "Mon sujet",
    "content": "Contenu du sujet",
    "category": 1,
    "course": null
}
```

### Épingler/Désépingler un sujet (Staff uniquement)
```http
POST /api/forum/topics/{id}/toggle_pin/
```

### Verrouiller/Déverrouiller un sujet (Auteur ou Staff)
```http
POST /api/forum/topics/{id}/toggle_lock/
```

### Incrémenter le nombre de vues
```http
POST /api/forum/topics/{id}/increment_view/
```

## Messages

### Lister les messages d'un sujet
```http
GET /api/forum/topics/{topic_id}/posts/
```

#### Réponse
```json
[
    {
        "id": 1,
        "content": "Contenu du message",
        "author": {
            "id": 1,
            "username": "user1"
        },
        "parent": null,
        "is_solution": false,
        "likes_count": 0,
        "replies_count": 0,
        "replies": [],
        "comments": [],
        "attachments": [],
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
    }
]
```

### Créer un message
```http
POST /api/forum/topics/{topic_id}/posts/
```

#### Corps de la requête
```json
{
    "content": "Contenu du message"
}
```

### Répondre à un message
```http
POST /api/forum/posts/{id}/reply/
```

#### Corps de la requête
```json
{
    "content": "Contenu de la réponse"
}
```

### Marquer comme solution (Auteur du sujet uniquement)
```http
POST /api/forum/topics/{topic_id}/posts/{id}/mark_as_solution/
```

### Aimer/Ne plus aimer un message
```http
POST /api/forum/posts/{id}/toggle_like/
```

## Commentaires

### Lister les commentaires d'un message
```http
GET /api/forum/posts/{post_id}/comments/
```

#### Réponse
```json
[
    {
        "id": 1,
        "content": "Contenu du commentaire",
        "author": {
            "id": 1,
            "username": "user1"
        },
        "likes_count": 0,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
    }
]
```

### Créer un commentaire
```http
POST /api/forum/posts/{post_id}/comments/
```

#### Corps de la requête
```json
{
    "content": "Contenu du commentaire"
}
```

### Aimer/Ne plus aimer un commentaire
```http
POST /api/forum/posts/{post_id}/comments/{id}/toggle_like/
```

## Pièces jointes

### Ajouter une pièce jointe à un message
```http
POST /api/forum/attachments/
```

#### Corps de la requête
```json
{
    "post": 1,
    "file": [fichier binaire],
    "filename": "document.pdf",
    "file_size": 1024,
    "content_type": "application/pdf"
}
```

### Supprimer une pièce jointe
```http
DELETE /api/forum/attachments/{id}/
```

## Codes d'erreur

- `400 Bad Request` : Requête invalide
- `401 Unauthorized` : Non authentifié
- `403 Forbidden` : Non autorisé
- `404 Not Found` : Ressource non trouvée
- `409 Conflict` : Conflit (ex: sujet verrouillé)
