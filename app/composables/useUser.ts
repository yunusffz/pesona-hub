import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { computed } from "vue";
import type { components } from "~/types/pesona-hub-api";
import { useApi } from "./useApi";
import { mapErrorMessage } from "~/utils/error-mapper";

type UserUpdate = components["schemas"]["UserUpdate"];
type UserDetail = components["schemas"]["UserDetail"];

export interface UpdateUserProfileData {
  name?: string;
  phone?: string;
  thumbnail?: string;
  details?: UserDetail;
}

export const useUser = () => {
  const client = useApi();
  const queryClient = useQueryClient();

  // Upload file mutation
  const uploadFileMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("description", "User profile thumbnail");

      const { data, error } = await client.POST("/files", {
        body: formData,
      });

      if (error) {
        const mappedError = mapErrorMessage(error);
        throw new Error(mappedError);
      }

      // Extract file URL from response
      // Response format: BaseResponse_Union_dict_str__Any___NoneType__
      if (data && typeof data === "object" && "data" in data) {
        const fileData = (data.data as any);
        // API returns object_name or id, we need to get the URL
        // Typically it's something like: /files/{object_name} or /files/{id}
        if (fileData?.object_name) {
          return fileData.object_name;
        }
        if (fileData?.id) {
          return String(fileData.id);
        }
        // Try to find object_name or id in nested structure
        if (typeof fileData === "object") {
          const objName = fileData.object_name || fileData.id;
          if (objName) {
            return String(objName);
          }
        }
      }

      throw new Error("Failed to get file URL from response");
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({
      username,
      userData,
    }: {
      username: string;
      userData: UserUpdate;
    }) => {
      const { data, error } = await client.PATCH(
        "/users/users/{username}",
        {
          params: {
            path: {
              username,
            },
          },
          body: userData,
        }
      );

      if (error) {
        const mappedError = mapErrorMessage(error);
        throw new Error(mappedError);
      }

      return data;
    },
    onSuccess: () => {
      // Invalidate user queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  // Update profile function that handles file upload first, then user update
  const updateProfile = async (
    username: string,
    profileData: UpdateUserProfileData & { logoFile?: File | null }
  ) => {
    let thumbnailUrl = profileData.thumbnail;

    // Upload logo file if provided
    if (profileData.logoFile) {
      thumbnailUrl = await uploadFileMutation.mutateAsync(profileData.logoFile);
    }

    // Prepare user update payload
    const userUpdate: UserUpdate = {
      name: profileData.name,
      phone: profileData.phone,
      thumbnail: thumbnailUrl || undefined,
      details: profileData.details,
    };

    // Remove undefined fields
    Object.keys(userUpdate).forEach((key) => {
      if (userUpdate[key as keyof UserUpdate] === undefined) {
        delete userUpdate[key as keyof UserUpdate];
      }
    });

    return updateUserMutation.mutateAsync({ username, userData: userUpdate });
  };

  return {
    updateProfile,
    uploadFile: uploadFileMutation.mutateAsync,
    isUpdating: computed(() => updateUserMutation.isPending || uploadFileMutation.isPending),
    isUploading: computed(() => uploadFileMutation.isPending),
    updateError: computed(() => updateUserMutation.error),
    uploadError: computed(() => uploadFileMutation.error),
  };
};
