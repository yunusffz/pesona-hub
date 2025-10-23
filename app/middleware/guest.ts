export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie("access-token");

  // Jika sudah login, redirect ke dashboard
  if (token.value) {
    return navigateTo("/");
  }
});
