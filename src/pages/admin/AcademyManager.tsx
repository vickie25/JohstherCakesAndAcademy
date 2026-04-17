import { useState, useEffect } from 'react';
import {
  Plus,
  Calendar,
  BookOpen,
  Clock,
  Edit2,
  Trash2,
  Loader2,
  Filter,
  Search,
  LayoutGrid,
  List,
  ChevronRight,
  X
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge, type StatusType } from "@/components/ui/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from '@/lib/utils';
import { apiRequest, formatCurrency } from '@/lib/api';

const MOCK_BATCHES: Batch[] = [
  { id: 1, name: 'Easter Intake 2026', start_date: '2026-04-20', end_date: '2026-05-20', price: 25000, status: 'Active', course_name: 'Advanced Baking', capacity: 20, enrolled: 12 },
  { id: 2, name: 'Summer Fast-track', start_date: '2026-06-01', end_date: '2026-06-15', price: 15000, status: 'Upcoming', course_name: 'Pastry Arts', capacity: 15, enrolled: 0 },
];

const MOCK_COURSES: Course[] = [
  { id: 1, title: 'Advanced Baking', subtitle: 'Master artisanal sourdough and pastries.', price: 45000, duration: '4 Weeks', sessions: '12 Sessions', image_url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=2000', brand_color: '#DAA520', features: [], tag: 'Popular', is_active: true, level: 'advanced', sessions: '12' },
  { id: 2, title: 'Pastry Arts', subtitle: 'French patisserie fundamentals.', price: 35000, duration: '2 Weeks', sessions: '6 Sessions', image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=2000', brand_color: '#FF69B4', features: [], tag: 'New', is_active: true, level: 'intermediate', sessions: '6' },
];

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
}

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

export default function AcademyManager() {
  const [activeSubTab, setActiveSubTab] = useState<'Batches' | 'Courses'>('Batches');
  const [loading, setLoading] = useState(true);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);

  const [courseForm, setCourseForm] = useState({
    title: '', subtitle: '', price: '', duration: '', sessions: '',
    image_url: '', level: 'beginner', is_active: true, tag: ''
  });

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
        console.warn('Using mock batches:', batchRes.error);
        setBatches(MOCK_BATCHES);
      }

      if (courseRes.data) {
        setCourses(courseRes.data.map((c: any) => ({
          ...c,
          level: c.level || 'beginner'
        })));
      } else if (courseRes.error) {
        console.warn('Using mock courses:', courseRes.error);
        setCourses(MOCK_COURSES);
      }
    } catch (error) {
      console.error('Error fetching academy data:', error);
      setBatches(MOCK_BATCHES);
      setCourses(MOCK_COURSES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleOpenCourseModal = (course: Course | null = null) => {
    if (course) {
      setEditingCourse(course);
      setCourseForm({
        title: course.title, subtitle: course.subtitle, price: course.price.toString(),
        duration: course.duration, sessions: course.sessions, image_url: course.image_url,
        level: course.level, is_active: course.is_active, tag: course.tag || ''
      });
    } else {
      setEditingCourse(null);
      setCourseForm({ title: '', subtitle: '', price: '', duration: '', sessions: '', image_url: '', level: 'beginner', is_active: true, tag: '' });
    }
    setIsCourseModalOpen(true);
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

  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = editingCourse ? `/courses/${editingCourse.id}` : '/courses';
    const method = editingCourse ? 'PUT' : 'POST';
    const { data } = await apiRequest(endpoint, {
      method,
      body: JSON.stringify({ ...courseForm, price: parseFloat(courseForm.price) })
    });
    if (data) { setIsCourseModalOpen(false); fetchAll(); }
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
            {activeSubTab === 'Batches' ? 'Academy Batches' : 'Course Management'}
          </h1>
          <p className="text-[14px] text-[var(--color-text-secondary)]">Control your campus intakes and digital learning hub.</p>
        </div>
        <Button
           onClick={() => activeSubTab === 'Batches' ? handleOpenBatchModal() : handleOpenCourseModal()}
           className="bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-dark)] text-white rounded-[var(--radius-sm)] font-medium px-6 h-[44px] shadow-[var(--shadow-btn)]"
        >
          <Plus size={18} className="mr-2" />
          {activeSubTab === 'Batches' ? 'New Batch' : 'Add Course'}
        </Button>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center justify-between bg-[var(--color-bg-surface)] p-2 rounded-[var(--radius-lg)] shadow-[var(--shadow-card)]">
        <div className="flex items-center bg-[var(--color-bg-muted)] p-1 rounded-full">
            <button
              onClick={() => setActiveSubTab('Batches')}
              className={cn(
                "px-6 py-2 text-[14px] font-semibold rounded-full transition-all",
                activeSubTab === 'Batches' ? "bg-white text-[var(--color-accent-primary)] shadow-sm" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              )}
            >
              Batches
            </button>
            <button
              onClick={() => setActiveSubTab('Courses')}
              className={cn(
                "px-6 py-2 text-[14px] font-semibold rounded-full transition-all",
                activeSubTab === 'Courses' ? "bg-white text-[var(--color-accent-primary)] shadow-sm" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              )}
            >
              Courses
            </button>
        </div>

        <div className="flex items-center gap-4 group">
            <div className="relative w-64 max-md:hidden">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" size={16} />
              <Input
                type="text"
                placeholder="Search academy..."
                className="w-full h-[40px] pl-10 pr-4 bg-[var(--color-bg-muted)] border-transparent rounded-full text-[14px] outline-none focus:bg-white focus:border-[var(--color-border)] focus:ring-[var(--color-accent-primary)]/15 transition-all"
              />
            </div>
            <div className="flex items-center bg-[var(--color-bg-muted)] rounded-full p-1">
              <button 
                onClick={() => setViewMode('table')}
                className={cn("p-2 rounded-full", viewMode === 'table' ? "bg-white text-[var(--color-accent-primary)] shadow-sm" : "text-[var(--color-text-secondary)]")}
              >
                <List size={18} />
              </button>
              <button 
                onClick={() => setViewMode('grid')}
                className={cn("p-2 rounded-full", viewMode === 'grid' ? "bg-white text-[var(--color-accent-primary)] shadow-sm" : "text-[var(--color-text-secondary)]")}
              >
                <LayoutGrid size={18} />
              </button>
            </div>
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
                        <button onClick={() => handleOpenBatchModal(batch)} className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)]"><Edit2 size={16} /></button>
                        <button onClick={() => deleteBatch(batch.id)} className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-danger)]"><Trash2 size={16} /></button>
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
                    <TableHead>Level</TableHead>
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
                          <img src={course.image_url} className="w-10 h-10 rounded-lg object-cover" />
                          <span className="font-semibold text-[var(--color-text-primary)]">{course.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={course.level} label={course.level.toUpperCase()} />
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
                  <img src={course.image_url} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute top-3 left-3">
                    <StatusBadge status={course.level} showDot={true} className="bg-white/90 backdrop-blur-sm shadow-sm" />
                  </div>
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
                    <button onClick={() => handleOpenCourseModal(course)} className="p-2 bg-white rounded-full text-[var(--color-text-primary)] shadow-sm hover:text-[var(--color-accent-primary)]"><Edit2 size={16} /></button>
                    <button onClick={() => deleteCourse(course.id)} className="p-2 bg-white rounded-full text-[var(--color-danger)] shadow-sm hover:scale-110 transition-transform"><Trash2 size={16} /></button>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-[18px] font-bold text-[var(--color-text-primary)] mb-2 group-hover:text-[var(--color-accent-primary)] transition-colors">{course.title}</h3>
                  <p className="text-[14px] text-[var(--color-text-secondary)] line-clamp-2 mb-4 leading-relaxed">{course.subtitle}</p>
                  <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
                      <Clock size={14} />
                      <span className="text-[13px] font-medium">{course.duration}</span>
                    </div>
                    <span className="font-bold text-[var(--color-text-primary)] text-[16px]">{formatCurrency(course.price)}</span>
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
          <div className="relative w-full max-w-[480px] bg-white h-full shadow-2xl flex flex-col p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{editingCourse ? 'Edit Course' : 'New Course'}</h2>
              <button onClick={() => setIsCourseModalOpen(false)}><X /></button>
            </div>
            <form onSubmit={handleCourseSubmit} className="space-y-4">
              <Input placeholder="Course Title" value={courseForm.title} onChange={e => setCourseForm({...courseForm, title: e.target.value})} required />
              <textarea className="w-full border p-2 rounded" placeholder="Subtitle" value={courseForm.subtitle} onChange={e => setCourseForm({...courseForm, subtitle: e.target.value})} required />
              <div className="grid grid-cols-2 gap-4">
                <Input type="number" placeholder="Price (KSh)" value={courseForm.price} onChange={e => setCourseForm({...courseForm, price: e.target.value})} required />
                <Input placeholder="Duration (e.g. 4 Weeks)" value={courseForm.duration} onChange={e => setCourseForm({...courseForm, duration: e.target.value})} required />
              </div>
              <Input placeholder="Image URL" value={courseForm.image_url} onChange={e => setCourseForm({...courseForm, image_url: e.target.value})} required />
              <select className="w-full border p-2 rounded" value={courseForm.level} onChange={e => setCourseForm({...courseForm, level: e.target.value as any})}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <Button type="submit" className="w-full bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-dark)] text-white">Save Course</Button>
            </form>
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
