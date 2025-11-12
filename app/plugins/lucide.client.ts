import { defineNuxtPlugin } from "#app";
import * as lucide from "lucide-vue-next";
import type { Component } from "vue";

export default defineNuxtPlugin((nuxtApp) => {
  for (const [name, component] of Object.entries(lucide)) {
    // pastikan bukan fungsi utilitas seperti createLucideIcon
    if (typeof component === "function" && name !== "createLucideIcon") {
      nuxtApp.vueApp.component(name, component as unknown as Component);
    }
  }
});
