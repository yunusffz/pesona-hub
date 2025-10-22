import { createApiClient } from "~/utils/create-api-client";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const baseUrl = config.public.BASE_API_URL as string;

  // Buat API client dengan runtime config
  const { client, setAuthToken, clearAuthToken, getAuthToken } =
    createApiClient(baseUrl);

  return {
    provide: {
      apiClient: client,
      setAuthToken,
      clearAuthToken,
      getAuthToken,
    },
  };
});
