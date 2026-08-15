import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT_MS } from '../constants/config';
import { Product } from '../types/product';

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
});

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response
        ? `La API respondió con un error (${status}).`
        : error.code === 'ECONNABORTED'
          ? 'La solicitud tardó demasiado. Intenta nuevamente.'
          : 'No se pudo conectar con el servidor. Revisa tu conexión.';
      return Promise.reject(new ApiError(message, status));
    }
    return Promise.reject(new ApiError('Ocurrió un error inesperado.'));
  },
);

export async function fetchProducts(): Promise<Product[]> {
  const { data } = await httpClient.get<Product[]>('/products');
  return data;
}

export async function fetchProductById(id: number): Promise<Product> {
  const { data } = await httpClient.get<Product>(`/products/${id}`);
  return data;
}