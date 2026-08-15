import { useQuery } from '@tanstack/react-query';
import { PRODUCTS_GC_TIME_MS, PRODUCTS_STALE_TIME_MS } from '../constants/config';
import { fetchProducts } from '../services/api';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: PRODUCTS_STALE_TIME_MS,
    gcTime: PRODUCTS_GC_TIME_MS,
    retry: 2,
  });
}