import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import type { components } from "~/types/pesona-hub-api";
import { useApi, useAuthToken } from "./useApi";
import { mapErrorMessage } from "~/utils/error-mapper";

// Type definitions from OpenAPI
type UserResponse = components["schemas"]["UserUpdate"];
type TokenResponse = components["schemas"]["TokenResponse"];
type RegisterRequest = components["schemas"]["RegisterRequest"];

interface LoginCredentials {
  username: string;
  password: string;
}

export const useAuth = () => {
  const { setAuthToken, clearAuthToken } = useAuthToken();

  const client = useApi();
  const queryClient = useQueryClient();

  // Cookie untuk simpan token
  const accessToken = useCookie("access-token", {
    maxAge: 60 * 60 * 24, // 1 day
    sameSite: "lax",
    // secure: import.meta.env.PROD,
  });

  const refreshToken = useCookie("refresh-token", {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: "lax",
    // secure: import.meta.env.PROD,
  });

  // State untuk user
  const user = useState<UserResponse | null>("auth-user", () => null);

  // Logout function - defined early so it can be used in useQuery
  const logout = async () => {
    try {
      // Call logout endpoint
      await client.POST("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear tokens dan state
      accessToken.value = null;
      refreshToken.value = null;
      user.value = null;
      clearAuthToken();
      queryClient.clear();
      navigateTo("/login");
    }
  };

  const {
    data: currentUser,
    isLoading: isLoadingUser,
    error: userError,
  } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      if (!accessToken.value) return null;

      // Fetch user data from API
      const { data, error } = await client.GET("/me");

      if (error) {
        // Check if error is 401 (unauthorized)
        const status = (error as any)?.status || (error as any)?.statusCode;
        const messageCode =
          (error as any)?.code || (error as any)?.message_code;

        if (messageCode === "USER_NOT_AUTHENTICATED") {
          // Logout user if unauthorized
          await logout();
          // Return null to prevent query from retrying
          return null;
        }
        throw error;
      }

      // API returns BaseResponse format, extract data field
      if (data && typeof data === "object" && "data" in data) {
        return (data as any).data;
      }

      return data;
    },
    enabled: computed(() => !!accessToken.value),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      // FastAPI OAuth2 form data format - send as URL encoded form data
      const formData = new URLSearchParams();
      formData.append("username", credentials.username);
      formData.append("password", credentials.password);
      formData.append("grant_type", "password");
      formData.append("scope", "");

      const { data, error } = await client.POST("/auth/login", {
        body: formData,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (error) {
        throw new Error("Invalid username or password");
      }

      return data as TokenResponse;
    },
    onSuccess: async (data) => {
      if (data?.access_token) {
        accessToken.value = data.access_token;
        refreshToken.value = data.refresh_token;
        setAuthToken(data.access_token);

        // Fetch user data after successful login
        try {
          const { data: userData, error: userError } = await client.GET("/me");
          if (!userError && userData) {
            // API returns BaseResponse format, extract data field
            if (
              userData &&
              typeof userData === "object" &&
              "data" in userData
            ) {
              user.value = (userData as any).data;
            } else {
              user.value = userData as any;
            }
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }

        // Invalidate user query untuk refetch
        queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      }
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (userData: RegisterRequest) => {
      const { data, error } = await client.POST("/auth/register", {
        body: userData,
      });

      if (error) {
        const mappedError = mapErrorMessage(error);
        throw new Error(mappedError);
      }

      return data;
    },
    onSuccess: () => {
      // Setelah register, user perlu login manual
      // Atau bisa auto-login dengan data yang sama
    },
  });

  // Refresh token mutation
  const refreshTokenMutation = useMutation({
    mutationFn: async () => {
      if (!refreshToken.value) {
        throw new Error("No refresh token available");
      }

      const { data, error } = await client.POST("/auth/refresh", {
        body: {
          refresh_token: refreshToken.value,
        },
      });

      if (error) {
        throw new Error("Failed to refresh token");
      }

      return data as TokenResponse;
    },
    onSuccess: (data) => {
      if (data?.access_token) {
        accessToken.value = data.access_token;
        refreshToken.value = data.refresh_token;
        setAuthToken(data.access_token);
      }
    },
    onError: () => {
      // Token refresh failed, logout user
      logout();
    },
  });

  // Auto refresh token sebelum expired
  if (import.meta.client && accessToken.value) {
    // Refresh token 5 menit sebelum expired (default expires_in biasanya 3600 detik)
    const refreshInterval = 55 * 60 * 1000; // 55 minutes

    const intervalId = setInterval(() => {
      if (accessToken.value) {
        refreshTokenMutation.mutate();
      }
    }, refreshInterval);

    // Cleanup interval saat component unmount
    onBeforeUnmount(() => {
      clearInterval(intervalId);
    });
  }

  // Initialize auth token on composable creation
  if (import.meta.client && accessToken.value) {
    setAuthToken(accessToken.value);
  }

  return {
    // State
    user: computed(() => currentUser.value || user.value),
    accessToken: readonly(accessToken),
    refreshToken: readonly(refreshToken),
    isAuthenticated: computed(() => !!accessToken.value),
    isLoadingUser,
    userError,

    // Role checks
    isAdmin: computed(() => {
      const currentUserValue = currentUser.value || user.value;
      return currentUserValue?.role === "ADMINISTRATOR";
    }),

    // Auth actions
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout,
    refreshAuthToken: refreshTokenMutation.mutateAsync,

    // Mutation states
    isLoggingIn: computed(() => loginMutation.isPending),
    isRegistering: computed(() => registerMutation.isPending),
    isRefreshing: computed(() => refreshTokenMutation.isPending),

    // Errors
    loginError: computed(() => loginMutation.error),
    registerError: computed(() => registerMutation.error),
  };
};
