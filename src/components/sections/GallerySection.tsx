import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, Grid3X3, Sparkles } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface GalleryImage {
  src: string;
  category: string;
  title: string;
}

const galleryImages: GalleryImage[] = [
  { src: '/images/peresalem4.jpeg', category: 'ministry', title: 'Père Salem' },
  { src: '/images/IMG_2599.jpeg', category: 'worship', title: 'Adoration' },
  { src: '/images/IMG_2367.jpeg', category: 'prayer', title: 'Prière' },
  { src: '/images/IMG_2391.jpeg', category: 'community', title: 'Communauté' },
  { src: '/images/IMG_2463.jpeg', category: 'events', title: 'Événements' },
  { src: '/images/IMG_2628.jpeg', category: 'events', title: 'Retraite' },
  { src: '/images/IMG_2636.jpeg', category: 'worship', title: 'Louange' },
  { src: '/images/img5.jpg', category: 'ministry', title: 'Ministère' },
  { src: '/images/img7.jpg', category: 'prayer', title: 'Intercession' },
  { src: '/images/img9.jpg', category: 'community', title: 'Famille' },
  { src: '/images/IMG_2319.jpeg', category: 'community', title: 'Assemblée' },
];

const GallerySection: React.FC = () => {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxImage, setLightboxImage] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const filters = [
    { id: 'all', label: t('Tout', 'All') },
    { id: 'ministry', label: t('Ministère', 'Ministry') },
    { id: 'worship', label: t('Adoration', 'Worship') },
    { id: 'prayer', label: t('Prière', 'Prayer') },
    { id: 'events', label: t('Événements', 'Events') },
    { id: 'community', label: t('Communauté', 'Community') },
  ];

  const filteredImages = activeFilter === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeFilter);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxImage === null) return;
      
      if (e.key === 'Escape') setLightboxImage(null);
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImage, filteredImages]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (lightboxImage !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightboxImage]);

  const navigateLightbox = (direction: number) => {
    if (lightboxImage === null) return;
    const newIndex = (lightboxImage + direction + filteredImages.length) % filteredImages.length;
    setLightboxImage(newIndex);
  };

  return (
    <section ref={sectionRef} id="gallery" className="py-20 md:py-28 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-salem-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-salem-green/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-salem-gold/10 rounded-full mb-4">
            <Grid3X3 className="w-4 h-4 text-salem-gold" />
            <span className="text-salem-gold font-semibold text-sm uppercase tracking-wider">
              {t('Nos Moments', 'Our Moments')}
            </span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            {t('Galerie ', 'Photo ')}
            <span className="text-gradient-gold">{t('Photos', 'Gallery')}</span>
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="w-16 h-1 bg-gradient-to-r from-salem-green to-transparent rounded-full" />
            <Sparkles className="w-5 h-5 text-salem-gold" />
            <div className="w-16 h-1 bg-gradient-to-l from-salem-red to-transparent rounded-full" />
          </div>
        </div>

        {/* Filter Buttons */}
        <div className={`flex flex-wrap justify-center gap-3 mb-12 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${
                activeFilter === filter.id
                  ? 'bg-salem-green text-white shadow-lg shadow-salem-green/30'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredImages.map((image, index) => (
            <div
              key={`${image.src}-${activeFilter}`}
              className={`group relative aspect-square rounded-2xl overflow-hidden cursor-pointer transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
              style={{ transitionDelay: `${index * 50}ms` }}
              onClick={() => setLightboxImage(index)}
            >
              <img
                src={image.src}
                alt={image.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                <p className="text-white font-semibold text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  {image.title}
                </p>
                <p className="text-white/70 text-sm capitalize transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                  {filters.find(f => f.id === image.category)?.label}
                </p>
              </div>
              
              {/* Zoom Icon */}
              <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-50 group-hover:scale-100">
                <ZoomIn className="w-5 h-5 text-white" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImage !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          {/* Close Button */}
          <button 
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
            onClick={() => setLightboxImage(null)}
          >
            <X size={24} />
          </button>

          {/* Navigation Buttons */}
          <button 
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }}
          >
            <ChevronLeft size={28} />
          </button>
          <button 
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }}
          >
            <ChevronRight size={28} />
          </button>

          {/* Image */}
          <div 
            className="relative max-w-5xl max-h-[85vh] mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={filteredImages[lightboxImage].src}
              alt={filteredImages[lightboxImage].title}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
            
            {/* Image Info */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
              <p className="text-white font-semibold text-xl">{filteredImages[lightboxImage].title}</p>
              <p className="text-white/70 text-sm">
                {lightboxImage + 1} / {filteredImages.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
