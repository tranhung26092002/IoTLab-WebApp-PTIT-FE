import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/api/productService';
import { Product } from '../types/product';

export function useProducts() {
    const queryClient = useQueryClient();

    const { data: products, isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const response = await productService.getProducts();
            return response.data;
        },
    });

    const createProduct = useMutation({
        mutationFn: productService.createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });

    const updateProduct = useMutation({
        mutationFn: (params: { id: string; data: Partial<Product> }) => 
            productService.updateProduct(params.id, params.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });


    const deleteProduct = useMutation({
        mutationFn: productService.deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });

    return {
        products,
        isLoading,
        createProduct: createProduct.mutate,
        updateProduct: updateProduct.mutate,
        deleteProduct: deleteProduct.mutate,
    };
}