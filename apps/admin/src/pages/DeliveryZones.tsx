import { useState, useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface ZoneRow {
  id: string;
  name: string;
  baseFee: number;
  perKmFee: number;
  minOrder: number;
  freeDeliveryThreshold?: number;
  isActive: boolean;
  ridersCount: number;
  ordersToday: number;
}

const demoZones: ZoneRow[] = [
  { id: '1', name: 'Colombo 01-05', baseFee: 200, perKmFee: 30, minOrder: 1500, freeDeliveryThreshold: 5000, isActive: true, ridersCount: 8, ordersToday: 42 },
  { id: '2', name: 'Colombo 06-10', baseFee: 250, perKmFee: 35, minOrder: 1500, freeDeliveryThreshold: 6000, isActive: true, ridersCount: 6, ordersToday: 31 },
  { id: '3', name: 'Colombo 11-15', baseFee: 300, perKmFee: 40, minOrder: 2000, freeDeliveryThreshold: 7000, isActive: true, ridersCount: 4, ordersToday: 18 },
  { id: '4', name: 'Dehiwala-Mount Lavinia', baseFee: 300, perKmFee: 40, minOrder: 2000, freeDeliveryThreshold: 7000, isActive: true, ridersCount: 3, ordersToday: 15 },
  { id: '5', name: 'Nugegoda-Maharagama', baseFee: 350, perKmFee: 45, minOrder: 2500, isActive: true, ridersCount: 2, ordersToday: 8 },
  { id: '6', name: 'Rajagiriya-Battaramulla', baseFee: 300, perKmFee: 40, minOrder: 2000, freeDeliveryThreshold: 8000, isActive: true, ridersCount: 3, ordersToday: 12 },
  { id: '7', name: 'Moratuwa-Panadura', baseFee: 400, perKmFee: 50, minOrder: 3000, isActive: false, ridersCount: 0, ordersToday: 0 },
];

const columnHelper = createColumnHelper<ZoneRow>();

interface ZoneForm {
  name: string;
  baseFee: number;
  perKmFee: number;
  minOrder: number;
  freeDeliveryThreshold: number;
}

export default function DeliveryZones() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ZoneRow | null>(null);
  const [zones, setZones] = useState(demoZones);
  const { register, handleSubmit, reset } = useForm<ZoneForm>();

  const toggleActive = (id: string) => {
    setZones((prev) =>
      prev.map((z) => (z.id === id ? { ...z, isActive: !z.isActive } : z))
    );
    toast.success('Zone status updated');
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Zone Name',
        cell: (info) => <span className="font-medium text-white">{info.getValue()}</span>,
      }),
      columnHelper.accessor('baseFee', {
        header: 'Base Fee',
        cell: (info) => `Rs. ${info.getValue()}`,
      }),
      columnHelper.accessor('perKmFee', {
        header: 'Per Km',
        cell: (info) => `Rs. ${info.getValue()}`,
      }),
      columnHelper.accessor('minOrder', {
        header: 'Min Order',
        cell: (info) => `Rs. ${info.getValue().toLocaleString()}`,
      }),
      columnHelper.accessor('freeDeliveryThreshold', {
        header: 'Free Delivery At',
        cell: (info) => {
          const val = info.getValue();
          return val ? `Rs. ${val.toLocaleString()}` : <span className="text-gray-500">N/A</span>;
        },
      }),
      columnHelper.accessor('ridersCount', {
        header: 'Riders',
      }),
      columnHelper.accessor('ordersToday', {
        header: 'Orders Today',
      }),
      columnHelper.accessor('isActive', {
        header: 'Status',
        cell: (info) =>
          info.getValue() ? (
            <Badge variant="green">Active</Badge>
          ) : (
            <Badge variant="gray">Inactive</Badge>
          ),
      }),
      columnHelper.display({
        id: 'actions',
        header: '',
        cell: (info) => (
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditing(info.row.original);
                setModalOpen(true);
              }}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-dark-700 hover:text-white"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleActive(info.row.original.id);
              }}
              className={`rounded-lg px-2 py-1 text-xs ${
                info.row.original.isActive
                  ? 'text-red-400 hover:bg-red-500/10'
                  : 'text-green-400 hover:bg-green-500/10'
              }`}
            >
              {info.row.original.isActive ? 'Disable' : 'Enable'}
            </button>
          </div>
        ),
      }),
    ],
    []
  );

  const onSubmit = (data: ZoneForm) => {
    if (editing) {
      setZones((prev) =>
        prev.map((z) =>
          z.id === editing.id
            ? { ...z, name: data.name, baseFee: data.baseFee, perKmFee: data.perKmFee, minOrder: data.minOrder, freeDeliveryThreshold: data.freeDeliveryThreshold || undefined }
            : z
        )
      );
      toast.success('Zone updated');
    } else {
      const newZone: ZoneRow = {
        id: String(Date.now()),
        name: data.name,
        baseFee: data.baseFee,
        perKmFee: data.perKmFee,
        minOrder: data.minOrder,
        freeDeliveryThreshold: data.freeDeliveryThreshold || undefined,
        isActive: true,
        ridersCount: 0,
        ordersToday: 0,
      };
      setZones((prev) => [...prev, newZone]);
      toast.success('Zone created');
    }
    setModalOpen(false);
    setEditing(null);
    reset();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{zones.length} delivery zones</p>
        <button
          onClick={() => {
            setEditing(null);
            reset();
            setModalOpen(true);
          }}
          className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
        >
          + Add Zone
        </button>
      </div>

      {/* Map placeholder */}
      <div className="rounded-xl bg-dark-800 border border-dark-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Zone Map</h3>
        <div className="flex items-center justify-center h-64 rounded-lg bg-dark-900 border border-dark-600">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <p className="text-gray-400 text-sm">Google Maps integration</p>
            <p className="text-gray-500 text-xs mt-1">Draw polygons to define delivery zones</p>
          </div>
        </div>
      </div>

      <DataTable data={zones} columns={columns} searchPlaceholder="Search zones..." />

      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        title={editing ? 'Edit Delivery Zone' : 'Add Delivery Zone'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Zone Name</label>
            <input
              {...register('name', { required: true })}
              defaultValue={editing?.name}
              className="w-full rounded-lg border border-dark-600 bg-dark-900 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Base Delivery Fee (LKR)</label>
              <input
                type="number"
                {...register('baseFee', { required: true, valueAsNumber: true })}
                defaultValue={editing?.baseFee}
                className="w-full rounded-lg border border-dark-600 bg-dark-900 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Per Km Fee (LKR)</label>
              <input
                type="number"
                {...register('perKmFee', { required: true, valueAsNumber: true })}
                defaultValue={editing?.perKmFee}
                className="w-full rounded-lg border border-dark-600 bg-dark-900 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Minimum Order (LKR)</label>
              <input
                type="number"
                {...register('minOrder', { required: true, valueAsNumber: true })}
                defaultValue={editing?.minOrder}
                className="w-full rounded-lg border border-dark-600 bg-dark-900 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Free Delivery Threshold (LKR)</label>
              <input
                type="number"
                {...register('freeDeliveryThreshold', { valueAsNumber: true })}
                defaultValue={editing?.freeDeliveryThreshold}
                placeholder="Optional"
                className="w-full rounded-lg border border-dark-600 bg-dark-900 px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => { setModalOpen(false); setEditing(null); }}
              className="rounded-lg border border-dark-600 px-4 py-2 text-sm text-gray-300 hover:bg-dark-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
            >
              {editing ? 'Save Changes' : 'Add Zone'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
