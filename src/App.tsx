import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CakesShowcase from './components/CakesShowcase';
import Academy from './components/Academy';
import Courses from './components/Courses';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import { useAuth } from './context/AuthContext';
import { useNavigation } from './context/NavigationContext';
import CheckoutPage from './pages/CheckoutPage';
import OurCakes from './pages/OurCakes';
import AcademyPage from './pages/AcademyPage';
import CoursesPage from './pages/CoursesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const { isAuthModalOpen, closeAuthModal, authDefaultTab } = useAuth();
  const { currentPage, goToAdminLogin, goToContact } = useNavigation();

  // Route Guard for Admin Dashboard
  const isAdminAuthenticated = () => {
    const token = localStorage.getItem('admin_token');
    const userStr = localStorage.getItem('admin_user');
    if (!token || !userStr) return false;
    try {
      const user = JSON.parse(userStr);
      return user.role === 'admin';
    } catch {
      return false;
    }
  };

  const isCheckout = currentPage === 'checkout';
  const isAdminView = currentPage === 'admin-login' || currentPage === 'admin-dashboard';

  // Redirect to login if trying to access dashboard without auth
  if (currentPage === 'admin-dashboard' && !isAdminAuthenticated()) {
    goToAdminLogin();
    return null;
  }

  return (
    <>
      {!isCheckout && !isAdminView && (
        <>
          <Navbar />
          <CartDrawer />
        </>
      )}

      {currentPage === 'home' && (
        <main>
          <Hero />
          <CakesShowcase />
          <Academy />
          <Courses />
          <Testimonials />
          <FAQ />
          <Contact />
        </main>
      )}

      {currentPage === 'cakes' && <OurCakes />}
      {currentPage === 'academy' && <AcademyPage />}
      {currentPage === 'courses' && <CoursesPage />}
      {currentPage === 'about' && <AboutPage />}
      {currentPage === 'contact' && <ContactPage />}
      {currentPage === 'checkout' && <CheckoutPage />}

      {currentPage === 'admin-login' && <AdminLoginPage />}
      {currentPage === 'admin-dashboard' && <AdminDashboard />}

      {!isCheckout && !isAdminView && (
        <Footer />
      )}
      
      <AuthModal
        open={isAuthModalOpen}
        onClose={closeAuthModal}
        defaultTab={authDefaultTab}
      />
    </>
  );
}
