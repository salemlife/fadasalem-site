import { useState, useEffect, useRef } from 'react';
import { 
  Phone, Mail, MapPin, Clock, Send, ChevronDown,
  MessageCircle, Heart, Users, ArrowLeft, Check, Star,
  ExternalLink, Globe, Loader2
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNavigation } from '../../contexts/NavigationContext';
import { sendPrayerIntention } from '../../firebase';

export default function ContactSection() {
  const { t } = useLanguage();
  const { navigateTo } = useNavigation();
  
  // États
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showPrayerModal, setShowPrayerModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  
  // Compteurs animés
  const [counters, setCounters] = useState({ members: 0, countries: 0, prayers: 0 });
  const countersRef = useRef<HTMLDivElement>(null);
  const [countersAnimated, setCountersAnimated] = useState(false);

  // Formulaire contact
  const [contactForm, setContactForm] = useState({
    subject: '',
    name: '',
    email: '',
    message: ''
  });

  // Formulaire prière
  const [prayerForm, setPrayerForm] = useState({
    name: '',
    email: '',
    phone: '',
    country: 'Cameroun',
    intention: '',
    anonymous: false
  });
  const [prayerStatus, setPrayerStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [prayerError, setPrayerError] = useState('');

  // Formulaire membre
  const [memberForm, setMemberForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    motivation: ''
  });

  // Animation des compteurs
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !countersAnimated) {
            setCountersAnimated(true);
            animateCounters();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (countersRef.current) {
      observer.observe(countersRef.current);
    }

    return () => observer.disconnect();
  }, [countersAnimated]);

  const animateCounters = () => {
    const targets = { members: 5000, countries: 15, prayers: 10000 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setCounters({
        members: Math.floor(targets.members * progress),
        countries: Math.floor(targets.countries * progress),
        prayers: Math.floor(targets.prayers * progress)
      });
      if (step >= steps) clearInterval(timer);
    }, interval);
  };

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
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Rotation auto des témoignages
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const getAnimationClass = (id: string, delay: string = '') => {
    const baseClass = 'transition-all duration-700 ease-out';
    const hiddenClass = 'opacity-0 translate-y-8';
    const visibleClass = 'opacity-100 translate-y-0';
    return `${baseClass} ${visibleSections.has(id) ? visibleClass : hiddenClass} ${delay}`;
  };

  // Données
  const subjects = [
    { value: '', label: t('-- Choisir un sujet --', '-- Select a subject --') },
    { value: 'general', label: t('Question générale', 'General Question') },
    { value: 'prayer', label: t('Demande de prière', 'Prayer Request') },
    { value: 'membership', label: t('Rejoindre le ministère', 'Join the Ministry') },
    { value: 'partnership', label: t('Partenariat', 'Partnership') },
    { value: 'testimony', label: t('Partager un témoignage', 'Share a Testimony') },
    { value: 'other', label: t('Autre', 'Other') }
  ];

  const testimonials = [
    {
      text: t(
        "J'ai été guérie d'une maladie chronique après les prières du Père Salem. Dieu est vivant !",
        "I was healed from a chronic illness after Father Salem's prayers. God is alive!"
      ),
      author: "Marie K.",
      country: t("Cameroun", "Cameroon"),
      image: "/images/IMG_2391.jpeg"
    },
    {
      text: t(
        "Ma famille a retrouvé la paix et l'unité grâce à l'accompagnement spirituel de SALEM.",
        "My family found peace and unity through SALEM's spiritual guidance."
      ),
      author: "Jean-Pierre M.",
      country: t("France", "France"),
      image: "/images/IMG_2463.jpeg"
    },
    {
      text: t(
        "Les enseignements du ministère ont transformé ma vie spirituelle. Je suis plus proche de Dieu.",
        "The ministry's teachings transformed my spiritual life. I am closer to God."
      ),
      author: "Grace O.",
      country: "Nigeria",
      image: "/images/IMG_2628.jpeg"
    }
  ];

  const faqs = [
    {
      q: t("Comment participer aux prières en ligne ?", "How to participate in online prayers?"),
      a: t(
        "Rejoignez notre Salle Virtuelle de Prière accessible depuis le menu principal. Les sessions ont lieu du lundi au vendredi à 6h, 12h et les vendredis à 21h.",
        "Join our Virtual Prayer Room accessible from the main menu. Sessions are held Monday to Friday at 6am, 12pm and Fridays at 9pm."
      )
    },
    {
      q: t("Comment devenir membre du ministère ?", "How to become a member?"),
      a: t(
        "Cliquez sur 'Devenir Membre', remplissez le formulaire et notre équipe vous contactera pour vous accompagner dans votre intégration.",
        "Click 'Become a Member', fill out the form and our team will contact you to guide you through the integration."
      )
    },
    {
      q: t("Où se trouve l'église SALEM ?", "Where is SALEM church located?"),
      a: t(
        "Notre siège est situé à Bafia, au Cameroun. Nous avons également des communautés dans 15+ pays à travers le monde.",
        "Our headquarters is located in Bafia, Cameroon. We also have communities in 15+ countries worldwide."
      )
    },
    {
      q: t("Mes intentions de prière sont-elles confidentielles ?", "Are my prayer intentions confidential?"),
      a: t(
        "Absolument. Vous pouvez choisir l'option 'Anonyme' et seule notre équipe pastorale aura accès à votre intention pour prier pour vous.",
        "Absolutely. You can choose the 'Anonymous' option and only our pastoral team will have access to your intention to pray for you."
      )
    }
  ];

  // Handlers
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.subject || !contactForm.name || !contactForm.email || !contactForm.message) return;
    
    setFormStatus('loading');
    await new Promise(resolve => setTimeout(resolve, 1500));
    setFormStatus('success');
    setContactForm({ subject: '', name: '', email: '', message: '' });
    setTimeout(() => setFormStatus('idle'), 3000);
  };

  const handlePrayerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prayerForm.name || !prayerForm.intention) {
      setPrayerError(t('Veuillez remplir tous les champs obligatoires', 'Please fill in all required fields'));
      return;
    }
    
    setPrayerStatus('loading');
    setPrayerError('');
    
    try {
      // Créer un ID unique pour le participant (basé sur l'email ou le nom)
      const participantId = `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const result = await sendPrayerIntention({
        participantId,
        participantName: prayerForm.name,
        participantPhone: prayerForm.phone || '',
        participantCountry: prayerForm.country || 'Non spécifié',
        intention: prayerForm.intention,
        isAnonymous: prayerForm.anonymous
      });
      
      if (result.success) {
        setPrayerStatus('success');
        setShowPrayerModal(false);
        setPrayerForm({ name: '', email: '', phone: '', country: 'Cameroun', intention: '', anonymous: false });
        // Afficher un message de succès global
        setFormStatus('success');
        setTimeout(() => {
          setPrayerStatus('idle');
          setFormStatus('idle');
        }, 3000);
      } else {
        setPrayerError(result.error || t('Erreur lors de l\'envoi', 'Error sending'));
        setPrayerStatus('error');
        setTimeout(() => setPrayerStatus('idle'), 3000);
      }
    } catch (error) {
      console.error('Prayer submission error:', error);
      setPrayerError(t('Erreur de connexion', 'Connection error'));
      setPrayerStatus('error');
      setTimeout(() => setPrayerStatus('idle'), 3000);
    }
  };

  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');
    await new Promise(resolve => setTimeout(resolve, 1500));
    setFormStatus('success');
    setShowMemberModal(false);
    setMemberForm({ firstName: '', lastName: '', email: '', phone: '', country: '', motivation: '' });
    setTimeout(() => setFormStatus('idle'), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header fixe */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2 text-salem-green hover:text-salem-green-dark transition-colors"
            aria-label={t('Retour à l\'accueil', 'Back to home')}
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium hidden sm:inline">{t('Retour', 'Back')}</span>
          </button>
          <h1 className="font-serif text-lg sm:text-xl font-bold text-gray-800">
            {t('Contactez-nous', 'Contact Us')}
          </h1>
          <div className="w-16"></div>
        </div>
      </div>

      {/* HERO avec image et overlay */}
      <section className="relative h-[50vh] min-h-[350px] max-h-[450px] flex items-center justify-center overflow-hidden">
        {/* Image de fond */}
        <div className="absolute inset-0">
          <img 
            src="/images/IMG_2599.jpeg"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-salem-green/90 via-salem-green/85 to-salem-green-dark/95"></div>
        </div>

        {/* Particules décoratives */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.5}s`
              }}
            />
          ))}
        </div>

        {/* Contenu Hero */}
        <div className="relative z-10 text-center text-white px-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <Heart className="w-4 h-4 text-red-300" fill="currentColor" />
            <span className="text-sm font-medium">{t('Nous sommes là pour vous', 'We are here for you')}</span>
          </div>
          
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            {t('Restons en Contact', 'Stay in Touch')}
          </h2>
          
          <p className="text-white/90 text-base sm:text-lg mb-6 max-w-lg mx-auto">
            {t(
              'Une question, une intention de prière ou envie de rejoindre notre communauté ? Nous vous répondons sous 24h.',
              'A question, prayer intention or want to join our community? We respond within 24 hours.'
            )}
          </p>

          {/* Boutons d'action rapide */}
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://wa.me/237697033647"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white px-5 py-3 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105"
              aria-label="WhatsApp"
            >
              <MessageCircle size={20} />
              <span>WhatsApp</span>
            </a>
            <a
              href="mailto:contact@salemministry.org"
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-5 py-3 rounded-full font-semibold transition-all"
              aria-label="Email"
            >
              <Mail size={20} />
              <span>Email</span>
            </a>
            <a
              href="tel:+39350837064"
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-5 py-3 rounded-full font-semibold transition-all"
              aria-label={t('Appeler', 'Call')}
            >
              <Phone size={20} />
              <span>{t('Appeler', 'Call')}</span>
            </a>
          </div>
        </div>

        {/* Vague décorative */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 50L48 45C96 40 192 30 288 35C384 40 480 60 576 65C672 70 768 60 864 50C960 40 1056 30 1152 35C1248 40 1344 60 1392 70L1440 80V100H0V50Z" fill="#f9fafb"/>
          </svg>
        </div>
      </section>

      {/* Compteurs sociaux */}
      <section 
        ref={countersRef}
        className="bg-gray-50 py-8"
        id="counters"
        data-animate
      >
        <div className={`max-w-4xl mx-auto px-4 ${getAnimationClass('counters')}`}>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-2xl shadow-sm">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-salem-green">
                {counters.members.toLocaleString()}+
              </div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">{t('Membres', 'Members')}</div>
            </div>
            <div className="text-center p-4 bg-white rounded-2xl shadow-sm">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-salem-gold">
                {counters.countries}+
              </div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">{t('Pays', 'Countries')}</div>
            </div>
            <div className="text-center p-4 bg-white rounded-2xl shadow-sm">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-salem-red">
                {counters.prayers.toLocaleString()}+
              </div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">{t('Prières', 'Prayers')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Formulaire de contact */}
      <section 
        className="py-12 bg-white"
        id="form-section"
        data-animate
      >
        <div className={`max-w-xl mx-auto px-4 ${getAnimationClass('form-section')}`}>
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 text-salem-green text-sm font-semibold mb-2">
              <Mail size={16} />
              {t('FORMULAIRE', 'FORM')}
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-gray-800">
              {t('Envoyez-nous un message', 'Send us a message')}
            </h3>
            <p className="text-gray-600 mt-2 text-sm">
              {t('Réponse garantie sous 24h', 'Guaranteed response within 24h')} ⚡
            </p>
          </div>

          {formStatus === 'success' ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-green-800 text-lg mb-2">
                {t('Message envoyé !', 'Message sent!')}
              </h4>
              <p className="text-green-700 text-sm">
                {t('Nous vous répondrons très bientôt.', 'We will respond to you very soon.')}
              </p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              {/* Objet */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('Objet', 'Subject')} *
                </label>
                <select
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-salem-green/30 focus:border-salem-green transition-all appearance-none"
                  style={{ color: '#1f2937', backgroundColor: '#ffffff' }}
                  required
                >
                  {subjects.map(s => (
                    <option key={s.value} value={s.value} style={{ color: '#1f2937', backgroundColor: '#ffffff' }}>{s.label}</option>
                  ))}
                </select>
              </div>

              {/* Nom & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('Nom complet', 'Full name')} *
                  </label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    placeholder={t('Jean Dupont', 'John Doe')}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-salem-green/30 focus:border-salem-green transition-all"
                    style={{ color: '#1f2937', backgroundColor: '#ffffff' }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('Email', 'Email')} *
                  </label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    placeholder="email@exemple.com"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-salem-green/30 focus:border-salem-green transition-all"
                    style={{ color: '#1f2937', backgroundColor: '#ffffff' }}
                    required
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('Votre message', 'Your message')} *
                </label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  placeholder={t('Comment pouvons-nous vous aider ?', 'How can we help you?')}
                  rows={4}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-salem-green/30 focus:border-salem-green transition-all resize-none"
                  style={{ color: '#1f2937', backgroundColor: '#ffffff' }}
                  required
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={formStatus === 'loading'}
                className="w-full bg-gradient-to-r from-salem-green to-salem-green-dark hover:from-salem-green-dark hover:to-salem-green text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl disabled:opacity-70"
              >
                {formStatus === 'loading' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t('Envoi en cours...', 'Sending...')}
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    {t('Envoyer le message', 'Send message')}
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Cards Prière & Membre */}
      <section 
        className="py-12 bg-gradient-to-b from-gray-50 to-gray-100"
        id="cards-section"
        data-animate
      >
        <div className={`max-w-4xl mx-auto px-4 ${getAnimationClass('cards-section')}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card Prière */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all">
              <div className="h-32 bg-gradient-to-br from-salem-red to-red-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/IMG_2367.jpeg')] bg-cover bg-center opacity-30"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Heart className="w-8 h-8 text-white" fill="currentColor" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-serif text-xl font-bold text-gray-800 mb-2">
                  {t('Demande de Prière', 'Prayer Request')}
                </h4>
                <p className="text-gray-600 text-sm mb-4">
                  {t(
                    'Déposez vos intentions en toute confidentialité. Notre communauté prie pour vous.',
                    'Submit your intentions confidentially. Our community prays for you.'
                  )}
                </p>
                <button
                  onClick={() => setShowPrayerModal(true)}
                  className="w-full bg-salem-red hover:bg-salem-red-dark text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <Heart size={18} />
                  {t('Déposer une intention', 'Submit an intention')}
                </button>
              </div>
            </div>

            {/* Card Membre */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all">
              <div className="h-32 bg-gradient-to-br from-salem-green to-green-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/IMG_2463.jpeg')] bg-cover bg-center opacity-30"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-serif text-xl font-bold text-gray-800 mb-2">
                  {t('Devenir Membre', 'Become a Member')}
                </h4>
                <p className="text-gray-600 text-sm mb-4">
                  {t(
                    'Rejoignez notre communauté internationale et grandissez dans la foi.',
                    'Join our international community and grow in faith.'
                  )}
                </p>
                <button
                  onClick={() => setShowMemberModal(true)}
                  className="w-full bg-salem-green hover:bg-salem-green-dark text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <Users size={18} />
                  {t('Rejoindre la communauté', 'Join the community')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages Carousel */}
      <section 
        className="py-12 bg-white"
        id="testimonials-section"
        data-animate
      >
        <div className={`max-w-4xl mx-auto px-4 ${getAnimationClass('testimonials-section')}`}>
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 text-salem-gold text-sm font-semibold mb-2">
              <Star size={16} fill="currentColor" />
              {t('TÉMOIGNAGES', 'TESTIMONIALS')}
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-gray-800">
              {t('Ils nous font confiance', 'They trust us')}
            </h3>
          </div>

          {/* Carousel */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 p-6 sm:p-8">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
              >
                {testimonials.map((t, i) => (
                  <div key={i} className="min-w-full">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0">
                        <img src={t.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="text-center sm:text-left">
                        <div className="flex justify-center sm:justify-start gap-1 mb-3">
                          {[...Array(5)].map((_, j) => (
                            <Star key={j} size={18} className="text-salem-gold" fill="currentColor" />
                          ))}
                        </div>
                        <p className="text-gray-700 italic text-sm sm:text-base mb-4">
                          "{t.text}"
                        </p>
                        <div className="font-semibold text-gray-800">{t.author}</div>
                        <div className="text-sm text-gray-500">{t.country}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Indicateurs */}
            <div className="flex justify-center gap-2 mt-4">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentTestimonial(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === currentTestimonial ? 'bg-salem-green w-8' : 'bg-gray-300'
                  }`}
                  aria-label={`Témoignage ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Coordonnées & Map */}
      <section 
        className="py-12 bg-gradient-to-b from-gray-50 to-white"
        id="info-section"
        data-animate
      >
        <div className={`max-w-4xl mx-auto px-4 ${getAnimationClass('info-section')}`}>
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 text-salem-green text-sm font-semibold mb-2">
              <MapPin size={16} />
              {t('COORDONNÉES', 'CONTACT INFO')}
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-gray-800">
              {t('Où nous trouver', 'Where to find us')}
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Infos */}
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-salem-green/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-salem-green" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-800">{t('Adresse', 'Address')}</h5>
                  <p className="text-gray-600 text-sm">{t('Ministère SALEM, Bafia, Cameroun', 'SALEM Ministry, Bafia, Cameroon')}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-800">{t('Téléphone', 'Phone')}</h5>
                  <p className="text-gray-600 text-sm">+39 350 837 0643 (Italie)</p>
                  <p className="text-gray-600 text-sm">+237 697 033 647 (Cameroun)</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-800">{t('Email', 'Email')}</h5>
                  <p className="text-gray-600 text-sm">contact@salemministry.org</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-800">{t('Horaires', 'Hours')}</h5>
                  <p className="text-gray-600 text-sm">{t('Lun - Ven: 8h - 18h', 'Mon - Fri: 8am - 6pm')}</p>
                  <p className="text-gray-600 text-sm">{t('Sam: 8h - 12h', 'Sat: 8am - 12pm')}</p>
                </div>
              </div>

              {/* Réseaux sociaux */}
              <div className="pt-4 border-t">
                <h5 className="font-semibold text-gray-800 mb-3">{t('Suivez-nous', 'Follow us')}</h5>
                <div className="flex gap-3">
                  <a href="https://web.facebook.com/salemabundantlifeministry" target="_blank" rel="noopener noreferrer" 
                     className="w-11 h-11 bg-[#1877F2] hover:bg-[#1664d9] rounded-xl flex items-center justify-center transition-all hover:scale-110"
                     aria-label="Facebook">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                  <a href="https://www.youtube.com/@salemabundantlifeministry" target="_blank" rel="noopener noreferrer"
                     className="w-11 h-11 bg-[#FF0000] hover:bg-[#cc0000] rounded-xl flex items-center justify-center transition-all hover:scale-110"
                     aria-label="YouTube">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </a>
                  <a href="https://www.tiktok.com/@fadasalem" target="_blank" rel="noopener noreferrer"
                     className="w-11 h-11 bg-black hover:bg-gray-800 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                     aria-label="TikTok">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                  </a>
                  <a href="https://t.me/+237697033647" target="_blank" rel="noopener noreferrer"
                     className="w-11 h-11 bg-[#0088cc] hover:bg-[#006699] rounded-xl flex items-center justify-center transition-all hover:scale-110"
                     aria-label="Telegram">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="h-64 lg:h-full min-h-[250px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31838.77695456829!2d11.2166!3d4.7833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1061c2f5d14a5f9b%3A0x5b3b5c5a5b3b5c5a!2sBafia%2C%20Cameroon!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="SALEM Ministry Location"
                />
              </div>
              <a
                href="https://maps.google.com/?q=Bafia,Cameroon"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-3 transition-colors"
              >
                <ExternalLink size={16} />
                {t('Ouvrir dans Google Maps', 'Open in Google Maps')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section 
        className="py-12 bg-white"
        id="faq-section"
        data-animate
      >
        <div className={`max-w-2xl mx-auto px-4 ${getAnimationClass('faq-section')}`}>
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 text-salem-green text-sm font-semibold mb-2">
              <Globe size={16} />
              FAQ
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-gray-800">
              {t('Questions fréquentes', 'Frequently Asked Questions')}
            </h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-100 transition-colors"
                  aria-expanded={openFaq === index}
                >
                  <span className="font-medium text-gray-800 pr-4">{faq.q}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp flottant amélioré */}
      <a
        href="https://wa.me/237697033647"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 group"
        aria-label="Discuter sur WhatsApp"
      >
        <div className="relative">
          {/* Badge notification */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
          {/* Bouton principal */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#25D366] hover:bg-[#20BD5A] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all group-hover:scale-110">
            <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
        </div>
        {/* Tooltip */}
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {t('Discutez avec nous', 'Chat with us')}
        </div>
      </a>

      {/* MODAL - Intention de prière */}
      {showPrayerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="bg-gradient-to-r from-salem-red to-red-700 p-6 text-white relative">
              <button 
                onClick={() => { setShowPrayerModal(false); setPrayerError(''); setPrayerStatus('idle'); }}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                aria-label={t('Fermer', 'Close')}
              >
                <ChevronDown className="w-5 h-5 rotate-45" />
              </button>
              <Heart className="w-10 h-10 mb-3" fill="currentColor" />
              <h3 className="font-serif text-xl font-bold">{t('Intention de Prière', 'Prayer Intention')}</h3>
              <p className="text-white/80 text-sm mt-1">{t('Nous prierons pour vous', 'We will pray for you')}</p>
            </div>
            
            <form onSubmit={handlePrayerSubmit} className="p-6 space-y-4">
              {/* Message d'erreur */}
              {prayerError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {prayerError}
                </div>
              )}
              
              {/* Message de succès */}
              {prayerStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                  <Check size={18} />
                  {t('Intention envoyée avec succès !', 'Intention sent successfully!')}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('Votre nom', 'Your name')} *</label>
                <input
                  type="text"
                  value={prayerForm.name}
                  onChange={(e) => setPrayerForm({...prayerForm, name: e.target.value})}
                  placeholder={t('Jean Dupont', 'John Doe')}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-salem-red/30 focus:border-salem-red transition-all contact-form-input"
                  style={{ color: '#1f2937', backgroundColor: '#ffffff' }}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('Email', 'Email')}</label>
                  <input
                    type="email"
                    value={prayerForm.email}
                    onChange={(e) => setPrayerForm({...prayerForm, email: e.target.value})}
                    placeholder="email@exemple.com"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-salem-red/30 focus:border-salem-red transition-all contact-form-input"
                    style={{ color: '#1f2937', backgroundColor: '#ffffff' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('Téléphone', 'Phone')}</label>
                  <input
                    type="tel"
                    value={prayerForm.phone}
                    onChange={(e) => setPrayerForm({...prayerForm, phone: e.target.value})}
                    placeholder="+237 6XX XXX XXX"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-salem-red/30 focus:border-salem-red transition-all contact-form-input"
                    style={{ color: '#1f2937', backgroundColor: '#ffffff' }}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('Pays', 'Country')}</label>
                <select
                  value={prayerForm.country}
                  onChange={(e) => setPrayerForm({...prayerForm, country: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-salem-red/30 focus:border-salem-red transition-all contact-form-input"
                  style={{ color: '#1f2937', backgroundColor: '#ffffff' }}
                >
                  <option value="Cameroun">🇨🇲 Cameroun</option>
                  <option value="France">🇫🇷 France</option>
                  <option value="Italie">🇮🇹 Italie</option>
                  <option value="USA">🇺🇸 USA</option>
                  <option value="Canada">🇨🇦 Canada</option>
                  <option value="Belgique">🇧🇪 Belgique</option>
                  <option value="Suisse">🇨🇭 Suisse</option>
                  <option value="Allemagne">🇩🇪 Allemagne</option>
                  <option value="UK">🇬🇧 Royaume-Uni</option>
                  <option value="Nigeria">🇳🇬 Nigeria</option>
                  <option value="Côte d'Ivoire">🇨🇮 Côte d'Ivoire</option>
                  <option value="Sénégal">🇸🇳 Sénégal</option>
                  <option value="Autre">{t('Autre', 'Other')}</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('Votre intention de prière', 'Your prayer intention')} *</label>
                <textarea
                  value={prayerForm.intention}
                  onChange={(e) => setPrayerForm({...prayerForm, intention: e.target.value})}
                  placeholder={t('Partagez votre intention de prière en toute confidentialité...', 'Share your prayer intention in complete confidentiality...')}
                  rows={4}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-salem-red/30 focus:border-salem-red transition-all resize-none contact-form-input"
                  style={{ color: '#1f2937', backgroundColor: '#ffffff' }}
                  required
                />
              </div>
              
              <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <input
                  type="checkbox"
                  checked={prayerForm.anonymous}
                  onChange={(e) => setPrayerForm({...prayerForm, anonymous: e.target.checked})}
                  className="w-5 h-5 text-salem-red rounded border-gray-300 focus:ring-salem-red"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">{t('Rester anonyme', 'Stay anonymous')}</span>
                  <p className="text-xs text-gray-500">{t('Votre nom ne sera pas affiché', 'Your name will not be displayed')}</p>
                </div>
              </label>
              
              <button
                type="submit"
                disabled={prayerStatus === 'loading'}
                className="w-full bg-gradient-to-r from-salem-red to-red-700 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-lg disabled:opacity-70"
              >
                {prayerStatus === 'loading' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t('Envoi en cours...', 'Sending...')}
                  </>
                ) : (
                  <>
                    <Heart size={18} />
                    {t('🙏 Envoyer mon intention', '🙏 Send my intention')}
                  </>
                )}
              </button>
              
              <p className="text-center text-xs text-gray-500">
                🔒 {t('Vos données sont protégées et confidentielles', 'Your data is protected and confidential')}
              </p>
            </form>
          </div>
        </div>
      )}

      {/* MODAL - Devenir membre */}
      {showMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="bg-gradient-to-r from-salem-green to-green-700 p-6 text-white relative">
              <button 
                onClick={() => setShowMemberModal(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                aria-label={t('Fermer', 'Close')}
              >
                <ChevronDown className="w-5 h-5 rotate-45" />
              </button>
              <Users className="w-10 h-10 mb-3" />
              <h3 className="font-serif text-xl font-bold">{t('Devenir Membre', 'Become a Member')}</h3>
              <p className="text-white/80 text-sm mt-1">{t('Rejoignez notre communauté', 'Join our community')}</p>
            </div>
            
            <form onSubmit={handleMemberSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('Prénom', 'First name')} *</label>
                  <input
                    type="text"
                    value={memberForm.firstName}
                    onChange={(e) => setMemberForm({...memberForm, firstName: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-salem-green/30 focus:border-salem-green transition-all"
                    style={{ color: '#1f2937', backgroundColor: '#ffffff' }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('Nom', 'Last name')} *</label>
                  <input
                    type="text"
                    value={memberForm.lastName}
                    onChange={(e) => setMemberForm({...memberForm, lastName: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-salem-green/30 focus:border-salem-green transition-all"
                    style={{ color: '#1f2937', backgroundColor: '#ffffff' }}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('Email', 'Email')} *</label>
                <input
                  type="email"
                  value={memberForm.email}
                  onChange={(e) => setMemberForm({...memberForm, email: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-salem-green/30 focus:border-salem-green transition-all"
                  style={{ color: '#1f2937', backgroundColor: '#ffffff' }}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('Téléphone', 'Phone')}</label>
                <input
                  type="tel"
                  value={memberForm.phone}
                  onChange={(e) => setMemberForm({...memberForm, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-salem-green/30 focus:border-salem-green transition-all"
                  style={{ color: '#1f2937', backgroundColor: '#ffffff' }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('Pays', 'Country')} *</label>
                <input
                  type="text"
                  value={memberForm.country}
                  onChange={(e) => setMemberForm({...memberForm, country: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-salem-green/30 focus:border-salem-green transition-all"
                  style={{ color: '#1f2937', backgroundColor: '#ffffff' }}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('Motivation', 'Motivation')}</label>
                <textarea
                  value={memberForm.motivation}
                  onChange={(e) => setMemberForm({...memberForm, motivation: e.target.value})}
                  rows={3}
                  placeholder={t('Pourquoi souhaitez-vous nous rejoindre ?', 'Why do you want to join us?')}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-salem-green/30 focus:border-salem-green transition-all resize-none"
                  style={{ color: '#1f2937', backgroundColor: '#ffffff' }}
                />
              </div>
              
              <button
                type="submit"
                disabled={formStatus === 'loading'}
                className="w-full bg-gradient-to-r from-salem-green to-green-700 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-lg disabled:opacity-70"
              >
                {formStatus === 'loading' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Users size={18} />
                    {t("Envoyer ma demande", "Send my request")}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
