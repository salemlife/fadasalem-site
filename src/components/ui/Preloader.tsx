import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const Preloader: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const { language } = useLanguage();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-salem-green-dark via-salem-green to-salem-green-dark">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orbs */}
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-salem-gold/10 animate-float"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          />
        ))}
        
        {/* Light rays */}
        <div className="absolute inset-0 flex items-center justify-center">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 bg-gradient-to-t from-salem-gold/0 via-salem-gold/20 to-salem-gold/0 origin-bottom animate-pulse"
              style={{
                height: '50vh',
                transform: `rotate(${i * 30}deg)`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Logo Container */}
      <div className="relative mb-8">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full bg-salem-gold/20 blur-3xl transform scale-150 animate-pulse"></div>
        
        {/* Rotating ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-salem-gold border-r-salem-gold/50 animate-spin-slow transform scale-125"></div>
        
        {/* Logo avec fond blanc pour visibilité sur fond vert */}
        <div className="relative w-36 h-36 md:w-44 md:h-44 flex items-center justify-center">
          <div className="absolute inset-2 bg-white rounded-full shadow-2xl"></div>
          <img 
            src="/images/logosalem.png" 
            alt="SALEM Ministry"
            className="relative w-[85%] h-[85%] object-contain drop-shadow-lg z-10"
          />
        </div>
      </div>

      {/* Slogan uniquement - pas de texte "SALEM Ministry" */}
      <p className="text-salem-gold/80 text-sm md:text-base mb-8 animate-fade-in-up font-lora italic text-center px-4">
        {language === 'fr' 
          ? "Le Saint-Esprit nous donne la vie abondante"
          : "The Holy Spirit gives us abundant life"
        }
      </p>

      {/* Progress Bar */}
      <div className="w-64 md:w-80 h-1 bg-white/20 rounded-full overflow-hidden mb-4">
        <div 
          className="h-full bg-gradient-to-r from-salem-gold via-white to-salem-gold rounded-full transition-all duration-300"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      {/* Loading Text */}
      <p className="text-white/60 text-sm">
        {language === 'fr' ? 'Chargement...' : 'Loading...'}
      </p>

      {/* Decorative flames at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end justify-center gap-2 overflow-hidden opacity-30">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="bg-gradient-to-t from-salem-red via-orange-500 to-transparent rounded-t-full animate-flame"
            style={{
              width: `${10 + Math.random() * 20}px`,
              height: `${40 + Math.random() * 60}px`,
              animationDelay: `${Math.random() * 0.5}s`,
              animationDuration: `${0.3 + Math.random() * 0.3}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Preloader;
