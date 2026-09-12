import React, { useState, useEffect } from 'react';
import { BookOpen, RefreshCw, Share2, Quote } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const verses = [
  {
    fr: { text: "Car je connais les projets que j'ai formés sur vous, dit l'Éternel, projets de paix et non de malheur, afin de vous donner un avenir et de l'espérance.", ref: "Jérémie 29:11" },
    en: { text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.", ref: "Jeremiah 29:11" }
  },
  {
    fr: { text: "L'Esprit du Seigneur est sur moi, parce qu'il m'a oint pour annoncer une bonne nouvelle aux pauvres; Il m'a envoyé pour guérir ceux qui ont le cœur brisé.", ref: "Luc 4:18" },
    en: { text: "The Spirit of the Lord is on me, because he has anointed me to proclaim good news to the poor. He has sent me to proclaim freedom for the prisoners.", ref: "Luke 4:18" }
  },
  {
    fr: { text: "Demandez, et l'on vous donnera; cherchez, et vous trouverez; frappez, et l'on vous ouvrira.", ref: "Matthieu 7:7" },
    en: { text: "Ask and it will be given to you; seek and you will find; knock and the door will be opened to you.", ref: "Matthew 7:7" }
  },
  {
    fr: { text: "Je puis tout par celui qui me fortifie.", ref: "Philippiens 4:13" },
    en: { text: "I can do all things through Christ who strengthens me.", ref: "Philippians 4:13" }
  },
  {
    fr: { text: "L'Éternel est mon berger: je ne manquerai de rien.", ref: "Psaume 23:1" },
    en: { text: "The Lord is my shepherd; I shall not want.", ref: "Psalm 23:1" }
  },
  {
    fr: { text: "Venez à moi, vous tous qui êtes fatigués et chargés, et je vous donnerai du repos.", ref: "Matthieu 11:28" },
    en: { text: "Come to me, all you who are weary and burdened, and I will give you rest.", ref: "Matthew 11:28" }
  },
  {
    fr: { text: "Ne crains point, car je suis avec toi; Ne t'effraie point, car je suis ton Dieu.", ref: "Ésaïe 41:10" },
    en: { text: "Fear not, for I am with you; be not dismayed, for I am your God.", ref: "Isaiah 41:10" }
  },
  {
    fr: { text: "Mais ceux qui se confient en l'Éternel renouvellent leur force. Ils prennent le vol comme les aigles.", ref: "Ésaïe 40:31" },
    en: { text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles.", ref: "Isaiah 40:31" }
  },
];

const VerseOfDay: React.FC = () => {
  const { language, t } = useLanguage();
  const [currentVerse, setCurrentVerse] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Set verse based on day
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    setCurrentVerse(dayOfYear % verses.length);
    
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const refreshVerse = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentVerse((prev) => (prev + 1) % verses.length);
      setIsAnimating(false);
    }, 400);
  };

  const shareVerse = async () => {
    const verse = language === 'fr' ? verses[currentVerse].fr : verses[currentVerse].en;
    const text = `"${verse.text}"\n\n— ${verse.ref}\n\n🕊️ SALEM Ministry\nwww.salemministry.org`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      await navigator.clipboard.writeText(text);
      alert(t('Verset copié!', 'Verse copied!'));
    }
  };

  const verse = language === 'fr' ? verses[currentVerse].fr : verses[currentVerse].en;

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-salem-green via-salem-green-dark to-salem-green" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border border-salem-gold rounded-full" />
        <div className="absolute bottom-10 right-10 w-48 h-48 border border-salem-gold rounded-full" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-salem-gold/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className={`container mx-auto px-4 relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-4xl mx-auto">
          {/* Glass Card */}
          <div className="glass-premium rounded-3xl p-8 md:p-12 relative">
            {/* Decorative corner ornaments */}
            <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-salem-gold/30 rounded-tl-lg" />
            <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-salem-gold/30 rounded-tr-lg" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-salem-gold/30 rounded-bl-lg" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-salem-gold/30 rounded-br-lg" />

            {/* Header */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="p-3 bg-salem-gold/20 rounded-xl">
                <BookOpen className="text-salem-gold w-6 h-6" />
              </div>
              <h2 className="font-cinzel text-salem-gold text-xl md:text-2xl font-semibold tracking-wide">
                {t("Verset du Jour", "Verse of the Day")}
              </h2>
            </div>

            {/* Verse with decorative quotes */}
            <div className={`relative text-center transition-all duration-400 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
              {/* Opening quote */}
              <Quote className="absolute -top-2 left-0 md:left-8 w-10 h-10 md:w-14 md:h-14 text-salem-gold/20 rotate-180" />
              
              {/* Verse text */}
              <p className="font-lora italic text-white text-xl md:text-2xl lg:text-3xl mb-8 px-8 md:px-16 leading-relaxed">
                {verse.text}
              </p>
              
              {/* Closing quote */}
              <Quote className="absolute -bottom-2 right-0 md:right-8 w-10 h-10 md:w-14 md:h-14 text-salem-gold/20" />
              
              {/* Reference with ornament */}
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-px bg-gradient-to-r from-transparent to-salem-gold" />
                <p className="font-cinzel text-salem-gold font-semibold text-lg md:text-xl tracking-wide">
                  {verse.ref}
                </p>
                <div className="w-12 h-px bg-gradient-to-l from-transparent to-salem-gold" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-4 mt-10">
              <button
                onClick={refreshVerse}
                className="group flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/20 hover:border-white/40"
              >
                <RefreshCw size={18} className={`transition-transform ${isAnimating ? 'animate-spin' : 'group-hover:rotate-180'}`} />
                <span className="hidden sm:inline font-medium">{t("Nouveau verset", "New verse")}</span>
              </button>
              <button
                onClick={shareVerse}
                className="group flex items-center gap-2 px-6 py-3 bg-salem-gold hover:bg-salem-gold-light text-salem-green-dark rounded-full transition-all font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <Share2 size={18} className="group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">{t("Partager", "Share")}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerseOfDay;
