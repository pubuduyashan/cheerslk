import { useState, useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';

interface OrderRow {
  id: string;
  orderNumber: string;
  customer: string;
  phone: string;
  status: string;
  total: number;
  deliveryFee: number;
  paymentStatus: string;
  paymentMethod: string;
  date: string;
  items: { name: string; qty: number; price: number }[];
  address: string;
  rider?: string;
  specialInstructions?: string;
}

const demoOrders: OrderRow[] = [
  { id: '1', orderNumber: 'ORD-2401', customer: 'Kamal Perera', phone: '+94 77 123 4567', status: 'delivered', total: 4250, deliveryFee: 250, paymentStatus: 'paid', paymentMethod: 'payhere', date: '2024-01-15 14:32', items: [{ name: 'Arrack Special Reserve', qty: 1, price: 2800 }, { name: 'Coca Cola 1.5L', qty: 2, price: 700 }, { name: 'Ice Bag 2kg', qty: 1, price: 200 }], address: '45 Galle Road, Colombo 03', rider: 'Nuwan Bandara' },
  { id: '2', orderNumber: 'ORD-2400', customer: 'Nimal Silva', phone: '+94 71 234 5678', status: 'in_transit', total: 6800, deliveryFee: 250, paymentStatus: 'paid', paymentMethod: 'payhere', date: '2024-01-15 14:18', items: [{ name: 'Old Reserve Whisky', qty: 1, price: 4500 }, { name: 'Tonic Water 500ml', qty: 4, price: 1120 }], address: '12 Flower Road, Colombo 07', rider: 'Saman Kumara' },
  { id: '3', orderNumber: 'ORD-2399', customer: 'Saman Fernando', phone: '+94 76 345 6789', status: 'preparing', total: 3200, deliveryFee: 250, paymentStatus: 'paid', paymentMethod: 'cash_on_delivery', date: '2024-01-15 14:05', items: [{ name: 'Lion Lager 625ml', qty: 4, price: 2600 }, { name: 'Snack Pack', qty: 1, price: 350 }], address: '78 Duplication Road, Colombo 04' },
  { id: '4', orderNumber: 'ORD-2398', customer: 'Ruwan Jayawardena', phone: '+94 75 456 7890', status: 'confirmed', total: 12500, deliveryFee: 0, paymentStatus: 'paid', paymentMethod: 'payhere', date: '2024-01-15 13:52', items: [{ name: 'Smirnoff Vodka 750ml', qty: 2, price: 10400 }, { name: 'Tonic Water 500ml', qty: 4, price: 1120 }], address: '34 Park Street, Colombo 02', specialInstructions: 'Leave at security desk' },
  { id: '5', orderNumber: 'ORD-2397', customer: 'Dilshan Mendis', phone: '+94 78 567 8901', status: 'pending', total: 2850, deliveryFee: 250, paymentStatus: 'pending', paymentMethod: 'payhere', date: '2024-01-15 13:41', items: [{ name: 'Carlsberg Can 330ml', qty: 6, price: 3300 }], address: '90 Havelock Road, Colombo 05' },
  { id: '6', orderNumber: 'ORD-2396', customer: 'Ashan Bandara', phone: '+94 77 678 9012', status: 'delivered', total: 5600, deliveryFee: 250, paymentStatus: 'paid', paymentMethod: 'payhere', date: '2024-01-15 13:28', items: [{ name: 'Red Wine Cabernet', qty: 1, price: 3800 }, { name: 'Heineken 330ml', qty: 2, price: 1500 }], address: '56 Baseline Road, Colombo 09', rider: 'Kasun Rajitha' },
  { id: '7', orderNumber: 'ORD-2395', customer: 'Prasad Kumara', phone: '+94 71 789 0123', status: 'cancelled', total: 7200, deliveryFee: 0, paymentStatus: 'refunded', paymentMethod: 'payhere', date: '2024-01-15 13:15', items: [{ name: 'Old Reserve Whisky', qty: 1, price: 4500 }, { name: 'Arrack Special Reserve', qty: 1, price: 2800 }], address: '23 Ward Place, Colombo 07' },
  { id: '8', orderNumber: 'ORD-2394', customer: 'Tharindu Rajapaksa', phone: '+94 76 890 1234', status: 'delivered', total: 4900, deliveryFee: 250, paymentStatus: 'paid', paymentMethod: 'cash_on_delivery', date: '2024-01-15 12:58', items: [{ name: 'Mendis Coconut Arrack', qty: 2, price: 3700 }, { name: 'Ice Bag 2kg', qty: 2, price: 400 }], address: '67 Bauddhaloka Mawatha, Colombo 04', rider: 'Nuwan Bandara' },
  { id: '9', orderNumber: 'ORD-2393', customer: 'Malintha Wickrama', phone: '+94 75 901 2345', status: 'delivered', total: 8300, deliveryFee: 0, paymentStatus: 'paid', paymentMethod: 'payhere', date: '2024-01-15 12:42', items: [{ name: 'Smirnoff Vodka 750ml', qty: 1, price: 5200 }, { name: 'Coca Cola 1.5L', qty: 4, price: 1400 }, { name: 'Goldleaf Cigarettes', qty: 1, price: 1200 }], address: '89 Wijerama Mawatha, Colombo 07', rider: 'Saman Kumara' },
  { id: '10', orderNumber: 'ORD-2392', customer: 'Chathura de Silva', phone: '+94 78 012 3456', status: 'rider_assigned', total: 3750, deliveryFee: 250, paymentStatus: 'paid', paymentMethod: 'payhere', date: '2024-01-15 12:30', items: [{ name: 'Lion Lager 625ml', qty: 4, price: 2600 }, { name: 'Tonic Water 500ml', qty: 2, price: 560 }], address: '45 Thimbirigasyaya Road, Colombo 05', rider: 'Kasun Rajitha' },
];

const statusConfig: Record<string, { label: string; variant: string }> = {
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

const statusTabs = ['All', 'pending', 'confirmed', 'preparing', 'in_transit', 'delivered', 'cancelled'];

const columnHelper = createColumnHelper<OrderRow>();

export default function Orders() {
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [orders, setOrders] = useState(demoOrders);

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'All') return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  const updateStatus = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor('orderNumber', {
        header: 'Order',
        cell: (info) => <span className="font-medium text-white">{info.getValue()}</span>,
      }),
      columnHelper.accessor('customer', {
        header: 'Customer',
        cell: (info) => (
          <div>
            <p className="text-white">{info.getValue()}</p>
            <p className="text-xs text-gray-500">{info.row.original.phone}</p>
          </div>
        ),
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => {
          const cfg = statusConfig[info.getValue()];
          return <Badge variant={cfg?.variant as 'green'}>{cfg?.label}</Badge>;
        },
      }),
      columnHelper.accessor('total', {
        header: 'Total',
        cell: (info) => `Rs. ${info.getValue().toLocaleString()}`,
      }),
      columnHelper.accessor('paymentStatus', {
        header: 'Payment',
        cell: (info) => {
          const cfg = statusConfig[info.getValue()];
          return <Badge variant={cfg?.variant as 'green'}>{cfg?.label}</Badge>;
        },
      }),
      columnHelper.accessor('paymentMethod', {
        header: 'Method',
        cell: (info) => (
          <span className="text-xs">{info.getValue() === 'payhere' ? 'PayHere' : 'COD'}</span>
        ),
      }),
      columnHelper.accessor('date', {
        header: 'Date',
        cell: (info) => <span className="text-gray-400 text-xs">{info.getValue()}</span>,
      }),
      columnHelper.display({
        id: 'statusUpdate',
        header: '',
        cell: (info) => {
          const order = info.row.original;
          if (order.status === 'delivered' || order.status === 'cancelled') return null;
          return (
            <select
              value=""
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => {
                if (e.target.value) updateStatus(order.id, e.target.value);
              }}
              className="rounded border border-dark-600 bg-dark-900 px-2 py-1 text-xs text-white focus:outline-none"
            >
              <option value="">Update</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="rider_assigned">Assign Rider</option>
              <option value="picked_up">Picked Up</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancel</option>
            </select>
          );
        },
      }),
    ],
    []
  );

  return (
    <div className="space-y-6">
      {/* Realtime indicator */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {statusTabs.map((tab) => {
            const label = tab === 'All' ? 'All' : statusConfig[tab]?.label || tab;
            return (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  statusFilter === tab
                    ? 'bg-brand-500 text-white'
                    : 'bg-dark-800 text-gray-400 hover:text-white border border-dark-700'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        <span className="flex items-center gap-1.5 text-xs text-green-400">
          <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          Realtime
        </span>
      </div>

      <DataTable
        data={filteredOrders}
        columns={columns}
        searchPlaceholder="Search orders..."
        onRowClick={(row) => setExpandedOrder(expandedOrder === row.id ? null : row.id)}
      />

      {/* Expanded order detail */}
      {expandedOrder && (() => {
        const order = orders.find((o) => o.id === expandedOrder);
        if (!order) return null;
        return (
          <div className="rounded-xl bg-dark-800 border border-dark-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Order Details - {order.orderNumber}</h3>
              <button
                onClick={() => setExpandedOrder(null)}
                className="rounded-lg p-1 text-gray-400 hover:text-white"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Items */}
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Items</h4>
                <div className="space-y-2">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-300">{item.qty}x {item.name}</span>
                      <span className="text-white">Rs. {item.price.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="border-t border-dark-700 pt-2 mt-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Delivery Fee</span>
                      <span className="text-gray-300">{order.deliveryFee === 0 ? 'Free' : `Rs. ${order.deliveryFee}`}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold mt-1">
                      <span className="text-white">Total</span>
                      <span className="text-brand-500">Rs. {order.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery */}
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Delivery Info</h4>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-300">{order.address}</p>
                  {order.rider && (
                    <p className="text-gray-300">
                      <span className="text-gray-500">Rider:</span> {order.rider}
                    </p>
                  )}
                  {order.specialInstructions && (
                    <p className="text-yellow-400 text-xs">Note: {order.specialInstructions}</p>
                  )}
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Timeline</h4>
                <div className="space-y-3">
                  {['pending', 'confirmed', 'preparing', 'rider_assigned', 'in_transit', 'delivered'].map((step) => {
                    const stepCfg = statusConfig[step];
                    const stepIndex = ['pending', 'confirmed', 'preparing', 'rider_assigned', 'in_transit', 'delivered'].indexOf(step);
                    const currentIndex = ['pending', 'confirmed', 'preparing', 'rider_assigned', 'in_transit', 'delivered'].indexOf(order.status);
                    const isCompleted = stepIndex <= currentIndex && order.status !== 'cancelled';
                    return (
                      <div key={step} className="flex items-center gap-2">
                        <div className={`h-2.5 w-2.5 rounded-full ${isCompleted ? 'bg-green-400' : 'bg-dark-600'}`} />
                        <span className={`text-xs ${isCompleted ? 'text-white' : 'text-gray-600'}`}>
                          {stepCfg?.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
