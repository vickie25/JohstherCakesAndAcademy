import React from 'react';
import { 
  Users, 
  TrendingUp, 
  Monitor, 
  Smartphone, 
  MoreHorizontal,
  Globe,
  ArrowUpRight
} from 'lucide-react';
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
  Cell
} from 'recharts';
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiRequest, formatCurrency } from '@/lib/api';

const MOCK_LINE_DATA = [
  { name: 'Mon', users: 400, sales: 240 },
  { name: 'Tue', users: 300, sales: 139 },
  { name: 'Wed', users: 200, sales: 980 },
  { name: 'Thu', users: 278, sales: 390 },
  { name: 'Fri', users: 189, sales: 480 },
  { name: 'Sat', users: 239, sales: 380 },
  { name: 'Sun', users: 349, sales: 430 },
];

const MOCK_DEVICES = [
  { name: 'Desktop', value: 65, color: '#C8884A' },
  { name: 'Phone', value: 25, color: '#5A8A5E' },
  { name: 'Others', value: 10, color: '#B5A090' },
];

const MOCK_COUNTRIES = [
  { name: 'Kenya', users: 850, percentage: 85 },
  { name: 'USA', users: 120, percentage: 12 },
  { name: 'UK', users: 50, percentage: 5 },
];

export default function AnalyticsView() {
  const [lineData, setLineData] = React.useState(MOCK_LINE_DATA);
  const [deviceData, setDeviceData] = React.useState(MOCK_DEVICES);
  const [countryData, setCountryData] = React.useState(MOCK_COUNTRIES);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      const { data: analytics, error } = await apiRequest<any>('/analytics');
      if (analytics) {
        if (analytics.lineData) setLineData(analytics.lineData);
        if (analytics.deviceData) setDeviceData(analytics.deviceData);
        if (analytics.countryData) setCountryData(analytics.countryData);
      }
      setLoading(false);
    };
    fetchAnalytics();
  }, []);
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-[34px] font-bold text-[var(--color-text-primary)]">Store Analytics</h1>
        <p className="text-[14px] text-[var(--color-text-secondary)]">Review historical performance and user behavior.</p>
      </div>

      {/* Analytics Chart & Devices Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users vs Sales Line Chart */}
        <div className="lg:col-span-2 bg-[var(--color-bg-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] p-6">
          <div className="flex flex-row items-center justify-between mb-6">
            <h2 className="font-display text-[20px] font-bold text-[var(--color-text-primary)]">User Growth vs Sales</h2>
            <div className="flex items-center bg-[var(--color-bg-muted)] rounded-full p-1">
              <button className="px-4 py-1 text-[13px] font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] rounded-full transition-colors">Daily</button>
              <button className="px-4 py-1 text-[13px] font-semibold bg-white text-[var(--color-accent-primary)] shadow-sm rounded-full transition-colors">Weekly</button>
              <button className="px-4 py-1 text-[13px] font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] rounded-full transition-colors">Monthly</button>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--color-text-secondary)', fontSize: 13, fontFamily: 'DM Sans' }} 
                  dy={10} 
                />
                <YAxis hide />
                <Tooltip
                  cursor={{ stroke: 'var(--color-accent-primary)', strokeWidth: 1 }}
                  formatter={(value: any, name: any) => {
                    if (name === 'sales') return [formatCurrency(value), 'Sales'];
                    return [value, 'Users'];
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#5A8A5E" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#5A8A5E', strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#C8884A" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#C8884A', strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Devices Donut */}
        <div className="bg-[var(--color-bg-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] p-6">
          <h2 className="font-display text-[20px] font-bold text-[var(--color-text-primary)] mb-6">Devices Used</h2>
          <div className="h-[250px] relative flex items-center justify-center">
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
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="font-display text-[34px] font-bold text-[var(--color-text-primary)] leading-none">65%</span>
              <span className="text-[12px] text-[var(--color-text-secondary)] mt-1">Desktop</span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-3">
            {deviceData.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[14px] text-[var(--color-text-secondary)]">{item.name}</span>
                </div>
                <span className="text-[14px] font-bold text-[var(--color-text-primary)]">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* World Map & Rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* World Map Visualization (SVG Placeholder) */}
        <div className="bg-[var(--color-bg-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] p-6">
          <h2 className="font-display text-[20px] font-bold text-[var(--color-text-primary)] mb-6">Top Countries</h2>
          <div className="aspect-[16/9] w-full bg-[var(--color-bg-muted)] rounded-[var(--radius-md)] flex items-center justify-center relative overflow-hidden group">
            {/* Simple SVG World Map Placeholder with some highlighted paths */}
            <Globe className="w-32 h-32 text-[var(--color-accent-primary)]/20 animate-pulse" />
            <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[var(--color-border)] flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--color-accent-primary)] animate-ping" />
              <span className="text-[11px] font-bold text-[var(--color-text-primary)] uppercase tracking-wider">Live Traffic Hub</span>
            </div>
            <p className="absolute bottom-6 text-[var(--color-text-secondary)] text-[12px] italic">SVG World Map active highlight visualization</p>
          </div>
        </div>

        {/* Country Rankings Table */}
        <div className="bg-[var(--color-bg-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] flex flex-col">
          <div className="p-6 border-b border-[var(--color-border)]">
            <h2 className="font-display text-[20px] font-bold text-[var(--color-text-primary)]">Country Rankings</h2>
          </div>
          <div className="flex-1 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Country</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead className="text-right">Activity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {countryData.map((country, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-semibold text-[var(--color-text-primary)] py-4">
                      {country.name}
                    </TableCell>
                    <TableCell className="text-[var(--color-text-secondary)] py-4">
                      {country.users}
                    </TableCell>
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
          </div>
        </div>
      </div>
    </div>
  );
}
