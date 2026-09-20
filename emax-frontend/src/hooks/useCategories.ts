import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../services/categoryService";

/* ==========================================
   QUERY KEY FACTORIES
========================================== */

export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  list: (filters?: string) => [...categoryKeys.lists(), filters] as const,
  detail: (id: number) => [...categoryKeys.all, "detail", id] as const,
};

/* ==========================================
   HOOKS
========================================== */

/**
 * Fetch all categories
 */
export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: () => categoryService.getAllCategories(),
    staleTime: 30 * 60 * 1000, // 30 min - categories change rarely
    gcTime: 60 * 60 * 1000, // 1 hour garbage collection
  });
}

/**
 * Fetch a single category by ID
 */
export function useCategory(id: number) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoryService.getCategoryById(id),
    enabled: !!id && id > 0,
    staleTime: 30 * 60 * 1000,
  });
}
