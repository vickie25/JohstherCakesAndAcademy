import { useState, useMemo, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigation } from '../context/NavigationContext';
import { 
  ShoppingCart, 
  Search, 
  X, 
  Check, 
  Play, 
  BookOpen, 
  Clock, 
  Globe, 
  Download, 
  Award,
  Filter,
  Users,
  Lock
} from 'lucide-react';

const CATEGORIES = ['All', 'Beginner', 'Intermediate', 'Professional'];

const MOCK_COURSES = [
  { 
    id: 501, 
    name: 'Beginner Baker Pro', 
    level: 'Beginner', 
    price: 2900, 
    image: '/hero_baker.png', 
    tag: 'Starter', 
    desc: 'Master the science of cake mixing and basic decorating from scratch.',
    lessons: 12,
    duration: '5h 30m',
    students: 1250,
    features: ['Video Tutorials', 'Recipe PDFs', 'WhatsApp Support']
  },
  { 
    id: 502, 
    name: 'The Fondant Masterclass', 
    level: 'Intermediate', 
    price: 7500, 
    image: '/hero_cake_elegant.png', 
    tag: 'Best Seller', 
    desc: 'Advanced sculpting, sharp edges, and multi-tier stability techniques.',
    lessons: 24,
    duration: '12h 45m',
    students: 840,
    features: ['HD Video', 'Doubt Clearing', 'Digital Certificate']
  },
  { 
    id: 503, 
    name: 'Baking Business Launchpad', 
    level: 'Professional', 
    price: 12000, 
    image: '/academy-class.png', 
    tag: 'Buisness', 
    desc: 'Transform your passion into a profitable brand with marketing & costing.',
    lessons: 30,
    duration: '20h 15m',
    students: 450,
    features: ['1-on-1 Mentoring', 'Social Media Hub', 'Business Templates']
  },
  { 
    id: 504, 
    name: 'Wedding Cake Architecture', 
    level: 'Professional', 
    price: 15500, 
    image: '/hero_cake_elegant.png', 
    tag: 'Specialist', 
    desc: 'Engineer massive 5-tier wedding cakes with safe transport techniques.',
    lessons: 18,
    duration: '15h 0m',
    students: 310,
    features: ['Structural Blueprints', 'Stacking Kit PDF', 'Vendor Contacts']
  },
  { 
    id: 505, 
    name: 'Cupcake Design Lab', 
    level: 'Beginner', 
    price: 1800, 
    image: '/red_velvet_cake.png', 
    tag: 'Playful', 
    desc: 'Express your creativity with 20+ unique frosting and piping styles.',
    lessons: 8,
    duration: '3h 20m',
    students: 2100,
    features: ['Piping Guide', 'Flavour Matrix', 'Quick Cert']
  },
  { 
    id: 506, 
    name: 'Artisan Pastry Secrets', 
    level: 'Intermediate', 
    price: 5200, 
    image: '/academy-class.png', 
    tag: 'Advanced', 
    desc: 'Delicate puff pastry, croissants, and gourmet fillings taught simply.',
    lessons: 15,
    duration: '9h 10m',
    students: 580,
    features: ['Laminating Tech', 'Gourmet Fillings', 'Physical kit opt']
  },
];

export default function CoursesPage() {
  const { addToCart, items, subtotal, updateQuantity, setIsCartOpen } = useCart();
  const { goToCheckout } = useNavigation();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleElements, setVisibleElements] = useState<number>(0);

  // Filter only for courses in the cart
  const courseItemsInCart = useMemo(() => items.filter(item => item.id >= 500 && item.id < 600), [items]);
  const coursesSubtotal = useMemo(() => courseItemsInCart.reduce((acc, item) => acc + (item.priceNum * item.quantity), 0), [courseItemsInCart]);

  // Initialize animations on mount
  useEffect(() => {
    window.scrollTo(0,0);
    const timers = [100, 200, 300, 400, 500, 600].map((t, i) => 
      setTimeout(() => setVisibleElements(i + 1), t)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const filteredCourses = useMemo(() => {
    return MOCK_COURSES.filter(course => {
      const matchCat = activeCategory === 'All' || course.level === activeCategory;
      const matchSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  const getVisibility = (index: number) => visibleElements >= index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8';

  return (
    <div className="min-h-screen bg-[#FFFBEB] pt-32 pb-20">
      
      {/* Header Container */}
      <header className={`max-w-7xl mx-auto px-6 mb-16 text-center transition-all duration-1000 ease-out ${getVisibility(1)}`}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 font-bold mb-6">
          <Globe size={18} />
          <span>Online Learning Hub</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-['Baloo_2'] font-extrabold text-[#78350F] mb-6 leading-tight">
          Learn the Art of <span className="text-amber-500">Baking</span> <br />
          Anytime, Anywhere.
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-amber-900/70 font-['Comic_Neue'] leading-relaxed mb-12">
          From beginner secrets to professional business scaling. Join 5,000+ students worldwide mastering the craft in their own kitchens.
        </p>

        {/* Search & Filters Overlay */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
           <div className="relative w-full max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400 transition-colors group-focus-within:text-amber-600" size={20} />
              <input 
                type="text" 
                placeholder="Search courses..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-12 pr-6 bg-white border-2 border-amber-100 rounded-2xl outline-none focus:border-amber-500 shadow-sm focus:shadow-xl transition-all"
              />
           </div>
           
           <div className="flex bg-white p-1.5 rounded-2xl border-2 border-amber-100 shadow-sm">
             {CATEGORIES.map(cat => (
               <button
                 key={cat}
                 onClick={() => setActiveCategory(cat)}
                 className={`px-6 py-2 rounded-xl font-['Baloo_2'] font-bold text-sm transition-all ${activeCategory === cat ? 'bg-amber-500 text-white shadow-lg' : 'text-amber-800 hover:bg-amber-50'}`}
               >
                 {cat}
               </button>
             ))}
           </div>
        </div>
      </header>

      {/* Course Grid */}
      <main className={`max-w-7xl mx-auto px-6 transition-all duration-1000 delay-200 ease-out ${getVisibility(2)}`}>
        {filteredCourses.length === 0 ? (
          <div className="text-center py-20 bg-white/50 border-4 border-dashed border-amber-100 rounded-[40px]">
             <BookOpen size={64} className="mx-auto text-amber-200 mb-6" />
             <h3 className="text-2xl font-['Baloo_2'] font-bold text-[#78350F]">No courses found matching "{searchQuery}"</h3>
             <button onClick={() => {setSearchQuery(''); setActiveCategory('All');}} className="mt-4 text-amber-600 font-bold hover:underline">Clear all filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredCourses.map((course, i) => {
              const inCart = items.find(item => item.id === course.id);
              return (
                <article 
                  key={course.id}
                  className={`bg-white rounded-[32px] overflow-hidden border-2 border-amber-100 hover:border-amber-500 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl group flex flex-col`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={course.image} 
                      alt={course.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                       <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform">
                          <Play fill="white" size={24} />
                       </div>
                    </div>
                    <div className="absolute top-4 right-4 px-4 py-1.5 bg-white/90 backdrop-blur-md text-[#78350F] font-bold rounded-full text-xs shadow-lg uppercase tracking-wider">
                      {course.tag}
                    </div>
                  </div>

                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-4 text-amber-600 font-bold text-xs uppercase tracking-widest">
                      <Clock size={14} />
                      <span>{course.duration}</span>
                      <span className="mx-1">•</span>
                      <Users size={14} />
                      <span>{course.students} Learners</span>
                    </div>

                    <h3 className="text-2xl font-['Baloo_2'] font-bold text-amber-950 mb-3 group-hover:text-amber-500 transition-colors leading-tight">
                      {course.name}
                    </h3>
                    
                    <p className="text-amber-900/60 text-sm leading-relaxed mb-6 flex-1 font-['Comic_Neue'] font-medium">
                      {course.desc}
                    </p>

                    <ul className="space-y-2 mb-8">
                      {course.features.map(f => (
                        <li key={f} className="flex items-center gap-2 text-xs font-bold text-amber-800">
                          <Check size={14} className="text-emerald-500" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <div className="pt-6 border-t border-amber-100 flex items-center justify-between">
                       <div>
                         <p className="text-xs font-bold text-amber-900/40 uppercase tracking-tighter mb-1">Tuition Fee</p>
                         <p className="text-2xl font-['Baloo_2'] font-extrabold text-[#78350F]">KES {course.price.toLocaleString()}</p>
                       </div>

                       {inCart ? (
                         <div className="flex bg-amber-100 rounded-2xl p-1 gap-2 border border-amber-200">
                           <button onClick={() => updateQuantity(course.id, -1)} className="w-8 h-8 flex items-center justify-center bg-white text-amber-900 rounded-xl font-bold hover:bg-amber-50 transition-colors">-</button>
                           <span className="w-4 flex items-center justify-center font-bold text-amber-900">{inCart.quantity}</span>
                           <button onClick={() => updateQuantity(course.id, 1)} className="w-8 h-8 flex items-center justify-center bg-white text-amber-900 rounded-xl font-bold hover:bg-amber-50 transition-colors">+</button>
                         </div>
                       ) : (
                        <button 
                          onClick={() => {
                            addToCart({
                              id: course.id,
                              name: course.name,
                              priceNum: course.price,
                              priceStr: `KES ${course.price.toLocaleString()}`,
                              image: course.image
                            });
                          }}
                          className="w-14 h-14 rounded-2xl bg-[#78350F] text-white flex items-center justify-center hover:bg-amber-500 transition-all shadow-xl shadow-amber-900/20 active:scale-95"
                        >
                          <ShoppingCart size={22} />
                        </button>
                       )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* Trust & Features Bar */}
      <section className={`max-w-7xl mx-auto px-6 mt-32 transition-all duration-1000 delay-500 ease-out ${getVisibility(3)}`}>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-8 p-12 bg-white rounded-[50px] border-2 border-amber-100 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-3xl rounded-full"></div>
            
            <div className="flex flex-col items-center text-center gap-4">
               <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
                  <Globe size={24} />
               </div>
               <p className="font-['Baloo_2'] font-bold text-amber-950 text-sm">Self-Paced Learning</p>
            </div>

            <div className="flex flex-col items-center text-center gap-4">
               <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
                  <Download size={24} />
               </div>
               <p className="font-['Baloo_2'] font-bold text-amber-950 text-sm">Offline Resources</p>
            </div>

            <div className="flex flex-col items-center text-center gap-4">
               <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
                  <Award size={24} />
               </div>
               <p className="font-['Baloo_2'] font-bold text-amber-950 text-sm">Digital Certification</p>
            </div>

            <div className="flex flex-col items-center text-center gap-4">
               <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
                  <Lock size={24} />
               </div>
               <p className="font-['Baloo_2'] font-bold text-amber-950 text-sm">Lifetime Access</p>
            </div>
         </div>
      </section>

      {/* Floating Checkout Bar (appears when items are in cart) */}
      {courseItemsInCart.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl animate-[slideInUp_0.6s_cubic-bezier(0.16,1,0.3,1)]">
           <div className="bg-amber-950/90 backdrop-blur-2xl rounded-[32px] p-4 md:p-6 border-2 border-amber-500/30 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center justify-between gap-6">
              
              <div className="flex items-center gap-6 overflow-x-auto max-w-full pb-2 md:pb-0">
                 <div className="flex -space-x-4">
                    {courseItemsInCart.map((item, idx) => (
                      <div key={item.id} className="relative group" style={{ zIndex: 10 + idx }}>
                        <img 
                          src={item.image} 
                          className="w-14 h-14 rounded-full border-4 border-amber-900 object-cover shadow-lg" 
                          alt={item.name} 
                        />
                        <div className="absolute -top-2 -right-2 bg-amber-500 text-amber-950 text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-amber-900">
                          {item.quantity}
                        </div>
                      </div>
                    ))}
                 </div>
                 <div>
                    <p className="text-amber-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Your Selected Courses</p>
                    <p className="text-white font-['Baloo_2'] font-bold text-xl">
                      {courseItemsInCart.length} Class{courseItemsInCart.length > 1 ? 'es' : ''} • KES {coursesSubtotal.toLocaleString()}
                    </p>
                 </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto">
                 <button 
                   onClick={() => setIsCartOpen(true)}
                   className="flex-1 md:flex-none px-6 py-4 rounded-2xl bg-white/10 text-white font-bold hover:bg-white/20 transition-all border border-white/10"
                 >
                   View All
                 </button>
                 <button 
                   onClick={goToCheckout}
                   className="flex-1 md:flex-none px-12 py-4 rounded-2xl bg-amber-500 text-amber-950 font-['Baloo_2'] font-black text-lg hover:bg-amber-400 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-amber-500/20"
                 >
                   Checkout Now
                 </button>
              </div>
           </div>
        </div>
      )}

      <style>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translate(-50%, 40px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
}
