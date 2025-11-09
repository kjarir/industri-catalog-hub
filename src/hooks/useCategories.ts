import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export interface Category {
  id: string;
  name: string;
  parent_id: string | null;
  created_at: string;
}

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      // Try to select all columns - this will work even if parent_id doesn't exist yet
      // We'll handle the parent_id in the mapping below
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .order('name');
      
      if (error) {
        // Provide helpful error message
        const errorMessage = error.message || '';
        if (errorMessage.includes('parent_id') || errorMessage.includes('column') || error.code === '42703') {
          const helpfulError = new Error(
            '⚠️ Database Migration Required!\n\n' +
            'The parent_id column does not exist in your database.\n\n' +
            'To fix this:\n' +
            '1. Open Supabase SQL Editor: https://supabase.com/dashboard/project/qtaarndtwyxdsqlkepir/sql/new\n' +
            '2. Run the migration script from: migration-add-parent-id-to-categories.sql\n' +
            '3. Refresh this page\n\n' +
            'See RUN-MIGRATION-FIRST.md for detailed instructions.'
          );
          helpfulError.cause = error;
          throw helpfulError;
        }
        throw error;
      }
      
      // Map the data to ensure parent_id is always present (null if column doesn't exist)
      return (data || []).map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        parent_id: cat.parent_id ?? null, // Will be null if column doesn't exist
        created_at: cat.created_at,
      })) as Category[];
    },
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (category: Omit<Category, 'id' | 'created_at'>) => {
      // Prepare the insert data - only include parent_id if it's not null
      const insertData: any = {
        name: category.name,
      };
      
      // Only include parent_id if it exists (not null)
      // This allows the query to work even if parent_id column doesn't exist yet
      if (category.parent_id !== null && category.parent_id !== undefined) {
        insertData.parent_id = category.parent_id;
      }
      
      const { data, error } = await supabase
        .from('product_categories')
        .insert([insertData])
        .select()
        .single();
      
      if (error) {
        // Check if error is about missing parent_id column
        if (error.message.includes('parent_id') || error.message.includes('column') || error.code === '42703') {
          const helpfulError = new Error(
            'Cannot create subcategory: The parent_id column does not exist in the database. ' +
            'Please run the migration script: migration-add-parent-id-to-categories.sql ' +
            'in your Supabase SQL Editor.'
          );
          helpfulError.cause = error;
          throw helpfulError;
        }
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: 'Success',
        description: 'Category created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error Creating Category',
        description: error.message || 'An error occurred while creating the category',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...category }: Partial<Category> & { id: string }) => {
      const { data, error } = await supabase
        .from('product_categories')
        .update(category)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: 'Success',
        description: 'Category updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      // Get category name first
      const { data: category, error: categoryError } = await supabase
        .from('product_categories')
        .select('name')
        .eq('id', id)
        .single();
      
      if (categoryError) throw categoryError;
      if (!category) throw new Error('Category not found');

      // Check if category has subcategories (only if parent_id column exists)
      try {
        const { data: subcategories, error: subcatError } = await supabase
          .from('product_categories')
          .select('id')
          .eq('parent_id', id);
        
        // If error is about missing column, skip this check (migration not run yet)
        if (!subcatError && subcategories && subcategories.length > 0) {
          throw new Error('Cannot delete category with subcategories. Please delete subcategories first.');
        }
      } catch (error: any) {
        // If it's a column error, ignore it (migration not run)
        if (error.message && !error.message.includes('Cannot delete category')) {
          // Column doesn't exist, skip subcategory check
        } else {
          throw error;
        }
      }

      // Check if category has products
      const { data: products } = await supabase
        .from('products')
        .select('id')
        .eq('category', category.name)
        .limit(1);
      
      if (products && products.length > 0) {
        throw new Error('Cannot delete category with products. Please delete or move products first.');
      }

      const { error } = await supabase
        .from('product_categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: 'Success',
        description: 'Category deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'An error occurred while deleting the category',
        variant: 'destructive',
      });
    },
  });
};
