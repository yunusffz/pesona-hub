export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie("access-token"); // Ubah dari "auth-token" ke "access-token"

  // Check if route requires authentication
  const isProtected = to.meta.requiresAuth === true;

  console.log(token.value);

  if (isProtected && !token.value) {
    console.log("tessss");
    return navigateTo({
      path: "/login",
      query: { redirect: to.fullPath },
    });
  }
});
