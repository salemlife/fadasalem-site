# 🔧 SALEM Ministry - Documentation Technique

> **Version:** 4.0  
> **Stack:** React + TypeScript + Vite + Tailwind CSS + Firebase

---

## 📋 TABLE DES MATIÈRES

1. [Structure des Fichiers](#-structure-des-fichiers)
2. [Configuration Firebase](#-configuration-firebase)
3. [Règles Firestore](#-règles-firestore)
4. [Collections Firebase](#-collections-firebase)
5. [Fonctions Firebase](#-fonctions-firebase)
6. [Types TypeScript](#-types-typescript)
7. [Configuration Whereby](#-configuration-whereby)
8. [Contextes React](#-contextes-react)
9. [Dépannage](#-dépannage)

---

## 📁 STRUCTURE DES FICHIERS

```
salem-ministry/
├── index.html                          # HTML principal avec métadonnées
├── package.json                        # Dépendances npm
├── vite.config.ts                      # Configuration Vite
├── tailwind.config.js                  # Configuration Tailwind
│
├── backup/                             # Documentation
│   ├── SALEM_DOCUMENTATION.md          # Vue d'ensemble
│   ├── SALEM_TECHNICAL.md              # Ce fichier
│   ├── SALEM_COMPONENTS.md             # Détails composants
│   ├── SALEM_CONTENT.md                # Contenus bilingues
│   └── index.css                       # Backup CSS
│
├── src/
│   ├── main.tsx                        # Point d'entrée React
│   ├── App.tsx                         # Composant principal avec routing
│   ├── index.css                       # Styles globaux + animations
│   ├── firebase.ts                     # Configuration Firebase + fonctions
│   │
│   ├── contexts/
│   │   ├── LanguageContext.tsx         # Contexte bilingue FR/EN
│   │   └── NavigationContext.tsx       # Contexte navigation SPA
│   │
│   └── components/
│       ├── Header.tsx                  # Navigation principale
│       ├── Footer.tsx                  # Pied de page
│       ├── Preloader.tsx               # Écran de chargement
│       ├── FloatingButtons.tsx         # WhatsApp + Scroll top
│       ├── VirtualRoom.tsx             # Salle virtuelle Whereby
│       ├── MaintenanceSection.tsx      # Pages en maintenance
│       │
│       └── sections/
│           ├── HeroSection.tsx         # Slideshow accueil
│           ├── AboutSection.tsx        # À propos
│           ├── VerseOfDay.tsx          # Verset du jour
│           ├── GallerySection.tsx      # Galerie photos
│           ├── EventsSection.tsx       # Événements
│           ├── ContactSection.tsx      # Contact (3 onglets + FAQ)
│           ├── SalemTVSection.tsx      # Salem TV
│           └── SermonsSection.tsx      # Sermons audio/vidéo
```

---

## 🔥 CONFIGURATION FIREBASE

### Projet Firebase

| Paramètre | Valeur |
|-----------|--------|
| **Nom du projet** | salem-ministry-cm |
| **Console** | https://console.firebase.google.com/project/salem-ministry-cm |
| **Région Firestore** | eur3 (europe-west) |

### Configuration (firebase.ts)

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBs1v8zLJpAk9Lfsj64E7y3HDR9xPcA4z0",
  authDomain: "salem-ministry-cm.firebaseapp.com",
  projectId: "salem-ministry-cm",
  storageBucket: "salem-ministry-cm.firebasestorage.app",
  messagingSenderId: "597183568975",
  appId: "1:597183568975:web:73e557fb931d0c0dafde3a"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

### Étapes de Configuration

1. **Activer Authentication**
   ```
   Firebase Console → Build → Authentication → Get started
   Sign-in method → Email/Password → Enable → Save
   ```

2. **Créer le Compte Admin**
   ```
   Firebase Console → Authentication → Users → Add user
   Email: admin@salem.org (ou autre)
   Password: [mot de passe sécurisé]
   ```

3. **Activer Firestore**
   ```
   Firebase Console → Build → Firestore Database → Create Database
   Mode: Production
   Région: eur3 (europe-west)
   ```

4. **Configurer les Règles**
   ```
   Firestore Database → Rules → Coller les règles → Publish
   ```

---

## 📜 RÈGLES FIRESTORE

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ===== CONFIG =====
    // Contient: liveSession, app, wherebyLinks, lastSession
    // Lecture: Publique (tout le monde peut voir si session active)
    // Écriture: Admin uniquement (authentifié)
    match /config/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // ===== PARTICIPANTS =====
    // Utilisateurs inscrits à la salle virtuelle
    // Lecture: Publique (nécessaire pour vérifier doublons + login)
    // Création/Modification: Publique (pour inscription)
    // Suppression: Admin uniquement
    match /participants/{participantId} {
      allow read: if true;
      allow create: if true;
      allow update: if true;
      allow delete: if request.auth != null;
    }
    
    // ===== SESSIONS PROGRAMMÉES =====
    // Programme des sessions (Prière du matin, etc.)
    // Lecture: Publique
    // Écriture: Admin uniquement
    match /scheduledSessions/{sessionId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // ===== INTENTIONS DE PRIÈRE =====
    // Intentions envoyées par les participants
    // Lecture: Admin uniquement (confidentialité)
    // Création: Publique (participants connectés)
    // Modification/Suppression: Admin uniquement
    match /prayerIntentions/{intentionId} {
      allow read: if request.auth != null;
      allow create: if true;
      allow update: if request.auth != null;
      allow delete: if request.auth != null;
    }
    
    // ===== ABONNÉS AUX NOTIFICATIONS =====
    // Utilisateurs qui souhaitent recevoir des notifications push
    // Lecture: Admin uniquement
    // Création: Publique (pour s'abonner)
    // Modification/Suppression: Admin uniquement
    match /notificationSubscribers/{subscriberId} {
      allow read: if request.auth != null;
      allow create: if true;
      allow update: if request.auth != null;
      allow delete: if request.auth != null;
    }
  }
}
```

---

## 📊 COLLECTIONS FIREBASE

### Collection: `config`

#### Document: `liveSession`
```typescript
{
  isLive: boolean;              // Session en cours
  title: string;                // Titre FR
  titleEn: string;              // Titre EN
  startedAt: Timestamp | null;  // Heure de début
  hostId: string;               // ID de l'hôte
}
```

#### Document: `lastSession`
```typescript
{
  title: string;                // Titre FR
  titleEn: string;              // Titre EN
  startedAt: Timestamp | null;  // Heure de début
  endedAt: Timestamp | null;    // Heure de fin
  hostId: string;               // ID de l'hôte
}
```

#### Document: `wherebyLinks`
```typescript
{
  hostLink: string;             // Lien complet hôte (avec roomKey)
  participantLink: string;      // Lien participant (sans roomKey)
  updatedAt: Timestamp;         // Dernière mise à jour
}
```

#### Document: `app`
```typescript
{
  name: string;                 // "SALEM Ministry"
  initialized: Timestamp;       // Date d'initialisation
}
```

---

### Collection: `participants`

```typescript
interface SessionUser {
  id: string;                   // ID auto-généré
  name: string;                 // Nom complet
  phone: string;                // Numéro formaté (+237 697...)
  countryCode: string;          // Code pays (+237)
  country: string;              // Nom du pays
  email?: string;               // Email (optionnel)
  createdAt: Timestamp;         // Date d'inscription
}
```

---

### Collection: `scheduledSessions`

```typescript
interface ScheduledSession {
  id?: string;                  // ID auto-généré
  title: string;                // Titre FR
  titleEn: string;              // Titre EN
  day: string;                  // Jour FR
  dayEn: string;                // Jour EN
  time: string;                 // Heure (HH:MM)
  host: string;                 // Animateur
  isActive: boolean;            // Session active
}
```

**Sessions par défaut:**
```javascript
[
  { title: 'Prière du Matin', titleEn: 'Morning Prayer', time: '06:00', day: 'Lundi - Vendredi', host: 'Père Salem' },
  { title: 'Angélus & Méditation', titleEn: 'Angelus & Meditation', time: '12:00', day: 'Lundi - Vendredi', host: 'Équipe Pastorale' },
  { title: 'Veillée de Prière', titleEn: 'Prayer Vigil', time: '21:00', day: 'Vendredi', host: 'Père Salem' }
]
```

---

### Collection: `prayerIntentions`

```typescript
interface PrayerIntention {
  id?: string;                  // ID auto-généré
  participantId: string;        // ID du participant
  participantName: string;      // Nom (ou "Anonyme")
  participantPhone: string;     // Téléphone
  participantCountry: string;   // Pays
  intention: string;            // Texte de l'intention
  isAnonymous: boolean;         // Mode anonyme
  status: 'pending' | 'prayed' | 'answered';
  createdAt: Timestamp;         // Date de création
  prayedAt?: Timestamp;         // Date de prière
  answeredAt?: Timestamp;       // Date d'exaucement
}
```

---

### Collection: `notificationSubscribers`

```typescript
interface NotificationSubscriber {
  id?: string;                  // ID auto-généré
  participantId: string;        // ID du participant
  participantName: string;      // Nom
  token: string;                // Token de notification
  createdAt: Timestamp;         // Date d'inscription
}
```

---

## 🔧 FONCTIONS FIREBASE

### Authentification Admin

```typescript
// Connexion admin
adminLogin(email: string, password: string): Promise<{
  success: boolean;
  user?: User;
  error?: string;
}>

// Déconnexion admin
adminLogout(): Promise<void>

// Obtenir l'admin actuel
getCurrentAdmin(): User | null

// Observer les changements d'authentification
onAuthChange(callback: (user: User | null) => void): () => void
```

### Gestion des Sessions Live

```typescript
// Démarrer une session
startLiveSession(title: string, titleEn: string): Promise<{
  success: boolean;
  error?: string;
}>

// Arrêter la session
stopLiveSession(): Promise<boolean>

// Obtenir le statut
getSessionStatus(): Promise<LiveSession | null>

// Écouter les changements (temps réel)
subscribeToSession(callback: (session: LiveSession | null) => void): () => void
```

### Gestion de la Dernière Session

```typescript
// Obtenir la dernière session
getLastSession(): Promise<LastSession | null>

// Écouter les changements
subscribeToLastSession(callback: (session: LastSession | null) => void): () => void
```

### Gestion des Liens Whereby

```typescript
// Obtenir les liens
getWherebyLinks(): Promise<WherebyLinks>

// Sauvegarder les liens (Admin only)
saveWherebyLinks(links: { hostLink: string; participantLink: string }): Promise<{
  success: boolean;
  error?: string;
}>

// Écouter les changements (temps réel)
subscribeToWherebyLinks(callback: (links: WherebyLinks) => void): () => void
```

### Gestion des Participants

```typescript
// Vérifier les doublons
checkDuplicateParticipant(phone: string, countryCode: string): Promise<{
  isDuplicate: boolean;
  existingUser?: SessionUser;
}>

// Ajouter un participant
addParticipant(user: Omit<SessionUser, 'id' | 'createdAt'>): Promise<{
  success: boolean;
  user?: SessionUser;
  error?: string;
  duplicate?: boolean;
}>

// Connexion participant
loginParticipant(nameOrPhone: string): Promise<SessionUser | null>

// Obtenir tous les participants
getParticipants(): Promise<SessionUser[]>

// Écouter les participants (temps réel)
subscribeToParticipants(callback: (users: SessionUser[]) => void): () => void

// Supprimer un participant (Admin only)
deleteParticipant(userId: string): Promise<boolean>

// Export/Import
exportParticipants(): Promise<{ exportDate: string; totalUsers: number; users: SessionUser[] }>
importParticipants(users: Omit<SessionUser, 'id' | 'createdAt'>[]): Promise<{ success: number; failed: number }>
```

### Gestion des Sessions Programmées

```typescript
// Récupérer les sessions
getScheduledSessions(): Promise<ScheduledSession[]>

// Sessions par défaut
getDefaultSessions(): ScheduledSession[]

// Écouter les sessions (temps réel)
subscribeToScheduledSessions(callback: (sessions: ScheduledSession[]) => void): () => void

// Sauvegarder une session (Admin only)
saveScheduledSession(session: ScheduledSession): Promise<{
  success: boolean;
  id?: string;
  error?: string;
}>

// Supprimer une session (Admin only)
deleteScheduledSession(sessionId: string): Promise<boolean>

// Initialiser les sessions par défaut
initializeDefaultSessions(): Promise<void>
```

### Gestion des Intentions de Prière

```typescript
// Envoyer une intention
sendPrayerIntention(intention: {
  participantId: string;
  participantName: string;
  participantPhone: string;
  participantCountry: string;
  intention: string;
  isAnonymous: boolean;
}): Promise<{ success: boolean; error?: string }>

// Obtenir les intentions (Admin only)
getPrayerIntentions(): Promise<PrayerIntention[]>

// Écouter les intentions (temps réel, Admin only)
subscribeToPrayerIntentions(callback: (intentions: PrayerIntention[]) => void): () => void

// Mettre à jour le statut (Admin only)
updatePrayerIntentionStatus(
  intentionId: string,
  status: 'pending' | 'prayed' | 'answered'
): Promise<boolean>

// Supprimer une intention (Admin only)
deletePrayerIntention(intentionId: string): Promise<boolean>
```

### Diagnostic Firebase

```typescript
// Vérifier la connexion
checkFirebaseConnection(): Promise<{
  connected: boolean;
  firestore: boolean;
  auth: boolean;
  error?: string;
}>

// Tester l'écriture
testFirestoreWrite(): Promise<boolean>

// Initialiser l'application
initializeApp(): Promise<void>
```

### Construction des URLs Whereby

```typescript
// URL Participant (sans droits de modération)
getParticipantWherebyUrl(userName: string, participantLink: string): string
// Retourne: participantLink?embed&displayName=UserName&chat=on&people=on&...

// URL Hôte (avec droits de modération via roomKey)
getHostWherebyUrl(hostLink: string): string
// Retourne: hostLink&embed&displayName=Père Salem (Hôte)&chat=on&screenshare=on&...
```

---

## 📝 TYPES TYPESCRIPT

```typescript
// Types principaux (src/firebase.ts)

export interface LiveSession {
  isLive: boolean;
  title: string;
  titleEn: string;
  startedAt: Timestamp | null;
  hostId: string;
}

export interface LastSession {
  title: string;
  titleEn: string;
  startedAt: Timestamp | null;
  endedAt: Timestamp | null;
  hostId: string;
}

export interface WherebyLinks {
  hostLink: string;
  participantLink: string;
  updatedAt?: Timestamp;
}

export interface SessionUser {
  id: string;
  name: string;
  phone: string;
  countryCode: string;
  country: string;
  email?: string;
  createdAt: Timestamp;
}

export interface ScheduledSession {
  id?: string;
  title: string;
  titleEn: string;
  day: string;
  dayEn: string;
  time: string;
  host: string;
  isActive: boolean;
}

export interface PrayerIntention {
  id?: string;
  participantId: string;
  participantName: string;
  participantPhone: string;
  participantCountry: string;
  intention: string;
  isAnonymous: boolean;
  status: 'pending' | 'prayed' | 'answered';
  createdAt: Timestamp;
  prayedAt?: Timestamp;
  answeredAt?: Timestamp;
}

export interface NotificationSubscriber {
  id?: string;
  participantId: string;
  participantName: string;
  token: string;
  createdAt: Timestamp;
}
```

---

## 🎥 CONFIGURATION WHEREBY

### Liens par Défaut

**URL Participant :**
```
https://salemroommeet.whereby.com/ministry34349146-5b2d-49a5-a895-2da7e0c6cc21
```

**URL Hôte (avec roomKey intégré) :**
```
https://salemroommeet.whereby.com/ministry34349146-5b2d-49a5-a895-2da7e0c6cc21?roomKey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZWV0aW5nSWQiOiIxMjMxMjI1OTQiLCJyb29tUmVmZXJlbmNlIjp7InJvb21OYW1lIjoiL21pbmlzdHJ5MzQzNDkxNDYtNWIyZC00OWE1LWE4OTUtMmRhN2UwYzZjYzIxIiwib3JnYW5pemF0aW9uSWQiOiIzMzUyMjUifSwiaXNzIjoiaHR0cHM6Ly9hY2NvdW50cy5zcnYud2hlcmVieS5jb20iLCJpYXQiOjE3NzE3MTAwNDMsInJvb21LZXlUeXBlIjoibWVldGluZ0hvc3QifQ.suP3qGvl2bx7Ai4W1QhItqWa5onEy-0fF4Jy3kDWBWk
```

### Droits selon le lien

| Lien | Droits |
|------|--------|
| **Participant** | Caméra, micro, chat |
| **Hôte** | + Muter participants, désactiver caméras, expulser, screenshare |

### Configuration Admin (Tableau de Bord)

Le tableau de bord admin permet de modifier les liens Whereby :
- **Onglet Paramètres** → Configuration Whereby
- **Lien Hôte** : URL complète avec roomKey (copiée depuis Whereby)
- **Lien Participant** : URL simple sans roomKey
- Les liens sont synchronisés en temps réel via Firebase

---

## ⚛️ CONTEXTES REACT

### LanguageContext

```typescript
// src/contexts/LanguageContext.tsx

interface LanguageContextType {
  language: 'fr' | 'en';
  setLanguage: (lang: 'fr' | 'en') => void;
  t: (fr: string, en: string) => string;
}

// Usage
const { language, setLanguage, t } = useLanguage();
t('Bonjour', 'Hello'); // Retourne selon la langue
```

### NavigationContext

```typescript
// src/contexts/NavigationContext.tsx

type Page = 'home' | 'virtual-room' | 'contact' | 'salem-tv' | 'sermons' | 'academy' | 'shop' | 'donate';

interface NavigationContextType {
  currentPage: Page;
  navigateTo: (page: Page) => void;
  scrollToSection: (sectionId: string) => void;
}

// Usage
const { currentPage, navigateTo } = useNavigation();
navigateTo('contact');
```

---

## 🔧 DÉPANNAGE

### Firebase ne se connecte pas

1. **Vérifier Firestore activé**
   ```
   Firebase Console → Firestore Database
   ```

2. **Vérifier les règles**
   - Copier les règles complètes ci-dessus
   - Cliquer "Publish"

3. **Vérifier l'email admin**
   ```
   Firebase Console → Authentication → Users
   ```

4. **Consulter les logs**
   - Ouvrir DevTools (F12)
   - Onglet Console
   - Chercher les erreurs Firebase

### Admin ne peut pas démarrer de session

1. **Vérifier authentification**
   - Email affiché dans le header du modal admin

2. **Tester l'écriture Firestore**
   - Paramètres → "Tester écriture"

3. **Vérifier les règles**
   - `config` doit avoir `allow write: if request.auth != null`

### Liens Whereby ne se synchronisent pas

1. **Vérifier les logs console**
   ```
   🔄 Saving Whereby links...
   ✅ Whereby links saved successfully!
   ```

2. **Vérifier que l'admin est connecté**
   - Le bouton "Enregistrer" ne fonctionne que si authentifié

3. **Vérifier le format des liens**
   - Lien hôte doit contenir `?roomKey=...`
   - Lien participant = URL simple

### Champs de formulaire illisibles

1. **Formulaires sur fond CLAIR (Contact)**
   - Utiliser classe `contact-form-input`
   - Texte: `#1f2937` (gris foncé)

2. **Formulaires sur fond SOMBRE (Virtual Room)**
   - Utiliser classe `input-premium`
   - Texte: `#ffffff` (blanc)

---

*Documentation Technique SALEM Ministry - Version 4.0*
