import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "../services/orderService";
import { useAppDispatch } from "../redux/hooks";
import { setCachedOrders, updateCachedOrderStatus } from "../redux/orderSlice";

/* ==========================================
   QUERY KEY FACTORIES
========================================== */

export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  myOrders: () => [...orderKeys.lists(), "my"] as const,
  allOrders: () => [...orderKeys.lists(), "all"] as const,
  detail: (id: number) => [...orderKeys.all, "detail", id] as const,
};

/* ==========================================
   HOOKS
========================================== */

/**
 * Fetch current user's orders
 * Caches in Redux for instant availability on refresh
 */
export function useMyOrders() {
  const dispatch = useAppDispatch();

  return useQuery({
    queryKey: orderKeys.myOrders(),
    queryFn: async () => {
      const response = await orderService.getMyOrders();
      dispatch(setCachedOrders(response.data || []));
      return response;
    },
    staleTime: 2 * 60 * 1000, // 2 min
  });
}

/**
 * Fetch all orders (admin only)
 */
export function useAllOrders() {
  const dispatch = useAppDispatch();

  return useQuery({
    queryKey: orderKeys.allOrders(),
    queryFn: async () => {
      const response = await orderService.getAllOrders();
      dispatch(setCachedOrders(response.data || []));
      return response;
    },
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Fetch a single order
 */
export function useOrder(id: number) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => orderService.getOrder(id),
    enabled: !!id && id > 0,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Update order status mutation
 */
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      orderService.updateOrderStatus(id, status),
    onSuccess: (_, variables) => {
      // Update Redux cache
      dispatch(updateCachedOrderStatus({ orderId: variables.id, status: variables.status }));
      // Invalidate server queries
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.id) });
    },
  });
}

/**
 * Cancel order mutation
 */
export function useCancelOrder() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (id: number) => orderService.cancelOrder(id),
    onSuccess: (_, id) => {
      dispatch(updateCachedOrderStatus({ orderId: id, status: "CANCELLED" }));
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) });
    },
  });
}

/**
 * Delete order mutation
 */
export function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => orderService.deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}
