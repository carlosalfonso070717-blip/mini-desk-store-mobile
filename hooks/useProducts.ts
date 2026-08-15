import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../services/api';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });
}