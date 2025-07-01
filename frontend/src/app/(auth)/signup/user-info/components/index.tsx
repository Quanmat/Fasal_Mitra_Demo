"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ProfileForm } from "./profile-form";
import { ProfilePictureUpload } from "./profile-picture-upload";
import { UserTypeRadio } from "./user-type-radio";
import {
  updateBuyerProfile,
  updateFarmerProfile,
  updateCompanyProfile,
  updateUserInfo,
} from "@/helpers/api";

interface UserTypeSelectionProps {
  userType: string;
  email: string;
  setUserType: (type: string) => void;
  onNext: () => void;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  userType?: string;
  profilePicture?: string;
  companyName?: string;
  companyDescription?: string;
  submit?: string;
}

export default function UserTypeSelection({
  userType,
  email,
  setUserType,
  onNext,
}: UserTypeSelectionProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setErrors({
          ...errors,
          profilePicture: "Profile picture must be less than 5MB",
        });
        return;
      }
      setProfilePicture(file);
      setErrors({ ...errors, profilePicture: undefined });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    switch (name) {
      case "firstName":
        setFirstName(value);
        break;
      case "lastName":
        setLastName(value);
        break;
      case "bio":
        setBio(value);
        break;
      case "companyName":
        setCompanyName(value);
        break;
      case "companyDescription":
        setCompanyDescription(value);
        break;
    }
    setErrors({ ...errors, [name]: undefined });
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!userType) {
      newErrors.userType = "Please select a user type";
    }

    if (userType === "company") {
      if (!companyName.trim()) {
        newErrors.companyName = "Company name is required";
      }
      if (!companyDescription.trim()) {
        newErrors.companyDescription = "Company description is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const baseFormData = new FormData();
      baseFormData.append("first_name", firstName);
      baseFormData.append("last_name", lastName);
      baseFormData.append("email", email);
      baseFormData.append("user_type", userType);

      await updateUserInfo(baseFormData);

      const profileFormData = new FormData();
      if (userType === "company") {
        profileFormData.append("company_name", companyName);
        profileFormData.append("company_description", companyDescription);
        if (profilePicture) {
          profileFormData.append("company_logo", profilePicture);
        }
        await updateCompanyProfile(profileFormData);
      } else {
        if (bio) {
          profileFormData.append("bio", bio);
        }
        if (profilePicture) {
          profileFormData.append("profile_image", profilePicture);
        }
        if (userType === "farmer") {
          await updateFarmerProfile(profileFormData);
        } else if (userType === "buyer") {
          await updateBuyerProfile(profileFormData);
        }
      }

      onNext();
    } catch (error) {
      console.error(error);
      setErrors({
        submit: "Failed to save information. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center">User Information</h2>

      <ProfileForm
        firstName={firstName}
        lastName={lastName}
        onChange={handleInputChange}
        errors={errors}
      />

      <UserTypeRadio
        userType={userType}
        onValueChange={setUserType}
        error={errors.userType}
      />

      {userType && (
        <>
          {userType === "company" ? (
            <div className="space-y-4">
              <input
                type="text"
                name="companyName"
                placeholder="Company Name"
                value={companyName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              {errors.companyName && (
                <p className="text-red-500 text-sm">{errors.companyName}</p>
              )}
              <textarea
                name="companyDescription"
                placeholder="Company Description"
                value={companyDescription}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              {errors.companyDescription && (
                <p className="text-red-500 text-sm">
                  {errors.companyDescription}
                </p>
              )}
              <ProfilePictureUpload
                profilePicture={profilePicture}
                onChange={handleProfilePictureChange}
                error={errors.profilePicture}
                label="Company Logo"
              />
            </div>
          ) : (
            <>
              <textarea
                name="bio"
                placeholder="Bio"
                value={bio}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <ProfilePictureUpload
                profilePicture={profilePicture}
                onChange={handleProfilePictureChange}
                error={errors.profilePicture}
              />
            </>
          )}
        </>
      )}

      <Button
        onClick={handleSubmit}
        className="w-full bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Continue"
        )}
      </Button>
    </div>
  );
}
