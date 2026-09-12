import React, { createContext, useContext, useState, useEffect } from 'react';

export type PageType =
  | 'home'
  | 'virtual-room'
  | 'contact'
  | 'salem-tv'
  | 'sermons'
  | 'academy'
  | 'shop'
  | 'donate'
  | 'about'
  | 'events'
  | 'gallery'
  | 'rpsd';

interface NavigationContextType {
  currentPage: PageType;
  navigateTo: (page: PageType) => void;
  scrollToSection: (sectionId: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageType>('home');

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.slice(1) || 'home';
      setCurrentPage(hash as PageType);
    };

    window.addEventListener('popstate', handlePopState);
    
    // Initialize from URL hash
    const initialHash = window.location.hash.slice(1);
    if (initialHash) {
      setCurrentPage(initialHash as PageType);
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (page: PageType) => {
    setCurrentPage(page);
    window.location.hash = page === 'home' ? '' : page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId: string) => {
    if (currentPage !== 'home') {
      setCurrentPage('home');
      window.location.hash = '';
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <NavigationContext.Provider value={{ currentPage, navigateTo, scrollToSection }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
