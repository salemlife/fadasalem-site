import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Calendar, Clock, MapPin, Users, ChevronRight, 
  Filter, CalendarDays, Church, Flame, BookOpen,
  Play, Image as ImageIcon, ChevronLeft
} from 'lucide-react';

interface EventsPageProps {
  onNavigate?: (page: string) => void;
}

const EventsPage: React.FC<EventsPageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Animation au scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Compte à rebours
  useEffect(() => {
    const targetDate = new Date('2025-03-15T09:00:00');
    
    const updateCountdown = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      
      if (diff > 0) {
        setCountdown({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const filters = [
    { id: 'all', labelFr: 'Tous', labelEn: 'All', icon: CalendarDays },
    { id: 'mass', labelFr: 'Messes', labelEn: 'Masses', icon: Church },
    { id: 'retreat', labelFr: 'Retraites', labelEn: 'Retreats', icon: Flame },
    { id: 'conference', labelFr: 'Conférences', labelEn: 'Conferences', icon: BookOpen },
    { id: 'prayer', labelFr: 'Prière', labelEn: 'Prayer', icon: Users }
  ];

  const upcomingEvents = [
    {
      id: 1,
      type: 'retreat',
      titleFr: 'Grande Retraite Charismatique 2025',
      titleEn: 'Great Charismatic Retreat 2025',
      descFr: 'Trois jours de prière intense, d\'enseignement et de guérison avec le Père Salem.',
      descEn: 'Three days of intense prayer, teaching and healing with Father Salem.',
      date: '2025-03-15',
      time: '09:00',
      endDate: '2025-03-17',
      location: 'Bafia, Cameroun',
      image: '/images/IMG_2628.jpeg',
      featured: true,
      spots: 500,
      registered: 342
    },
    {
      id: 2,
      type: 'mass',
      titleFr: 'Messe Dominicale Spéciale',
      titleEn: 'Special Sunday Mass',
      descFr: 'Célébration eucharistique avec prière de guérison et délivrance.',
      descEn: 'Eucharistic celebration with healing and deliverance prayer.',
      date: '2025-02-02',
      time: '09:00',
      location: 'Église SALEM, Bafia',
      image: '/images/IMG_2599.jpeg',
      featured: false,
      spots: 200,
      registered: 180
    },
    {
      id: 3,
      type: 'prayer',
      titleFr: 'Veillée de Prière Mensuelle',
      titleEn: 'Monthly Prayer Vigil',
      descFr: 'Nuit de louange, d\'adoration et d\'intercession puissante.',
      descEn: 'Night of praise, worship and powerful intercession.',
      date: '2025-02-07',
      time: '21:00',
      location: 'En ligne & Présentiel',
      image: '/images/IMG_2367.jpeg',
      featured: false,
      spots: null,
      registered: null
    },
    {
      id: 4,
      type: 'conference',
      titleFr: 'Conférence: Vivre dans l\'Esprit',
      titleEn: 'Conference: Living in the Spirit',
      descFr: 'Enseignement approfondi sur la vie dans le Saint-Esprit.',
      descEn: 'In-depth teaching on life in the Holy Spirit.',
      date: '2025-02-15',
      time: '15:00',
      location: 'Centre Pastoral, Bafia',
      image: '/images/IMG_2463.jpeg',
      featured: false,
      spots: 100,
      registered: 45
    },
    {
      id: 5,
      type: 'mass',
      titleFr: 'Messe de Guérison',
      titleEn: 'Healing Mass',
      descFr: 'Messe spéciale avec onction des malades et prière de guérison.',
      descEn: 'Special mass with anointing of the sick and healing prayer.',
      date: '2025-02-20',
      time: '10:00',
      location: 'Église SALEM, Bafia',
      image: '/images/IMG_2636.jpeg',
      featured: false,
      spots: 150,
      registered: 98
    }
  ];

  const pastEvents = [
    {
      id: 101,
      titleFr: 'Retraite de Carême 2024',
      titleEn: 'Lenten Retreat 2024',
      date: '2024-03-10',
      images: ['/images/IMG_2391.jpeg', '/images/img5.jpg'],
      participants: 450
    },
    {
      id: 102,
      titleFr: 'Conférence Internationale',
      titleEn: 'International Conference',
      date: '2024-06-15',
      images: ['/images/IMG_2319.jpeg', '/images/img7.jpg'],
      participants: 800
    },
    {
      id: 103,
      titleFr: 'Veillée de Noël 2024',
      titleEn: 'Christmas Vigil 2024',
      date: '2024-12-24',
      images: ['/images/img9.jpg', '/images/IMG_2628.jpeg'],
      participants: 600
    }
  ];

  const featuredEvent = upcomingEvents.find(e => e.featured);
  const filteredEvents = activeFilter === 'all' 
    ? upcomingEvents.filter(e => !e.featured)
    : upcomingEvents.filter(e => e.type === activeFilter && !e.featured);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(t('fr-FR', 'en-US'), { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'mass': return 'bg-salem-green';
      case 'retreat': return 'bg-salem-red';
      case 'conference': return 'bg-blue-500';
      case 'prayer': return 'bg-salem-gold';
      default: return 'bg-gray-500';
    }
  };

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'mass': return t('Messe', 'Mass');
      case 'retreat': return t('Retraite', 'Retreat');
      case 'conference': return t('Conférence', 'Conference');
      case 'prayer': return t('Prière', 'Prayer');
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section avec Compte à Rebours */}
      <section className="relative h-[70vh] min-h-[500px] max-h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={featuredEvent?.image || '/images/IMG_2628.jpeg'} 
            alt="Event"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40" />
        </div>
        
        {/* Particules */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-salem-gold/50 rounded-full animate-float"
              style={{
                left: `${10 + i * 12}%`,
                top: `${15 + (i % 4) * 20}%`,
                animationDelay: `${i * 0.4}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-salem-red/90 text-white px-4 py-2 rounded-full mb-4">
            <Flame className="w-4 h-4" />
            <span className="text-sm font-medium">
              {t('Événement à venir', 'Upcoming Event')}
            </span>
          </div>

          {/* Titre */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 max-w-3xl">
            {featuredEvent && t(featuredEvent.titleFr, featuredEvent.titleEn)}
          </h1>

          {/* Infos */}
          <div className="flex flex-wrap justify-center gap-4 mb-8 text-white/80">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-salem-gold" />
              <span>{featuredEvent && formatDate(featuredEvent.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-salem-gold" />
              <span>{featuredEvent?.location}</span>
            </div>
          </div>

          {/* Compte à Rebours */}
          <div className="grid grid-cols-4 gap-3 sm:gap-6 mb-8">
            {[
              { value: countdown.days, labelFr: 'Jours', labelEn: 'Days' },
              { value: countdown.hours, labelFr: 'Heures', labelEn: 'Hours' },
              { value: countdown.minutes, labelFr: 'Minutes', labelEn: 'Minutes' },
              { value: countdown.seconds, labelFr: 'Secondes', labelEn: 'Seconds' }
            ].map((item, index) => (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 min-w-[70px] sm:min-w-[90px]"
              >
                <div className="text-2xl sm:text-4xl font-bold text-white">
                  {String(item.value).padStart(2, '0')}
                </div>
                <div className="text-xs sm:text-sm text-white/70">
                  {t(item.labelFr, item.labelEn)}
                </div>
              </div>
            ))}
          </div>

          {/* Bouton */}
          <button 
            onClick={() => setSelectedEvent(featuredEvent?.id || null)}
            className="bg-salem-gold hover:bg-salem-gold-light text-white px-8 py-3 rounded-full font-semibold transition-all flex items-center gap-2 shadow-lg"
          >
            {t('S\'inscrire maintenant', 'Register Now')}
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Jauge d'inscription */}
          {featuredEvent?.spots && (
            <div className="mt-6 w-full max-w-xs">
              <div className="flex justify-between text-sm text-white/70 mb-2">
                <span>{featuredEvent.registered} {t('inscrits', 'registered')}</span>
                <span>{featuredEvent.spots} {t('places', 'spots')}</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-salem-gold rounded-full transition-all duration-500"
                  style={{ width: `${(featuredEvent.registered! / featuredEvent.spots) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Vague */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-16">
            <path 
              fill="#ffffff" 
              d="M0,64L60,69.3C120,75,240,85,360,80C480,75,600,53,720,48C840,43,960,53,1080,64C1200,75,1320,85,1380,90.7L1440,96L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
            />
          </svg>
        </div>
      </section>

      {/* Filtres */}
      <section className="py-8 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <Filter className="w-5 h-5 text-gray-500" />
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeFilter === filter.id
                      ? 'bg-salem-green text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <filter.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{t(filter.labelFr, filter.labelEn)}</span>
                </button>
              ))}
            </div>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            {t('Événements à venir', 'Upcoming Events')}
          </h2>

          {/* Liste des événements */}
          <div 
            id="events-list" 
            data-animate
            className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 ${
              visibleSections.has('events-list') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {filteredEvents.map((event) => (
              <div 
                key={event.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all group cursor-pointer"
                onClick={() => setSelectedEvent(event.id)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={t(event.titleFr, event.titleEn)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`${getTypeColor(event.type)} text-white text-xs px-3 py-1 rounded-full`}>
                      {getTypeLabel(event.type)}
                    </span>
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className="font-serif font-bold text-gray-900 mb-2 line-clamp-2">
                    {t(event.titleFr, event.titleEn)}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {t(event.descFr, event.descEn)}
                  </p>
                  
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-salem-green" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-salem-green" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-salem-green" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  {event.spots && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>{event.registered}/{event.spots} {t('places', 'spots')}</span>
                        <span>{Math.round((event.registered! / event.spots) * 100)}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-salem-green rounded-full"
                          style={{ width: `${(event.registered! / event.spots) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {t('Aucun événement dans cette catégorie', 'No events in this category')}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Archives */}
      <section 
        id="archives" 
        data-animate
        className={`py-16 bg-gray-50 transition-all duration-700 ${
          visibleSections.has('archives') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-salem-gold/10 text-salem-gold rounded-full text-sm font-medium mb-4">
              {t('Souvenirs', 'Memories')}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t('Événements Passés', 'Past Events')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('Revivez les moments forts de notre communauté', 'Relive the highlights of our community')}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map((event) => (
              <div 
                key={event.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={event.images[0]} 
                    alt={t(event.titleFr, event.titleEn)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button className="bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-colors">
                      <ImageIcon className="w-6 h-6 text-white" />
                    </button>
                    <button className="bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-colors">
                      <Play className="w-6 h-6 text-white" />
                    </button>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    <span>{event.images.length}</span>
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className="font-serif font-bold text-gray-900 mb-2">
                    {t(event.titleFr, event.titleEn)}
                  </h3>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{event.participants}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-salem-green via-salem-green-dark to-salem-green relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-salem-gold rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
            {t('Ne manquez aucun événement', 'Don\'t miss any event')}
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            {t('Rejoignez notre communauté et restez informé de tous nos événements spirituels.', 
               'Join our community and stay informed about all our spiritual events.')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => onNavigate?.('contact')}
              className="bg-white text-salem-green px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              {t('Nous Contacter', 'Contact Us')}
              <ChevronRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => onNavigate?.('virtual-room')}
              className="bg-salem-gold text-white px-8 py-3 rounded-full font-semibold hover:bg-salem-gold-light transition-colors flex items-center justify-center gap-2"
            >
              {t('Salle de Prière', 'Prayer Room')}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Modal Événement */}
      {selectedEvent && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedEvent(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const event = upcomingEvents.find(e => e.id === selectedEvent);
              if (!event) return null;
              
              return (
                <>
                  <div className="relative h-48">
                    <img 
                      src={event.image} 
                      alt={t(event.titleFr, event.titleEn)}
                      className="w-full h-full object-cover"
                    />
                    <button 
                      onClick={() => setSelectedEvent(null)}
                      className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="absolute top-4 left-4">
                      <span className={`${getTypeColor(event.type)} text-white text-xs px-3 py-1 rounded-full`}>
                        {getTypeLabel(event.type)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-serif text-2xl font-bold text-gray-900 mb-4">
                      {t(event.titleFr, event.titleEn)}
                    </h3>
                    
                    <p className="text-gray-600 mb-6">
                      {t(event.descFr, event.descEn)}
                    </p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-gray-700">
                        <Calendar className="w-5 h-5 text-salem-green" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <Clock className="w-5 h-5 text-salem-green" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <MapPin className="w-5 h-5 text-salem-green" />
                        <span>{event.location}</span>
                      </div>
                    </div>

                    {event.spots && (
                      <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>{t('Places restantes', 'Remaining spots')}</span>
                          <span className="font-semibold">{event.spots - event.registered!}</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-salem-green rounded-full"
                            style={{ width: `${(event.registered! / event.spots) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="flex gap-3">
                      <button 
                        className="flex-1 bg-salem-green text-white py-3 rounded-xl font-semibold hover:bg-salem-green-dark transition-colors"
                        onClick={() => {
                          alert(t('Inscription envoyée!', 'Registration sent!'));
                          setSelectedEvent(null);
                        }}
                      >
                        {t('S\'inscrire', 'Register')}
                      </button>
                      <button 
                        className="px-6 py-3 border-2 border-gray-200 rounded-xl font-semibold hover:border-salem-green hover:text-salem-green transition-colors"
                        onClick={() => setSelectedEvent(null)}
                      >
                        {t('Fermer', 'Close')}
                      </button>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
