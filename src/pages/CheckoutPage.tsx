import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigation } from '../context/NavigationContext';
import { 
  ArrowLeft, 
  CreditCard, 
  Smartphone, 
  Check, 
  ShieldCheck, 
  Award, 
  Lock, 
  Truck, 
  Clock,
  ChevronRight
} from 'lucide-react';

export default function CheckoutPage() {
  const { items, subtotal, clearCart, setIsCartOpen } = useCart();
  const { goToHome } = useNavigation();
  const [step, setStep] = useState(2); // Start directly at payment as requested
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mpesa'>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const discount = 0;
  const gst = subtotal * 0.16; // 16% VAT
  const total = subtotal + gst - discount;

  const handlePay = async () => {
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsProcessing(false);
    setStep(3);
    clearCart();
  };

  const handleBackToCart = () => {
    goToHome();
    setTimeout(() => setIsCartOpen(true), 100); 
  };

  return (
    <div className="checkout-page-root" style={{ minHeight: '100vh', background: '#FFFFFF', display: 'flex', flexDirection: 'column', color: '#111827' }}>
      
      {step < 3 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 4fr) 6fr', flex: 1 }}>
          
          {/* LEFT COLUMN: Summary & Trust */}
          <div style={{ background: '#FEFCE8', borderRight: '1px solid #FEF3C7', padding: '60px 48px', position: 'sticky', top: 0, height: '100vh', display: 'flex', flexDirection: 'column' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #F59E0B, #D97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2C10.5 2 9.5 3 9 4C7.5 3.5 6 4.5 6 6H18C18 4.5 16.5 3.5 15 4C14.5 3 13.5 2 12 2Z" fill="#FFF"/><rect x="4" y="8" width="16" height="3" rx="1.5" fill="#FFF"/><path d="M4 11h16v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7z" fill="rgba(255,255,255,0.2)" stroke="#FFF" strokeWidth="0.5"/></svg>
              </div>
              <div>
                <h1 style={{ fontFamily: "'Baloo 2', cursive", fontSize: '1.5rem', fontWeight: 800, color: '#92400E', margin: 0 }}>Review Order</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: '#B45309', fontWeight: 600 }}>
                  <ShieldCheck size={14} /> SECURE CHECKOUT
                </div>
              </div>
            </div>

            <button onClick={handleBackToCart} className="btn-back" style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: '#92400E', fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', padding: 0, marginBottom: 40, width: 'fit-content' }}>
              <ArrowLeft size={18} /> Back to cart
            </button>

            <div style={{ flex: 1, overflowY: 'auto', marginBottom: 30, paddingRight: 10 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {items.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: 16, alignItems: 'center', background: '#fff', padding: '12px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(146, 64, 14, 0.05)', border: '1px solid #FEF3C7' }}>
                    <div style={{ position: 'relative' }}>
                      <img src={item.image} alt={item.name} style={{ width: 64, height: 64, borderRadius: 12, objectFit: 'cover' }} />
                      <span style={{ position: 'absolute', top: -8, right: -8, minWidth: 22, height: 22, background: '#92400E', color: '#fff', boxSizing: 'border-box', border: '2px solid #fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700 }}>
                        {item.quantity}
                      </span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, color: '#111827', margin: '0 0 2px', fontSize: '0.95rem' }}>{item.name}</p>
                      <p style={{ fontFamily: "'Inter', sans-serif", color: '#6B7280', margin: 0, fontSize: '0.75rem' }}>Freshly Baked & Handcrafted</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 750, color: '#111827', margin: 0, fontSize: '1rem' }}>KES {item.priceNum.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 40, borderTop: '1px solid #E5E7EB', paddingTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Inter', sans-serif", color: '#4B5563', fontSize: '0.9rem' }}>
                    <span>Subtotal</span><span>KES {subtotal.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Inter', sans-serif", color: '#4B5563', fontSize: '0.9rem' }}>
                    <span>Estimated Shipping</span><span style={{ color: '#059669', fontWeight: 600 }}>FREE</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Inter', sans-serif", color: '#4B5563', fontSize: '0.9rem' }}>
                    <span>Taxes (GST 16%)</span><span>KES {gst.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Inter', sans-serif", color: '#111827', fontSize: '1.5rem', fontWeight: 800, marginTop: 12 }}>
                    <span>Total</span><span>KES {total.toLocaleString()}</span>
                  </div>
                  <div style={{ background: '#F59E0B15', padding: '12px', borderRadius: '12px', border: '1px dashed #F59E0B', marginTop: 8 }}>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#92400E', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Clock size={14} /> Next Delivery Window: Today, 3PM - 6PM
                    </p>
                  </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div style={{ borderTop: '1px solid #FEF3C7', paddingTop: 30, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#fff', border: '1px solid #FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', flexShrink: 0 }}>
                  <Lock size={20} />
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '0.85rem', color: '#111827' }}>100% Secure Checkout</p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#6B7280' }}>SSL Encrypted Payment</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#fff', border: '1px solid #FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B', flexShrink: 0 }}>
                  <Award size={20} />
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '0.85rem', color: '#111827' }}>Baker Certified</p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#6B7280' }}>Johsther Quality Label</p>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Interactive Form */}
          <div style={{ padding: '60px 80px', height: '100vh', overflowY: 'auto', background: '#fff' }}>
            
            {/* Elegant Stepper */}
            <div className="stepper-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 70, maxWidth: 500, margin: '0 auto 70px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, flex: 1 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: step > 1 ? '#F59E0B' : '#FFFFFF', border: '2px solid #F59E0B', color: step > 1 ? '#fff' : '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800, transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                  {step > 1 ? <Check size={16} strokeWidth={3} /> : '1'}
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: step >= 1 ? '#92400E' : '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Details</span>
              </div>
              <div style={{ width: '40px', height: '2px', background: step >= 2 ? '#F59E0B' : '#E5E7EB', transform: 'translateY(-12px)', transition: 'background 0.3s' }} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, flex: 1 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: step > 2 ? '#F59E0B' : (step === 2 ? '#F59E0B' : '#FFFFFF'), border: '2px solid ' + (step >= 2 ? '#F59E0B' : '#E5E7EB'), color: step >= 2 ? '#fff' : '#9CA3AF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800, transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: step === 2 ? '0 0 0 4px #F59E0B22' : 'none' }}>
                  {step > 2 ? <Check size={16} strokeWidth={3} /> : '2'}
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: step >= 2 ? '#92400E' : '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Payment</span>
              </div>
              <div style={{ width: '40px', height: '2px', background: step >= 3 ? '#F59E0B' : '#E5E7EB', transform: 'translateY(-12px)', transition: 'background 0.3s' }} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, flex: 1 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: step >= 3 ? '#F59E0B' : '#FFFFFF', border: '2px solid ' + (step >= 3 ? '#F59E0B' : '#E5E7EB'), color: step >= 3 ? '#fff' : '#9CA3AF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800 }}>
                  3
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: step >= 3 ? '#92400E' : '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Confirm</span>
              </div>
            </div>

            {/* STEP 1: SHIPPING (Included for completeness) */}
            {step === 1 && (
              <div className="flow-step-content" style={{ maxWidth: 480, margin: '0 auto', animation: 'fadeInScale 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                <h2 style={{ fontFamily: "'Baloo 2', cursive", fontSize: '2rem', color: '#111827', marginBottom: 12, fontWeight: 800 }}>Delivery Details</h2>
                <p style={{ color: '#6B7280', fontSize: '0.95rem', marginBottom: 40, fontFamily: "'Inter', sans-serif" }}>Where should we send your delicious treats?</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <div className="input-field">
                      <label className="premium-label">First Name</label>
                      <input type="text" className="premium-input" placeholder="e.g. Duran" />
                    </div>
                    <div className="input-field">
                      <label className="premium-label">Last Name</label>
                      <input type="text" className="premium-input" placeholder="e.g. Clayton" />
                    </div>
                  </div>
                  <div className="input-field">
                    <label className="premium-label">Delivery Address</label>
                    <div style={{ position: 'relative' }}>
                      <input type="text" className="premium-input" placeholder="123 Sweet Street, Nairobi" style={{ paddingLeft: '44px' }} />
                      <Truck style={{ position: 'absolute', left: 16, top: 18, color: '#9CA3AF' }} size={18} />
                    </div>
                  </div>
                  <div className="input-field">
                    <label className="premium-label">Phone Number</label>
                    <input type="tel" className="premium-input" placeholder="+254 XXX XXX XXX" />
                  </div>

                  <button onClick={() => setStep(2)} className="primary-fab-btn">
                    Continue to Payment <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: PAYMENT (Approved Start State) */}
            {step === 2 && (
              <div className="flow-step-content" style={{ maxWidth: 480, margin: '0 auto', animation: 'fadeInScale 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                <h2 style={{ fontFamily: "'Baloo 2', cursive", fontSize: '2.4rem', color: '#111827', marginBottom: 8, fontWeight: 800 }}>Payment Method</h2>
                <p style={{ color: '#6B7280', fontSize: '0.98rem', marginBottom: 44, fontFamily: "'Inter', sans-serif" }}>Choose your preferred way to pay securely.</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    {/* Payment Radio Cards */}
                    <div 
                      onClick={() => setPaymentMethod('card')} 
                      style={{ 
                        padding: '24px 20px', borderRadius: '20px', border: '2px solid ' + (paymentMethod === 'card' ? '#F59E0B' : '#E5E7EB'),
                        background: paymentMethod === 'card' ? '#FFFBEB' : '#fff', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 16, transition: 'all 0.3s ease',
                        boxShadow: paymentMethod === 'card' ? '0 10px 20px rgba(245, 158, 11, 0.1)' : 'none', position: 'relative'
                      }}
                    >
                      <div style={{ width: 44, height: 44, borderRadius: '12px', background: paymentMethod === 'card' ? '#F59E0B' : '#F3F4F6', color: paymentMethod === 'card' ? '#fff' : '#6B7280', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                        <CreditCard size={24} />
                      </div>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '1rem', color: paymentMethod === 'card' ? '#92400E' : '#4B5563' }}>Bank Card</span>
                      {paymentMethod === 'card' && <div style={{ position: 'absolute', top: 12, right: 12, width: 22, height: 22, background: '#F59E0B', borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={14} strokeWidth={4} /></div>}
                    </div>

                    <div 
                      onClick={() => setPaymentMethod('mpesa')} 
                      style={{ 
                        padding: '24px 20px', borderRadius: '20px', border: '2px solid ' + (paymentMethod === 'mpesa' ? '#F59E0B' : '#E5E7EB'),
                        background: paymentMethod === 'mpesa' ? '#FFFBEB' : '#fff', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 16, transition: 'all 0.3s ease',
                        boxShadow: paymentMethod === 'mpesa' ? '0 10px 20px rgba(245, 158, 11, 0.1)' : 'none', position: 'relative'
                      }}
                    >
                      <div style={{ width: 44, height: 44, borderRadius: '12px', background: paymentMethod === 'mpesa' ? '#F59E0B' : '#F3F4F6', color: paymentMethod === 'mpesa' ? '#fff' : '#6B7280', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                        <Smartphone size={24} />
                      </div>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '1rem', color: paymentMethod === 'mpesa' ? '#92400E' : '#4B5563' }}>M-Pesa</span>
                      {paymentMethod === 'mpesa' && <div style={{ position: 'absolute', top: 12, right: 12, width: 22, height: 22, background: '#F59E0B', borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={14} strokeWidth={4} /></div>}
                    </div>
                  </div>

                  {paymentMethod === 'card' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, animation: 'fadeInScale 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                      <div className="input-field">
                        <label className="premium-label">Card Number</label>
                        <div style={{ position: 'relative' }}>
                          <input type="text" className="premium-input" placeholder="0000 0000 0000 0000" style={{ paddingLeft: '44px' }} />
                          <CreditCard style={{ position: 'absolute', left: 16, top: 18, color: '#9CA3AF' }} size={18} />
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                        <div className="input-field">
                          <label className="premium-label">Expiry Date</label>
                          <input type="text" className="premium-input" placeholder="MM / YY" />
                        </div>
                        <div className="input-field">
                          <label className="premium-label">CVV / CVC</label>
                          <input type="text" className="premium-input" placeholder="123" />
                        </div>
                      </div>
                      <div className="input-field">
                        <label className="premium-label">Cardholder Name</label>
                        <input type="text" className="premium-input" placeholder="Duran Clayton" />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'mpesa' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, animation: 'fadeInScale 0.4s ease' }}>
                       <div style={{ padding: '24px', background: '#F3F4F6', borderRadius: '20px', border: '1px solid #E5E7EB' }}>
                         <p style={{ margin: '0 0 10px', fontFamily: "'Inter', sans-serif", fontWeight: 700, color: '#111827', fontSize: '1.05rem' }}>M-Pesa Express (STK Push)</p>
                         <p style={{ margin: 0, fontFamily: "'Inter', sans-serif", color: '#4B5563', fontSize: '0.88rem', lineHeight: 1.6 }}>Enter your phone number below. We will send a prompt directly to your phone to authorize the payment.</p>
                       </div>
                       <div className="input-field">
                        <label className="premium-label">M-Pesa Phone Number</label>
                        <input type="tel" className="premium-input" placeholder="0757 942121" />
                      </div>
                    </div>
                  )}

                  <div style={{ marginTop: 12 }}>
                      <button 
                        onClick={handlePay} 
                        disabled={isProcessing} 
                        className="primary-fab-btn"
                        style={{ height: '62px', fontSize: '1.2rem', background: '#111827' }}
                      >
                        {isProcessing ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div className="spinner"></div> Processing...
                          </div>
                        ) : (
                          `Confirm & Pay KES ${total.toLocaleString()}`
                        )}
                      </button>
                      <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#9CA3AF', marginTop: 16 }}>
                        <Lock size={12} style={{ marginRight: 4 }} /> Payments are secured by international PCI-DSS standards.
                      </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* STEP 3: SUCCESS */
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 40px', textAlign: 'center', background: 'radial-gradient(circle at center, #FFFFFF 0%, #FAFAFA 100%)' }}>
          <div className="success-check-anim" style={{ width: 100, height: 100, margin: '0 auto 40px', background: 'linear-gradient(135deg, #10B981, #059669)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px rgba(5, 150, 105, 0.2)' }}>
            <Check size={50} color="white" strokeWidth={4} />
          </div>
          <h2 style={{ fontFamily: "'Baloo 2', cursive", fontSize: '3rem', color: '#111827', marginBottom: 12, fontWeight: 800 }}>Order Received!</h2>
          <p style={{ fontFamily: "'Inter', sans-serif", color: '#4B5563', fontSize: '1.2rem', marginBottom: 50, maxWidth: 500, lineHeight: 1.6 }}>Thank you for choosing Johsther Cakes. Your order is being prepared with love and will arrive at your doorstep shortly.</p>
          <div style={{ display: 'flex', gap: 16 }}>
            <button onClick={goToHome} style={{ background: '#111827', color: '#fff', border: 'none', padding: '18px 40px', borderRadius: '16px', fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.3s' }}>
               Back to Home
            </button>
            <button style={{ background: '#fff', color: '#111827', border: '2px solid #E5E7EB', padding: '18px 40px', borderRadius: '16px', fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.3s' }}>
               View Receipt
            </button>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap');

        .premium-label {
           display: block;
           font-family: 'Inter', sans-serif;
           font-weight: 700;
           color: #111827;
           margin-bottom: 12px;
           font-size: 0.9rem;
           text-transform: uppercase;
           letter-spacing: 0.03em;
        }

        .premium-input {
           width: 100%;
           height: 54px;
           padding: 14px 20px;
           border: 2px solid #E5E7EB;
           border-radius: 14px;
           background: #FAFAFA;
           font-family: 'Inter', sans-serif;
           color: #111827;
           outline: none;
           font-size: 1rem;
           transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
           box-sizing: border-box;
        }

        .premium-input:focus {
           border-color: #F59E0B;
           background: #fff;
           box-shadow: 0 0 0 4px #F59E0B22;
        }

        .premium-input::placeholder {
           color: #9CA3AF;
        }

        .primary-fab-btn {
           width: 100%;
           padding: 20px;
           background: linear-gradient(135deg, #92400E, #B45309);
           color: #fff;
           border: none;
           border-radius: 18px;
           font-family: 'Baloo 2', cursive;
           font-weight: 800;
           font-size: 1.15rem;
           cursor: pointer;
           transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
           box-shadow: 0 10px 25px rgba(146, 64, 14, 0.25);
           display: flex;
           justify-content: center;
           align-items: center;
           gap: 12px;
        }

        .primary-fab-btn:hover:not(:disabled) {
           transform: translateY(-4px);
           box-shadow: 0 15px 30px rgba(146, 64, 14, 0.35);
        }

        .primary-fab-btn:active:not(:disabled) {
           transform: translateY(-1px);
        }

        .primary-fab-btn:disabled {
           opacity: 0.8;
           cursor: not-allowed;
        }

        .btn-back:hover {
           transform: translateX(-4px);
           opacity: 0.8;
        }

        .spinner {
          width: 22px;
          height: 22px;
          border: 3px solid rgba(255,255,255,0.3);
          border-top: 3px solid white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes fadeInScale {
           from { opacity: 0; transform: scale(0.98) translateY(10px); }
           to { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes successPop {
          0% { transform: scale(0.8); opacity: 0; }
          60% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }

        .success-check-anim {
          animation: successPop 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @media (max-width: 1024px) {
           .checkout-page-root > div:first-child {
              grid-template-columns: 1fr !important;
           }
           [style*="position: sticky"] {
              position: static !important;
              height: auto !important;
              border-right: none !important;
              border-bottom: 1px solid #E5E7EB;
           }
           [style*="height: 100vh"] {
              height: auto !important;
           }
        }
      `}</style>
    </div>
  );
}
