import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, MapPin, Users, ChevronRight, Flame, CalendarPlus, Sparkles } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// Countdown Component
const CountdownTimer: React.FC<{ targetDate: Date }> = ({ targetDate }) => {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const timeUnits = [
    { value: timeLeft.days, label: t('Jours', 'Days') },
    { value: timeLeft.hours, label: t('Heures', 'Hours') },
    { value: timeLeft.minutes, label: t('Minutes', 'Minutes') },
    { value: timeLeft.seconds, label: t('Secondes', 'Seconds') },
  ];

  return (
    <div className="flex justify-center gap-3 md:gap-4">
      {timeUnits.map((unit, index) => (
        <div key={index} className="text-center">
          <div className="relative">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
              <span className="text-2xl md:text-3xl font-bold text-white">
                {String(unit.value).padStart(2, '0')}
              </span>
            </div>
            {/* Decorative corner */}
            <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-salem-gold rounded-tr-lg" />
          </div>
          <span className="text-white/70 text-xs md:text-sm mt-2 block">{unit.label}</span>
        </div>
      ))}
    </div>
  );
};

const EventsSection: React.FC = () => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Next major event - set to a date in the future
  const nextEventDate = new Date();
  nextEventDate.setDate(nextEventDate.getDate() + 45); // 45 days from now

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const upcomingEvents = [
    {
      id: 1,
      title: t('Messe Dominicale', 'Sunday Mass'),
      date: t('Chaque Dimanche', 'Every Sunday'),
      time: '09:00',
      location: 'Bafia, Cameroun',
      type: 'mass',
      recurring: true,
    },
    {
      id: 2,
      title: t('Veillée de Prière', 'Prayer Vigil'),
      date: t('Chaque Vendredi', 'Every Friday'),
      time: '21:00',
      location: t('En ligne & Sur place', 'Online & On-site'),
      type: 'prayer',
      recurring: true,
    },
    {
      id: 3,
      title: t('Prière du Matin', 'Morning Prayer'),
      date: t('Lun - Ven', 'Mon - Fri'),
      time: '06:00',
      location: t('Salle Virtuelle', 'Virtual Room'),
      type: 'prayer',
      recurring: true,
    },
    {
      id: 4,
      title: t('Formation Biblique', 'Bible Study'),
      date: t('Chaque Mercredi', 'Every Wednesday'),
      time: '18:00',
      location: t('En ligne', 'Online'),
      type: 'teaching',
      recurring: true,
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'mass': return 'from-salem-red to-red-600';
      case 'prayer': return 'from-salem-green to-salem-green-light';
      case 'teaching': return 'from-salem-gold to-yellow-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'mass': return t('Messe', 'Mass');
      case 'prayer': return t('Prière', 'Prayer');
      case 'teaching': return t('Enseignement', 'Teaching');
      default: return type;
    }
  };

  return (
    <section ref={sectionRef} id="events" className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-salem-green/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-salem-gold/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Featured Event / Countdown */}
        <div className={`mb-16 md:mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-gradient-to-br from-salem-green via-salem-green-dark to-black rounded-3xl overflow-hidden shadow-2xl relative">
            {/* Background image overlay */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'url(/images/IMG_2628.jpeg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-salem-green-dark/90 to-transparent" />
            
            <div className="relative z-10 p-8 md:p-12 lg:p-16">
              <div className="max-w-3xl mx-auto text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-salem-red/20 border border-salem-red/30 rounded-full mb-6">
                  <Flame className="w-4 h-4 text-salem-red-light animate-flame" />
                  <span className="text-salem-red-light font-semibold text-sm uppercase tracking-wider">
                    {t('Prochain Événement', 'Next Event')}
                  </span>
                </div>

                {/* Event Title */}
                <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                  {t('Grande Retraite Charismatique 2025', 'Great Charismatic Retreat 2025')}
                </h3>
                
                {/* Event Details */}
                <div className="flex flex-wrap justify-center gap-6 text-white/80 mb-8">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-salem-gold" />
                    <span>{nextEventDate.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-salem-gold" />
                    <span>Bafia, Cameroun</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-salem-gold" />
                    <span>500+ {t('Participants', 'Participants')}</span>
                  </div>
                </div>

                {/* Countdown */}
                <CountdownTimer targetDate={nextEventDate} />

                {/* CTA */}
                <button className="mt-10 px-8 py-4 bg-salem-gold hover:bg-salem-gold-light text-salem-green-dark font-bold rounded-full transition-all hover:shadow-xl hover:-translate-y-1 inline-flex items-center gap-2">
                  <CalendarPlus className="w-5 h-5" />
                  {t("S'inscrire", 'Register')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className={`text-center mb-12 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-salem-green/10 rounded-full mb-4">
            <Calendar className="w-4 h-4 text-salem-green" />
            <span className="text-salem-green font-semibold text-sm uppercase tracking-wider">
              {t('Activités Régulières', 'Regular Activities')}
            </span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('Rejoignez-nous ', 'Join Us ')}
            <span className="text-gradient-fire">{t('Chaque Semaine', 'Every Week')}</span>
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-1 bg-gradient-to-r from-salem-green to-transparent rounded-full" />
            <Sparkles className="w-4 h-4 text-salem-gold" />
            <div className="w-12 h-1 bg-gradient-to-l from-salem-red to-transparent rounded-full" />
          </div>
        </div>

        {/* Events Grid */}
        <div className={`grid md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {upcomingEvents.map((event, index) => (
            <div
              key={event.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Type indicator */}
              <div className={`h-1.5 bg-gradient-to-r ${getTypeColor(event.type)}`} />
              
              <div className="p-6">
                {/* Type badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getTypeColor(event.type)}`}>
                    {getTypeLabel(event.type)}
                  </span>
                  {event.recurring && (
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-salem-green rounded-full animate-pulse" />
                      {t('Récurrent', 'Recurring')}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h4 className="font-serif font-bold text-xl text-gray-900 mb-4 group-hover:text-salem-green transition-colors">
                  {event.title}
                </h4>

                {/* Details */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar className="w-4 h-4 text-salem-green flex-shrink-0" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Clock className="w-4 h-4 text-salem-gold flex-shrink-0" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin className="w-4 h-4 text-salem-red flex-shrink-0" />
                    <span>{event.location}</span>
                  </div>
                </div>

                {/* Action */}
                <button className="mt-6 w-full py-3 bg-gray-100 hover:bg-salem-green hover:text-white text-gray-700 rounded-xl font-medium transition-all flex items-center justify-center gap-2 group/btn">
                  {t('Plus de détails', 'More details')}
                  <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
