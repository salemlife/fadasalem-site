import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { NavigationProvider, useNavigation } from './contexts/NavigationContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Preloader from './components/ui/Preloader';
import FloatingButtons from './components/ui/FloatingButtons';

// Sections for Home Page (aperçus compacts)
import HeroSection from './components/sections/HeroSection';
import VerseOfDay from './components/ui/VerseOfDay';

// Separate Pages (pages complètes)
import AboutPage from './components/sections/AboutPage';
import EventsPage from './components/EventsPage';
import ContactSection from './components/sections/ContactSection';
import SalemTVSection from './components/sections/SalemTVSection';
import VirtualRoom from './components/VirtualRoom';
import SermonsSection from './components/sections/SermonsSection';
import MaintenanceSection from './components/MaintenanceSection';
import RPSDSection from './components/sections/RPSDSection';

// Home Page Component - Shows hero + verse + aperçus compacts
const HomePage: React.FC = () => {
  const { navigateTo } = useNavigation();
  const { t, language } = useLanguage();

  const events = language === 'fr'
    ? [
        { title: 'Grande Retraite 2025', date: '15-17 Mars', type: 'Retraite', image: '/images/IMG_2628.jpeg' },
        { title: 'Messe Dominicale', date: 'Chaque Dimanche', type: 'Messe', image: '/images/IMG_2599.jpeg' },
        { title: 'Veillée de Prière', date: 'Chaque Vendredi', type: 'Prière', image: '/images/IMG_2367.jpeg' }
      ]
    : [
        { title: 'Grand Retreat 2025', date: 'Mar 15-17', type: 'Retreat', image: '/images/IMG_2628.jpeg' },
        { title: 'Sunday Mass', date: 'Every Sunday', type: 'Mass', image: '/images/IMG_2599.jpeg' },
        { title: 'Prayer Vigil', date: 'Every Friday', type: 'Prayer', image: '/images/IMG_2367.jpeg' }
      ];

  return (
    <>
      <HeroSection />
      <VerseOfDay />

      {/* Aperçu À Propos - compact */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-2 bg-salem-green/10 text-salem-green rounded-full text-sm font-medium mb-4">
              Spirit Abundant Life Evangelical Movement
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {t('Ministère SALEM', 'SALEM Ministry')}
            </h2>
            <p className="font-lora text-salem-gold italic text-lg mb-6">
              {t('"Le Saint-Esprit nous donne la vie abondante"', '"The Holy Spirit gives us abundant life"')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img
                src="/images/peresalem4.jpeg"
                alt="Fada Salem"
                className="w-full h-64 md:h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="font-semibold">Fada SALEM</p>
                <p className="text-salem-gold text-sm">{t('"Fada Onyemuo" - L\'homme de l\'Esprit', '"Fada Onyemuo" - The Man of the Spirit')}</p>
              </div>
            </div>
            <div>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {t(
                  "Le Ministère SALEM est une réponse pastorale à une conviction spirituelle : que de nombreux chrétiens désirent une rencontre plus profonde avec Dieu, mais manquent souvent de guidance vers l'expérience vivante du Saint-Esprit.",
                  "SALEM Ministry is a pastoral response to a spiritual conviction: that many Christians desire a deeper encounter with God but often lack guidance into the living experience of the Holy Spirit."
                )}
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {t(
                  "Un espace pastoral de rencontre, de guérison, de formation et d'accompagnement spirituel, fondé en 2017 par le Père John Paul Chinonso Uzochukwu, prêtre de la Congrégation du Saint-Esprit (Spiritains).",
                  "A pastoral space of encounter, healing, formation and spiritual accompaniment, founded in 2017 by Father John Paul Chinonso Uzochukwu, a priest of the Congregation of the Holy Spirit (Spiritans)."
                )}
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-3 py-1 bg-salem-green/10 text-salem-green rounded-full text-sm">{t('Enseignement', 'Teaching')}</span>
                <span className="px-3 py-1 bg-salem-red/10 text-salem-red rounded-full text-sm">{t('Guérison', 'Healing')}</span>
                <span className="px-3 py-1 bg-salem-gold/10 text-salem-gold rounded-full text-sm">{t('Formation', 'Formation')}</span>
              </div>
              <button
                onClick={() => navigateTo('about')}
                className="bg-salem-green text-white px-6 py-3 rounded-full font-semibold hover:bg-salem-green-dark transition-colors"
              >
                {t('Découvrir notre vision →', 'Discover our vision →')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Aperçu Événements - compact */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-salem-gold/10 text-salem-gold rounded-full text-sm font-medium mb-4">
              {t('Agenda', 'Schedule')}
            </span>
            <h2 className="font-serif text-3xl font-bold text-gray-900 mb-4">
              {t('Prochains Événements', 'Upcoming Events')}
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {events.map((event, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all cursor-pointer">
                <div className="relative h-40">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 bg-salem-red text-white text-xs px-3 py-1 rounded-full">{event.type}</div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{event.title}</h3>
                  <p className="text-salem-green text-sm">{event.date}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => navigateTo('events')}
              className="bg-salem-gold text-white px-6 py-3 rounded-full font-semibold hover:bg-salem-gold-light transition-colors"
            >
              {t('Voir tous les événements →', 'See all events →')}
            </button>
          </div>
        </div>
      </section>

      {/* Galerie aperçu */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-salem-green/10 text-salem-green rounded-full text-sm font-medium mb-4">
              {t('Galerie', 'Gallery')}
            </span>
            <h2 className="font-serif text-3xl font-bold text-gray-900 mb-4">
              {t('Nos Moments', 'Our Moments')}
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              '/images/IMG_2599.jpeg',
              '/images/IMG_2367.jpeg',
              '/images/IMG_2463.jpeg',
              '/images/IMG_2628.jpeg',
              '/images/IMG_2636.jpeg',
              '/images/img9.jpg',
              '/images/IMG_2391.jpeg',
              '/images/img5.jpg'
            ].map((image, index) => (
              <div key={index} className="relative rounded-xl overflow-hidden group cursor-pointer aspect-square">
                <img src={image} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => navigateTo('about')}
              className="border-2 border-salem-green text-salem-green px-6 py-3 rounded-full font-semibold hover:bg-salem-green hover:text-white transition-colors"
            >
              {t('Voir la galerie complète →', 'View full gallery →')}
            </button>
          </div>
        </div>
      </section>

      {/* ── RPSD Teaser ── */}
      <section className="py-14 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8 bg-white/5 border border-white/10 rounded-2xl px-8 py-8">
            {/* Icon */}
            <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-salem-gold to-amber-600 flex items-center justify-center shadow-lg shadow-salem-gold/30">
              <span className="text-3xl">🔥</span>
            </div>
            {/* Text */}
            <div className="flex-1 text-center md:text-left">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-salem-gold mb-2">
                {t('Nouveau · Dévotionnel Hebdomadaire', 'New · Weekly Devotional')}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">
                RHEMA <span className="text-salem-gold">POUR LA SEMAINE</span>
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                {t(
                  'Chaque semaine : une Parole + des actions concrètes (Lundi) et une réflexion pour évaluer tes progrès (Weekend). Télécharge les affiches et dévotionnels.',
                  'Every week: a Word + concrete actions (Monday) and a reflection to evaluate your progress (Weekend). Download posters and devotionals.'
                )}
              </p>
              <button
                onClick={() => navigateTo('rpsd')}
                className="inline-flex items-center gap-2 bg-salem-gold text-gray-900 font-bold px-6 py-3 rounded-full hover:bg-amber-500 transition-colors text-sm"
              >
                {t('Accéder au RPSD →', 'Access RPSD →')}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

// Main App Content with Navigation
const AppContent: React.FC = () => {
  const { currentPage, navigateTo } = useNavigation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

  // Render page based on current navigation
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'about':
        return <AboutPage onBack={() => navigateTo('home')} />;
      case 'events':
        return <EventsPage onNavigate={(page) => navigateTo(page as 'home' | 'about' | 'events' | 'contact' | 'salem-tv' | 'virtual-room' | 'sermons' | 'academy' | 'shop' | 'donate')} />;
      case 'contact':
        return <ContactSection />;
      case 'salem-tv':
        return <SalemTVSection onBack={() => navigateTo('home')} />;
      case 'virtual-room':
        return <VirtualRoom />;
      case 'sermons':
        return <SermonsSection />;
      case 'academy':
        return (
          <MaintenanceSection 
            type="academy"
            titleFr="Salem Academy"
            titleEn="Salem Academy"
          />
        );
      case 'shop':
        return (
          <MaintenanceSection 
            type="shop"
            titleFr="Boutique & Ressources"
            titleEn="Shop & Resources"
          />
        );
      case 'donate':
        return (
          <MaintenanceSection
            type="donate"
            titleFr="Dons & Soutien"
            titleEn="Donations & Support"
          />
        );
      case 'rpsd':
        return <RPSDSection />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

// Root App Component with Providers
const App: React.FC = () => {
  return (
    <LanguageProvider>
      <NavigationProvider>
        <AppContent />
      </NavigationProvider>
    </LanguageProvider>
  );
};

export default App;
