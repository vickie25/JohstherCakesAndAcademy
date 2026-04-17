import { useState, useEffect } from 'react';
import { 
  MessageCircle, Star, Search, Filter, Plus, Edit2, Trash2, 
  MoreVertical, CheckCircle2, ShieldCheck, Loader2, AlertCircle,
  TrendingUp, Users, Award, Clock
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { apiRequest } from '@/lib/api';

const MOCK_TESTIMONIALS: Testimonial[] = [
  { id: 1, name: 'Mercy Njeri', role: 'Home Baker', content: 'Johsther Academy changed my life! The advanced baking course was intense but rewarding.', rating: 5, image_url: '', is_featured: true, is_active: true, created_at: new Date().toISOString() },
  { id: 2, name: 'David Maina', role: 'Entrepreneur', content: 'Best cakes in Nairobi, hands down. The Victorian Velvet is a masterpiece.', rating: 5, image_url: '', is_featured: false, is_active: true, created_at: new Date().toISOString() },
];

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  image_url: string;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
}

export default function TestimonialManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const { data, error } = await apiRequest<Testimonial[]>('/testimonials?active=false');
      if (data) {
        setTestimonials(data);
      } else if (error) {
        console.warn('Backend connection failed, using mock testimonials:', error);
        setTestimonials(MOCK_TESTIMONIALS);
      }
    } catch (error) {
      console.error('Error in fetchTestimonials:', error);
      setTestimonials(MOCK_TESTIMONIALS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleToggleActive = async (id: number, currentData: Testimonial) => {
    const { data } = await apiRequest(`/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...currentData, is_active: !currentData.is_active })
    });
    if (data) fetchTestimonials();
  };

  const handleToggleFeatured = async (id: number, currentData: Testimonial) => {
    const { data } = await apiRequest(`/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...currentData, is_featured: !currentData.is_featured })
    });
    if (data) fetchTestimonials();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    const { data } = await apiRequest(`/testimonials/${id}`, { method: 'DELETE' });
    if (data) fetchTestimonials();
  };

  const filteredTestimonials = testimonials.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: 'Total Reviews', value: testimonials.length, icon: MessageCircle, tint: 'bg-[#E6F0FA] text-[#2A5A8A]' },
    { label: 'Published', value: testimonials.filter(t => t.is_active).length, icon: CheckCircle2, tint: 'bg-[#E8F5E8] text-[#3A7A3A]' },
    { label: 'Featured', value: testimonials.filter(t => t.is_featured).length, icon: Award, tint: 'bg-[#FFF3E0] text-[var(--color-accent-primary)]' },
    { label: 'Avg. Rating', value: '4.8', icon: Star, tint: 'bg-[#FDFBF9] text-[#A05A00]' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-[DM Sans]">
        {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-[34px] font-bold text-[var(--color-text-primary)]">Reviews Wall</h1>
          <p className="text-[14px] text-[var(--color-text-secondary)]">Curate the social proof displayed on the public landing page.</p>
        </div>
        <Button 
          className="bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-dark)] text-white font-semibold text-[13px] px-6 h-[44px] shadow-[var(--shadow-btn)]"
        >
          <Plus size={18} className="mr-2" />
          Add Review
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-[var(--color-bg-surface)] p-6 rounded-[var(--radius-lg)] shadow-[var(--shadow-card)]">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.tint} mb-4`}>
                <Icon size={20} />
              </div>
              <p className="text-[var(--color-text-secondary)] text-[13px] font-medium mb-1">{stat.label}</p>
              <p className="font-display text-[26px] font-bold text-[var(--color-text-primary)]">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-[var(--color-bg-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] overflow-hidden">
        <div className="p-6 border-b border-[var(--color-border)] flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
             <h2 className="font-display text-[20px] font-bold text-[var(--color-text-primary)] whitespace-nowrap">Feedback Wall</h2>
             <div className="relative w-64 max-md:hidden">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" size={16} />
                <Input 
                  type="text" 
                  placeholder="Search reviews..." 
                  className="w-full h-[36px] pl-10 pr-4 bg-[var(--color-bg-muted)] border-transparent rounded-full text-[13px] outline-none focus:bg-white focus:border-[var(--color-border)] transition-all"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
             </div>
          </div>
          <Button variant="ghost" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] font-semibold text-[13px]">
            <Filter size={16} className="mr-2" />
            Filter
          </Button>
        </div>

        <div className="w-full">
           {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-[var(--color-text-secondary)]">
              <Loader2 size={32} className="animate-spin mb-4 text-[var(--color-accent-primary)]" />
              <p className="text-[14px] font-medium">Synchronizing social proof...</p>
            </div>
          ) : filteredTestimonials.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reviewer</TableHead>
                  <TableHead>Feedback</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTestimonials.map(test => (
                  <TableRow key={test.id} className="hover:bg-[var(--color-bg-base)] transition-colors group">
                    <TableCell className="py-5">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-10 h-10 border-2 border-white shadow-sm shrink-0">
                          <AvatarImage src={test.image_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${test.name}`} />
                          <AvatarFallback>{test.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-[14px] font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                             {test.name}
                             {test.is_featured && <ShieldCheck size={14} className="text-[#A05A00]" />}
                          </p>
                          <p className="text-[12px] text-[var(--color-text-secondary)]">{test.role}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[300px]">
                      <p className="text-[13px] text-[var(--color-text-secondary)] line-clamp-2 leading-relaxed italic">"{test.content}"</p>
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                             <Star key={i} size={12} className={cn(
                               "transition-all duration-300",
                               i < test.rating ? "fill-[var(--color-accent-primary)] text-[var(--color-accent-primary)]" : "text-[var(--color-bg-muted)]"
                             )} />
                          ))}
                       </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                         <button 
                            onClick={() => handleToggleActive(test.id, test)}
                            className={cn(
                              "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border",
                              test.is_active ? 'bg-[#E8F5E8] text-[#3A7A3A] border-[#3A7A3A]/10' : 'bg-[var(--color-bg-muted)] text-[var(--color-text-secondary)] border-transparent'
                            )}
                         >
                            {test.is_active ? 'Published' : 'Hidden'}
                         </button>
                         <button 
                            onClick={() => handleToggleFeatured(test.id, test)}
                            className={cn(
                              "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border",
                              test.is_featured ? 'bg-[#FFF3E0] text-[var(--color-accent-primary)] border-[var(--color-accent-primary)]/10' : 'text-[var(--color-text-secondary)] border-transparent text-sm opacity-50'
                            )}
                         >
                            {test.is_featured ? '⭐ Featured' : 'Feature'}
                         </button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                       <div className="flex items-center justify-end gap-2 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => handleDelete(test.id)} className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-danger)] transition-colors">
                           <Trash2 size={16} />
                         </button>
                         <button className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] transition-colors">
                           <Edit2 size={16} />
                         </button>
                       </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-[var(--color-text-secondary)]">
              <Star size={48} className="mb-4 text-[var(--color-accent-primary)]/20" />
              <p className="text-[14px] font-semibold">No customer feedback yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
