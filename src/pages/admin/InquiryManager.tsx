import { useState, useEffect } from 'react';
import { 
  MessageSquare, Search, Filter, MoreVertical, Loader2, 
  Mail, Phone, Clock, Trash2, CheckCircle2, AlertCircle,
  ChevronRight,
  Send,
  User,
  Backpack,
  ArrowLeft
} from 'lucide-react';
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { apiRequest } from '@/lib/api';

const MOCK_INQUIRIES: Inquiry[] = [
  { id: 1, name: 'Grace Wambui', email: 'grace@example.com', phone: '0700112233', type: 'Custom Cake', message: 'I need a 3-tier cake for my wedding in June.', status: 'new', created_at: new Date().toISOString() },
  { id: 2, name: 'Alex Muli', email: 'alex@example.com', phone: '0788990011', type: 'Academy', message: 'When is the next intermediate baking class?', status: 'read', created_at: new Date().toISOString() },
];

interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  type: string;
  message: string;
  status: string;
  created_at: string;
}

export default function InquiryManager() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [filterTab, setFilterTab] = useState<'all' | 'unread'>('all');
  const [replyText, setReplyText] = useState('');

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const { data, error } = await apiRequest<Inquiry[]>('/inquiries');
      if (data) {
        setInquiries(data);
      } else if (error) {
        console.warn('Backend connection failed, using mock inquiries:', error);
        setInquiries(MOCK_INQUIRIES);
      }
    } catch (error) {
      console.error('Error in fetchInquiries:', error);
      setInquiries(MOCK_INQUIRIES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const selectedInquiry = inquiries.find(i => i.id === selectedId);

  const filteredInquiries = inquiries.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         i.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         i.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = filterTab === 'all' || (i.status.toLowerCase() === 'new');
    return matchesSearch && matchesTab;
  });

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedInquiry) return;
    
    const { data } = await apiRequest(`/inquiries/${selectedId}`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'resolved' })
    });
    
    if (data) {
      setReplyText('');
      fetchInquiries();
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col animate-in fade-in duration-500 text-[DM Sans]">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shrink-0">
        <div>
          <h1 className="font-display text-[34px] font-bold text-[var(--color-text-primary)]">Inquiry Inbox</h1>
          <p className="text-[14px] text-[var(--color-text-secondary)]">Manage customer questions, custom orders, and academy inquiries.</p>
        </div>
      </div>

      {/* Split Layout Container */}
      <div className="flex-1 flex gap-0 bg-[var(--color-bg-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] overflow-hidden border border-[var(--color-border)]">
        
        {/* Left Panel: Inquiry List */}
        <div className={cn(
          "w-full lg:w-[400px] flex flex-col border-r border-[var(--color-border)] bg-[#FDFBF9]",
          selectedId && "hidden lg:flex"
        )}>
          <div className="p-4 border-b border-[var(--color-border)] space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" size={16} />
              <Input
                type="text"
                placeholder="Search messages..."
                className="w-full h-[40px] pl-10 pr-4 bg-[var(--color-bg-muted)] border-transparent rounded-[var(--radius-md)] text-[14px] outline-none focus:bg-white focus:border-[var(--color-border)] transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-1 bg-[var(--color-bg-muted)] p-1 rounded-lg self-start">
               <button 
                onClick={() => setFilterTab('all')}
                className={cn(
                  "px-4 py-1.5 text-[12px] font-bold rounded-md transition-all",
                  filterTab === 'all' ? "bg-white text-[var(--color-accent-primary)] shadow-sm" : "text-[var(--color-text-secondary)]"
                )}
               >
                 All
               </button>
               <button 
                onClick={() => setFilterTab('unread')}
                className={cn(
                  "px-4 py-1.5 text-[12px] font-bold rounded-md transition-all",
                  filterTab === 'unread' ? "bg-white text-[var(--color-accent-primary)] shadow-sm" : "text-[var(--color-text-secondary)]"
                )}
               >
                 Unread 
                 {inquiries.filter(i => i.status.toLowerCase() === 'new').length > 0 && (
                   <span className="ml-2 w-2 h-2 rounded-full bg-[var(--color-accent-primary)] inline-block" />
                 )}
               </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="p-10 flex flex-col items-center justify-center text-[var(--color-text-secondary)]">
                <Loader2 size={24} className="animate-spin mb-4 text-[var(--color-accent-primary)]" />
                <p className="text-[13px] font-medium">Loading inbox...</p>
              </div>
            ) : filteredInquiries.length > 0 ? (
              <div className="divide-y divide-[var(--color-border)]">
                {filteredInquiries.map((inq) => (
                  <div 
                    key={inq.id}
                    onClick={() => setSelectedId(inq.id)}
                    className={cn(
                      "p-5 cursor-pointer transition-all hover:bg-white relative",
                      selectedId === inq.id ? "bg-white border-l-4 border-l-[var(--color-accent-primary)]" : "border-l-4 border-l-transparent"
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)] flex items-center justify-center font-bold text-[14px] shrink-0">
                        {inq.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                          <h4 className="font-bold text-[14px] text-[var(--color-text-primary)] truncate pr-2">{inq.name}</h4>
                          <span className="text-[11px] text-[var(--color-text-secondary)] whitespace-nowrap">
                            {new Date(inq.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <p className={cn(
                          "text-[13px] line-clamp-1 mb-1",
                          inq.status.toLowerCase() === 'new' ? "text-[var(--color-text-primary)] font-bold" : "text-[var(--color-text-secondary)] "
                        )}>
                          {inq.message}
                        </p>
                        <div className="flex items-center gap-2">
                           <StatusBadge status={inq.type.toLowerCase() as any} label={inq.type.toUpperCase()} className="text-[9px] px-2 py-0 h-4" />
                           {inq.status.toLowerCase() === 'new' && (
                             <div className="w-2 h-2 rounded-full bg-[var(--color-accent-primary)]" />
                           )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center text-[var(--color-text-secondary)]">
                <MessageSquare size={32} className="mx-auto mb-4 opacity-20" />
                <p className="text-[14px]">No inquiries found</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Details Area */}
        <div className={cn(
          "flex-1 flex flex-col bg-white",
          !selectedId && "hidden lg:flex"
        )}>
          {selectedInquiry ? (
            <>
              {/* Detail Header */}
              <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                  <button onClick={() => setSelectedId(null)} className="lg:hidden p-2 -ml-2 hover:bg-[var(--color-bg-muted)] rounded-full">
                    <ArrowLeft size={20} />
                  </button>
                  <div className="w-12 h-12 rounded-full bg-[var(--color-bg-muted)] flex items-center justify-center">
                    <User size={24} className="text-[var(--color-text-secondary)]" />
                  </div>
                  <div>
                    <h3 className="font-display text-[20px] font-bold text-[var(--color-text-primary)]">{selectedInquiry.name}</h3>
                    <div className="flex items-center gap-3 mt-1 text-[13px] text-[var(--color-text-secondary)]">
                      <span className="flex items-center gap-1.5"><Mail size={14} /> {selectedInquiry.email}</span>
                      {selectedInquiry.phone && <span className="flex items-center gap-1.5"><Phone size={14} /> {selectedInquiry.phone}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                   <StatusBadge status={selectedInquiry.status.toLowerCase() as any} />
                   <span className="text-[11px] text-[var(--color-text-secondary)] font-medium uppercase tracking-wider">
                     Received {new Date(selectedInquiry.created_at).toLocaleString()}
                   </span>
                </div>
              </div>

              {/* Message Content */}
              <div className="flex-1 overflow-y-auto p-12 bg-[#FFFAF5]/30">
                <div className="max-w-[800px] mx-auto">
                   <div className="bg-white p-8 rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] border border-[var(--color-border)] relative">
                      <div className="absolute -top-3 left-8 px-4 py-1 bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-full text-[11px] font-bold text-[var(--color-text-secondary)]">
                        MESSAGE BODY
                      </div>
                      <p className="text-[16px] text-[var(--color-text-primary)] leading-[1.8] whitespace-pre-wrap">
                        {selectedInquiry.message}
                      </p>
                   </div>

                   {/* Quick Action: Reply Textarea */}
                   <div className="mt-10">
                      <h4 className="text-[13px] font-bold text-[var(--color-text-secondary)] uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Send size={14} /> Quick Reply
                      </h4>
                      <div className="bg-white border-2 border-[var(--color-border)] rounded-[var(--radius-lg)] p-4 focus-within:border-[var(--color-accent-primary)] transition-all">
                        <textarea 
                          className="w-full h-32 bg-transparent outline-none resize-none text-[15px] text-[var(--color-text-primary)]"
                          placeholder={`Message ${selectedInquiry.name}...`}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                        />
                        <div className="flex justify-end mt-2 pt-4 border-t border-[var(--color-border)]">
                          <Button 
                            onClick={handleSendReply}
                            className="bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-dark)] text-white font-bold h-10 px-6 rounded-full shadow-[var(--shadow-btn)]"
                          >
                            Send Reply
                          </Button>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-[var(--color-text-secondary)] p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-[var(--color-bg-muted)] flex items-center justify-center mb-6">
                 <MessageSquare size={32} className="opacity-20" />
              </div>
              <h3 className="font-display text-[22px] font-bold text-[var(--color-text-primary)] mb-2">Select an inquiry</h3>
              <p className="max-w-xs text-[14px]">Click on a message from the sidebar to view the full details and respond.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
