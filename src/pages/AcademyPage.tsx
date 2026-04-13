import { useEffect, useState } from 'react';
import { Calendar, MapPin, GraduationCap, ChefHat, BookOpen, Clock, Users, Award, Box } from 'lucide-react';
import AcademyRegistrationModal from '../components/AcademyRegistrationModal';

export default function AcademyPage() {
  const [selectedBatch, setSelectedBatch] = useState<{name: string, date: string, price: string} | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleElements, setVisibleElements] = useState<number>(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Staggered entrance animation like OurCakes
    const timers = [100, 200, 300, 400, 500, 600].map((t, i) => 
      setTimeout(() => setVisibleElements(i + 1), t)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const openRegistration = (batch: {name: string, date: string, price: string}) => {
    setSelectedBatch(batch);
    setIsModalOpen(true);
  };

  const getVisibility = (index: number) => visibleElements >= index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10';

  const facilityImages = [
    { url: '/academy-class.png', title: 'Main Kitchen' },
    { url: '/hero_baker.png', title: 'Decorating Station' },
    { url: '/hero_cake_elegant.png', title: 'Pastry Lab' },
    { url: '/academy-class.png', title: 'Student Lounge' },
  ];

  const benefits = [
    { icon: <ChefHat className="w-6 h-6" />, title: 'Pro Equipment', desc: 'Work with commercial-grade ovens and high-end mixers.' },
    { icon: <Users className="w-6 h-6" />, title: 'Small Batches', desc: 'Maximum 8 students per class for personalized attention.' },
    { icon: <Award className="w-6 h-6" />, title: 'Certified', desc: 'Globally recognized certification upon graduation.' },
    { icon: <BookOpen className="w-6 h-6" />, title: 'Recipe Vault', desc: 'Physical copy of our secret trade-recipe handbook.' },
  ];

  const intakes = [
    { name: 'Beginner Baker (Batch #12)', date: 'April 19, 2026', price: 'KES 4,500', course: 'Beginner Baker (Batch #12)', status: '3 spots left', color: 'bg-amber-100 text-amber-800' },
    { name: 'Intermediate Artist', date: 'May 05, 2026', price: 'KES 9,800', course: 'Intermediate Artist', status: 'Filling fast', color: 'bg-orange-100 text-orange-800' },
    { name: 'Pro Masterclass', date: 'May 20, 2026', price: 'KES 18,500', course: 'Pro Masterclass', status: 'Open', color: 'bg-emerald-100 text-emerald-800' },
  ];

  return (
    <div className="min-h-screen bg-[#FFFBEB] pt-24 pb-20 overflow-x-hidden">
      {/* Hero Section */}
      <section className={`max-w-7xl mx-auto px-6 mb-20 text-center transition-all duration-1000 ease-out ${getVisibility(1)}`}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 font-bold mb-6">
          <GraduationCap size={20} />
          <span>The Physical Campus</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-['Baloo_2'] font-extrabold text-[#78350F] mb-6 leading-tight">
          Master the Art of <span className="text-amber-500 underline decoration-amber-200">Baking</span> <br />
          At Our Nairobi Campus
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-amber-900/70 font-['Comic_Neue'] leading-relaxed">
          Step into our professional kitchen, smell the fresh vanilla, and learn hands-on from master pastry chefs. 
          Your journey from hobbyist to professional starts right here.
        </p>
      </section>

      {/* Facility Gallery */}
      <section className={`max-w-7xl mx-auto px-6 mb-24 transition-all duration-1000 delay-100 ease-out ${getVisibility(2)}`}>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-['Baloo_2'] font-bold text-[#78350F]">Our Facility</h2>
          <button className="text-amber-600 font-bold hover:underline">Book a Campus Tour &rarr;</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-auto md:h-[500px]">
          <div className="md:col-span-2 rounded-3xl overflow-hidden border-4 border-white shadow-xl relative group h-[300px] md:h-full">
            <img src={facilityImages[0].url} alt={facilityImages[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
              <p className="text-white font-bold">{facilityImages[0].title}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-1 gap-4 h-[200px] md:h-full">
            <div className="rounded-2xl overflow-hidden border-4 border-white shadow-lg relative group h-full">
              <img src={facilityImages[1].url} alt={facilityImages[1].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="rounded-2xl overflow-hidden border-4 border-white shadow-lg relative group h-full">
              <img src={facilityImages[2].url} alt={facilityImages[2].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden border-4 border-white shadow-xl relative group h-[300px] md:h-full">
            <img src={facilityImages[3].url} alt={facilityImages[3].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
        </div>
      </section>

      {/* The Student Box (Physical Kit) */}
      <section className={`bg-amber-900 py-20 text-white mb-24 overflow-hidden relative transition-all duration-1000 delay-200 ease-out ${getVisibility(3)}`}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-amber-500/20 blur-xl rounded-full animate-pulse"></div>
            <img src="/hero_cake_elegant.png" alt="Student Kit" className="relative z-10 w-full h-[400px] object-cover rounded-[40px] border-4 border-amber-500/30" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold mb-6 text-sm">
              <Box size={16} />
              <span>Free on Day 1</span>
            </div>
            <h2 className="text-4xl font-['Baloo_2'] font-bold mb-6">Your Professional Starter Kit</h2>
            <p className="text-amber-100/70 font-['Comic_Neue'] mb-8 text-lg">
              Every on-campus student receives a curated box of professional-grade tools to keep forever. Start your career with the best.
            </p>
            <ul className="grid grid-cols-2 gap-4 mb-10">
              {['Branded Apron', 'Chef\'s Hat', 'Spatula Set', 'Cake Turntable', 'Recipe Manual', 'Ingredient Kit'].map(item => (
                <li key={item} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="font-medium text-amber-50 text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <button className="px-8 py-3 bg-amber-500 text-amber-950 font-bold rounded-full hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Experience Grid */}
      <section className={`max-w-7xl mx-auto px-6 mb-24 transition-all duration-1000 delay-300 ease-out ${getVisibility(4)}`}>
        <div className="grid md:grid-cols-4 gap-8">
          {benefits.map((b, i) => (
            <div key={i} className="p-8 rounded-[32px] bg-white border-2 border-amber-100 hover:border-amber-500 transition-all duration-300 group shadow-sm hover:shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {b.icon}
              </div>
              <h3 className="text-xl font-['Baloo_2'] font-bold text-[#78350F] mb-3">{b.title}</h3>
              <p className="text-amber-900/60 text-sm leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Intake Schedule */}
      <section className={`max-w-4xl mx-auto px-6 mb-24 transition-all duration-1000 delay-400 ease-out ${getVisibility(5)}`}>
        <div className="bg-white rounded-[40px] border-4 border-amber-200 p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Calendar size={120} className="text-amber-950" />
          </div>
          <h2 className="text-3xl font-['Baloo_2'] font-bold text-[#78350F] mb-2">Upcoming Physical Intakes</h2>
          <p className="text-amber-700/60 font-medium mb-10 italic">Limited seats per batch — Secure your spot early!</p>
          
          <div className="space-y-4">
            {intakes.map((intake, i) => (
              <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl bg-amber-50/50 border border-amber-100 hover:bg-amber-50 transition-colors">
                <div className="mb-4 md:mb-0">
                  <div className="flex items-center gap-2 text-amber-900 font-bold mb-1">
                    <Clock size={16} />
                    <span>{intake.date}</span>
                  </div>
                  <p className="text-lg font-['Baloo_2'] font-bold text-amber-800">{intake.course}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${intake.color}`}>
                    {intake.status}
                  </span>
                  <button 
                    onClick={() => openRegistration(intake)}
                    className="px-6 py-2 bg-[#78350F] text-white rounded-xl font-bold text-sm hover:bg-[#92400E] transition-colors active:scale-95"
                  >
                    Register
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location/Map Card */}
      <section className={`max-w-7xl mx-auto px-6 transition-all duration-1000 delay-500 ease-out ${getVisibility(6)}`}>
        <div className="bg-amber-50 rounded-[40px] border-2 border-amber-100 overflow-hidden grid md:grid-cols-2 items-center">
          <div className="p-12">
            <h2 className="text-3xl font-['Baloo_2'] font-bold text-[#78350F] mb-6 flex items-center gap-3">
              <MapPin size={32} className="text-amber-500" />
              Visit the Campus
            </h2>
            <div className="space-y-6 mb-8 text-amber-900/80">
              <div>
                <p className="font-bold text-lg mb-1">Main Academy</p>
                <p>123 Bakers Street, Ngong Road area</p>
                <p>Nairobi, Kenya</p>
              </div>
              <div>
                <p className="font-bold mb-1">Hours</p>
                <p>Mon - Fri: 8:00 AM - 6:00 PM</p>
                <p>Sat: 9:00 AM - 4:00 PM</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-3 bg-[#78350F] text-white font-bold rounded-full shadow-lg shadow-[#78350F]/20">
                Get Directions
              </button>
              <button className="px-8 py-3 bg-white text-[#78350F] border-2 border-[#78350F] font-bold rounded-full">
                Contact Office
              </button>
            </div>
          </div>
          <div className="h-[400px] md:h-full bg-amber-200 grayscale contrast-125 opacity-70">
            {/* Mock Map Placeholder */}
            <div className="w-full h-full flex items-center justify-center border-l-2 border-amber-100">
               <MapPin size={64} className="text-[#78350F] animate-bounce" />
               <p className="font-bold text-[#78350F] ml-2">Location Map</p>
            </div>
          </div>
        </div>
      </section>

      <AcademyRegistrationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        batch={selectedBatch}
      />
    </div>
  );
}
