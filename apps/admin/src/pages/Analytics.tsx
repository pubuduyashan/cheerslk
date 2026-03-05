import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const revenueData = Array.from({ length: 30 }, (_, i) => ({
  date: `Jan ${i + 1}`,
  revenue: Math.floor(30000 + Math.random() * 50000),
}));

const ordersData = Array.from({ length: 30 }, (_, i) => ({
  date: `Jan ${i + 1}`,
  orders: Math.floor(60 + Math.random() * 80),
}));

const customerGrowth = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
  customers: Math.floor(100 + i * 45 + Math.random() * 30),
}));

const topProducts = [
  { name: 'Arrack Special Reserve', category: 'Spirits', sold: 342, revenue: 957600 },
  { name: 'Lion Lager 625ml', category: 'Beer', sold: 528, revenue: 343200 },
  { name: 'Old Reserve Whisky', category: 'Spirits', sold: 198, revenue: 891000 },
  { name: 'Carlsberg Can 330ml', category: 'Beer', sold: 412, revenue: 226600 },
  { name: 'Smirnoff Vodka 750ml', category: 'Spirits', sold: 156, revenue: 811200 },
  { name: 'Red Wine Cabernet', category: 'Wine', sold: 89, revenue: 338200 },
  { name: 'Coca Cola 1.5L', category: 'Mixers', sold: 620, revenue: 217000 },
  { name: 'Ice Bag 2kg', category: 'Essentials', sold: 890, revenue: 178000 },
];

const tooltipStyle = {
  backgroundColor: '#1a1a2e',
  border: '1px solid #2a2a4a',
  borderRadius: '8px',
  color: '#fff',
};

export default function Analytics() {
  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="rounded-xl bg-dark-800 border border-dark-700 p-5">
          <p className="text-xs text-gray-400">Total Revenue (30d)</p>
          <p className="text-2xl font-bold text-white mt-1">Rs. 1,284,500</p>
          <p className="text-xs text-green-400 mt-1">+14.2% vs last month</p>
        </div>
        <div className="rounded-xl bg-dark-800 border border-dark-700 p-5">
          <p className="text-xs text-gray-400">Total Orders (30d)</p>
          <p className="text-2xl font-bold text-white mt-1">2,847</p>
          <p className="text-xs text-green-400 mt-1">+8.7% vs last month</p>
        </div>
        <div className="rounded-xl bg-dark-800 border border-dark-700 p-5">
          <p className="text-xs text-gray-400">Avg Order Value</p>
          <p className="text-2xl font-bold text-white mt-1">Rs. 4,512</p>
          <p className="text-xs text-green-400 mt-1">+5.1% vs last month</p>
        </div>
        <div className="rounded-xl bg-dark-800 border border-dark-700 p-5">
          <p className="text-xs text-gray-400">New Customers (30d)</p>
          <p className="text-2xl font-bold text-white mt-1">186</p>
          <p className="text-xs text-red-400 mt-1">-3.2% vs last month</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="rounded-xl bg-dark-800 border border-dark-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Revenue - Last 30 Days</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={10} interval={4} />
              <YAxis stroke="#6b7280" fontSize={10} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [`Rs. ${value.toLocaleString()}`, 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#e94560" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders Chart */}
        <div className="rounded-xl bg-dark-800 border border-dark-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Daily Orders</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ordersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={10} interval={4} />
                <YAxis stroke="#6b7280" fontSize={10} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="orders" fill="#e94560" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Growth */}
        <div className="rounded-xl bg-dark-800 border border-dark-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Customer Growth</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={customerGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={10} />
                <YAxis stroke="#6b7280" fontSize={10} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="customers" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="rounded-xl bg-dark-800 border border-dark-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Top Products</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-gray-400 border-b border-dark-700">
              <tr>
                <th className="px-4 py-3 font-medium">#</th>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Units Sold</th>
                <th className="px-4 py-3 font-medium">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700">
              {topProducts.map((product, i) => (
                <tr key={i} className="hover:bg-dark-700/50 transition-colors">
                  <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-white">{product.name}</td>
                  <td className="px-4 py-3 text-gray-400">{product.category}</td>
                  <td className="px-4 py-3 text-gray-300">{product.sold.toLocaleString()}</td>
                  <td className="px-4 py-3 text-white font-medium">Rs. {product.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
