export default defineNuxtRouteMiddleware(async () => {
  const token = useCookie("access-token");

  if (!token.value) {
    return navigateTo("/cms/login");
  }

  // Use cached user state if already populated
  const user = useState<{ role?: string } | null>("auth-user", () => null);

  if (user.value) {
    if (user.value.role !== "ADMINISTRATOR") {
      return navigateTo("/");
    }
    return;
  }

  // Fetch user data to verify role
  const config = useRuntimeConfig();
  const baseUrl = config.public.pesonaApiUrl;

  try {
    const data = await $fetch<{ data?: { role?: string } }>(`${baseUrl}/me`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });

    const role = data?.data?.role;

    if (role !== "ADMINISTRATOR") {
      return navigateTo("/");
    }

    user.value = data?.data ?? null;
  } catch {
    return navigateTo("/cms/login");
  }
});
