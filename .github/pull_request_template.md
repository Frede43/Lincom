# 🔄 Pull Request

## 📝 **Description**
Brève description des changements apportés.

## 🎯 **Type de Changement**
- [ ] 🐛 Bug fix (changement non-breaking qui corrige un problème)
- [ ] ✨ Nouvelle fonctionnalité (changement non-breaking qui ajoute une fonctionnalité)
- [ ] 💥 Breaking change (correction ou fonctionnalité qui casserait la fonctionnalité existante)
- [ ] 📚 Documentation (mise à jour de la documentation uniquement)
- [ ] 🎨 Style (formatage, points-virgules manquants, etc.; pas de changement de code)
- [ ] ♻️ Refactoring (changement de code qui ne corrige ni n'ajoute de fonctionnalité)
- [ ] ⚡ Performance (changement de code qui améliore les performances)
- [ ] 🧪 Tests (ajout de tests manquants ou correction de tests existants)
- [ ] 🔧 Chore (changements dans le processus de build ou outils auxiliaires)

## 🔗 **Issues Liées**
Fixes #(numéro de l'issue)
Closes #(numéro de l'issue)
Relates to #(numéro de l'issue)

## 🧪 **Tests**
- [ ] Tests unitaires ajoutés/mis à jour
- [ ] Tests d'intégration ajoutés/mis à jour
- [ ] Tests passent localement (`python manage.py test`)
- [ ] Tests API validés (`python test_apis.py`)
- [ ] Tests manuels effectués

## 📊 **Impact**
### **Modules Django Affectés**
- [ ] users
- [ ] education
- [ ] entrepreneurship
- [ ] organizations
- [ ] mentorship
- [ ] forum
- [ ] dashboard
- [ ] search
- [ ] lab_equipment

### **APIs Modifiées**
- [ ] Nouveaux endpoints ajoutés
- [ ] Endpoints existants modifiés
- [ ] Documentation Swagger mise à jour
- [ ] Permissions vérifiées

### **Base de Données**
- [ ] Nouvelles migrations créées
- [ ] Migrations testées
- [ ] Données d'exemple mises à jour
- [ ] Pas de perte de données

## 📱 **Screenshots/Vidéos**
Si applicable, ajouter des captures d'écran ou vidéos des changements UI.

## ✅ **Checklist de Review**
- [ ] Code respecte les standards PEP 8
- [ ] Docstrings ajoutées pour les nouvelles fonctions/classes
- [ ] Type hints ajoutés
- [ ] Pas de code commenté laissé
- [ ] Pas de print() ou console.log() de debug
- [ ] Variables et fonctions nommées clairement
- [ ] Pas de duplication de code
- [ ] Gestion d'erreurs appropriée

## 🔒 **Sécurité**
- [ ] Pas de secrets/clés exposés
- [ ] Validation des entrées utilisateur
- [ ] Permissions appropriées
- [ ] Pas de vulnérabilités introduites

## 📚 **Documentation**
- [ ] README mis à jour si nécessaire
- [ ] Documentation API mise à jour
- [ ] Commentaires de code ajoutés
- [ ] Guide de déploiement mis à jour si nécessaire

## 🌍 **Standards Internationaux**
- [ ] Conformité MIT Fab Lab maintenue
- [ ] Standards UNESCO respectés
- [ ] Alignement UN SDGs préservé
- [ ] Bonnes pratiques internationales suivies

## 🚀 **Déploiement**
- [ ] Changements compatibles avec la production
- [ ] Variables d'environnement documentées
- [ ] Instructions de déploiement mises à jour
- [ ] Rollback plan considéré

## 💬 **Notes pour les Reviewers**
Informations supplémentaires pour aider les reviewers à comprendre et tester les changements.

## 📋 **Post-Merge Tasks**
- [ ] Mettre à jour la documentation utilisateur
- [ ] Communiquer les changements à l'équipe
- [ ] Planifier les tests en staging
- [ ] Préparer les notes de release
