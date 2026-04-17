import { useState, useEffect, useRef } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageCircle,
  Globe,
  Clock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

/* ─── Contact info cards ─────────────────────────────────────── */
const contactCards = [
  {
    icon: <MapPin size={22} />,
    title: 'Visit Our Studio',
    detail: 'Lucky Summer, Nairobi, Kenya',
    action: 'Get Directions',
    link: 'https://maps.google.com/?q=Lucky+Summer+Nairobi',
    color: '#B45309',
  },
  {
    icon: <Phone size={22} />,
    title: 'WhatsApp Us',
    detail: '+254 700 000 000',
    action: 'Chat Now',
    link: 'https://wa.me/254700000000',
    color: '#25D366',
  },
  {
    icon: <Mail size={22} />,
    title: 'Email Inquiry',
    detail: 'hello@johsthercakes.co.ke',
    action: 'Send Email',
    link: 'mailto:hello@johsthercakes.co.ke',
    color: '#F59E0B',
  },
];

const stats = [
  { num: '1,200+', label: 'Cakes Delivered' },
  { num: '350+', label: 'Students Trained' },
  { num: '< 24h', label: 'Response Time' },
];

/* ─── Social links ────────────────────────────────────────────── */
const socialLinks = [
  {
    href: '#',
    label: 'Instagram',
    color: '#E1306C',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    href: '#',
    label: 'Facebook',
    color: '#1877F2',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    href: '#',
    label: 'WhatsApp',
    color: '#25D366',
    icon: <MessageCircle size={20} />,
  },
  {
    href: '#',
    label: 'Website',
    color: '#F59E0B',
    icon: <Globe size={20} />,
  },
];

/* ─── Component ───────────────────────────────────────────────── */
export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const sectionRef = useRef<HTMLDivElement>(null);

  /* — scroll to top on mount — */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* — intersection observer for stagger animations — */
  useEffect(() => {
    const els = document.querySelectorAll('[data-animate]');
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const key = (e.target as HTMLElement).dataset.animate!;
            setTimeout(() => {
              setVisible((v) => ({ ...v, [key]: true }));
            }, 50); // Small delay for smoother animation
          }
        }),
      { threshold: 0.1, rootMargin: '50px' } // Lower threshold and root margin for earlier trigger
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    }, 1600);
  };

  const anim = (key: string, delay = 0) => ({
    'data-animate': key,
    style: {
      opacity: visible[key] ? 1 : 0,
      transform: visible[key] ? 'translateY(0)' : 'translateY(24px)',
      transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      willChange: 'opacity, transform',
    } as React.CSSProperties,
  });

  return (
    <div
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        background: '#FFFBEB',
        paddingTop: '120px',
        paddingBottom: '80px',
        overflow: 'hidden',
        position: 'relative',
        fontFamily: "'Comic Neue', cursive",
      }}
    >
      {/* ── Decorative blobs ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', top: '-120px', right: '-120px',
          width: 480, height: 480,
          background: 'radial-gradient(circle, #FBD26A55 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', bottom: '-80px', left: '-80px',
          width: 320, height: 320,
          background: 'radial-gradient(circle, #B4530920 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }}
      />

      {/* ── Dot pattern overlay ── */}
      <div
        aria-hidden="true"
        className="dot-pattern"
        style={{ position: 'absolute', inset: 0, opacity: 0.3, pointerEvents: 'none', zIndex: 0 }}
      />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>

        {/* ═══════════════ HERO HEADER ═══════════════ */}
        <div
          {...anim('hero')}
          style={{ textAlign: 'center', marginBottom: 72 }}
        >
          {/* Pill badge */}
          <div
            className="pill"
            style={{
              background: '#FEF3C7',
              border: '2px solid #F59E0B',
              color: '#92400E',
              display: 'inline-flex',
              gap: 8,
              marginBottom: 20,
            }}
          >
            <MessageCircle size={15} />
            <span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700 }}>Get In Touch</span>
          </div>

          <h1
            style={{
              fontFamily: "'Baloo 2', cursive",
              fontWeight: 800,
              fontSize: 'clamp(2.2rem, 5vw, 4rem)',
              color: '#78350F',
              lineHeight: 1.15,
              marginBottom: 18,
            }}
          >
            Let's Bake{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #F59E0B, #B45309)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Something
            </span>
            {' '}Together
          </h1>

          <p
            style={{
              fontSize: '1.1rem',
              color: '#A16207',
              lineHeight: 1.7,
              maxWidth: 540,
              margin: '0 auto',
            }}
          >
            Whether you're dreaming of a custom cake or looking to start your baking journey, our team is ready to make it happen.
          </p>
        </div>

        {/* ═══════════════ STATS STRIP ═══════════════ */}
        <div
          {...anim('stats', 100)}
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 48,
            flexWrap: 'wrap',
            marginBottom: 80,
            padding: '28px 40px',
            background: 'linear-gradient(135deg, #92400E, #B45309)',
            borderRadius: 24,
            boxShadow: '0 16px 48px rgba(146,64,14,0.25)',
          }}
        >
          {stats.map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontFamily: "'Baloo 2', cursive",
                  fontWeight: 800,
                  fontSize: '2rem',
                  color: '#FBD26A',
                }}
              >
                {s.num}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'rgba(255,251,235,0.8)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* ═══════════════ TWO-COLUMN LAYOUT ═══════════════ */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 48,
            alignItems: 'start',
          }}
        >
          {/* ─── LEFT: Contact info ─── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

            {/* Contact cards */}
            {contactCards.map((card, i) => (
              <a
                key={card.title}
                href={card.link}
                target="_blank"
                rel="noopener noreferrer"
                {...anim(`card-${i}`, i * 100)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                  padding: '22px 28px',
                  background: '#fff',
                  borderRadius: 20,
                  border: '2px solid #F5E6C8',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.25s',
                  boxShadow: '0 4px 20px rgba(146,64,14,0.06)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = card.color;
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 8px 30px ${card.color}30`;
                  (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = '#F5E6C8';
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 20px rgba(146,64,14,0.06)';
                  (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
                }}
              >
                {/* Icon bubble */}
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 16,
                    background: `${card.color}18`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: card.color,
                    flexShrink: 0,
                  }}
                >
                  {card.icon}
                </div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: "'Baloo 2', cursive",
                      fontWeight: 700,
                      fontSize: '1.05rem',
                      color: '#78350F',
                      marginBottom: 2,
                    }}
                  >
                    {card.title}
                  </div>
                  <div style={{ fontSize: '0.88rem', color: '#A16207' }}>{card.detail}</div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontFamily: "'Baloo 2', cursive",
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    color: card.color,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {card.action} <ArrowRight size={13} />
                </div>
              </a>
            ))}

            {/* Opening hours */}
            <div
              {...anim('hours', 300)}
              style={{
                padding: '24px 28px',
                background: '#FEF3C7',
                borderRadius: 20,
                border: '2px solid #F5E6C8',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontFamily: "'Baloo 2', cursive",
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: '#78350F',
                  marginBottom: 16,
                }}
              >
                <Clock size={18} color="#F59E0B" />
                Our Creative Hours
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { day: 'Monday – Saturday', time: '7:00 AM – 8:00 PM' },
                  { day: 'Sunday', time: 'Closed · Pre-orders only' },
                ].map((row) => (
                  <div key={row.day} style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                    <span style={{ fontWeight: 600, color: '#92400E', fontSize: '0.9rem' }}>{row.day}</span>
                    <span style={{ color: '#A16207', fontSize: '0.9rem' }}>{row.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social row */}
            <div {...anim('social', 400)}>
              <div
                style={{
                  fontFamily: "'Baloo 2', cursive",
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  color: '#A16207',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: 14,
                }}
              >
                Follow Our Journey
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    title={s.label}
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 14,
                      background: '#fff',
                      border: '2px solid #F5E6C8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#92400E',
                      cursor: 'pointer',
                      transition: 'color 0.2s, border-color 0.2s, background 0.2s, transform 0.2s',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = s.color;
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = s.color;
                      (e.currentTarget as HTMLAnchorElement).style.background = `${s.color}10`;
                      (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-3px)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = '#92400E';
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = '#F5E6C8';
                      (e.currentTarget as HTMLAnchorElement).style.background = '#fff';
                      (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
                    }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ─── RIGHT: Contact Form ─── */}
          <div
            {...anim('form', 150)}
            style={{
              background: '#fff',
              borderRadius: 28,
              border: '2px solid #F5E6C8',
              padding: '40px 36px',
              boxShadow: '0 20px 60px rgba(146,64,14,0.1)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Sprinkle accent top-right */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute', top: 0, right: 0,
                width: 120, height: 120,
                background: 'radial-gradient(circle at 100% 0%, #FBD26A33 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />

            {isSent ? (
              /* ── SUCCESS STATE ── */
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <div
                  style={{
                    width: 72, height: 72,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #F59E0B22, #B4530922)',
                    border: '2.5px solid #F59E0B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                    animation: 'popIn 0.4s ease',
                  }}
                >
                  <CheckCircle2 size={36} color="#F59E0B" />
                </div>
                <h2
                  style={{
                    fontFamily: "'Baloo 2', cursive",
                    fontWeight: 800,
                    fontSize: '1.8rem',
                    color: '#78350F',
                    marginBottom: 12,
                  }}
                >
                  Message Sent! 🎉
                </h2>
                <p style={{ color: '#A16207', lineHeight: 1.7, maxWidth: 320, margin: '0 auto 28px' }}>
                  Thank you! We treat every enquiry with the same love as our recipes. We'll be in touch within 24 hours.
                </p>
                <button
                  onClick={() => setIsSent(false)}
                  style={{
                    fontFamily: "'Baloo 2', cursive",
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    background: 'transparent',
                    border: '2px solid #F59E0B',
                    color: '#92400E',
                    padding: '10px 28px',
                    borderRadius: 999,
                    cursor: 'pointer',
                    transition: 'background 0.2s, color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = '#F59E0B';
                    (e.currentTarget as HTMLButtonElement).style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                    (e.currentTarget as HTMLButtonElement).style.color = '#92400E';
                  }}
                >
                  Send another message →
                </button>
              </div>
            ) : (
              /* ── FORM STATE ── */
              <>
                <div style={{ marginBottom: 32 }}>
                  <h2
                    style={{
                      fontFamily: "'Baloo 2', cursive",
                      fontWeight: 800,
                      fontSize: '1.75rem',
                      color: '#78350F',
                      marginBottom: 6,
                    }}
                  >
                    Send an Enquiry
                  </h2>
                  <p style={{ color: '#A16207', fontSize: '0.93rem' }}>
                    Tell us about your event and we'll craft the perfect sweet proposal.
                  </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                  {/* Name + Email row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    {[
                      { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Your name' },
                      { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
                    ].map((field) => (
                      <div key={field.key}>
                        <label
                          htmlFor={`contact-${field.key}`}
                          style={{
                            display: 'block',
                            fontFamily: "'Baloo 2', cursive",
                            fontWeight: 700,
                            fontSize: '0.78rem',
                            color: '#92400E',
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            marginBottom: 6,
                          }}
                        >
                          {field.label}
                        </label>
                        <input
                          id={`contact-${field.key}`}
                          type={field.type}
                          required
                          value={(form as any)[field.key]}
                          onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                          placeholder={field.placeholder}
                          style={{
                            width: '100%',
                            height: 46,
                            padding: '0 16px',
                            borderRadius: 12,
                            border: '2px solid #F5E6C8',
                            background: '#FFFBEB',
                            fontFamily: "'Comic Neue', cursive",
                            fontSize: '0.95rem',
                            color: '#78350F',
                            outline: 'none',
                            transition: 'border-color 0.2s, box-shadow 0.2s',
                            boxSizing: 'border-box',
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = '#F59E0B';
                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(245,158,11,0.15)';
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = '#F5E6C8';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Subject */}
                  <div>
                    <label
                      htmlFor="contact-subject"
                      style={{
                        display: 'block',
                        fontFamily: "'Baloo 2', cursive",
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        color: '#92400E',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        marginBottom: 6,
                      }}
                    >
                      What's the Occasion?
                    </label>
                    <select
                      id="contact-subject"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      style={{
                        width: '100%',
                        height: 46,
                        padding: '0 16px',
                        borderRadius: 12,
                        border: '2px solid #F5E6C8',
                        background: '#FFFBEB',
                        fontFamily: "'Baloo 2', cursive",
                        fontWeight: 600,
                        fontSize: '0.93rem',
                        color: form.subject ? '#78350F' : '#A16207',
                        outline: 'none',
                        cursor: 'pointer',
                        transition: 'border-color 0.2s',
                        appearance: 'none',
                      }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#F59E0B'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = '#F5E6C8'; }}
                    >
                      <option value="">Select a topic…</option>
                      <option value="cake-order">Custom Cake Order</option>
                      <option value="academy">Academy Enrollment</option>
                      <option value="wedding">Wedding Consultation</option>
                      <option value="corporate">Corporate / Event Catering</option>
                      <option value="collaboration">Collaboration</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="contact-message"
                      style={{
                        display: 'block',
                        fontFamily: "'Baloo 2', cursive",
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        color: '#92400E',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        marginBottom: 6,
                      }}
                    >
                      Your Vision
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us everything — the date, the flavors, the vibe…"
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        borderRadius: 12,
                        border: '2px solid #F5E6C8',
                        background: '#FFFBEB',
                        fontFamily: "'Comic Neue', cursive",
                        fontSize: '0.95rem',
                        color: '#78350F',
                        outline: 'none',
                        resize: 'none',
                        transition: 'border-color 0.2s, box-shadow 0.2s',
                        boxSizing: 'border-box',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#F59E0B';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(245,158,11,0.15)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#F5E6C8';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  {/* CTA */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      height: 54,
                      background: isSubmitting
                        ? '#D97706'
                        : 'linear-gradient(135deg, #92400E, #B45309)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 999,
                      fontFamily: "'Baloo 2', cursive",
                      fontWeight: 700,
                      fontSize: '1.05rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 10,
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      boxShadow: '0 8px 24px rgba(146,64,14,0.35)',
                      transition: 'transform 0.2s, box-shadow 0.2s, background 0.2s',
                      opacity: isSubmitting ? 0.85 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubmitting) {
                        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 32px rgba(146,64,14,0.45)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 24px rgba(146,64,14,0.35)';
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <div
                          style={{
                            width: 20, height: 20,
                            border: '2.5px solid rgba(255,255,255,0.35)',
                            borderTopColor: '#fff',
                            borderRadius: '50%',
                            animation: 'spin 0.7s linear infinite',
                          }}
                        />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* ═══════════════ LOCATION STRIP ═══════════════ */}
        <div
          {...anim('location', 200)}
          style={{
            marginTop: 72,
            padding: '32px 40px',
            background: '#fff',
            borderRadius: 24,
            border: '2px solid #F5E6C8',
            display: 'flex',
            alignItems: 'center',
            gap: 32,
            flexWrap: 'wrap',
            boxShadow: '0 8px 32px rgba(146,64,14,0.07)',
          }}
        >
          {/* Map pin mock */}
          <div
            style={{
              width: 80, height: 80,
              borderRadius: 20,
              background: '#FEF3C7',
              border: '2px solid #F5E6C8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <MapPin size={36} color="#F59E0B" />
          </div>

          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: "'Baloo 2', cursive",
                fontWeight: 800,
                fontSize: '1.15rem',
                color: '#78350F',
                marginBottom: 4,
              }}
            >
              Find Us in Nairobi
            </div>
            <p style={{ color: '#A16207', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
              Located in <strong style={{ color: '#78350F' }}>Lucky Summer, Nairobi</strong> — where the sweet aroma of freshly baked cakes greets you at the door. Walk-ins welcome Mon–Sat.
            </p>
          </div>

          <a
            href="https://maps.google.com/?q=Lucky+Summer+Nairobi"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "'Baloo 2', cursive",
              fontWeight: 700,
              fontSize: '0.9rem',
              padding: '12px 28px',
              borderRadius: 999,
              background: 'linear-gradient(135deg, #F59E0B, #B45309)',
              color: '#fff',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              boxShadow: '0 6px 18px rgba(245,158,11,0.3)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 10px 28px rgba(245,158,11,0.4)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 6px 18px rgba(245,158,11,0.3)';
            }}
          >
            <MapPin size={16} />
            Get Directions
          </a>
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; }
          70% { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
        @media (max-width: 600px) {
          form > div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
