import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, Tv, Calendar, Clock, Bell, BellRing, Youtube, 
  Eye, Users, Video, Radio, ExternalLink, Share2,
  X, Facebook, MessageCircle,
  ArrowLeft, Filter, Flame, BookOpen, Music, Heart,
  Church, Star
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

// Types
interface VideoItem {
  id: string;
  title: string;
  titleEn: string;
  thumbnail: string;
  duration: string;
  views: string;
  date: string;
  category: string;
  youtubeId: string;
}

interface ScheduleItem {
  day: string;
  dayEn: string;
  time: string;
  title: string;
  titleEn: string;
  icon: React.ReactNode;
}

interface SalemTVSectionProps {
  onBack?: () => void;
}

const SalemTVSection: React.FC<SalemTVSectionProps> = ({ onBack }) => {
  const { t } = useLanguage();
  
  // States
  const [isLive] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [statsAnimated, setStatsAnimated] = useState(false);
  
  // Refs pour animation au scroll
  const heroRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const videosRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);

  // Catégories
  const categories = [
    { id: 'all', label: t('Tous', 'All'), icon: <Filter className="w-4 h-4" /> },
    { id: 'teachings', label: t('Enseignements', 'Teachings'), icon: <BookOpen className="w-4 h-4" /> },
    { id: 'prayers', label: t('Prières', 'Prayers'), icon: <Flame className="w-4 h-4" /> },
    { id: 'masses', label: t('Messes', 'Masses'), icon: <Church className="w-4 h-4" /> },
    { id: 'testimonies', label: t('Témoignages', 'Testimonies'), icon: <Heart className="w-4 h-4" /> },
    { id: 'worship', label: t('Louange', 'Worship'), icon: <Music className="w-4 h-4" /> },
  ];

  // Programme de la semaine
  const schedule: ScheduleItem[] = [
    { 
      day: 'Lundi - Vendredi', 
      dayEn: 'Monday - Friday', 
      time: '06:00', 
      title: 'Prière du Matin', 
      titleEn: 'Morning Prayer',
      icon: <Flame className="w-4 h-4 text-orange-400" />
    },
    { 
      day: 'Mercredi', 
      dayEn: 'Wednesday', 
      time: '18:00', 
      title: 'Enseignement Biblique', 
      titleEn: 'Bible Teaching',
      icon: <BookOpen className="w-4 h-4 text-blue-400" />
    },
    { 
      day: 'Vendredi', 
      dayEn: 'Friday', 
      time: '21:00', 
      title: 'Veillée de Prière', 
      titleEn: 'Prayer Vigil',
      icon: <Star className="w-4 h-4 text-yellow-400" />
    },
    { 
      day: 'Dimanche', 
      dayEn: 'Sunday', 
      time: '09:00', 
      title: 'Messe en Direct', 
      titleEn: 'Live Mass',
      icon: <Church className="w-4 h-4 text-purple-400" />
    },
  ];

  // Vidéos récentes - Vraies vidéos YouTube SALEM Ministry
  const videos: VideoItem[] = [
    {
      id: '1',
      title: 'Messe de Minuit - Bénédiction Paternelle des Femmes',
      titleEn: 'Midnight Mass - Paternal Blessing of Women',
      thumbnail: 'https://img.youtube.com/vi/CqBKckF-bto/maxresdefault.jpg',
      duration: '2:30:00',
      views: '15.2K',
      date: '2024-12-25',
      category: 'masses',
      youtubeId: 'CqBKckF-bto'
    },
    {
      id: '2',
      title: 'LA FOI (Types) | Parole Prophétique & Prières',
      titleEn: 'FAITH 2 (Types) | Prophetic Word & Prayers',
      thumbnail: 'https://img.youtube.com/vi/qaAi14Lkozg/maxresdefault.jpg',
      duration: '1:45:30',
      views: '8.5K',
      date: '2026-03-11',
      category: 'teachings',
      youtubeId: 'qaAi14Lkozg'
    },
    {
      id: '3',
      title: 'LA FOI | Parole Prophétique & Prières',
      titleEn: 'FAITH | Prophetic Word & Prayers',
      thumbnail: 'https://img.youtube.com/vi/2Aft5E61vDo/maxresdefault.jpg',
      duration: '1:38:15',
      views: '12.3K',
      date: '2026-03-10',
      category: 'teachings',
      youtubeId: '2Aft5E61vDo'
    },
    {
      id: '4',
      title: 'Prière de Guérison et Délivrance',
      titleEn: 'Healing and Deliverance Prayer',
      thumbnail: '/images/IMG_2367.jpeg',
      duration: '52:30',
      views: '8.2K',
      date: '2025-01-18',
      category: 'prayers',
      youtubeId: 'CqBKckF-bto'
    },
    {
      id: '5',
      title: 'Veillée de Prière - Vendredi Saint',
      titleEn: 'Prayer Vigil - Good Friday',
      thumbnail: '/images/IMG_2628.jpeg',
      duration: '3:15:00',
      views: '25.1K',
      date: '2025-01-17',
      category: 'prayers',
      youtubeId: 'qaAi14Lkozg'
    },
    {
      id: '6',
      title: 'Enseignement sur le Saint-Esprit',
      titleEn: 'Teaching on the Holy Spirit',
      thumbnail: '/images/img5.jpg',
      duration: '1:12:45',
      views: '11.2K',
      date: '2025-01-15',
      category: 'teachings',
      youtubeId: '2Aft5E61vDo'
    },
  ];

  // Statistiques
  const stats = [
    { value: 12500, suffix: '+', label: t('Abonnés', 'Subscribers'), icon: <Users className="w-5 h-5" /> },
    { value: 500, suffix: '+', label: t('Vidéos', 'Videos'), icon: <Video className="w-5 h-5" /> },
    { value: 1, suffix: 'M+', label: t('Vues', 'Views'), icon: <Eye className="w-5 h-5" /> },
    { value: 150, suffix: '+', label: t('Lives', 'Lives'), icon: <Radio className="w-5 h-5" /> },
  ];

  // Filtrer les vidéos par catégorie
  const filteredVideos = activeCategory === 'all' 
    ? videos 
    : videos.filter(v => v.category === activeCategory);

  // Animation au scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set(prev).add(entry.target.id));
            if (entry.target.id === 'stats-section') {
              setStatsAnimated(true);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    const refs = [heroRef, playerRef, categoriesRef, videosRef, statsRef, socialRef];
    refs.forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  // Compteur animé
  const AnimatedCounter: React.FC<{ value: number; suffix: string }> = ({ value, suffix }) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
      if (!statsAnimated) return;
      
      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      
      return () => clearInterval(timer);
    }, [statsAnimated, value]);
    
    return <span>{count.toLocaleString()}{suffix}</span>;
  };

  // Activer notifications
  const handleNotifications = useCallback(() => {
    setNotificationsEnabled(prev => !prev);
  }, []);

  // Partager
  const handleShare = useCallback(async (video: VideoItem) => {
    if (navigator.share) {
      await navigator.share({
        title: t(video.title, video.titleEn),
        url: `https://www.youtube.com/watch?v=${video.youtubeId}`
      });
    }
  }, [t]);

  // Handle back
  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
    }
  }, [onBack]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header sticky */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-salem-green transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">{t('Retour', 'Back')}</span>
          </button>
          
          <div className="flex items-center gap-2">
            <Tv className="w-5 h-5 text-salem-red" />
            <span className="font-serif font-bold text-gray-800">SALEM TV</span>
          </div>
          
          {/* Badge LIVE */}
          {isLive && (
            <div className="flex items-center gap-1.5 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
              <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
              {t('EN DIRECT', 'LIVE')}
            </div>
          )}
          
          {!isLive && (
            <button
              onClick={handleNotifications}
              className={`p-2 rounded-full transition-colors ${
                notificationsEnabled 
                  ? 'bg-salem-green text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              aria-label={t('Notifications', 'Notifications')}
            >
              {notificationsEnabled ? <BellRing className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <div 
        ref={heroRef}
        id="hero"
        className="relative h-[35vh] sm:h-[40vh] min-h-[250px] max-h-[350px] overflow-hidden"
      >
        {/* Image de fond */}
        <div className="absolute inset-0">
          <img
            src="/images/IMG_2636.jpeg"
            alt="SALEM TV"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
        </div>

        {/* Contenu Hero */}
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          {/* Logo/Icône */}
          <div className="mb-3 p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <Tv className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>
          
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
            SALEM <span className="text-salem-gold">TV</span>
          </h1>
          
          <p className="text-white/80 text-sm sm:text-base max-w-md">
            {t(
              'Votre chaîne de prière, d\'enseignement et de transformation spirituelle',
              'Your channel for prayer, teaching and spiritual transformation'
            )}
          </p>

          {/* Badge Live dans le Hero */}
          {isLive && (
            <div className="mt-4 flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full font-bold animate-pulse">
              <span className="w-3 h-3 bg-white rounded-full animate-ping"></span>
              <span>{t('EN DIRECT MAINTENANT', 'LIVE NOW')}</span>
            </div>
          )}
        </div>

        {/* Vague décorative */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full h-8 sm:h-12 fill-gray-50">
            <path d="M0,32L80,37.3C160,43,320,53,480,53.3C640,53,800,43,960,37.3C1120,32,1280,32,1360,32L1440,32L1440,64L1360,64C1280,64,1120,64,960,64C800,64,640,64,480,64C320,64,160,64,80,64L0,64Z"></path>
          </svg>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
        
        {/* Section Lecteur + Programme */}
        <div 
          ref={playerRef}
          id="player"
          className={`transition-all duration-700 ${
            visibleSections.has('player') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            {/* Lecteur YouTube */}
            <div className="lg:col-span-2">
              <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl">
                {/* Aspect ratio container */}
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  {selectedVideo ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1`}
                      title={t(selectedVideo.title, selectedVideo.titleEn)}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <>
                      <img
                        src="https://img.youtube.com/vi/CqBKckF-bto/maxresdefault.jpg"
                        alt="SALEM TV - Dernière vidéo"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <button
                          onClick={() => setSelectedVideo(videos[0])}
                          className="w-16 h-16 sm:w-20 sm:h-20 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110"
                        >
                          <Play className="w-8 h-8 sm:w-10 sm:h-10 text-salem-red ml-1" fill="currentColor" />
                        </button>
                      </div>
                      {/* Badge LIVE */}
                      {isLive && (
                        <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 rounded-lg font-bold text-sm">
                          <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                          {t('EN DIRECT', 'LIVE')}
                        </div>
                      )}
                    </>
                  )}
                </div>
                
                {/* Info vidéo en cours */}
                {selectedVideo && (
                  <div className="p-3 sm:p-4 bg-gray-900">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-sm sm:text-base truncate">
                          {t(selectedVideo.title, selectedVideo.titleEn)}
                        </h3>
                        <p className="text-gray-400 text-xs sm:text-sm mt-1">
                          {selectedVideo.views} {t('vues', 'views')} • {selectedVideo.duration}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleShare(selectedVideo)}
                          className="p-2 text-gray-400 hover:text-white transition-colors"
                          aria-label="Partager"
                        >
                          <Share2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setSelectedVideo(null)}
                          className="p-2 text-gray-400 hover:text-white transition-colors"
                          aria-label="Fermer"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - Programme */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full">
                {/* Header Programme */}
                <div className="bg-gradient-to-r from-salem-green to-salem-green-light p-4">
                  <div className="flex items-center gap-2 text-white">
                    <Calendar className="w-5 h-5" />
                    <h3 className="font-serif font-bold">{t('Programme', 'Schedule')}</h3>
                  </div>
                </div>
                
                {/* Liste des programmes */}
                <div className="divide-y divide-gray-100">
                  {schedule.map((item, index) => (
                    <div 
                      key={index}
                      className="p-3 sm:p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">
                            {t(item.title, item.titleEn)}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                            <Clock className="w-3 h-3" />
                            <span>{item.time}</span>
                            <span>•</span>
                            <span className="truncate">{t(item.day, item.dayEn)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bouton Notifications */}
                <div className="p-4 bg-gray-50 border-t">
                  <button
                    onClick={handleNotifications}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                      notificationsEnabled
                        ? 'bg-salem-green text-white'
                        : 'bg-white border border-gray-200 text-gray-700 hover:border-salem-green hover:text-salem-green'
                    }`}
                  >
                    {notificationsEnabled ? (
                      <>
                        <BellRing className="w-4 h-4" />
                        {t('Notifications activées', 'Notifications enabled')}
                      </>
                    ) : (
                      <>
                        <Bell className="w-4 h-4" />
                        {t('Activer les alertes', 'Enable alerts')}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Catégories */}
        <div 
          ref={categoriesRef}
          id="categories"
          className={`transition-all duration-700 delay-100 ${
            visibleSections.has('categories') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-salem-green text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Grille de vidéos */}
        <div 
          ref={videosRef}
          id="videos"
          className={`transition-all duration-700 delay-200 ${
            visibleSections.has('videos') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900">
              {t('Vidéos Récentes', 'Recent Videos')}
            </h2>
            <a
              href="https://www.youtube.com/@salemabundantlifeministry"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-salem-red hover:underline"
            >
              {t('Voir tout', 'See all')}
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                onClick={() => setSelectedVideo(video)}
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer"
              >
                {/* Miniature */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={t(video.title, video.titleEn)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                  
                  {/* Durée */}
                  <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded">
                    {video.duration}
                  </span>
                  
                  {/* Play button on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                      <Play className="w-6 h-6 text-salem-red ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>

                {/* Infos */}
                <div className="p-3">
                  <h3 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-salem-green transition-colors">
                    {t(video.title, video.titleEn)}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <Eye className="w-3 h-3" />
                    <span>{video.views} {t('vues', 'views')}</span>
                    <span>•</span>
                    <span>{video.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistiques */}
        <div 
          ref={statsRef}
          id="stats-section"
          className={`transition-all duration-700 delay-300 ${
            visibleSections.has('stats-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="bg-gradient-to-r from-salem-green to-salem-green-light rounded-2xl p-6 sm:p-8">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-white text-center mb-6">
              {t('Notre Impact', 'Our Impact')}
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-2">
                    <span className="text-white">{stat.icon}</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-white">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-white/80 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Réseaux sociaux */}
        <div 
          ref={socialRef}
          id="social"
          className={`transition-all duration-700 delay-400 ${
            visibleSections.has('social') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              {t('Restez Connectés', 'Stay Connected')}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mb-6">
              {t(
                'Suivez-nous sur les réseaux sociaux pour ne rien manquer',
                'Follow us on social media to never miss anything'
              )}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {/* YouTube */}
              <a
                href="https://www.youtube.com/@salemabundantlifeministry"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium text-sm transition-colors"
              >
                <Youtube className="w-5 h-5" />
                <span className="hidden sm:inline">YouTube</span>
                <span className="sm:hidden">Abonner</span>
              </a>

              {/* Facebook */}
              <a
                href="https://web.facebook.com/salemabundantlifeministry"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium text-sm transition-colors"
              >
                <Facebook className="w-5 h-5" />
                <span className="hidden sm:inline">Facebook</span>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/237697033647"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-medium text-sm transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>

              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@fadasalem"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-900 hover:bg-black text-white rounded-full font-medium text-sm transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                </svg>
                <span className="hidden sm:inline">TikTok</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer spacing */}
      <div className="h-8"></div>
    </div>
  );
};

export default SalemTVSection;
