export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie("access-token");

  if (token.value) {
    return navigateTo("/cms");
  }
});
