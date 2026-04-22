import { useState, useEffect, useRef } from 'react';
import { apiRequest } from '../lib/api';

const TYPE_LABELS: Record<string, string> = {
  order: 'Cake order',
  course: 'Course / academy',
  group: 'Group / corporate',
  other: 'General inquiry',
};

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', type: 'order', message: '' });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);
    const { error } = await apiRequest('/inquiries', {
      method: 'POST',
      useAuth: false,
      body: JSON.stringify({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: (form.phone || '').trim() || null,
        type: TYPE_LABELS[form.type] || form.type,
        message: form.message.trim(),
      }),
    });
    setSubmitting(false);
    if (error) {
      setSubmitError(error);
      return;
    }
    setSent(true);
    setForm({ name: '', email: '', phone: '', type: 'order', message: '' });
  };

  return (
    <section id="contact" ref={ref} style={{ padding: '100px 0', background: '#78350F', position: 'relative', overflow: 'hidden' }}>
      <div className="dot-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.07 }} aria-hidden="true" />
      <div className="blob" style={{
        position: 'absolute', bottom: '-80px', right: '-80px',
        width: '350px', height: '350px',
        background: '#F59E0B', opacity: 0.1,
      }} aria-hidden="true" />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div className="fade-up" style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div className="pill" style={{ background: 'rgba(245,158,11,0.15)', border: '2px solid #F59E0B', color: '#F59E0B', marginBottom: '16px', display: 'inline-flex' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Get In Touch
          </div>
          <h2 style={{
            fontFamily: "'Baloo 2', cursive",
            fontWeight: 800,
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            color: '#FEF3C7',
            marginBottom: '12px',
          }}>
            Let's Bake Something <span style={{ color: '#F59E0B' }}>Amazing</span>
          </h2>
          <p style={{ fontFamily: "'Comic Neue', cursive", fontSize: '1rem', color: '#FDE68A' }}>
            Order a cake, enrol in a course, or just say hi — we're always happy to hear from you!
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.4fr',
          gap: '48px',
          alignItems: 'start',
        }} className="contact-grid">

          {/* Left — Info */}
          <div className="fade-up">
            {[
              {
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>,
                title: 'Visit Us',
                info: 'Umoja One (Ngorano House), Moi Drive, Nairobi',
              },
              {
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 11.5 19.79 19.79 0 0 1 1.64 2.9 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.96-1.07a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 15.92z" /></svg>,
                title: 'WhatsApp / Call',
                info: '0757 942121',
              },
              {
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>,
                title: 'Email',
                info: 'hello@johstercakesacadamy.co.ke',
              },
              {
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
                title: 'Opening Hours',
                info: 'Mon – Sat: 7am – 8pm',
              },
            ].map(item => (
              <div key={item.title} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '28px' }}>
                <div style={{
                  width: '46px', height: '46px',
                  background: 'rgba(245,158,11,0.12)',
                  borderRadius: '14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  border: '1.5px solid rgba(245,158,11,0.25)',
                }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, color: '#FEF3C7', fontSize: '0.95rem', marginBottom: '3px' }}>{item.title}</div>
                  <div style={{ fontFamily: "'Comic Neue', cursive", color: '#FDE68A', fontSize: '0.9rem' }}>{item.info}</div>
                </div>
              </div>
            ))}

            {/* Social links */}
            <div style={{ marginTop: '32px' }}>
              <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, color: '#FEF3C7', marginBottom: '14px', fontSize: '0.9rem' }}>Follow Our Journey</div>
              <div style={{ display: 'flex', gap: '12px' }}>
                {[
                  { label: 'Instagram', href: '#', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg> },
                  { label: 'Facebook', href: '#', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg> },
                  { label: 'TikTok', href: '#', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.53a8.17 8.17 0 0 0 4.78 1.53V7.62a4.85 4.85 0 0 1-1.01-.93z" /></svg> },
                ].map(s => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    style={{
                      width: '44px', height: '44px',
                      background: 'rgba(245,158,11,0.12)',
                      border: '1.5px solid rgba(245,158,11,0.3)',
                      borderRadius: '12px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#F59E0B',
                      textDecoration: 'none',
                      transition: 'background 0.2s, border-color 0.2s',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => { (e.currentTarget).style.background = '#F59E0B'; (e.currentTarget).style.color = '#1C0A00'; }}
                    onMouseLeave={e => { (e.currentTarget).style.background = 'rgba(245,158,11,0.12)'; (e.currentTarget).style.color = '#F59E0B'; }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div className="fade-up" style={{
            background: '#fff',
            borderRadius: '28px',
            padding: '36px',
            border: '2px solid #F5E6C8',
          }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>🎂</div>
                <h3 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, color: '#78350F', fontSize: '1.5rem', marginBottom: '10px' }}>
                  Message Sent!
                </h3>
                <p style={{ fontFamily: "'Comic Neue', cursive", color: '#A16207', lineHeight: 1.6 }}>
                  Thank you for reaching out! We'll get back to you within 24 hours to discuss the sweet details.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, color: '#78350F', fontSize: '1.3rem', margin: '0 0 4px' }}>
                  Send a Message
                </h3>

                {/* Type selector */}
                <div>
                  <label htmlFor="inquiry-type" style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 600, color: '#92400E', fontSize: '0.88rem', display: 'block', marginBottom: '8px' }}>
                    I'm interested in...
                  </label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }} id="inquiry-type">
                    {[
                      { val: 'order', label: 'Ordering a Cake' },
                      { val: 'course', label: 'A Baking Course' },
                      { val: 'group', label: 'Group / Corporate' },
                      { val: 'other', label: 'Something Else' },
                    ].map(opt => (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, type: opt.val }))}
                        style={{
                          fontFamily: "'Baloo 2', cursive",
                          fontWeight: 600,
                          fontSize: '0.82rem',
                          padding: '7px 16px',
                          borderRadius: '999px',
                          border: '2px solid',
                          borderColor: form.type === opt.val ? '#92400E' : '#E5D0A8',
                          background: form.type === opt.val ? '#92400E' : 'transparent',
                          color: form.type === opt.val ? '#fff' : '#92400E',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label htmlFor="contact-name" style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 600, color: '#92400E', fontSize: '0.88rem', display: 'block', marginBottom: '6px' }}>Your Name</label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="Jane Wanjiku"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: '12px',
                        border: '2px solid #F5E6C8',
                        fontFamily: "'Comic Neue', cursive",
                        fontSize: '0.9rem',
                        color: '#78350F',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        boxSizing: 'border-box',
                      }}
                      onFocus={e => (e.target.style.borderColor = '#F59E0B')}
                      onBlur={e => (e.target.style.borderColor = '#F5E6C8')}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-phone" style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 600, color: '#92400E', fontSize: '0.88rem', display: 'block', marginBottom: '6px' }}>Phone Number</label>
                    <input
                      id="contact-phone"
                      type="tel"
                      placeholder="0757 942121"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: '12px',
                        border: '2px solid #F5E6C8',
                        fontFamily: "'Comic Neue', cursive",
                        fontSize: '0.9rem',
                        color: '#78350F',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        boxSizing: 'border-box',
                      }}
                      onFocus={e => (e.target.style.borderColor = '#F59E0B')}
                      onBlur={e => (e.target.style.borderColor = '#F5E6C8')}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-email" style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 600, color: '#92400E', fontSize: '0.88rem', display: 'block', marginBottom: '6px' }}>Email Address</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="jane@email.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '12px',
                      border: '2px solid #F5E6C8',
                      fontFamily: "'Comic Neue', cursive",
                      fontSize: '0.9rem',
                      color: '#78350F',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      boxSizing: 'border-box',
                    }}
                    onFocus={e => (e.target.style.borderColor = '#F59E0B')}
                    onBlur={e => (e.target.style.borderColor = '#F5E6C8')}
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 600, color: '#92400E', fontSize: '0.88rem', display: 'block', marginBottom: '6px' }}>Your Message</label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    placeholder="Tell us your vision, event date, flavour preferences..."
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '12px',
                      border: '2px solid #F5E6C8',
                      fontFamily: "'Comic Neue', cursive",
                      fontSize: '0.9rem',
                      color: '#78350F',
                      outline: 'none',
                      resize: 'vertical',
                      transition: 'border-color 0.2s',
                      boxSizing: 'border-box',
                    }}
                    onFocus={e => (e.target.style.borderColor = '#F59E0B')}
                    onBlur={e => (e.target.style.borderColor = '#F5E6C8')}
                  />
                </div>

                {submitError && (
                  <p style={{ fontFamily: "'Comic Neue', cursive", fontSize: '0.88rem', color: '#b91c1c', margin: 0 }}>
                    {submitError}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    fontFamily: "'Baloo 2', cursive",
                    fontWeight: 700,
                    fontSize: '1rem',
                    background: submitting ? '#a8a29e' : 'linear-gradient(135deg, #92400E, #B45309)',
                    color: '#fff',
                    border: 'none',
                    padding: '14px',
                    borderRadius: '14px',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    boxShadow: '0 8px 20px rgba(146,64,14,0.3)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={e => { if (!submitting) { (e.currentTarget).style.transform = 'translateY(-2px)'; (e.currentTarget).style.boxShadow = '0 12px 28px rgba(146,64,14,0.4)'; } }}
                  onMouseLeave={e => { (e.currentTarget).style.transform = 'translateY(0)'; (e.currentTarget).style.boxShadow = '0 8px 20px rgba(146,64,14,0.3)'; }}
                >
                  {submitting ? 'Sending…' : 'Send message →'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
