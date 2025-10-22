export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie("auth-token");

  // Check if route requires authentication
  const isProtected = to.meta.requiresAuth !== false;

  if (isProtected && !token.value) {
    return navigateTo({
      path: "/login",
      query: { redirect: to.fullPath }, // Save redirect path
    });
  }
});
