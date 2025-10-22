<script setup lang="ts">
  import type { components } from "~/types/pesona-hub-api";
  import { useAuth } from "~/composables/useAuth";

  definePageMeta({
    middleware: ["guest"] as any,
  });

  const router = useRouter();
  const { register, isRegistering, registerError } = useAuth();

  type Roles = components["schemas"]["Roles"];

  const form = reactive({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    role: "PARTNER" as Roles,
  });

  const errorMessage = ref("");
  const successMessage = ref("");

  const passwordMismatch = computed(() => {
    return (
      form.password !== form.confirmPassword && form.confirmPassword.length > 0
    );
  });

  const handleRegister = async () => {
    try {
      errorMessage.value = "";
      successMessage.value = "";

      if (passwordMismatch.value) {
        errorMessage.value = "Passwords do not match";
        return;
      }

      await register({
        username: form.username,
        email: form.email,
        password: form.password,
        name: form.name || null,
        role: form.role,
      });

      successMessage.value = "Account created successfully! Please login.";

      // Redirect ke login setelah 2 detik
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      errorMessage.value =
        error.message || "Registration failed. Please try again.";
    }
  };
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900">Create your account</h2>
        <p class="mt-2 text-sm text-gray-600">
          Already have an account?
          <NuxtLink
            to="/login"
            class="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign in
          </NuxtLink>
        </p>
      </div>

      <div class="bg-white py-8 px-6 shadow rounded-lg">
        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- Success Message -->
          <div
            v-if="successMessage"
            class="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded relative"
          >
            {{ successMessage }}
          </div>

          <!-- Error Message -->
          <div
            v-if="errorMessage || registerError"
            class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative"
            role="alert"
          >
            {{ errorMessage || registerError?.value?.message }}
          </div>

          <!-- Name -->
          <div>
            <label
              for="name"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Full Name
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>

          <!-- Username -->
          <div>
            <label
              for="username"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Username
            </label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              required
              autocomplete="username"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Choose a username"
            />
          </div>

          <!-- Email -->
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              autocomplete="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          <!-- Password -->
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              autocomplete="new-password"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Create a password"
            />
          </div>

          <!-- Confirm Password -->
          <div>
            <label
              for="confirmPassword"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              required
              autocomplete="new-password"
              :class="[
                'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                passwordMismatch ? 'border-red-500' : 'border-gray-300',
              ]"
              placeholder="Confirm your password"
            />
            <p v-if="passwordMismatch" class="mt-1 text-sm text-red-600">
              Passwords do not match
            </p>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isRegistering?.value || passwordMismatch?.valueOf()"
            class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="isRegistering.value" class="flex items-center">
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Creating account...
            </span>
            <span v-else>Create account</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
