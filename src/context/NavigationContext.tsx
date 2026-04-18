import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type PageView = 'home' | 'checkout' | 'cakes' | 'academy' | 'courses' | 'about' | 'contact' | 'admin-login' | 'admin-dashboard';

interface NavigationContextType {
  currentPage: PageView;
  goToHome: () => void;
  goToCheckout: () => void;
  goToCakes: () => void;
  goToAcademy: () => void;
  goToCourses: () => void;
  goToAbout: () => void;
  goToContact: () => void;
  goToAdminLogin: () => void;
  goToAdminDashboard: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const getInitialPage = (): PageView => {
    const path = window.location.pathname;
    if (path.startsWith('/admin/dashboard')) return 'admin-dashboard';
    if (path.startsWith('/admin')) return 'admin-login';
    if (path === '/checkout') return 'checkout';
    if (path === '/cakes') return 'cakes';
    if (path === '/academy') return 'academy';
    if (path === '/courses') return 'courses';
    if (path === '/about') return 'about';
    if (path === '/contact') return 'contact';
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState<PageView>(getInitialPage);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(getInitialPage());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update both state and browser URL URL without reloading
  const navigateTo = (page: PageView, path: string) => {
    setCurrentPage(page);
    window.history.pushState({}, '', path);
  };

  const goToHome = () => navigateTo('home', '/');
  const goToCheckout = () => navigateTo('checkout', '/checkout');
  const goToCakes = () => navigateTo('cakes', '/cakes');
  const goToAcademy = () => navigateTo('academy', '/academy');
  const goToCourses = () => navigateTo('courses', '/courses');
  const goToAbout = () => navigateTo('about', '/about');
  const goToContact = () => navigateTo('contact', '/contact');
  const goToAdminLogin = () => navigateTo('admin-login', '/admin');
  const goToAdminDashboard = () => navigateTo('admin-dashboard', '/admin/dashboard');

  return (
    <NavigationContext.Provider value={{ 
      currentPage, 
      goToHome, 
      goToCheckout, 
      goToCakes, 
      goToAcademy, 
      goToCourses, 
      goToAbout,
      goToContact,
      goToAdminLogin,
      goToAdminDashboard
    }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
