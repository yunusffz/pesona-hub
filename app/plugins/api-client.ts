import { createApiClient } from "~/utils/create-api-client";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const baseUrl = config.public.BASE_API_URL as string;

  const { client, setAuthToken, clearAuthToken, getAuthToken } =
    createApiClient(baseUrl);

  // Initialize token from cookie on both server and client
  const accessToken = useCookie("access-token");
  if (accessToken.value) {
    setAuthToken(accessToken.value);
  }

  return {
    provide: {
      apiClient: client,
      setAuthToken,
      clearAuthToken,
      getAuthToken,
    },
  };
});
