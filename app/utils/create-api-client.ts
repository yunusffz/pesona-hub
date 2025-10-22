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

  const client = createClient<paths>({
    baseUrl,
    headers: { "Content-Type": "application/json" },
  });

  client.use(authMiddleware);

  return {
    client,
    setAuthToken: (token: string) => (authToken = token),
    clearAuthToken: () => (authToken = null),
    getAuthToken: () => authToken,
  };
};
