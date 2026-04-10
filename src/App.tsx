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

export default function App() {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <main>
        <Hero />
        <CakesShowcase />
        <Academy />
        <Courses />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
