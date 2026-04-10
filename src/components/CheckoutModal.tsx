import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ open, onClose }: CheckoutModalProps) {
  const { clearCart, subtotal } = useCart();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Hardcode 0 shipping for simplicity
  const total = subtotal; 

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else handleSubmit();
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 2000));
    setIsProcessing(false);
    setStep(4); // Success step
    clearCart();
  };

  const handleClose = () => {
    if (step === 4) setStep(1);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && handleClose()}>
      <DialogContent 
        className="checkout-modal"
        style={{
          maxWidth: '560px', width: '90vw', padding: 0, borderRadius: '24px', border: '2px solid #F59E0B66',
          background: '#FFFBEB', overflow: 'hidden'
        }}
      >
        <DialogTitle className="sr-only">Checkout</DialogTitle>
        <DialogDescription className="sr-only">Complete your order for Johsther Cakes</DialogDescription>
        
        {/* Header */}
        {step < 4 && (
          <div style={{ background: 'linear-gradient(135deg, #92400E, #F59E0B)', padding: '24px 32px' }}>
            <h2 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '1.5rem', color: '#fff', margin: 0 }}>
              Checkout
            </h2>
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ flex: 1, height: 6, borderRadius: 3, background: i <= step ? '#fff' : 'rgba(255,255,255,0.3)', transition: 'background 0.3s' }} />
              ))}
            </div>
            <p style={{ color: '#FEF3C7', fontSize: '0.85rem', marginTop: 8, fontFamily: "'Comic Neue', cursive" }}>
              {step === 1 && 'Step 1: Your Details'}
              {step === 2 && 'Step 2: Delivery & Shipping'}
              {step === 3 && 'Step 3: Payment'}
            </p>
          </div>
        )}

        <div style={{ padding: '32px' }}>
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label htmlFor="checkout-name" style={{ display: 'block', marginBottom: 4, color: '#78350F', fontFamily: "'Baloo 2', cursive", fontWeight: 600 }}>Full Name</label>
                <input id="checkout-name" type="text" placeholder="John Doe" style={inputStyle} />
              </div>
              <div>
                <label htmlFor="checkout-email" style={{ display: 'block', marginBottom: 4, color: '#78350F', fontFamily: "'Baloo 2', cursive", fontWeight: 600 }}>Email</label>
                <input id="checkout-email" type="email" placeholder="john@example.com" style={inputStyle} />
              </div>
              <div>
                <label htmlFor="checkout-phone" style={{ display: 'block', marginBottom: 4, color: '#78350F', fontFamily: "'Baloo 2', cursive", fontWeight: 600 }}>Phone Number</label>
                <input id="checkout-phone" type="tel" placeholder="+254 700 000 000" style={inputStyle} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label htmlFor="checkout-address" style={{ display: 'block', marginBottom: 4, color: '#78350F', fontFamily: "'Baloo 2', cursive", fontWeight: 600 }}>Delivery Address</label>
                <input id="checkout-address" type="text" placeholder="123 Main St, Nairobi" style={inputStyle} />
              </div>
              <div>
                <label htmlFor="checkout-date" style={{ display: 'block', marginBottom: 4, color: '#78350F', fontFamily: "'Baloo 2', cursive", fontWeight: 600 }}>Delivery Date</label>
                <input id="checkout-date" type="date" style={inputStyle} aria-label="Delivery Date" />
              </div>
              <div>
                <label htmlFor="checkout-notes" style={{ display: 'block', marginBottom: 4, color: '#78350F', fontFamily: "'Baloo 2', cursive", fontWeight: 600 }}>Special Instructions</label>
                <textarea id="checkout-notes" rows={3} placeholder="Any message on the cake?" style={{...inputStyle, resize: 'none'}} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ background: '#FEF3C7', padding: '16px', borderRadius: '12px', border: '1px solid #F5E6C8' }}>
                <h4 style={{ margin: '0 0 12px', fontFamily: "'Baloo 2', cursive", color: '#92400E' }}>Order Summary</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#78350F' }}><span>Subtotal</span><span>KES {subtotal.toLocaleString()}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#78350F' }}><span>Delivery</span><span>Free</span></div>
                <hr style={{ border: 'none', borderTop: '1px solid #F5E6C8', margin: '12px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#B45309', fontWeight: 'bold', fontSize: '1.1rem' }}>
                  <span>Total</span><span>KES {total.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <h4 style={{ margin: '0 0 12px', fontFamily: "'Baloo 2', cursive", color: '#92400E' }}>Payment Method</h4>
                <label style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, border: '2px solid #F59E0B', borderRadius: 12, background: '#fff', cursor: 'pointer' }}>
                  <input type="radio" name="payment" defaultChecked style={{ accentColor: '#D97706' }} />
                  <span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 600, color: '#78350F' }}>M-Pesa / Mobile Money</span>
                </label>
              </div>
            </div>
          )}

          {step === 4 && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ width: 80, height: 80, margin: '0 auto 20px', background: 'linear-gradient(135deg, #10B981, #059669)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <h2 style={{ fontFamily: "'Baloo 2', cursive", fontSize: '2rem', color: '#065F46', marginBottom: 8 }}>Order Placed!</h2>
              <p style={{ fontFamily: "'Comic Neue', cursive", color: '#059669', fontSize: '1.05rem', marginBottom: 30 }}>Thank you! Your delicious cake will be prepared with love. We'll send an email with your receipt.</p>
              <button onClick={handleClose} style={{ ...btnStyle, background: '#10B981', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)' }}>
                Back to Home
              </button>
            </div>
          )}

          {/* Nav Buttons */}
          {step < 4 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
              <button 
                onClick={() => step > 1 ? setStep(step - 1) : handleClose()}
                style={{ background: 'transparent', border: 'none', color: '#92400E', fontFamily: "'Baloo 2', cursive", fontWeight: 700, cursor: 'pointer', padding: '10px 16px' }}
              >
                {step === 1 ? 'Cancel' : 'Back'}
              </button>
              <button 
                onClick={handleNext}
                disabled={isProcessing}
                style={{ ...btnStyle, opacity: isProcessing ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: 8 }}
              >
                {isProcessing ? 'Processing...' : step === 3 ? `Pay KES ${total.toLocaleString()}` : 'Continue'}
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

const inputStyle = {
  width: '100%', padding: '12px 16px', border: '1.5px solid #F5E6C8', borderRadius: '12px',
  background: '#fff', fontFamily: "'Comic Neue', cursive", color: '#78350F', outline: 'none',
  fontSize: '1rem', transition: 'border-color 0.2s', boxSizing: 'border-box' as const
};

const btnStyle = {
  background: 'linear-gradient(135deg, #92400E, #B45309)', color: '#fff', border: 'none', 
  padding: '12px 32px', borderRadius: '999px', fontFamily: "'Baloo 2', cursive", fontWeight: 700,
  fontSize: '1.05rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(146, 64, 14, 0.3)',
};
