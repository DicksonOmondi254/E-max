import { useQuery } from "@tanstack/react-query";

import { storeSettingsService } from "../services/storeSettingsService";
import type { StoreSettings } from "../services/storeSettingsService";

export function useStoreSettings() {
  const { data, isLoading, error } = useQuery<StoreSettings>({
    queryKey: ["storeSettings"],
    queryFn: () => storeSettingsService.getSettings(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

  return {
    storeSettings: data ?? null,
    isLoading,
    error,
    logo: data?.logo ?? null,
    storeName: data?.storeName ?? "E-Max",
  };
}

