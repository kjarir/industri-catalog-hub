import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });
};
