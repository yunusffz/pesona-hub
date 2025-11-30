<template>
  <div>
    <DashboardSection />
    <ProfileCompleteDialog
      v-model:open="showProfileDialog"
      description="Untuk mengakses dashboard, Anda perlu melengkapi profil organisasi dan informasi kebutuhan Anda terlebih dahulu."
      @cancel="handleDialogClose"
      @update:open="handleDialogUpdate"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { useAuth } from "~/composables/useAuth";
  import { useApi } from "~/composables/useApi";
  import { canUserCollaborate } from "~/utils/user-profile";
  import DashboardSection from "@/components/features/dashboard/DashboardSection.vue";
  import ProfileCompleteDialog from "~/components/common/ProfileCompleteDialog.vue";

  definePageMeta({
    middleware: ["auth"] as any,
    requiresAuth: true,
  });

  const client = useApi();
  const showProfileDialog = ref(false);

  const handleDialogClose = () => {
    navigateTo("/profil");
  };

  const handleDialogUpdate = (value: boolean) => {
    if (!value) {
      navigateTo("/profil");
    }
  };

  onMounted(async () => {
    try {
      const { data, error } = await client.GET("/me", {
        params: {
          query: {
            "populate[0]": "details",
          },
        },
      });

      if (error) {
        console.error("Failed to fetch user data:", error);
        return;
      }

      let userData;
      if (data && typeof data === "object" && "data" in data) {
        userData = (data as any).data;
      } else {
        userData = data;
      }

      if (!canUserCollaborate(userData)) {
        showProfileDialog.value = true;
      }
    } catch (error) {
      console.error("Error checking user profile:", error);
    }
  });
</script>
