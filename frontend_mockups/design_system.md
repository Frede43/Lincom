# 🎨 Design System - Community Laboratory Burundi

## Palette de Couleurs

### Couleurs Principales
```
🟢 Vert Burundi (Primary)    : #2E7D32 (Croissance, Innovation)
🔵 Bleu Tech (Secondary)     : #1976D2 (Technologie, Confiance)
🟡 Jaune Soleil (Accent)     : #FFA000 (Énergie, Optimisme)
🔴 Rouge Alerte (Warning)    : #D32F2F (Urgence, Important)
```

### Couleurs Neutres
```
⚫ Noir Texte        : #212121
⚪ Gris Foncé       : #424242
🔘 Gris Moyen       : #757575
⚪ Gris Clair       : #BDBDBD
⚪ Gris Très Clair  : #F5F5F5
⚪ Blanc            : #FFFFFF
```

### Couleurs Sémantiques
```
✅ Succès    : #4CAF50
⚠️ Warning   : #FF9800
❌ Erreur    : #F44336
ℹ️ Info      : #2196F3
```

## Typographie

### Hiérarchie des Titres
```
H1 - 32px/40px - Bold   - Titres principaux
H2 - 28px/36px - Bold   - Sections importantes
H3 - 24px/32px - SemiBold - Sous-sections
H4 - 20px/28px - SemiBold - Titres de cartes
H5 - 18px/24px - Medium - Sous-titres
H6 - 16px/22px - Medium - Labels importants
```

### Corps de Texte
```
Body Large  - 16px/24px - Regular - Texte principal
Body        - 14px/20px - Regular - Texte standard
Body Small  - 12px/18px - Regular - Texte secondaire
Caption     - 11px/16px - Regular - Légendes
```

### Police Recommandée
```
Primary: "Inter" (Google Fonts)
- Excellente lisibilité
- Support multilingue (FR/EN/KI)
- Variantes complètes

Fallback: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto
```

## Composants UI

### Boutons
```
🔘 Primary Button
   Background: #2E7D32
   Text: #FFFFFF
   Padding: 12px 24px
   Border-radius: 8px
   Font: 14px Medium

🔘 Secondary Button  
   Background: transparent
   Border: 2px solid #2E7D32
   Text: #2E7D32
   Padding: 10px 22px

🔘 Ghost Button
   Background: transparent
   Text: #1976D2
   Hover: #F5F5F5
```

### Cards
```
┌─────────────────────────────────────┐
│ 📦 CARD STANDARD                    │
│                                     │
│ Background: #FFFFFF                 │
│ Border: 1px solid #E0E0E0          │
│ Border-radius: 12px                 │
│ Padding: 24px                       │
│ Shadow: 0 2px 8px rgba(0,0,0,0.1)  │
└─────────────────────────────────────┘
```

### Navigation
```
🧭 SIDEBAR NAVIGATION
├── Width: 280px
├── Background: #FAFAFA
├── Active item: #2E7D32 background
├── Hover: #F0F0F0
└── Icons: 20px, text: 14px Medium

🔝 TOP NAVIGATION
├── Height: 64px
├── Background: #FFFFFF
├── Border-bottom: 1px solid #E0E0E0
└── Logo + Search + Profile
```

## Iconographie

### Style d'Icônes
```
📦 Bibliothèque: Heroicons ou Feather Icons
📏 Tailles: 16px, 20px, 24px, 32px
🎨 Style: Outline pour navigation, Solid pour actions
🎯 Cohérence: Même épaisseur de trait (1.5px)
```

### Icônes Métier
```
🚀 Projets/Startups    : rocket-launch
📚 Formation           : academic-cap
🤝 Mentorat           : user-group
💬 Forum              : chat-bubble-left-right
🏢 Organisations      : building-office
📊 Dashboard          : chart-bar
🔍 Recherche          : magnifying-glass
⚙️ Paramètres         : cog-6-tooth
```

## Responsive Design

### Breakpoints
```
📱 Mobile    : 320px - 767px
📱 Tablet    : 768px - 1023px
💻 Desktop   : 1024px - 1439px
🖥️ Large     : 1440px+
```

### Layout Mobile
```
📱 MOBILE FIRST APPROACH
├── Navigation: Bottom tab bar
├── Sidebar: Slide-over menu
├── Cards: Full width, stacked
├── Tables: Horizontal scroll
└── Forms: Single column
```

## Animations & Interactions

### Transitions
```
⚡ Standard: 200ms ease-in-out
🎭 Hover states: 150ms ease
📱 Mobile taps: 100ms ease
🔄 Loading: 300ms ease-in-out
```

### Micro-interactions
```
✅ Button hover: Scale 1.02 + shadow
💫 Card hover: Lift shadow
🎯 Focus states: 2px outline #2E7D32
📱 Touch feedback: Ripple effect
```

## Accessibilité

### Contraste
```
✅ AA Standard: 4.5:1 minimum
✅ AAA Standard: 7:1 pour texte important
🎯 Focus visible: 2px outline
⌨️ Navigation clavier complète
```

### Internationalisation
```
🌍 Langues supportées:
   - Français (principal)
   - Anglais (international)
   - Kirundi (local)

📱 RTL Support: Prévu pour l'arabe
🔤 Font loading: Optimisé
```

## Guidelines UX

### Principes de Design
```
1. 🎯 SIMPLICITÉ
   - Interface claire et intuitive
   - Pas plus de 3 actions par écran
   - Navigation évidente

2. 🚀 PERFORMANCE
   - Chargement < 3 secondes
   - Feedback immédiat
   - États de loading clairs

3. 📱 MOBILE FIRST
   - Optimisé pour mobile
   - Touch-friendly (44px minimum)
   - Offline capabilities

4. 🌍 INCLUSIVITÉ
   - Accessible à tous
   - Multilingue
   - Culturellement approprié
```

### Patterns UX
```
🔄 PROGRESSIVE DISCLOSURE
   - Informations par étapes
   - Détails à la demande
   - Pas de surcharge cognitive

📊 DATA VISUALIZATION
   - Graphiques simples
   - Couleurs significatives
   - Tooltips informatifs

🎯 CALL-TO-ACTION
   - Boutons visibles
   - Actions claires
   - Hiérarchie évidente
```
