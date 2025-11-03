import createClient from "openapi-fetch";
import type { paths } from "~/types/pesona-hub-api";
import type { Middleware } from "openapi-fetch";

export const createApiClient = (baseUrl: string) => {
  let authToken: string | null = null;

  const authMiddleware: Middleware = {
    onRequest({ request }) {
      if (authToken) {
        request.headers.set("Authorization", `Bearer ${authToken}`);
      }
      return request;
    },
  };

  const contentTypeMiddleware: Middleware = {
    onRequest({ request }) {
      // Don't set Content-Type for FormData - let the browser set it with boundary
      if (!(request.body instanceof FormData)) {
        // Only set Content-Type for non-FormData requests
        if (!request.headers.has("Content-Type")) {
          request.headers.set("Content-Type", "application/json");
        }
      } else {
        // Remove Content-Type header if it was set, so browser can set multipart/form-data with boundary
        request.headers.delete("Content-Type");
      }
      return request;
    },
  };

  const client = createClient<paths>({
    baseUrl,
  });

  client.use(contentTypeMiddleware);
  client.use(authMiddleware);

  return {
    client,
    setAuthToken: (token: string) => (authToken = token),
    clearAuthToken: () => (authToken = null),
    getAuthToken: () => authToken,
  };
};
