# 🤝 Guide de Contribution - Community Laboratory Burundi

Merci de votre intérêt pour contribuer au Community Laboratory Burundi ! Ce guide vous aidera à comprendre comment participer efficacement au projet.

## 🎯 **Types de Contributions**

Nous accueillons plusieurs types de contributions :

### 🐛 **Rapports de Bugs**
- Signaler des problèmes ou dysfonctionnements
- Fournir des informations détaillées pour reproduire le bug
- Proposer des solutions si possible

### ✨ **Nouvelles Fonctionnalités**
- Proposer de nouvelles fonctionnalités
- Implémenter des améliorations
- Optimiser les performances

### 📚 **Documentation**
- Améliorer la documentation existante
- Traduire en français/kirundi
- Créer des tutoriels et guides

### 🧪 **Tests**
- Ajouter des tests unitaires
- Améliorer la couverture de tests
- Tests d'intégration

### 🎨 **UI/UX**
- Améliorer l'interface utilisateur
- Optimiser l'expérience utilisateur
- Design responsive

## 🚀 **Comment Contribuer**

### **1. Fork du Repository**
```bash
# Forker le projet sur GitHub
# Puis cloner votre fork
git clone https://github.com/VOTRE_USERNAME/Lincom.git
cd Lincom
```

### **2. Configuration de l'Environnement**
```bash
# Créer l'environnement virtuel
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou venv\Scripts\activate  # Windows

# Installer les dépendances
pip install -r requirements.txt
pip install -r requirements-dev.txt  # Dépendances de développement

# Configuration
cp .env.example .env
# Éditer .env avec vos paramètres

# Migrations
python manage.py migrate

# Tests pour vérifier l'installation
python manage.py test
```

### **3. Créer une Branche**
```bash
# Créer une branche pour votre fonctionnalité
git checkout -b feature/nom-de-votre-fonctionnalite

# Ou pour un bugfix
git checkout -b bugfix/description-du-bug
```

### **4. Développement**
- Suivre les standards de code (voir ci-dessous)
- Écrire des tests pour votre code
- Documenter les nouvelles fonctionnalités
- Tester localement

### **5. Commit et Push**
```bash
# Ajouter vos changements
git add .

# Commit avec un message descriptif
git commit -m "feat: ajouter système de réservation d'équipements"

# Push vers votre fork
git push origin feature/nom-de-votre-fonctionnalite
```

### **6. Pull Request**
- Ouvrir une Pull Request sur GitHub
- Décrire clairement vos changements
- Référencer les issues liées
- Attendre la review

## 📋 **Standards de Code**

### **Python/Django**
```python
# Suivre PEP 8
# Utiliser des type hints
def create_user(username: str, email: str) -> User:
    """Créer un nouvel utilisateur."""
    return User.objects.create(username=username, email=email)

# Docstrings pour les fonctions importantes
class EquipmentReservation:
    """Modèle pour les réservations d'équipements."""
    
    def is_available(self) -> bool:
        """Vérifier si l'équipement est disponible."""
        return self.status == 'available'
```

### **Tests**
```python
# Tests unitaires obligatoires
class TestEquipmentReservation(TestCase):
    def setUp(self):
        self.user = User.objects.create_user('test', 'test@example.com')
        self.equipment = Equipment.objects.create(name='Test Equipment')
    
    def test_create_reservation(self):
        """Test de création d'une réservation."""
        reservation = EquipmentReservation.objects.create(
            equipment=self.equipment,
            user=self.user,
            start_time=timezone.now(),
            end_time=timezone.now() + timedelta(hours=2)
        )
        self.assertEqual(reservation.status, 'pending')
```

### **API Documentation**
```python
# Documenter les endpoints avec drf-spectacular
from drf_spectacular.utils import extend_schema

class EquipmentViewSet(viewsets.ModelViewSet):
    @extend_schema(
        summary="Réserver un équipement",
        description="Créer une nouvelle réservation pour un équipement",
        responses={201: EquipmentReservationSerializer}
    )
    def reserve(self, request, pk=None):
        """Réserver un équipement."""
        pass
```

## 🔍 **Process de Review**

### **Critères d'Acceptation**
- ✅ Code respecte les standards
- ✅ Tests passent (coverage > 80%)
- ✅ Documentation mise à jour
- ✅ Pas de régression
- ✅ Performance acceptable

### **Timeline**
- **Review initiale** : 2-3 jours ouvrables
- **Feedback** : Discussion constructive
- **Corrections** : Itérations si nécessaire
- **Merge** : Après approbation

## 🐛 **Signaler des Bugs**

### **Template de Bug Report**
```markdown
**Description du Bug**
Description claire et concise du problème.

**Étapes pour Reproduire**
1. Aller à '...'
2. Cliquer sur '....'
3. Faire défiler jusqu'à '....'
4. Voir l'erreur

**Comportement Attendu**
Description de ce qui devrait se passer.

**Screenshots**
Si applicable, ajouter des captures d'écran.

**Environnement**
- OS: [e.g. Windows 10, Ubuntu 20.04]
- Navigateur: [e.g. Chrome 91, Firefox 89]
- Version Python: [e.g. 3.9.5]
- Version Django: [e.g. 4.2.8]

**Contexte Additionnel**
Toute autre information pertinente.
```

## 💡 **Proposer des Fonctionnalités**

### **Template de Feature Request**
```markdown
**Problème à Résoudre**
Description claire du problème que cette fonctionnalité résoudrait.

**Solution Proposée**
Description claire de ce que vous voulez qui se passe.

**Alternatives Considérées**
Description des solutions alternatives que vous avez considérées.

**Contexte Additionnel**
Toute autre information ou captures d'écran pertinentes.
```

## 🌍 **Communauté**

### **Canaux de Communication**
- **GitHub Issues** : Bugs et fonctionnalités
- **GitHub Discussions** : Questions générales
- **Email** : contact@comlab.bi
- **Discord** : [Lien vers le serveur] (à venir)

### **Code de Conduite**
- Respecter tous les participants
- Utiliser un langage inclusif
- Accepter les critiques constructives
- Se concentrer sur ce qui est le mieux pour la communauté

## 🏆 **Reconnaissance**

Les contributeurs seront reconnus de plusieurs façons :
- **README** : Liste des contributeurs
- **Releases** : Mention dans les notes de version
- **Badges** : Reconnaissance spéciale pour les gros contributeurs
- **Événements** : Invitations aux événements Community Lab

## 📚 **Ressources Utiles**

### **Documentation Technique**
- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [MIT Fab Lab Charter](https://www.fablabs.io/charter/)

### **Outils de Développement**
- **IDE** : VS Code, PyCharm
- **Testing** : pytest, coverage
- **Linting** : flake8, black
- **API Testing** : Postman, Insomnia

---

**Merci de contribuer au Community Laboratory Burundi ! 🇧🇮**
