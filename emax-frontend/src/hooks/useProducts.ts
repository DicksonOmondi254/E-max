import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "../services/productService";
import { useAppDispatch } from "../redux/hooks";
import { setCachedProducts, setCachedProductDetail } from "../redux/productSlice";

/* ==========================================
   QUERY KEY FACTORIES
========================================== */

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: string) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
  featured: () => [...productKeys.all, "featured"] as const,
  deals: () => [...productKeys.all, "deals"] as const,
  byCategory: (categoryId: number) => [...productKeys.all, "category", categoryId] as const,
  search: (keyword: string) => [...productKeys.all, "search", keyword] as const,
};

/* ==========================================
   HOOKS
========================================== */

/**
 * Fetch all products with optional query string
 * Caches in Redux for instant availability on refresh
 */
export function useProducts(query = "") {
  const dispatch = useAppDispatch();

  return useQuery({
    queryKey: productKeys.list(query),
    queryFn: async () => {
      const data = await productService.getProducts(query);
      // Sync to Redux for instant access
      dispatch(setCachedProducts(data));
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 min
  });
}

/**
 * Fetch a single product by ID
 */
export function useProduct(id: number) {
  const dispatch = useAppDispatch();

  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: async () => {
      const data = await productService.getProduct(id);
      dispatch(setCachedProductDetail(data));
      return data;
    },
    enabled: !!id && id > 0,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch featured products
 */
export function useFeaturedProducts() {
  return useQuery({
    queryKey: productKeys.featured(),
    queryFn: () => productService.getFeaturedProducts(),
    staleTime: 10 * 60 * 1000, // 10 min - featured changes rarely
  });
}

/**
 * Fetch deals (discounted products)
 */
export function useDeals() {
  return useQuery({
    queryKey: productKeys.deals(),
    queryFn: () => productService.getDeals(),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch products by category
 */
export function useProductsByCategory(categoryId: number) {
  return useQuery({
    queryKey: productKeys.byCategory(categoryId),
    queryFn: () => productService.getProductsByCategory(categoryId),
    enabled: !!categoryId && categoryId > 0,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Search products
 */
export function useSearchProducts(keyword: string) {
  return useQuery({
    queryKey: productKeys.search(keyword),
    queryFn: () => productService.searchProducts(keyword),
    enabled: keyword.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 min - search results change more frequently
  });
}

/**
 * Create product mutation
 */
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => productService.createProduct(data),
    onSuccess: () => {
      // Invalidate all product queries to refetch
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

/**
 * Update product mutation
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      productService.updateProduct(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

/**
 * Delete product mutation
 */
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}
