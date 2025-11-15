import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string | null;
  images?: string[] | null; // Array of image URLs for gallery
  specifications: { key: string; value: string }[] | null;
}

export const useProducts = (category?: string) => {
  return useQuery({
    queryKey: ['products', category],
    queryFn: async () => {
      let query = supabase.from('products').select('*').order('created_at', { ascending: false });
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Parse images array from JSONB for each product
      const products = (data || []).map((product: any) => {
        if (product.images && typeof product.images === 'string') {
          try {
            product.images = JSON.parse(product.images);
          } catch (e) {
            console.warn('Failed to parse images JSON for product:', product.id, e);
            product.images = null;
          }
        }
        return product;
      });
      
      return products as Product[];
    },
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      // Parse images array from JSONB if it exists
      const product = data as any;
      if (product.images && typeof product.images === 'string') {
        try {
          product.images = JSON.parse(product.images);
        } catch (e) {
          console.warn('Failed to parse images JSON:', e);
          product.images = null;
        }
      }
      
      return product as Product;
    },
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (product: Omit<Product, 'id'>) => {
      // Clean the product data - remove undefined values and handle images
      const cleanProduct: any = {
        name: product.name,
        category: product.category,
        description: product.description,
        image: product.image || null,
        specifications: product.specifications || null,
      };

      // Only include images if it exists and is not empty
      if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        cleanProduct.images = product.images;
      }

      let { data, error } = await supabase
        .from('products')
        .insert([cleanProduct])
        .select()
        .single();
      
      // If error is about missing column, try without images field
      if (error && (error.message.includes('column') && error.message.includes('images') || error.code === '42703')) {
        console.warn('Images column not found, retrying without images field. Please run migration-add-images-column.sql');
        const { images, ...productWithoutImages } = cleanProduct;
        const retry = await supabase
          .from('products')
          .insert([productWithoutImages])
          .select()
          .single();
        
        if (retry.error) {
          console.error('Supabase insert error:', retry.error);
          throw retry.error;
        }
        return retry.data;
      }
      
      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Success',
        description: 'Product created successfully',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.message || 'Unknown error occurred';
      // Check if it's a missing column error
      if (errorMessage.includes('column') && errorMessage.includes('images')) {
        toast({
          title: 'Database Migration Required',
          description: 'Please run migration-add-images-column.sql in Supabase SQL Editor to enable multiple images feature.',
          variant: 'destructive',
          duration: 10000,
        });
      } else {
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...product }: Partial<Product> & { id: string }) => {
      // Clean the product data - remove undefined values and handle images
      const cleanProduct: any = {};
      
      if (product.name !== undefined) cleanProduct.name = product.name;
      if (product.category !== undefined) cleanProduct.category = product.category;
      if (product.description !== undefined) cleanProduct.description = product.description;
      if (product.image !== undefined) cleanProduct.image = product.image;
      if (product.specifications !== undefined) cleanProduct.specifications = product.specifications;
      
      // Only include images if it exists and is not empty
      if (product.images !== undefined) {
        if (Array.isArray(product.images) && product.images.length > 0) {
          cleanProduct.images = product.images;
        } else {
          cleanProduct.images = null; // Explicitly set to null if empty
        }
      }

      let { data, error } = await supabase
        .from('products')
        .update(cleanProduct)
        .eq('id', id)
        .select()
        .single();
      
      // If error is about missing column, try without images field
      if (error && (error.message.includes('column') && error.message.includes('images') || error.code === '42703')) {
        console.warn('Images column not found, retrying without images field. Please run migration-add-images-column.sql');
        const { images, ...productWithoutImages } = cleanProduct;
        const retry = await supabase
          .from('products')
          .update(productWithoutImages)
          .eq('id', id)
          .select()
          .single();
        
        if (retry.error) {
          console.error('Supabase update error:', retry.error);
          throw retry.error;
        }
        return retry.data;
      }
      
      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Success',
        description: 'Product updated successfully',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.message || 'Unknown error occurred';
      // Check if it's a missing column error
      if (errorMessage.includes('column') && errorMessage.includes('images')) {
        toast({
          title: 'Database Migration Required',
          description: 'Please run migration-add-images-column.sql in Supabase SQL Editor to enable multiple images feature.',
          variant: 'destructive',
          duration: 10000,
        });
      } else {
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.message || 'Unknown error occurred';
      // Check if it's a missing column error
      if (errorMessage.includes('column') && errorMessage.includes('images')) {
        toast({
          title: 'Database Migration Required',
          description: 'Please run migration-add-images-column.sql in Supabase SQL Editor to enable multiple images feature.',
          variant: 'destructive',
          duration: 10000,
        });
      } else {
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    },
  });
};
