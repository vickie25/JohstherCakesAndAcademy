import React from 'react';
import { 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Package, 
  ArrowUpRight
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
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { apiRequest, formatCurrency } from '@/lib/api';

// Data will be fetched from API

export default function DashboardOverview() {
  const [stats, setStats] = React.useState<any>(null);
  const [orders, setOrders] = React.useState<any[]>([]);
  const [chartData, setChartData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      const { data: statsData } = await apiRequest<any>('/dashboard/stats');
      const { data: ordersData } = await apiRequest<any[]>('/dashboard/recent-orders');
      const { data: chartResponse } = await apiRequest<any>('/dashboard/analytics');

      if (statsData) setStats(statsData);
      else setStats({ users: '0', monthlySales: 0, totalSales: 0, orders: '0' });

      if (ordersData) setOrders(ordersData);
      if (chartResponse?.lineData) setChartData(chartResponse.lineData);
      
      setLoading(false);
    };
    fetchDashboardData();
  }, []);

  const kpis = [
    { label: 'Registered Users', value: stats?.users || '0', grow: '+12.5% vs last month', icon: Users, tint: 'bg-[#E6F0FA] text-[#2A5A8A]', trendColor: 'text-[var(--color-success)]' },
    { label: 'Sales This Month', value: formatCurrency(stats?.monthlySales || 0), grow: '+12.5% vs last month', icon: TrendingUp, tint: 'bg-[#FFF3E0] text-[var(--color-accent-primary)]', trendColor: 'text-[var(--color-success)]' },
    { label: 'Total Sales', value: formatCurrency(stats?.totalSales || 0), grow: '+5.2% vs last month', icon: ShoppingCart, tint: 'bg-[#E8F5E8] text-[#3A7A3A]', trendColor: 'text-[var(--color-success)]' },
    { label: 'Total Orders', value: stats?.orders || '0', grow: '-2.1% vs last month', icon: Package, tint: 'bg-[#FDECEC] text-[#A03030]', trendColor: 'text-[var(--color-danger)]' },
  ];
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className="bg-[var(--color-bg-surface)] p-6 rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] transition-transform hover:-translate-y-1">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${kpi.tint}`}>
                  <Icon size={20} />
                </div>
              </div>
              <p className="text-[var(--color-text-secondary)] text-[13px] font-medium mb-1">{kpi.label}</p>
              <p className="font-display text-[26px] font-bold text-[var(--color-text-primary)] leading-tight">{kpi.value}</p>
              <div className={`flex items-center gap-1 text-[11px] font-bold mt-3 ${kpi.trendColor}`}>
                ▲ {kpi.grow}
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-[var(--color-bg-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] p-6">
          <div className="flex flex-row items-center justify-between mb-6">
            <h2 className="font-display text-[20px] font-bold text-[var(--color-text-primary)]">Sales Analytics</h2>
            <div className="flex items-center bg-[var(--color-bg-muted)] rounded-full p-1">
              <button className="px-4 py-1 text-[13px] font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] rounded-full transition-colors">Yearly</button>
              <button className="px-4 py-1 text-[13px] font-semibold bg-white text-[var(--color-accent-primary)] shadow-sm rounded-full transition-colors">Monthly</button>
              <button className="px-4 py-1 text-[13px] font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] rounded-full transition-colors">Weekly</button>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C8884A" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#C8884A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
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
                  contentStyle={{ 
                    backgroundColor: 'var(--color-bg-deep)', 
                    borderRadius: 'var(--radius-md)', 
                    border: 'none', 
                    color: 'white',
                    fontSize: '13px',
                    fontFamily: 'DM Sans',
                    fontWeight: 500
                  }} 
                  itemStyle={{
                    color: 'white'
                  }}
                  cursor={{ stroke: 'var(--color-accent-primary)', strokeWidth: 1 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="var(--color-accent-primary)" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-[var(--color-bg-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] p-6">
          <h2 className="font-display text-[20px] font-bold text-[var(--color-text-primary)] mb-6">Top Selling Cakes</h2>
          <div className="space-y-5">
            {[
              { name: "Vanilla Bean Supreme", category: "Wedding Cake", trend: "+12.5%", status: "success", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100&h=100&fit=crop" },
              { name: "Chocolate Fudge", category: "Birthday Cake", trend: "+8.2%", status: "success", image: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=100&h=100&fit=crop" },
              { name: "Red Velvet Dream", category: "Anniversary Cake", trend: "+5.1%", status: "success", image: "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=100&h=100&fit=crop" },
              { name: "Lemon Drizzle", category: "Cupcakes", trend: "-1.2%", status: "danger", image: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=100&h=100&fit=crop" },
            ].map((p, i) => (
              <div key={i} className="flex items-center gap-4 group cursor-pointer">
                <img src={p.image} alt={p.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-[var(--color-text-primary)] truncate group-hover:text-[var(--color-accent-primary)] transition-colors">{p.name}</p>
                  <p className="text-[12px] text-[var(--color-text-secondary)] truncate">{p.category}</p>
                </div>
                <div className="text-right shrink-0">
                   <div className={`flex items-center gap-1 text-[11px] font-bold ${p.status === 'success' ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
                    ▲ {p.trend}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-[var(--color-bg-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] overflow-hidden">
        <div className="flex flex-row items-center justify-between p-6 border-b border-[var(--color-border)]">
          <h2 className="font-display text-[20px] font-bold text-[var(--color-text-primary)]">Recent Orders</h2>
          <div className="relative">
            <select className="appearance-none bg-white border border-[var(--color-border)] text-[13px] font-semibold text-[var(--color-text-primary)] px-4 py-2 pr-8 rounded-[var(--radius-sm)] outline-none focus:border-[var(--color-accent-primary)] transition-colors">
              <option>Delivered</option>
              <option>Pending</option>
              <option>Cancelled</option>
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[10px]">▼</span>
          </div>
        </div>
        <div className="w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product name</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right border-none">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order, i) => (
                <TableRow key={i}>
                  <TableCell className="font-semibold text-[var(--color-text-primary)] py-4">{order.product}</TableCell>
                  <TableCell className="font-mono text-[var(--color-text-secondary)] py-4">{order.id}</TableCell>
                  <TableCell className="text-[var(--color-text-secondary)] py-4">{order.date}</TableCell>
                  <TableCell className="font-bold text-[var(--color-text-primary)] py-4">{formatCurrency(order.amount)}</TableCell>
                  <TableCell className="py-4">
                    <StatusBadge 
                      status={order.status.toLowerCase() as any} 
                      showDot={true} 
                    />
                  </TableCell>
                  <TableCell className="text-right py-4">
                    <Button variant="outline" size="sm" className="h-[28px] border-[var(--color-accent-primary)] text-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary)]/10 font-medium">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
