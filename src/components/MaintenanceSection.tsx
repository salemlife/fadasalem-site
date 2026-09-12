import React from 'react';
import { Construction, BookOpen, GraduationCap, ShoppingBag, Heart, ArrowLeft, Bell } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigation } from '../contexts/NavigationContext';

interface MaintenanceSectionProps {
  type: 'sermons' | 'academy' | 'shop' | 'donate';
  titleFr: string;
  titleEn: string;
}

const MaintenanceSection: React.FC<MaintenanceSectionProps> = ({ type, titleFr, titleEn }) => {
  const { language } = useLanguage();
  const { navigateTo } = useNavigation();

  const configs = {
    sermons: {
      icon: BookOpen,
      image: '/images/IMG_2367.jpeg',
      featuresFr: ['Bibliothèque audio/vidéo', 'Méditations quotidiennes', 'Téléchargement hors-ligne', 'Classement par thèmes'],
      featuresEn: ['Audio/Video Library', 'Daily Meditations', 'Offline Downloads', 'Thematic Classification'],
      color: 'from-blue-600 to-purple-700',
    },
    academy: {
      icon: GraduationCap,
      image: '/images/IMG_2463.jpeg',
      featuresFr: ['Cours en ligne interactifs', 'Certificats de formation', 'Suivi de progression', 'Communauté d\'apprenants'],
      featuresEn: ['Interactive Online Courses', 'Training Certificates', 'Progress Tracking', 'Learning Community'],
      color: 'from-salem-green to-emerald-600',
    },
    shop: {
      icon: ShoppingBag,
      image: '/images/img5.jpg',
      featuresFr: ['Livres et ebooks du Père Salem', 'Articles de dévotion', 'Paiement sécurisé', 'Livraison internationale'],
      featuresEn: ['Books and Ebooks by Fr. Salem', 'Devotional Items', 'Secure Payment', 'International Delivery'],
      color: 'from-amber-500 to-orange-600',
    },
    donate: {
      icon: Heart,
      image: '/images/IMG_2628.jpeg',
      featuresFr: ['Dîmes et offrandes en ligne', 'Soutien aux projets', 'Reçus automatiques', 'Suivi des contributions'],
      featuresEn: ['Online Tithes and Offerings', 'Project Support', 'Automatic Receipts', 'Contribution Tracking'],
      color: 'from-salem-red to-rose-600',
    },
  };

  const config = configs[type];
  const Icon = config.icon;
  const features = language === 'fr' ? config.featuresFr : config.featuresEn;
  const title = language === 'fr' ? titleFr : titleEn;

  return (
    <section className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${config.image})` }}
      />
      
      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-90`} />
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          {/* Back Button */}
          <button
            onClick={() => navigateTo('home')}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            {language === 'fr' ? 'Retour à l\'accueil' : 'Back to Home'}
          </button>

          {/* Icon */}
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl transform scale-150 animate-pulse"></div>
            <div className="relative w-24 h-24 md:w-32 md:h-32 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
              <Icon className="w-12 h-12 md:w-16 md:h-16 text-white" />
            </div>
          </div>

          {/* Construction Badge */}
          <div className="inline-flex items-center gap-2 bg-salem-gold text-salem-green-dark px-4 py-2 rounded-full font-bold text-sm mb-6 animate-bounce">
            <Construction size={18} />
            {language === 'fr' ? 'En Construction' : 'Under Construction'}
          </div>

          {/* Title */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            {title}
          </h1>

          {/* Description */}
          <p className="text-xl text-white/90 mb-10 max-w-lg mx-auto">
            {language === 'fr'
              ? "Cette section est en cours de développement. Nous travaillons dur pour vous offrir une expérience exceptionnelle."
              : "This section is under development. We are working hard to offer you an exceptional experience."
            }
          </p>

          {/* Features Coming */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-10 border border-white/20">
            <h3 className="text-white font-semibold mb-4 flex items-center justify-center gap-2">
              <Bell size={18} className="text-salem-gold" />
              {language === 'fr' ? 'Fonctionnalités à venir' : 'Coming Features'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 text-white/80 text-sm"
                >
                  <div className="w-2 h-2 bg-salem-gold rounded-full"></div>
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigateTo('contact')}
              className="px-8 py-4 bg-white text-gray-900 font-bold rounded-full hover:bg-salem-gold transition-all transform hover:scale-105 shadow-xl"
            >
              {language === 'fr' ? 'Être Notifié' : 'Get Notified'}
            </button>
            <button
              onClick={() => navigateTo('home')}
              className="px-8 py-4 bg-transparent text-white font-bold rounded-full border-2 border-white hover:bg-white hover:text-gray-900 transition-all"
            >
              {language === 'fr' ? 'Retour à l\'Accueil' : 'Back to Home'}
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
    </section>
  );
};

export default MaintenanceSection;
