import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Users, Globe, Calendar, Heart } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNavigation } from '../../contexts/NavigationContext';

const heroImages = [
  '/images/IMG_2599.jpeg',
  '/images/IMG_2367.jpeg',
  '/images/IMG_2463.jpeg',
  '/images/IMG_2628.jpeg',
  '/images/IMG_2636.jpeg',
  '/images/img9.jpg',
];

const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { language } = useLanguage();
  const { navigateTo } = useNavigation();

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const stats = [
    { icon: Users, value: '5000+', labelFr: 'Membres', labelEn: 'Members' },
    { icon: Globe, value: '15+', labelFr: 'Pays', labelEn: 'Countries' },
    { icon: Calendar, value: '10+', labelFr: 'Années', labelEn: 'Years' },
    { icon: Heart, value: '10000+', labelFr: 'Prières Exaucées', labelEn: 'Answered Prayers' },
  ];

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden">
      {/* Background Slides with Ken Burns Effect */}
      {heroImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className={`absolute inset-0 bg-cover bg-center transform transition-transform duration-[8000ms] ${
              index === currentSlide ? 'scale-110' : 'scale-100'
            }`}
            style={{ backgroundImage: `url(${image})` }}
          />
        </div>
      ))}

      {/* Dark Overlay with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-salem-green/80 via-salem-green/60 to-black/80" />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-salem-gold/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
        {/* Holy Spirit Symbol - Dove with Flames */}
        <div className="relative mb-8">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-salem-gold/20 rounded-full blur-3xl transform scale-150 animate-pulse"></div>
          
          {/* Flame animations behind */}
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
            <div className="w-4 h-12 bg-gradient-to-t from-salem-red via-orange-500 to-transparent rounded-full animate-flame opacity-80" style={{ animationDelay: '0s' }}></div>
            <div className="w-6 h-16 bg-gradient-to-t from-salem-red via-orange-400 to-yellow-300 rounded-full animate-flame opacity-90" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-4 h-12 bg-gradient-to-t from-salem-red via-orange-500 to-transparent rounded-full animate-flame opacity-80" style={{ animationDelay: '0.4s' }}></div>
          </div>
          
          {/* Dove SVG */}
          <div className="relative w-24 h-24 md:w-32 md:h-32">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
              {/* Dove body */}
              <ellipse cx="50" cy="55" rx="20" ry="15" fill="white" opacity="0.95"/>
              {/* Dove head */}
              <circle cx="65" cy="45" r="10" fill="white" opacity="0.95"/>
              {/* Beak */}
              <polygon points="75,45 82,47 75,49" fill="#d4a826"/>
              {/* Left wing */}
              <path d="M30,50 Q10,30 25,15 Q40,25 45,45 Z" fill="white" opacity="0.9"/>
              {/* Right wing */}
              <path d="M55,45 Q65,25 85,20 Q80,40 60,50 Z" fill="white" opacity="0.9"/>
              {/* Tail */}
              <path d="M30,55 Q15,60 10,75 Q25,65 35,60 Z" fill="white" opacity="0.85"/>
              {/* Eye */}
              <circle cx="68" cy="43" r="2" fill="#1a1a1a"/>
              {/* Golden glow accent */}
              <ellipse cx="50" cy="55" rx="22" ry="17" fill="none" stroke="#d4a826" strokeWidth="1" opacity="0.5"/>
            </svg>
            
            {/* Light rays */}
            <div className="absolute inset-0 flex items-center justify-center">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-0.5 h-16 bg-gradient-to-t from-salem-gold/60 to-transparent origin-bottom"
                  style={{
                    transform: `rotate(${i * 45}deg) translateY(-50px)`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="heading-primary text-4xl md:text-6xl lg:text-7xl text-white mb-6 max-w-5xl">
          <span className="text-gradient-gold">
            {language === 'fr' 
              ? "Le Saint-Esprit nous donne la vie abondante"
              : "The Holy Spirit gives us abundant life"
            }
          </span>
        </h1>

        {/* Subtitle */}
        <p className="font-lora text-xl md:text-2xl text-white/90 mb-10 max-w-3xl italic">
          {language === 'fr'
            ? "Spirit Abundant Life Evangelical Movement"
            : "Spirit Abundant Life Evangelical Movement"
          }
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <button
            onClick={() => navigateTo('virtual-room')}
            className="group px-8 py-4 bg-white text-salem-green font-bold rounded-full hover:bg-salem-gold hover:text-white transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center gap-2"
          >
            <Play size={20} className="group-hover:animate-pulse" />
            {language === 'fr' ? 'Nous Rejoindre' : 'Join Us'}
          </button>
          <button
            onClick={() => navigateTo('donate')}
            className="px-8 py-4 bg-salem-red text-white font-bold rounded-full hover:bg-salem-red-light transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            {language === 'fr' ? 'Faire un Don' : 'Donate'}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-full mb-3 group-hover:bg-salem-gold/30 transition-colors">
                <stat.icon className="w-6 h-6 text-salem-gold" />
              </div>
              <div className="font-cinzel text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-white/70 text-sm font-medium">
                {language === 'fr' ? stat.labelFr : stat.labelEn}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 hover:bg-white/30 rounded-full backdrop-blur-sm transition-all group"
      >
        <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 hover:bg-white/30 rounded-full backdrop-blur-sm transition-all group"
      >
        <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'w-8 bg-salem-gold' 
                : 'w-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 z-20 hidden md:flex flex-col items-center gap-2 text-white/60">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/60 to-transparent animate-pulse" />
      </div>
    </section>
  );
};

export default HeroSection;
