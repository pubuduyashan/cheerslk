import { StatsCard } from '@/components/ui/StatsCard';
import { Badge } from '@/components/ui/Badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const revenueData = [
  { day: 'Mon', revenue: 42500 },
  { day: 'Tue', revenue: 38200 },
  { day: 'Wed', revenue: 51800 },
  { day: 'Thu', revenue: 46300 },
  { day: 'Fri', revenue: 62100 },
  { day: 'Sat', revenue: 78400 },
  { day: 'Sun', revenue: 71200 },
];

const recentOrders = [
  { id: 'ORD-2401', customer: 'Kamal Perera', status: 'delivered', total: 4250, payment: 'paid', date: '2024-01-15 14:32' },
  { id: 'ORD-2400', customer: 'Nimal Silva', status: 'in_transit', total: 6800, payment: 'paid', date: '2024-01-15 14:18' },
  { id: 'ORD-2399', customer: 'Saman Fernando', status: 'preparing', total: 3200, payment: 'paid', date: '2024-01-15 14:05' },
  { id: 'ORD-2398', customer: 'Ruwan Jayawardena', status: 'confirmed', total: 12500, payment: 'paid', date: '2024-01-15 13:52' },
  { id: 'ORD-2397', customer: 'Dilshan Mendis', status: 'pending', total: 2850, payment: 'pending', date: '2024-01-15 13:41' },
  { id: 'ORD-2396', customer: 'Ashan Bandara', status: 'delivered', total: 5600, payment: 'paid', date: '2024-01-15 13:28' },
  { id: 'ORD-2395', customer: 'Prasad Kumara', status: 'cancelled', total: 7200, payment: 'refunded', date: '2024-01-15 13:15' },
  { id: 'ORD-2394', customer: 'Tharindu Rajapaksa', status: 'delivered', total: 4900, payment: 'paid', date: '2024-01-15 12:58' },
  { id: 'ORD-2393', customer: 'Malintha Wickrama', status: 'delivered', total: 8300, payment: 'paid', date: '2024-01-15 12:42' },
  { id: 'ORD-2392', customer: 'Chathura de Silva', status: 'rider_assigned', total: 3750, payment: 'paid', date: '2024-01-15 12:30' },
];

const statusBadge: Record<string, { label: string; variant: string }> = {
  pending: { label: 'Pending', variant: 'yellow' },
  paid: { label: 'Paid', variant: 'blue' },
  confirmed: { label: 'Confirmed', variant: 'purple' },
  preparing: { label: 'Preparing', variant: 'orange' },
  rider_assigned: { label: 'Rider Assigned', variant: 'purple' },
  picked_up: { label: 'Picked Up', variant: 'cyan' },
  in_transit: { label: 'In Transit', variant: 'cyan' },
  delivered: { label: 'Delivered', variant: 'green' },
  cancelled: { label: 'Cancelled', variant: 'red' },
  refunded: { label: 'Refunded', variant: 'gray' },
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          label="Total Orders Today"
          value="127"
          change={12.5}
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
        <StatsCard
          label="Revenue Today"
          value="Rs. 390,500"
          change={8.2}
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatsCard
          label="Active Riders"
          value="18"
          change={-5.3}
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
        />
        <StatsCard
          label="Pending Orders"
          value="14"
          change={-22.1}
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Revenue Chart */}
      <div className="rounded-xl bg-dark-800 border border-dark-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Revenue - Last 7 Days</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" />
              <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a2e',
                  border: '1px solid #2a2a4a',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                formatter={(value: number) => [`Rs. ${value.toLocaleString()}`, 'Revenue']}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#e94560"
                strokeWidth={2}
                dot={{ fill: '#e94560', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-xl bg-dark-800 border border-dark-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Recent Orders</h3>
          <span className="flex items-center gap-1.5 text-xs text-green-400">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            Live
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-gray-400 border-b border-dark-700">
              <tr>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Payment</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700">
              {recentOrders.map((order) => {
                const status = statusBadge[order.status];
                const payStatus = statusBadge[order.payment];
                return (
                  <tr key={order.id} className="hover:bg-dark-700/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-white">{order.id}</td>
                    <td className="px-4 py-3 text-gray-300">{order.customer}</td>
                    <td className="px-4 py-3">
                      <Badge variant={status?.variant as 'green'}>{status?.label}</Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-300">Rs. {order.total.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <Badge variant={payStatus?.variant as 'green'}>{payStatus?.label}</Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{order.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
