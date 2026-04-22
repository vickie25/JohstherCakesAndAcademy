import { useState, useEffect } from 'react';
import {
  Plus,
  Clock,
  Edit2,
  Trash2,
  Loader2,
  Search,
  LayoutGrid,
  List,
  ChevronRight,
  X,
  Video,
  Image as ImageIcon,
  Users,
  Laptop,
  Building2,
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from '@/lib/utils';
import { apiRequest, apiUploadFormData, formatCurrency, resolvePublicUploadUrl } from '@/lib/api';

// Data is fetched exclusively from the API

interface CourseLessonRow {
  id: number;
  title: string;
  video_url: string;
  sort_order: number;
}

type CourseDelivery = 'online' | 'physical';

interface Course {
  id: number;
  title: string;
  subtitle: string;
  price: number;
  duration: string;
  sessions: string;
  image_url: string;
  brand_color: string;
  features: string[];
  tag: string;
  is_active: boolean;
  level: 'beginner' | 'intermediate' | 'advanced';
  promo_video_url?: string | null;
  lessons?: CourseLessonRow[];
  delivery_type?: CourseDelivery;
}

type LessonDraft = {
  key: string;
  dbId?: number;
  title: string;
  file: File | null;
  video_url?: string;
};

interface Batch {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  price: number;
  status: string;
  course_name: string;
  capacity: number;
  enrolled: number;
}

interface BatchStudentRow {
  id: number;
  student_name: string;
  email: string;
  phone: string;
  course_name: string;
  status: string;
  payment_status: string;
  created_at: string;
}

export type AcademyManagerSection = 'courses' | 'batches';

interface AcademyManagerProps {
  /** From admin sidebar: show only this area (no internal tab switcher). */
  section?: AcademyManagerSection;
}

export default function AcademyManager({ section }: AcademyManagerProps) {
  const [activeSubTab, setActiveSubTab] = useState<'Batches' | 'Courses'>(() =>
    section === 'batches' ? 'Batches' : 'Courses'
  );
  const [loading, setLoading] = useState(true);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);

  const [courseForm, setCourseForm] = useState({
    title: '', subtitle: '', price: '', duration: '', sessions: '12 lessons',
    image_url: '', level: 'beginner' as 'beginner' | 'intermediate' | 'advanced', is_active: true, tag: '',
    promo_video_url: '',
    delivery_type: 'online' as CourseDelivery,
  });

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [promoFile, setPromoFile] = useState<File | null>(null);
  const [lessonsDraft, setLessonsDraft] = useState<LessonDraft[]>([]);
  const [savingCourse, setSavingCourse] = useState(false);

  const [batchStudentsOpen, setBatchStudentsOpen] = useState(false);
  const [batchStudentsLoading, setBatchStudentsLoading] = useState(false);
  const [batchStudentsContext, setBatchStudentsContext] = useState<Batch | null>(null);
  const [batchStudentsRows, setBatchStudentsRows] = useState<BatchStudentRow[]>([]);

  const [batchForm, setBatchForm] = useState({
    name: '', course_name: '', start_date: '', end_date: '',
    capacity: '20', price: '', status: 'Active'
  });

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [batchRes, courseRes] = await Promise.all([
        apiRequest<Batch[]>('/academy/batches'),
        apiRequest<Course[]>('/courses?active=false')
      ]);

      if (batchRes.data) {
        setBatches(batchRes.data.map((b: any) => ({
          ...b,
          capacity: b.capacity || 20,
          enrolled: b.enrolled || 0,
          end_date: b.end_date || new Date().toISOString()
        })));
      } else if (batchRes.error) {
        console.error('Batch fetch error:', batchRes.error);
        setBatches([]);
      }

      if (courseRes.data) {
        setCourses(courseRes.data.map((c: any) => {
          const lvl = c.level || (['beginner', 'intermediate', 'advanced'].includes(c.tag) ? c.tag : null);
          const dt = c.delivery_type === 'physical' ? 'physical' : 'online';
          return {
            ...c,
            level: (lvl || 'beginner') as Course['level'],
            lessons: c.lessons || [],
            delivery_type: dt as CourseDelivery,
          };
        }));
      } else if (courseRes.error) {
        console.error('Course fetch error:', courseRes.error);
        setCourses([]);
      }
    } catch (error) {
      console.error('Error fetching academy data:', error);
      setBatches([]);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    if (section === 'batches') setActiveSubTab('Batches');
    else if (section === 'courses') setActiveSubTab('Courses');
  }, [section]);

  const openBatchStudents = async (batch: Batch) => {
    setBatchStudentsContext(batch);
    setBatchStudentsOpen(true);
    setBatchStudentsLoading(true);
    setBatchStudentsRows([]);
    const { data, error } = await apiRequest<BatchStudentRow[]>(`/academy/batches/${batch.id}/registrations`);
    if (!error && data) setBatchStudentsRows(Array.isArray(data) ? data : []);
    setBatchStudentsLoading(false);
  };

  const handleOpenCourseModal = (course: Course | null = null) => {
    setThumbnailFile(null);
    setPromoFile(null);
    if (course) {
      setEditingCourse(course);
      setCourseForm({
        title: course.title,
        subtitle: course.subtitle,
        price: course.price.toString(),
        duration: course.duration,
        sessions: course.sessions || '12 lessons',
        image_url: course.image_url || '',
        level: course.level,
        is_active: course.is_active,
        tag: course.tag || '',
        promo_video_url: course.promo_video_url || '',
        delivery_type: course.delivery_type === 'physical' ? 'physical' : 'online',
      });
      setLessonsDraft(
        (course.lessons || []).map((l) => ({
          key: `db-${l.id}`,
          dbId: l.id,
          title: l.title,
          file: null,
          video_url: l.video_url,
        }))
      );
    } else {
      setEditingCourse(null);
      setCourseForm({
        title: '',
        subtitle: '',
        price: '',
        duration: '',
        sessions: '12 lessons',
        image_url: '',
        level: 'beginner',
        is_active: true,
        tag: '',
        promo_video_url: '',
        delivery_type: 'online',
      });
      setLessonsDraft([]);
    }
    setIsCourseModalOpen(true);
  };

  const addLessonDraft = () => {
    setLessonsDraft((prev) => [
      ...prev,
      { key: `new-${Date.now()}-${prev.length}`, title: `Lesson ${prev.length + 1}`, file: null },
    ]);
  };

  const removeLessonDraft = (key: string) => {
    setLessonsDraft((prev) => prev.filter((l) => l.key !== key));
  };

  const deletePersistedLesson = async (lesson: LessonDraft) => {
    if (!lesson.dbId || !editingCourse) return;
    if (!window.confirm('Remove this lesson from the course?')) return;
    const { error } = await apiRequest(`/courses/${editingCourse.id}/lessons/${lesson.dbId}`, { method: 'DELETE' });
    if (!error) {
      setLessonsDraft((prev) => prev.filter((l) => l.key !== lesson.key));
      fetchAll();
    }
  };

  const handleOpenBatchModal = (batch: Batch | null = null) => {
    if (batch) {
      setEditingBatch(batch);
      setBatchForm({
        name: batch.name, course_name: batch.course_name, start_date: batch.start_date.split('T')[0],
        end_date: batch.end_date.split('T')[0], capacity: batch.capacity.toString(),
        price: (batch.price || 0).toString(), status: batch.status
      });
    } else {
      setEditingBatch(null);
      setBatchForm({ name: '', course_name: courses[0]?.title || '', start_date: '', end_date: '', capacity: '20', price: '', status: 'Active' });
    }
    setIsBatchModalOpen(true);
  };

  const uploadCourseMedia = async (courseId: number, delivery: CourseDelivery) => {
    if (thumbnailFile) {
      const fd = new FormData();
      fd.append('thumbnail', thumbnailFile);
      const { error } = await apiUploadFormData(`/courses/${courseId}/thumbnail`, fd);
      if (error) throw new Error(error);
    }
    if (delivery !== 'online') return;
    if (promoFile) {
      const fd = new FormData();
      fd.append('promo', promoFile);
      const { error } = await apiUploadFormData(`/courses/${courseId}/promo-video`, fd);
      if (error) throw new Error(error);
    }
    for (let i = 0; i < lessonsDraft.length; i++) {
      const row = lessonsDraft[i];
      if (!row.file) continue;
      const fd = new FormData();
      fd.append('video', row.file);
      fd.append('title', row.title);
      fd.append('sort_order', String(i));
      const { error } = await apiUploadFormData(`/courses/${courseId}/lessons`, fd);
      if (error) throw new Error(error);
    }
  };

  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCourse(true);
    try {
      const jsonBody = {
        title: courseForm.title,
        subtitle: courseForm.subtitle,
        price: parseFloat(courseForm.price),
        duration: courseForm.duration,
        sessions: courseForm.sessions || '12 lessons',
        image_url: (courseForm.image_url || '').trim() || '/academy-class.png',
        brand_color: '#F59E0B',
        features: [] as string[],
        tag: (courseForm.tag || '').trim() || courseForm.level,
        is_active: courseForm.is_active,
        promo_video_url: (courseForm.promo_video_url || '').trim() || null,
        delivery_type: courseForm.delivery_type,
      };

      const endpoint = editingCourse ? `/courses/${editingCourse.id}` : '/courses';
      const method = editingCourse ? 'PUT' : 'POST';
      const { data, error } = await apiRequest<{ id: number }>(endpoint, {
        method,
        body: JSON.stringify(jsonBody),
      });
      if (error || !data) {
        window.alert(error || 'Could not save course');
        return;
      }
      const courseId = (data as unknown as { id: number }).id ?? editingCourse!.id;
      await uploadCourseMedia(courseId, courseForm.delivery_type);
      setIsCourseModalOpen(false);
      setThumbnailFile(null);
      setPromoFile(null);
      setLessonsDraft([]);
      await fetchAll();
    } catch (err) {
      console.error(err);
      window.alert(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setSavingCourse(false);
    }
  };

  const handleBatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = editingBatch ? `/academy/batches/${editingBatch.id}` : '/academy/batches';
    const method = editingBatch ? 'PUT' : 'POST';
    const { data } = await apiRequest(endpoint, {
      method,
      body: JSON.stringify({ ...batchForm, capacity: parseInt(batchForm.capacity), price: parseFloat(batchForm.price || '0') })
    });
    if (data) { setIsBatchModalOpen(false); fetchAll(); }
  };

  const deleteBatch = async (id: number) => {
    if (confirm('Remove batch?')) {
      await apiRequest(`/academy/batches/${id}`, { method: 'DELETE' });
      fetchAll();
    }
  };

  const deleteCourse = async (id: number) => {
    if (confirm('Remove course?')) {
      await apiRequest(`/courses/${id}`, { method: 'DELETE' });
      fetchAll();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-[DM Sans]">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-[34px] font-bold text-[var(--color-text-primary)]">
            {section === 'courses' || (!section && activeSubTab === 'Courses')
              ? 'Courses'
              : 'Batches'}
          </h1>
          <p className="text-[14px] text-[var(--color-text-secondary)]">
            {section === 'courses' || (!section && activeSubTab === 'Courses')
              ? 'Create each course, add lessons, and upload a video per lesson. Active courses appear on the public Courses page with lesson playback.'
              : 'Manage intakes linked to a course. Open a batch to see every student registered for that specific intake.'}
          </p>
        </div>
        <Button
           onClick={() => activeSubTab === 'Batches' ? handleOpenBatchModal() : handleOpenCourseModal()}
           className="bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-dark)] text-white rounded-[var(--radius-sm)] font-medium px-6 h-[44px] shadow-[var(--shadow-btn)]"
        >
          <Plus size={18} className="mr-2" />
          {activeSubTab === 'Batches' ? 'New Batch' : 'Add Course'}
        </Button>
      </div>

      <div className="flex items-center justify-between bg-[var(--color-bg-surface)] p-2 rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] flex-wrap gap-3">
        {!section ? (
          <div className="flex items-center bg-[var(--color-bg-muted)] p-1 rounded-full">
            <button
              type="button"
              onClick={() => setActiveSubTab('Courses')}
              className={cn(
                "px-6 py-2 text-[14px] font-semibold rounded-full transition-all",
                activeSubTab === 'Courses' ? "bg-white text-[var(--color-accent-primary)] shadow-sm" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              )}
            >
              Courses
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('Batches')}
              className={cn(
                "px-6 py-2 text-[14px] font-semibold rounded-full transition-all",
                activeSubTab === 'Batches' ? "bg-white text-[var(--color-accent-primary)] shadow-sm" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              )}
            >
              Batches
            </button>
          </div>
        ) : (
          <div className="text-[12px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider px-2">
            {section === 'courses' ? 'Course catalog' : 'Intake batches'}
          </div>
        )}

        <div className="flex items-center gap-4 group ml-auto">
          {activeSubTab === 'Courses' && (
            <>
              <div className="relative w-64 max-md:hidden">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" size={16} />
                <Input
                  type="text"
                  placeholder="Search courses..."
                  className="w-full h-[40px] pl-10 pr-4 bg-[var(--color-bg-muted)] border-transparent rounded-full text-[14px] outline-none focus:bg-white focus:border-[var(--color-border)] focus:ring-[var(--color-accent-primary)]/15 transition-all"
                />
              </div>
              <div className="flex items-center bg-[var(--color-bg-muted)] rounded-full p-1">
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={cn("p-2 rounded-full", viewMode === 'table' ? "bg-white text-[var(--color-accent-primary)] shadow-sm" : "text-[var(--color-text-secondary)]")}
                >
                  <List size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={cn("p-2 rounded-full", viewMode === 'grid' ? "bg-white text-[var(--color-accent-primary)] shadow-sm" : "text-[var(--color-text-secondary)]")}
                >
                  <LayoutGrid size={18} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-[var(--color-text-secondary)]">
          <Loader2 size={32} className="animate-spin mb-4 text-[var(--color-accent-primary)]" />
          <p className="text-[14px] font-medium">Synchronizing campus data...</p>
        </div>
      ) : activeSubTab === 'Batches' ? (
        <div className="bg-[var(--color-bg-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch Name</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Enrolled</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batches.map(batch => (
                  <TableRow key={batch.id}>
                    <TableCell className="font-semibold text-[var(--color-text-primary)] py-5">{batch.name}</TableCell>
                    <TableCell className="text-[var(--color-text-secondary)]">{batch.course_name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col text-[12px] text-[var(--color-text-secondary)]">
                        <span className="font-medium">{new Date(batch.start_date).toLocaleDateString()}</span>
                        <ChevronRight size={12} className="rotate-90 my-0.5 ml-2" />
                        <span className="font-medium">{new Date(batch.end_date).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1.5 min-w-[100px]">
                        <div className="flex justify-between text-[11px] font-bold text-[var(--color-text-secondary)]">
                          <span>{batch.enrolled}/{batch.capacity}</span>
                        </div>
                        <div className="w-24 h-1.5 bg-[var(--color-bg-muted)] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[var(--color-accent-primary)] rounded-full transition-all" 
                            style={{ width: `${(batch.enrolled / batch.capacity) * 100}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={batch.status.toLowerCase() === 'active' ? 'active' : 'inactive'} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          title="Students in this batch"
                          onClick={() => openBatchStudents(batch)}
                          className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)]"
                        >
                          <Users size={16} />
                        </button>
                        <button type="button" onClick={() => handleOpenBatchModal(batch)} className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)]"><Edit2 size={16} /></button>
                        <button type="button" onClick={() => deleteBatch(batch.id)} className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-danger)]"><Trash2 size={16} /></button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        viewMode === 'table' ? (
          <div className="bg-[var(--color-bg-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                  <TableHead>Course Title</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Lessons</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map(course => (
                    <TableRow key={course.id}>
                      <TableCell className="py-5">
                        <div className="flex items-center gap-3">
                          <img src={resolvePublicUploadUrl(course.image_url)} alt="" className="w-10 h-10 rounded-lg object-cover" />
                          <span className="font-semibold text-[var(--color-text-primary)]">{course.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            'inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide',
                            course.delivery_type === 'physical'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-sky-100 text-sky-800'
                          )}
                        >
                          {course.delivery_type === 'physical' ? 'Physical' : 'Online'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={course.level} label={course.level.toUpperCase()} />
                      </TableCell>
                      <TableCell className="text-[var(--color-text-secondary)] text-[13px]">
                        {course.delivery_type === 'physical'
                          ? '—'
                          : `${course.lessons?.length ?? 0} video${(course.lessons?.length ?? 0) === 1 ? '' : 's'}`}
                      </TableCell>
                      <TableCell className="text-[var(--color-text-secondary)] font-medium">{course.duration}</TableCell>
                      <TableCell className="font-bold text-[var(--color-text-primary)]">{formatCurrency(course.price)}</TableCell>
                      <TableCell>
                         <StatusBadge status={course.is_active ? 'active' : 'inactive'} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleOpenCourseModal(course)} className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)]"><Edit2 size={16} /></button>
                          <button onClick={() => deleteCourse(course.id)} className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-danger)]"><Trash2 size={16} /></button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <div key={course.id} className="group bg-[var(--color-bg-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] overflow-hidden border border-[var(--color-border)] hover:border-[var(--color-accent-primary)]/50 transition-all duration-300">
                <div className="aspect-video w-full overflow-hidden relative">
                  <img src={resolvePublicUploadUrl(course.image_url)} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                    <StatusBadge status={course.level} showDot={true} className="bg-white/90 backdrop-blur-sm shadow-sm" />
                    <span
                      className={cn(
                        'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm',
                        course.delivery_type === 'physical' ? 'bg-emerald-600 text-white' : 'bg-sky-600 text-white'
                      )}
                    >
                      {course.delivery_type === 'physical' ? 'Physical' : 'Online'}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
                    <button onClick={() => handleOpenCourseModal(course)} className="p-2 bg-white rounded-full text-[var(--color-text-primary)] shadow-sm hover:text-[var(--color-accent-primary)]"><Edit2 size={16} /></button>
                    <button onClick={() => deleteCourse(course.id)} className="p-2 bg-white rounded-full text-[var(--color-danger)] shadow-sm hover:scale-110 transition-transform"><Trash2 size={16} /></button>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-[18px] font-bold text-[var(--color-text-primary)] mb-2 group-hover:text-[var(--color-accent-primary)] transition-colors">{course.title}</h3>
                  <p className="text-[14px] text-[var(--color-text-secondary)] line-clamp-2 mb-4 leading-relaxed">{course.subtitle}</p>
                  <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-[13px] text-[var(--color-text-secondary)]">
                      <Clock size={14} />
                      <span className="font-medium">{course.duration}</span>
                    </div>
                    <span className="font-bold text-[var(--color-text-primary)] text-[16px]">{formatCurrency(course.price)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Course Modal */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsCourseModalOpen(false)} />
          <div className="relative w-full max-w-[560px] bg-white h-full shadow-2xl flex flex-col p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{editingCourse ? 'Edit Course' : 'New Course'}</h2>
              <button type="button" onClick={() => setIsCourseModalOpen(false)} aria-label="Close"><X /></button>
            </div>
            <form onSubmit={handleCourseSubmit} className="space-y-4 flex-1 flex flex-col">
              <Input placeholder="Course Title" value={courseForm.title} onChange={e => setCourseForm({ ...courseForm, title: e.target.value })} required />
              <textarea className="w-full border p-2 rounded min-h-[80px]" placeholder="Subtitle" value={courseForm.subtitle} onChange={e => setCourseForm({ ...courseForm, subtitle: e.target.value })} required />

              <div className="rounded-lg border border-[var(--color-border)] p-3 space-y-2 bg-[var(--color-bg-muted)]/30">
                <p className="text-[12px] font-bold text-[var(--color-text-secondary)]">Course format</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCourseForm((f) => ({ ...f, delivery_type: 'online' }))}
                    className={cn(
                      'flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-[13px] font-semibold transition-all',
                      courseForm.delivery_type === 'online'
                        ? 'border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)]'
                        : 'border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:border-[var(--color-accent-primary)]/40'
                    )}
                  >
                    <Laptop size={18} className="shrink-0" />
                    Online
                  </button>
                  <button
                    type="button"
                    onClick={() => setCourseForm((f) => ({ ...f, delivery_type: 'physical' }))}
                    className={cn(
                      'flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-[13px] font-semibold transition-all',
                      courseForm.delivery_type === 'physical'
                        ? 'border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)]'
                        : 'border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:border-[var(--color-accent-primary)]/40'
                    )}
                  >
                    <Building2 size={18} className="shrink-0" />
                    Physical
                  </button>
                </div>
                <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                  {courseForm.delivery_type === 'online'
                    ? 'Students watch uploaded lesson videos on the site.'
                    : 'Students see this course on the public Courses page with Join cohort; their details are saved to Registrations when they apply.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input type="number" placeholder="Price (KSh)" value={courseForm.price} onChange={e => setCourseForm({ ...courseForm, price: e.target.value })} required />
                <Input placeholder="Duration (e.g. 4 Weeks)" value={courseForm.duration} onChange={e => setCourseForm({ ...courseForm, duration: e.target.value })} required />
              </div>
              <Input placeholder="Sessions label (e.g. 12 lessons)" value={courseForm.sessions} onChange={e => setCourseForm({ ...courseForm, sessions: e.target.value })} />

              <div className="space-y-2 rounded-lg border border-[var(--color-border)] p-3 bg-[var(--color-bg-muted)]/30">
                <label className="text-[12px] font-bold text-[var(--color-text-secondary)] flex items-center gap-2">
                  <ImageIcon size={14} /> Cover image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="text-[13px] w-full"
                  onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                />
                {thumbnailFile && <p className="text-[12px] text-[var(--color-text-secondary)]">Selected: {thumbnailFile.name}</p>}
                <Input
                  placeholder="Or paste image URL (optional if you upload)"
                  value={courseForm.image_url}
                  onChange={e => setCourseForm({ ...courseForm, image_url: e.target.value })}
                />
              </div>

              {courseForm.delivery_type === 'online' && (
              <div className="space-y-2 rounded-lg border border-[var(--color-border)] p-3 bg-[var(--color-bg-muted)]/30">
                <label className="text-[12px] font-bold text-[var(--color-text-secondary)] flex items-center gap-2">
                  <Video size={14} /> Course intro / promo video
                </label>
                <input
                  type="file"
                  accept="video/*"
                  className="text-[13px] w-full"
                  onChange={(e) => setPromoFile(e.target.files?.[0] || null)}
                />
                {promoFile && <p className="text-[12px] text-[var(--color-text-secondary)]">Selected: {promoFile.name}</p>}
                {editingCourse?.promo_video_url && !promoFile && (
                  <video src={resolvePublicUploadUrl(editingCourse.promo_video_url)} className="w-full max-h-40 rounded border" controls muted />
                )}
              </div>
              )}

              {courseForm.delivery_type === 'online' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[12px] font-bold text-[var(--color-text-secondary)]">Lessons (upload a video per lesson)</label>
                  <Button type="button" variant="outline" size="sm" className="h-8 text-[12px]" onClick={addLessonDraft}>
                    <Plus size={14} className="mr-1" /> Add lesson
                  </Button>
                </div>
                {lessonsDraft.length === 0 && (
                  <p className="text-[12px] text-[var(--color-text-secondary)]">No lessons yet. Add a row, set the title, then choose a video file. Save the course to upload.</p>
                )}
                <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                  {lessonsDraft.map((row, idx) => (
                    <div key={row.key} className="rounded-lg border border-[var(--color-border)] p-3 space-y-2 bg-white">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-[var(--color-text-secondary)]">Lesson {idx + 1}</span>
                        <button
                          type="button"
                          className="text-[var(--color-danger)] p-1 hover:bg-red-50 rounded"
                          onClick={() => (row.dbId ? deletePersistedLesson(row) : removeLessonDraft(row.key))}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <Input
                        placeholder="Lesson title"
                        value={row.title}
                        onChange={(e) =>
                          setLessonsDraft((prev) =>
                            prev.map((l) => (l.key === row.key ? { ...l, title: e.target.value } : l))
                          )
                        }
                      />
                      <input
                        type="file"
                        accept="video/*"
                        className="text-[12px] w-full"
                        onChange={(e) =>
                          setLessonsDraft((prev) =>
                            prev.map((l) => (l.key === row.key ? { ...l, file: e.target.files?.[0] || null } : l))
                          )
                        }
                      />
                      {row.file && <p className="text-[11px] text-emerald-700">New file: {row.file.name}</p>}
                      {row.video_url && !row.file && (
                        <video src={resolvePublicUploadUrl(row.video_url)} className="w-full max-h-28 rounded border" controls muted />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              )}

              <select className="w-full border p-2 rounded" value={courseForm.level} onChange={e => setCourseForm({ ...courseForm, level: e.target.value as Course['level'] })}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <label className="flex items-center gap-2 text-[13px] cursor-pointer">
                <input
                  type="checkbox"
                  checked={courseForm.is_active}
                  onChange={(e) => setCourseForm({ ...courseForm, is_active: e.target.checked })}
                />
                Active (visible on site)
              </label>
              <Button
                type="submit"
                disabled={savingCourse}
                className="w-full bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-dark)] text-white mt-auto"
              >
                {savingCourse ? 'Saving…' : 'Save course & uploads'}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Batch students panel */}
      {batchStudentsOpen && batchStudentsContext && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => { setBatchStudentsOpen(false); setBatchStudentsContext(null); }}
          />
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col">
            <div className="p-6 border-b border-[var(--color-border)] flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Students in batch</h2>
                <p className="text-[13px] text-[var(--color-text-secondary)] mt-1">{batchStudentsContext.name}</p>
                <p className="text-[12px] text-[var(--color-text-secondary)] mt-0.5">{batchStudentsContext.course_name}</p>
              </div>
              <button
                type="button"
                className="p-2 rounded-lg hover:bg-[var(--color-bg-muted)]"
                onClick={() => { setBatchStudentsOpen(false); setBatchStudentsContext(null); }}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {batchStudentsLoading ? (
                <div className="py-16 flex flex-col items-center text-[var(--color-text-secondary)]">
                  <Loader2 className="animate-spin mb-3 text-[var(--color-accent-primary)]" size={28} />
                  <p className="text-[14px]">Loading students…</p>
                </div>
              ) : batchStudentsRows.length === 0 ? (
                <p className="text-[14px] text-[var(--color-text-secondary)] text-center py-12">
                  No registrations linked to this batch yet. Registrations must include this batch when students sign up.
                </p>
              ) : (
                <ul className="space-y-3">
                  {batchStudentsRows.map((row) => (
                    <li
                      key={row.id}
                      className="rounded-lg border border-[var(--color-border)] p-4 bg-[var(--color-bg-muted)]/20"
                    >
                      <p className="font-semibold text-[var(--color-text-primary)]">{row.student_name}</p>
                      <p className="text-[12px] text-[var(--color-text-secondary)] mt-1">{row.email}</p>
                      {row.phone ? <p className="text-[12px] text-[var(--color-text-secondary)]">{row.phone}</p> : null}
                      <div className="flex flex-wrap gap-2 mt-2 text-[11px] font-bold uppercase tracking-wide">
                        <span className="px-2 py-0.5 rounded-full bg-white border border-[var(--color-border)]">{row.status}</span>
                        <span className="px-2 py-0.5 rounded-full bg-white border border-[var(--color-border)]">{row.payment_status}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Batch Modal */}
      {isBatchModalOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsBatchModalOpen(false)} />
          <div className="relative w-full max-w-[480px] bg-white h-full shadow-2xl flex flex-col p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{editingBatch ? 'Edit Batch' : 'New Batch'}</h2>
              <button onClick={() => setIsBatchModalOpen(false)}><X /></button>
            </div>
            <form onSubmit={handleBatchSubmit} className="space-y-4">
              <Input placeholder="Batch Name" value={batchForm.name} onChange={e => setBatchForm({...batchForm, name: e.target.value})} required />
              <select className="w-full border p-2 rounded" value={batchForm.course_name} onChange={e => setBatchForm({...batchForm, course_name: e.target.value})} required>
                {courses.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold">Start Date</label>
                  <Input type="date" value={batchForm.start_date} onChange={e => setBatchForm({...batchForm, start_date: e.target.value})} required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold">End Date</label>
                  <Input type="date" value={batchForm.end_date} onChange={e => setBatchForm({...batchForm, end_date: e.target.value})} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input type="number" placeholder="Capacity" value={batchForm.capacity} onChange={e => setBatchForm({...batchForm, capacity: e.target.value})} required />
                <Input type="number" placeholder="Price (KSh)" value={batchForm.price} onChange={e => setBatchForm({...batchForm, price: e.target.value})} />
              </div>
              <select className="w-full border p-2 rounded" value={batchForm.status} onChange={e => setBatchForm({...batchForm, status: e.target.value})} required>
                <option value="Active">Active</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Completed">Completed</option>
              </select>
              <Button type="submit" className="w-full bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-dark)] text-white">Save Batch</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
