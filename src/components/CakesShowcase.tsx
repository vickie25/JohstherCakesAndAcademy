import { useState, useEffect, useRef, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigation } from '../context/NavigationContext';
import { apiRequest, formatCurrency } from '../lib/api';

const categories = ['All', 'Wedding', 'Birthday', 'Custom', 'Academy'];

interface Cake {
  id: number;
  name?: string;
  title?: string;
  category: string;
  description?: string;
  desc?: string;
  price: number;
  image_url?: string;
  image?: string;
  tag: string;
}

const MOCK_CAKES: Cake[] = [
  {
    id: 1,
    name: 'Midnight Truffle Symphony',
    category: 'Birthday',
    description: 'Triple-layered dark Belgian chocolate with a silky smooth ganache finish.',
    price: 4500,
    image_url: '/hero_cake_elegant.png',
    tag: 'Luxury',
  },
  {
    id: 2,
    name: 'Royal Red Velvet Pearl',
    category: 'Birthday',
    description: 'Our signature crimson cocoa layers with Madagascar vanilla cream cheese frost.',
    price: 3200,
    image_url: '/red_velvet_cake.png',
    tag: 'Signature',
  },
  {
    id: 3,
    name: 'Golden Orchard Delight',
    category: 'Custom',
    description: 'Moist vanilla bean layers filled with fresh passion fruit curd and citrus zest.',
    price: 4000,
    image_url: '/hero-cake.png',
    tag: 'Fresh',
  },
  {
    id: 4,
    name: 'Antique Lace Wedding',
    category: 'Wedding',
    description: 'Exquisite three-tier masterpiece with hand-sculpted sugar flowers.',
    price: 15500,
    image_url: '/hero_cake_elegant.png',
    tag: 'Wedding',
  },
  {
    id: 5,
    name: "Baker's Choice Selection",
    category: 'Birthday',
    description: 'Seasonal assortment of our finest sponge and buttercream combinations.',
    price: 2800,
    image_url: '/hero_baker.png',
    tag: 'Classic',
  },
  {
    id: 6,
    name: 'Petite Artisan Treats',
    category: 'Academy',
    description: 'Curated selection of gourmet cupcakes and tarts from our academy laboratory.',
    price: 1800,
    image_url: '/academy-class.png',
    tag: 'Academy',
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
  const [cakes, setCakes] = useState<Cake[]>(MOCK_CAKES);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const { items, addToCart, updateQuantity } = useCart();
  const { goToCakes } = useNavigation();

  const featuredCakes = useMemo(() => {
    const filtered = active === 'All' 
      ? cakes 
      : cakes.filter(c => c.category?.toLowerCase() === active.toLowerCase());
    return filtered.slice(0, 6);
  }, [cakes, active]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fetchCakes = async () => {
      try {
        const { data } = await apiRequest<Cake[]>('/cakes');
        if (data && data.length > 0) {
          setCakes(data);
        }
      } catch (err) {
        // Silently stay with dummy data
      } finally {
        setLoading(false);
      }
    };
    fetchCakes();

    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    // Dynamic observation: observe all current and future fade-up elements
    const observer = new MutationObserver(() => {
      el.querySelectorAll('.fade-up:not(.observed)').forEach(item => {
        item.classList.add('observed');
        obs.observe(item);
      });
    });

    observer.observe(el, { childList: true, subtree: true });
    
    // Initial trigger
    el.querySelectorAll('.fade-up').forEach(item => {
      item.classList.add('observed');
      obs.observe(item);
    });

    return () => {
      obs.disconnect();
      observer.disconnect();
    };
  }, [cakes]); // Re-run observation setup when cakes changes

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

        {/* Grid or Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin mb-4"></div>
            <p className="font-['Baloo_2'] font-bold text-[#78350F]">Warming up the collection...</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '28px',
          }}>
            {featuredCakes.map((cake, i) => {
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
                    src={cake.image_url || cake.image}
                    alt={cake.name || cake.title || 'Johsther Cake'}
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
                    {cake.name || cake.title}
                  </h3>
                  <p style={{ fontFamily: "'Comic Neue', cursive", color: '#A16207', fontSize: '0.9rem', marginBottom: '16px', lineHeight: 1.5 }}>
                    {cake.description || cake.desc}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, color: '#92400E', fontSize: '1rem' }}>
                      {formatCurrency(cake.price || 0)}
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
                            name: cake.name || cake.title || 'Custom Cake',
                            priceNum: cake.price,
                            priceStr: formatCurrency(cake.price),
                            image: cake.image_url || cake.image || ''
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
        )}

        {/* CTA */}
        <div className="fade-up" style={{ textAlign: 'center', marginTop: '60px' }}>
          <button
            onClick={() => {
              goToCakes();
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
            style={{
              fontFamily: "'Baloo 2', cursive",
              fontWeight: 700,
              fontSize: '1rem',
              background: '#92400E',
              color: '#fff',
              border: 'none',
              padding: '16px 48px',
              borderRadius: '999px',
              textDecoration: 'none',
              transition: 'all 0.2s',
              display: 'inline-block',
              cursor: 'pointer',
              boxShadow: '0 8px 30px rgba(146, 64, 14, 0.2)'
            }}
            onMouseEnter={e => { (e.currentTarget).style.transform = 'translateY(-2px)'; (e.currentTarget).style.boxShadow = '0 12px 40px rgba(146, 64, 14, 0.3)'; }}
            onMouseLeave={e => { (e.currentTarget).style.transform = 'translateY(0)'; (e.currentTarget).style.boxShadow = '0 8px 30px rgba(146, 64, 14, 0.2)'; }}
          >
            Explore Full Boutique →
          </button>
        </div>
      </div>
    </section>
  );
}
