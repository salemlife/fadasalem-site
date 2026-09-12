# 🧩 SALEM Ministry - Documentation des Composants

> **Version:** 4.1  
> **Framework:** React 18+ avec TypeScript

---

## 📋 TABLE DES MATIÈRES

1. [App.tsx - Composant Principal](#-apptsx)
2. [Header.tsx - Navigation](#-headertsx)
3. [Footer.tsx - Pied de page](#-footertsx)
4. [Preloader.tsx - Écran de chargement](#-preloadertsx)
5. [HeroSection.tsx - Slideshow](#-herosectiontsx)
6. [VerseOfDay.tsx - Verset du jour](#-verseofdaytsx)
7. [AboutPage.tsx - Page À Propos (complète)](#-aboutpagetsx)
8. [EventsPage.tsx - Page Événements (complète)](#-eventspagetsx)
9. [ContactSection.tsx - Contact](#-contactsectiontsx)
10. [SermonsSection.tsx - Sermons](#-sermonssectiontsx)
11. [SalemTVSection.tsx - Salem TV](#-salemtvsectiontsx)
12. [VirtualRoom.tsx - Salle Virtuelle](#-virtualroomtsx)
13. [MaintenanceSection.tsx - Pages en maintenance](#-maintenancesectiontsx)
14. [FloatingButtons.tsx - Boutons flottants](#-floatingbuttonstsx)

---

## 📱 APP.TSX

### Fichier
`src/App.tsx`

### Description
Composant racine qui gère le routing interne (SPA) et l'affichage des pages.

### États
```typescript
const [isLoading, setIsLoading] = useState(true);
```

### Contextes utilisés
- `useNavigation()` - Pour le routing SPA
- `useLanguage()` - Pour le bilinguisme

### Logique de rendu
```typescript
// Pages avec Header
if (['home', 'virtual-room', 'contact', 'salem-tv', 'sermons'].includes(currentPage)) {
  return (
    <>
      <Preloader />
      <Header />
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'virtual-room' && <VirtualRoom />}
      // etc.
      <FloatingButtons />
      <Footer />
    </>
  );
}

// Pages maintenance (sans Header/Footer standard)
if (['academy', 'shop', 'donate'].includes(currentPage)) {
  return <MaintenanceSection type={currentPage} />;
}
```

---

## 🧭 HEADER.TSX

### Fichier
`src/components/Header.tsx`

### Description
Navigation principale avec top bar, logo, menu et boutons CTA.

### États
```typescript
const [isMenuOpen, setIsMenuOpen] = useState(false);
const [isScrolled, setIsScrolled] = useState(false);
const [isResourcesOpen, setIsResourcesOpen] = useState(false);
```

### Comportement
- **Sticky** : Reste en haut au scroll
- **Adaptatif** : Fond crème → blanc au scroll ou sur autres pages
- **Responsive** : Menu hamburger sur mobile

### Structure
```
┌─────────────────────────────────────────────────────────────────┐
│ TOP BAR (vert foncé)                                            │
│ Email | Téléphone | Toggle Langue (FR/EN)                       │
├─────────────────────────────────────────────────────────────────┤
│ NAVIGATION (crème/blanc)                                        │
│ Logo | Menu Items | Dropdown Ressources | [Salle] [Don]        │
├─────────────────────────────────────────────────────────────────┤
│ MENU MOBILE (panel plein écran)                                 │
│ Logo + Items + CTA + Langue                                     │
└─────────────────────────────────────────────────────────────────┘
```

### Menu Items
```typescript
const navItems = [
  { id: 'about', label: 'À Propos', labelEn: 'About' },
  { id: 'events', label: 'Événements', labelEn: 'Events' },
  { id: 'salem-tv', label: 'Salem TV', labelEn: 'Salem TV' },
  { id: 'contact', label: 'Contact', labelEn: 'Contact' },
];

const resourcesItems = [
  { id: 'sermons', label: 'Sermons', labelEn: 'Sermons', comingSoon: false },
  { id: 'academy', label: 'Academy', labelEn: 'Academy', comingSoon: true },
  { id: 'shop', label: 'Boutique', labelEn: 'Shop', comingSoon: true },
];
```

### Tailles du logo
- Mobile: `w-12 h-12`
- Desktop: `w-14 h-14 lg:w-16 lg:h-16`

---

## 🦶 FOOTER.TSX

### Fichier
`src/components/Footer.tsx`

### Description
Pied de page avec 4 colonnes et informations de contact.

### Structure (4 colonnes)
```
┌─────────────────────────────────────────────────────────────────┐
│ LOGO + Description + Réseaux | Liens Rapides | Ressources | Contact │
└─────────────────────────────────────────────────────────────────┘
```

### Colonnes
1. **Logo** : Logo (w-24 h-24) + Description ministère + Icônes réseaux
2. **Liens Rapides** : Accueil, À Propos, Événements, Sermons, Contact
3. **Ressources** : Salem TV, Salle Virtuelle, Academy (bientôt), Boutique (bientôt)
4. **Contact** : Email, Téléphones, Adresse, Horaires

---

## ⏳ PRELOADER.TSX

### Fichier
`src/components/Preloader.tsx`

### Description
Écran de chargement avec logo animé et barre de progression.

### États
```typescript
const [isVisible, setIsVisible] = useState(true);
const [progress, setProgress] = useState(0);
```

### Comportement
- Progression de 0 à 100% en ~2.5 secondes
- Fade out après 100%
- Logo avec fond blanc circulaire (pour visibilité sur fond vert)

### Animation
```typescript
useEffect(() => {
  const interval = setInterval(() => {
    setProgress(prev => {
      if (prev >= 100) {
        setTimeout(() => setIsVisible(false), 500);
        return 100;
      }
      return prev + Math.random() * 15;
    });
  }, 150);
}, []);
```

---

## 🎬 HEROSECTION.TSX

### Fichier
`src/components/sections/HeroSection.tsx`

### Description
Slideshow avec 6 images, effet Ken Burns et statistiques.

### États
```typescript
const [currentSlide, setCurrentSlide] = useState(0);
```

### Images (6)
```typescript
const slides = [
  'https://salemministry.org/images/IMG_2599.jpeg',
  'https://salemministry.org/images/IMG_2367.jpeg',
  'https://salemministry.org/images/IMG_2463.jpeg',
  'https://salemministry.org/images/IMG_2628.jpeg',
  'https://salemministry.org/images/IMG_2636.jpeg',
  'https://salemministry.org/images/img9.jpg',
];
```

### Fonctionnalités
- **Rotation automatique** : 5 secondes par slide
- **Effet Ken Burns** : Zoom lent sur les images
- **Colombe animée** : Symbole du Saint-Esprit avec flammes
- **Statistiques** : 5000+ Membres, 15+ Pays, 10+ Années, 10000+ Prières

### Boutons CTA
- "Nous Rejoindre" → Scroll vers About
- "Faire un Don" → Page donate

---

## 📖 VERSEOFDAYTSX

### Fichier
`src/components/sections/VerseOfDay.tsx`

### Description
Affichage d'un verset biblique rotatif avec possibilité de rafraîchir et partager.

### États
```typescript
const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
```

### Versets (8)
Voir `SALEM_CONTENT.md` pour la liste complète.

### Fonctionnalités
- **Rotation** : Bouton pour changer de verset
- **Partage** : Web Share API ou clipboard
- **Animation** : Guillemets décoratifs dorés

---

## ℹ️ ABOUTPAGE.TSX

### Fichier
`src/components/AboutPage.tsx`

### Description
Page À propos COMPLÈTE et séparée avec Histoire, Vision, Mission, Valeurs, Fondateur, Leadership et Galerie.

### Props
```typescript
interface AboutPageProps {
  onNavigate?: (page: string) => void;
}
```

### États
```typescript
const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
const [activeValue, setActiveValue] = useState(0);
```

### Structure
```
┌─────────────────────────────────────────────────────────────────┐
│ HERO (60vh) - Image + "Qui Sommes-Nous"                         │
├─────────────────────────────────────────────────────────────────┤
│ STATS : 5000+ Membres | 15+ Pays | 10+ Années | 10000+ Prières │
├─────────────────────────────────────────────────────────────────┤
│ NOTRE HISTOIRE - Timeline avec 6 milestones (2014-2025)        │
├─────────────────────────────────────────────────────────────────┤
│ VISION & MISSION (2 cartes gradient vert/rouge)                │
├─────────────────────────────────────────────────────────────────┤
│ NOS VALEURS (4 cartes avec rotation auto)                      │
│ Foi | Prière | Communauté | Mission                             │
├─────────────────────────────────────────────────────────────────┤
│ LE FONDATEUR (Photo + Bio complète + Citation)                 │
│ Père John Paul Chinonso Uzochukwu "Fada Salem"                  │
├─────────────────────────────────────────────────────────────────┤
│ LEADERSHIP (4 cartes équipes)                                   │
├─────────────────────────────────────────────────────────────────┤
│ GALERIE (6 images avec effet hover)                            │
├─────────────────────────────────────────────────────────────────┤
│ CTA - "Rejoignez Notre Communauté" + boutons                   │
└─────────────────────────────────────────────────────────────────┘
```

### Milestones Timeline
```typescript
const milestones = [
  { year: '2014', event: 'Fondation du ministère' },
  { year: '2016', event: 'Première grande retraite' },
  { year: '2018', event: 'Lancement de Salem TV' },
  { year: '2020', event: 'Expansion internationale' },
  { year: '2023', event: '5000+ membres actifs' },
  { year: '2025', event: 'Nouvelle ère digitale' }
];
```

### Valeurs (avec rotation auto 4s)
```typescript
const values = [
  { icon: Heart, title: 'Foi', color: 'from-red-500 to-red-600' },
  { icon: Flame, title: 'Prière', color: 'from-orange-500 to-red-500' },
  { icon: Users, title: 'Communauté', color: 'from-green-500 to-green-600' },
  { icon: Globe, title: 'Mission', color: 'from-blue-500 to-blue-600' }
];
```

---

## 📅 EVENTSPAGE.TSX

### Fichier
`src/components/EventsPage.tsx`

### Description
Page Événements COMPLÈTE et séparée avec compte à rebours, filtres, liste événements et archives.

### Props
```typescript
interface EventsPageProps {
  onNavigate?: (page: string) => void;
}
```

### États
```typescript
const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
const [activeFilter, setActiveFilter] = useState('all');
const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
```

### Structure
```
┌─────────────────────────────────────────────────────────────────┐
│ HERO (70vh) - Événement en vedette + Compte à rebours          │
│ Jours | Heures | Minutes | Secondes                             │
│ [S'inscrire maintenant] + Jauge d'inscription                   │
├─────────────────────────────────────────────────────────────────┤
│ FILTRES : Tous | Messes | Retraites | Conférences | Prière     │
├─────────────────────────────────────────────────────────────────┤
│ ÉVÉNEMENTS À VENIR (grille de cartes)                          │
│ Type badge | Image | Titre | Description | Date | Lieu         │
│ Jauge de places (registered/spots)                              │
├─────────────────────────────────────────────────────────────────┤
│ ARCHIVES - Événements Passés                                    │
│ Image | Galerie | Nombre de participants                        │
├─────────────────────────────────────────────────────────────────┤
│ CTA - "Ne manquez aucun événement"                              │
└─────────────────────────────────────────────────────────────────┘
```

### Filtres
```typescript
const filters = [
  { id: 'all', labelFr: 'Tous', icon: CalendarDays },
  { id: 'mass', labelFr: 'Messes', icon: Church },
  { id: 'retreat', labelFr: 'Retraites', icon: Flame },
  { id: 'conference', labelFr: 'Conférences', icon: BookOpen },
  { id: 'prayer', labelFr: 'Prière', icon: Users }
];
```

### Structure d'un événement
```typescript
interface Event {
  id: number;
  type: 'mass' | 'retreat' | 'conference' | 'prayer';
  titleFr: string;
  titleEn: string;
  descFr: string;
  descEn: string;
  date: string;
  time: string;
  endDate?: string;
  location: string;
  image: string;
  featured: boolean;
  spots: number | null;
  registered: number | null;
}
```

### Modal Événement
- Image header
- Badge type
- Titre + Description
- Date, Heure, Lieu
- Jauge de places
- Bouton S'inscrire

---

## 📞 CONTACTSECTION.TSX

### Fichier
`src/components/sections/ContactSection.tsx`

### Description
Page de contact avec formulaires, FAQ, témoignages et carte Google Maps.

### Structure "One Page Flow"
```
┌─────────────────────────────────────────────────────────────────┐
│ HERO (50vh) - Image + "Restons en Contact"                     │
│ Quick Actions : WhatsApp | Email | Appeler                     │
├─────────────────────────────────────────────────────────────────┤
│ COMPTEURS ANIMÉS : 5000+ Membres | 15+ Pays | 10000+ Prières   │
├─────────────────────────────────────────────────────────────────┤
│ FORMULAIRE DE CONTACT                                           │
│ Objet (dropdown) | Nom | Email | Message | [Envoyer]           │
├─────────────────────────────────────────────────────────────────┤
│ CARDS : Demande de Prière | Devenir Membre                     │
├─────────────────────────────────────────────────────────────────┤
│ COORDONNÉES + GOOGLE MAPS                                       │
├─────────────────────────────────────────────────────────────────┤
│ TÉMOIGNAGES (Carousel auto 5s)                                  │
├─────────────────────────────────────────────────────────────────┤
│ FAQ (Accordéon 4 questions)                                     │
└─────────────────────────────────────────────────────────────────┘
```

### Modals
- **Intention de prière** : Nom, Email, Téléphone, Pays, Intention, Anonyme
- **Devenir membre** : Prénom, Nom, Email, Téléphone, Pays, Motivation

### Synchronisation Firebase
Les intentions de prière sont envoyées à `prayerIntentions` via `sendPrayerIntention()`.

---

## 🎧 SERMONSSECTION.TSX

### Fichier
`src/components/sections/SermonsSection.tsx`

### Description
Bibliothèque de sermons audio/vidéo avec filtres et mini-lecteur.

### États
```typescript
const [selectedCategory, setSelectedCategory] = useState('all');
const [searchQuery, setSearchQuery] = useState('');
const [currentSermon, setCurrentSermon] = useState<Sermon | null>(null);
const [isPlaying, setIsPlaying] = useState(false);
const [showPlayer, setShowPlayer] = useState(false);
```

### Structure
```
┌─────────────────────────────────────────────────────────────────┐
│ SERMON EN VEDETTE (Hero)                                        │
├─────────────────────────────────────────────────────────────────┤
│ FILTRES (scroll horizontal) : Tous | Récents | Vidéos | Audio   │
├─────────────────────────────────────────────────────────────────┤
│ SÉRIES D'ENSEIGNEMENTS (Carousel)                               │
├─────────────────────────────────────────────────────────────────┤
│ LISTE DES SERMONS (Grille ou Liste)                            │
├─────────────────────────────────────────────────────────────────┤
│ MINI-LECTEUR FIXE (bas de l'écran quand un sermon joue)        │
├─────────────────────────────────────────────────────────────────┤
│ MODAL LECTEUR (plein écran pour vidéo YouTube ou audio)        │
└─────────────────────────────────────────────────────────────────┘
```

### Catégories
```typescript
const categories = [
  { id: 'all', label: 'Tous', icon: '📋' },
  { id: 'recent', label: 'Récents', icon: '⏰' },
  { id: 'holy-spirit', label: 'Saint-Esprit', icon: '🔥' },
  { id: 'faith', label: 'Foi', icon: '📖' },
  { id: 'prayer', label: 'Prière', icon: '🎤' },
  { id: 'healing', label: 'Guérison', icon: '❤️' },
  { id: 'video', label: 'Vidéos', icon: '🎥' },
  { id: 'audio', label: 'Audio', icon: '🎧' },
];
```

---

## 📺 SALEMTVSECTION.TSX

### Fichier
`src/components/sections/SalemTVSection.tsx`

### Description
Lecteur YouTube intégré avec programme TV.

### Structure
```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER avec bouton retour                                       │
├─────────────────────────────────────────────────────────────────┤
│ LECTEUR YOUTUBE (iframe)                                        │
│ Chaîne: @salemabundantlifeministry                              │
├─────────────────────────────────────────────────────────────────┤
│ PROGRAMME TV                                                     │
│ Lun-Ven 06:00 Prière du Matin                                   │
│ Mercredi 18:00 Enseignement Biblique                            │
│ Vendredi 21:00 Veillée de Prière                                │
│ Dimanche 09:00 Messe en Direct                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎥 VIRTUALROOM.TSX

### Fichier
`src/components/VirtualRoom.tsx`

### Description
Salle de prière virtuelle avec intégration Whereby et Firebase.

### États principaux
```typescript
const [isLive, setIsLive] = useState(false);
const [inRoom, setInRoom] = useState(false);
const [isAdmin, setIsAdmin] = useState(false);
const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
const [showLoginModal, setShowLoginModal] = useState(false);
const [showRegisterModal, setShowRegisterModal] = useState(false);
const [showAdminModal, setShowAdminModal] = useState(false);
const [wherebyLinks, setWherebyLinks] = useState<WherebyLinks>({...});
```

### Structure de l'écran
```
┌─────────────────────────────────────────────────────────────────┐
│ SUB-HEADER : Titre | Badge EN DIRECT/Hors ligne | ⚙️ Admin     │
├─────────────────────────────────────────────────────────────────┤
│ ÉCRAN WHEREBY / ATTENTE                                         │
│                                                                  │
│ Si hors ligne:                                                   │
│   - Logo centré                                                  │
│   - "Aucune session en cours"                                   │
│   - Bouton S'inscrire (toujours actif)                          │
│   - Bouton Connexion (grisé si hors ligne)                      │
│                                                                  │
│ Si en ligne:                                                     │
│   - Badge "EN DIRECT"                                            │
│   - Bouton Rejoindre (si connecté)                               │
│   - Iframe Whereby (si dans la salle)                           │
├─────────────────────────────────────────────────────────────────┤
│ BARRE DE CONTRÔLE                                                │
│ Logo | Titre session | [Quitter/Arrêter] | Statut               │
├─────────────────────────────────────────────────────────────────┤
│ SESSIONS PROGRAMMÉES (3 cartes)                                  │
├─────────────────────────────────────────────────────────────────┤
│ BOUTONS : WhatsApp | Intention de prière                        │
└─────────────────────────────────────────────────────────────────┘
```

### Modals

1. **Modal Inscription (5 champs)**
   - Nom, Code Pays, Téléphone, Pays, Email (optionnel)

2. **Modal Connexion (1 champ)**
   - Nom ou Téléphone

3. **Modal Intention de Prière**
   - Nom (pré-rempli), Intention, Option Anonyme

4. **Modal Admin (5 onglets)**
   - Tableau de Bord : Stats + Démarrer/Arrêter session
   - Sessions : CRUD sessions programmées
   - Intentions : Liste + Filtres + Actions
   - Utilisateurs : Liste + Recherche + Export/Import
   - Paramètres : Firebase status + Config Whereby

### Logique Admin vs Participant
```typescript
// L'admin démarre une session et entre directement
const handleStartSession = async () => {
  const result = await startLiveSession(sessionTitle, sessionTitleEn);
  if (result.success) {
    setIsAdmin(true);
    setInRoom(true); // Entrée directe
  }
};

// URL générée
const iframeUrl = isAdmin 
  ? getHostWherebyUrl(wherebyLinks.hostLink)      // Avec roomKey = droits modération
  : getParticipantWherebyUrl(currentUser.name, wherebyLinks.participantLink); // Sans roomKey
```

---

## 🚧 MAINTENANCESECTION.TSX

### Fichier
`src/components/MaintenanceSection.tsx`

### Props
```typescript
interface MaintenanceSectionProps {
  type: 'academy' | 'shop' | 'donate';
}
```

### Description
Page affichée pour les sections en cours de développement.

### Contenu par type
```typescript
const content = {
  academy: {
    title: 'Salem Academy',
    description: 'Plateforme de formation en ligne',
    features: ['Cours vidéos', 'Certificats', 'Suivi progression'],
    image: 'IMG_2463.jpeg'
  },
  shop: {
    title: 'Boutique & Ressources',
    description: 'Livres, ebooks et articles',
    features: ['30+ livres', 'Articles dévotion', 'Livraison internationale'],
    image: 'img5.jpg'
  },
  donate: {
    title: 'Dons & Soutien',
    description: 'Soutenir le ministère',
    features: ['Dîmes en ligne', 'Projets humanitaires', 'Reçus automatiques'],
    image: 'IMG_2628.jpeg'
  }
};
```

---

## 💬 FLOATINGBUTTONS.TSX

### Fichier
`src/components/FloatingButtons.tsx`

### Description
Boutons flottants : WhatsApp et retour en haut.

### États
```typescript
const [showScrollTop, setShowScrollTop] = useState(false);
```

### Comportement
- **WhatsApp** : Toujours visible, badge notification pulsant
- **Scroll Top** : Apparaît après 400px de scroll

### Position
- Bottom: 24px
- Right: 24px
- Z-index: 50

---

*Documentation Composants SALEM Ministry - Version 4.0*
