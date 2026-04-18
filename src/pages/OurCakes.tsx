import { useState, useMemo, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Filter, Search, X, Check } from 'lucide-react';
import { apiRequest } from '../lib/api';

const CATEGORIES = ['All', 'Wedding', 'Birthday', 'Corporate', 'Academy'];

const COLOR_MAP: Record<string, string> = {
  'White': '#F8FAFC',
  'Pink': '#FCE7F3',
  'Chocolate': '#3E2723',
  'Gold': '#FBBF24',
  'Blue': '#1E3A8A',
  'Green': '#D1FAE5',
  'Red': '#DC2626',
  'Purple': '#7E22CE',
};

interface Cake {
  id: number;
  name: string;
  category: string;
  color: string;
  price: number;
  image_url: string;
  tag: string;
  description: string;
}

export default function OurCakes() {
  const { addToCart, items, updateQuantity, setIsCartOpen } = useCart();
  
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeColor, setActiveColor] = useState('All');
  const [maxPrice, setMaxPrice] = useState(15000);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCakes = async () => {
      try {
        const { data, error } = await apiRequest<Cake[]>('/cakes?active=false');
        if (data) {
          setCakes(data.map((c: any) => ({
            ...c,
            image_url: c.image_url || c.image || ''
          })));
        } else if (error) {
          console.error('Failed to fetch cakes:', error);
          setCakes([]);
        }
      } catch (error) {
        console.error('Failed to fetch cakes:', error);
        setCakes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCakes();
  }, []);

  // Initialize animations on mount
  useEffect(() => {
    window.scrollTo(0,0);
    const elements = document.querySelectorAll('.fade-up-initial');
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('visible');
      }, index * 100);
    });
  }, []);

  const filteredCakes = useMemo(() => {
    return cakes.filter(cake => {
      const matchCat = activeCategory === 'All' || cake.category === activeCategory;
      const matchColor = activeColor === 'All' || cake.color === activeColor;
      const matchPrice = cake.price <= maxPrice;
      const matchSearch = cake.name.toLowerCase().includes(searchQuery.toLowerCase()) || cake.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchColor && matchPrice && matchSearch;
    });
  }, [activeCategory, activeColor, maxPrice, searchQuery, cakes]);

  // Sidebar Filter Section Component
  const FilterSection = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Search Bar */}
      <div style={{ position: 'relative' }}>
         <Search size={18} color="#92400E" style={{ position: 'absolute', top: '14px', left: '16px' }} />
         <input 
           type="text" 
           placeholder="Search cakes..." 
           value={searchQuery}
           onChange={e => setSearchQuery(e.target.value)}
           style={{
             width: '100%',
             padding: '12px 16px 12px 42px',
             borderRadius: '999px',
             border: '2px solid #F5E6C8',
             background: '#FFFBEB',
             fontFamily: "'Comic Neue', cursive",
             fontSize: '1.05rem',
             color: '#78350F',
             outline: 'none',
             transition: 'border-color 0.2s, box-shadow 0.2s',
             boxShadow: 'inset 0 2px 4px rgba(146, 64, 14, 0.05)'
           }}
           onFocus={e => { e.currentTarget.style.borderColor = '#F59E0B'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(245,158,11,0.2)'; }}
           onBlur={e => { e.currentTarget.style.borderColor = '#F5E6C8'; e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(146, 64, 14, 0.05)'; }}
         />
      </div>

      {/* Category Filter */}
      <div>
        <h4 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1.2rem', color: '#78350F', marginBottom: '12px' }}>Category</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                textAlign: 'left',
                padding: '8px 16px',
                borderRadius: '12px',
                background: activeCategory === cat ? 'linear-gradient(135deg, #F59E0B, #B45309)' : 'transparent',
                color: activeCategory === cat ? '#fff' : '#92400E',
                border: 'none',
                fontFamily: "'Baloo 2', cursive",
                fontWeight: 600,
                fontSize: '1.05rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
              onMouseEnter={e => { if(activeCategory !== cat) e.currentTarget.style.background = '#FEF3C7'; }}
              onMouseLeave={e => { if(activeCategory !== cat) e.currentTarget.style.background = 'transparent'; }}
            >
              {cat}
              {activeCategory === cat && <Check size={16} />}
            </button>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div>
        <h4 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1.2rem', color: '#78350F', marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
          <span>Max Price</span>
          <span style={{ color: '#F59E0B' }}>KES {maxPrice.toLocaleString()}</span>
        </h4>
        <input 
          type="range" 
          min="2000" 
          max="15000" 
          step="500"
          value={maxPrice}
          onChange={e => setMaxPrice(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#F59E0B', cursor: 'pointer' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.85rem', color: '#A16207', fontFamily: "'Comic Neue', cursive", fontWeight: 600 }}>
           <span>2,000</span>
           <span>15,000</span>
        </div>
      </div>

      {/* Color Filter */}
      <div>
        <h4 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1.2rem', color: '#78350F', marginBottom: '16px' }}>Theme Colors</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          <button
             onClick={() => setActiveColor('All')}
             style={{
               width: '100%',
               aspectRatio: '1',
               borderRadius: '50%',
               background: '#fff',
               border: `2px solid ${activeColor === 'All' ? '#F59E0B' : '#E5D0A8'}`,
               color: '#92400E',
               fontFamily: "'Baloo 2', cursive",
               fontWeight: 700,
               fontSize: '0.85rem',
               cursor: 'pointer',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               transition: 'all 0.2s',
               transform: activeColor === 'All' ? 'scale(1.1)' : 'scale(1)',
             }}
          >
            All
          </button>
          
          {Object.entries(COLOR_MAP).map(([name, code]) => (
            <button
               key={name}
               onClick={() => setActiveColor(name)}
               title={name}
               aria-label={`Filter by ${name}`}
               style={{
                 width: '100%',
                 aspectRatio: '1',
                 borderRadius: '50%',
                 background: code,
                 border: `3px solid ${activeColor === name ? '#F59E0B' : '#FFFFFF'}`,
                 boxShadow: activeColor === name ? '0 4px 12px rgba(245,158,11,0.4)' : '0 2px 8px rgba(0,0,0,0.08)',
                 cursor: 'pointer',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 transition: 'all 0.2s',
                 transform: activeColor === name ? 'scale(1.1)' : 'scale(1)',
               }}
            >
              {activeColor === name && <Check size={18} color={name === 'White' || name === 'Pink' ? '#000' : '#FFF'} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#FFFBEB' }}>
      
      {/* Hero Section (Parallax/Gradient feel) */}
      <div style={{ 
        position: 'relative', 
        paddingTop: '140px', 
        paddingBottom: '80px',
        background: 'linear-gradient(180deg, #FEF3C7 0%, #FFFBEB 100%)',
        overflow: 'hidden'
      }}>
        {/* Decorative elements */}
        <div style={{ position: 'absolute', top: '10%', left: '5%', width: '150px', height: '150px', background: 'radial-gradient(circle, #F59E0B22 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(20px)' }} className="animate-float" />
        <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: '250px', height: '250px', background: 'radial-gradient(circle, #B4530915 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)' }} className="animate-float-slow" />
        
        <div className="fade-up-initial" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
           <h1 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 'clamp(3rem, 6vw, 4.5rem)', color: '#78350F', lineHeight: 1.1, marginBottom: '16px' }}>
             Our Masterpiece <span style={{ color: '#F59E0B' }}>Collection</span>
           </h1>
           <p style={{ fontFamily: "'Comic Neue', cursive", fontSize: '1.2rem', color: '#A16207', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
             From opulent wedding tiers to delicate birthday surprises. Explore our gallery, filter by your favorite colors, and find the perfect cake that brings your vision to life.
           </p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px 100px', display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
         
         {/* Desktop Sidebar */}
         <aside className="fade-up-initial hidden md:block" style={{ width: '280px', flexShrink: 0, position: 'sticky', top: '100px', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)', border: '2px solid #F5E6C8', borderRadius: '24px', padding: '32px', boxShadow: '0 20px 40px rgba(146, 64, 14, 0.05)' }}>
            <FilterSection />
         </aside>

         {/* Mobile Filter Button */}
         <button 
           className="md:hidden"
           onClick={() => setMobileFilterOpen(true)}
           style={{
             position: 'fixed',
             bottom: '24px',
             right: '24px',
             background: 'linear-gradient(135deg, #F59E0B, #B45309)',
             color: '#fff',
             border: 'none',
             borderRadius: '999px',
             padding: '16px 24px',
             display: 'flex',
             alignItems: 'center',
             gap: '8px',
             fontFamily: "'Baloo 2', cursive",
             fontWeight: 700,
             fontSize: '1.1rem',
             boxShadow: '0 10px 25px rgba(146,64,14,0.3)',
             zIndex: 40
           }}
         >
           <Filter size={20} />
           Filters & Search
         </button>

         {/* Mobile Filter Overlay */}
         {mobileFilterOpen && (
           <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', justifyContent: 'flex-end', background: 'rgba(28, 10, 0, 0.5)', backdropFilter: 'blur(4px)' }}>
             <div style={{ width: '85%', maxWidth: '340px', background: '#FFFBEB', height: '100%', overflowY: 'auto', padding: '32px 24px', borderLeft: '2px solid #F59E0B', boxShadow: '-10px 0 30px rgba(0,0,0,0.1)' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                 <h3 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '1.5rem', color: '#78350F' }}>Filters</h3>
                 <button onClick={() => setMobileFilterOpen(false)} style={{ background: '#FEF3C7', border: '1px solid #F5E6C8', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#92400E' }}>
                   <X size={20} />
                 </button>
               </div>
               <FilterSection />
             </div>
           </div>
         )}

         {/* Cake Grid */}
         <main style={{ flex: 1, minWidth: 0 }}>
            {/* Active Filters Summary */}
            <div className="fade-up-initial" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
               <h2 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1.5rem', color: '#92400E' }}>
                 {filteredCakes.length} Masterpiece{filteredCakes.length !== 1 && 's'} Found
               </h2>
               
               {/* Quick Clear */}
               {(activeCategory !== 'All' || activeColor !== 'All' || maxPrice !== 15000 || searchQuery !== '') && (
                 <button 
                   onClick={() => { setActiveCategory('All'); setActiveColor('All'); setMaxPrice(15000); setSearchQuery(''); }}
                   style={{ background: 'transparent', border: '1px dashed #F59E0B', color: '#F59E0B', padding: '6px 14px', borderRadius: '999px', fontSize: '0.9rem', fontFamily: "'Baloo 2', cursive", fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}
                   onMouseEnter={e => { e.currentTarget.style.background = '#FEF3C7'; }}
                   onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                 >
                   <X size={14} /> Clear All Filters
                 </button>
               )}
            </div>

            {/* Content Grid */}
            <div className="flex-1 w-full">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-40 bg-white/50 rounded-3xl border border-white">
                   <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin mb-4"></div>
                   <p className="font-['Baloo_2'] font-bold text-amber-950 text-xl tracking-tight">
                     Warming up the ovens...
                   </p>
                   <p className="text-amber-900/60 font-medium">
                     Fetching our masterpieces from the bakery.
                   </p>
                </div>
              ) : filteredCakes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255,255,255,0.6)', borderRadius: '32px', backdropFilter: 'blur(10px)' }}>
                   <p style={{ fontFamily: "'Baloo 2', cursive", fontSize: '1.5rem', color: '#B45309', fontWeight: 'bold' }}>No cakes found matching your taste.</p>
                   <button onClick={() => { setActiveCategory('All'); setActiveColor('All'); setMaxPrice(15000); setSearchQuery(''); }} style={{ marginTop: '16px', background: 'none', border: '2px solid #F59E0B', color: '#B45309', padding: '8px 24px', borderRadius: '999px', fontFamily: "'Baloo 2', cursive", fontWeight: 'bold', cursor: 'pointer' }}>
                     Clear all filters
                   </button>
                </div>
              ) : (
                <div style={{ 
                 display: 'grid', 
                 gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                 gap: '32px' 
               }}>
                  {filteredCakes.map((cake, i) => (
                    <article 
                      key={cake.id} 
                      className="card-lift"
                      style={{
                        background: '#fff',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        border: '2px solid #F5E6C8',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        animation: `fadeUp 0.6s ease forwards`,
                        animationDelay: `${i * 0.05}s`,
                        opacity: 0,
                        transform: 'translateY(20px)'
                      }}
                    >
                       <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
                          <img 
                            src={cake.image_url} 
                            alt={cake.name} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                          />
                          <div style={{ position: 'absolute', top: '16px', right: '16px', background: '#F59E0B', color: '#fff', padding: '4px 12px', borderRadius: '999px', fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '0.8rem', boxShadow: '0 4px 12px rgba(245,158,11,0.3)' }}>
                            {cake.tag}
                          </div>
                          {/* Color Badge Indicator */}
                          <div style={{ position: 'absolute', bottom: '12px', left: '12px', width: '24px', height: '24px', borderRadius: '50%', background: COLOR_MAP[cake.color] || '#FFF', border: '2px solid #FFF', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }} title={`Color: ${cake.color}`} />
                       </div>

                       <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                             <h3 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '1.3rem', color: '#78350F', lineHeight: 1.2 }}>{cake.name}</h3>
                          </div>
                          <p style={{ fontFamily: "'Comic Neue', cursive", fontSize: '0.95rem', color: '#A16207', marginBottom: '20px', flex: 1, lineHeight: 1.5 }}>{cake.description}</p>
                          
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #FEF3C7' }}>
                             <span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '1.25rem', color: '#92400E' }}>
                               KES {cake.price.toLocaleString()}
                             </span>

                             {items.find(i => i.id === cake.id) ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FEF3C7', padding: '6px 12px', borderRadius: '999px', border: '1px solid #F59E0B44' }}>
                                   <button onClick={(e) => { e.stopPropagation(); updateQuantity(cake.id, -1); }} style={{ background: '#F59E0B', border: 'none', color: '#fff', width: 24, height: 24, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>-</button>
                                   <span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, color: '#92400E', width: '16px', textAlign: 'center' }}>{items.find(i => i.id === cake.id)!.quantity}</span>
                                   <button onClick={(e) => { e.stopPropagation(); updateQuantity(cake.id, 1); }} style={{ background: '#F59E0B', border: 'none', color: '#fff', width: 24, height: 24, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>+</button>
                                </div>
                             ) : (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart({
                                      id: cake.id,
                                      name: cake.name,
                                      priceNum: cake.price,
                                      priceStr: `KES ${cake.price.toLocaleString()}`,
                                      image: cake.image
                                    });
                                    setIsCartOpen(true);
                                  }}
                                  style={{
                                    background: '#FFFBEB',
                                    color: '#F59E0B',
                                    border: '2px solid #F59E0B',
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                  }}
                                  onMouseEnter={e => { e.currentTarget.style.background = '#F59E0B'; e.currentTarget.style.color = '#fff'; }}
                                  onMouseLeave={e => { e.currentTarget.style.background = '#FFFBEB'; e.currentTarget.style.color = '#F59E0B'; }}
                                  aria-label={`Add ${cake.name} to cart`}
                                >
                                  <ShoppingCart size={18} />
                                </button>
                             )}
                          </div>
                       </div>
                    </article>
                  ))}
                </div>
             )}
          </div>
        </main>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .fade-up-initial {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .fade-up-initial.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .hidden { display: none; }
        @media (min-width: 768px) {
          .md\\:block { display: block; }
          .md\\:hidden { display: none; }
        }
      `}</style>
    </div>
  );
}
