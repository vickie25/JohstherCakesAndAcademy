import { useEffect, useState } from 'react';
import { Heart, MapPin, Phone, Mail, Star, Quote, Award, Users, ChevronRight } from 'lucide-react';

export default function AboutPage() {
  const [visibleElements, setVisibleElements] = useState<number>(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Staggered entrance animation like other pages
    const timers = [100, 200, 300, 400, 500, 600].map((t, i) => 
      setTimeout(() => setVisibleElements(i + 1), t)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const getVisibility = (index: number) => visibleElements >= index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10';

  const reviews = [
    { name: 'Sarah M.', role: 'Home Baker', text: "Johsther Academy changed my life! The instructors are so patient and knowledgeable.", stars: 5 },
    { name: 'David K.', role: 'Corporate Client', text: "The most professional catering service in Nairobi. Their cakes are literal art pieces.", stars: 5 },
    { name: 'Grace W.', role: 'Beginner Student', text: "I never thought I could bake a cupcake, let alone a three-tier wedding cake. Thank you, Johsther!", stars: 5 },
    { name: 'Kevin L.', role: 'Foodie', text: "The Red Velvet is to die for. I order every weekend and I'm never disappointed.", stars: 4 },
  ];

  return (
    <div className="min-h-screen bg-[#FFFBEB] pt-32 pb-20 overflow-x-hidden">
      
      {/* Hero Section */}
      <section className={`max-w-7xl mx-auto px-6 mb-24 text-center transition-all duration-1000 ease-out ${getVisibility(1)}`}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 font-bold mb-6">
          <Heart size={18} className="fill-amber-700" />
          <span>Our Sweet Journey</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-['Baloo_2'] font-extrabold text-[#78350F] mb-6 leading-tight">
          The Heart Behind <br />
          The <span className="text-amber-500 underline decoration-amber-200">Heat</span>
        </h1>
        <p className="max-w-3xl mx-auto text-xl text-amber-900/70 font-['Comic_Neue'] leading-relaxed">
          At Johsther Cakes & Academy, we don't just bake; we create memories. What started as a small kitchen project in Nairobi has blossomed into a premier destination for culinary excellence and community.
        </p>
      </section>

      {/* Story Section */}
      <section className={`max-w-7xl mx-auto px-6 mb-32 grid md:grid-cols-2 gap-16 items-center transition-all duration-1000 delay-100 ease-out ${getVisibility(2)}`}>
        <div className="relative">
          <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full -z-10 scale-110 translate-x-10"></div>
          <div className="rounded-[40px] overflow-hidden border-4 border-white shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
             <img src="/academy-class.png" alt="Our Kitchen" className="w-full h-[500px] object-cover" />
          </div>
          <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-3xl shadow-xl border-2 border-amber-100 hidden md:block animate-bounce-slow">
             <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-amber-500 rounded-full flex items-center justify-center text-white">
                   <Award size={28} />
                </div>
                <div>
                   <p className="text-3xl font-['Baloo_2'] font-extrabold text-[#78350F]">10+ Years</p>
                   <p className="text-amber-900/50 font-bold uppercase text-xs tracking-widest">of Sweet Success</p>
                </div>
             </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-4xl font-['Baloo_2'] font-bold text-[#78350F]">Crafting Sweet Perfection</h2>
          <p className="text-lg text-amber-900/80 font-['Comic_Neue'] leading-relaxed">
             Founded by a team of passionate pastry chefs, Johsther was built on a simple philosophy: **Quality without compromise.** Every egg cracked, every whisk turned, and every fondant flower sculpted is a testament to our dedication to the craft.
          </p>
          <p className="text-lg text-amber-900/80 font-['Comic_Neue'] leading-relaxed">
             Our Nairobi campus serves as a thriving hub where aspiring bakers transform into masters. We believe that with the right tools and guidance, anyone can master the art of baking.
          </p>
          <div className="grid grid-cols-2 gap-8 pt-6">
             <div className="space-y-2">
                <p className="text-3xl font-['Baloo_2'] font-bold text-amber-500">5,000+</p>
                <p className="text-sm font-bold text-amber-950/60 uppercase">Students Taught</p>
             </div>
             <div className="space-y-2">
                <p className="text-3xl font-['Baloo_2'] font-bold text-amber-500">12,000+</p>
                <p className="text-sm font-bold text-amber-950/60 uppercase">Cakes Delivered</p>
             </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className={`bg-amber-950 py-24 text-white mb-24 overflow-hidden relative transition-all duration-1000 delay-200 ease-out ${getVisibility(3)}`}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center mb-16">
              <h2 className="text-4xl font-['Baloo_2'] font-bold mb-4">What Our Community Says</h2>
              <p className="text-amber-200/60 max-w-xl mx-auto">Real stories from our students and clients across Kenya.</p>
           </div>

           <div className="grid md:grid-cols-4 gap-6">
              {reviews.map((r, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-[32px] hover:bg-white/10 transition-all group">
                   <div className="flex gap-1 mb-6 text-amber-400">
                      {[...Array(5)].map((_, idx) => (
                        <Star key={idx} size={16} fill={idx < r.stars ? "currentColor" : "transparent"} strokeWidth={1.5} />
                      ))}
                   </div>
                   <p className="text-amber-50/90 font-['Comic_Neue'] mb-6 leading-relaxed italic">"{r.text}"</p>
                   <div>
                      <p className="font-['Baloo_2'] font-bold text-amber-500">{r.name}</p>
                      <p className="text-xs text-amber-200/40 uppercase font-bold tracking-widest">{r.role}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Contact & Map Section */}
      <section className={`max-w-7xl mx-auto px-6 mb-24 transition-all duration-1000 delay-300 ease-out ${getVisibility(4)}`}>
        <div className="bg-white rounded-[40px] border-2 border-amber-100 overflow-hidden grid md:grid-cols-2 shadow-2xl shadow-amber-900/5">
           <div className="p-12 md:p-16">
              <h2 className="text-3xl font-['Baloo_2'] font-bold text-[#78350F] mb-8 flex items-center gap-3">
                <MapPin size={32} className="text-amber-500" />
                Find Us in Nairobi
              </h2>
              
              <div className="space-y-10">
                 <div className="flex gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                       <MapPin size={24} />
                    </div>
                    <div>
                       <p className="font-bold text-amber-950 mb-1">Main Store & Academy</p>
                       <p className="text-amber-900/60">123 Bakers' Lane, Ngong Road area</p>
                       <p className="text-amber-900/60">Nairobi, Kenya</p>
                    </div>
                 </div>

                 <div className="flex gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                       <Phone size={24} />
                    </div>
                    <div>
                       <p className="font-bold text-amber-950 mb-1">Call Our Bakeries</p>
                       <p className="text-amber-900/60">+254 700 000 000</p>
                       <p className="text-amber-900/60">+254 711 000 000</p>
                    </div>
                 </div>

                 <div className="flex gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                       <Mail size={24} />
                    </div>
                    <div>
                       <p className="font-bold text-amber-950 mb-1">Email Us</p>
                       <p className="text-amber-900/60">hello@josthercakes.com</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="h-[400px] md:h-full bg-amber-100 relative grayscale contrast-125 opacity-70 group hover:grayscale-0 hover:opacity-100 transition-all duration-700">
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-white/50 text-center z-10">
                    <MapPin className="text-amber-500 mx-auto mb-2 animate-bounce" size={40} />
                    <p className="font-['Baloo_2'] font-bold text-[#78350F]">Nairobi Academy</p>
                 </div>
              </div>
              <div className="absolute inset-0 bg-[#F59E0B]/10 mix-blend-multiply"></div>
              {/* Mock Map Texture */}
              <div className="w-full h-full bg-[url('https://api.placeholder.com/1200x800')] bg-cover opacity-30"></div>
           </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={`max-w-3xl mx-auto px-6 text-center transition-all duration-1000 delay-400 ease-out ${getVisibility(5)}`}>
         <h3 className="text-4xl font-['Baloo_2'] font-bold text-[#78350F] mb-8">Ready to start your sweet journey?</h3>
         <div className="flex flex-wrap items-center justify-center gap-6">
            <button className="px-10 py-5 bg-[#78350F] text-white font-['Baloo_2'] font-extrabold text-xl rounded-full shadow-2xl shadow-[#78350F]/30 hover:scale-105 active:scale-95 transition-all">
               Visit Our Campus
            </button>
            <button className="px-10 py-5 bg-white text-[#78350F] border-4 border-[#78350F] font-['Baloo_2'] font-extrabold text-xl rounded-full hover:bg-amber-50 transition-all">
               Order a Cake
            </button>
         </div>
      </section>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0) rotate(2deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>

    </div>
  );
}
