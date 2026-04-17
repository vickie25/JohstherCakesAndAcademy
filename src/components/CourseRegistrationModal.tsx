import { useState, useEffect } from 'react';
import { X, Check, Smartphone, CreditCard, ShieldCheck, Lock, ArrowRight, User, Mail, Phone, Loader2 } from 'lucide-react';

interface Course {
  id: number;
  name?: string;
  title?: string;
  desc?: string;
  subtitle?: string;
  price: number;
  duration: string;
  lessons: number;
  image?: string;
  image_url?: string;
  features: string[];
  tag: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
}

export default function CourseRegistrationModal({ isOpen, onClose, course }: ModalProps) {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mpesa'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [visibleElements, setVisibleElements] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setVisibleElements(0);
      const timers = [100, 200, 300, 400, 500].map((t, i) => 
        setTimeout(() => setVisibleElements(i + 1), t)
      );
      return () => timers.forEach(clearTimeout);
    }
  }, [isOpen, step]);

  if (!isOpen || !course) return null;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const handlePay = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill in all details');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch('http://localhost:5000/api/course/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          course_id: course.id,
          course_name: course.name || course.title || 'Academy Course'
        })
      });

      const data = await response.json();
      if (data.success) {
        setStep(3);
      } else {
        alert(data.message || 'Enrollment failed. Please try again.');
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      alert('Connection error. Please check if the server is running.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getVisibility = (index: number) => visibleElements >= index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-amber-950/40 backdrop-blur-md transition-opacity duration-500"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div 
        className="relative w-full max-w-xl bg-white/95 backdrop-blur-2xl rounded-[40px] border-2 border-amber-200 shadow-2xl overflow-hidden animate-[modalEnter_0.6s_cubic-bezier(0.16,1,0.3,1)] flex flex-col"
        style={{ maxHeight: 'calc(100vh - 40px)' }}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-[60] w-10 h-10 rounded-full bg-amber-100/50 flex items-center justify-center text-amber-900 hover:bg-amber-100 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-100 z-50">
          <div 
            className="h-full bg-amber-500 transition-all duration-700 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {step < 3 ? (
          <>
            {/* Header - Fixed */}
            <div className={`p-8 md:p-12 pb-4 shrink-0 transition-all duration-700 ${getVisibility(1)}`}>
              <div className="flex items-center gap-3 text-amber-600 mb-2">
                <ShieldCheck size={20} />
                <span className="text-xs font-bold uppercase tracking-widest">Secure Course Enrollment</span>
              </div>
              <h2 className="text-3xl font-['Baloo_2'] font-bold text-amber-950">
                {step === 1 ? 'Your Information' : 'Payment Details'}
              </h2>
              <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-amber-900/50 uppercase font-bold tracking-tight">Enrolling in:</p>
                  <p className="font-['Baloo_2'] font-bold text-amber-900 line-clamp-1">{course.name || course.title}</p>
                  <p className="text-xs text-amber-600 mt-1">{course.duration} · {course.lessons} Lessons</p>
                </div>
                <div className="text-right text-amber-950 font-bold whitespace-nowrap ml-4">
                  KES {course.price.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto px-8 md:px-12 pb-6 custom-scrollbar">
              {step === 1 && (
                <div className={`space-y-6 transition-all duration-700 delay-100 ${getVisibility(2)}`}>
                  <div className="relative group">
                    <label className="block text-xs font-bold text-amber-950 uppercase mb-2 ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400" size={18} />
                      <input 
                        type="text" 
                        placeholder="e.g. Duran Clayton"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full h-14 pl-12 pr-4 bg-amber-50/50 border-2 border-amber-100 rounded-2xl outline-none focus:border-amber-500 focus:bg-white transition-all font-medium"
                      />
                    </div>
                  </div>
                  <div className="relative group">
                    <label className="block text-xs font-bold text-amber-950 uppercase mb-2 ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400" size={18} />
                      <input 
                        type="email" 
                        placeholder="duran@example.com"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full h-14 pl-12 pr-4 bg-amber-50/50 border-2 border-amber-100 rounded-2xl outline-none focus:border-amber-500 focus:bg-white transition-all font-medium"
                      />
                    </div>
                  </div>
                  <div className="relative group">
                    <label className="block text-xs font-bold text-amber-950 uppercase mb-2 ml-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400" size={18} />
                      <input 
                        type="tel" 
                        placeholder="+254 XXX XXX XXX"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        className="w-full h-14 pl-12 pr-4 bg-amber-50/50 border-2 border-amber-100 rounded-2xl outline-none focus:border-amber-500 focus:bg-white transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className={`space-y-6 transition-all duration-700 ${getVisibility(2)}`}>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setPaymentMethod('card')}
                      className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${paymentMethod === 'card' ? 'border-amber-500 bg-amber-50' : 'border-amber-100 bg-white'}`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${paymentMethod === 'card' ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-500'}`}>
                        <CreditCard size={24} />
                      </div>
                      <span className="font-bold text-amber-950">Bank Card</span>
                    </button>
                    <button 
                      onClick={() => setPaymentMethod('mpesa')}
                      className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${paymentMethod === 'mpesa' ? 'border-amber-500 bg-amber-50' : 'border-amber-100 bg-white'}`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${paymentMethod === 'mpesa' ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-500'}`}>
                        <Smartphone size={24} />
                      </div>
                      <span className="font-bold text-amber-950">M-Pesa</span>
                    </button>
                  </div>

                  {paymentMethod === 'card' ? (
                    <div className="space-y-4">
                      <div className="input-field">
                        <label className="block text-[10px] font-bold text-amber-950 uppercase mb-2 ml-1">Card Number</label>
                        <input type="text" placeholder="0000 0000 0000 0000" className="w-full h-12 px-4 bg-amber-50/50 border-2 border-amber-100 rounded-xl font-medium" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="input-field">
                          <label className="block text-[10px] font-bold text-amber-950 uppercase mb-2 ml-1">Expiry</label>
                          <input type="text" placeholder="MM/YY" className="w-full h-12 px-4 bg-amber-50/50 border-2 border-amber-100 rounded-xl font-medium" />
                        </div>
                        <div className="input-field">
                          <label className="block text-[10px] font-bold text-amber-950 uppercase mb-2 ml-1">CVC</label>
                          <input type="text" placeholder="123" className="w-full h-12 px-4 bg-amber-50/50 border-2 border-amber-100 rounded-xl font-medium" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 bg-amber-100/50 rounded-2xl border-2 border-amber-100 border-dashed">
                      <div className="flex items-center gap-3 mb-4">
                        <Smartphone className="text-amber-600" size={20} />
                        <span className="font-bold text-amber-900">M-Pesa Express</span>
                      </div>
                      <p className="text-sm text-amber-900/60 leading-relaxed mb-4 font-medium">
                        A prompt will be sent to your phone. Simply enter your M-Pesa PIN.
                      </p>
                      <input 
                        type="tel" 
                        placeholder="+254 700 000 000" 
                        className="w-full h-12 px-4 bg-white border-2 border-amber-200 rounded-xl font-medium"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer - Sticky */}
            <div className={`p-8 pt-4 border-t border-amber-100 bg-white/50 shrink-0 transition-all duration-700 ${getVisibility(3)}`}>
              {step === 1 ? (
                <button 
                  onClick={() => setStep(2)}
                  className="w-full h-16 bg-amber-950 text-white rounded-2xl font-['Baloo_2'] font-bold text-lg flex items-center justify-center gap-2 hover:bg-amber-900 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-amber-900/20"
                >
                  Continue to Payment
                  <ArrowRight size={20} />
                </button>
              ) : (
                <div className="space-y-4">
                  <button 
                    onClick={handlePay}
                    disabled={isProcessing}
                    className="w-full h-16 bg-amber-500 text-amber-950 rounded-2xl font-['Baloo_2'] font-bold text-lg flex items-center justify-center gap-2 hover:bg-amber-400 hover:scale-[1.02] shadow-xl shadow-amber-500/20 active:scale-95 disabled:opacity-50 transition-all"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="animate-spin" size={24} />
                        Processing...
                      </>
                    ) : (
                      <>
                        Confirm and Pay KES {course.price.toLocaleString()}
                        <ArrowRight size={20} />
                      </>
                    )}
                  </button>
                  <p className="text-center text-[10px] text-amber-900/40 flex items-center justify-center gap-2 font-bold uppercase tracking-wider">
                    <Lock size={12} />
                    Secured by 256-bit SSL Encryption
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Success View */
          <div className="p-8 md:p-12 overflow-y-auto flex-1 flex flex-col justify-center animate-[successPop_0.6s_cubic-bezier(0.16,1,0.3,1)]">
            <div className="py-8 text-center space-y-8">
              <div className="relative mx-auto w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/30">
                <Check size={48} className="text-white" strokeWidth={4} />
                <div className="absolute inset-0 rounded-full animate-ping bg-green-500/30"></div>
              </div>

              <div className="space-y-2">
                <h2 className="text-4xl font-['Baloo_2'] font-extrabold text-amber-950">Enrollment Complete!</h2>
                <p className="font-medium text-amber-900/60 px-6">
                  You're officially enrolled in <span className="text-amber-600 font-bold">{course.name || course.title}</span>! 
                  A confirmation email has been sent.
                </p>
              </div>

              <div className="p-6 bg-amber-50 border-2 border-amber-100 rounded-3xl text-left space-y-4">
                <div className="flex items-center justify-between border-b border-amber-200 pb-3">
                  <span className="text-xs font-bold text-amber-950 uppercase">Student</span>
                  <span className="font-bold text-amber-900 line-clamp-1">{formData.name}</span>
                </div>
                <div className="flex items-center justify-between border-b border-amber-200 pb-3">
                  <span className="text-xs font-bold text-amber-950 uppercase">Course</span>
                  <span className="font-bold text-amber-900">{course.name || course.title}</span>
                </div>
                <div className="flex items-center justify-between border-b border-amber-200 pb-3">
                  <span className="text-xs font-bold text-amber-950 uppercase">Duration</span>
                  <span className="font-bold text-amber-900">{course.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-950 uppercase">Enrollment ID</span>
                  <span className="font-bold text-amber-900">#JC-{Math.floor(Math.random() * 90000) + 10000}</span>
                </div>
              </div>

              <button 
                onClick={onClose}
                className="w-full h-14 bg-amber-950 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-amber-900 transition-all"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes modalEnter {
          from { opacity: 0; transform: scale(0.9) translateY(40px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes successPop {
          0% { opacity: 0; transform: scale(0.8); }
          50% { transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #fde68a;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
