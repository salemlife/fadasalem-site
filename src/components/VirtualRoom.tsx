import React, { useState, useEffect, useMemo } from 'react';
import {
  Video,
  VideoOff,
  Users,
  Clock,
  MessageCircle,
  Heart,
  Settings,
  X,
  Play,
  Square,
  LogIn,
  UserPlus,
  Send,
  CheckCircle,
  AlertCircle,
  Wifi,
  WifiOff,
  Calendar,
  Trash2,
  Edit,
  Download,
  Upload,
  Search,
  RefreshCw,
  Shield,
  Database,
  Save,
  Lock
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  auth,
  subscribeToSession,
  subscribeToLastSession,
  subscribeToWherebyLinks,
  subscribeToParticipants,
  subscribeToScheduledSessions,
  subscribeToPrayerIntentions,
  startLiveSession,
  stopLiveSession,
  addParticipant,
  loginParticipant,
  checkDuplicateParticipant,
  deleteParticipant,
  exportParticipants,
  importParticipants,
  saveScheduledSession,
  deleteScheduledSession,
  sendPrayerIntention,
  updatePrayerIntentionStatus,
  deletePrayerIntention,
  saveWherebyLinks,
  adminLogin,
  adminLogout,
  checkFirebaseConnection,
  testFirestoreWrite,
  getParticipantWherebyUrl,
  getHostWherebyUrl,
  LiveSession,
  LastSession,
  WherebyLinks,
  SessionUser,
  ScheduledSession,
  PrayerIntention
} from '../firebase';

// Types
interface CountryCode {
  code: string;
  flag: string;
  nameFr: string;
  nameEn: string;
}

interface CountryOption {
  value: string;
  fr: string;
  en: string;
}

const countryCodes: CountryCode[] = [
  { code: '+237', flag: '🇨🇲', nameFr: 'Cameroun', nameEn: 'Cameroon' },
  { code: '+33', flag: '🇫🇷', nameFr: 'France', nameEn: 'France' },
  { code: '+39', flag: '🇮🇹', nameFr: 'Italie', nameEn: 'Italy' },
  { code: '+1', flag: '🇺🇸', nameFr: 'USA/Canada', nameEn: 'USA/Canada' },
  { code: '+44', flag: '🇬🇧', nameFr: 'UK', nameEn: 'UK' },
  { code: '+49', flag: '🇩🇪', nameFr: 'Allemagne', nameEn: 'Germany' },
  { code: '+32', flag: '🇧🇪', nameFr: 'Belgique', nameEn: 'Belgium' },
  { code: '+41', flag: '🇨🇭', nameFr: 'Suisse', nameEn: 'Switzerland' },
  { code: '+234', flag: '🇳🇬', nameFr: 'Nigeria', nameEn: 'Nigeria' },
  { code: '+225', flag: '🇨🇮', nameFr: "Côte d'Ivoire", nameEn: 'Ivory Coast' },
  { code: '+221', flag: '🇸🇳', nameFr: 'Sénégal', nameEn: 'Senegal' },
  { code: '+27', flag: '🇿🇦', nameFr: 'Afrique du Sud', nameEn: 'South Africa' }
];

const countryOptions: CountryOption[] = [
  { value: 'Cameroun', fr: 'Cameroun', en: 'Cameroon' },
  { value: 'France', fr: 'France', en: 'France' },
  { value: 'Italie', fr: 'Italie', en: 'Italy' },
  { value: 'USA', fr: 'USA', en: 'USA' },
  { value: 'Canada', fr: 'Canada', en: 'Canada' },
  { value: 'UK', fr: 'UK', en: 'UK' },
  { value: 'Allemagne', fr: 'Allemagne', en: 'Germany' },
  { value: 'Belgique', fr: 'Belgique', en: 'Belgium' },
  { value: 'Suisse', fr: 'Suisse', en: 'Switzerland' },
  { value: 'Nigeria', fr: 'Nigeria', en: 'Nigeria' },
  { value: "Côte d'Ivoire", fr: "Côte d'Ivoire", en: 'Ivory Coast' },
  { value: 'Sénégal', fr: 'Sénégal', en: 'Senegal' },
  { value: 'Afrique du Sud', fr: 'Afrique du Sud', en: 'South Africa' },
  { value: 'Autre', fr: 'Autre', en: 'Other' },
];

const VirtualRoom: React.FC = () => {
  const { language } = useLanguage();

  // États principaux
  const [isLive, setIsLive] = useState(false);
  const [liveSession, setLiveSession] = useState<LiveSession | null>(null);
  const [lastSession, setLastSession] = useState<LastSession | null>(null);
  // Initialiser avec les valeurs par défaut du MD
  // hostLink = lien complet avec roomKey pour l'hôte (droits de modération)
  // participantLink = lien simple pour les participants
  const [wherebyLinks, setWherebyLinks] = useState<WherebyLinks>({
    hostLink: 'https://salemroommeet.whereby.com/ministry34349146-5b2d-49a5-a895-2da7e0c6cc21?roomKey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZWV0aW5nSWQiOiIxMjMxMjI1OTQiLCJyb29tUmVmZXJlbmNlIjp7InJvb21OYW1lIjoiL21pbmlzdHJ5MzQzNDkxNDYtNWIyZC00OWE1LWE4OTUtMmRhN2UwYzZjYzIxIiwib3JnYW5pemF0aW9uSWQiOiIzMzUyMjUifSwiaXNzIjoiaHR0cHM6Ly9hY2NvdW50cy5zcnYud2hlcmVieS5jb20iLCJpYXQiOjE3NzE3MTAwNDMsInJvb21LZXlUeXBlIjoibWVldGluZ0hvc3QifQ.suP3qGvl2bx7Ai4W1QhItqWa5onEy-0fF4Jy3kDWBWk',
    participantLink: 'https://salemroommeet.whereby.com/ministry34349146-5b2d-49a5-a895-2da7e0c6cc21'
  });
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  // IMPORTANT: isAdmin est false par défaut et ne devient true que via adminLogin explicite
  // Cela empêche les sessions Firebase persistantes de donner accès admin automatiquement
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);

  // Données Firebase
  const [participants, setParticipants] = useState<SessionUser[]>([]);
  const [sessions, setSessions] = useState<ScheduledSession[]>([]);
  const [intentions, setIntentions] = useState<PrayerIntention[]>([]);

  // Modals
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showIntentionModal, setShowIntentionModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // Admin tabs
  const [adminTab, setAdminTab] = useState<'dashboard' | 'sessions' | 'intentions' | 'users' | 'settings'>('dashboard');

  // Formulaires
  const [loginInput, setLoginInput] = useState('');
  const [registerForm, setRegisterForm] = useState({
    name: '',
    countryCode: '+237',
    phone: '',
    country: 'Cameroun',
    email: ''
  });
  const [intentionForm, setIntentionForm] = useState({
    intention: '',
    isAnonymous: false
  });
  const [adminLoginForm, setAdminLoginForm] = useState({ email: '', password: '' });
  const [sessionTitle, setSessionTitle] = useState({ fr: '', en: '' });

  // Session edit
  const [editingSession, setEditingSession] = useState<ScheduledSession | null>(null);
  const [sessionForm, setSessionForm] = useState({
    title: '', titleEn: '', day: '', dayEn: '', time: '', host: '', isActive: true
  });

  // Settings - Initialiser avec les valeurs par défaut du MD
  // hostLink = lien complet Whereby pour l'hôte (avec roomKey)
  // participantLink = lien Whereby pour les participants
  const [wherebyForm, setWherebyForm] = useState({ 
    hostLink: 'https://salemroommeet.whereby.com/ministry34349146-5b2d-49a5-a895-2da7e0c6cc21?roomKey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZWV0aW5nSWQiOiIxMjMxMjI1OTQiLCJyb29tUmVmZXJlbmNlIjp7InJvb21OYW1lIjoiL21pbmlzdHJ5MzQzNDkxNDYtNWIyZC00OWE1LWE4OTUtMmRhN2UwYzZjYzIxIiwib3JnYW5pemF0aW9uSWQiOiIzMzUyMjUifSwiaXNzIjoiaHR0cHM6Ly9hY2NvdW50cy5zcnYud2hlcmVieS5jb20iLCJpYXQiOjE3NzE3MTAwNDMsInJvb21LZXlUeXBlIjoibWVldGluZ0hvc3QifQ.suP3qGvl2bx7Ai4W1QhItqWa5onEy-0fF4Jy3kDWBWk',
    participantLink: 'https://salemroommeet.whereby.com/ministry34349146-5b2d-49a5-a895-2da7e0c6cc21'
  });
  const [firebaseStatus, setFirebaseStatus] = useState({ connected: true, firestore: true, auth: true });

  // Filtres
  const [intentionFilter, setIntentionFilter] = useState<'all' | 'pending' | 'prayed' | 'answered'>('all');
  const [userSearch, setUserSearch] = useState('');

  // Loading states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Whereby iframe
  const [inRoom, setInRoom] = useState(false);

  // Subscriptions Firebase
  useEffect(() => {
    // Initialiser le statut Firebase au démarrage
    const initFirebase = async () => {
      try {
        const status = await checkFirebaseConnection();
        setFirebaseStatus(status);
      } catch (error) {
        console.error('Firebase init error:', error);
        setFirebaseStatus({ connected: false, firestore: false, auth: false });
      }
    };
    initFirebase();

    const unsubSession = subscribeToSession((session) => {
      setLiveSession(session);
      setIsLive(session?.isLive || false);
      // Firebase fonctionne si on reçoit des données
      setFirebaseStatus(prev => ({ ...prev, firestore: true, connected: true }));
    });

    const unsubWhereby = subscribeToWherebyLinks((links) => {
      if (links && links.hostLink && links.participantLink) {
        setWherebyLinks(links);
        setWherebyForm({ hostLink: links.hostLink, participantLink: links.participantLink });
      }
      // Si pas de liens dans Firebase, garder les valeurs par défaut du MD déjà initialisées
    });

    const unsubLastSession = subscribeToLastSession((session) => {
      setLastSession(session);
    });

    const unsubParticipants = subscribeToParticipants((users) => {
      setParticipants(users);
    });

    const unsubSessions = subscribeToScheduledSessions((sess) => {
      setSessions(sess);
    });

    const unsubIntentions = subscribeToPrayerIntentions((ints) => {
      setIntentions(ints);
    });

    // Auth state - On ne définit PAS automatiquement isAdmin ici
    // isAdmin ne devient true que via un login admin explicite dans cette session
    const unsubAuth = auth.onAuthStateChanged((user) => {
      setAdminUser(user);
      // NE PAS faire setIsAdmin(!!user) ici car cela permettrait à n'importe quel 
      // utilisateur avec une session Firebase persistante d'être admin
      // isAdmin est défini uniquement via handleAdminLogin
      
      // Mettre à jour le statut auth (pour l'affichage uniquement)
      setFirebaseStatus(prev => ({ ...prev, auth: !!user || prev.auth }));
    });

    // Check stored user
    const storedUser = localStorage.getItem('salem_virtual_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    return () => {
      unsubSession();
      unsubWhereby();
      unsubLastSession();
      unsubParticipants();
      unsubSessions();
      unsubIntentions();
      unsubAuth();
    };
  }, []);

  // Handlers
  const handleLogin = async () => {
    if (!loginInput.trim()) return;
    setLoading(true);
    setError('');

    const user = await loginParticipant(loginInput);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('salem_virtual_user', JSON.stringify(user));
      setShowLoginModal(false);
      setLoginInput('');
    } else {
      setError(language === 'fr' ? 'Utilisateur non trouvé' : 'User not found');
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    const { name, countryCode, phone, country } = registerForm;
    if (!name.trim() || !phone.trim()) {
      setError(language === 'fr' ? 'Nom et téléphone requis' : 'Name and phone required');
      return;
    }

    setLoading(true);
    setError('');

    const fullPhone = `${countryCode} ${phone}`;
    const result = await checkDuplicateParticipant(phone, countryCode);
    
    if (result.isDuplicate) {
      setError(language === 'fr' ? 'Ce numéro est déjà enregistré' : 'This number is already registered');
      setLoading(false);
      return;
    }

    const addResult = await addParticipant({
      name: name.trim(),
      phone: fullPhone,
      countryCode,
      country,
      email: registerForm.email || undefined
    });

    if (addResult.success && addResult.user) {
      setCurrentUser(addResult.user);
      localStorage.setItem('salem_virtual_user', JSON.stringify(addResult.user));
      setShowRegisterModal(false);
      setRegisterForm({ name: '', countryCode: '+237', phone: '', country: 'Cameroun', email: '' });
    } else {
      setError(addResult.error || 'Erreur');
    }
    setLoading(false);
  };

  const handleSendIntention = async () => {
    if (!currentUser || !intentionForm.intention.trim()) return;
    setLoading(true);

    const result = await sendPrayerIntention({
      participantId: currentUser.id!,
      participantName: intentionForm.isAnonymous ? 'Anonyme' : currentUser.name,
      participantPhone: currentUser.phone,
      participantCountry: currentUser.country,
      intention: intentionForm.intention,
      isAnonymous: intentionForm.isAnonymous
    });

    if (result.success) {
      setSuccess(language === 'fr' ? 'Intention envoyée avec succès!' : 'Intention sent successfully!');
      setShowIntentionModal(false);
      setIntentionForm({ intention: '', isAnonymous: false });
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(result.error || 'Erreur');
    }
    setLoading(false);
  };

  const handleAdminLogin = async () => {
    setLoading(true);
    setError('');

    const result = await adminLogin(adminLoginForm.email, adminLoginForm.password);
    if (result.success) {
      // IMPORTANT: Définir isAdmin à true SEULEMENT après un login admin réussi
      setIsAdmin(true);
      setShowAdminLogin(false);
      setShowAdminModal(true);
      setAdminLoginForm({ email: '', password: '' });
      console.log('Admin logged in successfully - isAdmin set to true');
    } else {
      setError(result.error || 'Erreur de connexion');
    }
    setLoading(false);
  };

  const handleStartSession = async () => {
    if (!sessionTitle.fr.trim()) {
      setError(language === 'fr' ? 'Titre requis' : 'Title required');
      return;
    }
    setLoading(true);
    
    // Vérifier que l'admin est bien authentifié
    if (!auth.currentUser) {
      setError(language === 'fr' ? 'Vous devez être connecté en tant qu\'admin' : 'You must be logged in as admin');
      setLoading(false);
      return;
    }
    
    const result = await startLiveSession(sessionTitle.fr, sessionTitle.en || sessionTitle.fr);
    if (result.success) {
      setSuccess(language === 'fr' ? 'Session démarrée en tant qu\'HÔTE!' : 'Session started as HOST!');
      
      // S'assurer que isAdmin est bien true (devrait déjà l'être)
      setIsAdmin(true);
      
      // Admin entre directement dans la salle Whereby en mode HÔTE
      // L'URL utilisée sera hostUrl avec roomKey (droits de modération)
      setInRoom(true);
      setShowAdminModal(false);
      
      console.log('Session started - Admin entering as HOST with roomKey');
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(result.error || (language === 'fr' ? 'Erreur lors du démarrage' : 'Error starting session'));
    }
    setLoading(false);
  };

  const handleStopSession = async () => {
    setLoading(true);
    await stopLiveSession();
    setInRoom(false);
    setLoading(false);
  };

  const handleJoinRoom = () => {
    setInRoom(true);
  };

  const handleLeaveRoom = () => {
    setInRoom(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setInRoom(false);
    localStorage.removeItem('salem_virtual_user');
  };

  // Admin functions
  const handleSaveSession = async () => {
    const session: ScheduledSession = {
      ...sessionForm,
      id: editingSession?.id
    };
    
    const result = await saveScheduledSession(session);
    if (result.success) {
      setEditingSession(null);
      setSessionForm({ title: '', titleEn: '', day: '', dayEn: '', time: '', host: '', isActive: true });
      setSuccess('Session sauvegardée!');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleDeleteSession = async (id: string) => {
    if (confirm('Supprimer cette session?')) {
      await deleteScheduledSession(id);
    }
  };

  const handleUpdateIntentionStatus = async (id: string, status: 'pending' | 'prayed' | 'answered') => {
    await updatePrayerIntentionStatus(id, status);
  };

  const handleDeleteIntention = async (id: string) => {
    if (confirm('Supprimer cette intention?')) {
      await deletePrayerIntention(id);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm('Supprimer cet utilisateur?')) {
      await deleteParticipant(id);
    }
  };

  const handleExportUsers = async () => {
    const data = await exportParticipants();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `salem_participants_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImportUsers = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        const users = data.users || data;
        const result = await importParticipants(users);
        setSuccess(`Importé: ${result.success} réussis, ${result.failed} échoués`);
        setTimeout(() => setSuccess(''), 3000);
      } catch {
        setError('Fichier invalide');
      }
    };
    reader.readAsText(file);
  };

  const handleSaveWherebyLinks = async () => {
    // Vérifier que l'admin est connecté
    if (!isAdmin || !auth.currentUser) {
      setError(language === 'fr' 
        ? '❌ Vous devez être connecté en tant qu\'admin' 
        : '❌ You must be logged in as admin');
      setTimeout(() => setError(''), 5000);
      return;
    }

    // Valider les liens
    if (!wherebyForm.hostLink.trim() || !wherebyForm.participantLink.trim()) {
      setError(language === 'fr' 
        ? '❌ Les deux liens sont requis' 
        : '❌ Both links are required');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setLoading(true);
    console.log('🔄 Saving Whereby links...');
    console.log('   Admin:', auth.currentUser?.email);
    console.log('   hostLink:', wherebyForm.hostLink.substring(0, 60) + '...');
    console.log('   participantLink:', wherebyForm.participantLink);

    const result = await saveWherebyLinks({
      hostLink: wherebyForm.hostLink,
      participantLink: wherebyForm.participantLink
    });

    if (result.success) {
      // Mise à jour immédiate de l'état local pour refléter les changements
      // (le subscribeToWherebyLinks mettra aussi à jour via Firebase)
      setWherebyLinks({
        hostLink: wherebyForm.hostLink,
        participantLink: wherebyForm.participantLink
      });
      
      setSuccess(language === 'fr' 
        ? '✅ Liens Whereby sauvegardés et synchronisés!' 
        : '✅ Whereby links saved and synced!');
      
      console.log('✅ Whereby links saved successfully!');
      
      setTimeout(() => setSuccess(''), 3000);
    } else {
      console.error('❌ Failed to save Whereby links:', result.error);
      setError(language === 'fr' 
        ? `❌ Erreur: ${result.error}` 
        : `❌ Error: ${result.error}`);
      setTimeout(() => setError(''), 5000);
    }
    setLoading(false);
  };

  const handleTestConnection = async () => {
    setLoading(true);
    try {
      const status = await checkFirebaseConnection();
      setFirebaseStatus({
        connected: status.connected,
        firestore: status.firestore,
        auth: status.auth || isAdmin
      });
      if (status.connected) {
        setSuccess(language === 'fr' ? '✅ Firebase connecté!' : '✅ Firebase connected!');
      } else {
        setError(language === 'fr' ? '❌ Connexion échouée' : '❌ Connection failed');
      }
    } catch (error) {
      setFirebaseStatus({ connected: false, firestore: false, auth: isAdmin });
      setError(language === 'fr' ? '❌ Erreur de connexion' : '❌ Connection error');
    }
    setLoading(false);
    setTimeout(() => { setSuccess(''); setError(''); }, 3000);
  };

  const handleTestWrite = async () => {
    const writeSuccess = await testFirestoreWrite();
    if (writeSuccess) {
      setSuccess('Écriture réussie!');
    } else {
      setError('Échec écriture');
    }
    setTimeout(() => { setSuccess(''); setError(''); }, 3000);
  };

  // Filtered data
  const filteredIntentions = intentions.filter(i => {
    if (intentionFilter === 'all') return true;
    return i.status === intentionFilter;
  });

  const filteredUsers = participants.filter(u => {
    if (!userSearch) return true;
    const search = userSearch.toLowerCase();
    return u.name.toLowerCase().includes(search) ||
           u.phone.includes(search) ||
           u.email?.toLowerCase().includes(search) ||
           u.country.toLowerCase().includes(search);
  });

  // Stats
  const intentionStats = {
    total: intentions.length,
    pending: intentions.filter(i => i.status === 'pending').length,
    prayed: intentions.filter(i => i.status === 'prayed').length,
    answered: intentions.filter(i => i.status === 'answered').length
  };

  // Whereby URLs - Synchronisées avec le Tableau de Bord via Firebase
  // useMemo garantit que les URLs sont recalculées quand wherebyLinks change
  
  // URL Participant - utilise le participantLink du TB
  const participantUrl = useMemo(() => {
    if (!currentUser) return '';
    console.log('🔄 Recalculating participant URL with participantLink:', wherebyLinks.participantLink);
    return getParticipantWherebyUrl(currentUser.name, wherebyLinks.participantLink);
  }, [currentUser, wherebyLinks.participantLink]);
  
  // URL Hôte - utilise hostLink du TB (qui contient déjà le roomKey pour les droits de modération)
  const hostUrl = useMemo(() => {
    console.log('🔄 Recalculating host URL with hostLink:', wherebyLinks.hostLink?.substring(0, 80) + '...');
    return getHostWherebyUrl(wherebyLinks.hostLink);
  }, [wherebyLinks.hostLink]);
  
  // Debug en développement - Affiche les URLs complètes pour vérification
  console.log('=== WHEREBY DEBUG ===');
  console.log('isAdmin:', isAdmin);
  console.log('inRoom:', inRoom);
  console.log('hostLink:', wherebyLinks.hostLink?.substring(0, 80) + '...');
  console.log('participantLink:', wherebyLinks.participantLink);
  if (isAdmin) {
    console.log('HOST URL (for admin):', hostUrl);
  } else if (currentUser) {
    console.log('PARTICIPANT URL:', participantUrl);
  }
  console.log('=====================');

  return (
    <div className="relative">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 z-0">
        <img 
          src="/images/IMG_2367.jpeg" 
          alt="" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-900/95" />
        {/* Spotlight Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(44,107,30,0.3),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_120%,rgba(212,168,38,0.2),transparent)]" />
        {/* Animated particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-salem-gold/30 rounded-full animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-white/20 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-salem-green/30 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-salem-gold/40 rounded-full animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-1/3 right-1/2 w-1.5 h-1.5 bg-white/15 rounded-full animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* Sub Header - Virtual Room */}
      <div className="bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-sm border-b border-white/10 relative z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Video className="w-6 h-6 text-salem-gold" />
            <h1 className="text-lg sm:text-xl font-bold text-white">
              {language === 'fr' ? 'Salle Virtuelle de Prière' : 'Virtual Prayer Room'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Status Badge */}
            {isLive ? (
              <span className="flex items-center gap-1.5 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                {language === 'fr' ? 'EN DIRECT' : 'LIVE'}
              </span>
            ) : (
              <span className="flex items-center gap-1.5 bg-gray-500 text-white px-3 py-1 rounded-full text-sm">
                <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                {language === 'fr' ? 'Hors ligne' : 'Offline'}
              </span>
            )}

            {/* Admin Button */}
            <button
              onClick={() => isAdmin ? setShowAdminModal(true) : setShowAdminLogin(true)}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Administration"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          {success}
        </div>
      )}
      {error && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
          <button onClick={() => setError('')} className="ml-2"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6 relative z-10">
        {/* Écran Principal */}
        <div className={`relative rounded-2xl overflow-hidden ${isLive ? 'ring-4 ring-green-500/50 animate-screen-glow' : 'ring-2 ring-white/30 shadow-2xl shadow-salem-gold/10'}`}>
          {/* Zone Whereby / Attente - Responsive height for ALL mobile screens */}
          <div className="aspect-[3/4] xs:aspect-[4/3] sm:aspect-video relative overflow-hidden min-h-[280px] xs:min-h-[300px] sm:min-h-[400px]">
            {inRoom && isLive ? (
              // Iframe Whereby - fond solide pour la vidéo
              // L'admin utilise hostUrl avec roomKey pour avoir les droits d'hôte
              // Les participants utilisent participantUrl sans roomKey
              <iframe
                src={isAdmin ? hostUrl : participantUrl}
                allow="camera; microphone; fullscreen; speaker; display-capture; autoplay"
                className="w-full h-full bg-black"
                title={isAdmin ? "Whereby Host Room" : "Whereby Participant Room"}
              />
            ) : (
              // Écran d'attente - Optimisé pour TOUS les écrans mobiles
              <div className="absolute inset-0 flex items-center justify-center p-2 xs:p-3 sm:p-4 md:p-6 bg-gradient-to-br from-slate-900/50 via-slate-800/40 to-slate-900/50 backdrop-blur-[1px]">
                {/* Conteneur principal - Parfaitement centré avec tailles adaptatives */}
                <div className="flex flex-col items-center justify-center text-center w-full max-w-[240px] xs:max-w-[260px] sm:max-w-xs md:max-w-sm mx-auto px-1">
                  {/* Logo - Taille adaptée aux très petits écrans */}
                  <div className="w-12 h-12 xs:w-14 xs:h-14 sm:w-20 sm:h-20 md:w-28 md:h-28 mb-1.5 xs:mb-2 sm:mb-3 flex-shrink-0">
                    <img
                      src="/images/logosalem.png"
                      alt="SALEM Ministry"
                      className="w-full h-full object-contain drop-shadow-2xl filter brightness-110"
                    />
                  </div>
                  {isLive ? (
                  // SESSION EN DIRECT - Participant peut se connecter ou s'inscrire
                  <>
                    <div className="flex items-center justify-center gap-1.5 xs:gap-2 mb-1.5 xs:mb-2 sm:mb-3">
                      <span className="w-1.5 h-1.5 xs:w-2 xs:h-2 sm:w-2.5 sm:h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                      <span className="text-green-400 font-semibold text-[10px] xs:text-xs sm:text-sm">
                        {language === 'fr' ? 'Session en cours' : 'Session in progress'}
                      </span>
                    </div>
                    <h2 className="text-white text-sm xs:text-base sm:text-lg md:text-xl font-bold mb-1 xs:mb-1.5 sm:mb-2 line-clamp-2 px-1">
                      {language === 'fr' ? liveSession?.title : liveSession?.titleEn}
                    </h2>
                    
                    {currentUser ? (
                      // Utilisateur connecté - peut rejoindre
                      <>
                        <p className="text-gray-400 mb-2 xs:mb-3 sm:mb-4 text-[10px] xs:text-xs sm:text-sm">
                          {language === 'fr' ? `Bienvenue ${currentUser.name}!` : `Welcome ${currentUser.name}!`}
                        </p>
                        <button
                          onClick={handleJoinRoom}
                          className="flex items-center justify-center gap-1.5 xs:gap-2 bg-green-600 hover:bg-green-700 text-white px-3 xs:px-4 sm:px-5 py-1.5 xs:py-2 sm:py-2.5 rounded-lg xs:rounded-xl font-semibold transition-all hover:scale-105 text-[10px] xs:text-xs sm:text-sm w-full"
                        >
                          <Video className="w-3 h-3 xs:w-4 xs:h-4" />
                          {language === 'fr' ? 'Rejoindre la salle' : 'Join room'}
                        </button>
                      </>
                    ) : (
                      // Non connecté - peut se connecter OU s'inscrire
                      <>
                        <p className="text-gray-400 mb-2 xs:mb-3 text-[10px] xs:text-xs sm:text-sm">
                          {language === 'fr' ? 'Connectez-vous pour rejoindre' : 'Login to join'}
                        </p>
                        <div className="flex flex-col gap-1.5 xs:gap-2 w-full">
                          <button
                            onClick={() => setShowLoginModal(true)}
                            className="flex items-center justify-center gap-1.5 xs:gap-2 bg-salem-green hover:bg-salem-green-light text-white px-3 xs:px-4 py-1.5 xs:py-2 sm:py-2.5 rounded-lg xs:rounded-xl font-semibold transition-all text-[10px] xs:text-xs sm:text-sm w-full"
                          >
                            <LogIn className="w-3 h-3 xs:w-4 xs:h-4" />
                            {language === 'fr' ? 'Se connecter' : 'Login'}
                          </button>
                          <button
                            onClick={() => setShowRegisterModal(true)}
                            className="flex items-center justify-center gap-1.5 xs:gap-2 bg-salem-gold hover:bg-salem-gold-light text-white px-3 xs:px-4 py-1.5 xs:py-2 sm:py-2.5 rounded-lg xs:rounded-xl font-semibold transition-all text-[10px] xs:text-xs sm:text-sm w-full"
                          >
                            <UserPlus className="w-3 h-3 xs:w-4 xs:h-4" />
                            {language === 'fr' ? "S'inscrire" : 'Register'}
                          </button>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  // HORS LIGNE - Inscription TOUJOURS disponible, connexion DÉSACTIVÉE
                  <>
                    <h2 className="text-gray-300 text-[11px] xs:text-xs sm:text-sm md:text-base font-medium mb-0.5 xs:mb-1">
                      {language === 'fr' ? 'Aucune session en cours' : 'No session in progress'}
                    </h2>
                    <p className="text-gray-500 text-[9px] xs:text-[10px] sm:text-xs mb-2 xs:mb-3 sm:mb-4">
                      {language === 'fr' 
                        ? 'Revenez aux heures de prière' 
                        : 'Come back at prayer times'}
                    </p>
                    
                    {currentUser ? (
                      // Utilisateur déjà inscrit - afficher son statut
                      <div className="space-y-1 xs:space-y-1.5 sm:space-y-2">
                        <div className="flex items-center justify-center gap-1.5 xs:gap-2 text-salem-gold">
                          <CheckCircle className="w-3 h-3 xs:w-4 xs:h-4" />
                          <span className="font-medium text-[10px] xs:text-xs sm:text-sm">
                            {language === 'fr' ? 'Vous êtes inscrit' : 'You are registered'}
                          </span>
                        </div>
                        <p className="text-white font-medium text-[11px] xs:text-xs sm:text-sm">{currentUser.name}</p>
                        <p className="text-gray-400 text-[9px] xs:text-[10px] sm:text-xs">{currentUser.phone}</p>
                        <p className="text-gray-500 text-[8px] xs:text-[9px] sm:text-[10px] leading-tight">
                          {language === 'fr' 
                            ? 'Vous pourrez rejoindre dès qu\'une session démarrera' 
                            : 'You can join as soon as a session starts'}
                        </p>
                      </div>
                    ) : (
                      // Non inscrit - peut s'inscrire mais pas se connecter
                      <div className="flex flex-col gap-1.5 xs:gap-2 w-full">
                        <button
                          onClick={() => setShowRegisterModal(true)}
                          className="flex items-center justify-center gap-1.5 xs:gap-2 bg-salem-gold hover:bg-salem-gold-light text-white px-3 xs:px-4 py-1.5 xs:py-2 sm:py-2.5 rounded-lg xs:rounded-xl font-semibold transition-all hover:scale-105 text-[10px] xs:text-xs sm:text-sm w-full"
                        >
                          <UserPlus className="w-3 h-3 xs:w-4 xs:h-4" />
                          {language === 'fr' ? "S'inscrire maintenant" : 'Register now'}
                        </button>
                        <p className="text-gray-500 text-[8px] xs:text-[9px] sm:text-[10px]">
                          {language === 'fr' 
                            ? "Inscrivez-vous pour les prochaines sessions" 
                            : 'Register for upcoming sessions'}
                        </p>
                        
                        {/* Bouton connexion désactivé */}
                        <button
                          disabled
                          className="flex items-center justify-center gap-1 xs:gap-1.5 bg-gray-700/50 text-gray-500 px-2 xs:px-3 py-1 xs:py-1.5 sm:py-2 rounded-lg xs:rounded-xl font-medium cursor-not-allowed text-[8px] xs:text-[10px] sm:text-xs w-full"
                          title={language === 'fr' ? 'Connexion disponible uniquement pendant les sessions' : 'Login available only during sessions'}
                        >
                          <Lock className="w-2.5 h-2.5 xs:w-3 xs:h-3" />
                          {language === 'fr' ? 'Connexion (session requise)' : 'Login (session required)'}
                        </button>
                      </div>
                    )}
                  </>
                )}
                </div>
              </div>
            )}
          </div>

          {/* Barre de Contrôle (SOUS l'écran) - Conforme au MD */}
          <div className="control-bar-glass px-2 sm:px-3 md:px-5 py-2 sm:py-3 md:py-4">
            {/* Layout principal */}
            <div className="flex items-center justify-between gap-2 sm:gap-3">
              {/* Section Gauche: Logo + Titre */}
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                {/* Logo sans halo */}
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex-shrink-0">
                  <img
                    src="/images/logosalem.png"
                    alt="SALEM"
                    className="w-full h-full object-contain drop-shadow-lg filter brightness-110"
                  />
                </div>
                
                {/* Titre de la session (affiché quand session active) */}
                <div className="min-w-0 flex-1">
                  {isLive && liveSession ? (
                    <>
                      <p className="text-white font-bold text-xs sm:text-sm md:text-base truncate">
                        {language === 'fr' ? liveSession.title : liveSession.titleEn}
                      </p>
                      <p className="text-green-400 text-[10px] sm:text-xs flex items-center gap-1">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="hidden xs:inline">{language === 'fr' ? 'Session en cours' : 'Session in progress'}</span>
                        <span className="xs:hidden">{language === 'fr' ? 'En cours' : 'Live'}</span>
                      </p>
                    </>
                  ) : lastSession && lastSession.endedAt ? (
                    // Afficher la dernière session si pas de session en cours
                    <>
                      <p className="text-white/70 font-medium text-xs sm:text-sm truncate">
                        {language === 'fr' ? lastSession.title : lastSession.titleEn}
                      </p>
                      <p className="text-salem-gold text-[10px] sm:text-xs flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        <span className="hidden sm:inline">{language === 'fr' ? 'Dernière session' : 'Last session'} - </span>
                        {lastSession.endedAt?.toDate 
                          ? lastSession.endedAt.toDate().toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : '---'
                        }
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-white/60 font-medium text-xs sm:text-sm">
                        {language === 'fr' ? 'Salle de Prière' : 'Prayer Room'}
                      </p>
                      <p className="text-gray-500 text-[10px] sm:text-xs">{language === 'fr' ? 'Ministère SALEM' : 'SALEM Ministry'}</p>
                    </>
                  )}
                </div>
              </div>

              {/* Section Droite: Actions + Statut */}
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                {/* Nom utilisateur (desktop) */}
                {currentUser && (
                  <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg">
                    <div className="w-6 h-6 bg-salem-green/30 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-salem-green">{currentUser.name.charAt(0)}</span>
                    </div>
                    <span className="text-white text-sm font-medium">{currentUser.name}</span>
                  </div>
                )}

                {/* Bouton Quitter (participant dans la salle) - Texte visible sur mobile */}
                {inRoom && !isAdmin && (
                  <button
                    onClick={handleLeaveRoom}
                    className="flex items-center gap-1.5 sm:gap-2 bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors shadow-lg"
                  >
                    <VideoOff className="w-4 h-4" />
                    <span>{language === 'fr' ? 'Quitter' : 'Leave'}</span>
                  </button>
                )}

                {/* Bouton Arrêter (admin avec session active) - Texte visible sur mobile */}
                {isAdmin && isLive && (
                  <button
                    onClick={handleStopSession}
                    disabled={loading}
                    className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all shadow-lg disabled:opacity-50"
                  >
                    <Square className="w-4 h-4" />
                    <span>{language === 'fr' ? 'Arrêter' : 'Stop'}</span>
                  </button>
                )}

                {/* Badge Hôte (admin) - visible aussi sur tablette */}
                {isAdmin && inRoom && (
                  <span className="hidden sm:flex items-center gap-1 px-1.5 sm:px-2 py-1 bg-salem-gold/20 text-salem-gold rounded-lg text-[10px] sm:text-xs font-semibold border border-salem-gold/30">
                    <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    <span className="hidden md:inline">HÔTE</span>
                  </span>
                )}

                {/* Indicateur de statut - compact sur mobile */}
                <div className={`flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 md:py-2 rounded-lg text-[10px] sm:text-xs font-semibold ${
                  isLive 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                }`}>
                  {isLive ? (
                    <>
                      <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-green-500"></span>
                      </span>
                      <Wifi className="w-2.5 h-2.5 sm:w-3 sm:h-3 hidden xs:block" />
                      <span className="hidden sm:inline">{language === 'fr' ? 'En ligne' : 'Online'}</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      <span className="hidden sm:inline">{language === 'fr' ? 'Hors ligne' : 'Offline'}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sessions Programmées */}
        <div className="mt-8">
          <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-salem-gold" />
            {language === 'fr' ? 'Sessions Programmées' : 'Scheduled Sessions'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {sessions.filter(s => s.isActive).map((session) => (
              <div
                key={session.id}
                className="session-card bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-salem-green/20 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-salem-green" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">{session.time}</p>
                    <p className="text-gray-400 text-sm">
                      {language === 'fr' ? session.day : session.dayEn}
                    </p>
                  </div>
                </div>
                <h4 className="text-white font-medium">
                  {language === 'fr' ? session.title : session.titleEn}
                </h4>
                <p className="text-salem-gold text-sm mt-1">{session.host}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://wa.me/237697033647"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
          >
            <MessageCircle className="w-5 h-5" />
            {language === 'fr' ? 'Rejoindre WhatsApp' : 'Join WhatsApp'}
          </a>
          <button
            onClick={() => {
              if (currentUser) {
                setShowIntentionModal(true);
              } else {
                setError(language === 'fr' ? 'Connectez-vous d\'abord' : 'Please login first');
                setShowLoginModal(true);
              }
            }}
            className="flex items-center justify-center gap-2 bg-salem-gold hover:bg-salem-gold-light text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
          >
            <Heart className="w-5 h-5" />
            {language === 'fr' ? 'Intention de Prière' : 'Prayer Intention'}
          </button>
        </div>

        {/* User info */}
        {currentUser && (
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              {language === 'fr' ? 'Connecté en tant que' : 'Logged in as'}: 
              <span className="text-white font-medium ml-1">{currentUser.name}</span>
            </p>
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 text-sm mt-1"
            >
              {language === 'fr' ? 'Se déconnecter' : 'Logout'}
            </button>
          </div>
        )}
      </div>

      {/* ==================== MODALS ==================== */}

      {/* Modal Connexion */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <LogIn className="w-5 h-5 text-salem-green" />
                {language === 'fr' ? 'Connexion' : 'Login'}
              </h3>
              <button onClick={() => setShowLoginModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  {language === 'fr' ? 'Nom ou Numéro de téléphone' : 'Name or Phone number'}
                </label>
                <input
                  type="text"
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  className="input-premium w-full px-4 py-3 rounded-xl"
                  placeholder={language === 'fr' ? 'Ex: Jean ou +237 697...' : 'Ex: John or +237 697...'}
                />
              </div>

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-salem-green hover:bg-salem-green-light text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-50"
              >
                {loading ? '...' : (language === 'fr' ? 'Se connecter' : 'Login')}
              </button>

              <p className="text-center text-gray-400 text-sm">
                {language === 'fr' ? 'Pas encore inscrit?' : 'Not registered yet?'}
                <button
                  onClick={() => { setShowLoginModal(false); setShowRegisterModal(true); }}
                  className="text-salem-gold hover:underline ml-1"
                >
                  {language === 'fr' ? "S'inscrire" : 'Register'}
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal Inscription */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-white/10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-salem-gold" />
                {language === 'fr' ? 'Inscription' : 'Registration'}
              </h3>
              <button onClick={() => setShowRegisterModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Nom Complet */}
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  {language === 'fr' ? 'Nom Complet' : 'Full Name'} *
                </label>
                <input
                  type="text"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
                  className="input-premium w-full px-4 py-3 rounded-xl"
                  placeholder="Jean Pierre"
                />
              </div>

              {/* Code Pays + Numéro */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">
                    {language === 'fr' ? 'Code' : 'Code'} *
                  </label>
                  <select
                    value={registerForm.countryCode}
                    onChange={(e) => setRegisterForm({...registerForm, countryCode: e.target.value})}
                    className="input-premium w-full px-2 py-3 rounded-xl"
                  >
                    {countryCodes.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-gray-300 text-sm mb-2">
                    {language === 'fr' ? 'Numéro' : 'Number'} *
                  </label>
                  <input
                    type="tel"
                    value={registerForm.phone}
                    onChange={(e) => setRegisterForm({...registerForm, phone: e.target.value})}
                    className="input-premium w-full px-4 py-3 rounded-xl"
                    placeholder="697 033 647"
                  />
                </div>
              </div>

              {/* Pays */}
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  {language === 'fr' ? 'Pays' : 'Country'} *
                </label>
                <select
                  value={registerForm.country}
                  onChange={(e) => setRegisterForm({...registerForm, country: e.target.value})}
                  className="input-premium w-full px-4 py-3 rounded-xl"
                >
                  {countryOptions.map((c) => (
                    <option key={c.value} value={c.value}>{language === 'fr' ? c.fr : c.en}</option>
                  ))}
                </select>
              </div>

              {/* Email (optionnel) */}
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Email <span className="text-gray-500">({language === 'fr' ? 'optionnel' : 'optional'})</span>
                </label>
                <input
                  type="email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                  className="input-premium w-full px-4 py-3 rounded-xl"
                  placeholder="email@exemple.com"
                />
              </div>

              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full bg-salem-gold hover:bg-salem-gold-light text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-50"
              >
                {loading ? '...' : (language === 'fr' ? "S'inscrire" : 'Register')}
              </button>

              <p className="text-center text-gray-400 text-sm">
                {language === 'fr' ? 'Déjà inscrit?' : 'Already registered?'}
                <button
                  onClick={() => { setShowRegisterModal(false); setShowLoginModal(true); }}
                  className="text-salem-green hover:underline ml-1"
                >
                  {language === 'fr' ? 'Se connecter' : 'Login'}
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal Intention de Prière */}
      {showIntentionModal && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-salem-gold" />
                {language === 'fr' ? 'Envoyer une Intention de Prière' : 'Send a Prayer Intention'}
              </h3>
              <button onClick={() => setShowIntentionModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Nom (pré-rempli, lecture seule) */}
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  {language === 'fr' ? 'Votre nom' : 'Your name'}
                </label>
                <input
                  type="text"
                  value={currentUser.name}
                  readOnly
                  className="input-premium w-full px-4 py-3 rounded-xl bg-white/5 cursor-not-allowed"
                />
              </div>

              {/* Intention */}
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  {language === 'fr' ? 'Votre intention de prière' : 'Your prayer intention'} *
                </label>
                <textarea
                  value={intentionForm.intention}
                  onChange={(e) => setIntentionForm({...intentionForm, intention: e.target.value})}
                  className="input-premium w-full px-4 py-3 rounded-xl h-32 resize-none"
                  placeholder={language === 'fr' ? 'Priez pour ma famille...' : 'Pray for my family...'}
                />
              </div>

              {/* Anonyme */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={intentionForm.isAnonymous}
                  onChange={(e) => setIntentionForm({...intentionForm, isAnonymous: e.target.checked})}
                  className="w-5 h-5 rounded border-gray-600 bg-white/10 text-salem-gold focus:ring-salem-gold"
                />
                <span className="text-gray-300">
                  {language === 'fr' ? 'Rester anonyme' : 'Stay anonymous'}
                </span>
              </label>

              <button
                onClick={handleSendIntention}
                disabled={loading || !intentionForm.intention.trim()}
                className="w-full bg-salem-gold hover:bg-salem-gold-light text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                {loading ? '...' : (language === 'fr' ? 'Envoyer mon intention' : 'Send my intention')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Admin Login */}
      {showAdminLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-salem-red" />
                {language === 'fr' ? 'Administration' : 'Administration'}
              </h3>
              <button onClick={() => setShowAdminLogin(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Email</label>
                <input
                  type="email"
                  value={adminLoginForm.email}
                  onChange={(e) => setAdminLoginForm({...adminLoginForm, email: e.target.value})}
                  className="input-premium w-full px-4 py-3 rounded-xl"
                  placeholder="admin@salem.org"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  {language === 'fr' ? 'Mot de passe' : 'Password'}
                </label>
                <input
                  type="password"
                  value={adminLoginForm.password}
                  onChange={(e) => setAdminLoginForm({...adminLoginForm, password: e.target.value})}
                  className="input-premium w-full px-4 py-3 rounded-xl"
                />
              </div>
              <button
                onClick={handleAdminLogin}
                disabled={loading}
                className="w-full bg-salem-red hover:bg-salem-red-light text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-50"
              >
                {loading ? '...' : (language === 'fr' ? 'Connexion Admin' : 'Admin Login')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Admin Dashboard - PREMIUM DESIGN */}
      {showAdminModal && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 modal-backdrop animate-fade-in-up">
          <div className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] rounded-2xl md:rounded-3xl w-full max-w-6xl max-h-[95vh] overflow-hidden border border-white/10 shadow-2xl relative flex flex-col">
            {/* Decorative gradient line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-salem-green via-salem-gold to-salem-red" />
            
            {/* Decorative blurs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-salem-green/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-salem-gold/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="relative bg-gradient-to-r from-salem-green/90 via-salem-green to-salem-green-dark p-4 md:p-5">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMi01LjM3My0xMi0xMi0xMnptMCAxOGMtMy4zMTQgMC02LTIuNjg2LTYtNnMyLjY4Ni02IDYtNiA2IDIuNjg2IDYgNi0yLjY4NiA2LTYgNnoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjAzIi8+PC9nPjwvc3ZnPg==')] opacity-30" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border border-white/20">
                    <Shield className="w-6 h-6 md:w-7 md:h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                      {language === 'fr' ? 'Centre d\'Administration' : 'Admin Center'}
                    </h3>
                    <p className="text-white/70 text-sm flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      {adminUser?.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => { 
                      await adminLogout(); 
                      setIsAdmin(false); // Réinitialiser isAdmin à false
                      setInRoom(false); // Quitter la salle si on était dedans
                      setShowAdminModal(false); 
                    }}
                    className="hidden sm:flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl text-sm font-medium transition-all border border-red-500/30"
                  >
                    {language === 'fr' ? 'Déconnexion' : 'Logout'}
                  </button>
                  <button 
                    onClick={() => setShowAdminModal(false)} 
                    className="w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all hover:rotate-90 duration-300 border border-white/10"
                  >
                    <X className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs - Premium Style */}
            <div className="relative bg-black/40 border-b border-white/10">
              <div className="flex overflow-x-auto scrollbar-hide">
                {[
                  { id: 'dashboard', label: language === 'fr' ? 'Tableau de Bord' : 'Dashboard', icon: Video, count: null },
                  { id: 'sessions', label: 'Sessions', icon: Calendar, count: sessions.length },
                  { id: 'intentions', label: 'Intentions', icon: Heart, count: intentionStats.pending },
                  { id: 'users', label: language === 'fr' ? 'Utilisateurs' : 'Users', icon: Users, count: participants.length },
                  { id: 'settings', label: language === 'fr' ? 'Paramètres' : 'Settings', icon: Settings, count: null }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setAdminTab(tab.id as typeof adminTab)}
                    className={`flex items-center gap-2 px-4 md:px-6 py-4 text-sm font-medium transition-all relative whitespace-nowrap group ${
                      adminTab === tab.id ? 'text-white' : 'text-white/50 hover:text-white/80'
                    }`}
                  >
                    {adminTab === tab.id && (
                      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
                    )}
                    <div className={`relative p-2 rounded-xl transition-all ${
                      adminTab === tab.id ? 'bg-salem-gold/20' : 'bg-transparent group-hover:bg-white/5'
                    }`}>
                      <tab.icon className={`w-4 h-4 ${adminTab === tab.id ? 'text-salem-gold' : ''}`} />
                    </div>
                    <span className="relative hidden sm:inline">{tab.label}</span>
                    {tab.count !== null && tab.count > 0 && (
                      <span className={`relative ml-1 px-2 py-0.5 text-xs rounded-full font-semibold ${
                        adminTab === tab.id ? 'bg-salem-gold text-black' : 'bg-salem-red/80 text-white'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                    {adminTab === tab.id && (
                      <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-salem-gold to-transparent" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="relative flex-1 overflow-y-auto p-4 md:p-6">
              {/* ONGLET 1: TABLEAU DE BORD - PREMIUM */}
              {adminTab === 'dashboard' && (
                <div className="space-y-6 animate-fade-in-up">
                  {/* Stats Cards - Premium Design */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Session Status Card */}
                    <div className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-500 ${
                      isLive 
                        ? 'bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-500/30' 
                        : 'bg-gradient-to-br from-gray-500/20 to-gray-600/10 border-gray-500/30'
                    }`}>
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-8 translate-x-8" />
                      <div className="relative flex items-start justify-between">
                        <div>
                          <p className="text-white/50 text-xs uppercase tracking-wider mb-1">
                            {language === 'fr' ? 'Statut Session' : 'Session Status'}
                          </p>
                          <p className={`text-2xl md:text-3xl font-bold ${isLive ? 'text-green-400' : 'text-gray-400'}`}>
                            {isLive ? (language === 'fr' ? 'En Direct' : 'LIVE') : (language === 'fr' ? 'Hors Ligne' : 'Offline')}
                          </p>
                          {isLive && (
                            <p className="text-green-400/70 text-sm mt-1 line-clamp-1">{liveSession?.title}</p>
                          )}
                        </div>
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                          isLive ? 'bg-green-500/30' : 'bg-gray-500/30'
                        }`}>
                          {isLive ? (
                            <div className="relative">
                              <Wifi className="w-7 h-7 text-green-400" />
                              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                            </div>
                          ) : (
                            <WifiOff className="w-7 h-7 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Users Card */}
                    <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-salem-gold/20 to-amber-600/10 border border-salem-gold/30">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-8 translate-x-8" />
                      <div className="relative flex items-start justify-between">
                        <div>
                          <p className="text-white/50 text-xs uppercase tracking-wider mb-1">
                            {language === 'fr' ? 'Utilisateurs Inscrits' : 'Registered Users'}
                          </p>
                          <p className="text-2xl md:text-3xl font-bold text-salem-gold">{participants.length}</p>
                          <p className="text-salem-gold/70 text-sm mt-1">
                            {language === 'fr' ? 'membres actifs' : 'active members'}
                          </p>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-salem-gold/30 flex items-center justify-center">
                          <Users className="w-7 h-7 text-salem-gold" />
                        </div>
                      </div>
                    </div>

                    {/* Intentions Card */}
                    <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-salem-red/20 to-red-600/10 border border-salem-red/30">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-8 translate-x-8" />
                      <div className="relative flex items-start justify-between">
                        <div>
                          <p className="text-white/50 text-xs uppercase tracking-wider mb-1">
                            {language === 'fr' ? 'Intentions en Attente' : 'Pending Intentions'}
                          </p>
                          <p className="text-2xl md:text-3xl font-bold text-salem-red">{intentionStats.pending}</p>
                          <p className="text-salem-red/70 text-sm mt-1">
                            {language === 'fr' ? 'à traiter' : 'to process'}
                          </p>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-salem-red/30 flex items-center justify-center">
                          <Heart className="w-7 h-7 text-salem-red" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Session Control Panel - Premium */}
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-salem-green/20 flex items-center justify-center">
                        <Video className="w-5 h-5 text-salem-green" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white">
                          {language === 'fr' ? 'Contrôle de Session' : 'Session Control'}
                        </h4>
                        <p className="text-white/50 text-sm">
                          {language === 'fr' ? 'Gérer la session en direct' : 'Manage live session'}
                        </p>
                      </div>
                    </div>
                    
                    {isLive ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                          <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                            <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse" />
                          </div>
                          <div className="flex-1">
                            <p className="text-green-400 font-semibold">{liveSession?.title}</p>
                            <p className="text-green-400/60 text-sm">
                              {language === 'fr' ? 'Session en cours...' : 'Session in progress...'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-white/50 text-xs">{language === 'fr' ? 'Participants' : 'Participants'}</p>
                            <p className="text-green-400 font-semibold">{participants.length}</p>
                          </div>
                        </div>
                        <button
                          onClick={handleStopSession}
                          disabled={loading}
                          className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-semibold flex items-center justify-center gap-3 transition-all shadow-lg shadow-red-500/25 hover:shadow-red-500/40 disabled:opacity-50"
                        >
                          <Square className="w-5 h-5" />
                          {language === 'fr' ? 'Arrêter la Session' : 'Stop Session'}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 text-white/70 text-sm">
                              <span className="w-5 h-5 rounded bg-salem-green/20 flex items-center justify-center text-xs font-bold">FR</span>
                              {language === 'fr' ? 'Titre de la session' : 'Session title'}
                            </label>
                            <input
                              type="text"
                              value={sessionTitle.fr}
                              onChange={(e) => setSessionTitle({...sessionTitle, fr: e.target.value})}
                              placeholder="Ex: Prière du Matin"
                              className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-salem-gold/50 focus:bg-white/10 focus:outline-none transition-all"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 text-white/70 text-sm">
                              <span className="w-5 h-5 rounded bg-blue-500/20 flex items-center justify-center text-xs font-bold">EN</span>
                              Session Title
                            </label>
                            <input
                              type="text"
                              value={sessionTitle.en}
                              onChange={(e) => setSessionTitle({...sessionTitle, en: e.target.value})}
                              placeholder="Ex: Morning Prayer"
                              className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-salem-gold/50 focus:bg-white/10 focus:outline-none transition-all"
                            />
                          </div>
                        </div>
                        <button
                          onClick={handleStartSession}
                          disabled={loading || !sessionTitle.fr.trim()}
                          className="w-full py-4 bg-gradient-to-r from-salem-green to-salem-green-light hover:from-salem-green-light hover:to-salem-green text-white rounded-xl font-semibold flex items-center justify-center gap-3 transition-all shadow-lg shadow-salem-green/25 hover:shadow-salem-green/40 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                        >
                          <Play className="w-5 h-5" />
                          {language === 'fr' ? 'Démarrer la Session' : 'Start Session'}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: language === 'fr' ? 'Voir Intentions' : 'View Intentions', icon: Heart, tab: 'intentions', color: 'red' },
                      { label: language === 'fr' ? 'Gérer Sessions' : 'Manage Sessions', icon: Calendar, tab: 'sessions', color: 'blue' },
                      { label: language === 'fr' ? 'Utilisateurs' : 'Users', icon: Users, tab: 'users', color: 'gold' },
                      { label: language === 'fr' ? 'Paramètres' : 'Settings', icon: Settings, tab: 'settings', color: 'gray' },
                    ].map((action, i) => (
                      <button
                        key={i}
                        onClick={() => setAdminTab(action.tab as typeof adminTab)}
                        className="p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-white/20 transition-all group"
                      >
                        <action.icon className="w-6 h-6 mx-auto mb-2 text-white/60 group-hover:text-white transition-colors" />
                        <p className="text-white/70 text-sm text-center group-hover:text-white transition-colors">{action.label}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ONGLET 2: SESSIONS */}
              {adminTab === 'sessions' && (
                <div className="space-y-6">
                  {/* Formulaire */}
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h4 className="text-white font-semibold mb-4">
                      {editingSession ? (language === 'fr' ? 'Modifier la session' : 'Edit session') : (language === 'fr' ? 'Ajouter une session' : 'Add session')}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={sessionForm.title}
                        onChange={(e) => setSessionForm({...sessionForm, title: e.target.value})}
                        className="input-premium px-4 py-3 rounded-xl"
                        placeholder={language === 'fr' ? 'Titre FR' : 'Title FR'}
                      />
                      <input
                        type="text"
                        value={sessionForm.titleEn}
                        onChange={(e) => setSessionForm({...sessionForm, titleEn: e.target.value})}
                        className="input-premium px-4 py-3 rounded-xl"
                        placeholder={language === 'fr' ? 'Titre EN' : 'Title EN'}
                      />
                      <input
                        type="text"
                        value={sessionForm.day}
                        onChange={(e) => setSessionForm({...sessionForm, day: e.target.value})}
                        className="input-premium px-4 py-3 rounded-xl"
                        placeholder={language === 'fr' ? 'Jour FR (ex: Lundi - Vendredi)' : 'Day FR'}
                      />
                      <input
                        type="text"
                        value={sessionForm.dayEn}
                        onChange={(e) => setSessionForm({...sessionForm, dayEn: e.target.value})}
                        className="input-premium px-4 py-3 rounded-xl"
                        placeholder={language === 'fr' ? 'Jour EN (ex: Monday - Friday)' : 'Day EN'}
                      />
                      <input
                        type="time"
                        value={sessionForm.time}
                        onChange={(e) => setSessionForm({...sessionForm, time: e.target.value})}
                        className="input-premium px-4 py-3 rounded-xl"
                      />
                      <input
                        type="text"
                        value={sessionForm.host}
                        onChange={(e) => setSessionForm({...sessionForm, host: e.target.value})}
                        className="input-premium px-4 py-3 rounded-xl"
                        placeholder={language === 'fr' ? 'Animateur' : 'Host'}
                      />
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={sessionForm.isActive}
                          onChange={(e) => setSessionForm({...sessionForm, isActive: e.target.checked})}
                          className="w-5 h-5 rounded"
                        />
                        <span className="text-gray-300">{language === 'fr' ? 'Actif' : 'Active'}</span>
                      </label>
                      <button
                        onClick={handleSaveSession}
                        className="flex items-center gap-2 bg-salem-green hover:bg-salem-green-light text-white px-4 py-2 rounded-lg"
                      >
                        <Save className="w-4 h-4" />
                        {language === 'fr' ? 'Enregistrer' : 'Save'}
                      </button>
                      {editingSession && (
                        <button
                          onClick={() => {
                            setEditingSession(null);
                            setSessionForm({ title: '', titleEn: '', day: '', dayEn: '', time: '', host: '', isActive: true });
                          }}
                          className="text-gray-400 hover:text-white"
                        >
                          {language === 'fr' ? 'Annuler' : 'Cancel'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Liste */}
                  <div className="space-y-3">
                    {sessions.map((session) => (
                      <div key={session.id} className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">{session.title}</p>
                          <p className="text-gray-400 text-sm">{session.time} - {session.day} - {session.host}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs ${session.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                            {session.isActive ? 'Actif' : 'Inactif'}
                          </span>
                          <button
                            onClick={() => {
                              setEditingSession(session);
                              setSessionForm({
                                title: session.title,
                                titleEn: session.titleEn,
                                day: session.day,
                                dayEn: session.dayEn,
                                time: session.time,
                                host: session.host,
                                isActive: session.isActive
                              });
                            }}
                            className="p-2 text-gray-400 hover:text-white"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSession(session.id!)}
                            className="p-2 text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ONGLET 3: INTENTIONS - PREMIUM */}
              {adminTab === 'intentions' && (
                <div className="space-y-6 animate-fade-in-up">
                  {/* Stats Row - Premium Design */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: 'Total', value: intentionStats.total, icon: '📨', bg: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-500/30', text: 'text-blue-400' },
                      { label: language === 'fr' ? 'En attente' : 'Pending', value: intentionStats.pending, icon: '⏳', bg: 'from-yellow-500/20 to-yellow-600/10', border: 'border-yellow-500/30', text: 'text-yellow-400' },
                      { label: language === 'fr' ? 'Priées' : 'Prayed', value: intentionStats.prayed, icon: '🙏', bg: 'from-purple-500/20 to-purple-600/10', border: 'border-purple-500/30', text: 'text-purple-400' },
                      { label: language === 'fr' ? 'Exaucées' : 'Answered', value: intentionStats.answered, icon: '✅', bg: 'from-green-500/20 to-green-600/10', border: 'border-green-500/30', text: 'text-green-400' },
                    ].map((stat, i) => (
                      <div key={i} className={`p-4 rounded-xl bg-gradient-to-br ${stat.bg} border ${stat.border}`}>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{stat.icon}</span>
                          <div>
                            <p className="text-white/50 text-xs">{stat.label}</p>
                            <p className={`text-2xl font-bold ${stat.text}`}>{stat.value}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Filters - Premium Style */}
                  <div className="flex gap-2 flex-wrap p-1 bg-white/5 rounded-xl">
                    {[
                      { id: 'all', label: language === 'fr' ? 'Toutes' : 'All', icon: '📬' },
                      { id: 'pending', label: language === 'fr' ? 'En attente' : 'Pending', icon: '⏳' },
                      { id: 'prayed', label: language === 'fr' ? 'Priées' : 'Prayed', icon: '🙏' },
                      { id: 'answered', label: language === 'fr' ? 'Exaucées' : 'Answered', icon: '✅' },
                    ].map((filter) => (
                      <button
                        key={filter.id}
                        onClick={() => setIntentionFilter(filter.id as typeof intentionFilter)}
                        className={`flex-1 md:flex-none px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                          intentionFilter === filter.id
                            ? 'bg-salem-gold text-black shadow-lg'
                            : 'text-white/60 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <span>{filter.icon}</span>
                        <span className="hidden md:inline">{filter.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Intentions List - Premium Cards */}
                  <div className="space-y-3">
                    {filteredIntentions.length === 0 ? (
                      <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
                        <Heart className="w-16 h-16 mx-auto mb-4 text-white/20" />
                        <p className="text-white/50 text-lg">
                          {language === 'fr' ? 'Aucune intention de prière' : 'No prayer intentions'}
                        </p>
                        <p className="text-white/30 text-sm mt-1">
                          {language === 'fr' ? 'Les intentions apparaîtront ici' : 'Intentions will appear here'}
                        </p>
                      </div>
                    ) : (
                      filteredIntentions.map((intention, index) => (
                        <div 
                          key={intention.id} 
                          className="bg-gradient-to-r from-white/5 to-white/[0.02] rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all"
                          style={{ animationDelay: `${index * 0.05}s` }}
                        >
                          <div className="flex items-start gap-4">
                            {/* Avatar */}
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
                              intention.status === 'pending' ? 'bg-yellow-500/20' :
                              intention.status === 'prayed' ? 'bg-purple-500/20' :
                              'bg-green-500/20'
                            }`}>
                              {intention.isAnonymous ? '🙈' : intention.participantName.charAt(0).toUpperCase()}
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-2">
                                <span className="text-white font-medium">
                                  {intention.isAnonymous ? (language === 'fr' ? '🔒 Anonyme' : '🔒 Anonymous') : intention.participantName}
                                </span>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  intention.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                  intention.status === 'prayed' ? 'bg-purple-500/20 text-purple-400' :
                                  'bg-green-500/20 text-green-400'
                                }`}>
                                  {intention.status === 'pending' ? '⏳' : intention.status === 'prayed' ? '🙏' : '✅'}
                                  {intention.status === 'pending' ? (language === 'fr' ? ' En attente' : ' Pending') :
                                   intention.status === 'prayed' ? (language === 'fr' ? ' Priée' : ' Prayed') :
                                   (language === 'fr' ? ' Exaucée' : ' Answered')}
                                </span>
                              </div>
                              
                              <p className="text-white/80 text-sm leading-relaxed">{intention.intention}</p>
                              
                              <div className="flex items-center gap-3 mt-3 text-white/40 text-xs">
                                <span>🌍 {intention.participantCountry}</span>
                                <span>•</span>
                                <span>🕐 {intention.createdAt?.toDate ? intention.createdAt.toDate().toLocaleDateString() : new Date().toLocaleDateString()}</span>
                              </div>
                            </div>
                            
                            {/* Actions */}
                            <div className="flex flex-col gap-2 flex-shrink-0">
                              {intention.status === 'pending' && (
                                <button
                                  onClick={() => handleUpdateIntentionStatus(intention.id!, 'prayed')}
                                  className="p-2.5 bg-purple-500/20 hover:bg-purple-500/30 rounded-xl transition-all group"
                                  title={language === 'fr' ? 'Marquer comme priée' : 'Mark as prayed'}
                                >
                                  <Heart className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                                </button>
                              )}
                              {intention.status === 'prayed' && (
                                <button
                                  onClick={() => handleUpdateIntentionStatus(intention.id!, 'answered')}
                                  className="p-2.5 bg-green-500/20 hover:bg-green-500/30 rounded-xl transition-all group"
                                  title={language === 'fr' ? 'Marquer comme exaucée' : 'Mark as answered'}
                                >
                                  <CheckCircle className="w-4 h-4 text-green-400 group-hover:scale-110 transition-transform" />
                                </button>
                              )}
                              {!intention.isAnonymous && (
                                <a
                                  href={`https://wa.me/${intention.participantPhone.replace(/\s/g, '').replace('+', '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2.5 bg-[#25D366]/20 hover:bg-[#25D366]/30 rounded-xl transition-all group"
                                  title="WhatsApp"
                                >
                                  <MessageCircle className="w-4 h-4 text-[#25D366] group-hover:scale-110 transition-transform" />
                                </a>
                              )}
                              <button
                                onClick={() => handleDeleteIntention(intention.id!)}
                                className="p-2.5 bg-red-500/20 hover:bg-red-500/30 rounded-xl transition-all group"
                                title={language === 'fr' ? 'Supprimer' : 'Delete'}
                              >
                                <Trash2 className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* ONGLET 4: UTILISATEURS - PREMIUM */}
              {adminTab === 'users' && (
                <div className="space-y-6 animate-fade-in-up">
                  {/* Header with Search & Actions */}
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type="text"
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        placeholder={language === 'fr' ? 'Rechercher par nom, téléphone, email...' : 'Search by name, phone, email...'}
                        className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-salem-gold/50 focus:bg-white/10 focus:outline-none transition-all"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleExportUsers}
                        className="px-5 py-3 bg-gradient-to-r from-salem-green/20 to-salem-green/10 hover:from-salem-green/30 hover:to-salem-green/20 text-salem-green rounded-xl flex items-center justify-center gap-2 transition-all border border-salem-green/30"
                      >
                        <Download className="w-5 h-5" />
                        <span className="hidden md:inline">Export</span>
                      </button>
                      <label className="px-5 py-3 bg-gradient-to-r from-salem-gold/20 to-amber-600/10 hover:from-salem-gold/30 hover:to-amber-600/20 text-salem-gold rounded-xl flex items-center justify-center gap-2 transition-all border border-salem-gold/30 cursor-pointer">
                        <Upload className="w-5 h-5" />
                        <span className="hidden md:inline">Import</span>
                        <input type="file" accept=".json" onChange={handleImportUsers} className="hidden" />
                      </label>
                    </div>
                  </div>

                  {/* Users Count Banner */}
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-salem-gold/10 to-transparent rounded-xl border border-salem-gold/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-salem-gold/20 rounded-xl flex items-center justify-center">
                        <Users className="w-5 h-5 text-salem-gold" />
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {filteredUsers.length} {language === 'fr' ? 'utilisateur(s)' : 'user(s)'}
                        </p>
                        <p className="text-white/50 text-sm">
                          {language === 'fr' ? 'inscrits à la salle virtuelle' : 'registered in virtual room'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Users List - Premium Cards */}
                  <div className="space-y-2">
                    {filteredUsers.length === 0 ? (
                      <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
                        <Users className="w-16 h-16 mx-auto mb-4 text-white/20" />
                        <p className="text-white/50 text-lg">
                          {userSearch 
                            ? (language === 'fr' ? 'Aucun résultat' : 'No results') 
                            : (language === 'fr' ? 'Aucun utilisateur inscrit' : 'No registered users')
                          }
                        </p>
                      </div>
                    ) : (
                      filteredUsers.map((user, index) => (
                        <div 
                          key={user.id} 
                          className="group bg-white/5 hover:bg-white/10 rounded-xl p-4 border border-white/10 hover:border-white/20 flex items-center justify-between transition-all"
                          style={{ animationDelay: `${index * 0.03}s` }}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-salem-green/30 to-salem-green/10 rounded-xl flex items-center justify-center border border-salem-green/20">
                              <span className="text-lg font-semibold text-salem-green">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="text-white font-medium">{user.name}</p>
                              <div className="flex items-center gap-3 text-white/50 text-sm">
                                <span>📱 {user.phone}</span>
                                <span>•</span>
                                <span>🌍 {user.country}</span>
                              </div>
                              {user.email && (
                                <p className="text-white/40 text-xs mt-0.5">✉️ {user.email}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                            <a
                              href={`https://wa.me/${user.phone.replace(/\s/g, '').replace('+', '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2.5 bg-[#25D366]/20 hover:bg-[#25D366]/30 rounded-xl transition-all"
                              title="WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4 text-[#25D366]" />
                            </a>
                            <button
                              onClick={() => handleDeleteUser(user.id!)}
                              className="p-2.5 bg-red-500/20 hover:bg-red-500/30 rounded-xl transition-all"
                              title={language === 'fr' ? 'Supprimer' : 'Delete'}
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* ONGLET 5: PARAMÈTRES - PREMIUM */}
              {adminTab === 'settings' && (
                <div className="space-y-6 animate-fade-in-up">
                  {/* Firebase Status Card - Premium */}
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center border border-orange-500/20">
                        <Database className="w-6 h-6 text-orange-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white">Statut Firebase</h4>
                        <p className="text-white/50 text-sm">
                          {language === 'fr' ? 'Connexion aux services cloud' : 'Cloud services connection'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid gap-3 mb-5">
                      {[
                        { 
                          label: 'Admin connecté', 
                          value: adminUser?.email || (language === 'fr' ? 'Connecté' : 'Connected'), 
                          status: true, 
                          icon: Shield 
                        },
                        { 
                          label: 'Firestore Database', 
                          value: firebaseStatus.firestore 
                            ? (language === 'fr' ? '🟢 Connecté' : '🟢 Connected') 
                            : (language === 'fr' ? '🔴 Déconnecté' : '🔴 Disconnected'), 
                          status: firebaseStatus.firestore, 
                          icon: Database 
                        },
                        { 
                          label: 'Authentication', 
                          value: isAdmin 
                            ? (language === 'fr' ? '🟢 Authentifié' : '🟢 Authenticated')
                            : firebaseStatus.auth 
                              ? (language === 'fr' ? '🟡 Service actif' : '🟡 Service active') 
                              : (language === 'fr' ? '🔴 Non connecté' : '🔴 Not connected'), 
                          status: firebaseStatus.auth, 
                          icon: Shield 
                        },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                          <div className="flex items-center gap-3">
                            <item.icon className="w-5 h-5 text-white/50" />
                            <span className="text-white/80">{item.label}</span>
                          </div>
                          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                            item.status 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            <span className={`w-2 h-2 rounded-full ${
                              item.status ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'
                            }`} />
                            <span className="text-sm font-medium truncate max-w-[150px]">{item.value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={handleTestConnection}
                        className="flex-1 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl font-medium transition-all flex items-center justify-center gap-2 border border-blue-500/30"
                      >
                        <RefreshCw className="w-5 h-5" />
                        {language === 'fr' ? 'Tester connexion' : 'Test Connection'}
                      </button>
                      <button
                        onClick={handleTestWrite}
                        className="flex-1 py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-xl font-medium transition-all flex items-center justify-center gap-2 border border-purple-500/30"
                      >
                        <Database className="w-5 h-5" />
                        {language === 'fr' ? 'Tester écriture' : 'Test Write'}
                      </button>
                    </div>
                  </div>

                  {/* Whereby Configuration Card - Premium */}
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-salem-green/20 to-salem-green/10 flex items-center justify-center border border-salem-green/20">
                        <Video className="w-6 h-6 text-salem-green" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white">Configuration Whereby</h4>
                        <p className="text-white/50 text-sm">
                          {language === 'fr' ? 'Paramètres de la salle vidéo' : 'Video room settings'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-white/70 text-sm">
                          👑 {language === 'fr' ? 'Lien Hôte (avec roomKey)' : 'Host Link (with roomKey)'}
                        </label>
                        <input
                          type="text"
                          value={wherebyForm.hostLink}
                          onChange={(e) => setWherebyForm({...wherebyForm, hostLink: e.target.value})}
                          className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-salem-gold/50 focus:bg-white/10 focus:outline-none transition-all text-sm"
                          placeholder="https://salemroommeet.whereby.com/...?roomKey=..."
                        />
                        <p className="text-white/40 text-xs">
                          {language === 'fr' 
                            ? '⚠️ Lien complet avec le roomKey pour les droits de modération' 
                            : '⚠️ Full link with roomKey for moderation rights'}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-white/70 text-sm">
                          👥 {language === 'fr' ? 'Lien Participant' : 'Participant Link'}
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={wherebyForm.participantLink}
                            onChange={(e) => setWherebyForm({...wherebyForm, participantLink: e.target.value})}
                            className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-salem-gold/50 focus:bg-white/10 focus:outline-none transition-all text-sm"
                            placeholder="https://salemroommeet.whereby.com/..."
                          />
                        </div>
                        <p className="text-white/40 text-xs">
                          {language === 'fr' 
                            ? 'Lien simple sans roomKey pour les participants' 
                            : 'Simple link without roomKey for participants'}
                        </p>
                      </div>
                      
                      <button
                        onClick={handleSaveWherebyLinks}
                        className="w-full py-4 bg-gradient-to-r from-salem-green to-salem-green-light hover:from-salem-green-light hover:to-salem-green text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-salem-green/20"
                      >
                        <Save className="w-5 h-5" />
                        {language === 'fr' ? 'Enregistrer les liens' : 'Save Links'}
                      </button>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 rounded-2xl p-6 border border-red-500/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-red-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-red-400">Zone Danger</h4>
                        <p className="text-white/50 text-sm">
                          {language === 'fr' ? 'Actions irréversibles' : 'Irreversible actions'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={async () => { 
                        if (confirm(language === 'fr' ? 'Voulez-vous vraiment vous déconnecter?' : 'Are you sure you want to logout?')) {
                          await adminLogout(); 
                          setIsAdmin(false); // Réinitialiser isAdmin à false
                          setInRoom(false); // Quitter la salle
                          setShowAdminModal(false); 
                        }
                      }}
                      className="w-full py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl font-medium transition-all border border-red-500/30"
                    >
                      {language === 'fr' ? 'Déconnexion Admin' : 'Admin Logout'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualRoom;
