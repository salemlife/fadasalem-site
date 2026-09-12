import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, Phone, Mail, ChevronRight, ChevronDown, Video, Heart, BookOpen, GraduationCap, ShoppingBag, Flame } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigation, PageType } from '../contexts/NavigationContext';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { currentPage, navigateTo, scrollToSection } = useNavigation();

  // Mode clair (fond blanc) : au scroll OU sur une page autre que l'accueil
  const isLightMode = isScrolled || currentPage !== 'home';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when page changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentPage]);

  // Navigation principale centrée (sans les CTA)
  const mainNavItems: { key: string; labelFr: string; labelEn: string; page?: PageType; section?: string }[] = [
    { key: 'home', labelFr: 'Accueil', labelEn: 'Home', page: 'home' },
    { key: 'about', labelFr: 'À Propos', labelEn: 'About', page: 'about' },
    { key: 'events', labelFr: 'Événements', labelEn: 'Events', page: 'events' },
    { key: 'sermons', labelFr: 'Sermons', labelEn: 'Sermons', page: 'sermons' },
    { key: 'salem-tv', labelFr: 'Salem TV', labelEn: 'Salem TV', page: 'salem-tv' },
    { key: 'contact', labelFr: 'Contact', labelEn: 'Contact', page: 'contact' },
  ];

  // Items "Bientôt" pour le menu mobile
  const comingSoonItems: { key: string; labelFr: string; labelEn: string; page: PageType }[] = [
    { key: 'academy', labelFr: 'Academy', labelEn: 'Academy', page: 'academy' },
    { key: 'shop', labelFr: 'Boutique', labelEn: 'Shop', page: 'shop' },
  ];

  const handleNavClick = (item: { page?: PageType; section?: string }) => {
    if (item.section) {
      scrollToSection(item.section);
    } else if (item.page) {
      navigateTo(item.page);
    }
    setIsMobileMenuOpen(false);
  };

  const isActive = (item: { page?: PageType }) => {
    if (item.page) {
      return currentPage === item.page;
    }
    return false;
  };

  return (
    <>
      {/* Top Bar - Compact - Vert foncé avec infos contact */}
      <div className="bg-salem-green-dark text-white py-1.5 text-xs relative z-50">
        <div className="container mx-auto px-4">
          {/* Desktop version */}
          <div className="hidden md:flex justify-between items-center">
            <div className="flex items-center gap-4">
              <a href="mailto:contact@salemministry.org" className="flex items-center gap-1.5 hover:text-salem-gold transition-colors">
                <Mail size={12} />
                contact@salemministry.org
              </a>
              <a href="tel:+39350837064" className="flex items-center gap-1.5 hover:text-salem-gold transition-colors">
                <Phone size={12} />
                +39 350 837 0643
              </a>
            </div>
            
            {/* Language Switcher */}
            <div className="flex items-center gap-1.5">
              <Globe size={12} />
              <button
                onClick={() => setLanguage('fr')}
                className={`px-1.5 py-0.5 rounded text-xs font-medium transition-all ${
                  language === 'fr' 
                    ? 'bg-white text-salem-green' 
                    : 'hover:bg-white/20'
                }`}
              >
                🇫🇷 FR
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-1.5 py-0.5 rounded text-xs font-medium transition-all ${
                  language === 'en' 
                    ? 'bg-white text-salem-green' 
                    : 'hover:bg-white/20'
                }`}
              >
                🇬🇧 EN
              </button>
            </div>
          </div>

          {/* Mobile version - Compact */}
          <div className="flex md:hidden justify-between items-center">
            <a href="mailto:contact@salemministry.org" className="flex items-center gap-1 text-[11px] hover:text-salem-gold transition-colors">
              <Mail size={10} />
              <span className="hidden xs:inline">contact@salemministry.org</span>
              <span className="xs:hidden">Email</span>
            </a>
            <a href="tel:+39350837064" className="flex items-center gap-1 text-[11px] hover:text-salem-gold transition-colors">
              <Phone size={10} />
              +39 350 837 0643
            </a>
          </div>
        </div>
      </div>

      {/* Main Header - Compact et élégant */}
      <header 
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isLightMode 
            ? 'bg-white shadow-md py-1' 
            : 'bg-gradient-to-r from-amber-50 via-white to-amber-50 shadow-md py-1.5'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo - Taille réduite et optimisée */}
            <button 
              onClick={() => navigateTo('home')}
              className="flex items-center group flex-shrink-0"
            >
              <img 
                src="/images/logosalem.png" 
                alt="SALEM Ministry Logo"
                className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 object-contain drop-shadow-md transition-transform group-hover:scale-105"
              />
            </button>

            {/* Desktop Navigation - CENTRÉE - Compact */}
            <nav className="hidden lg:flex items-center justify-center flex-1 px-4">
              <div className="flex items-center gap-0.5">
                {mainNavItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => handleNavClick(item)}
                    className={`relative px-3 py-1.5 text-sm font-medium transition-all rounded-md group ${
                      isActive(item)
                        ? 'text-salem-green bg-salem-green/10' 
                        : 'text-gray-700 hover:text-salem-green hover:bg-salem-green/5'
                    }`}
                  >
                    <span>{language === 'fr' ? item.labelFr : item.labelEn}</span>
                    {isActive(item) && (
                      <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2/3 h-0.5 rounded-full bg-salem-green"></span>
                    )}
                  </button>
                ))}

                {/* Menu déroulant Ressources */}
                <div className="relative group">
                  <button
                    className="relative px-3 py-1.5 text-sm font-medium transition-all rounded-md flex items-center gap-1 text-gray-700 hover:text-salem-green hover:bg-salem-green/5"
                  >
                    <span>{language === 'fr' ? 'Ressources' : 'Resources'}</span>
                    <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                  </button>
                  
                  {/* Dropdown */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden min-w-[220px] py-2">
                      {/* Triangle indicator */}
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-100"></div>

                      {/* RPSD — Active item */}
                      <button
                        onClick={() => handleNavClick({ page: 'rpsd' })}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-amber-50 transition-all group/item border-b border-gray-100"
                      >
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-salem-gold/20 to-amber-500/20 flex items-center justify-center group-hover/item:from-salem-gold/30 group-hover/item:to-amber-500/30 transition-all">
                          <Flame className="w-4 h-4 text-salem-gold" />
                        </div>
                        <div className="flex-1 text-left">
                          <span className="text-gray-700 font-medium text-sm group-hover/item:text-salem-gold transition-colors">
                            RPSD
                          </span>
                          <p className="text-gray-400 text-xs leading-none mt-0.5">
                            {language === 'fr' ? 'Dévotionnel hebdo' : 'Weekly devotional'}
                          </p>
                        </div>
                        <span className="text-[10px] bg-gradient-to-r from-salem-gold to-amber-500 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                          {language === 'fr' ? 'Nouveau' : 'New'}
                        </span>
                      </button>

                      {comingSoonItems.map((item, index) => {
                        const icons = [BookOpen, GraduationCap, ShoppingBag];
                        const IconComponent = icons[index];
                        return (
                          <button
                            key={item.key}
                            onClick={() => handleNavClick(item)}
                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-all group/item"
                          >
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-salem-green/10 to-salem-gold/10 flex items-center justify-center group-hover/item:from-salem-green/20 group-hover/item:to-salem-gold/20 transition-all">
                              <IconComponent className="w-4 h-4 text-salem-green" />
                            </div>
                            <div className="flex-1 text-left">
                              <span className="text-gray-700 font-medium text-sm group-hover/item:text-salem-green transition-colors">
                                {language === 'fr' ? item.labelFr : item.labelEn}
                              </span>
                            </div>
                            <span className="text-[10px] bg-gradient-to-r from-salem-gold to-yellow-500 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                              {language === 'fr' ? 'Bientôt' : 'Soon'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </nav>

            {/* Desktop CTA Buttons - à droite - Compact */}
            <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
              {/* Salle Virtuelle Button */}
              <button
                onClick={() => navigateTo('virtual-room')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-semibold text-xs transition-all transform hover:scale-105 shadow-md hover:shadow-lg ${
                  currentPage === 'virtual-room'
                    ? 'bg-salem-gold text-white ring-2 ring-salem-green'
                    : 'bg-salem-green text-white hover:bg-salem-green-light'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>{language === 'fr' ? 'Salle de Prière' : 'Prayer Room'}</span>
              </button>

              {/* Don Button */}
              <button
                onClick={() => navigateTo('donate')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-salem-red text-white rounded-full font-semibold text-xs transition-all transform hover:scale-105 hover:bg-salem-red-light shadow-md hover:shadow-lg"
              >
                <Heart className="w-3.5 h-3.5" />
                <span>{language === 'fr' ? 'Faire un Don' : 'Donate'}</span>
              </button>
            </div>

            {/* Mobile: Language + Menu - Simplifié */}
            <div className="lg:hidden flex items-center gap-2">
              {/* Language Toggle */}
              <button
                onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
                className="w-8 h-8 rounded-full text-sm font-bold flex items-center justify-center transition-all bg-salem-green/10 text-salem-green hover:bg-salem-green/20"
              >
                {language === 'fr' ? '🇬🇧' : '🇫🇷'}
              </button>

              {/* Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-100"
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Full Screen Overlay */}
      <div 
        className={`fixed inset-0 z-[100] lg:hidden transition-all duration-500 ${
          isMobileMenuOpen 
            ? 'opacity-100 pointer-events-auto' 
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
        
        {/* Menu Panel */}
        <div 
          className={`absolute right-0 top-0 h-full w-full max-w-sm bg-white transform transition-transform duration-500 shadow-2xl ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header du menu mobile */}
          <div className="bg-gradient-to-r from-salem-green to-salem-green-dark p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={24} />
            </button>

            {/* Logo avec fond blanc pour visibilité sur fond vert */}
            <div className="flex items-center justify-center">
              <div className="relative w-24 h-24">
                {/* Fond blanc circulaire */}
                <div className="absolute inset-1 bg-white rounded-full shadow-xl"></div>
                <img 
                  src="/images/logosalem.png" 
                  alt="SALEM Ministry"
                  className="relative w-full h-full object-contain p-2 z-10"
                />
              </div>
            </div>
            
            {/* Slogan sous le logo */}
            <p className="text-white/80 text-xs text-center mt-3 font-lora italic">
              {language === 'fr' 
                ? "Spirit Abundant Life Evangelical Movement" 
                : "Spirit Abundant Life Evangelical Movement"
              }
            </p>
          </div>

          {/* CTA Buttons in Mobile */}
          <div className="p-4 border-b border-gray-100">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleNavClick({ page: 'virtual-room' })}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-salem-green text-white rounded-xl font-semibold shadow-md hover:bg-salem-green-light transition-all"
              >
                <Video className="w-5 h-5" />
                <span className="text-sm">{language === 'fr' ? 'Salle de Prière' : 'Prayer Room'}</span>
              </button>
              <button
                onClick={() => handleNavClick({ page: 'donate' })}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-salem-red text-white rounded-xl font-semibold shadow-md hover:bg-salem-red-light transition-all"
              >
                <Heart className="w-5 h-5" />
                <span className="text-sm">{language === 'fr' ? 'Faire un Don' : 'Donate'}</span>
              </button>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[40vh]">
            {mainNavItems.map((item, index) => (
              <button
                key={item.key}
                onClick={() => handleNavClick(item)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all group ${
                  isActive(item)
                    ? 'bg-salem-green text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="font-medium">
                  {language === 'fr' ? item.labelFr : item.labelEn}
                </span>
                <ChevronRight size={16} className={`transition-transform ${
                  isActive(item) ? 'text-white' : 'text-gray-400 group-hover:translate-x-1'
                }`} />
              </button>
            ))}
          </nav>

          {/* RPSD Section */}
          <div className="px-4 pb-2">
            <button
              onClick={() => handleNavClick({ page: 'rpsd' })}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-salem-gold/10 to-amber-500/10 border border-salem-gold/20 hover:from-salem-gold/20 hover:to-amber-500/20 transition-all"
            >
              <div className="flex items-center gap-2">
                <Flame size={16} className="text-salem-gold" />
                <span className="font-semibold text-sm text-gray-800">RPSD</span>
                <span className="text-xs text-gray-500">{language === 'fr' ? '— Dévotionnel' : '— Devotional'}</span>
              </div>
              <span className="bg-salem-gold text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                {language === 'fr' ? 'Nouveau' : 'New'}
              </span>
            </button>
          </div>

          {/* Coming Soon Section */}
          <div className="px-4 pb-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 px-4">
              {language === 'fr' ? 'Bientôt disponible' : 'Coming Soon'}
            </p>
            <div className="space-y-1">
              {comingSoonItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleNavClick(item)}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-gray-400 hover:bg-gray-50 transition-all"
                >
                  <span className="font-medium text-sm">{language === 'fr' ? item.labelFr : item.labelEn}</span>
                  <span className="bg-salem-gold/20 text-salem-gold text-xs px-2 py-0.5 rounded-full font-bold">
                    {language === 'fr' ? 'Bientôt' : 'Soon'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50 border-t">
            <div className="flex items-center justify-between">
              <a 
                href="mailto:contact@salemministry.org" 
                className="flex items-center gap-2 text-gray-600 hover:text-salem-green transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-salem-green/10 flex items-center justify-center">
                  <Mail size={16} className="text-salem-green" />
                </div>
                <span className="text-xs">Email</span>
              </a>
              <a 
                href="tel:+39350837064" 
                className="flex items-center gap-2 text-gray-600 hover:text-salem-green transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-salem-green/10 flex items-center justify-center">
                  <Phone size={16} className="text-salem-green" />
                </div>
                <span className="text-xs">{language === 'fr' ? 'Appeler' : 'Call'}</span>
              </a>
              {/* Language Switcher */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setLanguage('fr')}
                  className={`w-9 h-9 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                    language === 'fr' ? 'bg-salem-green text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  FR
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`w-9 h-9 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                    language === 'en' ? 'bg-salem-green text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  EN
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
