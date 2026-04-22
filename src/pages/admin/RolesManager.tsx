import { useCallback, useEffect, useMemo, useState } from 'react';
import { ShieldCheck, Plus, Shield, Users, Loader2, Trash2, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { apiRequest } from '@/lib/api';

type StaffRoleRow = {
  id: number;
  name: string;
  description: string | null;
  permissions: string[];
  member_count: number;
};

const PERMISSION_SECTIONS: { label: string; items: { id: string; label: string }[] }[] = [
  {
    label: 'General',
    items: [
      { id: 'Overview', label: 'Overview' },
      { id: 'Analytics', label: 'Store analytics' },
      { id: 'Notifications', label: 'Notifications' },
    ],
  },
  {
    label: 'Management',
    items: [
      { id: 'Orders', label: 'Orders' },
      { id: 'Cakes', label: 'Cakes / products' },
      { id: 'Customers', label: 'Customers / users' },
      { id: 'Inquiries', label: 'Inquiries' },
      { id: 'Testimonials', label: 'Testimonials' },
      { id: 'Refunds', label: 'Refunds' },
    ],
  },
  {
    label: 'Academy',
    items: [
      { id: 'Courses', label: 'Courses' },
      { id: 'Batches', label: 'Batches' },
      { id: 'Registrations', label: 'Registrations' },
    ],
  },
  {
    label: 'Configuration',
    items: [
      { id: 'Roles', label: 'Page roles' },
      { id: 'Settings', label: 'Settings' },
    ],
  },
];

const TINTS = [
  'bg-[#E6F0FA] text-[#2A5A8A]',
  'bg-[#FFF3E0] text-[var(--color-accent-primary)]',
  'bg-[#E8F5E8] text-[#3A7A3A]',
  'bg-[#F3E8FF] text-[#6B21A8]',
];

function tintForIndex(i: number) {
  return TINTS[i % TINTS.length];
}

export default function RolesManager() {
  const [roles, setRoles] = useState<StaffRoleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<StaffRoleRow | null>(null);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [selectedPerms, setSelectedPerms] = useState<Set<string>>(new Set());

  const loadRoles = useCallback(async () => {
    setLoading(true);
    const { data, error } = await apiRequest<StaffRoleRow[]>('/staff-roles');
    if (!error && data) {
      const list = Array.isArray(data) ? data : [];
      setRoles(
        list.map((r) => ({
          ...r,
          permissions: Array.isArray(r.permissions) ? r.permissions : [],
        }))
      );
    } else {
      setRoles([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  const openCreate = () => {
    setEditing(null);
    setFormName('');
    setFormDescription('');
    setSelectedPerms(new Set(['Overview']));
    setModalOpen(true);
  };

  const openEdit = (role: StaffRoleRow) => {
    setEditing(role);
    setFormName(role.name);
    setFormDescription(role.description || '');
    setSelectedPerms(new Set(role.permissions || []));
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const togglePerm = (id: string) => {
    setSelectedPerms((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectSection = (section: (typeof PERMISSION_SECTIONS)[0], grant: boolean) => {
    setSelectedPerms((prev) => {
      const next = new Set(prev);
      for (const item of section.items) {
        if (grant) next.add(item.id);
        else next.delete(item.id);
      }
      return next;
    });
  };

  const grantAll = () => {
    const all = new Set<string>();
    for (const sec of PERMISSION_SECTIONS) {
      for (const item of sec.items) all.add(item.id);
    }
    setSelectedPerms(all);
  };

  const clearAll = () => {
    setSelectedPerms(new Set());
  };

  const summaryLine = useMemo(() => {
    const n = selectedPerms.size;
    if (n === 0) return 'No modules selected';
    if (n >= 12) return 'Broad access across most dashboard areas';
    return `${n} dashboard module${n === 1 ? '' : 's'} selected`;
  }, [selectedPerms]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      window.alert('Please enter a role name.');
      return;
    }
    if (selectedPerms.size === 0) {
      window.alert('Select at least one permission.');
      return;
    }
    setSaving(true);
    const body = {
      name: formName.trim(),
      description: formDescription.trim(),
      permissions: Array.from(selectedPerms),
    };
    const endpoint = editing ? `/staff-roles/${editing.id}` : '/staff-roles';
    const method = editing ? 'PUT' : 'POST';
    const { error } = await apiRequest(endpoint, { method, body: JSON.stringify(body) });
    setSaving(false);
    if (error) {
      window.alert(error);
      return;
    }
    closeModal();
    await loadRoles();
  };

  const handleDelete = async (role: StaffRoleRow) => {
    if (role.member_count > 0) {
      window.alert('Unassign this role from all team members in Users before deleting.');
      return;
    }
    if (!window.confirm(`Delete role “${role.name}”? This cannot be undone.`)) return;
    const { error } = await apiRequest(`/staff-roles/${role.id}`, { method: 'DELETE' });
    if (error) window.alert(error);
    else loadRoles();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-[DM Sans]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-[34px] font-bold text-[var(--color-text-primary)]">Roles & permissions</h1>
          <p className="text-[14px] text-[var(--color-text-secondary)]">
            Create staff roles and tick which dashboard areas each role may use. Assign roles to users from Customers when
            that field is enabled.
          </p>
        </div>
        <Button
          type="button"
          onClick={openCreate}
          className="bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-dark)] text-white font-semibold text-[13px] px-6 h-[44px] shadow-[var(--shadow-btn)]"
        >
          <Plus size={18} className="mr-2" />
          Create new role
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-[var(--color-text-secondary)]">
          <Loader2 className="animate-spin mb-3 text-[var(--color-accent-primary)]" size={32} />
          <p className="text-[14px] font-medium">Loading roles…</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role, i) => (
            <div
              key={role.id}
              className="bg-[var(--color-bg-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] p-6 border border-[var(--color-border)] hover:border-[var(--color-accent-primary)]/30 transition-all group"
            >
              <div className="flex items-center justify-between mb-6">
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110', tintForIndex(i))}>
                  <Shield size={24} />
                </div>
                <div className="flex items-center gap-2 bg-[var(--color-bg-muted)] px-3 py-1 rounded-full text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
                  <Users size={12} />
                  {role.member_count} member{role.member_count === 1 ? '' : 's'}
                </div>
              </div>

              <h3 className="font-display text-[20px] font-bold text-[var(--color-text-primary)] mb-2">{role.name}</h3>
              <p className="text-[13px] text-[var(--color-text-secondary)] mb-3 leading-relaxed min-h-[40px]">
                {role.description || 'No description'}
              </p>
              <p className="text-[11px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide mb-4">
                {(role.permissions?.length ?? 0)} permission{(role.permissions?.length ?? 0) === 1 ? '' : 's'}
              </p>

              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full text-[13px] font-bold border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary)]/5 rounded-[var(--radius-sm)]"
                  onClick={() => openEdit(role)}
                >
                  Modify permissions
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-[13px] font-bold text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10"
                  onClick={() => handleDelete(role)}
                >
                  <Trash2 size={14} className="mr-2 inline" />
                  Delete role
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && roles.length === 0 && (
        <p className="text-center text-[14px] text-[var(--color-text-secondary)] py-8">
          No roles found. Run database setup (<code className="text-[12px]">node backend/scripts/setupAdminTables.js</code>) or create a role above.
        </p>
      )}

      <div className="bg-[var(--color-bg-muted)]/50 rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--color-border)] p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-6 text-[var(--color-accent-primary)]/30">
            <ShieldCheck size={32} />
          </div>
          <h4 className="font-display text-[18px] font-bold text-[var(--color-text-primary)] mb-2">How this works</h4>
          <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed">
            Permissions here define which sidebar sections a role is allowed to use. Enforcing them on login and hiding
            unauthorized menu items can be wired next to <code className="text-[12px]">staff_role_id</code> on users.
          </p>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-6">
          <button type="button" className="absolute inset-0 bg-black/45 backdrop-blur-sm" aria-label="Close" onClick={closeModal} />
          <div className="relative z-10 w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl border border-[var(--color-border)] flex flex-col">
            <div className="sticky top-0 flex items-center justify-between gap-3 px-6 py-4 border-b border-[var(--color-border)] bg-white">
              <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
                {editing ? 'Edit role' : 'New staff role'}
              </h2>
              <button type="button" className="p-2 rounded-lg hover:bg-[var(--color-bg-muted)]" onClick={closeModal} aria-label="Close">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="px-6 py-5 space-y-5 flex-1">
              <div>
                <label className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Role name</label>
                <Input
                  className="mt-1.5 h-11"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Inventory lead"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Description</label>
                <textarea
                  className="mt-1.5 w-full min-h-[72px] rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]/20"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="What is this role responsible for?"
                />
              </div>

              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-muted)]/30 p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[12px] font-bold text-[var(--color-text-primary)]">Dashboard access</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="text-[11px] font-bold text-[var(--color-accent-primary)] hover:underline"
                      onClick={grantAll}
                    >
                      Select all
                    </button>
                    <span className="text-[var(--color-border)]">|</span>
                    <button type="button" className="text-[11px] font-bold text-[var(--color-text-secondary)] hover:underline" onClick={clearAll}>
                      Clear
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-[var(--color-text-secondary)]">{summaryLine}</p>

                <div className="space-y-4 max-h-[280px] overflow-y-auto pr-1">
                  {PERMISSION_SECTIONS.map((section) => (
                    <div key={section.label} className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">
                          {section.label}
                        </span>
                        <div className="flex gap-2 shrink-0">
                          <button
                            type="button"
                            className="text-[10px] font-semibold text-[var(--color-accent-primary)]"
                            onClick={() => selectSection(section, true)}
                          >
                            All
                          </button>
                          <button
                            type="button"
                            className="text-[10px] font-semibold text-[var(--color-text-secondary)]"
                            onClick={() => selectSection(section, false)}
                          >
                            None
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {section.items.map((item) => {
                          const on = selectedPerms.has(item.id);
                          return (
                            <label
                              key={item.id}
                              className={cn(
                                'flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer transition-colors text-[13px]',
                                on
                                  ? 'border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)]/10'
                                  : 'border-[var(--color-border)] bg-white hover:border-[var(--color-accent-primary)]/30'
                              )}
                            >
                              <input
                                type="checkbox"
                                className="rounded border-[var(--color-border)] accent-[var(--color-accent-primary)]"
                                checked={on}
                                onChange={() => togglePerm(item.id)}
                              />
                              <span className="font-medium text-[var(--color-text-primary)]">{item.label}</span>
                              {on && <Check size={14} className="ml-auto text-[var(--color-accent-primary)] shrink-0" />}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={closeModal}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-dark)] text-white"
                >
                  {saving ? 'Saving…' : editing ? 'Save changes' : 'Create role'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
