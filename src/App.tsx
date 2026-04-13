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

export default function App() {
  const { isAuthModalOpen, closeAuthModal, authDefaultTab } = useAuth();
  const { currentPage } = useNavigation();

  return (
    <>
      {currentPage !== 'checkout' && (
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

      {currentPage === 'cakes' && (
        <OurCakes />
      )}
      
      {currentPage === 'academy' && (
        <AcademyPage />
      )}

      {currentPage === 'courses' && (
        <CoursesPage />
      )}

      {currentPage === 'about' && (
        <AboutPage />
      )}

      {currentPage === 'checkout' && (
        <CheckoutPage />
      )}

      {currentPage !== 'checkout' && (
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
