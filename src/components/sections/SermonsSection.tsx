import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Search, Filter, Download, Share2, Heart, Clock, User,
  ChevronLeft, X, BookOpen, Flame,
  Mic, Video, List, Grid3X3, ChevronRight, Calendar,
  Headphones, PlayCircle, Bookmark
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

// Types
interface Sermon {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  preacher: string;
  preacherEn?: string;
  date: string;
  duration: string;
  durationSeconds: number;
  type: 'video' | 'audio';
  category: string;
  categoryEn: string;
  thumbnail: string;
  videoUrl?: string;
  audioUrl?: string;
  youtubeId?: string;
  views: number;
  isFeatured?: boolean;
  seriesId?: string;
}

interface Series {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  thumbnail: string;
  episodeCount: number;
  category: string;
  categoryEn: string;
}

// Données de démonstration
const sermonCategories = [
  { id: 'all', label: 'Tous', labelEn: 'All', icon: List },
  { id: 'recent', label: 'Récents', labelEn: 'Recent', icon: Clock },
  { id: 'holy-spirit', label: 'Saint-Esprit', labelEn: 'Holy Spirit', icon: Flame },
  { id: 'faith', label: 'Foi', labelEn: 'Faith', icon: BookOpen },
  { id: 'prayer', label: 'Prière', labelEn: 'Prayer', icon: Mic },
  { id: 'healing', label: 'Guérison', labelEn: 'Healing', icon: Heart },
  { id: 'video', label: 'Vidéos', labelEn: 'Videos', icon: Video },
  { id: 'audio', label: 'Audio', labelEn: 'Audio', icon: Headphones },
];

const demoSermons: Sermon[] = [
  {
    id: '1',
    title: 'La Puissance du Saint-Esprit dans ta Vie',
    titleEn: 'The Power of the Holy Spirit in Your Life',
    description: 'Découvrez comment le Saint-Esprit peut transformer chaque aspect de votre vie quotidienne et vous conduire vers une relation plus profonde avec Dieu.',
    descriptionEn: 'Discover how the Holy Spirit can transform every aspect of your daily life and lead you to a deeper relationship with God.',
    preacher: 'Père Salem',
    date: '2025-01-20',
    duration: '52:30',
    durationSeconds: 3150,
    type: 'video',
    category: 'Saint-Esprit',
    categoryEn: 'Holy Spirit',
    thumbnail: '/images/IMG_2367.jpeg',
    youtubeId: 'dQw4w9WgXcQ',
    views: 1234,
    isFeatured: true,
  },
  {
    id: '2',
    title: 'La Foi qui Déplace les Montagnes',
    titleEn: 'Faith that Moves Mountains',
    description: 'Un enseignement profond sur la foi véritable qui permet de voir l\'impossible devenir possible dans notre vie.',
    descriptionEn: 'A deep teaching on true faith that allows us to see the impossible become possible in our lives.',
    preacher: 'Père Salem',
    date: '2025-01-18',
    duration: '45:20',
    durationSeconds: 2720,
    type: 'video',
    category: 'Foi',
    categoryEn: 'Faith',
    thumbnail: '/images/IMG_2463.jpeg',
    youtubeId: 'dQw4w9WgXcQ',
    views: 892,
  },
  {
    id: '3',
    title: 'Méditation du Matin - Psaume 23',
    titleEn: 'Morning Meditation - Psalm 23',
    description: 'Une méditation paisible pour commencer votre journée avec le Seigneur comme berger.',
    descriptionEn: 'A peaceful meditation to start your day with the Lord as your shepherd.',
    preacher: 'Équipe Pastorale',
    preacherEn: 'Pastoral Team',
    date: '2025-01-17',
    duration: '15:45',
    durationSeconds: 945,
    type: 'audio',
    category: 'Prière',
    categoryEn: 'Prayer',
    thumbnail: '/images/IMG_2599.jpeg',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    views: 567,
  },
  {
    id: '4',
    title: 'Prière de Guérison et de Délivrance',
    titleEn: 'Healing and Deliverance Prayer',
    description: 'Session de prière puissante pour la guérison intérieure et la libération des chaînes spirituelles.',
    descriptionEn: 'Powerful prayer session for inner healing and liberation from spiritual chains.',
    preacher: 'Père Salem',
    date: '2025-01-15',
    duration: '1:23:45',
    durationSeconds: 5025,
    type: 'video',
    category: 'Guérison',
    categoryEn: 'Healing',
    thumbnail: '/images/IMG_2628.jpeg',
    youtubeId: 'dQw4w9WgXcQ',
    views: 2341,
  },
  {
    id: '5',
    title: 'Comment Prier avec Puissance',
    titleEn: 'How to Pray with Power',
    description: 'Apprenez les clés d\'une prière efficace qui touche le cœur de Dieu.',
    descriptionEn: 'Learn the keys to effective prayer that touches the heart of God.',
    preacher: 'Père Salem',
    date: '2025-01-12',
    duration: '38:15',
    durationSeconds: 2295,
    type: 'audio',
    category: 'Prière',
    categoryEn: 'Prayer',
    thumbnail: '/images/IMG_2636.jpeg',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    views: 445,
    seriesId: 'series-1',
  },
  {
    id: '6',
    title: 'Vivre dans la Présence de Dieu',
    titleEn: 'Living in God\'s Presence',
    description: 'Comment cultiver une intimité quotidienne avec le Seigneur et demeurer dans Sa présence.',
    descriptionEn: 'How to cultivate daily intimacy with the Lord and remain in His presence.',
    preacher: 'Père Salem',
    date: '2025-01-10',
    duration: '55:00',
    durationSeconds: 3300,
    type: 'video',
    category: 'Saint-Esprit',
    categoryEn: 'Holy Spirit',
    thumbnail: '/images/img7.jpg',
    youtubeId: 'dQw4w9WgXcQ',
    views: 1567,
    seriesId: 'series-2',
  },
];

const demoSeries: Series[] = [
  {
    id: 'series-1',
    title: 'École de la Prière',
    titleEn: 'School of Prayer',
    description: 'Une série complète pour approfondir votre vie de prière',
    descriptionEn: 'A complete series to deepen your prayer life',
    thumbnail: '/images/IMG_2391.jpeg',
    episodeCount: 8,
    category: 'Prière',
    categoryEn: 'Prayer',
  },
  {
    id: 'series-2',
    title: 'Marcher dans l\'Esprit',
    titleEn: 'Walking in the Spirit',
    description: 'Découvrez comment être conduit par le Saint-Esprit au quotidien',
    descriptionEn: 'Discover how to be led by the Holy Spirit daily',
    thumbnail: '/images/IMG_2319.jpeg',
    episodeCount: 12,
    category: 'Saint-Esprit',
    categoryEn: 'Holy Spirit',
  },
];

interface SermonsPageProps {
  onBack?: () => void;
}

const SermonsSection: React.FC<SermonsPageProps> = ({ onBack }) => {
  const { language } = useLanguage();
  const t = (fr: string, en: string) => language === 'fr' ? fr : en;

  // États
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedSermon, setSelectedSermon] = useState<Sermon | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen] = useState(false);
  const [miniPlayerSermon, setMiniPlayerSermon] = useState<Sermon | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [likedSermons, setLikedSermons] = useState<string[]>([]);
  const [savedSermons, setSavedSermons] = useState<string[]>([]);

  const audioRef = useRef<HTMLAudioElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  // Filtrer les sermons
  const filteredSermons = demoSermons.filter(sermon => {
    const matchesCategory = selectedCategory === 'all' || 
      selectedCategory === 'recent' ||
      (selectedCategory === 'video' && sermon.type === 'video') ||
      (selectedCategory === 'audio' && sermon.type === 'audio') ||
      sermon.category.toLowerCase().includes(selectedCategory.replace('-', ' ')) ||
      sermon.categoryEn.toLowerCase().includes(selectedCategory.replace('-', ' '));
    
    const matchesSearch = searchQuery === '' ||
      sermon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sermon.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sermon.preacher.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Sermon en vedette
  const featuredSermon = demoSermons.find(s => s.isFeatured) || demoSermons[0];

  // Gestion audio
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleShare = async (sermon: Sermon) => {
    const shareData = {
      title: language === 'fr' ? sermon.title : sermon.titleEn,
      text: language === 'fr' ? sermon.description : sermon.descriptionEn,
      url: window.location.href,
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(t('Lien copié !', 'Link copied!'));
    }
  };

  const toggleLike = (sermonId: string) => {
    setLikedSermons(prev => 
      prev.includes(sermonId) 
        ? prev.filter(id => id !== sermonId)
        : [...prev, sermonId]
    );
  };

  const toggleSave = (sermonId: string) => {
    setSavedSermons(prev => 
      prev.includes(sermonId) 
        ? prev.filter(id => id !== sermonId)
        : [...prev, sermonId]
    );
  };

  const playSermon = (sermon: Sermon) => {
    setSelectedSermon(sermon);
    setMiniPlayerSermon(sermon);
    setIsPlaying(true);
    setCurrentTime(0);
  };

  const closePlayer = () => {
    setSelectedSermon(null);
    setIsPlaying(false);
  };

  const minimizePlayer = () => {
    setSelectedSermon(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Container centré avec max-width pour éviter les images floues */}
      <div className="max-w-4xl mx-auto">
        {/* Header fixe */}
        <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
            )}
            <h1 className="text-lg sm:text-xl font-serif font-bold text-white">
              {t('Sermons & Enseignements', 'Sermons & Teachings')}
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <Search className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors md:hidden"
            >
              <Filter className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Barre de recherche */}
        {showSearch && (
          <div className="px-4 pb-3 animate-fade-in-up">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('Rechercher un sermon...', 'Search sermons...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-salem-gold/50"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Filtres horizontaux (mobile) */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 px-4 pb-3 min-w-max">
            {sermonCategories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-salem-gold text-slate-900'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{language === 'fr' ? cat.label : cat.labelEn}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="pb-24">
        {/* Sermon en vedette */}
        {!searchQuery && selectedCategory === 'all' && (
          <section className="p-4">
            <div 
              className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-salem-green/20 to-salem-red/20 border border-white/10 cursor-pointer group max-w-2xl mx-auto"
              onClick={() => playSermon(featuredSermon)}
            >
              {/* Badge */}
              <div className="absolute top-3 left-3 z-10">
                <span className="px-2.5 py-1 bg-salem-red text-white text-xs font-bold rounded-full flex items-center gap-1">
                  <Flame className="w-3 h-3" />
                  {t('En vedette', 'Featured')}
                </span>
              </div>

              {/* Thumbnail - Taille contrôlée */}
              <div className="relative aspect-video max-h-[280px] sm:max-h-[320px] md:max-h-[360px] overflow-hidden">
                <img
                  src={featuredSermon.thumbnail}
                  alt={language === 'fr' ? featuredSermon.title : featuredSermon.titleEn}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 group-hover:bg-white/30 transition-all">
                    <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-white ml-1" />
                  </div>
                </div>

                {/* Durée */}
                <div className="absolute bottom-3 right-3">
                  <span className="px-2 py-1 bg-black/70 text-white text-xs rounded">
                    {featuredSermon.duration}
                  </span>
                </div>
              </div>

              {/* Infos */}
              <div className="p-4">
                <h2 className="text-lg sm:text-xl font-serif font-bold text-white mb-1 line-clamp-2">
                  {language === 'fr' ? featuredSermon.title : featuredSermon.titleEn}
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                  <User className="w-4 h-4" />
                  <span>{language === 'en' && featuredSermon.preacherEn ? featuredSermon.preacherEn : featuredSermon.preacher}</span>
                  <span>•</span>
                  <span>{new Date(featuredSermon.date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'short' })}</span>
                </div>
                <p className="text-sm text-gray-400 line-clamp-2">
                  {language === 'fr' ? featuredSermon.description : featuredSermon.descriptionEn}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Séries (carousel) */}
        {!searchQuery && selectedCategory === 'all' && (
          <section className="mb-6">
            <div className="flex items-center justify-between px-4 mb-3">
              <h2 className="text-lg font-serif font-bold text-white">
                {t('Séries d\'enseignements', 'Teaching Series')}
              </h2>
              <button className="text-salem-gold text-sm font-medium flex items-center gap-1 hover:underline">
                {t('Voir tout', 'See all')}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-3 px-4 min-w-max">
                {demoSeries.map((series) => (
                  <div
                    key={series.id}
                    className="w-36 sm:w-40 flex-shrink-0 rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-salem-gold/50 transition-all cursor-pointer group"
                  >
                    <div className="relative aspect-square max-h-36 sm:max-h-40 overflow-hidden">
                      <img
                        src={series.thumbnail}
                        alt={language === 'fr' ? series.title : series.titleEn}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2">
                        <span className="px-2 py-0.5 bg-salem-green/80 text-white text-[10px] rounded-full">
                          {series.episodeCount} {t('épisodes', 'episodes')}
                        </span>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-white line-clamp-1">
                        {language === 'fr' ? series.title : series.titleEn}
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {language === 'fr' ? series.category : series.categoryEn}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Options d'affichage (desktop) */}
        <div className="hidden md:flex items-center justify-between px-4 mb-4">
          <p className="text-gray-400 text-sm">
            {filteredSermons.length} {t('sermons trouvés', 'sermons found')}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-salem-gold text-slate-900' : 'bg-white/10 text-white'}`}
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-salem-gold text-slate-900' : 'bg-white/10 text-white'}`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Liste des sermons */}
        <section className="px-4">
          <h2 className="text-lg font-serif font-bold text-white mb-3">
            {selectedCategory === 'all' 
              ? t('Tous les sermons', 'All Sermons')
              : selectedCategory === 'recent'
              ? t('Sermons récents', 'Recent Sermons')
              : t('Résultats', 'Results')
            }
          </h2>

          <div className={`grid gap-3 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-2' : 'grid-cols-1'} max-w-3xl mx-auto`}>
            {filteredSermons.map((sermon) => (
              <div
                key={sermon.id}
                className={`bg-white/5 rounded-xl border border-white/10 overflow-hidden hover:border-salem-gold/30 transition-all group cursor-pointer ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
                onClick={() => playSermon(sermon)}
              >
                {/* Thumbnail - Taille contrôlée */}
                <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-24 sm:w-32 flex-shrink-0' : 'aspect-video max-h-32 sm:max-h-40'}`}>
                  <img
                    src={sermon.thumbnail}
                    alt={language === 'fr' ? sermon.title : sermon.titleEn}
                    className={`w-full h-full object-cover ${viewMode === 'list' ? 'aspect-square' : ''}`}
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <PlayCircle className="w-10 h-10 text-white" />
                  </div>
                  
                  {/* Type badge */}
                  <div className="absolute top-2 left-2">
                    {sermon.type === 'video' ? (
                      <Video className="w-4 h-4 text-white drop-shadow-lg" />
                    ) : (
                      <Headphones className="w-4 h-4 text-white drop-shadow-lg" />
                    )}
                  </div>
                  
                  {/* Duration */}
                  <div className="absolute bottom-2 right-2">
                    <span className="px-1.5 py-0.5 bg-black/70 text-white text-[10px] rounded">
                      {sermon.duration}
                    </span>
                  </div>
                </div>

                {/* Infos */}
                <div className="p-3 flex-1 min-w-0">
                  <h3 className={`font-semibold text-white mb-1 ${viewMode === 'list' ? 'text-sm line-clamp-2' : 'text-sm line-clamp-2'}`}>
                    {language === 'fr' ? sermon.title : sermon.titleEn}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                    <span>{language === 'en' && sermon.preacherEn ? sermon.preacherEn : sermon.preacher}</span>
                    <span>•</span>
                    <span>{new Date(sermon.date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'short' })}</span>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleLike(sermon.id); }}
                      className={`p-1.5 rounded-full transition-colors ${likedSermons.includes(sermon.id) ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-gray-400 hover:text-white'}`}
                    >
                      <Heart className={`w-4 h-4 ${likedSermons.includes(sermon.id) ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleSave(sermon.id); }}
                      className={`p-1.5 rounded-full transition-colors ${savedSermons.includes(sermon.id) ? 'bg-salem-gold/20 text-salem-gold' : 'bg-white/10 text-gray-400 hover:text-white'}`}
                    >
                      <Bookmark className={`w-4 h-4 ${savedSermons.includes(sermon.id) ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleShare(sermon); }}
                      className="p-1.5 rounded-full bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <span className="ml-auto text-xs text-gray-500">
                      {sermon.views} {t('vues', 'views')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredSermons.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">{t('Aucun sermon trouvé', 'No sermons found')}</p>
            </div>
          )}

          {/* Charger plus */}
          {filteredSermons.length > 0 && (
            <button className="w-full mt-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-colors">
              {t('Charger plus de sermons', 'Load more sermons')}
            </button>
          )}
        </section>
      </main>

      {/* Mini-lecteur (fixe en bas) */}
      {miniPlayerSermon && !selectedSermon && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/98 backdrop-blur-lg border-t border-white/10 safe-area-bottom">
          <div className="flex items-center gap-3 p-3">
            <img
              src={miniPlayerSermon.thumbnail}
              alt=""
              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0" onClick={() => setSelectedSermon(miniPlayerSermon)}>
              <p className="text-sm font-medium text-white truncate">
                {language === 'fr' ? miniPlayerSermon.title : miniPlayerSermon.titleEn}
              </p>
              <p className="text-xs text-gray-400">{language === 'en' && miniPlayerSermon.preacherEn ? miniPlayerSermon.preacherEn : miniPlayerSermon.preacher}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 rounded-full bg-salem-gold flex items-center justify-center"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-slate-900" />
                ) : (
                  <Play className="w-5 h-5 text-slate-900 ml-0.5" />
                )}
              </button>
              <button
                onClick={() => { setMiniPlayerSermon(null); setIsPlaying(false); }}
                className="p-2 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-1 bg-white/10">
            <div 
              className="h-full bg-salem-gold transition-all"
              style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Modal lecteur plein écran */}
      {selectedSermon && (
        <div className="fixed inset-0 z-50 bg-black">
          {/* Header du lecteur */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
            <div className="flex items-center justify-between">
              <button
                onClick={minimizePlayer}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShare(selectedSermon)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <Share2 className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={closePlayer}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Contenu du lecteur */}
          <div className="h-full flex flex-col">
            {/* Zone vidéo/audio - Taille contrôlée */}
            <div 
              ref={videoContainerRef}
              className={`relative flex-1 flex items-center justify-center bg-black ${isFullscreen ? '' : 'max-h-[45vh] sm:max-h-[50vh]'}`}
            >
              {selectedSermon.type === 'video' && selectedSermon.youtubeId ? (
                <div className="w-full h-full max-w-3xl mx-auto">
                  <iframe
                    src={`https://www.youtube.com/embed/${selectedSermon.youtubeId}?autoplay=1&rel=0`}
                    className="w-full h-full"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-salem-green/20 to-salem-red/20 p-6">
                  <img
                    src={selectedSermon.thumbnail}
                    alt=""
                    className="w-28 h-28 sm:w-40 sm:h-40 rounded-2xl object-cover shadow-2xl mb-4"
                  />
                  <Headphones className="w-12 h-12 text-salem-gold mb-4" />
                  <p className="text-white/60 text-sm">{t('Lecture audio', 'Audio playback')}</p>
                </div>
              )}
            </div>

            {/* Infos et contrôles */}
            <div className="bg-slate-900 p-4 sm:p-6 overflow-y-auto">
              <h2 className="text-lg sm:text-xl font-serif font-bold text-white mb-2">
                {language === 'fr' ? selectedSermon.title : selectedSermon.titleEn}
              </h2>
              <div className="flex items-center gap-3 text-sm text-gray-400 mb-4">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {language === 'en' && selectedSermon.preacherEn ? selectedSermon.preacherEn : selectedSermon.preacher}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(selectedSermon.date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
                </span>
              </div>

              {/* Contrôles audio (si type audio) */}
              {selectedSermon.type === 'audio' && selectedSermon.audioUrl && (
                <div className="bg-white/5 rounded-xl p-4 mb-4">
                  <audio
                    ref={audioRef}
                    src={selectedSermon.audioUrl}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleTimeUpdate}
                  />
                  
                  {/* Progress bar */}
                  <div className="mb-4">
                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-salem-gold"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Boutons de contrôle */}
                  <div className="flex items-center justify-center gap-6">
                    <button className="p-2 text-white/70 hover:text-white transition-colors">
                      <SkipBack className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-14 h-14 rounded-full bg-salem-gold flex items-center justify-center hover:scale-105 transition-transform"
                    >
                      {isPlaying ? (
                        <Pause className="w-7 h-7 text-slate-900" />
                      ) : (
                        <Play className="w-7 h-7 text-slate-900 ml-1" />
                      )}
                    </button>
                    <button className="p-2 text-white/70 hover:text-white transition-colors">
                      <SkipForward className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Volume */}
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={isMuted ? 0 : volume}
                      onChange={(e) => { setVolume(parseFloat(e.target.value)); setIsMuted(false); }}
                      className="w-24 h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-white mb-2">{t('Description', 'Description')}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {language === 'fr' ? selectedSermon.description : selectedSermon.descriptionEn}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => toggleLike(selectedSermon.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                    likedSermons.includes(selectedSermon.id)
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${likedSermons.includes(selectedSermon.id) ? 'fill-current' : ''}`} />
                  <span className="text-sm">{t('J\'aime', 'Like')}</span>
                </button>
                <button 
                  onClick={() => toggleSave(selectedSermon.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                    savedSermons.includes(selectedSermon.id)
                      ? 'bg-salem-gold/20 text-salem-gold'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${savedSermons.includes(selectedSermon.id) ? 'fill-current' : ''}`} />
                  <span className="text-sm">{t('Sauvegarder', 'Save')}</span>
                </button>
                <button 
                  onClick={() => handleShare(selectedSermon)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm">{t('Partager', 'Share')}</span>
                </button>
                {selectedSermon.audioUrl && (
                  <a 
                    href={selectedSermon.audioUrl}
                    download
                    className="flex items-center gap-2 px-4 py-2 bg-salem-green text-white rounded-full hover:bg-salem-green-light transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-sm">{t('Télécharger', 'Download')}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Style pour masquer la scrollbar horizontale */}
      {/* Style pour masquer la scrollbar horizontale */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom, 0);
        }
      `}</style>
      </div>{/* Fin container max-w-4xl */}
    </div>
  );
};

export default SermonsSection;
