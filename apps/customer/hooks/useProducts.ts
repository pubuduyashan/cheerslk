import { useState, useEffect, useCallback } from 'react';
import { supabase } from './useSupabase';
import type { Product, Category } from '@cheerslk/shared-types';

export function useProducts(categorySlug?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (categorySlug) {
        query = query.eq('category.slug', categorySlug);
      }

      const { data, error } = await query;
      if (error) throw error;
      setProducts((data as Product[]) || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  }, [categorySlug]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, refetch: fetchProducts };
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, category:categories(*)')
          .eq('id', id)
          .single();

        if (error) throw error;
        setProduct(data as Product);
      } catch (err) {
        console.error('Failed to fetch product:', err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetch();
  }, [id]);

  return { product, loading };
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (error) throw error;
        setCategories((data as Category[]) || []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  return { categories, loading };
}

export function useSearchProducts() {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('is_active', true)
        .or(`name_en.ilike.%${query}%,brand.ilike.%${query}%,description_en.ilike.%${query}%`)
        .limit(20);

      if (error) throw error;
      setResults((data as Product[]) || []);
    } catch (err) {
      console.error('Failed to search products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, search };
}
