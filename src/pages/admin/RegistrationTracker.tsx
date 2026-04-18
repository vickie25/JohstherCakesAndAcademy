import { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, CheckCircle2, Clock, XCircle, CreditCard, 
  Mail, Phone, MoreVertical, Loader2, Calendar, AlertCircle,
  X, Check, Trash2, MailIcon
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { apiRequest } from '@/lib/api';

// Data is fetching from Backend API

interface Registration {
  id: number;
  student_name: string;
  email: string;
  phone: string;
  course_name: string;
  batch_name: string;
  status: string;
  payment_status: string;
  created_at: string;
}

export default function RegistrationTracker() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const { data, error } = await apiRequest<Registration[]>('/academy/registrations');
      if (data) {
        setRegistrations(data);
      } else if (error) {
        console.error('Backend connection error:', error);
        setRegistrations([]);
      }
    } catch (error) {
      console.error('Error in fetchRegistrations:', error);
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleUpdateStatus = async (id: number, status: string, paymentStatus: string) => {
    const { data } = await apiRequest(`/academy/registrations/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status: status.toLowerCase(), payment_status: paymentStatus.toLowerCase() })
    });
    if (data) fetchRegistrations();
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === filteredRegistrations.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredRegistrations.map(r => r.id));
    }
  };

  const toggleSelectRow = (id: number) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const filteredRegistrations = registrations.filter(r => 
    r.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.course_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: 'Total Applications', value: registrations.length, icon: Users, tint: 'bg-[#E6F0FA] text-[#2A5A8A]' },
    { label: 'Confirmed', value: registrations.filter(r => r.status.toLowerCase() === 'confirmed').length, icon: CheckCircle2, tint: 'bg-[#E8F5E8] text-[#3A7A3A]' },
    { label: 'Pending', value: registrations.filter(r => r.status.toLowerCase() === 'pending').length, icon: Clock, tint: 'bg-[#FFF3E0] text-[var(--color-accent-primary)]' },
    { label: 'Unpaid Fees', value: registrations.filter(r => r.payment_status.toLowerCase() === 'unpaid').length, icon: CreditCard, tint: 'bg-[#FDECEC] text-[#A03030]' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-[DM Sans]">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-[34px] font-bold text-[var(--color-text-primary)]">Registrations</h1>
          <p className="text-[14px] text-[var(--color-text-secondary)]">Monitor student applications, intake placements, and payment verification.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-[var(--color-border)] text-[var(--color-text-primary)] font-semibold text-[13px]">
            <Filter size={16} className="mr-2" />
            Filter
          </Button>
          <Button className="bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-dark)] text-white font-semibold text-[13px] px-6 shadow-[var(--shadow-btn)]">
            Export List
          </Button>
        </div>
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

      {/* Main Table Area */}
      <div className="bg-[var(--color-bg-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] overflow-hidden relative">
        {/* Bulk Action Bar */}
        {selectedRows.length > 0 && (
          <div className="absolute top-0 left-0 right-0 h-16 bg-[var(--color-accent-primary)] text-white z-10 flex items-center justify-between px-8 animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-4">
               <span className="font-bold text-[14px]">{selectedRows.length} students selected</span>
               <div className="w-[1px] h-6 bg-white/20 mx-2" />
               <Button variant="ghost" className="text-white hover:bg-white/10 h-9 font-bold text-[13px] rounded-full px-4">
                  <Check className="mr-2" size={16} /> Confirm Selected
               </Button>
               <Button variant="ghost" className="text-white hover:bg-white/10 h-9 font-bold text-[13px] rounded-full px-4">
                  <CreditCard className="mr-2" size={16} /> Mark as Paid
               </Button>
            </div>
            <button onClick={() => setSelectedRows([])} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>
        )}

        <div className="p-6 border-b border-[var(--color-border)] flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="font-display text-[20px] font-bold text-[var(--color-text-primary)] whitespace-nowrap">Applications Queue</h2>
            <div className="relative w-64 max-md:hidden">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" size={16} />
              <Input
                type="text"
                placeholder="Search students..."
                className="w-full h-[36px] pl-10 pr-4 bg-[var(--color-bg-muted)] border-transparent rounded-full text-[13px] outline-none focus:bg-white focus:border-[var(--color-border)] transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px] pl-6">
                  <input 
                    type="checkbox" 
                    className="accent-[var(--color-accent-primary)]" 
                    checked={selectedRows.length === filteredRegistrations.length && filteredRegistrations.length > 0}
                    onChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Course & Batch</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                 <TableRow>
                    <TableCell colSpan={6} className="py-20 text-center">
                       <Loader2 size={32} className="animate-spin mx-auto mb-4 text-[var(--color-accent-primary)]" />
                       <p className="text-[14px] font-medium text-[var(--color-text-secondary)]">Synchronizing student database...</p>
                    </TableCell>
                 </TableRow>
              ) : filteredRegistrations.length > 0 ? (
                filteredRegistrations.map((reg) => (
                  <TableRow key={reg.id} className={cn(selectedRows.includes(reg.id) && "bg-[#FFF3E0]")}>
                    <TableCell className="pl-6">
                      <input 
                        type="checkbox" 
                        className="accent-[var(--color-accent-primary)]" 
                        checked={selectedRows.includes(reg.id)}
                        onChange={() => toggleSelectRow(reg.id)}
                      />
                    </TableCell>
                    <TableCell className="py-5">
                      <div className="flex flex-col">
                        <span className="font-semibold text-[var(--color-text-primary)]">{reg.student_name}</span>
                        <div className="flex items-center gap-3 mt-0.5 text-[12px] text-[var(--color-text-secondary)]">
                           <span className="flex items-center gap-1"><MailIcon size={12} /> {reg.email}</span>
                           <span className="flex items-center gap-1"><Phone size={12} /> {reg.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-[var(--color-text-primary)]">{reg.course_name}</span>
                        <span className="text-[12px] text-[var(--color-text-secondary)] italic">{reg.batch_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <select 
                        className={cn(
                          "appearance-none bg-white border border-[var(--color-border)] text-[12px] font-bold px-3 py-1.5 rounded-full outline-none focus:border-[var(--color-accent-primary)] transition-colors cursor-pointer",
                          reg.status.toLowerCase() === 'confirmed' ? "text-[#3A7A3A] border-[#E8F5E8] bg-[#E8F5E8]/30" : 
                          reg.status.toLowerCase() === 'cancelled' ? "text-[#A03030] border-[#FDECEC] bg-[#FDECEC]/30" : 
                          "text-[#A05A00] border-[#FFF3E0] bg-[#FFF3E0]/30"
                        )}
                        value={reg.status.toLowerCase()}
                        onChange={(e) => handleUpdateStatus(reg.id, e.target.value, reg.payment_status)}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </TableCell>
                    <TableCell>
                      <select 
                        className={cn(
                          "appearance-none bg-white border border-[var(--color-border)] text-[12px] font-bold px-3 py-1.5 rounded-full outline-none focus:border-[var(--color-accent-primary)] transition-colors cursor-pointer",
                          reg.payment_status.toLowerCase() === 'paid' ? "text-[#3A7A3A] border-[#E8F5E8] bg-[#E8F5E8]/30" : 
                          reg.payment_status.toLowerCase() === 'refunded' ? "text-[#2A5A8A] border-[#E6F0FA] bg-[#E6F0FA]/30" : 
                          "text-[#A03030] border-[#FDECEC] bg-[#FDECEC]/30"
                        )}
                        value={reg.payment_status.toLowerCase()}
                        onChange={(e) => handleUpdateStatus(reg.id, reg.status, e.target.value)}
                      >
                        <option value="unpaid">Unpaid</option>
                        <option value="paid">Paid</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-2 group-hover:opacity-100 transition-opacity">
                         <button className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)]"><MoreVertical size={16} /></button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                   <TableCell colSpan={6} className="py-20 text-center">
                      <Users size={48} className="mx-auto mb-4 text-[var(--color-accent-primary)]/20" />
                      <p className="text-[14px] font-medium text-[var(--color-text-secondary)]">No active registrations found</p>
                   </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
