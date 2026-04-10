import { useState } from 'react';
import { useCart } from '../context/CartContext';
import CheckoutModal from './CheckoutModal';

export default function CartDrawer() {
  const { items, removeFromCart, updateQuantity, totalItems, subtotal, isCartOpen, setIsCartOpen } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isCartOpen) return null;

  return (
    <>
      <div 
        style={{
          position: 'fixed', inset: 0, zIndex: 99,
          background: 'rgba(28, 10, 0, 0.4)', backdropFilter: 'blur(4px)',
          transition: 'opacity 0.3s ease'
        }}
        onClick={() => setIsCartOpen(false)}
      />
      <div 
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: '400px',
          background: '#FFFBEB', zIndex: 100, borderLeft: '2px solid #F59E0B',
          boxShadow: '-10px 0 30px rgba(146,64,14,0.2)', display: 'flex', flexDirection: 'column',
          animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div style={{
          padding: '24px', borderBottom: '2px solid #F5E6C8', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #FEF3C7 0%, #FFFBEB 100%)'
        }}>
          <h2 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '1.5rem', color: '#78350F', margin: 0 }}>
            Your Cart <span style={{ color: '#F59E0B' }}>({totalItems})</span>
          </h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
            style={{
              background: '#F59E0B22', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#92400E'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '60px', color: '#A16207' }}>
              <div style={{ width: 80, height: 80, margin: '0 auto 20px', background: '#F59E0B22', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              </div>
              <h3 style={{ fontFamily: "'Baloo 2', cursive", fontSize: '1.2rem', marginBottom: '8px' }}>Your cart is empty</h3>
              <p style={{ fontFamily: "'Comic Neue', cursive", fontSize: '0.95rem' }}>Looks like you haven't made your choice yet.</p>
              <button 
                onClick={() => setIsCartOpen(false)}
                style={{
                  marginTop: '20px', background: '#F59E0B', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '999px', fontFamily: "'Baloo 2', cursive", fontWeight: 700, cursor: 'pointer'
                }}
              >
                Browse Cakes
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {items.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: '16px', background: '#fff', padding: '12px', borderRadius: '16px', border: '1.5px solid #F5E6C8' }}>
                  <img src={item.image} alt={item.name} style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: '10px' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ margin: '0 0 4px', fontFamily: "'Baloo 2', cursive", fontWeight: 700, color: '#78350F', fontSize: '1rem', lineHeight: 1.2 }}>{item.name}</h4>
                      <button onClick={() => removeFromCart(item.id)} aria-label={`Remove ${item.name} from cart`} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: 4 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </div>
                    <p style={{ margin: '0 0 10px', fontFamily: "'Comic Neue', cursive", color: '#92400E', fontWeight: 'bold' }}>{item.priceStr}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#FFFBEB', padding: '4px', borderRadius: '8px', width: 'fit-content' }}>
                      <button onClick={() => updateQuantity(item.id, -1)} aria-label={`Decrease quantity of ${item.name}`} style={{ background: 'none', border: 'none', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#92400E' }}>-</button>
                      <span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, width: 20, textAlign: 'center', color: '#78350F' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} aria-label={`Increase quantity of ${item.name}`} style={{ background: 'none', border: 'none', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#92400E' }}>+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div style={{ padding: '24px', borderTop: '2px solid #F5E6C8', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontFamily: "'Comic Neue', cursive", fontSize: '1.1rem', color: '#A16207' }}>Subtotal</span>
              <span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '1.25rem', color: '#78350F' }}>KES {subtotal.toLocaleString()}</span>
            </div>
            <button 
              onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
              style={{
                width: '100%', padding: '16px', background: 'linear-gradient(135deg, #92400E 0%, #B45309 100%)',
                color: '#fff', border: 'none', borderRadius: '16px', fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1.1rem',
                cursor: 'pointer', boxShadow: '0 8px 20px rgba(146,64,14,0.25)', transition: 'transform 0.2s'
              }}
            >
              Proceed to Checkout →
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
      
      {/* Dynamic Checkout component rendered conditionally */}
      <CheckoutModal open={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </>
  );
}
