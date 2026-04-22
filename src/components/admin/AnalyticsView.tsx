import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Globe, Loader2, RefreshCw } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { apiRequest, formatCurrency } from '@/lib/api';

type TimeRange = 'daily' | 'weekly' | 'monthly';

type LinePoint = { name: string; key: string | number; users: number; sales: number };
type DeviceSlice = { name: string; value: number; color: string; estimated?: boolean };
type CountryRow = { name: string; users: number; percentage: number };

type AnalyticsPayload = {
  range: TimeRange;
  refreshedAt?: string;
  lineData: LinePoint[];
  deviceData: DeviceSlice[];
  countryData: CountryRow[];
  deviceNote?: string;
};

const REFRESH_MS = 60_000;

export default function AnalyticsView() {
  const [range, setRange] = useState<TimeRange>('monthly');
  const [lineData, setLineData] = useState<LinePoint[]>([]);
  const [deviceData, setDeviceData] = useState<DeviceSlice[]>([]);
  const [countryData, setCountryData] = useState<CountryRow[]>([]);
  const [deviceNote, setDeviceNote] = useState<string | null>(null);
  const [refreshedAt, setRefreshedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAnalytics = useCallback(
    async (opts?: { silent?: boolean }) => {
      const silent = opts?.silent === true;
      if (silent) setRefreshing(true);
      else setLoading(true);
      setError(null);
      const { data, error: err } = await apiRequest<AnalyticsPayload>(`/dashboard/analytics?range=${range}`);
      if (err) {
        setError(err);
        setLineData([]);
        setDeviceData([]);
        setCountryData([]);
        setDeviceNote(null);
        setRefreshedAt(null);
      } else if (data) {
        setLineData(Array.isArray(data.lineData) ? data.lineData : []);
        setDeviceData(Array.isArray(data.deviceData) ? data.deviceData : []);
        setCountryData(Array.isArray(data.countryData) ? data.countryData : []);
        setDeviceNote(data.deviceNote || null);
        setRefreshedAt(data.refreshedAt || new Date().toISOString());
      }
      if (silent) setRefreshing(false);
      else setLoading(false);
    },
    [range]
  );

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  /** Re-fetch when tab becomes visible, window gains focus, or on an interval while this screen is mounted. */
  useEffect(() => {
    const softRefresh = () => {
      if (document.visibilityState !== 'visible') return;
      loadAnalytics({ silent: true });
    };
    const interval = window.setInterval(softRefresh, REFRESH_MS);
    document.addEventListener('visibilitychange', softRefresh);
    window.addEventListener('focus', softRefresh);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', softRefresh);
      window.removeEventListener('focus', softRefresh);
    };
  }, [loadAnalytics]);

  const dominantDevice = useMemo(() => {
    if (!deviceData.length) return { name: '—', pct: 0 };
    const top = deviceData.reduce((a, b) => (b.value > a.value ? b : a));
    return { name: top.name, pct: top.value };
  }, [deviceData]);

  const rangeLabel = range === 'daily' ? 'Last 30 days' : range === 'weekly' ? 'Last ~12 weeks' : 'This calendar year';

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-[34px] font-bold text-[var(--color-text-primary)]">Store Analytics</h1>
          <p className="text-[14px] text-[var(--color-text-secondary)]">
            Review historical performance and user behavior. Charts refresh when you return to this tab, on window focus, and about every minute.
          </p>
          {refreshedAt && (
            <p className="text-[11px] text-[var(--color-text-secondary)] mt-1">
              Last updated: {new Date(refreshedAt).toLocaleString()}
            </p>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={loading || refreshing}
          className="shrink-0 gap-2"
          onClick={() => loadAnalytics({ silent: true })}
        >
          <RefreshCw size={14} className={cn(refreshing && 'animate-spin')} />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/5 px-4 py-3 text-[13px] text-[var(--color-danger)]">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[var(--color-bg-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-2">
            <div>
              <h2 className="font-display text-[20px] font-bold text-[var(--color-text-primary)]">User growth vs sales</h2>
              <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">{rangeLabel} · users (green) vs registration revenue by batch (amber)</p>
            </div>
            <div className="flex items-center bg-[var(--color-bg-muted)] rounded-full p-1 shrink-0">
              {(['daily', 'weekly', 'monthly'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRange(r)}
                  className={cn(
                    'px-4 py-1 text-[13px] font-semibold rounded-full transition-colors capitalize',
                    range === r
                      ? 'bg-white text-[var(--color-accent-primary)] shadow-sm'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[350px] w-full relative">
            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-[var(--color-text-secondary)]">
                <Loader2 className="animate-spin mb-2 text-[var(--color-accent-primary)]" size={28} />
                <span className="text-[13px]">Loading chart…</span>
              </div>
            ) : lineData.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center text-[14px] text-[var(--color-text-secondary)]">
                No data in this range yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'var(--color-text-secondary)', fontSize: 12, fontFamily: 'DM Sans' }}
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip
                    cursor={{ stroke: 'var(--color-accent-primary)', strokeWidth: 1 }}
                    formatter={(value, name) => {
                      const v = typeof value === 'number' ? value : Number(value);
                      const n = String(name);
                      if (n === 'sales') return [formatCurrency(v), 'Sales (batch totals)'];
                      return [v, 'New users'];
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="users"
                    name="users"
                    stroke="#5A8A5E"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#5A8A5E', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    name="sales"
                    stroke="#C8884A"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#C8884A', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-[var(--color-bg-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] p-6">
          <h2 className="font-display text-[20px] font-bold text-[var(--color-text-primary)] mb-1">Devices used</h2>
          {deviceNote && <p className="text-[10px] text-[var(--color-text-secondary)] leading-snug mb-4">{deviceNote}</p>}
          <div className="h-[250px] relative flex items-center justify-center">
            {loading ? (
              <Loader2 className="animate-spin text-[var(--color-accent-primary)]" size={28} />
            ) : deviceData.length === 0 ? (
              <span className="text-[13px] text-[var(--color-text-secondary)]">No device data</span>
            ) : (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${entry.name}-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [`${Number(v)}%`, 'Share']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="font-display text-[34px] font-bold text-[var(--color-text-primary)] leading-none">
                    {dominantDevice.pct}%
                  </span>
                  <span className="text-[11px] text-[var(--color-text-secondary)] mt-1 text-center max-w-[120px] leading-tight">
                    Largest segment: {dominantDevice.name}
                  </span>
                </div>
              </>
            )}
          </div>
          <div className="mt-6 grid grid-cols-1 gap-3">
            {deviceData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-[14px] text-[var(--color-text-secondary)] truncate">{item.name}</span>
                </div>
                <span className="text-[14px] font-bold text-[var(--color-text-primary)] shrink-0">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--color-bg-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] p-6">
          <h2 className="font-display text-[20px] font-bold text-[var(--color-text-primary)] mb-6">Top countries</h2>
          <div className="aspect-[16/9] w-full bg-[var(--color-bg-muted)] rounded-[var(--radius-md)] flex items-center justify-center relative overflow-hidden group">
            <Globe className="w-32 h-32 text-[var(--color-accent-primary)]/20 animate-pulse" />
            <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[var(--color-border)] flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--color-accent-primary)] animate-ping" />
              <span className="text-[11px] font-bold text-[var(--color-text-primary)] uppercase tracking-wider">Geo (summary)</span>
            </div>
            <p className="absolute bottom-6 text-[var(--color-text-secondary)] text-[12px] italic px-4 text-center">
              Per-country breakdown appears when user profiles store a country field.
            </p>
          </div>
        </div>

        <div className="bg-[var(--color-bg-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] flex flex-col">
          <div className="p-6 border-b border-[var(--color-border)]">
            <h2 className="font-display text-[20px] font-bold text-[var(--color-text-primary)]">Country rankings</h2>
            <p className="text-[11px] text-[var(--color-text-secondary)] mt-1">Based on total registered users until geo data exists.</p>
          </div>
          <div className="flex-1 overflow-hidden">
            {loading ? (
              <div className="p-12 flex justify-center">
                <Loader2 className="animate-spin text-[var(--color-accent-primary)]" size={24} />
              </div>
            ) : countryData.length === 0 ? (
              <p className="p-8 text-center text-[14px] text-[var(--color-text-secondary)]">No users yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Region</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead className="text-right">Activity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {countryData.map((country, i) => (
                    <TableRow key={`${country.name}-${i}`}>
                      <TableCell className="font-semibold text-[var(--color-text-primary)] py-4">{country.name}</TableCell>
                      <TableCell className="text-[var(--color-text-secondary)] py-4">{country.users}</TableCell>
                      <TableCell className="py-4 text-right">
                        <div className="flex flex-col items-end gap-1.5 min-w-[120px]">
                          <div className="flex justify-between w-full text-[12px] text-[var(--color-text-secondary)]">
                            <span>{country.percentage}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-[var(--color-bg-muted)] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[var(--color-accent-primary)] rounded-full transition-all duration-1000"
                              style={{ width: `${country.percentage}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
