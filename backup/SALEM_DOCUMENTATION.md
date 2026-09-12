# 📖 SALEM Abundant Life Ministry - Documentation Principale

> **Version:** 4.0  
> **Dernière mise à jour:** Janvier 2025  
> **Site:** SALEM Abundant Life Ministry of the Holy Spirit

---

## 📋 TABLE DES MATIÈRES

1. [Objectif du Site](#-objectif-du-site)
2. [Stack Technologique](#-stack-technologique)
3. [Identité Visuelle](#-identité-visuelle)
4. [Images Officielles](#-images-officielles)
5. [Contacts et Réseaux Sociaux](#-contacts-et-réseaux-sociaux)
6. [Structure du Site](#-structure-du-site)
7. [Navigation](#-navigation)
8. [Système Bilingue](#-système-bilingue)

---

## 🎯 OBJECTIF DU SITE

Créer un site web moderne, bilingue (français/anglais), élégant et mobile-friendly pour **SALEM Ministry** (Spirit Abundant Life Evangelical Movement), un ministère pastoral dédié à la connaissance et à la rencontre du Saint-Esprit, fondé par **Fada SALEM** (Père John Paul Chinonso Uzochukwu), prêtre de la Congrégation du Saint-Esprit (Spiritains), basé à **Bafia, Cameroun**.

### Ton et Ambiance
- **Spiritualité** : Connexion profonde avec le Saint-Esprit
- **Bienveillance** : Accueil chaleureux pour tous
- **Autorité** : Ministère sérieux et établi
- **Dynamisme** : Communauté vivante et active
- **Espérance** : Message de foi et de guérison

---

## 🛠️ STACK TECHNOLOGIQUE

| Technologie | Version | Usage |
|-------------|---------|-------|
| **React** | 18+ | Framework UI |
| **TypeScript** | 5+ | Typage statique |
| **Vite** | 5+ | Build tool |
| **Tailwind CSS** | 4+ | Styling |
| **Lucide React** | Latest | Icônes |
| **Firebase** | 10+ | Backend (Firestore + Auth) |

### Dépendances NPM
```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "lucide-react": "latest",
    "firebase": "^10.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "tailwindcss": "^4.x",
    "vite": "^5.x",
    "@vitejs/plugin-react": "latest"
  }
}
```

---

## 🎨 IDENTITÉ VISUELLE

### Logo Officiel
```
Logo complet: https://salemministry.org/images/logosalem.png
Icône (favicon): https://salemministry.org/images/icosalem.png
```
> ⚠️ **Important** : Le logo a des éléments verts. Sur fond vert, ajouter un fond blanc circulaire.

### Tailles du Logo par Emplacement

| Emplacement | Mobile | Desktop | Classes Tailwind |
|-------------|--------|---------|------------------|
| **Header** | 48px | 64px | `w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16` |
| **Footer** | 96px | 112px | `w-24 h-24 md:w-28 md:h-28` |
| **Preloader** | 144px | 176px | `w-36 h-36 md:w-44 md:h-44` |
| **Salle Virtuelle** | 64-80px | 96px | `w-16 h-16 sm:w-24 sm:h-24 md:w-32` |
| **Menu Mobile** | 96px | - | `w-24 h-24` |

### Image Officielle du Fondateur
```
URL: https://salemministry.org/images/peresalem4.jpeg
Nom: Révérend Père John Paul Chinonso Uzochukwu
Surnom: "Fada Salem"
Titre: Fondateur & Directeur Spirituel
```

### Palette de Couleurs

| Couleur | Code Hex | Variable CSS | Utilisation |
|---------|----------|--------------|-------------|
| **Rouge SALEM** | `#b20e10` | `--salem-red` | Boutons CTA, accents, alertes |
| **Rouge Light** | `#d41316` | `--salem-red-light` | Hover states |
| **Rouge Dark** | `#8a0b0d` | `--salem-red-dark` | Active states |
| **Vert SALEM** | `#2c6b1e` | `--salem-green` | Header, footer, backgrounds |
| **Vert Light** | `#3d8f2a` | `--salem-green-light` | Hover states |
| **Vert Dark** | `#1e4a14` | `--salem-green-dark` | Active states |
| **Or/Doré** | `#d4a826` | `--salem-gold` | Accents, badges |
| **Or Light** | `#e6c04a` | `--salem-gold-light` | Highlights |
| **Blanc** | `#ffffff` | - | Backgrounds, textes sur sombre |
| **Noir** | `#1a1a1a` | - | Textes principaux |

### Typographie (Google Fonts)

| Police | Usage | Classes Tailwind |
|--------|-------|------------------|
| **Playfair Display** | Titres principaux (H1, H2) | `font-serif` |
| **Lora** | Citations, versets bibliques | `font-lora` |
| **Inter** | Corps de texte (défaut) | `font-sans` |
| **Cinzel** | Accents décoratifs, "SALEM" | `font-cinzel` |

```css
/* Import Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap');
```

---

## 📸 IMAGES OFFICIELLES

### Hero Slideshow (6 images)
```
https://salemministry.org/images/IMG_2599.jpeg
https://salemministry.org/images/IMG_2367.jpeg
https://salemministry.org/images/IMG_2463.jpeg
https://salemministry.org/images/IMG_2628.jpeg
https://salemministry.org/images/IMG_2636.jpeg
https://salemministry.org/images/img9.jpg
```

### Galerie Complète

| Image | Catégorie | URL |
|-------|-----------|-----|
| peresalem4.jpeg | Ministère | https://salemministry.org/images/peresalem4.jpeg |
| IMG_2599.jpeg | Adoration | https://salemministry.org/images/IMG_2599.jpeg |
| IMG_2367.jpeg | Prière | https://salemministry.org/images/IMG_2367.jpeg |
| IMG_2391.jpeg | Communauté | https://salemministry.org/images/IMG_2391.jpeg |
| IMG_2463.jpeg | Événements | https://salemministry.org/images/IMG_2463.jpeg |
| IMG_2628.jpeg | Événements | https://salemministry.org/images/IMG_2628.jpeg |
| IMG_2636.jpeg | Adoration | https://salemministry.org/images/IMG_2636.jpeg |
| img5.jpg | Ministère | https://salemministry.org/images/img5.jpg |
| img7.jpg | Prière | https://salemministry.org/images/img7.jpg |
| img9.jpg | Communauté | https://salemministry.org/images/img9.jpg |
| IMG_2319.jpeg | Communauté | https://salemministry.org/images/IMG_2319.jpeg |

---

## 📱 CONTACTS ET RÉSEAUX SOCIAUX

### Coordonnées Officielles

| Type | Information |
|------|-------------|
| **Téléphone** | +39 350 837 0643 |
| **WhatsApp** | +237 697 033 647 |
| **Telegram** | +237 697 033 647 |
| **Email** | contact@salemministry.org |
| **Localisation** | Bafia, Cameroun |

### Réseaux Sociaux

| Plateforme | Lien | Couleur |
|------------|------|---------|
| **Facebook** | https://web.facebook.com/salemabundantlifeministry | #1877F2 |
| **YouTube** | https://www.youtube.com/@salemabundantlifeministry | #FF0000 |
| **TikTok** | https://www.tiktok.com/@fadasalem | #000000 |
| **Telegram** | https://t.me/+237697033647 | #0088CC |

### Liens WhatsApp Pré-formatés
```
Standard: https://wa.me/237697033647
Avec message: https://wa.me/237697033647?text=MESSAGE_ENCODÉ
```

---

## 📄 STRUCTURE DU SITE

### Pages Principales

| Page | Route | Description |
|------|-------|-------------|
| **Accueil** | `home` | Hero + Verset + Aperçus compacts (About, Events, Gallery) |
| **À Propos** | `about` | Histoire, Timeline, Vision/Mission, Valeurs, Fondateur, Leadership, Galerie |
| **Événements** | `events` | Compte à rebours, Filtres, Liste événements, Archives, Inscription |
| **Sermons** | `sermons` | Bibliothèque audio/vidéo avec filtres et mini-lecteur |
| **Contact** | `contact` | Formulaires + Prière (Firebase) + Membre + FAQ + Maps |
| **Salem TV** | `salem-tv` | Lecteur YouTube + Programme hebdomadaire |
| **Salle Virtuelle** | `virtual-room` | Whereby + Firebase sync + Admin dashboard |
| **Academy** | `academy` | En maintenance |
| **Boutique** | `shop` | En maintenance |
| **Dons** | `donate` | En maintenance |

### Sections de la Page d'Accueil (aperçus compacts)

1. **Hero Section** - Slideshow avec 6 images, colombe animée, statistiques
2. **Verset du Jour** - 8 versets rotatifs bilingues
3. **Aperçu À Propos** - Photo Fondateur + description + bouton "En savoir plus"
4. **Aperçu Événements** - 3 prochains événements + bouton "Voir tous"
5. **Aperçu Galerie** - Grille 8 images + bouton "Voir la galerie"

---

## 🧭 NAVIGATION

### Header (Navigation Principale)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🟢 TOP BAR (vert foncé)                                                      │
│    📧 contact@salemministry.org  📱 +39 350 837 0643     🇫🇷 FR | 🇬🇧 EN    │
├─────────────────────────────────────────────────────────────────────────────┤
│  🔆 LOGO   │   Accueil  À Propos  Événements  Salem TV  Ressources ▼        │
│            │                                              │ [🎥 Salle] [❤️ Don]│
└─────────────────────────────────────────────────────────────────────────────┘
```

### Comportement du Header

| État | Fond | Texte |
|------|------|-------|
| **Accueil (en haut)** | Crème/blanc gradient | Gris foncé |
| **Accueil (au scroll)** | Blanc avec ombre | Gris foncé |
| **Autres pages** | Blanc avec ombre | Gris foncé |

### Menu "Ressources" (Dropdown)

| Item | Badge | Status |
|------|-------|--------|
| Sermons | - | ✅ Actif |
| Academy | Bientôt | 🚧 Maintenance |
| Boutique | Bientôt | 🚧 Maintenance |

### Footer (4 Colonnes)

1. **Logo + Description + Réseaux**
2. **Liens Rapides**
3. **Ressources**
4. **Contact + Horaires**

### Boutons Flottants

| Bouton | Position | Couleur | Lien |
|--------|----------|---------|------|
| **WhatsApp** | Bas droite | #25D366 | wa.me/237697033647 |
| **Retour en haut** | Bas droite | Vert SALEM | Scroll to top |

---

## 🌐 SYSTÈME BILINGUE

### Langues Supportées
- 🇫🇷 **Français** (par défaut)
- 🇬🇧 **Anglais**

### Contexte React
```typescript
// src/contexts/LanguageContext.tsx
interface LanguageContextType {
  language: 'fr' | 'en';
  setLanguage: (lang: 'fr' | 'en') => void;
  t: (fr: string, en: string) => string;
}
```

### Stockage
- Préférence en `localStorage` (clé: `salem-language`)
- Détection automatique navigateur au premier chargement

### Basculement
- Sélecteur dans le header (toggle FR/EN)
- Drapeaux cliquables (🇫🇷 / 🇬🇧)

---

## ✅ CHECKLIST FONCTIONNALITÉS

### Site Principal
- [x] Slideshow Hero (6 images avec Ken Burns)
- [x] Verset du jour (8 versets rotatifs)
- [x] Compteurs animés (statistiques)
- [x] À propos avec fondateur
- [x] Galerie avec filtres et lightbox
- [x] Événements avec compte à rebours
- [x] Salem TV avec lecteur YouTube
- [x] Contact (formulaires + FAQ + témoignages)
- [x] Sermons (audio/vidéo avec filtres)
- [x] 3 pages maintenance (Academy, Boutique, Dons)
- [x] Navigation sticky adaptative
- [x] Footer 4 colonnes
- [x] Bilinguisme FR/EN
- [x] Mobile-first responsive

### Salle Virtuelle
- [x] Intégration Whereby
- [x] Synchronisation Firebase temps réel
- [x] Inscription/Connexion participants
- [x] Vérification doublons
- [x] Intentions de prière
- [x] Sessions programmées
- [x] Interface admin complète (5 onglets)
- [x] Mode hôte/participant distinct

### Firebase
- [x] Firestore (temps réel)
- [x] Authentication (admin)
- [x] 5 collections configurées
- [x] Règles de sécurité

---

> 📌 **Voir aussi :**
> - `SALEM_TECHNICAL.md` - Documentation technique Firebase
> - `SALEM_COMPONENTS.md` - Détails des composants React
> - `SALEM_CONTENT.md` - Contenus bilingues et données

---

*Documentation SALEM Ministry - Version 4.0*
