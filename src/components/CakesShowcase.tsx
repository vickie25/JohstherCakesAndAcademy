import { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';

const categories = ['All', 'Wedding', 'Birthday', 'Custom', 'Academy'];

const cakes = [
  {
    id: 1,
    name: 'Elegant Wedding Cake',
    category: 'Wedding',
    description: 'Tiered masterpiece with fondant flowers',
    price: 'From KES 8,500',
    image: '/hero_cake_elegant.png',
    tag: 'Best Seller',
  },
  {
    id: 2,
    name: 'Red Velvet Delight',
    category: 'Birthday',
    description: 'Velvety layers with cream cheese frosting',
    price: 'From KES 3,200',
    image: '/red_velvet_cake.png',
    tag: 'Popular',
  },
  {
    id: 3,
    name: 'Custom Celebration',
    category: 'Custom',
    description: 'Your dream cake, made to perfection',
    price: 'From KES 4,000',
    image: '/hero-cake.png',
    tag: 'Custom',
  },
  {
    id: 4,
    name: "Baker's Special",
    category: 'Birthday',
    description: 'Classic flavours with a modern twist',
    price: 'From KES 2,800',
    image: '/hero_baker.png',
    tag: 'New',
  },
  {
    id: 5,
    name: 'Academy Signature',
    category: 'Academy',
    description: 'Made by our top students in class',
    price: 'From KES 2,500',
    image: '/academy-class.png',
    tag: 'Student Made',
  },
  {
    id: 6,
    name: 'Royal Wedding Tier',
    category: 'Wedding',
    description: 'Multi-tier with gold leaf accents',
    price: 'From KES 12,000',
    image: '/hero_cake_elegant.png',
    tag: 'Premium',
  },
];

const tagColors: Record<string, { bg: string; color: string }> = {
  'Best Seller': { bg: '#F59E0B', color: '#fff' },
  Popular:       { bg: '#92400E', color: '#fff' },
  Custom:        { bg: '#B45309', color: '#fff' },
  New:           { bg: '#10B981', color: '#fff' },
  'Student Made':{ bg: '#6366F1', color: '#fff' },
  Premium:       { bg: '#1C0A00', color: '#F59E0B' },
};

export default function CakesShowcase() {
  const [active, setActive] = useState('All');
  const ref = useRef<HTMLElement>(null);
  const { items, addToCart, updateQuantity } = useCart();

  const filtered = active === 'All' ? cakes : cakes.filter(c => c.category === active);

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
    <section id="cakes" ref={ref} style={{ padding: '100px 0', background: '#FFFBEB', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative top wave */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '60px',
        background: '#FEF3C7',
        clipPath: 'ellipse(55% 100% at 50% 0%)',
      }} aria-hidden="true" />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div className="fade-up" style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div className="pill" style={{ background: '#FEF3C7', border: '2px solid #F59E0B', color: '#92400E', marginBottom: '16px', display: 'inline-flex' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
            Our Crafts
          </div>
          <h2 style={{
            fontFamily: "'Baloo 2', cursive",
            fontWeight: 800,
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: '#78350F',
            marginBottom: '16px',
          }}>
            Baked With <span style={{ color: '#F59E0B' }}>Heart</span> & Soul
          </h2>
          <p style={{ fontFamily: "'Comic Neue', cursive", fontSize: '1.05rem', color: '#A16207', maxWidth: '500px', margin: '0 auto' }}>
            Every cake is a work of art. Explore our range — from intimate birthday cakes to grand wedding centrepieces.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="fade-up" style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '48px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              style={{
                fontFamily: "'Baloo 2', cursive",
                fontWeight: 600,
                fontSize: '0.9rem',
                padding: '8px 22px',
                borderRadius: '999px',
                border: '2px solid',
                borderColor: active === cat ? '#92400E' : '#E5D0A8',
                background: active === cat ? '#92400E' : 'transparent',
                color: active === cat ? '#fff' : '#92400E',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '28px',
        }}>
          {filtered.map((cake, i) => {
            const tagStyle = tagColors[cake.tag] ?? { bg: '#F59E0B', color: '#fff' };
            return (
              <article
                key={cake.id}
                className="card-lift fade-up"
                style={{
                  background: '#fff',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  border: '2px solid #F5E6C8',
                  cursor: 'pointer',
                  animationDelay: `${i * 0.08}s`,
                }}
              >
                {/* Image */}
                <div style={{ position: 'relative', overflow: 'hidden', height: '220px' }}>
                  <img
                    src={cake.image}
                    alt={cake.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                  {/* Tag */}
                  <div style={{
                    position: 'absolute', top: '14px', right: '14px',
                    background: tagStyle.bg,
                    color: tagStyle.color,
                    fontFamily: "'Baloo 2', cursive",
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    padding: '4px 12px',
                    borderRadius: '999px',
                  }}>
                    {cake.tag}
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '20px 22px 24px' }}>
                  <h3 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1.15rem', color: '#78350F', marginBottom: '6px' }}>
                    {cake.name}
                  </h3>
                  <p style={{ fontFamily: "'Comic Neue', cursive", color: '#A16207', fontSize: '0.9rem', marginBottom: '16px', lineHeight: 1.5 }}>
                    {cake.description}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, color: '#92400E', fontSize: '1rem' }}>
                      {cake.price}
                    </span>
                    {items.find(i => i.id === cake.id) ? (() => {
                      const cartItem = items.find(i => i.id === cake.id)!;
                      return (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FEF3C7', padding: '4px 8px', borderRadius: '999px', border: '1px solid #F59E0B44' }}>
                          <button onClick={(e) => { e.stopPropagation(); updateQuantity(cake.id, -1); }} style={{ background: '#F59E0B', border: 'none', color: '#fff', width: 24, height: 24, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>-</button>
                          <span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, color: '#92400E', width: '16px', textAlign: 'center', fontSize: '0.9rem' }}>{cartItem.quantity}</span>
                          <button onClick={(e) => { e.stopPropagation(); updateQuantity(cake.id, 1); }} style={{ background: '#F59E0B', border: 'none', color: '#fff', width: 24, height: 24, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>+</button>
                        </div>
                      );
                    })() : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart({
                            id: cake.id,
                            name: cake.name,
                            priceNum: parseInt(cake.price.replace(/\D/g, ''), 10) || 0,
                            priceStr: cake.price,
                            image: cake.image
                          });
                        }}
                        style={{
                          fontFamily: "'Baloo 2', cursive",
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          background: 'linear-gradient(135deg, #F59E0B, #B45309)',
                          color: '#fff',
                          border: 'none',
                          padding: '8px 18px',
                          borderRadius: '999px',
                          cursor: 'pointer',
                          transition: 'opacity 0.2s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                        aria-label={`Add ${cake.name} to cart`}
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* CTA */}
        <div className="fade-up" style={{ textAlign: 'center', marginTop: '60px' }}>
          <a
            href="#contact"
            style={{
              fontFamily: "'Baloo 2', cursive",
              fontWeight: 700,
              fontSize: '1rem',
              background: 'transparent',
              color: '#92400E',
              border: '2.5px solid #92400E',
              padding: '14px 36px',
              borderRadius: '999px',
              textDecoration: 'none',
              transition: 'all 0.2s',
              display: 'inline-block',
              cursor: 'pointer',
            }}
            onMouseEnter={e => { (e.currentTarget).style.background = '#92400E'; (e.currentTarget).style.color = '#fff'; }}
            onMouseLeave={e => { (e.currentTarget).style.background = 'transparent'; (e.currentTarget).style.color = '#92400E'; }}
          >
            Request a Custom Cake →
          </a>
        </div>
      </div>
    </section>
  );
}
