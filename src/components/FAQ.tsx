import { useState, useEffect, useRef } from 'react';

const faqs = [
  {
    q: 'Do I need any experience to join the Beginner Baker course?',
    a: 'Not at all! The Beginner course is designed for absolute beginners. We start from scratch — mixing, baking, frosting — all explained step by step.',
  },
  {
    q: 'What does "all-inclusive" mean for courses?',
    a: 'All ingredients, baking tools, aprons, and recipe booklets are provided. You just bring yourself and your enthusiasm — we handle everything else.',
  },
  {
    q: 'How do I order a custom cake?',
    a: "Simply use the contact form below or WhatsApp us. Share your vision, occasion, size, and date \u2014 we'll send you a quote within 24 hours.",
  },
  {
    q: 'How far in advance should I order my cake?',
    a: 'For wedding/event cakes, we recommend at least 2–3 weeks. Birthday and custom cakes can typically be done in 3–5 business days, subject to availability.',
  },
  {
    q: 'Do you offer online baking classes?',
    a: 'We currently focus on in-person, hands-on sessions for the best learning experience. However, we do have short online demo sessions — reach out for details.',
  },
  {
    q: 'Can I get a group discount for the courses?',
    a: 'Yes! Groups of 5 or more get special rates. We also offer private team-building baking sessions — perfect for corporate events.',
  },
  {
    q: 'Is the certificate internationally recognised?',
    a: 'Our certificates are recognised by major bakeries and hospitality establishments across East Africa. The Pro Masterclass includes an industry-endorsed diploma.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
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
    <section id="faq" ref={ref} style={{ padding: '100px 0', background: '#FEF3C7', position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div className="fade-up" style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div className="pill" style={{ background: '#FFFBEB', border: '2px solid #F59E0B', color: '#92400E', marginBottom: '16px', display: 'inline-flex' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            FAQ
          </div>
          <h2 style={{
            fontFamily: "'Baloo 2', cursive",
            fontWeight: 800,
            fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
            color: '#78350F',
            marginBottom: '12px',
          }}>
            Got <span style={{ color: '#F59E0B' }}>Questions?</span>
          </h2>
          <p style={{ fontFamily: "'Comic Neue', cursive", fontSize: '1rem', color: '#A16207' }}>
            We've got answers! If you don't see yours here, just reach out.
          </p>
        </div>

        {/* Accordion */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="fade-up"
              style={{
                background: '#fff',
                borderRadius: '18px',
                border: open === i ? '2px solid #F59E0B' : '2px solid #F5E6C8',
                overflow: 'hidden',
                transition: 'border-color 0.2s',
              }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  padding: '20px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '16px',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
                aria-expanded={open === i ? "true" : "false"}
              >
                <span style={{
                  fontFamily: "'Baloo 2', cursive",
                  fontWeight: 700,
                  fontSize: '0.97rem',
                  color: open === i ? '#92400E' : '#78350F',
                  lineHeight: 1.4,
                }}>
                  {faq.q}
                </span>
                <div style={{
                  width: '28px', height: '28px',
                  background: open === i ? '#F59E0B' : '#FEF3C7',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.3s',
                  transform: open === i ? 'rotate(45deg)' : 'rotate(0deg)',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={open === i ? '#fff' : '#92400E'} strokeWidth="2.5" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </div>
              </button>

              {open === i && (
                <div style={{ padding: '0 24px 22px' }}>
                  <p style={{
                    fontFamily: "'Comic Neue', cursive",
                    fontSize: '0.95rem',
                    color: '#A16207',
                    lineHeight: '1.7',
                    margin: 0,
                  }}>
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div className="fade-up" style={{
          textAlign: 'center',
          marginTop: '48px',
          padding: '28px',
          background: 'linear-gradient(135deg, #92400E, #B45309)',
          borderRadius: '24px',
        }}>
          <p style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, color: '#FEF3C7', fontSize: '1.1rem', marginBottom: '16px' }}>
            Still have a question? We'd love to chat!
          </p>
          <a
            href="#contact"
            style={{
              fontFamily: "'Baloo 2', cursive",
              fontWeight: 700,
              background: '#F59E0B',
              color: '#1C0A00',
              padding: '12px 30px',
              borderRadius: '999px',
              textDecoration: 'none',
              fontSize: '0.95rem',
              display: 'inline-block',
              transition: 'opacity 0.2s',
              cursor: 'pointer',
            }}
          >
            Send Us a Message →
          </a>
        </div>
      </div>
    </section>
  );
}
