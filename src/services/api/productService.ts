import { Product } from '../../types/product';
import api from '../axios';

export const productService = {
    getProducts: () => api.get<Product[]>('/products'),
    getProduct: (id: string) => api.get<Product>(`/products/${id}`),
    createProduct: (data: Partial<Product>) => api.post<Product>('/products', data),
    updateProduct: (id: string, data: Partial<Product>) => api.put<Product>(`/products/${id}`, data),
    deleteProduct: (id: string) => api.delete(`/products/${id}`),
};