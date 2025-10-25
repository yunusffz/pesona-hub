<template>
  <RegisterForm />
</template>

<script setup lang="ts">
  definePageMeta({
    middleware: ["guest"] as any,
    layout: "auth",
  });
  import RegisterForm from "~/components/features/register/RegisterForm.vue";
</script>
