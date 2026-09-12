// ============================================
// SALEM Ministry - Firebase Configuration
// Version 3.0 - Conforme au MD
// ============================================

import { initializeApp as initFirebaseApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { upload } from '@vercel/blob/client';

// ============================================
// CONFIGURATION FIREBASE
// ============================================

const firebaseConfig = {
  apiKey: "AIzaSyBs1v8zLJpAk9Lfsj64E7y3HDR9xPcA4z0",
  authDomain: "salem-ministry-cm.firebaseapp.com",
  projectId: "salem-ministry-cm",
  storageBucket: "salem-ministry-cm.firebasestorage.app",
  messagingSenderId: "597183568975",
  appId: "1:597183568975:web:73e557fb931d0c0dafde3a"
};

const app = initFirebaseApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// ============================================
// RPSD — Upload via Vercel Blob (api/rpsd-upload.ts, api/rpsd-delete.ts)
// ============================================
// fix — replaces the old PHP/o2switch upload script: this site deploys on
// Vercel (like the rest of the SALEM web properties), which doesn't run
// PHP, so file storage moves to Vercel Blob — the same approach the main
// Salem School of Witnessing app already uses for its Podcasts/Radio
// uploads. The shared secret below must match the RPSD_API_KEY
// environment variable set on this Vercel project (set it there AND as
// VITE_RPSD_API_KEY, so Vite bakes the client-side copy into the build —
// see the README for exact steps).
const RPSD_API_KEY = import.meta.env.VITE_RPSD_API_KEY as string;
const RPSD_DELETE_URL = '/api/rpsd-delete';

// ============================================
// TYPES
// ============================================

export interface LiveSession {
  isLive: boolean;
  title: string;
  titleEn: string;
  startedAt: Timestamp | null;
  hostId: string;
}

export interface WherebyLinks {
  hostLink: string;       // Lien complet pour l'hôte (avec roomKey intégré)
  participantLink: string; // Lien complet pour les participants
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

// ============================================
// AUTHENTIFICATION ADMIN
// ============================================

/**
 * Connexion admin avec email et mot de passe
 */
export const adminLogin = async (email: string, password: string): Promise<{
  success: boolean;
  user?: User;
  error?: string;
}> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    console.error('Admin login error:', error);
    let errorMessage = 'Erreur de connexion';
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'Utilisateur non trouvé';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Mot de passe incorrect';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Email invalide';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Trop de tentatives. Réessayez plus tard.';
    }
    return { success: false, error: errorMessage };
  }
};

/**
 * Déconnexion admin
 */
export const adminLogout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Admin logout error:', error);
  }
};

/**
 * Obtenir l'admin actuellement connecté
 */
export const getCurrentAdmin = (): User | null => {
  return auth.currentUser;
};

const requireAdmin = (): User => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Non authentifié. Veuillez vous connecter en tant qu\'admin.');
  }
  return user;
};

/**
 * Observer les changements d'état d'authentification
 */
export const onAuthChange = (callback: (user: User | null) => void): (() => void) => {
  return onAuthStateChanged(auth, callback);
};

// ============================================
// GESTION DES SESSIONS LIVE
// ============================================

/**
 * Démarrer une session live
 */
export const startLiveSession = async (title: string, titleEn: string): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: 'Non authentifié' };
    }

    await setDoc(doc(db, 'config', 'liveSession'), {
      isLive: true,
      title,
      titleEn,
      startedAt: serverTimestamp(),
      hostId: user.uid
    });

    return { success: true };
  } catch (error: any) {
    console.error('Start session error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Arrêter la session live
 */
export const stopLiveSession = async (): Promise<boolean> => {
  try {
    // Sauvegarder la dernière session
    const sessionDoc = await getDoc(doc(db, 'config', 'liveSession'));
    if (sessionDoc.exists()) {
      await setDoc(doc(db, 'config', 'lastSession'), {
        ...sessionDoc.data(),
        endedAt: serverTimestamp()
      });
    }

    await setDoc(doc(db, 'config', 'liveSession'), {
      isLive: false,
      title: '',
      titleEn: '',
      startedAt: null,
      hostId: ''
    });

    return true;
  } catch (error) {
    console.error('Stop session error:', error);
    return false;
  }
};

/**
 * Obtenir l'état de la session
 */
export const getSessionStatus = async (): Promise<LiveSession | null> => {
  try {
    const docSnap = await getDoc(doc(db, 'config', 'liveSession'));
    if (docSnap.exists()) {
      return docSnap.data() as LiveSession;
    }
    return null;
  } catch (error) {
    console.error('Get session status error:', error);
    return null;
  }
};

/**
 * Écouter les changements de session en temps réel
 */
export const subscribeToSession = (callback: (session: LiveSession | null) => void): (() => void) => {
  return onSnapshot(
    doc(db, 'config', 'liveSession'),
    (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as LiveSession);
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error('Session subscription error:', error);
      callback(null);
    }
  );
};

// ============================================
// GESTION DE LA DERNIÈRE SESSION
// ============================================

export interface LastSession {
  title: string;
  titleEn: string;
  startedAt: Timestamp | null;
  endedAt: Timestamp | null;
  hostId: string;
}

/**
 * Obtenir la dernière session
 */
export const getLastSession = async (): Promise<LastSession | null> => {
  try {
    const docSnap = await getDoc(doc(db, 'config', 'lastSession'));
    if (docSnap.exists()) {
      return docSnap.data() as LastSession;
    }
    return null;
  } catch (error) {
    console.error('Get last session error:', error);
    return null;
  }
};

/**
 * Écouter les changements de la dernière session
 */
export const subscribeToLastSession = (callback: (session: LastSession | null) => void): (() => void) => {
  return onSnapshot(
    doc(db, 'config', 'lastSession'),
    (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as LastSession);
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error('Last session subscription error:', error);
      callback(null);
    }
  );
};

// ============================================
// GESTION DES LIENS WHEREBY
// ============================================

/**
 * Obtenir les liens Whereby
 */
export const getWherebyLinks = async (): Promise<WherebyLinks> => {
  // URLs par défaut du MD
  const defaultLinks: WherebyLinks = {
    hostLink: 'https://salemroommeet.whereby.com/ministry34349146-5b2d-49a5-a895-2da7e0c6cc21?roomKey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZWV0aW5nSWQiOiIxMjMxMjI1OTQiLCJyb29tUmVmZXJlbmNlIjp7InJvb21OYW1lIjoiL21pbmlzdHJ5MzQzNDkxNDYtNWIyZC00OWE1LWE4OTUtMmRhN2UwYzZjYzIxIiwib3JnYW5pemF0aW9uSWQiOiIzMzUyMjUifSwiaXNzIjoiaHR0cHM6Ly9hY2NvdW50cy5zcnYud2hlcmVieS5jb20iLCJpYXQiOjE3NzE3MTAwNDMsInJvb21LZXlUeXBlIjoibWVldGluZ0hvc3QifQ.suP3qGvl2bx7Ai4W1QhItqWa5onEy-0fF4Jy3kDWBWk',
    participantLink: 'https://salemroommeet.whereby.com/ministry34349146-5b2d-49a5-a895-2da7e0c6cc21'
  };

  try {
    const docSnap = await getDoc(doc(db, 'config', 'wherebyLinks'));
    if (docSnap.exists()) {
      const data = docSnap.data() as WherebyLinks;
      // Vérifier que les liens sont présents
      if (data.hostLink && data.participantLink) {
        return data;
      }
    }
    return defaultLinks;
  } catch (error) {
    console.error('Get Whereby links error:', error);
    return defaultLinks;
  }
};

/**
 * Sauvegarder les liens Whereby (Admin only)
 * IMPORTANT: L'admin doit être authentifié via Firebase Auth
 * Les liens sont synchronisés en temps réel vers tous les clients
 */
export const saveWherebyLinks = async (links: { hostLink: string; participantLink: string }): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    // Vérifier que l'admin est authentifié
    const user = auth.currentUser;
    if (!user) {
      console.error('❌ saveWherebyLinks: User not authenticated');
      return { success: false, error: 'Non authentifié - Veuillez vous connecter en tant qu\'admin' };
    }

    console.log('💾 Saving Whereby links to Firebase...');
    console.log('   - hostLink:', links.hostLink?.substring(0, 60) + '...');
    console.log('   - participantLink:', links.participantLink);
    console.log('   - User:', user.email);

    // Sauvegarder dans Firestore
    await setDoc(doc(db, 'config', 'wherebyLinks'), {
      hostLink: links.hostLink,
      participantLink: links.participantLink,
      updatedAt: serverTimestamp()
    });

    console.log('✅ Whereby links saved successfully to Firebase!');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Save Whereby links error:', error);
    console.error('   Error code:', error.code);
    console.error('   Error message:', error.message);
    
    // Messages d'erreur plus descriptifs
    let errorMessage = error.message;
    if (error.code === 'permission-denied') {
      errorMessage = 'Permission refusée - Vérifiez les règles Firestore et l\'authentification admin';
    } else if (error.code === 'unavailable') {
      errorMessage = 'Service Firebase non disponible - Vérifiez votre connexion internet';
    }
    
    return { success: false, error: errorMessage };
  }
};

/**
 * Écouter les changements des liens Whereby
 * S'abonne aux mises à jour en temps réel depuis Firebase
 * Callback appelé à chaque changement avec les nouveaux liens
 */
export const subscribeToWherebyLinks = (callback: (links: WherebyLinks) => void): (() => void) => {
  console.log('🔔 Subscribing to Whereby links updates...');
  
  return onSnapshot(
    doc(db, 'config', 'wherebyLinks'),
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as WherebyLinks;
        console.log('📥 Whereby links received from Firebase:');
        console.log('   - hostLink:', data.hostLink?.substring(0, 60) + '...');
        console.log('   - participantLink:', data.participantLink);
        callback(data);
      } else {
        console.log('⚠️ No Whereby links document in Firebase, using defaults');
        // Retourner les valeurs par défaut si le document n'existe pas
        const defaultLinks: WherebyLinks = {
          hostLink: 'https://salemroommeet.whereby.com/ministry34349146-5b2d-49a5-a895-2da7e0c6cc21?roomKey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZWV0aW5nSWQiOiIxMjMxMjI1OTQiLCJyb29tUmVmZXJlbmNlIjp7InJvb21OYW1lIjoiL21pbmlzdHJ5MzQzNDkxNDYtNWIyZC00OWE1LWE4OTUtMmRhN2UwYzZjYzIxIiwib3JnYW5pemF0aW9uSWQiOiIzMzUyMjUifSwiaXNzIjoiaHR0cHM6Ly9hY2NvdW50cy5zcnYud2hlcmVieS5jb20iLCJpYXQiOjE3NzE3MTAwNDMsInJvb21LZXlUeXBlIjoibWVldGluZ0hvc3QifQ.suP3qGvl2bx7Ai4W1QhItqWa5onEy-0fF4Jy3kDWBWk',
          participantLink: 'https://salemroommeet.whereby.com/ministry34349146-5b2d-49a5-a895-2da7e0c6cc21'
        };
        callback(defaultLinks);
      }
    },
    (error) => {
      console.error('❌ Whereby links subscription error:', error);
      // En cas d'erreur, retourner les valeurs par défaut
      const defaultLinks: WherebyLinks = {
        hostLink: 'https://salemroommeet.whereby.com/ministry34349146-5b2d-49a5-a895-2da7e0c6cc21?roomKey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZWV0aW5nSWQiOiIxMjMxMjI1OTQiLCJyb29tUmVmZXJlbmNlIjp7InJvb21OYW1lIjoiL21pbmlzdHJ5MzQzNDkxNDYtNWIyZC00OWE1LWE4OTUtMmRhN2UwYzZjYzIxIiwib3JnYW5pemF0aW9uSWQiOiIzMzUyMjUifSwiaXNzIjoiaHR0cHM6Ly9hY2NvdW50cy5zcnYud2hlcmVieS5jb20iLCJpYXQiOjE3NzE3MTAwNDMsInJvb21LZXlUeXBlIjoibWVldGluZ0hvc3QifQ.suP3qGvl2bx7Ai4W1QhItqWa5onEy-0fF4Jy3kDWBWk',
        participantLink: 'https://salemroommeet.whereby.com/ministry34349146-5b2d-49a5-a895-2da7e0c6cc21'
      };
      callback(defaultLinks);
    }
  );
};

// ============================================
// GESTION DES PARTICIPANTS
// ============================================

/**
 * Vérifier si un participant existe déjà (doublon)
 */
export const checkDuplicateParticipant = async (phone: string, countryCode: string): Promise<{
  isDuplicate: boolean;
  existingUser?: SessionUser;
}> => {
  try {
    const fullPhone = `${countryCode} ${phone}`;
    const q = query(
      collection(db, 'participants'),
      where('phone', '==', fullPhone)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        isDuplicate: true,
        existingUser: { id: doc.id, ...doc.data() } as SessionUser
      };
    }
    
    return { isDuplicate: false };
  } catch (error) {
    console.error('Check duplicate error:', error);
    return { isDuplicate: false };
  }
};

/**
 * Ajouter un nouveau participant
 */
export const addParticipant = async (user: Omit<SessionUser, 'id' | 'createdAt'>): Promise<{
  success: boolean;
  user?: SessionUser;
  error?: string;
  duplicate?: boolean;
}> => {
  try {
    // Vérifier les doublons
    const phoneNumber = user.phone.replace(user.countryCode, '').trim();
    const { isDuplicate, existingUser } = await checkDuplicateParticipant(phoneNumber, user.countryCode);
    
    if (isDuplicate && existingUser) {
      return { 
        success: false, 
        error: 'Ce numéro est déjà inscrit', 
        duplicate: true,
        user: existingUser
      };
    }

    const docRef = await addDoc(collection(db, 'participants'), {
      ...user,
      createdAt: serverTimestamp()
    });

    const newUser: SessionUser = {
      id: docRef.id,
      ...user,
      createdAt: Timestamp.now()
    };

    return { success: true, user: newUser };
  } catch (error: any) {
    console.error('Add participant error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Connexion d'un participant existant
 */
export const loginParticipant = async (nameOrPhone: string): Promise<SessionUser | null> => {
  try {
    // Chercher par nom
    let q = query(
      collection(db, 'participants'),
      where('name', '==', nameOrPhone)
    );
    let querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as SessionUser;
    }

    // Chercher par téléphone (avec différents formats)
    const participants = await getDocs(collection(db, 'participants'));
    for (const doc of participants.docs) {
      const data = doc.data();
      if (data.phone && data.phone.includes(nameOrPhone.replace(/\s/g, ''))) {
        return { id: doc.id, ...data } as SessionUser;
      }
    }

    return null;
  } catch (error) {
    console.error('Login participant error:', error);
    return null;
  }
};

/**
 * Obtenir tous les participants
 */
export const getParticipants = async (): Promise<SessionUser[]> => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, 'participants'), orderBy('createdAt', 'desc'))
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SessionUser[];
  } catch (error) {
    console.error('Get participants error:', error);
    return [];
  }
};

/**
 * Écouter les changements des participants
 */
export const subscribeToParticipants = (callback: (users: SessionUser[]) => void): (() => void) => {
  return onSnapshot(
    query(collection(db, 'participants'), orderBy('createdAt', 'desc')),
    (querySnapshot) => {
      const users = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SessionUser[];
      callback(users);
    },
    (error) => {
      console.error('Participants subscription error:', error);
      callback([]);
    }
  );
};

/**
 * Supprimer un participant (Admin only)
 */
export const deleteParticipant = async (userId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'participants', userId));
    return true;
  } catch (error) {
    console.error('Delete participant error:', error);
    return false;
  }
};

/**
 * Exporter tous les participants
 */
export const exportParticipants = async (): Promise<{
  exportDate: string;
  totalUsers: number;
  users: SessionUser[];
}> => {
  const users = await getParticipants();
  return {
    exportDate: new Date().toISOString(),
    totalUsers: users.length,
    users
  };
};

/**
 * Importer des participants
 */
export const importParticipants = async (users: Omit<SessionUser, 'id' | 'createdAt'>[]): Promise<{
  success: number;
  failed: number;
}> => {
  let success = 0;
  let failed = 0;

  for (const user of users) {
    const result = await addParticipant(user);
    if (result.success) {
      success++;
    } else {
      failed++;
    }
  }

  return { success, failed };
};

// ============================================
// GESTION DES SESSIONS PROGRAMMÉES
// ============================================

/**
 * Obtenir les sessions programmées
 */
export const getScheduledSessions = async (): Promise<ScheduledSession[]> => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, 'scheduledSessions'), where('isActive', '==', true))
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ScheduledSession[];
  } catch (error) {
    console.error('Get scheduled sessions error:', error);
    // Retourner les sessions par défaut
    return getDefaultSessions();
  }
};

/**
 * Sessions par défaut
 */
export const getDefaultSessions = (): ScheduledSession[] => [
  {
    id: '1',
    title: 'Prière du Matin',
    titleEn: 'Morning Prayer',
    day: 'Lundi - Vendredi',
    dayEn: 'Monday - Friday',
    time: '06:00',
    host: 'Père Salem',
    isActive: true
  },
  {
    id: '2',
    title: 'Angélus & Méditation',
    titleEn: 'Angelus & Meditation',
    day: 'Lundi - Vendredi',
    dayEn: 'Monday - Friday',
    time: '12:00',
    host: 'Équipe Pastorale',
    isActive: true
  },
  {
    id: '3',
    title: 'Veillée de Prière',
    titleEn: 'Prayer Vigil',
    day: 'Vendredi',
    dayEn: 'Friday',
    time: '21:00',
    host: 'Père Salem',
    isActive: true
  }
];

/**
 * Écouter les sessions programmées
 */
export const subscribeToScheduledSessions = (callback: (sessions: ScheduledSession[]) => void): (() => void) => {
  return onSnapshot(
    query(collection(db, 'scheduledSessions'), where('isActive', '==', true)),
    (querySnapshot) => {
      if (querySnapshot.empty) {
        callback(getDefaultSessions());
      } else {
        const sessions = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ScheduledSession[];
        callback(sessions);
      }
    },
    (error) => {
      console.error('Scheduled sessions subscription error:', error);
      callback(getDefaultSessions());
    }
  );
};

/**
 * Sauvegarder une session programmée (Admin only)
 */
export const saveScheduledSession = async (session: ScheduledSession): Promise<{
  success: boolean;
  id?: string;
  error?: string;
}> => {
  try {
    if (session.id) {
      await setDoc(doc(db, 'scheduledSessions', session.id), session);
      return { success: true, id: session.id };
    } else {
      const docRef = await addDoc(collection(db, 'scheduledSessions'), session);
      return { success: true, id: docRef.id };
    }
  } catch (error: any) {
    console.error('Save scheduled session error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Supprimer une session programmée (Admin only)
 */
export const deleteScheduledSession = async (sessionId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'scheduledSessions', sessionId));
    return true;
  } catch (error) {
    console.error('Delete scheduled session error:', error);
    return false;
  }
};

/**
 * Initialiser les sessions par défaut
 */
export const initializeDefaultSessions = async (): Promise<void> => {
  try {
    const sessions = getDefaultSessions();
    for (const session of sessions) {
      await setDoc(doc(db, 'scheduledSessions', session.id!), session);
    }
  } catch (error) {
    console.error('Initialize default sessions error:', error);
  }
};

// ============================================
// GESTION DES INTENTIONS DE PRIÈRE
// ============================================

/**
 * Envoyer une intention de prière
 */
export const sendPrayerIntention = async (intention: {
  participantId: string;
  participantName: string;
  participantPhone: string;
  participantCountry: string;
  intention: string;
  isAnonymous: boolean;
}): Promise<{ success: boolean; error?: string }> => {
  try {
    await addDoc(collection(db, 'prayerIntentions'), {
      ...intention,
      participantName: intention.isAnonymous ? 'Anonyme' : intention.participantName,
      status: 'pending',
      createdAt: serverTimestamp()
    });
    return { success: true };
  } catch (error: any) {
    console.error('Send prayer intention error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Obtenir les intentions de prière (Admin only)
 */
export const getPrayerIntentions = async (): Promise<PrayerIntention[]> => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, 'prayerIntentions'), orderBy('createdAt', 'desc'))
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as PrayerIntention[];
  } catch (error) {
    console.error('Get prayer intentions error:', error);
    return [];
  }
};

/**
 * Écouter les intentions de prière (Admin only)
 */
export const subscribeToPrayerIntentions = (callback: (intentions: PrayerIntention[]) => void): (() => void) => {
  return onSnapshot(
    query(collection(db, 'prayerIntentions'), orderBy('createdAt', 'desc')),
    (querySnapshot) => {
      const intentions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PrayerIntention[];
      callback(intentions);
    },
    (error) => {
      console.error('Prayer intentions subscription error:', error);
      callback([]);
    }
  );
};

/**
 * Mettre à jour le statut d'une intention (Admin only)
 */
export const updatePrayerIntentionStatus = async (
  intentionId: string,
  status: 'pending' | 'prayed' | 'answered'
): Promise<boolean> => {
  try {
    const updateData: any = { status };
    
    if (status === 'prayed') {
      updateData.prayedAt = serverTimestamp();
    } else if (status === 'answered') {
      updateData.answeredAt = serverTimestamp();
    }

    await updateDoc(doc(db, 'prayerIntentions', intentionId), updateData);
    return true;
  } catch (error) {
    console.error('Update prayer intention status error:', error);
    return false;
  }
};

/**
 * Supprimer une intention de prière (Admin only)
 */
export const deletePrayerIntention = async (intentionId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'prayerIntentions', intentionId));
    return true;
  } catch (error) {
    console.error('Delete prayer intention error:', error);
    return false;
  }
};

// ============================================
// GESTION DES ABONNÉS AUX NOTIFICATIONS
// ============================================

/**
 * Ajouter un abonné aux notifications
 */
export const addNotificationSubscriber = async (subscriber: {
  participantId: string;
  participantName: string;
  token: string;
}): Promise<{ success: boolean; error?: string }> => {
  try {
    await addDoc(collection(db, 'notificationSubscribers'), {
      ...subscriber,
      createdAt: serverTimestamp()
    });
    return { success: true };
  } catch (error: any) {
    console.error('Add notification subscriber error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Obtenir les abonnés aux notifications (Admin only)
 */
export const getNotificationSubscribers = async (): Promise<NotificationSubscriber[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'notificationSubscribers'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as NotificationSubscriber[];
  } catch (error) {
    console.error('Get notification subscribers error:', error);
    return [];
  }
};

/**
 * Supprimer un abonné aux notifications (Admin only)
 */
export const deleteNotificationSubscriber = async (subscriberId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'notificationSubscribers', subscriberId));
    return true;
  } catch (error) {
    console.error('Delete notification subscriber error:', error);
    return false;
  }
};

// ============================================
// DIAGNOSTIC FIREBASE
// ============================================

/**
 * Vérifier la connexion Firebase
 */
export const checkFirebaseConnection = async (): Promise<{
  connected: boolean;
  firestore: boolean;
  auth: boolean;
  error?: string;
}> => {
  try {
    // Test Firestore
    await getDoc(doc(db, 'config', 'app'));
    const firestoreOk = true;

    // Test Auth
    const authOk = auth !== null;

    return {
      connected: firestoreOk && authOk,
      firestore: firestoreOk,
      auth: authOk
    };
  } catch (error: any) {
    console.error('Firebase connection check error:', error);
    return {
      connected: false,
      firestore: false,
      auth: false,
      error: error.message
    };
  }
};

/**
 * Tester l'écriture Firestore
 */
export const testFirestoreWrite = async (): Promise<boolean> => {
  try {
    await setDoc(doc(db, 'config', 'test'), {
      test: true,
      timestamp: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Firestore write test error:', error);
    return false;
  }
};

/**
 * Initialiser l'application (création du document app si inexistant)
 */
export const initializeApp = async (): Promise<void> => {
  try {
    const appDoc = await getDoc(doc(db, 'config', 'app'));
    if (!appDoc.exists()) {
      await setDoc(doc(db, 'config', 'app'), {
        name: 'SALEM Ministry',
        initialized: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Initialize app error:', error);
  }
};

// ============================================
// CONSTRUCTION DES URLs WHEREBY
// ============================================

/**
 * Construire l'URL participant Whereby
 * Ajoute les paramètres d'embed au lien participant fourni par Whereby
 */
export const getParticipantWherebyUrl = (userName: string, participantLink: string): string => {
  if (!participantLink) return '';
  
  const encodedName = encodeURIComponent(userName);
  // Ajouter les paramètres d'embed
  const separator = participantLink.includes('?') ? '&' : '?';
  return `${participantLink}${separator}embed&displayName=${encodedName}&chat=on&people=on&leaveButton=off&screenshare=off&video=on&audio=on`;
};

/**
 * Construire l'URL hôte Whereby
 * Utilise le lien hôte complet fourni par Whereby (qui contient déjà le roomKey)
 * 
 * IMPORTANT: Le lien hôte doit être copié directement depuis Whereby
 * avec le roomKey déjà inclus. Cela donne les droits de modération:
 * - Peut muter/démuter les participants
 * - Peut activer/désactiver la caméra des participants  
 * - Peut expulser des participants
 * - Peut partager son écran
 */
export const getHostWherebyUrl = (hostLink: string): string => {
  if (!hostLink) return '';

  const encodedName = encodeURIComponent('Père Salem (Hôte)');
  // Ajouter les paramètres d'embed au lien hôte
  const separator = hostLink.includes('?') ? '&' : '?';
  return `${hostLink}${separator}embed&displayName=${encodedName}&chat=on&people=on&screenshare=on&video=on&audio=on&bottomToolbar=on`;
};

// ============================================
// RPSD — RHEMA POUR LA SEMAINE DEVOTIONNEL
// ============================================

export interface RPSDWeek {
  id: string;
  weekNumber: number;
  year: number;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  coverImageUrl: string | null;
  mondayFileUrl: string | null;
  mondayPosterUrl: string | null;
  weekendFileUrl: string | null;
  weekendPosterUrl: string | null;
  isPublished: boolean;
  publishedAt: Timestamp | null;
  createdAt: Timestamp;
}

/** Upload a file to Vercel Blob storage and return the public URL */
export const uploadRPSDFile = async (
  weekId: string,
  fileName: string,
  file: File
): Promise<string> => {
  const blob = await upload(`rpsd/${weekId}/${fileName}`, file, {
    access: 'public',
    handleUploadUrl: '/api/rpsd-upload',
    clientPayload: JSON.stringify({ apiKey: RPSD_API_KEY }),
    contentType: file.type,
  });
  return blob.url;
};

/** Delete a file from Vercel Blob storage (best-effort, ignores errors) */
const deleteRPSDFile = async (url: string): Promise<void> => {
  try {
    await fetch(RPSD_DELETE_URL, {
      method: 'DELETE',
      headers: {
        'X-Api-Key': RPSD_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });
  } catch {
    // Ignore — fichier peut déjà être supprimé
  }
};

/** Fetch all RPSD weeks ordered by year + weekNumber descending */
export const getRPSDWeeks = async (): Promise<RPSDWeek[]> => {
  try {
    const snapshot = await getDocs(collection(db, 'rpsd_weeks'));
    return snapshot.docs
      .map(d => ({ id: d.id, ...d.data() } as RPSDWeek))
      .sort((a, b) => b.year - a.year || b.weekNumber - a.weekNumber);
  } catch (error) {
    console.error('getRPSDWeeks error:', error);
    return [];
  }
};

/** Real-time listener for RPSD weeks */
export const subscribeToRPSDWeeks = (
  callback: (weeks: RPSDWeek[]) => void
): (() => void) => {
  return onSnapshot(
    collection(db, 'rpsd_weeks'),
    snapshot => {
      const weeks = snapshot.docs
        .map(d => ({ id: d.id, ...d.data() } as RPSDWeek))
        .sort((a, b) => b.year - a.year || b.weekNumber - a.weekNumber);
      callback(weeks);
    },
    error => {
      console.error('subscribeToRPSDWeeks error:', error);
      callback([]);
    }
  );
};

/** Create a new RPSD week */
export const addRPSDWeek = async (
  data: Omit<RPSDWeek, 'id' | 'createdAt' | 'publishedAt'>,
  files: {
    coverImage?: File;
    mondayFile?: File;
    mondayPoster?: File;
    weekendFile?: File;
    weekendPoster?: File;
  }
): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    requireAdmin();
    const docRef = await addDoc(collection(db, 'rpsd_weeks'), {
      ...data,
      coverImageUrl: null,
      mondayFileUrl: null,
      mondayPosterUrl: null,
      weekendFileUrl: null,
      weekendPosterUrl: null,
      createdAt: serverTimestamp(),
      publishedAt: data.isPublished ? serverTimestamp() : null,
    });
    const weekId = docRef.id;
    const updates: Partial<RPSDWeek> = {};

    if (files.coverImage)
      updates.coverImageUrl = await uploadRPSDFile(weekId, 'cover_image', files.coverImage);
    if (files.mondayFile)
      updates.mondayFileUrl = await uploadRPSDFile(weekId, 'monday_devotional.pdf', files.mondayFile);
    if (files.mondayPoster)
      updates.mondayPosterUrl = await uploadRPSDFile(weekId, 'monday_poster', files.mondayPoster);
    if (files.weekendFile)
      updates.weekendFileUrl = await uploadRPSDFile(weekId, 'weekend_reflection.pdf', files.weekendFile);
    if (files.weekendPoster)
      updates.weekendPosterUrl = await uploadRPSDFile(weekId, 'weekend_poster', files.weekendPoster);

    if (Object.keys(updates).length > 0)
      await updateDoc(docRef, updates);

    return { success: true, id: weekId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

/** Update an existing RPSD week (metadata only, no file re-upload) */
export const updateRPSDWeek = async (
  id: string,
  data: Partial<Omit<RPSDWeek, 'id' | 'createdAt'>>
): Promise<{ success: boolean; error?: string }> => {
  try {
    requireAdmin();
    const payload: any = { ...data };
    if (data.isPublished && !data.publishedAt)
      payload.publishedAt = serverTimestamp();
    await updateDoc(doc(db, 'rpsd_weeks', id), payload);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

/** Delete a RPSD week and its Storage files */
export const deleteRPSDWeek = async (
  week: RPSDWeek
): Promise<{ success: boolean; error?: string }> => {
  try {
    requireAdmin();
    if (week.coverImageUrl) await deleteRPSDFile(week.coverImageUrl);
    if (week.mondayFileUrl) await deleteRPSDFile(week.mondayFileUrl);
    if (week.mondayPosterUrl) await deleteRPSDFile(week.mondayPosterUrl);
    if (week.weekendFileUrl) await deleteRPSDFile(week.weekendFileUrl);
    if (week.weekendPosterUrl) await deleteRPSDFile(week.weekendPosterUrl);
    await deleteDoc(doc(db, 'rpsd_weeks', week.id));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
