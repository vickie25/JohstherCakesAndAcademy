import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigation } from '../context/NavigationContext';

const navLinks = [
  { label: 'Home',      href: '#home' },
  { label: 'Our Cakes', href: '#cakes' },
  { label: 'Academy',   href: '#academy' },
  { label: 'Courses',   href: '#courses' },
  { label: 'About Us',  href: '#about' },
  { label: 'Contact',   href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, logout, openAuthModal } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();
  const { currentPage, goToHome, goToCakes, goToAcademy, goToCourses, goToAbout } = useNavigation();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, label: string, href: string) => {
    if (label === 'Our Cakes') {
      e.preventDefault();
      goToCakes();
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else if (label === 'Academy') {
      e.preventDefault();
      goToAcademy();
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else if (label === 'Courses') {
      e.preventDefault();
      goToCourses();
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else if (label === 'About Us') {
      e.preventDefault();
      goToAbout();
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else if (currentPage !== 'home' && href.startsWith('#')) {
      goToHome();
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const openAuth = (tab: 'login' | 'signup') => {
    openAuthModal(tab);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      style={{
        position: 'fixed',
        top: '16px',
        left: '16px',
        right: '16px',
        zIndex: 50,
        transition: 'all 0.3s ease',
      }}
    >
      <nav
        style={{
          background: scrolled ? 'rgba(255,251,235,0.92)' : 'rgba(255,251,235,0.75)',
          backdropFilter: 'blur(16px)',
          border: '2px solid #F59E0B',
          borderRadius: '999px',
          padding: '10px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: scrolled ? '0 8px 32px rgba(146,64,14,0.15)' : '0 4px 16px rgba(146,64,14,0.08)',
          transition: 'all 0.3s ease',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Logo */}
        <a href="#home" onClick={(e) => handleNavClick(e, 'Home', '#home')} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '26px' }} aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C10.5 2 9.5 3 9 4C7.5 3.5 6 4.5 6 6H18C18 4.5 16.5 3.5 15 4C14.5 3 13.5 2 12 2Z" fill="#F59E0B"/>
              <rect x="4" y="8" width="16" height="3" rx="1.5" fill="#92400E"/>
              <path d="M4 11h16v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7z" fill="#FEF3C7" stroke="#92400E" strokeWidth="0.5"/>
              <path d="M8 14h8" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M10 17h4" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </span>
          <span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '1.15rem', color: '#78350F', letterSpacing: '-0.01em' }}>
            Johsther <span style={{ color: '#F59E0B' }}>Cakes</span>
          </span>
        </a>

        {/* Desktop links */}
        <ul style={{ display: 'flex', gap: '4px', listStyle: 'none', margin: 0, padding: 0 }} className="hidden-mobile">
          {navLinks.map(link => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => handleNavClick(e, link.label, link.href)}
                style={{
                  fontFamily: "'Baloo 2', cursive",
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: '#92400E',
                  textDecoration: 'none',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  transition: 'background 0.2s, color 0.2s',
                  display: 'block',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  (e.target as HTMLAnchorElement).style.background = '#F59E0B';
                  (e.target as HTMLAnchorElement).style.color = '#fff';
                }}
                onMouseLeave={e => {
                  (e.target as HTMLAnchorElement).style.background = 'transparent';
                  (e.target as HTMLAnchorElement).style.color = '#92400E';
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA + Auth/Cart buttons */}
        <div className="hidden-mobile" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <a
            href="#courses"
            onClick={(e) => handleNavClick(e, 'Courses', '#courses')}
            style={{
              fontFamily: "'Baloo 2', cursive",
              fontWeight: 700,
              fontSize: '0.9rem',
              background: 'linear-gradient(135deg,#92400E,#B45309)',
              color: '#fff',
              padding: '8px 22px',
              borderRadius: '999px',
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(146,64,14,0.3)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 20px rgba(146,64,14,0.4)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 12px rgba(146,64,14,0.3)';
            }}
          >
            Join Class
          </a>

          {/* Cart Icon Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="View cart"
            title="Cart"
            style={{
              position: 'relative',
              background: 'transparent',
              border: 'none',
              width: 38,
              height: 38,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#92400E',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {totalItems > 0 && (
              <span style={{
                position: 'absolute', top: 0, right: 0, background: '#DC2626', color: '#fff',
                fontSize: '0.65rem', fontWeight: 'bold', width: 18, height: 18, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {totalItems}
              </span>
            )}
          </button>

          {/* Auth Icon or Profile Info Button */}
          {user ? (
            <div className="user-menu" style={{ position: 'relative', display: 'inline-block' }}>
              <button
                style={{
                  padding: 0,
                  background: 'none',
                  border: '2px solid #F59E0B66',
                  borderRadius: '50%',
                  width: 38,
                  height: 38,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  display: 'flex'
                }}
              >
                <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
              <div className="user-dropdown">
                <p style={{ margin: '0 0 4px', fontWeight: 'bold', color: '#78350F' }}>{user.name}</p>
                <p style={{ margin: '0 0 12px', fontSize: '0.8rem', color: '#92400E' }}>{user.email}</p>
                <button onClick={logout} style={{
                  background: '#DC2626', color: 'white', border: 'none', borderRadius: 8, padding: '6px 12px',
                  cursor: 'pointer', width: '100%', fontFamily: "'Baloo 2', cursive", fontWeight: 700
                }}>
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <button
              id="nav-auth-btn"
              onClick={() => openAuth('login')}
              aria-label="Sign in or create account"
              title="Sign in / Sign up"
              style={{
                background: '#F59E0B22',
                border: '1.5px solid #F59E0B66',
                borderRadius: '50%',
                width: 38,
                height: 38,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                color: '#92400E',
                flexShrink: 0,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = '#F59E0B';
                (e.currentTarget as HTMLButtonElement).style.color = '#fff';
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#F59E0B';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(245,158,11,0.4)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = '#F59E0B22';
                (e.currentTarget as HTMLButtonElement).style.color = '#92400E';
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#F59E0B66';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </button>
          )}
        </div>

        {/* Mobile: Auth/Cart icon + Hamburger side-by-side */}
        <div className="show-mobile" style={{ display: 'none', alignItems: 'center', gap: 12 }}>
          {/* Cart icon on mobile */}
          <button onClick={() => setIsCartOpen(true)} style={{ position: 'relative', background: 'none', border: 'none', color: '#92400E', padding: 0 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {totalItems > 0 && (
              <span style={{
                position: 'absolute', top: -5, right: -8, background: '#DC2626', color: '#fff',
                fontSize: '0.65rem', fontWeight: 'bold', width: 16, height: 16, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {totalItems}
              </span>
            )}
          </button>

          {/* Auth icon on mobile */}
          {user ? (
            <button onClick={logout} style={{ padding: 0, border: 'none', borderRadius: '50%', width: 32, height: 32, overflow: 'hidden' }}>
              <img src={user.avatar} alt="Profile" style={{width:'100%',height:'100%'}}/>
            </button>
          ) : (
            <button
              id="nav-auth-btn-mobile"
              onClick={() => openAuth('login')}
              aria-label="Sign in or create account"
              title="Sign in / Sign up"
              style={{
                background: '#F59E0B22',
                border: '1.5px solid #F59E0B66',
                borderRadius: '50%',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#92400E',
                flexShrink: 0,
              }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </button>
          )}

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#92400E" strokeWidth="2.5" strokeLinecap="round">
              {menuOpen ? (
                 <>
                   <line x1="18" y1="6" x2="6" y2="18"/>
                   <line x1="6" y1="6" x2="18" y2="18"/>
                 </>
              ) : (
                 <>
                   <line x1="3" y1="7" x2="21" y2="7"/>
                   <line x1="3" y1="12" x2="21" y2="12"/>
                   <line x1="3" y1="17" x2="21" y2="17"/>
                 </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          background: 'rgba(255,251,235,0.97)',
          border: '2px solid #F59E0B',
          borderRadius: '20px',
          marginTop: '8px',
          padding: '16px',
          maxWidth: '1200px',
          margin: '8px auto 0',
          boxShadow: '0 8px 32px rgba(146,64,14,0.15)',
        }}>
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                setMenuOpen(false);
                handleNavClick(e, link.label, link.href);
              }}
              style={{
                display: 'block',
                fontFamily: "'Baloo 2', cursive",
                fontWeight: 600,
                color: '#92400E',
                textDecoration: 'none',
                padding: '10px 16px',
                borderRadius: '12px',
                transition: 'background 0.2s',
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#courses"
            onClick={(e) => {
              setMenuOpen(false);
              handleNavClick(e, 'Courses', '#courses');
            }}
            style={{
              display: 'block',
              marginTop: '8px',
              textAlign: 'center',
              background: 'linear-gradient(135deg,#92400E,#B45309)',
              color: '#fff',
              fontFamily: "'Baloo 2', cursive",
              fontWeight: 700,
              padding: '10px',
              borderRadius: '12px',
              textDecoration: 'none',
            }}
          >
            Join Class
          </a>

          {!user && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
              <button
                onClick={() => { setMenuOpen(false); openAuth('login'); }}
                style={{
                  padding: '10px', border: '1.5px solid #92400E', borderRadius: '12px',
                  background: 'transparent', color: '#92400E', fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '0.9rem'
                }}
              >
                Sign In
              </button>
              <button
                onClick={() => { setMenuOpen(false); openAuth('signup'); }}
                style={{
                  padding: '10px', border: 'none', borderRadius: '12px',
                  background: 'linear-gradient(135deg,#F59E0B,#B45309)', color: '#fff',
                  fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '0.9rem', boxShadow: '0 3px 10px rgba(245,158,11,0.35)'
                }}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        .user-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 10px;
          background: #FFFBEB;
          border: 2px solid #F59E0B;
          border-radius: 12px;
          padding: 16px;
          min-width: 200px;
          box-shadow: 0 10px 25px rgba(146,64,14,0.15);
          opacity: 0;
          visibility: hidden;
          transition: all 0.2s ease;
          transform: translateY(10px);
        }
        .user-menu:hover .user-dropdown, .user-dropdown:focus-within {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
      `}</style>

    </header>
  );
}
