import { useState, useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import toast from 'react-hot-toast';

interface RiderRow {
  id: string;
  name: string;
  phone: string;
  vehicleType: string;
  vehicleNumber: string;
  status: 'offline' | 'online' | 'on_delivery';
  verificationStatus: 'pending' | 'approved' | 'rejected' | 'suspended';
  rating: number;
  totalDeliveries: number;
  commissionRate: number;
  licenseNumber: string;
  joinedDate: string;
}

const demoRiders: RiderRow[] = [
  { id: '1', name: 'Nuwan Bandara', phone: '+94 77 111 2233', vehicleType: 'motorcycle', vehicleNumber: 'WP BAC-1234', status: 'online', verificationStatus: 'approved', rating: 4.8, totalDeliveries: 342, commissionRate: 15, licenseNumber: 'DL-78901', joinedDate: '2023-06-15' },
  { id: '2', name: 'Saman Kumara', phone: '+94 71 222 3344', vehicleType: 'motorcycle', vehicleNumber: 'WP CAD-5678', status: 'on_delivery', verificationStatus: 'approved', rating: 4.6, totalDeliveries: 289, commissionRate: 15, licenseNumber: 'DL-78902', joinedDate: '2023-07-20' },
  { id: '3', name: 'Kasun Rajitha', phone: '+94 76 333 4455', vehicleType: 'three_wheeler', vehicleNumber: 'WP NB-9012', status: 'online', verificationStatus: 'approved', rating: 4.9, totalDeliveries: 178, commissionRate: 12, licenseNumber: 'DL-78903', joinedDate: '2023-09-10' },
  { id: '4', name: 'Rohan Wijesekara', phone: '+94 75 444 5566', vehicleType: 'motorcycle', vehicleNumber: 'WP KH-3456', status: 'offline', verificationStatus: 'approved', rating: 4.5, totalDeliveries: 456, commissionRate: 15, licenseNumber: 'DL-78904', joinedDate: '2023-03-01' },
  { id: '5', name: 'Chaminda Perera', phone: '+94 78 555 6677', vehicleType: 'motorcycle', vehicleNumber: 'WP LM-7890', status: 'online', verificationStatus: 'approved', rating: 4.7, totalDeliveries: 201, commissionRate: 15, licenseNumber: 'DL-78905', joinedDate: '2023-08-05' },
  { id: '6', name: 'Ajith Kumara', phone: '+94 77 666 7788', vehicleType: 'car', vehicleNumber: 'WP CAE-1234', status: 'offline', verificationStatus: 'pending', rating: 0, totalDeliveries: 0, commissionRate: 10, licenseNumber: 'DL-78906', joinedDate: '2024-01-10' },
  { id: '7', name: 'Pradeep Silva', phone: '+94 71 777 8899', vehicleType: 'motorcycle', vehicleNumber: 'WP BG-5678', status: 'offline', verificationStatus: 'rejected', rating: 0, totalDeliveries: 0, commissionRate: 15, licenseNumber: 'DL-78907', joinedDate: '2024-01-05' },
  { id: '8', name: 'Dinesh Fernando', phone: '+94 76 888 9900', vehicleType: 'bicycle', vehicleNumber: 'N/A', status: 'online', verificationStatus: 'approved', rating: 4.3, totalDeliveries: 67, commissionRate: 20, licenseNumber: 'N/A', joinedDate: '2023-11-15' },
];

const statusConfig: Record<string, { label: string; variant: string }> = {
  offline: { label: 'Offline', variant: 'gray' },
  online: { label: 'Online', variant: 'green' },
  on_delivery: { label: 'On Delivery', variant: 'cyan' },
};

const verificationConfig: Record<string, { label: string; variant: string }> = {
  pending: { label: 'Pending', variant: 'yellow' },
  approved: { label: 'Approved', variant: 'green' },
  rejected: { label: 'Rejected', variant: 'red' },
  suspended: { label: 'Suspended', variant: 'orange' },
};

const vehicleLabels: Record<string, string> = {
  motorcycle: 'Motorcycle',
  bicycle: 'Bicycle',
  three_wheeler: 'Three Wheeler',
  car: 'Car',
};

const columnHelper = createColumnHelper<RiderRow>();

export default function Riders() {
  const [selectedRider, setSelectedRider] = useState<RiderRow | null>(null);
  const [riders, setRiders] = useState(demoRiders);

  const handleVerification = (riderId: string, status: 'approved' | 'rejected') => {
    setRiders((prev) =>
      prev.map((r) => (r.id === riderId ? { ...r, verificationStatus: status } : r))
    );
    setSelectedRider(null);
    toast.success(`Rider ${status}`);
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: (info) => (
          <div>
            <p className="font-medium text-white">{info.getValue()}</p>
            <p className="text-xs text-gray-500">{info.row.original.phone}</p>
          </div>
        ),
      }),
      columnHelper.accessor('vehicleType', {
        header: 'Vehicle',
        cell: (info) => (
          <div>
            <p className="text-gray-300">{vehicleLabels[info.getValue()]}</p>
            <p className="text-xs text-gray-500">{info.row.original.vehicleNumber}</p>
          </div>
        ),
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => {
          const cfg = statusConfig[info.getValue()];
          return <Badge variant={cfg.variant as 'green'}>{cfg.label}</Badge>;
        },
      }),
      columnHelper.accessor('verificationStatus', {
        header: 'Verification',
        cell: (info) => {
          const cfg = verificationConfig[info.getValue()];
          return <Badge variant={cfg.variant as 'green'}>{cfg.label}</Badge>;
        },
      }),
      columnHelper.accessor('rating', {
        header: 'Rating',
        cell: (info) => {
          const val = info.getValue();
          if (val === 0) return <span className="text-gray-500">N/A</span>;
          return (
            <div className="flex items-center gap-1">
              <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-white font-medium">{val.toFixed(1)}</span>
            </div>
          );
        },
      }),
      columnHelper.accessor('totalDeliveries', {
        header: 'Deliveries',
        cell: (info) => info.getValue().toLocaleString(),
      }),
      columnHelper.display({
        id: 'actions',
        header: '',
        cell: (info) => (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedRider(info.row.original);
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
          <p className="text-xs text-gray-400">Total Riders</p>
          <p className="text-2xl font-bold text-white">{riders.length}</p>
        </div>
        <div className="rounded-lg bg-dark-800 border border-dark-700 p-4">
          <p className="text-xs text-gray-400">Online</p>
          <p className="text-2xl font-bold text-green-400">{riders.filter((r) => r.status === 'online').length}</p>
        </div>
        <div className="rounded-lg bg-dark-800 border border-dark-700 p-4">
          <p className="text-xs text-gray-400">On Delivery</p>
          <p className="text-2xl font-bold text-cyan-400">{riders.filter((r) => r.status === 'on_delivery').length}</p>
        </div>
        <div className="rounded-lg bg-dark-800 border border-dark-700 p-4">
          <p className="text-xs text-gray-400">Pending Verification</p>
          <p className="text-2xl font-bold text-yellow-400">{riders.filter((r) => r.verificationStatus === 'pending').length}</p>
        </div>
      </div>

      <DataTable data={riders} columns={columns} searchPlaceholder="Search riders..." />

      {/* Rider Detail Modal */}
      <Modal
        open={!!selectedRider}
        onClose={() => setSelectedRider(null)}
        title={selectedRider?.name || 'Rider Details'}
        size="lg"
      >
        {selectedRider && (
          <div className="space-y-6">
            {/* Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Phone</p>
                <p className="text-white">{selectedRider.phone}</p>
              </div>
              <div>
                <p className="text-gray-400">Vehicle</p>
                <p className="text-white">{vehicleLabels[selectedRider.vehicleType]} - {selectedRider.vehicleNumber}</p>
              </div>
              <div>
                <p className="text-gray-400">License</p>
                <p className="text-white">{selectedRider.licenseNumber}</p>
              </div>
              <div>
                <p className="text-gray-400">Commission Rate</p>
                <p className="text-white">{selectedRider.commissionRate}%</p>
              </div>
              <div>
                <p className="text-gray-400">Joined</p>
                <p className="text-white">{selectedRider.joinedDate}</p>
              </div>
              <div>
                <p className="text-gray-400">Status</p>
                <Badge variant={statusConfig[selectedRider.status].variant as 'green'}>
                  {statusConfig[selectedRider.status].label}
                </Badge>
              </div>
            </div>

            {/* Performance stats */}
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-3">Performance</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg bg-dark-900 p-3 text-center">
                  <p className="text-2xl font-bold text-white">{selectedRider.totalDeliveries}</p>
                  <p className="text-xs text-gray-400">Total Deliveries</p>
                </div>
                <div className="rounded-lg bg-dark-900 p-3 text-center">
                  <p className="text-2xl font-bold text-yellow-400">{selectedRider.rating > 0 ? selectedRider.rating.toFixed(1) : 'N/A'}</p>
                  <p className="text-xs text-gray-400">Rating</p>
                </div>
                <div className="rounded-lg bg-dark-900 p-3 text-center">
                  <p className="text-2xl font-bold text-green-400">98%</p>
                  <p className="text-xs text-gray-400">Completion Rate</p>
                </div>
              </div>
            </div>

            {/* Verification section */}
            {selectedRider.verificationStatus === 'pending' && (
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-3">Verification Documents</h4>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {['NIC Front', 'NIC Back', 'License'].map((doc) => (
                    <div key={doc} className="rounded-lg bg-dark-900 border border-dark-600 p-4 text-center">
                      <svg className="mx-auto h-10 w-10 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-xs text-gray-400">{doc}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleVerification(selectedRider.id, 'approved')}
                    className="flex-1 rounded-lg bg-green-500/10 text-green-400 py-2 text-sm font-semibold hover:bg-green-500/20"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleVerification(selectedRider.id, 'rejected')}
                    className="flex-1 rounded-lg bg-red-500/10 text-red-400 py-2 text-sm font-semibold hover:bg-red-500/20"
                  >
                    Reject
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedRider(null)}
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
