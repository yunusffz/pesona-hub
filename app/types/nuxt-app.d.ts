import type { FetchClient } from "openapi-fetch";
import type { paths } from "~/types/pesona-hub-api";

declare module "#app" {
  interface NuxtApp {
    $apiClient: FetchClient<paths>;
    $setAuthToken: (token: string) => void;
    $clearAuthToken: () => void;
    $getAuthToken: () => string | null;
  }
}

export {};
