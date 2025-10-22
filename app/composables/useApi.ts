export const useApi = () => {
  const { $apiClient } = useNuxtApp();
  return $apiClient;
};

export const useAuthToken = () => {
  const { $setAuthToken, $clearAuthToken, $getAuthToken } = useNuxtApp();
  return {
    setAuthToken: $setAuthToken,
    clearAuthToken: $clearAuthToken,
    getAuthToken: $getAuthToken,
  };
};
