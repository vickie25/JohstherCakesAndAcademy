import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  ChefHat, 
  Loader2,
  X,
  AlertCircle,
  Package,
  TrendingUp,
  Box,
  LayoutGrid,
  List
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";
import { apiRequest, formatCurrency } from '@/lib/api';

// Data is fetched exclusively from the API

interface Cake {
  id: number;
  name: string;
  category: string;
  color: string;
  price: number;
  image_url: string;
  tag: string;
  description: string;
  is_active: boolean;
}

const CATEGORIES = ['Wedding', 'Birthday', 'Corporate', 'Academy', 'Special Event'];
const COLORS = ['White', 'Pink', 'Chocolate', 'Gold', 'Blue', 'Green', 'Red', 'Purple'];

export default function CakesManager() {
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCake, setEditingCake] = useState<Cake | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const [form, setForm] = useState({
    name: '',
    category: 'Wedding',
    color: 'White',
    price: '',
    image_url: '',
    tag: '',
    description: '',
    is_active: true
  });

  const fetchCakes = async () => {
    try {
      setLoading(true);
      const { data, error } = await apiRequest<Cake[]>('/cakes?active=false');
      
      if (data) {
        setCakes(data);
      } else if (error) {
        console.error('Backend connection error:', error);
        setCakes([]);
      }
    } catch (error) {
      console.error('Error in fetchCakes:', error);
      setCakes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCakes();
  }, []);

  const handleOpenModal = (cake: Cake | null = null) => {
    if (cake) {
      setEditingCake(cake);
      setForm({
        name: cake.name,
        category: cake.category,
        color: cake.color,
        price: cake.price.toString(),
        image_url: cake.image_url,
        tag: cake.tag,
        description: cake.description,
        is_active: cake.is_active
      });
    } else {
      setEditingCake(null);
      setForm({
        name: '',
        category: 'Wedding',
        color: 'White',
        price: '',
        image_url: '',
        tag: '',
        description: '',
        is_active: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = editingCake ? `/cakes/${editingCake.id}` : '/cakes';
    const method = editingCake ? 'PUT' : 'POST';

    const { data, error } = await apiRequest(endpoint, {
      method,
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price)
      })
    });

    if (data) {
      setIsModalOpen(false);
      fetchCakes();
    } else {
      console.error('Error saving cake:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to remove this masterpiece?')) return;
    
    const { data, error } = await apiRequest(`/cakes/${id}`, { method: 'DELETE' });
    if (data) {
      fetchCakes();
    } else {
      console.error('Error deleting cake:', error);
    }
  };

  const filteredCakes = cakes.filter(cake => 
    cake.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cake.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: 'Total Products', value: cakes.length, icon: Package, tint: 'bg-[#E6F0FA] text-[#2A5A8A]' },
    { label: 'Total Revenue', value: '200000', icon: TrendingUp, tint: 'bg-[#E8F5E8] text-[#3A7A3A]' },
    { label: 'Instock', value: cakes.filter(c => c.is_active).length, icon: Box, tint: 'bg-[#FFF3E0] text-[var(--color-accent-primary)]' },
    { label: 'Out of Stock', value: cakes.filter(c => !c.is_active).length, icon: AlertCircle, tint: 'bg-[#FDECEC] text-[#A03030]' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-[34px] font-bold text-[var(--color-text-primary)]">Cake Boutique</h1>
          <p className="text-[14px] text-[var(--color-text-secondary)]">Manage your masterpiece gallery and product catalogue.</p>
        </div>
        <Button 
          onClick={() => handleOpenModal()}
          className="bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-dark)] text-white rounded-[var(--radius-sm)] font-medium px-6 h-[44px] shadow-[var(--shadow-btn)]"
        >
          <Plus size={18} className="mr-2" />
          Add Product
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
              <p className="font-display text-[26px] font-bold text-[var(--color-text-primary)]">
                {stat.label === 'Total Revenue' ? formatCurrency(200000) : stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Filter & View Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--color-bg-surface)] p-4 rounded-[var(--radius-lg)] shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-4 flex-1">
          <h2 className="font-display text-[20px] font-bold text-[var(--color-text-primary)] whitespace-nowrap">All Products</h2>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" size={16} />
            <Input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-[40px] pl-10 pr-4 bg-[var(--color-bg-muted)] border-transparent rounded-[var(--radius-full)] text-[14px] outline-none focus:bg-white focus:border-[var(--color-border)] focus:ring-[var(--color-accent-primary)]/15 transition-all"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[var(--color-bg-muted)] rounded-full p-1">
            <button 
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-2 rounded-full transition-all",
                viewMode === 'grid' ? "bg-white text-[var(--color-accent-primary)] shadow-sm" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              )}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={cn(
                "p-2 rounded-full transition-all",
                viewMode === 'list' ? "bg-white text-[var(--color-accent-primary)] shadow-sm" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              )}
            >
              <List size={18} />
            </button>
          </div>
          <Button variant="ghost" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] font-semibold text-[13px]">
            <Filter size={16} className="mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Product Content */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-[var(--color-text-secondary)]">
          <Loader2 size={32} className="animate-spin mb-4 text-[var(--color-accent-primary)]" />
          <p className="text-[14px] font-medium">Synchronizing masterpieces...</p>
        </div>
      ) : filteredCakes.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-[DM Sans]">
            {filteredCakes.map((cake) => (
              <div 
                key={cake.id} 
                className="group bg-[var(--color-bg-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[var(--shadow-panel)] relative"
              >
                <div className="aspect-square w-full overflow-hidden relative">
                  <img src={cake.image_url} alt={cake.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleOpenModal(cake); }}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-[var(--color-text-primary)] shadow-sm hover:text-[var(--color-accent-primary)]"
                    >
                      <Edit2 size={16} />
                    </button>
                  </div>
                  {cake.tag && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-[var(--color-accent-primary)] text-white text-[10px] font-bold uppercase rounded-sm">
                      {cake.tag}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-[14px] font-semibold text-[var(--color-text-primary)] truncate flex-1">{cake.name}</h3>
                  </div>
                  <p className="text-[12px] text-[var(--color-text-secondary)] mb-3">{cake.category}</p>
                  <div className="flex items-center justify-between">
                    <StatusBadge status={cake.is_active ? 'active' : 'inactive'} label={cake.is_active ? 'ACTIVE' : 'INACTIVE'} className="text-[10px] scale-90 -ml-1" />
                    <span className="text-[13px] font-bold text-[var(--color-accent-primary)]">{formatCurrency(cake.price)}</span>
                  </div>
                </div>
                
                {/* Overlay actions on hover */}
                <div className="absolute top-2 right-2 flex flex-col gap-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button 
                    onClick={() => handleDelete(cake.id)}
                    className="p-1.5 bg-[var(--color-danger)] text-white rounded-md shadow-sm hover:scale-110 transition-transform"
                   >
                    <Trash2 size={14} />
                   </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[var(--color-bg-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] overflow-hidden">
             {/* List view logic - Reusing simplified table pattern */}
             <div className="overflow-x-auto">
               <table className="w-full text-left text-[14px]">
                 <thead className="bg-[var(--color-bg-muted)] text-[var(--color-text-secondary)] text-[11px] font-bold uppercase tracking-widest">
                   <tr>
                     <th className="px-6 py-4">Product</th>
                     <th className="px-6 py-4">Category</th>
                     <th className="px-6 py-4">Price</th>
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4 text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-[var(--color-border)]">
                   {filteredCakes.map((cake) => (
                     <tr key={cake.id} className="hover:bg-[var(--color-bg-base)] transition-colors">
                       <td className="px-6 py-4">
                         <div className="flex items-center gap-3">
                           <img src={cake.image_url} alt={cake.name} className="w-10 h-10 rounded-lg object-cover" />
                           <span className="font-semibold text-[var(--color-text-primary)]">{cake.name}</span>
                         </div>
                       </td>
                       <td className="px-6 py-4 text-[var(--color-text-secondary)]">{cake.category}</td>
                       <td className="px-6 py-4 font-bold text-[var(--color-text-primary)]">{formatCurrency(cake.price)}</td>
                       <td className="px-6 py-4">
                         <StatusBadge status={cake.is_active ? 'active' : 'inactive'} />
                       </td>
                       <td className="px-6 py-4 text-right">
                         <div className="flex items-center justify-end gap-2">
                           <button onClick={() => handleOpenModal(cake)} className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)]"><Edit2 size={16} /></button>
                           <button onClick={() => handleDelete(cake.id)} className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-danger)]"><Trash2 size={16} /></button>
                         </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        )
      ) : (
        <div className="bg-[var(--color-bg-surface)] py-20 rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] flex flex-col items-center justify-center text-[var(--color-text-secondary)]">
          <ChefHat size={64} className="mb-4 text-[var(--color-accent-primary)]/20" />
          <h3 className="font-display text-[20px] font-bold text-[var(--color-text-primary)] mb-2">No masterpieces yet</h3>
          <p className="text-[14px] text-center max-w-xs mb-6">Start by adding your first premium cake creation to the boutique.</p>
          <Button 
            onClick={() => handleOpenModal()}
            className="bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-dark)] text-white rounded-[var(--radius-sm)] px-6"
          >
            Add First Product
          </Button>
        </div>
      )}

      {/* Slide-over Panel for Add/Edit Product */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-[rgba(44,26,14,0.5)] backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-[480px] bg-white h-full shadow-[var(--shadow-modal)] animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
              <h2 className="font-display text-[20px] font-bold text-[var(--color-text-primary)]">
                {editingCake ? 'Edit Cake Masterpiece' : 'New Cake Creation'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-2 hover:bg-[var(--color-bg-muted)] rounded-full text-[var(--color-text-secondary)] transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-[var(--color-text-primary)]">Product Name</label>
                  <Input 
                    required
                    placeholder="e.g. Victorian Velvet Rose"
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    className="h-[40px] border-[var(--color-border)] focus:border-[var(--color-accent-primary)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-[var(--color-text-primary)]">Price (KSh)</label>
                    <Input 
                      required
                      type="number"
                      placeholder="e.g. 15000"
                      value={form.price}
                      onChange={e => setForm({...form, price: e.target.value})}
                      className="h-[40px] border-[var(--color-border)]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-[var(--color-text-primary)]">Category</label>
                    <select 
                      className="w-full h-[40px] px-3 bg-white border border-[var(--color-border)] rounded-[var(--radius-sm)] text-[14px] outline-none focus:border-[var(--color-accent-primary)] transition-colors"
                      value={form.category}
                      onChange={e => setForm({...form, category: e.target.value})}
                    >
                      {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-[var(--color-text-primary)]">Theme Color</label>
                    <select 
                      className="w-full h-[40px] px-3 bg-white border border-[var(--color-border)] rounded-[var(--radius-sm)] text-[14px] outline-none focus:border-[var(--color-accent-primary)] transition-colors"
                      value={form.color}
                      onChange={e => setForm({...form, color: e.target.value})}
                    >
                      {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-[var(--color-text-primary)]">Tag (Optional)</label>
                    <Input 
                      placeholder="e.g. Best Seller"
                      value={form.tag}
                      onChange={e => setForm({...form, tag: e.target.value})}
                      className="h-[40px] border-[var(--color-border)]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-[var(--color-text-primary)]">Image URL</label>
                  <Input 
                    required
                    placeholder="https://example.com/cake.jpg"
                    value={form.image_url}
                    onChange={e => setForm({...form, image_url: e.target.value})}
                    className="h-[40px] border-[var(--color-border)]"
                  />
                  {form.image_url && (
                    <div className="mt-2 aspect-video rounded-lg overflow-hidden border border-[var(--color-border)] bg-[var(--color-bg-muted)]">
                      <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-[var(--color-text-primary)]">Description</label>
                  <textarea 
                    required
                    rows={4}
                    placeholder="Describe the layers, flavors, and artisanal details..."
                    className="w-full px-4 py-3 bg-white border border-[var(--color-border)] rounded-[var(--radius-sm)] text-[14px] outline-none focus:border-[var(--color-accent-primary)] shadow-sm resize-none transition-all"
                    value={form.description}
                    onChange={e => setForm({...form, description: e.target.value})}
                  />
                </div>

                <div className="flex items-center gap-3 p-4 bg-[var(--color-bg-muted)] rounded-lg">
                   <input 
                    type="checkbox" 
                    id="isActive" 
                    checked={form.is_active}
                    onChange={e => setForm({...form, is_active: e.target.checked})}
                    className="w-4 h-4 accent-[var(--color-accent-primary)]"
                   />
                   <label htmlFor="isActive" className="text-[14px] font-medium text-[var(--color-text-primary)]">Mark as active in boutique</label>
                </div>
              </div>
              
              <div className="p-6 bg-[var(--color-bg-base)] border-t border-[var(--color-border)] flex gap-4 mt-auto">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 text-[var(--color-text-secondary)] font-semibold"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-dark)] text-white shadow-[var(--shadow-btn)] font-semibold"
                >
                  {editingCake ? 'Save Cake' : 'Publish Product'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
