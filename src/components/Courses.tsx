import { useEffect, useRef } from 'react';

const courses = [
  {
    name: 'Beginner Baker',
    subtitle: 'Start your sweet journey',
    price: 'KES 4,500',
    duration: '2-day workshop',
    sessions: '4 hours/day',
    tag: null,
    image: '/hero_baker.png',
    color: '#B45309',
    features: [
      'Basic cake mixing techniques',
      'Simple frosting & decorating',
      'Cupcake design fundamentals',
      'Basic food safety & hygiene',
      'Take-home recipe booklet',
      'Certificate of participation',
    ],
    cta: 'Enrol Now',
  },
  {
    name: 'Intermediate Cake Artist',
    subtitle: 'Elevate your baking skills',
    price: 'KES 9,800',
    duration: '5-day intensive',
    sessions: '5 hours/day',
    tag: 'Most Popular',
    image: '/hero_cake_elegant.png',
    color: '#F59E0B',
    features: [
      'Fondant modelling & sculpting',
      'Multi-tier cake assembly',
      'Sugar flower making',
      'Cake costing & pricing for business',
      'Portfolio photo session',
      'Professional certificate',
      'Access to alumni community',
    ],
    cta: 'Enrol Now',
  },
  {
    name: 'Pro Masterclass',
    subtitle: 'Master the craft, launch your brand',
    price: 'KES 18,500',
    duration: '10-day full course',
    sessions: '6 hours/day',
    tag: 'Premium',
    image: '/academy-class.png',
    color: '#92400E',
    features: [
      'Advanced sculpted & 3D cakes',
      'Wedding & event cake mastery',
      'Isomalt & chocolate work',
      'Business setup & social media marketing',
      'Live client interaction sessions',
      'Pro-level certificate',
      'Job placement assistance',
      '1-month mentorship follow-up',
    ],
    cta: 'Apply Now',
  },
];

export default function Courses() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    el.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="courses" ref={ref} style={{ padding: '100px 0', background: '#FEF3C7', position: 'relative', overflow: 'hidden' }}>
      <div className="dot-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.4 }} aria-hidden="true" />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div className="fade-up" style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div className="pill" style={{ background: '#FEF3C7', border: '2px solid #F59E0B', color: '#92400E', marginBottom: '16px', display: 'inline-flex' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
            Baking Courses
          </div>
          <h2 style={{
            fontFamily: "'Baloo 2', cursive",
            fontWeight: 800,
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: '#78350F',
            marginBottom: '16px',
          }}>
            Pick Your <span style={{ color: '#F59E0B' }}>Perfect</span> Course
          </h2>
          <p style={{ fontFamily: "'Comic Neue', cursive", fontSize: '1.05rem', color: '#A16207', maxWidth: '520px', margin: '0 auto' }}>
            From beginner cupcakes to professional wedding cakes — we have a class for every level. All courses include ingredients, tools & certification.
          </p>
        </div>

        {/* Next upcoming class banner */}
        <div className="fade-up" style={{
          background: 'linear-gradient(135deg, #92400E, #B45309)',
          borderRadius: '20px',
          padding: '20px 28px',
          marginBottom: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px', height: '44px',
              background: 'rgba(245,158,11,0.2)',
              borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, color: '#FEF3C7', fontSize: '1rem' }}>
                Next Class: April 19, 2026 · Beginner Batch #12
              </div>
              <div style={{ fontFamily: "'Comic Neue', cursive", color: '#FDE68A', fontSize: '0.85rem' }}>
                3 spots remaining — don't miss out!
              </div>
            </div>
          </div>
          <a
            href="#contact"
            style={{
              fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '0.9rem',
              background: '#F59E0B', color: '#1C0A00',
              padding: '10px 24px', borderRadius: '999px',
              textDecoration: 'none', whiteSpace: 'nowrap',
              transition: 'opacity 0.2s', cursor: 'pointer',
            }}
          >
            Reserve My Spot
          </a>
        </div>

        {/* Course Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '28px',
          alignItems: 'start',
        }}>
          {courses.map((course) => {
            const isPopular = course.tag === 'Most Popular';
            return (
              <article
                key={course.name}
                className="card-lift fade-up"
                style={{
                  background: '#fff',
                  borderRadius: '28px',
                  overflow: 'hidden',
                  border: isPopular ? `3px solid ${course.color}` : '2px solid #F5E6C8',
                  position: 'relative',
                  transform: isPopular ? 'scale(1.03)' : 'scale(1)',
                  boxShadow: isPopular ? `0 20px 50px rgba(245,158,11,0.25)` : '0 4px 20px rgba(146,64,14,0.08)',
                  cursor: 'pointer',
                }}
              >
                {/* Popular badge */}
                {course.tag && (
                  <div style={{
                    position: 'absolute', top: '18px', right: '18px',
                    background: course.color,
                    color: isPopular ? '#1C0A00' : '#fff',
                    fontFamily: "'Baloo 2', cursive",
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    padding: '4px 14px',
                    borderRadius: '999px',
                    zIndex: 2,
                  }}>
                    {course.tag}
                  </div>
                )}

                {/* Image */}
                <div style={{ height: '180px', overflow: 'hidden' }}>
                  <img
                    src={course.image}
                    alt={`${course.name} baking course at Johsther Academy`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                </div>

                <div style={{ padding: '24px 26px 28px' }}>
                  {/* Duration pills */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                    {[course.duration, course.sessions].map(d => (
                      <span key={d} style={{
                        fontFamily: "'Baloo 2', cursive",
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        background: '#FEF3C7',
                        color: '#92400E',
                        padding: '3px 10px',
                        borderRadius: '999px',
                        border: '1.5px solid #F5E6C8',
                      }}>{d}</span>
                    ))}
                  </div>

                  <h3 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '1.25rem', color: '#78350F', marginBottom: '4px' }}>
                    {course.name}
                  </h3>
                  <p style={{ fontFamily: "'Comic Neue', cursive", fontSize: '0.88rem', color: '#A16207', marginBottom: '20px' }}>
                    {course.subtitle}
                  </p>

                  {/* Features */}
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {course.features.map(f => (
                      <li key={f} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={course.color} strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 2 }}>
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        <span style={{ fontFamily: "'Comic Neue', cursive", fontSize: '0.9rem', color: '#78350F' }}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Price + CTA */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1.5px solid #F5E6C8' }}>
                    <div>
                      <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '1.5rem', color: '#78350F' }}>{course.price}</div>
                      <div style={{ fontFamily: "'Comic Neue', cursive", fontSize: '0.78rem', color: '#A16207' }}>per person · all-inclusive</div>
                    </div>
                    <button
                      style={{
                        fontFamily: "'Baloo 2', cursive",
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        background: `linear-gradient(135deg, ${course.color}, #F59E0B)`,
                        color: '#fff',
                        border: 'none',
                        padding: '11px 24px',
                        borderRadius: '999px',
                        cursor: 'pointer',
                        boxShadow: `0 6px 18px ${course.color}44`,
                        transition: 'opacity 0.2s, transform 0.2s',
                      }}
                      onMouseEnter={e => { (e.currentTarget).style.opacity = '0.88'; (e.currentTarget).style.transform = 'translateY(-2px)'; }}
                      onMouseLeave={e => { (e.currentTarget).style.opacity = '1'; (e.currentTarget).style.transform = 'translateY(0)'; }}
                      aria-label={`Enrol in ${course.name}`}
                    >
                      {course.cta}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Group / Corporate note */}
        <div className="fade-up" style={{
          textAlign: 'center',
          marginTop: '48px',
          padding: '24px',
          background: '#fff',
          borderRadius: '20px',
          border: '2px solid #F5E6C8',
        }}>
          <p style={{ fontFamily: "'Comic Neue', cursive", color: '#A16207', fontSize: '0.95rem', margin: 0 }}>
            <strong style={{ color: '#78350F', fontFamily: "'Baloo 2', cursive" }}>Planning a group or team-building event?</strong>
            {' '}We offer special group discounts for 5+ students.{' '}
            <a href="#contact" style={{ color: '#F59E0B', fontWeight: 700, textDecoration: 'none' }}>Contact us →</a>
          </p>
        </div>
      </div>
    </section>
  );
}
