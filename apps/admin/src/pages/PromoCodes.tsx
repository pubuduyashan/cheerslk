import { useState, useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface PromoRow {
  id: string;
  code: string;
  type: 'percentage' | 'fixed' | 'free_delivery';
  discountValue: number;
  maxDiscount?: number;
  minOrderAmount: number;
  validFrom: string;
  validUntil: string;
  maxUses: number;
  currentUses: number;
  isActive: boolean;
}

const demoPromos: PromoRow[] = [
  { id: '1', code: 'WELCOME20', type: 'percentage', discountValue: 20, maxDiscount: 1000, minOrderAmount: 2000, validFrom: '2024-01-01', validUntil: '2024-03-31', maxUses: 500, currentUses: 142, isActive: true },
  { id: '2', code: 'FREEDELIVERY', type: 'free_delivery', discountValue: 0, minOrderAmount: 3000, validFrom: '2024-01-01', validUntil: '2024-02-28', maxUses: 200, currentUses: 89, isActive: true },
  { id: '3', code: 'FLAT500', type: 'fixed', discountValue: 500, minOrderAmount: 5000, validFrom: '2024-01-10', validUntil: '2024-01-31', maxUses: 100, currentUses: 67, isActive: true },
  { id: '4', code: 'NEWYEAR25', type: 'percentage', discountValue: 25, maxDiscount: 1500, minOrderAmount: 3000, validFrom: '2023-12-25', validUntil: '2024-01-07', maxUses: 300, currentUses: 300, isActive: false },
  { id: '5', code: 'WEEKEND10', type: 'percentage', discountValue: 10, maxDiscount: 500, minOrderAmount: 1500, validFrom: '2024-01-12', validUntil: '2024-01-14', maxUses: 50, currentUses: 28, isActive: false },
  { id: '6', code: 'VIP1000', type: 'fixed', discountValue: 1000, minOrderAmount: 10000, validFrom: '2024-01-01', validUntil: '2024-12-31', maxUses: 50, currentUses: 12, isActive: true },
];

const typeLabels: Record<string, { label: string; variant: string }> = {
  percentage: { label: 'Percentage', variant: 'blue' },
  fixed: { label: 'Fixed', variant: 'purple' },
  free_delivery: { label: 'Free Delivery', variant: 'green' },
};

const columnHelper = createColumnHelper<PromoRow>();

interface PromoForm {
  code: string;
  type: 'percentage' | 'fixed' | 'free_delivery';
  discountValue: number;
  maxDiscount: number;
  minOrderAmount: number;
  validFrom: string;
  validUntil: string;
  maxUses: number;
}

export default function PromoCodes() {
  const [modalOpen, setModalOpen] = useState(false);
  const [promos, setPromos] = useState(demoPromos);
  const { register, handleSubmit, reset, watch } = useForm<PromoForm>();
  const promoType = watch('type');

  const toggleActive = (id: string) => {
    setPromos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
    toast.success('Promo code status updated');
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor('code', {
        header: 'Code',
        cell: (info) => (
          <code className="rounded bg-dark-700 px-2 py-1 text-sm font-mono font-bold text-brand-500">
            {info.getValue()}
          </code>
        ),
      }),
      columnHelper.accessor('type', {
        header: 'Type',
        cell: (info) => {
          const cfg = typeLabels[info.getValue()];
          return <Badge variant={cfg.variant as 'green'}>{cfg.label}</Badge>;
        },
      }),
      columnHelper.accessor('discountValue', {
        header: 'Discount',
        cell: (info) => {
          const row = info.row.original;
          if (row.type === 'percentage') return `${info.getValue()}%`;
          if (row.type === 'fixed') return `Rs. ${info.getValue()}`;
          return 'Free Delivery';
        },
      }),
      columnHelper.accessor('minOrderAmount', {
        header: 'Min Order',
        cell: (info) => `Rs. ${info.getValue().toLocaleString()}`,
      }),
      columnHelper.accessor('validFrom', {
        header: 'Valid From',
        cell: (info) => <span className="text-xs text-gray-400">{info.getValue()}</span>,
      }),
      columnHelper.accessor('validUntil', {
        header: 'Valid Until',
        cell: (info) => <span className="text-xs text-gray-400">{info.getValue()}</span>,
      }),
      columnHelper.display({
        id: 'usage',
        header: 'Usage',
        cell: (info) => {
          const row = info.row.original;
          const pct = (row.currentUses / row.maxUses) * 100;
          return (
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">{row.currentUses}/{row.maxUses}</span>
              </div>
              <div className="h-1.5 w-20 rounded-full bg-dark-700">
                <div
                  className="h-full rounded-full bg-brand-500"
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
            </div>
          );
        },
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
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleActive(info.row.original.id);
            }}
            className={`rounded-lg px-3 py-1 text-xs font-medium ${
              info.row.original.isActive
                ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
            }`}
          >
            {info.row.original.isActive ? 'Deactivate' : 'Activate'}
          </button>
        ),
      }),
    ],
    []
  );

  const onSubmit = (data: PromoForm) => {
    const newPromo: PromoRow = {
      id: String(Date.now()),
      code: data.code.toUpperCase(),
      type: data.type,
      discountValue: data.discountValue,
      maxDiscount: data.maxDiscount || undefined,
      minOrderAmount: data.minOrderAmount,
      validFrom: data.validFrom,
      validUntil: data.validUntil,
      maxUses: data.maxUses,
      currentUses: 0,
      isActive: true,
    };
    setPromos((prev) => [newPromo, ...prev]);
    setModalOpen(false);
    reset();
    toast.success('Promo code created');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{promos.length} promo codes</p>
        <button
          onClick={() => {
            reset();
            setModalOpen(true);
          }}
          className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
        >
          + Create Promo Code
        </button>
      </div>

      <DataTable data={promos} columns={columns} searchPlaceholder="Search promo codes..." />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Promo Code"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Code</label>
            <input
              {...register('code', { required: true })}
              placeholder="e.g., SUMMER25"
              className="w-full rounded-lg border border-dark-600 bg-dark-900 px-3 py-2 text-sm text-white uppercase focus:border-brand-500 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Type</label>
              <select
                {...register('type', { required: true })}
                className="w-full rounded-lg border border-dark-600 bg-dark-900 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
                <option value="free_delivery">Free Delivery</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                {promoType === 'percentage' ? 'Discount (%)' : 'Discount (LKR)'}
              </label>
              <input
                type="number"
                {...register('discountValue', { required: promoType !== 'free_delivery', valueAsNumber: true })}
                disabled={promoType === 'free_delivery'}
                className="w-full rounded-lg border border-dark-600 bg-dark-900 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none disabled:opacity-50"
              />
            </div>
          </div>
          {promoType === 'percentage' && (
            <div>
              <label className="block text-sm text-gray-300 mb-1">Max Discount (LKR)</label>
              <input
                type="number"
                {...register('maxDiscount', { valueAsNumber: true })}
                className="w-full rounded-lg border border-dark-600 bg-dark-900 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Min Order Amount (LKR)</label>
              <input
                type="number"
                {...register('minOrderAmount', { required: true, valueAsNumber: true })}
                className="w-full rounded-lg border border-dark-600 bg-dark-900 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Max Uses</label>
              <input
                type="number"
                {...register('maxUses', { required: true, valueAsNumber: true })}
                className="w-full rounded-lg border border-dark-600 bg-dark-900 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Valid From</label>
              <input
                type="date"
                {...register('validFrom', { required: true })}
                className="w-full rounded-lg border border-dark-600 bg-dark-900 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Valid Until</label>
              <input
                type="date"
                {...register('validUntil', { required: true })}
                className="w-full rounded-lg border border-dark-600 bg-dark-900 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-lg border border-dark-600 px-4 py-2 text-sm text-gray-300 hover:bg-dark-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
            >
              Create Code
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
