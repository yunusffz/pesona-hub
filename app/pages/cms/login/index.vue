<template>
  <LoginForm />
</template>
<script setup lang="ts">
import LoginForm from "~/components/features/cms/login/LoginForm.vue";
definePageMeta({
  layout: "auth",
  middleware: "guest",
});
</script>
