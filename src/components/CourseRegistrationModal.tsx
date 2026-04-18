import { useState, useEffect } from 'react';
import { X, Check, ShieldCheck, ArrowRight, User, Mail, Phone, Loader2, GraduationCap } from 'lucide-react';

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
  // ✅ All hooks declared at top level — no conditional hooks
  const [step, setStep] = useState<1 | 2>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [visibleElements, setVisibleElements] = useState<number>(0);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState({ name: '', email: '', phone: '' });

  const safeCourse = {
    id: course?.id,
    name: course?.name || course?.title || 'Online Course',
    price: course?.price ?? 0,
    duration: course?.duration || 'Self-paced',
    lessons: course?.lessons || 0,
  };

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setFormData({ name: '', email: '', phone: '' });
      setErrors({ name: '', email: '', phone: '' });
      setVisibleElements(0);
      const timers = [100, 200, 300, 400, 500].map((t, i) =>
        setTimeout(() => setVisibleElements(i + 1), t)
      );
      return () => timers.forEach(clearTimeout);
    }
  }, [isOpen]);

  if (!isOpen || !course) return null;

  const validate = () => {
    const newErrors = { name: '', email: '', phone: '' };
    let valid = true;
    if (!formData.name.trim()) { newErrors.name = 'Full name is required'; valid = false; }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) { newErrors.email = 'Valid email is required'; valid = false; }
    if (!formData.phone.trim()) { newErrors.phone = 'Phone number is required'; valid = false; }
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsProcessing(true);
    try {
      const response = await fetch('http://localhost:5000/api/academy/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          course_name: safeCourse.name,
          batch_id: null,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setStep(2);
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

  const getVisibility = (index: number) =>
    visibleElements >= index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8';

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
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-100 z-50">
          <div
            className="h-full bg-amber-500 transition-all duration-700 ease-out"
            style={{ width: step === 1 ? '50%' : '100%' }}
          />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-[60] w-10 h-10 rounded-full bg-amber-100/50 flex items-center justify-center text-amber-900 hover:bg-amber-100 transition-colors"
        >
          <X size={20} />
        </button>

        {step === 1 ? (
          <>
            {/* Header */}
            <div className={`p-8 md:p-12 pb-4 shrink-0 transition-all duration-700 ${getVisibility(1)}`}>
              <div className="flex items-center gap-3 text-amber-600 mb-2">
                <ShieldCheck size={20} />
                <span className="text-xs font-bold uppercase tracking-widest">Secure Course Enrollment</span>
              </div>
              <h2 className="text-3xl font-['Baloo_2'] font-bold text-amber-950">Your Details</h2>
              <p className="text-sm text-amber-900/50 mt-1 font-medium">Fill in your info to reserve your spot.</p>

              {/* Course summary pill */}
              <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-amber-900/50 uppercase font-bold tracking-tight">Enrolling in:</p>
                  <p className="font-['Baloo_2'] font-bold text-amber-900 line-clamp-1">{safeCourse.name}</p>
                  <p className="text-xs text-amber-600 mt-1">{safeCourse.duration} · {safeCourse.lessons} Lessons</p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-xs text-amber-900/40 uppercase font-bold">Fee</p>
                  <p className="font-['Baloo_2'] font-extrabold text-amber-950">KES {safeCourse.price.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto px-8 md:px-12 pb-6 custom-scrollbar">
              <div className={`space-y-5 transition-all duration-700 delay-100 ${getVisibility(2)}`}>

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-amber-950 uppercase mb-2 ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400" size={18} />
                    <input
                      type="text"
                      placeholder="e.g. Jane Wanjiku"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full h-14 pl-12 pr-4 bg-amber-50/50 border-2 rounded-2xl outline-none focus:bg-white transition-all font-medium ${errors.name ? 'border-red-400 focus:border-red-500' : 'border-amber-100 focus:border-amber-500'}`}
                    />
                  </div>
                  {errors.name && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-amber-950 uppercase mb-2 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400" size={18} />
                    <input
                      type="email"
                      placeholder="jane@example.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full h-14 pl-12 pr-4 bg-amber-50/50 border-2 rounded-2xl outline-none focus:bg-white transition-all font-medium ${errors.email ? 'border-red-400 focus:border-red-500' : 'border-amber-100 focus:border-amber-500'}`}
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-amber-950 uppercase mb-2 ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400" size={18} />
                    <input
                      type="tel"
                      placeholder="+254 7XX XXX XXX"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full h-14 pl-12 pr-4 bg-amber-50/50 border-2 rounded-2xl outline-none focus:bg-white transition-all font-medium ${errors.phone ? 'border-red-400 focus:border-red-500' : 'border-amber-100 focus:border-amber-500'}`}
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.phone}</p>}
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className={`p-8 pt-4 border-t border-amber-100 bg-white/50 shrink-0 transition-all duration-700 ${getVisibility(3)}`}>
              <button
                onClick={handleSubmit}
                disabled={isProcessing}
                className="w-full h-16 bg-[#78350F] text-white rounded-2xl font-['Baloo_2'] font-bold text-lg flex items-center justify-center gap-2 hover:bg-amber-800 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-amber-900/20 disabled:opacity-60"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Enrollment
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
              <p className="text-center text-[10px] text-amber-900/40 mt-3 font-bold uppercase tracking-wider">
                Our team will reach out within 24hrs to confirm
              </p>
            </div>
          </>
        ) : (
          /* ── Success Screen ── */
          <div className="p-8 md:p-12 overflow-y-auto flex-1 flex flex-col justify-center animate-[successPop_0.6s_cubic-bezier(0.16,1,0.3,1)]">
            <div className="py-8 text-center space-y-8">
              {/* Green tick */}
              <div className="relative mx-auto w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/30">
                <Check size={48} className="text-white" strokeWidth={4} />
                <div className="absolute inset-0 rounded-full animate-ping bg-green-500/30" />
              </div>

              <div className="space-y-2">
                <h2 className="text-4xl font-['Baloo_2'] font-extrabold text-amber-950">You're Enrolled!</h2>
                <p className="font-medium text-amber-900/60 px-6">
                  Your spot in <span className="text-amber-600 font-bold">{safeCourse.name}</span> has been reserved.
                  We'll reach out to confirm your enrollment.
                </p>
              </div>

              {/* Summary card */}
              <div className="p-6 bg-amber-50 border-2 border-amber-100 rounded-3xl text-left space-y-4">
                <div className="flex items-center justify-between border-b border-amber-200 pb-3">
                  <span className="text-xs font-bold text-amber-950 uppercase">Student</span>
                  <span className="font-bold text-amber-900">{formData.name}</span>
                </div>
                <div className="flex items-center justify-between border-b border-amber-200 pb-3">
                  <span className="text-xs font-bold text-amber-950 uppercase">Course</span>
                  <span className="font-bold text-amber-900 text-right max-w-[60%]">{safeCourse.name}</span>
                </div>
                <div className="flex items-center justify-between border-b border-amber-200 pb-3">
                  <span className="text-xs font-bold text-amber-950 uppercase">Email</span>
                  <span className="font-bold text-amber-900">{formData.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-950 uppercase">Enrollment ID</span>
                  <span className="font-bold text-amber-900">#JC-{Math.floor(Math.random() * 90000) + 10000}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 h-14 bg-amber-950 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-amber-900 transition-all"
                >
                  <GraduationCap size={20} />
                  Done
                </button>
              </div>
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
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #fde68a; border-radius: 10px; }
      `}</style>
    </div>
  );
}
