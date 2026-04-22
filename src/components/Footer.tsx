import { useNavigation } from '../context/NavigationContext';

export default function Footer() {
  const year = new Date().getFullYear();
  const { goToAdminLogin } = useNavigation();

  return (
    <footer style={{ background: '#1C0A00', padding: '60px 0 28px', position: 'relative', overflow: 'hidden' }}>
      <div className="dot-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.04 }} aria-hidden="true" />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1.2fr',
          gap: '40px',
          marginBottom: '48px',
        }} className="footer-grid">

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C10.5 2 9.5 3 9 4C7.5 3.5 6 4.5 6 6H18C18 4.5 16.5 3.5 15 4C14.5 3 13.5 2 12 2Z" fill="#F59E0B"/>
                <rect x="4" y="8" width="16" height="3" rx="1.5" fill="#B45309"/>
                <path d="M4 11h16v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7z" fill="#FEF3C7" stroke="#B45309" strokeWidth="0.5"/>
                <path d="M8 14h8" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '1.2rem', color: '#FEF3C7' }}>
                Johsther <span style={{ color: '#F59E0B' }}>Cakes</span>
              </span>
            </div>
            <p style={{ fontFamily: "'Comic Neue', cursive", color: '#A16207', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: '260px', marginBottom: '20px' }}>
              Nairobi's favourite cake studio and baking academy. Handcrafted with love for every sweet moment.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              {[
                { label: 'Instagram', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg> },
                { label: 'Facebook', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> },
                { label: 'TikTok', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.53a8.17 8.17 0 0 0 4.78 1.53V7.62a4.85 4.85 0 0 1-1.01-.93z"/></svg> },
              ].map(s => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  style={{
                    width: '38px', height: '38px',
                    background: 'rgba(245,158,11,0.1)',
                    border: '1.5px solid rgba(245,158,11,0.2)',
                    borderRadius: '10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#A16207',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => { (e.currentTarget).style.background = '#F59E0B'; (e.currentTarget as HTMLAnchorElement).style.color = '#1C0A00'; }}
                  onMouseLeave={e => { (e.currentTarget).style.background = 'rgba(245,158,11,0.1)'; (e.currentTarget as HTMLAnchorElement).style.color = '#A16207'; }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, color: '#FEF3C7', marginBottom: '16px', fontSize: '0.95rem' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['Home', 'Our Cakes', 'Academy', 'Courses', 'Reviews', 'Contact'].map(link => (
                <li key={link}>
                  <a href={`#${link.toLowerCase().replace(' ', '')}`} style={{
                    fontFamily: "'Comic Neue', cursive",
                    color: '#A16207',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    transition: 'color 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => ((e.target as HTMLAnchorElement).style.color = '#F59E0B')}
                  onMouseLeave={e => ((e.target as HTMLAnchorElement).style.color = '#A16207')}>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, color: '#FEF3C7', marginBottom: '16px', fontSize: '0.95rem' }}>Courses</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['Beginner Baker', 'Intermediate Artist', 'Pro Masterclass', 'Group Sessions', 'Online Demos'].map(c => (
                <li key={c}>
                  <a href="#courses" style={{
                    fontFamily: "'Comic Neue', cursive",
                    color: '#A16207',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    transition: 'color 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => ((e.target as HTMLAnchorElement).style.color = '#F59E0B')}
                  onMouseLeave={e => ((e.target as HTMLAnchorElement).style.color = '#A16207')}>
                    {c}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, color: '#FEF3C7', marginBottom: '12px', fontSize: '0.95rem' }}>Sweet Updates</h4>
            <p style={{ fontFamily: "'Comic Neue', cursive", color: '#A16207', fontSize: '0.85rem', marginBottom: '16px', lineHeight: 1.6 }}>
              Get recipes, class dates & exclusive offers straight to your inbox.
            </p>
            <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label htmlFor="newsletter-email" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
                  Email address for newsletter
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder="your@email.com"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1.5px solid rgba(245,158,11,0.25)',
                    background: 'rgba(255,255,255,0.06)',
                    fontFamily: "'Comic Neue', cursive",
                    fontSize: '0.88rem',
                    color: '#FEF3C7',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  fontFamily: "'Baloo 2', cursive",
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  background: '#F59E0B',
                  color: '#1C0A00',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => ((e.currentTarget).style.opacity = '0.85')}
                onMouseLeave={e => ((e.currentTarget).style.opacity = '1')}
              >
                Subscribe →
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(245,158,11,0.12)',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <p style={{ fontFamily: "'Comic Neue', cursive", color: '#6B4C1E', fontSize: '0.82rem', margin: 0 }}>
            © {year} Johsther Cakes & Academy.{' '}
            <a
              href="https://cresdynamics.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#F59E0B', textDecoration: 'none', fontWeight: 700 }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'underline'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'none'; }}
            >
              Built by Cres Dynamics
            </a>
          </p>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <button 
              onClick={goToAdminLogin}
              style={{
                fontFamily: "'Comic Neue', cursive",
                color: '#6B4C1E',
                fontSize: '0.82rem',
                textDecoration: 'none',
                transition: 'color 0.2s',
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                padding: 0
              }}
              onMouseEnter={e => ((e.target as HTMLButtonElement).style.color = '#F59E0B')}
              onMouseLeave={e => ((e.target as HTMLButtonElement).style.color = '#6B4C1E')}
            >
              Staff Portal
            </button>
            <div style={{ width: '1px', height: '12px', background: 'rgba(245,158,11,0.2)' }}></div>
            {['Privacy Policy', 'Terms of Service'].map(l => (
              <a key={l} href="#" style={{
                fontFamily: "'Comic Neue', cursive",
                color: '#6B4C1E',
                fontSize: '0.82rem',
                textDecoration: 'none',
                transition: 'color 0.2s',
                cursor: 'pointer',
              }}
              onMouseEnter={e => ((e.target as HTMLAnchorElement).style.color = '#F59E0B')}
              onMouseLeave={e => ((e.target as HTMLAnchorElement).style.color = '#6B4C1E')}>
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
