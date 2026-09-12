import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Heart, Users, BookOpen, 
  Flame, Cross, Globe, Target, Eye, Compass, Shield,
  Church, HandHeart, MessageCircle, GraduationCap, Radio,
  Calendar, Quote, ArrowRight,
  Sparkles, Zap, Wind, Sun, Crown, BookMarked
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface AboutPageProps {
  onBack: () => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onBack }) => {
  const { t } = useLanguage();
  const [activeJourneyStage, setActiveJourneyStage] = useState(0);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

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
      { threshold: 0.1 }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const setSectionRef = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  };

  // Données du parcours spirituel
  const journeyStages = [
    {
      stage: 1,
      titleFr: "Rencontre",
      titleEn: "Encounter",
      descFr: "Première rencontre avec Dieu à travers le ministère",
      descEn: "Initial meeting with God through the ministry",
      icon: Heart,
      color: "from-red-500 to-red-600"
    },
    {
      stage: 2,
      titleFr: "Éveil Spirituel",
      titleEn: "Spiritual Awakening",
      descFr: "Prise de conscience de la présence du Saint-Esprit",
      descEn: "Awareness of the Holy Spirit's presence",
      icon: Sun,
      color: "from-yellow-500 to-orange-500"
    },
    {
      stage: 3,
      titleFr: "Guérison & Délivrance",
      titleEn: "Healing & Deliverance",
      descFr: "Restauration des blessures et libération spirituelle",
      descEn: "Restoration of wounds and spiritual liberation",
      icon: Shield,
      color: "from-green-500 to-emerald-600"
    },
    {
      stage: 4,
      titleFr: "Formation",
      titleEn: "Formation",
      descFr: "Enseignement et accompagnement spirituel",
      descEn: "Teaching and spiritual guidance",
      icon: GraduationCap,
      color: "from-blue-500 to-blue-600"
    },
    {
      stage: 5,
      titleFr: "Maturité",
      titleEn: "Maturity",
      descFr: "Foi stable et responsable dans l'Esprit",
      descEn: "Stable and responsible faith in the Spirit",
      icon: Crown,
      color: "from-purple-500 to-purple-600"
    },
    {
      stage: 6,
      titleFr: "Mission",
      titleEn: "Mission",
      descFr: "Aider les autres à rencontrer Dieu",
      descEn: "Helping others encounter God",
      icon: Globe,
      color: "from-indigo-500 to-indigo-600"
    },
    {
      stage: 7,
      titleFr: "Communauté",
      titleEn: "Community",
      descFr: "Rejoindre le Mouvement Charismatique SALEM",
      descEn: "Joining the SALEM Charismatic Movement",
      icon: Users,
      color: "from-salem-green to-green-600"
    }
  ];

  // Couches de préoccupation pastorale
  const pastoralLayers = [
    {
      icon: Flame,
      titleFr: "Éveil au Saint-Esprit",
      titleEn: "Awakening to the Holy Spirit",
      descFr: "Éveiller les croyants à la présence vivante du Saint-Esprit. Beaucoup ont reçu les sacrements mais n'ont pas encore découvert la vie dynamique de l'Esprit.",
      descEn: "Awakening believers to the living presence of the Holy Spirit. Many have received the Sacraments but have not yet discovered the dynamic life of the Spirit.",
      color: "bg-orange-500"
    },
    {
      icon: Heart,
      titleFr: "Guérison & Délivrance",
      titleEn: "Healing & Deliverance",
      descFr: "L'éveil spirituel révèle souvent des domaines nécessitant guérison et libération : blessures physiques ou émotionnelles, relations brisées, oppression spirituelle.",
      descEn: "Spiritual awakening often reveals areas needing healing and liberation: physical or emotional wounds, broken relationships, spiritual oppression.",
      color: "bg-red-500"
    },
    {
      icon: Compass,
      titleFr: "Conseil & Discernement",
      titleEn: "Counseling & Discernment",
      descFr: "Les croyants reçoivent des conseils pour reconnaître les mouvements du Saint-Esprit, prendre des décisions de vie et développer leur responsabilité spirituelle.",
      descEn: "Believers receive guidance to recognize movements of the Holy Spirit, make life decisions, and develop responsibility for their spiritual journey.",
      color: "bg-blue-500"
    },
    {
      icon: BookOpen,
      titleFr: "Formation Spirituelle",
      titleEn: "Spiritual Formation",
      descFr: "Formation en doctrine chrétienne, vie de prière, responsabilité morale, discipline spirituelle et dons de l'Esprit.",
      descEn: "Formation in Christian doctrine, prayer life, moral responsibility, spiritual discipline, and gifts of the Spirit.",
      color: "bg-purple-500"
    },
    {
      icon: HandHeart,
      titleFr: "Intercession",
      titleEn: "Intercession",
      descFr: "Les chrétiens matures sont formés comme intercesseurs, priant pour les familles, les communautés, l'Église et la nation.",
      descEn: "Mature Christians are trained as intercessors, praying for families, communities, the Church, and the nation.",
      color: "bg-green-500"
    },
    {
      icon: Globe,
      titleFr: "Mission & Service",
      titleEn: "Mission & Outreach",
      descFr: "Les croyants matures participent à l'évangélisation, aux initiatives de charité et aux programmes de sensibilisation.",
      descEn: "Mature believers participate in evangelization, charity initiatives, and outreach programs.",
      color: "bg-indigo-500"
    }
  ];

  // Structure du mouvement
  const movementLevels = [
    { levelFr: "Visiteurs / Chercheurs", levelEn: "Seekers / Visitors", descFr: "Premiers participants", descEn: "First-time attendees" },
    { levelFr: "Participants en Formation", levelEn: "Formation Participants", descFr: "Séminaires et retraites", descEn: "Attending seminars and retreats" },
    { levelFr: "Membres Engagés", levelEn: "Committed Members", descFr: "Prière régulière et vie communautaire", descEn: "Regular prayer and community life" },
    { levelFr: "Intercesseurs", levelEn: "Intercessors", descFr: "Ministère de prière", descEn: "Prayer ministry and spiritual support" },
    { levelFr: "Serviteurs de Mission", levelEn: "Mission Servants", descFr: "Évangélisation et animation", descEn: "Evangelization, animation, worship" },
    { levelFr: "Leaders Communautaires", levelEn: "Community Leaders", descFr: "Direction des groupes de prière", descEn: "Guiding prayer groups and formation cells" }
  ];

  // Principes du manifeste
  const manifestoPrinciples = [
    {
      icon: Wind,
      titleFr: "L'Esprit est la vie de l'Église",
      titleEn: "The Spirit is the life of the Church",
      descFr: "Sans l'Esprit, la foi devient routine ; avec Lui, les cœurs sont renouvelés.",
      descEn: "Without the Spirit, faith becomes routine; with Him, hearts are renewed."
    },
    {
      icon: Heart,
      titleFr: "Relation personnelle avec l'Esprit",
      titleEn: "Personal relationship with the Spirit",
      descFr: "Chaque chrétien est appelé à une relation personnelle avec le Saint-Esprit qui éclaire, fortifie, guérit et guide.",
      descEn: "Every Christian is called to a personal relationship with the Spirit who enlightens, strengthens, heals, and guides."
    },
    {
      icon: Shield,
      titleFr: "L'Esprit guérit et restaure",
      titleEn: "The Spirit heals and restores",
      descFr: "Les blessures, l'oppression et les ruptures sont restaurées par la puissance de l'Esprit.",
      descEn: "Wounds, oppression, and brokenness are restored through the Spirit's power."
    },
    {
      icon: Globe,
      titleFr: "La maturité mène à la mission",
      titleEn: "Maturity leads to mission",
      descFr: "Les rencontres avec l'Esprit ne sont jamais privées ; les croyants deviennent instruments de l'amour de Dieu.",
      descEn: "Encounters with the Spirit are never private; believers become instruments of God's love."
    },
    {
      icon: Church,
      titleFr: "L'Église est la maison de la mission",
      titleEn: "The Church is the home of mission",
      descFr: "Le ministère renforce les croyants pour servir fidèlement l'Église.",
      descEn: "The ministry strengthens believers to serve the Church faithfully."
    },
    {
      icon: Sparkles,
      titleFr: "SALEM est paix et vie abondante",
      titleEn: "SALEM is peace and abundant life",
      descFr: "Les croyants intériorisent la vie abondante de l'Évangile par l'Esprit et la vivent dans le monde.",
      descEn: "Believers internalize the Gospel's abundant life through the Spirit and live it in the world."
    }
  ];

  // Activités du ministère
  const ministryActivities = [
    { icon: BookOpen, titleFr: "Enseignement & Formation", titleEn: "Teaching & Formation" },
    { icon: HandHeart, titleFr: "Prière de Guérison & Délivrance", titleEn: "Healing & Deliverance Prayer" },
    { icon: MessageCircle, titleFr: "Conseil & Discernement Spirituel", titleEn: "Spiritual Counseling & Discernment" },
    { icon: Calendar, titleFr: "Retraites & Programmes de Formation", titleEn: "Retreats & Formation Programs" },
    { icon: Globe, titleFr: "Missions & Croisades", titleEn: "Missionary Outreach & Crusades" },
    { icon: Radio, titleFr: "Enseignement Radio Maria", titleEn: "Radio Maria Teaching" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header Sticky */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-salem-green transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">{t('Retour', 'Back')}</span>
          </button>
          <h1 className="font-serif text-lg sm:text-xl font-semibold text-gray-800">
            {t('À Propos', 'About Us')}
          </h1>
          <div className="w-16"></div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[50vh] sm:min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/IMG_2463.jpeg"
            alt="SALEM Ministry"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-salem-green/90 via-salem-green/85 to-black/90"></div>
        </div>
        
        {/* Particules décoratives */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${4 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* Logo */}
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full p-2 shadow-2xl">
              <img
                src="/images/logosalem.png"
                alt="SALEM Ministry"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            {t('Ministère SALEM', 'SALEM Ministry')}
          </h1>
          
          <p className="font-lora text-lg sm:text-xl md:text-2xl text-salem-gold italic mb-6">
            {t(
              '"L\'Esprit Saint nous donne la vie abondante"',
              '"The Holy Spirit gives us abundant life"'
            )}
          </p>

          <p className="text-white/90 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {t(
              'Spirit Abundant Life Evangelical Movement - Un espace pastoral de rencontre, de guérison, de formation et d\'accompagnement spirituel.',
              'Spirit Abundant Life Evangelical Movement - A pastoral space of encounter, healing, formation, and spiritual accompaniment.'
            )}
          </p>
        </div>

        {/* Vague décorative */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto">
            <path
              fill="#ffffff"
              d="M0,64L60,69.3C120,75,240,85,360,80C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
            />
          </svg>
        </div>
      </section>

      {/* Section Vision */}
      <section
        id="vision"
        ref={setSectionRef('vision')}
        className={`py-12 sm:py-16 md:py-20 px-4 bg-white transition-all duration-1000 ${
          visibleSections.has('vision') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-salem-green/10 px-4 py-2 rounded-full mb-4">
              <Eye className="w-5 h-5 text-salem-green" />
              <span className="text-salem-green font-medium text-sm">{t('Notre Vision', 'Our Vision')}</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              {t('Vision et Identité Spirituelle', 'Vision and Spiritual Identity')}
            </h2>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed text-base sm:text-lg mb-6">
              {t(
                'Le Ministère SALEM n\'a pas émergé principalement comme un projet institutionnel, mais comme une réponse pastorale à une conviction spirituelle : que de nombreux chrétiens désirent une rencontre plus profonde avec Dieu, mais manquent souvent de guidance vers l\'expérience vivante du Saint-Esprit.',
                'SALEM Ministry emerged not primarily as an institutional project but as a pastoral response to a spiritual conviction: that many Christians desire a deeper encounter with God but often lack guidance into the living experience of the Holy Spirit.'
              )}
            </p>

            <div className="bg-gradient-to-r from-salem-gold/10 to-salem-green/10 rounded-xl p-6 sm:p-8 my-8 border-l-4 border-salem-gold">
              <Quote className="w-8 h-8 text-salem-gold mb-4" />
              <p className="font-lora text-lg sm:text-xl text-gray-800 italic leading-relaxed">
                {t(
                  'La conviction centrale : Le Saint-Esprit est vivant et transforme activement les vies aujourd\'hui.',
                  'Core conviction: The Holy Spirit is alive and actively transforming lives today.'
                )}
              </p>
            </div>
          </div>

          {/* Signification de SALEM */}
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-salem-green/5 to-salem-green/10 rounded-xl p-6 border border-salem-green/20">
              <div className="w-12 h-12 bg-salem-green/20 rounded-full flex items-center justify-center mb-4">
                <BookMarked className="w-6 h-6 text-salem-green" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-gray-800 mb-3">
                {t('Signification Biblique', 'Biblical Meaning')}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                {t(
                  'Salem évoque la paix, la restauration et la présence divine, pointant vers l\'objectif du ministère : amener les gens à la réconciliation avec Dieu et à la restauration intérieure par le Saint-Esprit.',
                  'Salem evokes peace, restoration, and divine presence, pointing toward the ministry\'s goal of bringing people into reconciliation with God and inner restoration through the Holy Spirit.'
                )}
              </p>
            </div>

            <div className="bg-gradient-to-br from-salem-gold/5 to-salem-gold/10 rounded-xl p-6 border border-salem-gold/20">
              <div className="w-12 h-12 bg-salem-gold/20 rounded-full flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-salem-gold" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-gray-800 mb-3">
                {t('Signification Acronymique', 'Acronymic Meaning')}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                {t(
                  'SALEM signifie Spirit Abundant Life Evangelical Movement. Cela souligne que la paix promue n\'est pas simplement l\'absence de conflit, mais la paix expérientielle qui vient de l\'intériorisation de la vie abondante offerte dans l\'Évangile.',
                  'SALEM stands for Spirit Abundant Life Evangelical Movement. This emphasizes that the peace promoted is not merely the absence of conflict, but the experiential peace that comes from internalizing the abundant life offered in the Gospel.'
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Fondateur */}
      <section
        id="founder"
        ref={setSectionRef('founder')}
        className={`py-12 sm:py-16 md:py-20 px-4 bg-gray-50 transition-all duration-1000 ${
          visibleSections.has('founder') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-salem-red/10 px-4 py-2 rounded-full mb-4">
              <Cross className="w-5 h-5 text-salem-red" />
              <span className="text-salem-red font-medium text-sm">{t('Le Fondateur', 'The Founder')}</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
              {t('Fada SALEM', 'Fada SALEM')}
            </h2>
            <p className="text-salem-gold font-lora italic mt-2">
              "Fada Onyemuo" - {t('L\'homme de l\'Esprit', 'The man of the Spirit')}
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* Photo */}
            <div className="lg:col-span-2">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-salem-green/20 to-salem-gold/20 rounded-2xl blur-xl"></div>
                <div className="relative rounded-xl overflow-hidden shadow-2xl">
                  <img
                    src="/images/peresalem4.jpeg"
                    alt="Fada SALEM"
                    className="w-full aspect-[3/4] object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 sm:p-6">
                    <h3 className="font-serif text-lg sm:text-xl text-white font-semibold">
                      {t('Rév. Père John Paul Chinonso Uzochukwu', 'Rev. Fr. John Paul Chinonso Uzochukwu')}
                    </h3>
                    <p className="text-salem-gold text-sm sm:text-base">
                      {t('Congrégation du Saint-Esprit (Spiritains)', 'Congregation of the Holy Spirit (Spiritans)')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="lg:col-span-3 space-y-6">
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                {t(
                  'Fada SALEM est un prêtre catholique de la Congrégation du Saint-Esprit, communément appelés les Spiritains. Sa vocation sacerdotale s\'est développée avec un fort désir d\'aider les croyants à expérimenter la présence vivante du Saint-Esprit dans leur vie quotidienne.',
                  'Fada SALEM is a Catholic priest of the Congregation of the Holy Spirit, commonly known as the Spiritans. His priestly vocation developed within a strong desire to help believers experience the living presence of the Holy Spirit in their daily lives.'
                )}
              </p>

              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                {t(
                  'Dès les premières années de son ministère, il a cultivé une dévotion personnelle profonde au Saint-Esprit, qui est progressivement devenue l\'orientation centrale de son travail pastoral. Cette dévotion reflète une conviction théologique et spirituelle : que le Saint-Esprit est celui qui renouvelle l\'Église, transforme les vies et guide les croyants vers la plénitude de la vie chrétienne.',
                  'From the early years of his ministry, he cultivated a deep personal devotion to the Holy Spirit, which gradually became the central orientation of his pastoral work. This devotion reflects a theological and spiritual conviction: that the Holy Spirit is the one who renews the Church, transforms lives, and guides believers into the fullness of Christian life.'
                )}
              </p>

              <div className="bg-white rounded-xl p-5 sm:p-6 shadow-lg border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-salem-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Quote className="w-5 h-5 text-salem-gold" />
                  </div>
                  <div>
                    <p className="font-lora text-gray-700 italic text-sm sm:text-base leading-relaxed">
                      {t(
                        'En raison de l\'accent mis sur l\'Esprit dans sa prédication et son ministère, beaucoup ont commencé à l\'appeler affectueusement "Fada Onyemuo", signifiant "l\'homme de l\'Esprit". Ce surnom reflète la perception que son ministère dirige constamment les gens vers une conscience plus profonde de la présence et de l\'action du Saint-Esprit.',
                        'Because of the strong emphasis on the Spirit in his preaching and ministry, many people began affectionately referring to him as "Fada Onyemuo," meaning "the man of the Spirit." This nickname reflects the perception that his ministry consistently directs people toward a deeper awareness of the Holy Spirit\'s presence and action.'
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 bg-salem-green/10 text-salem-green rounded-full text-sm font-medium">
                  {t('Fondé en 2017', 'Founded in 2017')}
                </span>
                <span className="px-4 py-2 bg-salem-gold/10 text-salem-gold rounded-full text-sm font-medium">
                  {t('Prêtre Spiritain', 'Spiritan Priest')}
                </span>
                <span className="px-4 py-2 bg-salem-red/10 text-salem-red rounded-full text-sm font-medium">
                  {t('Bafia, Cameroun', 'Bafia, Cameroon')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Activités */}
      <section
        id="activities"
        ref={setSectionRef('activities')}
        className={`py-12 sm:py-16 md:py-20 px-4 bg-white transition-all duration-1000 ${
          visibleSections.has('activities') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-salem-green/10 px-4 py-2 rounded-full mb-4">
              <Target className="w-5 h-5 text-salem-green" />
              <span className="text-salem-green font-medium text-sm">{t('Nos Activités', 'Our Activities')}</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {t('Ce Que Nous Faisons', 'What We Do')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              {t(
                'Un espace pastoral où les gens peuvent venir rencontrer Dieu, expérimenter la guérison, recevoir une formation spirituelle et grandir vers la maturité chrétienne.',
                'A pastoral space where people can come to encounter God, experience healing, receive spiritual formation, and grow toward Christian maturity.'
              )}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {ministryActivities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div
                  key={index}
                  className="group bg-white rounded-xl p-5 sm:p-6 shadow-lg border border-gray-100 hover:border-salem-green/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-salem-green/10 to-salem-gold/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-salem-green" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-gray-800">
                    {t(activity.titleFr, activity.titleEn)}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section Parcours Spirituel */}
      <section
        id="journey"
        ref={setSectionRef('journey')}
        className={`py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-b from-gray-50 to-white transition-all duration-1000 ${
          visibleSections.has('journey') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-salem-gold/10 px-4 py-2 rounded-full mb-4">
              <Compass className="w-5 h-5 text-salem-gold" />
              <span className="text-salem-gold font-medium text-sm">{t('Parcours Spirituel', 'Spiritual Journey')}</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {t('Les 7 Étapes du Parcours SALEM', 'The 7 Stages of the SALEM Journey')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              {t(
                'De la recherche initiale à l\'engagement communautaire, découvrez le chemin de transformation spirituelle.',
                'From initial search to community engagement, discover the path of spiritual transformation.'
              )}
            </p>
          </div>

          {/* Timeline verticale mobile, horizontale desktop */}
          <div className="relative">
            {/* Ligne de connexion */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-salem-green via-salem-gold to-salem-red transform -translate-y-1/2 rounded-full"></div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4 lg:gap-2">
              {journeyStages.map((stage, index) => {
                const Icon = stage.icon;
                const isActive = activeJourneyStage === index;
                return (
                  <button
                    key={index}
                    onClick={() => setActiveJourneyStage(index)}
                    className={`relative flex flex-col items-center p-4 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-white shadow-xl scale-105 border-2 border-salem-green' 
                        : 'bg-white/50 hover:bg-white hover:shadow-lg border border-gray-100'
                    }`}
                  >
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br ${stage.color} flex items-center justify-center shadow-lg mb-3`}>
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <span className="text-xs font-bold text-gray-400 mb-1">
                      {t(`Étape ${stage.stage}`, `Stage ${stage.stage}`)}
                    </span>
                    <h3 className="font-semibold text-sm text-gray-800 text-center">
                      {t(stage.titleFr, stage.titleEn)}
                    </h3>
                  </button>
                );
              })}
            </div>

            {/* Description de l'étape active */}
            <div className="mt-8 bg-white rounded-xl p-6 sm:p-8 shadow-lg border border-gray-100">
              <div className="flex items-start gap-4">
                {(() => {
                  const ActiveIcon = journeyStages[activeJourneyStage].icon;
                  return (
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${journeyStages[activeJourneyStage].color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                      <ActiveIcon className="w-7 h-7 text-white" />
                    </div>
                  );
                })()}
                <div>
                  <span className="text-sm font-bold text-salem-gold">
                    {t(`Étape ${journeyStages[activeJourneyStage].stage}`, `Stage ${journeyStages[activeJourneyStage].stage}`)}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-800 mt-1">
                    {t(journeyStages[activeJourneyStage].titleFr, journeyStages[activeJourneyStage].titleEn)}
                  </h3>
                  <p className="text-gray-600 mt-3 text-sm sm:text-base leading-relaxed">
                    {t(journeyStages[activeJourneyStage].descFr, journeyStages[activeJourneyStage].descEn)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Couches Pastorales */}
      <section
        id="pastoral"
        ref={setSectionRef('pastoral')}
        className={`py-12 sm:py-16 md:py-20 px-4 bg-white transition-all duration-1000 ${
          visibleSections.has('pastoral') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-salem-red/10 px-4 py-2 rounded-full mb-4">
              <HandHeart className="w-5 h-5 text-salem-red" />
              <span className="text-salem-red font-medium text-sm">{t('Accompagnement', 'Pastoral Care')}</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {t('Couches de Préoccupation Pastorale', 'Layers of Pastoral Concern')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              {t(
                'Le Ministère SALEM fonctionne comme un terrain de soins spirituels où les croyants sont accompagnés vers la clarté, la liberté et la maturité spirituelle.',
                'SALEM Ministry functions as a spiritual nursing ground where believers are helped to grow toward spiritual clarity, freedom, and maturity.'
              )}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastoralLayers.map((layer, index) => {
              const Icon = layer.icon;
              return (
                <div
                  key={index}
                  className="group bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className={`h-2 ${layer.color}`}></div>
                  <div className="p-5 sm:p-6">
                    <div className={`w-12 h-12 ${layer.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-gray-800 mb-3">
                      {t(layer.titleFr, layer.titleEn)}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {t(layer.descFr, layer.descEn)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section Structure du Mouvement */}
      <section
        id="movement"
        ref={setSectionRef('movement')}
        className={`py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-br from-salem-green/5 to-salem-gold/5 transition-all duration-1000 ${
          visibleSections.has('movement') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-salem-green/10 px-4 py-2 rounded-full mb-4">
              <Users className="w-5 h-5 text-salem-green" />
              <span className="text-salem-green font-medium text-sm">{t('Communauté', 'Community')}</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {t('Mouvement Charismatique Catholique SALEM', 'SALEM Catholic Charismatic Movement')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              {t(
                'Une communauté laïque où les croyants peuvent vivre leur foi dans la responsabilité, la maturité et l\'engagement missionnaire.',
                'A lay community where believers can live out their faith in responsibility, maturity, and missionary engagement.'
              )}
            </p>
          </div>

          {/* Pyramide des niveaux */}
          <div className="space-y-3 sm:space-y-4">
            {movementLevels.map((level, index) => {
              const widthClass = [
                'w-full sm:w-[95%]',
                'w-[95%] sm:w-[85%]',
                'w-[90%] sm:w-[75%]',
                'w-[85%] sm:w-[65%]',
                'w-[80%] sm:w-[55%]',
                'w-[75%] sm:w-[45%]'
              ][index];
              
              return (
                <div
                  key={index}
                  className={`mx-auto ${widthClass} bg-white rounded-xl p-4 sm:p-5 shadow-lg border border-gray-100 hover:shadow-xl hover:border-salem-green/30 transition-all duration-300`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-salem-green to-salem-green-light rounded-full flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0">
                      {6 - index}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                        {t(level.levelFr, level.levelEn)}
                      </h3>
                      <p className="text-gray-500 text-xs sm:text-sm">
                        {t(level.descFr, level.descEn)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section Manifeste */}
      <section
        id="manifesto"
        ref={setSectionRef('manifesto')}
        className={`py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-b from-salem-green to-salem-green-dark text-white transition-all duration-1000 ${
          visibleSections.has('manifesto') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-4">
              <Flame className="w-5 h-5 text-salem-gold" />
              <span className="text-salem-gold font-medium text-sm">{t('Notre Manifeste', 'Our Manifesto')}</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              {t('La Vision Remplie de l\'Esprit', 'The Spirit-Filled Vision of SALEM')}
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto text-sm sm:text-base">
              {t(
                'Nos principes fondamentaux pour une vie chrétienne pleinement vivante dans le Saint-Esprit.',
                'Our core principles for a Christian life fully alive in the Holy Spirit.'
              )}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {manifestoPrinciples.map((principle, index) => {
              const Icon = principle.icon;
              return (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-5 sm:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-salem-gold/20 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-salem-gold" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold mb-3">
                    {t(principle.titleFr, principle.titleEn)}
                  </h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    {t(principle.descFr, principle.descEn)}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Citation finale */}
          <div className="mt-12 text-center">
            <div className="inline-block bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-salem-gold/30">
              <p className="font-lora text-xl sm:text-2xl md:text-3xl italic text-salem-gold mb-4">
                "SALEM… {t('Le Saint-Esprit nous donne la vie abondante.', 'The Holy Spirit gives us abundant life.')}"
              </p>
              <div className="flex items-center justify-center gap-2 text-white/60">
                <span>—</span>
                <span>{t('Vision du Ministère SALEM', 'SALEM Ministry Vision')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-12 sm:py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
            {t('Rejoignez le Mouvement', 'Join the Movement')}
          </h2>
          <p className="text-gray-600 mb-8 text-sm sm:text-base">
            {t(
              'Commencez votre parcours spirituel avec le Ministère SALEM. Rencontrez Dieu, expérimentez la guérison, et grandissez dans l\'Esprit.',
              'Begin your spiritual journey with SALEM Ministry. Encounter God, experience healing, and grow in the Spirit.'
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/237697033647"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              {t('Nous Contacter', 'Contact Us')}
            </a>
            <button
              onClick={onBack}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-salem-green to-salem-green-light text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              {t('Découvrir nos Événements', 'Discover our Events')}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
