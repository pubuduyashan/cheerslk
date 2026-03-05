import { useState, useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface CategoryRow {
  id: string;
  nameEn: string;
  nameSi: string;
  nameTa: string;
  slug: string;
  sortOrder: number;
  requiresAge: boolean;
  isActive: boolean;
  productCount: number;
}

const demoCategories: CategoryRow[] = [
  { id: '1', nameEn: 'Spirits', nameSi: 'ස්පිරිට්', nameTa: 'ஸ்பிரிட்ஸ்', slug: 'spirits', sortOrder: 1, requiresAge: true, isActive: true, productCount: 28 },
  { id: '2', nameEn: 'Beer', nameSi: 'බියර්', nameTa: 'பீர்', slug: 'beer', sortOrder: 2, requiresAge: true, isActive: true, productCount: 42 },
  { id: '3', nameEn: 'Wine', nameSi: 'වයින්', nameTa: 'ஒயின்', slug: 'wine', sortOrder: 3, requiresAge: true, isActive: true, productCount: 15 },
  { id: '4', nameEn: 'Cigarettes', nameSi: 'සිගරට්', nameTa: 'சிகரெட்', slug: 'cigarettes', sortOrder: 4, requiresAge: true, isActive: true, productCount: 12 },
  { id: '5', nameEn: 'Mixers & Soft Drinks', nameSi: 'මික්සර් සහ බීම', nameTa: 'மிக்சர் & குளிர்பானங்கள்', slug: 'mixers', sortOrder: 5, requiresAge: false, isActive: true, productCount: 35 },
  { id: '6', nameEn: 'Snacks & Food', nameSi: 'කෑම සහ ස්නැක්ස්', nameTa: 'சிற்றுண்டி & உணவு', slug: 'snacks', sortOrder: 6, requiresAge: false, isActive: true, productCount: 20 },
  { id: '7', nameEn: 'Ice & Essentials', nameSi: 'අයිස් සහ අත්‍යවශ්‍ය', nameTa: 'ஐஸ் & அத்தியாவசியம்', slug: 'essentials', sortOrder: 7, requiresAge: false, isActive: true, productCount: 8 },
];

const columnHelper = createColumnHelper<CategoryRow>();

interface CategoryForm {
  nameEn: string;
  nameSi: string;
  nameTa: string;
  slug: string;
  sortOrder: number;
  requiresAge: boolean;
}

export default function Categories() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryRow | null>(null);
  const [categoriesList, setCategories] = useState(demoCategories);

  const { register, handleSubmit, reset } = useForm<CategoryForm>();

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'image',
        header: '',
        cell: () => (
          <div className="h-10 w-10 rounded-lg bg-dark-700 flex items-center justify-center text-gray-500">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        ),
      }),
      columnHelper.accessor('nameEn', {
        header: 'Name (EN)',
        cell: (info) => <span className="font-medium text-white">{info.getValue()}</span>,
      }),
      columnHelper.accessor('nameSi', {
        header: 'Name (SI)',
      }),
      columnHelper.accessor('nameTa', {
        header: 'Name (TA)',
      }),
      columnHelper.accessor('slug', {
        header: 'Slug',
        cell: (info) => <code className="text-xs bg-dark-700 px-2 py-0.5 rounded">{info.getValue()}</code>,
      }),
      columnHelper.accessor('sortOrder', {
        header: 'Sort',
      }),
      columnHelper.accessor('requiresAge', {
        header: 'Age Verify',
        cell: (info) =>
          info.getValue() ? (
            <Badge variant="red">21+</Badge>
          ) : (
            <Badge variant="green">No</Badge>
          ),
      }),
      columnHelper.accessor('productCount', {
        header: 'Products',
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
                setCategories((prev) => prev.filter((c) => c.id !== info.row.original.id));
                toast.success('Category deleted');
              }}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-red-500/10 hover:text-red-400"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ),
      }),
    ],
    []
  );

  const onSubmit = (data: CategoryForm) => {
    if (editing) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editing.id
            ? { ...c, nameEn: data.nameEn, nameSi: data.nameSi, nameTa: data.nameTa, slug: data.slug, sortOrder: data.sortOrder, requiresAge: data.requiresAge }
            : c
        )
      );
      toast.success('Category updated');
    } else {
      const newCat: CategoryRow = {
        id: String(Date.now()),
        nameEn: data.nameEn,
        nameSi: data.nameSi,
        nameTa: data.nameTa,
        slug: data.slug,
        sortOrder: data.sortOrder,
        requiresAge: data.requiresAge,
        isActive: true,
        productCount: 0,
      };
      setCategories((prev) => [...prev, newCat]);
      toast.success('Category added');
    }
    setModalOpen(false);
    setEditing(null);
    reset();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{categoriesList.length} categories</p>
        <button
          onClick={() => {
            setEditing(null);
            reset();
            setModalOpen(true);
          }}
          className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
        >
          + Add Category
        </button>
      </div>

      <DataTable data={categoriesList} columns={columns} searchPlaceholder="Search categories..." />

      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        title={editing ? 'Edit Category' : 'Add Category'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Name (English)</label>
            <input
              {...register('nameEn', { required: true })}
              defaultValue={editing?.nameEn}
              className="w-full rounded-lg border border-dark-600 bg-dark-900 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Name (Sinhala)</label>
              <input
                {...register('nameSi')}
                defaultValue={editing?.nameSi}
                className="w-full rounded-lg border border-dark-600 bg-dark-900 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Name (Tamil)</label>
              <input
                {...register('nameTa')}
                defaultValue={editing?.nameTa}
                className="w-full rounded-lg border border-dark-600 bg-dark-900 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Slug</label>
              <input
                {...register('slug', { required: true })}
                defaultValue={editing?.slug}
                className="w-full rounded-lg border border-dark-600 bg-dark-900 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Sort Order</label>
              <input
                type="number"
                {...register('sortOrder', { required: true, valueAsNumber: true })}
                defaultValue={editing?.sortOrder}
                className="w-full rounded-lg border border-dark-600 bg-dark-900 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Image upload placeholder */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Category Image</label>
            <div className="flex items-center justify-center h-32 rounded-lg border-2 border-dashed border-dark-600 bg-dark-900 hover:border-dark-500 transition-colors cursor-pointer">
              <div className="text-center">
                <svg className="mx-auto h-8 w-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-1 text-xs text-gray-500">Click to upload image</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register('requiresAge')}
              defaultChecked={editing?.requiresAge}
              id="requiresAge"
              className="rounded border-dark-600 bg-dark-900 text-brand-500 focus:ring-brand-500"
            />
            <label htmlFor="requiresAge" className="text-sm text-gray-300">Requires age verification (21+)</label>
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
              {editing ? 'Save Changes' : 'Add Category'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
