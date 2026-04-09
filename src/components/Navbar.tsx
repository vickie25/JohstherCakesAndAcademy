import { useState, useEffect } from 'react';
import AuthModal from './AuthModal';

const navLinks = [
  { label: 'Home',      href: '#home' },
  { label: 'Our Cakes', href: '#cakes' },
  { label: 'Academy',   href: '#academy' },
  { label: 'Courses',   href: '#courses' },
  { label: 'Reviews',   href: '#reviews' },
  { label: 'Contact',   href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authDefaultTab, setAuthDefaultTab] = useState<'login' | 'signup'>('login');

  const openAuth = (tab: 'login' | 'signup') => {
    setAuthDefaultTab(tab);
    setAuthOpen(true);
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
        <a href="#home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
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

        {/* CTA + Auth buttons */}
        <div className="hidden-mobile" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <a
            href="#courses"
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

          {/* Auth Icon Button */}
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
        </div>

        {/* Mobile: Auth icon + Hamburger side-by-side */}
        <div className="show-mobile" style={{ display: 'none', alignItems: 'center', gap: 8 }}>
          {/* Auth icon on mobile */}
          <button
            id="nav-auth-btn-mobile"
            onClick={() => openAuth('login')}
            aria-label="Sign in or create account"
            title="Sign in / Sign up"
            style={{
              background: '#F59E0B22',
              border: '1.5px solid #F59E0B66',
              borderRadius: '50%',
              width: 36,
              height: 36,
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
              onClick={() => setMenuOpen(false)}
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
            onClick={() => setMenuOpen(false)}
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

          {/* Auth buttons in mobile menu */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
            <button
              onClick={() => { setMenuOpen(false); openAuth('login'); }}
              style={{
                padding: '10px',
                border: '1.5px solid #92400E',
                borderRadius: '12px',
                background: 'transparent',
                color: '#92400E',
                fontFamily: "'Baloo 2', cursive",
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMenuOpen(false); openAuth('signup'); }}
              style={{
                padding: '10px',
                border: 'none',
                borderRadius: '12px',
                background: 'linear-gradient(135deg,#F59E0B,#B45309)',
                color: '#fff',
                fontFamily: "'Baloo 2', cursive",
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                boxShadow: '0 3px 10px rgba(245,158,11,0.35)',
              }}
            >
              Sign Up
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>

      {/* Auth Modal */}
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        defaultTab={authDefaultTab}
      />
    </header>
  );
}
