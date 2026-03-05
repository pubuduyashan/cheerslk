import { useState, useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface ProductRow {
  id: string;
  name: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  stock: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  image: string;
  brand?: string;
  abv?: number;
  volumeMl?: number;
}

const demoProducts: ProductRow[] = [
  { id: '1', name: 'Arrack Special Reserve', category: 'Spirits', price: 2800, compareAtPrice: 3200, sku: 'SPR-001', stock: 45, status: 'active', image: '', brand: 'Rockland', abv: 33.5, volumeMl: 750 },
  { id: '2', name: 'Lion Lager 625ml', category: 'Beer', price: 650, sku: 'BER-001', stock: 120, status: 'active', image: '', brand: 'Lion', abv: 4.8, volumeMl: 625 },
  { id: '3', name: 'Carlsberg Can 330ml', category: 'Beer', price: 550, sku: 'BER-002', stock: 85, status: 'active', image: '', brand: 'Carlsberg', abv: 5.0, volumeMl: 330 },
  { id: '4', name: 'Old Reserve Whisky', category: 'Spirits', price: 4500, sku: 'SPR-002', stock: 22, status: 'active', image: '', brand: 'Rockland', abv: 40, volumeMl: 750 },
  { id: '5', name: 'Mendis Coconut Arrack', category: 'Spirits', price: 1850, sku: 'SPR-003', stock: 0, status: 'out_of_stock', image: '', brand: 'Mendis', abv: 33.5, volumeMl: 750 },
  { id: '6', name: 'Red Wine Cabernet', category: 'Wine', price: 3800, sku: 'WIN-001', stock: 15, status: 'active', image: '', brand: 'Australian', abv: 13.5, volumeMl: 750 },
  { id: '7', name: 'Coca Cola 1.5L', category: 'Mixers & Soft Drinks', price: 350, sku: 'MIX-001', stock: 200, status: 'active', image: '' },
  { id: '8', name: 'Tonic Water 500ml', category: 'Mixers & Soft Drinks', price: 280, sku: 'MIX-002', stock: 150, status: 'active', image: '' },
  { id: '9', name: 'Goldleaf Cigarettes', category: 'Cigarettes', price: 1200, sku: 'CIG-001', stock: 60, status: 'active', image: '', brand: 'Goldleaf' },
  { id: '10', name: 'Ice Bag 2kg', category: 'Ice & Essentials', price: 200, sku: 'ESS-001', stock: 300, status: 'active', image: '' },
  { id: '11', name: 'Heineken 330ml', category: 'Beer', price: 750, sku: 'BER-003', stock: 0, status: 'out_of_stock', image: '', brand: 'Heineken', abv: 5.0, volumeMl: 330 },
  { id: '12', name: 'Smirnoff Vodka 750ml', category: 'Spirits', price: 5200, sku: 'SPR-004', stock: 8, status: 'active', image: '', brand: 'Smirnoff', abv: 40, volumeMl: 750 },
];

const columnHelper = createColumnHelper<ProductRow>();

const statusConfig: Record<string, { label: string; variant: string }> = {
  active: { label: 'Active', variant: 'green' },
  inactive: { label: 'Inactive', variant: 'gray' },
  out_of_stock: { label: 'Out of Stock', variant: 'red' },
};

const categories = ['All', 'Spirits', 'Beer', 'Wine', 'Cigarettes', 'Mixers & Soft Drinks', 'Snacks & Food', 'Ice & Essentials'];

interface ProductForm {
  name: string;
  category: string;
  price: number;
  sku: string;
  stock: number;
  brand: string;
  abv: number;
  volumeMl: number;
  description: string;
}

export default function Products() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductRow | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [editingStock, setEditingStock] = useState<{ id: string; value: number } | null>(null);
  const [products, setProducts] = useState(demoProducts);

  const { register, handleSubmit, reset } = useForm<ProductForm>();

  const filteredProducts = useMemo(() => {
    if (categoryFilter === 'All') return products;
    return products.filter((p) => p.category === categoryFilter);
  }, [products, categoryFilter]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('image', {
        header: '',
        cell: () => (
          <div className="h-10 w-10 rounded-lg bg-dark-700 flex items-center justify-center text-gray-500">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        ),
        enableSorting: false,
      }),
      columnHelper.accessor('name', {
        header: 'Product Name',
        cell: (info) => <span className="font-medium text-white">{info.getValue()}</span>,
      }),
      columnHelper.accessor('category', {
        header: 'Category',
      }),
      columnHelper.accessor('price', {
        header: 'Price',
        cell: (info) => `Rs. ${info.getValue().toLocaleString()}`,
      }),
      columnHelper.accessor('stock', {
        header: 'Stock',
        cell: (info) => {
          const product = info.row.original;
          if (editingStock?.id === product.id) {
            return (
              <input
                type="number"
                value={editingStock.value}
                onChange={(e) => setEditingStock({ id: product.id, value: parseInt(e.target.value) || 0 })}
                onBlur={() => {
                  setProducts((prev) =>
                    prev.map((p) =>
                      p.id === product.id
                        ? { ...p, stock: editingStock.value, status: editingStock.value === 0 ? 'out_of_stock' : 'active' }
                        : p
                    )
                  );
                  setEditingStock(null);
                  toast.success('Stock updated');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                }}
                autoFocus
                className="w-20 rounded border border-brand-500 bg-dark-900 px-2 py-1 text-sm text-white focus:outline-none"
              />
            );
          }
          const val = info.getValue();
          return (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditingStock({ id: product.id, value: val });
              }}
              className={`font-medium ${val === 0 ? 'text-red-400' : val < 10 ? 'text-yellow-400' : 'text-gray-300'}`}
            >
              {val}
            </button>
          );
        },
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => {
          const cfg = statusConfig[info.getValue()];
          return <Badge variant={cfg.variant as 'green'}>{cfg.label}</Badge>;
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: '',
        cell: (info) => (
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditingProduct(info.row.original);
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
                setProducts((prev) => prev.filter((p) => p.id !== info.row.original.id));
                toast.success('Product deleted');
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
    [editingStock]
  );

  const onSubmit = (data: ProductForm) => {
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? { ...p, name: data.name, category: data.category, price: data.price, sku: data.sku, stock: data.stock, brand: data.brand }
            : p
        )
      );
      toast.success('Product updated');
    } else {
      const newProduct: ProductRow = {
        id: String(Date.now()),
        name: data.name,
        category: data.category,
        price: data.price,
        sku: data.sku,
        stock: data.stock,
        status: data.stock > 0 ? 'active' : 'out_of_stock',
        image: '',
        brand: data.brand,
        abv: data.abv,
        volumeMl: data.volumeMl,
      };
      setProducts((prev) => [newProduct, ...prev]);
      toast.success('Product added');
    }
    setModalOpen(false);
    setEditingProduct(null);
    reset();
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                categoryFilter === cat
                  ? 'bg-brand-500 text-white'
                  : 'bg-dark-800 text-gray-400 hover:text-white border border-dark-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            reset();
            setModalOpen(true);
          }}
          className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
        >
          + Add Product
        </button>
      </div>

      <DataTable data={filteredProducts} columns={columns} searchPlaceholder="Search products..." />

      {/* Add/Edit Product Modal */}
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingProduct(null);
        }}
        title={editingProduct ? 'Edit Product' : 'Add Product'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Product Name</label>
              <input
                {...register('name', { required: true })}
                defaultValue={editingProduct?.name}
                className="w-full rounded-lg border border-dark-600 bg-dark-900 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Category</label>
              <select
                {...register('category', { required: true })}
                defaultValue={editingProduct?.category}
                className="w-full rounded-lg border border-dark-600 bg-dark-900 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
              >
                {categories.filter((c) => c !== 'All').map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Price (LKR)</label>
              <input
                type="number"
                {...register('price', { required: true, valueAsNumber: true })}
                defaultValue={editingProduct?.price}
                className="w-full rounded-lg border border-dark-600 bg-dark-900 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">SKU</label>
              <input
                {...register('sku', { required: true })}
                defaultValue={editingProduct?.sku}
                className="w-full rounded-lg border border-dark-600 bg-dark-900 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Stock</label>
              <input
                type="number"
                {...register('stock', { required: true, valueAsNumber: true })}
                defaultValue={editingProduct?.stock}
                className="w-full rounded-lg border border-dark-600 bg-dark-900 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Brand</label>
              <input
                {...register('brand')}
                defaultValue={editingProduct?.brand}
                className="w-full rounded-lg border border-dark-600 bg-dark-900 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">ABV (%)</label>
              <input
                type="number"
                step="0.1"
                {...register('abv', { valueAsNumber: true })}
                defaultValue={editingProduct?.abv}
                className="w-full rounded-lg border border-dark-600 bg-dark-900 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Volume (ml)</label>
              <input
                type="number"
                {...register('volumeMl', { valueAsNumber: true })}
                defaultValue={editingProduct?.volumeMl}
                className="w-full rounded-lg border border-dark-600 bg-dark-900 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Description</label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full rounded-lg border border-dark-600 bg-dark-900 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => { setModalOpen(false); setEditingProduct(null); }}
              className="rounded-lg border border-dark-600 px-4 py-2 text-sm text-gray-300 hover:bg-dark-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
            >
              {editingProduct ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
