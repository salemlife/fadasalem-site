import React, { useState, useEffect } from 'react';
import { ArrowUp, MessageCircle, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const FloatingButtons: React.FC = () => {
  const { t } = useLanguage();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showWhatsAppTooltip, setShowWhatsAppTooltip] = useState(false);
  const [isWhatsAppPulsing, setIsWhatsAppPulsing] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Stop pulsing after a few seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsWhatsAppPulsing(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappMessage = encodeURIComponent(
    t(
      "Bonjour Ministère SALEM! Je souhaite en savoir plus sur votre communauté.",
      "Hello SALEM Ministry! I would like to know more about your community."
    )
  );

  return (
    <>
      {/* WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {/* Tooltip */}
          <div 
            className={`absolute bottom-full right-0 mb-3 transition-all duration-300 ${
              showWhatsAppTooltip 
                ? 'opacity-100 translate-y-0 visible' 
                : 'opacity-0 translate-y-2 invisible'
            }`}
          >
            <div className="bg-white rounded-2xl shadow-2xl p-4 w-72 relative">
              {/* Close button */}
              <button 
                onClick={() => setShowWhatsAppTooltip(false)}
                className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
              
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t('Ministère SALEM', 'SALEM Ministry')}</p>
                  <p className="text-green-600 text-xs flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    {t('En ligne', 'Online')}
                  </p>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">
                {t(
                  "Besoin d'aide ou d'une prière? Contactez-nous sur WhatsApp!",
                  "Need help or prayer? Contact us on WhatsApp!"
                )}
              </p>
              
              <a
                href={`https://wa.me/237697033647?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-2.5 bg-green-500 hover:bg-green-600 text-white text-center rounded-xl font-medium transition-colors"
              >
                {t('Démarrer la conversation', 'Start conversation')}
              </a>
              
              {/* Arrow */}
              <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white transform rotate-45 shadow-lg" />
            </div>
          </div>

          {/* Main WhatsApp Button */}
          <button
            onClick={() => setShowWhatsAppTooltip(!showWhatsAppTooltip)}
            className={`relative w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110 group ${
              isWhatsAppPulsing ? 'animate-bounce' : ''
            }`}
            style={{
              animation: isWhatsAppPulsing ? 'bounce 2s ease-in-out infinite' : 'none',
            }}
          >
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-30" />
            
            {/* Icon */}
            <svg 
              className="w-7 h-7 text-white relative z-10" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </button>

          {/* Notification badge */}
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-salem-red rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
            1
          </span>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 left-6 z-50 w-12 h-12 bg-salem-green hover:bg-salem-green-dark text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-500 ${
          showScrollTop 
            ? 'opacity-100 translate-y-0 visible' 
            : 'opacity-0 translate-y-10 invisible'
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp size={22} />
      </button>
    </>
  );
};

export default FloatingButtons;
