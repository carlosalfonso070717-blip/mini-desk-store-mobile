import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PRODUCTS_GC_TIME_MS, PRODUCTS_STALE_TIME_MS } from '../constants/config';
import { fetchProductById } from '../services/api';
import { Product } from '../types/product';

export function useProduct(id: number) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id),
    staleTime: PRODUCTS_STALE_TIME_MS,
    gcTime: PRODUCTS_GC_TIME_MS,
    retry: 2,
    initialData: () => {
      const cachedList = queryClient.getQueryData<Product[]>(['products']);
      return cachedList?.find((product) => product.id === id);
    },
    initialDataUpdatedAt: () =>
      queryClient.getQueryState(['products'])?.dataUpdatedAt,
  });
}