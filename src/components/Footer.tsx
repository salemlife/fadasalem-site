import React from 'react';
import { Facebook, Youtube, Phone, Mail, MapPin, Clock, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigation } from '../contexts/NavigationContext';

const Footer: React.FC = () => {
  const { language } = useLanguage();
  const { navigateTo, scrollToSection } = useNavigation();

  const quickLinks = [
    { labelFr: 'Accueil', labelEn: 'Home', action: () => navigateTo('home') },
    { labelFr: 'À Propos', labelEn: 'About', action: () => scrollToSection('about') },
    { labelFr: 'Événements', labelEn: 'Events', action: () => scrollToSection('events') },
    { labelFr: 'Galerie', labelEn: 'Gallery', action: () => scrollToSection('gallery') },
    { labelFr: 'Contact', labelEn: 'Contact', action: () => navigateTo('contact') },
  ];

  const resources = [
    { labelFr: 'Salem TV', labelEn: 'Salem TV', action: () => navigateTo('salem-tv') },
    { labelFr: 'Salle Virtuelle', labelEn: 'Virtual Room', action: () => navigateTo('virtual-room') },
    { labelFr: 'Sermons', labelEn: 'Sermons', action: () => navigateTo('sermons'), badge: true },
    { labelFr: 'Academy', labelEn: 'Academy', action: () => navigateTo('academy'), badge: true },
    { labelFr: 'Boutique', labelEn: 'Shop', action: () => navigateTo('shop'), badge: true },
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://web.facebook.com/salemabundantlifeministry', label: 'Facebook' },
    { icon: Youtube, href: 'https://www.youtube.com/@salemabundantlifeministry', label: 'YouTube' },
    { 
      icon: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
        </svg>
      ), 
      href: 'https://www.tiktok.com/@fadasalem', 
      label: 'TikTok' 
    },
    {
      icon: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      ),
      href: 'https://t.me/+237697033647',
      label: 'Telegram'
    },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-salem-green-dark to-black text-white overflow-hidden">
      {/* Wave SVG Separator */}
      <div className="absolute top-0 left-0 right-0 transform -translate-y-full">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path 
            d="M0 120L48 105C96 90 192 60 288 45C384 30 480 30 576 37.5C672 45 768 60 864 67.5C960 75 1056 75 1152 67.5C1248 60 1344 45 1392 37.5L1440 30V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z" 
            fill="url(#footerGradient)"
          />
          <defs>
            <linearGradient id="footerGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e4a14"/>
              <stop offset="100%" stopColor="#0a0a0a"/>
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Column 1: Logo & Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              {/* Logo sans texte, sans halo */}
              <img 
                src="/images/logosalem.png" 
                alt="SALEM Ministry"
                className="w-24 h-24 md:w-28 md:h-28 object-contain drop-shadow-lg"
              />
            </div>
            <p className="font-lora text-white/70 text-sm mb-6 leading-relaxed italic">
              {language === 'fr'
                ? "Spirit Abundant Life Evangelical Movement - Le Saint-Esprit nous donne la vie abondante."
                : "Spirit Abundant Life Evangelical Movement - The Holy Spirit gives us abundant life."
              }
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 hover:bg-salem-gold hover:text-salem-green-dark rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                    aria-label={social.label}
                  >
                    <IconComponent />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-serif text-xl text-salem-gold mb-6">
              {language === 'fr' ? 'Liens Rapides' : 'Quick Links'}
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={link.action}
                    className="text-white/70 hover:text-salem-gold transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-salem-gold rounded-full group-hover:scale-150 transition-transform"></span>
                    {language === 'fr' ? link.labelFr : link.labelEn}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3 className="font-serif text-xl text-salem-gold mb-6">
              {language === 'fr' ? 'Ressources' : 'Resources'}
            </h3>
            <ul className="space-y-3">
              {resources.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={link.action}
                    className="text-white/70 hover:text-salem-gold transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-salem-gold rounded-full group-hover:scale-150 transition-transform"></span>
                    {language === 'fr' ? link.labelFr : link.labelEn}
                    {link.badge && (
                      <span className="text-[10px] bg-salem-gold/20 text-salem-gold px-1.5 py-0.5 rounded">
                        {language === 'fr' ? 'Bientôt' : 'Soon'}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="font-serif text-xl text-salem-gold mb-6">
              {language === 'fr' ? 'Contact' : 'Contact'}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-salem-gold flex-shrink-0 mt-1" />
                <span className="text-white/70 text-sm">{language === 'fr' ? 'Bafia, Cameroun' : 'Bafia, Cameroon'}</span>
              </li>
              <li>
                <a href="mailto:contact@salemministry.org" className="flex items-start gap-3 text-white/70 hover:text-salem-gold transition-colors">
                  <Mail size={18} className="text-salem-gold flex-shrink-0 mt-1" />
                  <span className="text-sm">contact@salemministry.org</span>
                </a>
              </li>
              <li>
                <a href="tel:+39350837064" className="flex items-start gap-3 text-white/70 hover:text-salem-gold transition-colors">
                  <Phone size={18} className="text-salem-gold flex-shrink-0 mt-1" />
                  <span className="text-sm">+39 350 837 0643</span>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={18} className="text-salem-gold flex-shrink-0 mt-1" />
                <div className="text-sm text-white/70">
                  <p>{language === 'fr' ? 'Lun - Ven: 06h00 - 21h00' : 'Mon - Fri: 6:00 AM - 9:00 PM'}</p>
                  <p>{language === 'fr' ? 'Dim: 08h00 - 14h00' : 'Sun: 8:00 AM - 2:00 PM'}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/50 text-sm text-center md:text-left">
              © {new Date().getFullYear()} SALEM Abundant Life Ministry. {language === 'fr' ? 'Tous droits réservés.' : 'All rights reserved.'}
            </p>
            <p className="text-white/50 text-sm flex items-center gap-1">
              {language === 'fr' ? 'Fait avec' : 'Made with'} 
              <Heart size={14} className="text-salem-red fill-salem-red" /> 
              {language === 'fr' ? 'pour la gloire de Dieu' : 'for the glory of God'}
            </p>
          </div>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-salem-green/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-salem-gold/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
    </footer>
  );
};

export default Footer;
