import { useQuery } from "@tanstack/react-query";
import { brandService } from "../services/brandService";

/* ==========================================
   QUERY KEY FACTORIES
========================================== */

export const brandKeys = {
  all: ["brands"] as const,
  lists: () => [...brandKeys.all, "list"] as const,
  list: (filters?: string) => [...brandKeys.lists(), filters] as const,
  detail: (id: number) => [...brandKeys.all, "detail", id] as const,
};

/* ==========================================
   HOOKS
========================================== */

/**
 * Fetch all brands
 */
export function useBrands() {
  return useQuery({
    queryKey: brandKeys.list(),
    queryFn: () => brandService.getAllBrands(),
    staleTime: 30 * 60 * 1000, // 30 min - brands change rarely
    gcTime: 60 * 60 * 1000, // 1 hour garbage collection
  });
}

/**
 * Fetch a single brand by ID
 */
export function useBrand(id: number) {
  return useQuery({
    queryKey: brandKeys.detail(id),
    queryFn: () => brandService.getBrandById(id),
    enabled: !!id && id > 0,
    staleTime: 30 * 60 * 1000,
  });
}
