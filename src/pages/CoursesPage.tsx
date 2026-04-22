import { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Check,
  Play,
  BookOpen,
  Clock,
  Globe,
  Download,
  Award,
  Users,
  Lock,
  ArrowRight,
  X,
  MapPin,
} from 'lucide-react';
import CourseRegistrationModal from '../components/CourseRegistrationModal';

const CATEGORIES = ['All', 'Beginner', 'Intermediate', 'Professional'];

import { apiRequest, resolvePublicUploadUrl } from '../lib/api';

const CATEGORY_TO_LEVEL: Record<string, string> = {
  Beginner: 'beginner',
  Intermediate: 'intermediate',
  Professional: 'advanced',
};

function courseLevel(course: any): string {
  return String(course?.level || course?.tag || '').toLowerCase();
}

function isPhysicalCourse(course: any): boolean {
  return course?.delivery_type === 'physical';
}

export default function CoursesPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleElements, setVisibleElements] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [curriculumOpen, setCurriculumOpen] = useState(false);
  const [curriculumLoading, setCurriculumLoading] = useState(false);
  const [curriculumDetail, setCurriculumDetail] = useState<any>(null);

  const [cohortModalOpen, setCohortModalOpen] = useState(false);
  const [cohortCourse, setCohortCourse] = useState<any>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await apiRequest<any[]>('/courses', { useAuth: false });
        if (data) {
          setCourses(data);
        } else {
          setCourses([]);
        }
      } catch (err) {
        console.error(err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Initialize animations on mount
  useEffect(() => {
    window.scrollTo(0,0);
    const timers = [100, 200, 300, 400, 500, 600].map((t, i) => 
      setTimeout(() => setVisibleElements(i + 1), t)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const openRegistration = (course: any) => {
    const cover = resolvePublicUploadUrl(course.image_url || course.image);
    setSelectedCourse({
      id: course.id,
      name: course.name || course.title,
      desc: course.desc || course.subtitle,
      price: course.price,
      duration: course.duration || 'Self-paced',
      lessons: Array.isArray(course.lessons) ? course.lessons.length : course.lessons || 0,
      image: cover,
      features: course.features || [],
      tag: course.tag || 'Popular',
    });
    setIsModalOpen(true);
  };

  const openCohortJoin = (course: any) => {
    const cover = resolvePublicUploadUrl(course.image_url || course.image);
    setCohortCourse({
      id: course.id,
      name: course.name || course.title,
      price: course.price,
      duration: course.duration || 'Scheduled',
      lessons: 0,
      image: cover,
      features: course.features || [],
      tag: course.tag || 'Cohort',
    });
    setCohortModalOpen(true);
  };

  const openCurriculum = async (courseId: number) => {
    setCurriculumOpen(true);
    setCurriculumLoading(true);
    setCurriculumDetail(null);
    const { data, error } = await apiRequest<any>(`/courses/${courseId}`, { useAuth: false });
    if (!error && data) setCurriculumDetail(data);
    setCurriculumLoading(false);
  };

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const lvl = courseLevel(course);
      const matchCat =
        activeCategory === 'All' || lvl === CATEGORY_TO_LEVEL[activeCategory];
      const matchSearch =
        (course.name || course.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (course.desc || course.subtitle || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery, courses]);

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
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 bg-white/50 rounded-3xl border border-white">
             <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin mb-4"></div>
             <p className="font-['Baloo_2'] font-bold text-amber-950 text-xl tracking-tight">Fetching courses...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-20 bg-white/50 border-4 border-dashed border-amber-100 rounded-[40px]">
             <BookOpen size={64} className="mx-auto text-amber-200 mb-6" />
             <h3 className="text-2xl font-['Baloo_2'] font-bold text-[#78350F]">No courses found matching "{searchQuery}"</h3>
             <button onClick={() => {setSearchQuery(''); setActiveCategory('All');}} className="mt-4 text-amber-600 font-bold hover:underline">Clear all filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredCourses.map((course, i) => {
              const physical = isPhysicalCourse(course);
              return (
                <article 
                  key={course.id}
                  className={`bg-white rounded-[32px] overflow-hidden border-2 border-amber-100 hover:border-amber-500 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl group flex flex-col`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={resolvePublicUploadUrl(course.image_url || course.image)}
                      alt={course.name || course.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {!physical && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                       <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform">
                          <Play fill="white" size={24} />
                       </div>
                    </div>
                    )}
                    {physical && (
                      <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 text-white font-bold rounded-full text-xs shadow-lg">
                        <MapPin size={14} />
                        In person
                      </div>
                    )}
                    <div className="absolute top-4 right-4 px-4 py-1.5 bg-white/90 backdrop-blur-md text-[#78350F] font-bold rounded-full text-xs shadow-lg uppercase tracking-wider">
                      {physical ? 'Cohort' : course.tag}
                    </div>
                  </div>

                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-4 text-amber-600 font-bold text-xs uppercase tracking-widest">
                      <Clock size={14} />
                      <span>{course.duration}</span>
                      {!physical && (
                        <>
                          <span className="mx-1">•</span>
                          <Users size={14} />
                          <span>
                            {typeof course.students === 'number' ? course.students : 0}{' '}
                            Learners · {Array.isArray(course.lessons) ? course.lessons.length : 0} lessons
                          </span>
                        </>
                      )}
                      {physical && (
                        <>
                          <span className="mx-1">•</span>
                          <span className="normal-case font-['Comic_Neue']">Join a scheduled intake at our academy</span>
                        </>
                      )}
                    </div>

                    <h3 className="text-2xl font-['Baloo_2'] font-bold text-amber-950 mb-3 group-hover:text-amber-500 transition-colors leading-tight">
                      {course.name || course.title}
                    </h3>
                    
                    <p className="text-amber-900/60 text-sm leading-relaxed mb-6 flex-1 font-['Comic_Neue'] font-medium">
                      {course.desc || course.subtitle}
                    </p>

                    <ul className="space-y-2 mb-8">
                      {(course.features || []).slice(0, 3).map((f: string) => (
                        <li key={f} className="flex items-center gap-2 text-xs font-bold text-amber-800">
                          <Check size={14} className="text-emerald-500" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <div className="pt-6 border-t border-amber-100 flex flex-col gap-3">
                       <div className="flex items-center justify-between gap-4">
                         <div>
                           <p className="text-xs font-bold text-amber-900/40 uppercase tracking-tighter mb-1">Tuition Fee</p>
                           <p className="text-2xl font-['Baloo_2'] font-extrabold text-[#78350F]">KES {Number(course.price).toLocaleString()}</p>
                         </div>
                       </div>
                       <div className="flex flex-col sm:flex-row gap-2">
                         {physical ? (
                           <button
                             type="button"
                             onClick={() => openCohortJoin(course)}
                             className="h-14 w-full rounded-2xl bg-emerald-800 text-white flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-900/25 active:scale-95 font-bold text-sm"
                           >
                             <Users size={18} />
                             Join cohort
                             <ArrowRight size={18} />
                           </button>
                         ) : (
                           <>
                             <button
                               type="button"
                               onClick={() => openCurriculum(course.id)}
                               className="h-12 flex-1 rounded-2xl border-2 border-[#78350F] text-[#78350F] font-bold text-sm flex items-center justify-center gap-2 hover:bg-amber-50 transition-all"
                             >
                               <Play size={18} />
                               View lessons
                             </button>
                             <button
                               type="button"
                               onClick={() => openRegistration(course)}
                               className="h-12 flex-1 rounded-2xl bg-[#78350F] text-white flex items-center justify-center gap-2 hover:bg-amber-500 transition-all shadow-xl shadow-amber-900/20 active:scale-95 font-bold text-sm"
                             >
                               Enroll now
                               <ArrowRight size={18} />
                             </button>
                           </>
                         )}
                       </div>
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

      <CourseRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        course={selectedCourse}
        variant="enroll"
      />

      <CourseRegistrationModal
        isOpen={cohortModalOpen}
        onClose={() => {
          setCohortModalOpen(false);
          setCohortCourse(null);
        }}
        course={cohortCourse}
        variant="cohort"
      />

      {curriculumOpen && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-6">
          <button
            type="button"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            aria-label="Close"
            onClick={() => {
              setCurriculumOpen(false);
              setCurriculumDetail(null);
            }}
          />
          <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl border border-amber-100">
            <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-amber-100 bg-white/95 backdrop-blur px-6 py-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-amber-600">Course curriculum</p>
                <h2 className="text-2xl font-['Baloo_2'] font-bold text-[#78350F]">
                  {curriculumDetail?.title || 'Loading…'}
                </h2>
              </div>
              <button
                type="button"
                className="rounded-full p-2 text-amber-800 hover:bg-amber-50"
                onClick={() => {
                  setCurriculumOpen(false);
                  setCurriculumDetail(null);
                }}
                aria-label="Close"
              >
                <X size={22} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {curriculumLoading && (
                <div className="py-16 text-center text-amber-800 font-['Comic_Neue']">Loading lessons…</div>
              )}
              {!curriculumLoading && curriculumDetail?.promo_video_url && (
                <div>
                  <p className="text-sm font-bold text-amber-900 mb-2">Course intro</p>
                  <video
                    src={resolvePublicUploadUrl(curriculumDetail.promo_video_url)}
                    className="w-full rounded-2xl border border-amber-100 bg-black"
                    controls
                  />
                </div>
              )}
              {!curriculumLoading && curriculumDetail && (
                <div>
                  <p className="text-sm font-bold text-amber-900 mb-3">Lessons</p>
                  {Array.isArray(curriculumDetail.lessons) && curriculumDetail.lessons.length > 0 ? (
                    <ol className="space-y-6">
                      {[...curriculumDetail.lessons]
                        .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
                        .map((lesson: any, idx: number) => (
                          <li key={lesson.id || idx} className="rounded-2xl border border-amber-100 p-4 bg-amber-50/40">
                            <p className="font-['Baloo_2'] font-bold text-lg text-[#78350F] mb-2">
                              {idx + 1}. {lesson.title}
                            </p>
                            {lesson.video_url ? (
                              <video
                                src={resolvePublicUploadUrl(lesson.video_url)}
                                className="w-full rounded-xl border border-amber-100 bg-black max-h-[240px]"
                                controls
                              />
                            ) : (
                              <p className="text-sm text-amber-800/70">Video coming soon.</p>
                            )}
                          </li>
                        ))}
                    </ol>
                  ) : (
                    <p className="text-amber-800/80 font-['Comic_Neue']">
                      No published lessons yet. Your instructor will add videos here when the course is ready.
                    </p>
                  )}
                </div>
              )}
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
