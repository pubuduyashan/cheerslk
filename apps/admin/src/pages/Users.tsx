import { useState, useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import toast from 'react-hot-toast';

interface UserRow {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: 'customer' | 'rider' | 'admin';
  ageVerificationStatus: 'not_submitted' | 'pending' | 'approved' | 'rejected';
  ordersCount: number;
  totalSpent: number;
  joinedDate: string;
  lastActive: string;
}

const demoUsers: UserRow[] = [
  { id: '1', name: 'Kamal Perera', phone: '+94 77 123 4567', email: 'kamal@gmail.com', role: 'customer', ageVerificationStatus: 'approved', ordersCount: 24, totalSpent: 68500, joinedDate: '2023-05-10', lastActive: '2024-01-15' },
  { id: '2', name: 'Nimal Silva', phone: '+94 71 234 5678', email: 'nimal.s@yahoo.com', role: 'customer', ageVerificationStatus: 'approved', ordersCount: 18, totalSpent: 45200, joinedDate: '2023-06-22', lastActive: '2024-01-15' },
  { id: '3', name: 'Saman Fernando', phone: '+94 76 345 6789', role: 'customer', ageVerificationStatus: 'pending', ordersCount: 3, totalSpent: 8700, joinedDate: '2024-01-02', lastActive: '2024-01-15' },
  { id: '4', name: 'Ruwan Jayawardena', phone: '+94 75 456 7890', email: 'ruwan.j@gmail.com', role: 'customer', ageVerificationStatus: 'approved', ordersCount: 42, totalSpent: 156000, joinedDate: '2023-03-15', lastActive: '2024-01-14' },
  { id: '5', name: 'Dilshan Mendis', phone: '+94 78 567 8901', role: 'customer', ageVerificationStatus: 'not_submitted', ordersCount: 0, totalSpent: 0, joinedDate: '2024-01-14', lastActive: '2024-01-14' },
  { id: '6', name: 'Ashan Bandara', phone: '+94 77 678 9012', email: 'ashan.b@gmail.com', role: 'customer', ageVerificationStatus: 'approved', ordersCount: 15, totalSpent: 52300, joinedDate: '2023-08-07', lastActive: '2024-01-13' },
  { id: '7', name: 'Prasad Kumara', phone: '+94 71 789 0123', role: 'customer', ageVerificationStatus: 'rejected', ordersCount: 1, totalSpent: 3200, joinedDate: '2023-12-28', lastActive: '2024-01-12' },
  { id: '8', name: 'Tharindu Rajapaksa', phone: '+94 76 890 1234', email: 'tharindu@outlook.com', role: 'customer', ageVerificationStatus: 'approved', ordersCount: 31, totalSpent: 89400, joinedDate: '2023-04-19', lastActive: '2024-01-15' },
  { id: '9', name: 'Admin User', phone: '+94 77 000 0000', email: 'admin@cheerslk.com', role: 'admin', ageVerificationStatus: 'approved', ordersCount: 0, totalSpent: 0, joinedDate: '2023-01-01', lastActive: '2024-01-15' },
  { id: '10', name: 'Lakshan Dias', phone: '+94 71 111 0000', role: 'customer', ageVerificationStatus: 'pending', ordersCount: 2, totalSpent: 5800, joinedDate: '2024-01-08', lastActive: '2024-01-13' },
];

const ageStatusConfig: Record<string, { label: string; variant: string }> = {
  not_submitted: { label: 'Not Submitted', variant: 'gray' },
  pending: { label: 'Pending', variant: 'yellow' },
  approved: { label: 'Verified', variant: 'green' },
  rejected: { label: 'Rejected', variant: 'red' },
};

const roleConfig: Record<string, { label: string; variant: string }> = {
  customer: { label: 'Customer', variant: 'blue' },
  rider: { label: 'Rider', variant: 'cyan' },
  admin: { label: 'Admin', variant: 'brand' },
};

const columnHelper = createColumnHelper<UserRow>();

export default function Users() {
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [users, setUsers] = useState(demoUsers);

  const handleAgeVerification = (userId: string, status: 'approved' | 'rejected') => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ageVerificationStatus: status } : u))
    );
    setSelectedUser(null);
    toast.success(`Age verification ${status}`);
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: (info) => (
          <div>
            <p className="font-medium text-white">{info.getValue()}</p>
            <p className="text-xs text-gray-500">{info.row.original.email || info.row.original.phone}</p>
          </div>
        ),
      }),
      columnHelper.accessor('phone', {
        header: 'Phone',
      }),
      columnHelper.accessor('role', {
        header: 'Role',
        cell: (info) => {
          const cfg = roleConfig[info.getValue()];
          return <Badge variant={cfg.variant as 'green'}>{cfg.label}</Badge>;
        },
      }),
      columnHelper.accessor('ageVerificationStatus', {
        header: 'Age Verification',
        cell: (info) => {
          const cfg = ageStatusConfig[info.getValue()];
          return <Badge variant={cfg.variant as 'green'}>{cfg.label}</Badge>;
        },
      }),
      columnHelper.accessor('ordersCount', {
        header: 'Orders',
      }),
      columnHelper.accessor('totalSpent', {
        header: 'Total Spent',
        cell: (info) => `Rs. ${info.getValue().toLocaleString()}`,
      }),
      columnHelper.accessor('joinedDate', {
        header: 'Joined',
        cell: (info) => <span className="text-gray-400 text-xs">{info.getValue()}</span>,
      }),
      columnHelper.display({
        id: 'actions',
        header: '',
        cell: (info) => (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedUser(info.row.original);
            }}
            className="rounded-lg px-3 py-1 text-xs font-medium bg-dark-700 text-gray-300 hover:text-white hover:bg-dark-600"
          >
            View
          </button>
        ),
      }),
    ],
    []
  );

  return (
    <div className="space-y-6">
      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-lg bg-dark-800 border border-dark-700 p-4">
          <p className="text-xs text-gray-400">Total Users</p>
          <p className="text-2xl font-bold text-white">{users.length}</p>
        </div>
        <div className="rounded-lg bg-dark-800 border border-dark-700 p-4">
          <p className="text-xs text-gray-400">Verified</p>
          <p className="text-2xl font-bold text-green-400">{users.filter((u) => u.ageVerificationStatus === 'approved').length}</p>
        </div>
        <div className="rounded-lg bg-dark-800 border border-dark-700 p-4">
          <p className="text-xs text-gray-400">Pending Verification</p>
          <p className="text-2xl font-bold text-yellow-400">{users.filter((u) => u.ageVerificationStatus === 'pending').length}</p>
        </div>
        <div className="rounded-lg bg-dark-800 border border-dark-700 p-4">
          <p className="text-xs text-gray-400">New Today</p>
          <p className="text-2xl font-bold text-brand-500">3</p>
        </div>
      </div>

      <DataTable data={users} columns={columns} searchPlaceholder="Search users..." />

      {/* User Detail Modal */}
      <Modal
        open={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title={selectedUser?.name || 'User Details'}
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Phone</p>
                <p className="text-white">{selectedUser.phone}</p>
              </div>
              <div>
                <p className="text-gray-400">Email</p>
                <p className="text-white">{selectedUser.email || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-gray-400">Role</p>
                <Badge variant={roleConfig[selectedUser.role].variant as 'green'}>
                  {roleConfig[selectedUser.role].label}
                </Badge>
              </div>
              <div>
                <p className="text-gray-400">Joined</p>
                <p className="text-white">{selectedUser.joinedDate}</p>
              </div>
              <div>
                <p className="text-gray-400">Total Orders</p>
                <p className="text-white">{selectedUser.ordersCount}</p>
              </div>
              <div>
                <p className="text-gray-400">Total Spent</p>
                <p className="text-white">Rs. {selectedUser.totalSpent.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400">Last Active</p>
                <p className="text-white">{selectedUser.lastActive}</p>
              </div>
              <div>
                <p className="text-gray-400">Age Verification</p>
                <Badge variant={ageStatusConfig[selectedUser.ageVerificationStatus].variant as 'green'}>
                  {ageStatusConfig[selectedUser.ageVerificationStatus].label}
                </Badge>
              </div>
            </div>

            {/* Age verification review */}
            {selectedUser.ageVerificationStatus === 'pending' && (
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-3">NIC Photos</h4>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {['NIC Front', 'NIC Back'].map((doc) => (
                    <div key={doc} className="rounded-lg bg-dark-900 border border-dark-600 p-6 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                      </svg>
                      <p className="text-xs text-gray-400">{doc}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAgeVerification(selectedUser.id, 'approved')}
                    className="flex-1 rounded-lg bg-green-500/10 text-green-400 py-2 text-sm font-semibold hover:bg-green-500/20"
                  >
                    Approve Age Verification
                  </button>
                  <button
                    onClick={() => handleAgeVerification(selectedUser.id, 'rejected')}
                    className="flex-1 rounded-lg bg-red-500/10 text-red-400 py-2 text-sm font-semibold hover:bg-red-500/20"
                  >
                    Reject
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="rounded-lg border border-dark-600 px-4 py-2 text-sm text-gray-300 hover:bg-dark-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
