import { ref } from "vue";

const showToast = ref(false);
const toastMessage = ref("");
let timer: ReturnType<typeof setTimeout>;

export function useCmsToast() {
  const show = (message: string) => {
    toastMessage.value = message;
    showToast.value = true;
    clearTimeout(timer);
    timer = setTimeout(() => (showToast.value = false), 3000);
  };

  return { showToast, toastMessage, show };
}
