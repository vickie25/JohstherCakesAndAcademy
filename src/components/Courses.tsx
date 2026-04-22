import { useEffect, useRef, useState } from 'react';
import CourseRegistrationModal, { type CourseRegistrationPayload } from './CourseRegistrationModal';
import { apiRequest, resolvePublicUploadUrl } from '../lib/api';
import { Play, Clock, Users, ArrowRight, BookOpen, Check } from 'lucide-react';

interface Course {
  id: number;
  name?: string;
  title?: string;
  desc?: string;
  subtitle?: string;
  price: number;
  duration: string;
  lessons?: number | unknown[];
  students: number;
  image?: string;
  image_url?: string;
  tag: string;
  features: string[];
  delivery_type?: string;
}

// Fetch from Backend
import { useNavigation } from '../context/NavigationContext';

export default function Courses() {
  const ref = useRef<HTMLElement>(null);
  const { goToCourses } = useNavigation();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseRegistrationPayload | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cohortCourse, setCohortCourse] = useState<CourseRegistrationPayload | null>(null);
  const [cohortModalOpen, setCohortModalOpen] = useState(false);

  const lessonCount = (c: Course) =>
    Array.isArray(c.lessons) ? (c.lessons as unknown[]).length : Number(c.lessons) || 0;

  const openCourseModal = (course: Course) => {
    setSelectedCourse({
      id: course.id,
      name: course.name || course.title,
      desc: course.desc || course.subtitle,
      price: course.price,
      duration: course.duration,
      lessons: lessonCount(course),
      image: resolvePublicUploadUrl(course.image_url || course.image),
      image_url: course.image_url,
      features: course.features || [],
      tag: course.tag,
    });
    setIsModalOpen(true);
  };

  const openCohortModal = (course: Course) => {
    setCohortCourse({
      id: course.id,
      name: course.name || course.title,
      desc: course.desc || course.subtitle,
      price: course.price,
      duration: course.duration,
      lessons: 0,
      image: resolvePublicUploadUrl(course.image_url || course.image),
      image_url: course.image_url,
      features: course.features || [],
      tag: course.tag || 'Cohort',
    });
    setCohortModalOpen(true);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fetchCourses = async () => {
      try {
        const { data } = await apiRequest<Course[]>('/courses', { useAuth: false });
        if (data && data.length > 0) {
          setCourses(data.slice(0, 3));
        }
      } catch (err) {
        // Silently stay with dummy data
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();

    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const observer = new MutationObserver(() => {
      el.querySelectorAll('.fade-up:not(.observed)').forEach(item => {
        item.classList.add('observed');
        obs.observe(item);
      });
    });

    observer.observe(el, { childList: true, subtree: true });
    
    el.querySelectorAll('.fade-up').forEach(item => {
      item.classList.add('observed');
      obs.observe(item);
    });

    return () => {
      obs.disconnect();
      observer.disconnect();
    };
  }, [courses]);

  return (
    <section id="courses" ref={ref} style={{ padding: '100px 0', background: '#FEF3C7', position: 'relative', overflow: 'hidden' }}>
      <div className="dot-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.4 }} aria-hidden="true" />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div className="fade-up" style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div className="pill" style={{ background: '#FEF3C7', border: '2px solid #F59E0B', color: '#92400E', marginBottom: '16px', display: 'inline-flex' }}>
            Our Training Hub
          </div>
          <h2 style={{
            fontFamily: "'Baloo 2', cursive",
            fontWeight: 800,
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: '#78350F',
            marginBottom: '16px',
          }}>
            Master the <span style={{ color: '#F59E0B' }}>Art</span> of Baking
          </h2>
          <p style={{ fontFamily: "'Comic Neue', cursive", fontSize: '1.05rem', color: '#A16207', maxWidth: '520px', margin: '0 auto' }}>
            From beginner basics to professional certifications. Join our curriculum and master everything from artisanal bread to luxury wedding cakes.
          </p>
        </div>


        {/* Course Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '28px',
          alignItems: 'start',
        }}>
          {loading ? (
            <div style={{ gridColumn: '1 / -1', padding: '100px 0', textAlign: 'center' }}>
              <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="font-['Baloo_2'] font-bold text-amber-950">Preparing your curriculum...</p>
            </div>
          ) : courses.map((course) => {
            const isPopular = course.tag === 'Best Seller' || course.tag === 'Most Popular';
            const color = '#B45309';
            const physical = course.delivery_type === 'physical';
            return (
              <article
                key={course.id}
                className="card-lift fade-up"
                style={{
                  background: '#fff',
                  borderRadius: '28px',
                  overflow: 'hidden',
                  border: isPopular ? `3px solid ${color}` : '2px solid #F5E6C8',
                  position: 'relative',
                  transform: isPopular ? 'scale(1.03)' : 'scale(1)',
                  boxShadow: isPopular ? `0 20px 50px rgba(245,158,11,0.25)` : '0 4px 20px rgba(146,64,14,0.08)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%'
                }}
              >
                {/* Popular badge */}
                {course.tag && (
                  <div style={{
                    position: 'absolute', top: '18px', right: '18px',
                    background: color,
                    color: '#fff',
                    fontFamily: "'Baloo 2', cursive",
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    padding: '4px 14px',
                    borderRadius: '999px',
                    zIndex: 2,
                  }}>
                    {course.tag}
                  </div>
                )}

                {/* Image */}
                <div style={{ height: '180px', overflow: 'hidden' }}>
                  <img
                    src={resolvePublicUploadUrl(course.image_url || course.image)}
                    alt={`${course.name || course.title || 'Professional'} baking course at Johsther Academy`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                </div>

                <div style={{ padding: '24px 26px 28px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  {/* Duration pills */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                     <span style={{
                        fontFamily: "'Baloo 2', cursive",
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        background: '#FEF3C7',
                        color: '#92400E',
                        padding: '3px 10px',
                        borderRadius: '999px',
                        border: '1.5px solid #F5E6C8',
                      }}>{course.duration}</span>
                      <span style={{
                        fontFamily: "'Baloo 2', cursive",
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        background: '#FEF3C7',
                        color: '#92400E',
                        padding: '3px 10px',
                        borderRadius: '999px',
                        border: '1.5px solid #F5E6C8',
                      }}>{physical ? 'Cohort' : `${lessonCount(course)} lessons`}</span>
                  </div>

                  <h3 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '1.25rem', color: '#78350F', marginBottom: '4px' }}>
                    {course.name || course.title}
                  </h3>
                  <p style={{ fontFamily: "'Comic Neue', cursive", color: '#A16207', fontSize: '0.9rem', marginBottom: '16px', lineHeight: 1.5, height: '40px', overflow: 'hidden' }}>
                    {course.desc || course.subtitle}
                  </p>

                  {/* Features */}
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(course.features || []).slice(0, 3).map(f => (
                      <li key={f} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <Check size={18} className="text-emerald-500" />
                        <span style={{ fontFamily: "'Comic Neue', cursive", fontSize: '0.9rem', color: '#78350F' }}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Price + CTA */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1.5px solid #F5E6C8', marginTop: 'auto' }}>
                    <div>
                      <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '1.5rem', color: '#78350F' }}>
                        KES {(course.price || 0).toLocaleString()}
                      </div>
                      <div style={{ fontFamily: "'Comic Neue', cursive", fontSize: '0.78rem', color: '#A16207' }}>per person</div>
                    </div>
                    <button
                      onClick={() => (physical ? openCohortModal(course) : openCourseModal(course))}
                      style={{
                        fontFamily: "'Baloo 2', cursive",
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        background: physical ? 'linear-gradient(135deg, #065f46, #059669)' : `linear-gradient(135deg, ${color}, #F59E0B)`,
                        color: '#fff',
                        border: 'none',
                        padding: '11px 24px',
                        borderRadius: '999px',
                        cursor: 'pointer',
                        boxShadow: physical ? '0 6px 18px rgba(5,150,105,0.35)' : `0 6px 18px ${color}44`,
                        transition: 'opacity 0.2s, transform 0.2s',
                      }}
                      onMouseEnter={e => { (e.currentTarget).style.opacity = '0.88'; (e.currentTarget).style.transform = 'translateY(-2px)'; }}
                      onMouseLeave={e => { (e.currentTarget).style.opacity = '1'; (e.currentTarget).style.transform = 'translateY(0)'; }}
                      aria-label={physical ? `Join cohort for ${course.name}` : `Enrol in ${course.name}`}
                    >
                      {physical ? 'Join cohort' : 'Enrol now'}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Group / Corporate note */}
        <div className="fade-up" style={{
          textAlign: 'center',
          marginTop: '48px',
          padding: '24px',
          background: '#fff',
          borderRadius: '20px',
          border: '2px solid #F5E6C8',
        }}>
          <p style={{ fontFamily: "'Comic Neue', cursive", color: '#A16207', fontSize: '0.95rem', margin: '0 0 16px' }}>
            <strong style={{ color: '#78350F', fontFamily: "'Baloo 2', cursive" }}>Planning a group or team-building event?</strong>
            {' '}We offer special group discounts for 5+ students.{' '}
            <a href="#contact" style={{ color: '#F59E0B', fontWeight: 700, textDecoration: 'none' }}>Contact us →</a>
          </p>
          <button
            onClick={() => {
              goToCourses();
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
            style={{
              fontFamily: "'Baloo 2', cursive",
              fontWeight: 700,
              background: '#78350F',
              color: '#fff',
              padding: '12px 32px',
              borderRadius: '999px',
              textDecoration: 'none',
              fontSize: '1rem',
              transition: 'all 0.2s',
              cursor: 'pointer',
              display: 'inline-block',
              border: 'none',
              boxShadow: '0 6px 15px rgba(120, 53, 15, 0.2)'
            }}
            onMouseEnter={e => { (e.currentTarget).style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { (e.currentTarget).style.transform = 'translateY(0)'; }}
          >
            Explore Courses Hub →
          </button>
        </div>
      </div>

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
    </section>
  );
}

