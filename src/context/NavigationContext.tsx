import { createContext, useContext, useState, type ReactNode } from 'react';

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
  const [currentPage, setCurrentPage] = useState<PageView>('home');

  const goToHome = () => setCurrentPage('home');
  const goToCheckout = () => setCurrentPage('checkout');
  const goToCakes = () => setCurrentPage('cakes');
  const goToAcademy = () => setCurrentPage('academy');
  const goToCourses = () => setCurrentPage('courses');
  const goToAbout = () => setCurrentPage('about');
  const goToContact = () => setCurrentPage('contact');
  const goToAdminLogin = () => setCurrentPage('admin-login');
  const goToAdminDashboard = () => setCurrentPage('admin-dashboard');

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
