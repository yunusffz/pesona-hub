export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie("access-token"); // Ubah dari "auth-token" ke "access-token"

  // Check if route requires authentication
  const isProtected = to.meta.requiresAuth !== false;

  if (isProtected && !token.value) {
    return navigateTo({
      path: "/login",
      query: { redirect: to.fullPath },
    });
  }
});
