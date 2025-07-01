import { useState, useEffect } from "react";
import { User, FarmerUser, CompanyUser, BuyerUser } from "@/types/user";
import { toast } from "sonner";
import {
  updateUserProfile,
  updateBuyerProfile,
  updateCompanyProfile,
  updateFarmerProfile,
} from "@/helpers/api";
import { useAuth } from "@/contexts/auth-context";

export function useProfile() {
  const { user: authUser, profile: authProfile, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User>(
    authUser
      ? {
          ...authUser,
          ...(authUser.user_type === "company" && authProfile?.company
            ? {
                company_name: authProfile.company.company_name,
                company_description: authProfile.company.company_description,
                company_logo: authProfile.company.company_logo,
              }
            : authUser.user_type !== "company" &&
              authProfile?.[authUser.user_type] && {
                bio: authProfile[authUser.user_type]?.bio || "",
                profile_image:
                  authProfile[authUser.user_type]?.profile_image || "",
              }),
        }
      : ({
          email: "",
          first_name: "",
          last_name: "",
          user_type: "farmer",
        } as User)
  );

  // Update editedUser when auth data changes
  useEffect(() => {
    if (authUser && authProfile) {
      setEditedUser({
        ...authUser,
        ...(authUser.user_type === "company" && authProfile.company
          ? {
              company_name: authProfile.company.company_name,
              company_description: authProfile.company.company_description,
              company_logo: authProfile.company.company_logo,
            }
          : authUser.user_type !== "company" &&
            authProfile[authUser.user_type] && {
              bio: authProfile[authUser.user_type]?.bio || "",
              profile_image:
                authProfile[authUser.user_type]?.profile_image || "",
            }),
      } as User);
    }
  }, [authUser, authProfile]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditing) return;

    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }

      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSave = async () => {
    if (!editedUser || !authUser) return;

    try {
      setIsLoading(true);
      // Update base user profile
      const baseFormData = new FormData();
      baseFormData.append("email", editedUser.email);
      baseFormData.append("first_name", editedUser.first_name);
      baseFormData.append("last_name", editedUser.last_name);

      const baseProfileResponse = await updateUserProfile(baseFormData);
      if (!baseProfileResponse) {
        throw new Error("Failed to update base profile");
      }

      // Update specific profile
      const specificFormData = new FormData();
      let specificProfileResponse;

      switch (authUser.user_type) {
        case "farmer":
          const farmerUser = editedUser as FarmerUser;
          if (farmerUser.bio) specificFormData.append("bio", farmerUser.bio);
          if (imagePreview) {
            const imageInput = document.getElementById(
              "profile-image-upload"
            ) as HTMLInputElement;
            const file = imageInput?.files?.[0];
            if (file) {
              specificFormData.append("profile_image", file);
            }
          }
          specificProfileResponse = await updateFarmerProfile(specificFormData);
          break;

        case "company":
          const companyUser = editedUser as CompanyUser;
          specificFormData.append("company_name", companyUser.company_name);
          specificFormData.append(
            "company_description",
            companyUser.company_description
          );
          if (imagePreview) {
            const imageInput = document.getElementById(
              "profile-image-upload"
            ) as HTMLInputElement;
            const file = imageInput?.files?.[0];
            if (file) {
              specificFormData.append("company_logo", file);
            }
          }
          specificProfileResponse = await updateCompanyProfile(
            specificFormData
          );
          break;

        case "buyer":
          const buyerUser = editedUser as BuyerUser;
          if (buyerUser.bio) specificFormData.append("bio", buyerUser.bio);
          if (imagePreview) {
            const imageInput = document.getElementById(
              "profile-image-upload"
            ) as HTMLInputElement;
            const file = imageInput?.files?.[0];
            if (file) {
              specificFormData.append("profile_image", file);
            }
          }
          specificProfileResponse = await updateBuyerProfile(specificFormData);
          break;
      }

      if (!specificProfileResponse) {
        throw new Error("Failed to update specific profile");
      }

      // Clear image preview
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
      }

      setIsEditing(false);
      toast.success("Profile updated successfully");

      // Refresh auth context data
      await refreshUser();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user: authUser,
    editedUser,
    isLoading,
    isEditing,
    imagePreview,
    setIsEditing,
    handleInputChange,
    handleImageUpload,
    handleSave,
  };
}
