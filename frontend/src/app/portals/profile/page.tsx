"use client";
import { LandInfoSection } from "./components/land-info";
import { GovernmentIDSection } from "./components/government-id";
import { GSTInfoSection } from "./components/gst-info";
import { useAuth } from "@/contexts/auth-context";
import { useProfile } from "@/hooks/use-profile";
import Image from "next/image";
import {
  Camera,
  Edit2,
  Save,
  X,
  Mail,
  Building2,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  FarmerUser,
  CompanyUser,
  BuyerUser,
  FarmerProfile,
  CompanyProfile,
  BuyerProfile,
} from "@/types/user";

export default function ProfilePage() {
  const { profile: authProfile } = useAuth();
  const {
    user,
    editedUser,
    isLoading,
    isEditing,
    imagePreview,
    setIsEditing,
    handleInputChange,
    handleImageUpload,
    handleSave,
  } = useProfile();

  const getDisplayName = () =>
    editedUser ? `${editedUser.first_name} ${editedUser.last_name}` : "";

  // Get the specific profile based on user type
  const getSpecificProfile = () => {
    if (!user) return null;
    return authProfile?.[user.user_type];
  };

  const specificProfile = getSpecificProfile();

  // Update image source logic
  const getProfileImage = () => {
    if (imagePreview) return imagePreview;
    if (!specificProfile) return "/placeholder.svg?height=128&width=128";

    switch (user?.user_type) {
      case "company":
        return (
          (specificProfile as CompanyProfile).company_logo ||
          "/placeholder.svg?height=128&width=128"
        );
      case "farmer":
      case "buyer":
        return (
          (specificProfile as FarmerProfile | BuyerProfile).profile_image ||
          "/placeholder.svg?height=128&width=128"
        );
      default:
        return "/placeholder.svg?height=128&width=128";
    }
  };

  // Update the profile sections
  const renderUserTypeSpecificInfo = () => {
    if (!user || !specificProfile) return null;

    switch (user.user_type) {
      case "farmer":
      case "buyer":
        return (
          <div className="flex items-start mt-4">
            <FileText
              className="text-green-600 mr-3 mt-1 flex-shrink-0"
              size={20}
            />
            {isEditing ? (
              <textarea
                name="bio"
                value={(editedUser as FarmerUser | BuyerUser).bio || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md bg-white/50"
                placeholder="Enter your bio"
              />
            ) : (
              <p className="text-gray-700">
                {(editedUser as FarmerUser | BuyerUser).bio ||
                  "No bio provided"}
              </p>
            )}
          </div>
        );
      case "company":
        return (
          <>
            <div className="flex items-center mt-4">
              <Building2 className="text-green-600 mr-3" size={20} />
              {isEditing ? (
                <Input
                  type="text"
                  name="company_name"
                  value={(editedUser as CompanyUser).company_name}
                  onChange={handleInputChange}
                  className="w-full bg-white/50"
                  placeholder="Enter company name"
                />
              ) : (
                <span className="font-semibold">
                  {(editedUser as CompanyUser).company_name}
                </span>
              )}
            </div>
            <div className="flex items-start mt-4">
              <FileText
                className="text-green-600 mr-3 mt-1 flex-shrink-0"
                size={20}
              />
              {isEditing ? (
                <textarea
                  name="company_description"
                  value={(editedUser as CompanyUser).company_description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md bg-white/50"
                  placeholder="Enter company description"
                />
              ) : (
                <p className="text-gray-700">
                  {(editedUser as CompanyUser).company_description}
                </p>
              )}
            </div>
          </>
        );
    }
  };

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
      </div>
    );
  }

  return (
    <>
      {user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-8 p-4"
        >
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-green-800">
              Profile Settings
            </h1>
            <p className="text-green-700/80 mt-2">
              Manage your account information and preferences
            </p>
          </div>

          <Card className="overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-xl">
            <CardHeader className="border-b bg-gradient-to-r from-white/50 to-white/30 pb-8">
              <div className="flex flex-col items-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative mb-6"
                >
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-green-200 shadow-xl">
                    <Image
                      src={getProfileImage()}
                      alt={
                        user?.user_type === "company"
                          ? "Company Logo"
                          : "Profile Picture"
                      }
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Button
                    size="icon"
                    className="absolute bottom-0 right-0 bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white rounded-full shadow-lg transition-transform hover:scale-110"
                    onClick={() =>
                      document.getElementById("profile-image-upload")?.click()
                    }
                    disabled={!isEditing}
                    style={{ opacity: isEditing ? 1 : 0 }}
                  >
                    <Camera size={16} />
                    <input
                      id="profile-image-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={!isEditing}
                    />
                  </Button>
                </motion.div>
                {!isEditing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                  >
                    <h2 className="text-2xl font-bold text-gray-800">
                      {getDisplayName()}
                    </h2>
                    <div className="flex items-center justify-center mt-2 text-gray-600">
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium capitalize">
                        {user.user_type}
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-8">
              <div className="max-w-2xl mx-auto">
                {isEditing ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          First Name
                        </label>
                        <Input
                          type="text"
                          name="first_name"
                          value={editedUser.first_name}
                          onChange={handleInputChange}
                          className="bg-white/50 border-gray-200 focus:border-green-300 focus:ring-green-200"
                          placeholder="First Name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Last Name
                        </label>
                        <Input
                          type="text"
                          name="last_name"
                          value={editedUser.last_name}
                          onChange={handleInputChange}
                          className="bg-white/50 border-gray-200 focus:border-green-300 focus:ring-green-200"
                          placeholder="Last Name"
                        />
                      </div>
                    </div>
                  </motion.div>
                ) : null}

                <div className="space-y-6 mt-6">
                  <div className="rounded-lg bg-gradient-to-r from-white/80 to-white/50 border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Contact Information
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center p-3 bg-white/50 rounded-md">
                          <Mail className="text-green-600 mr-3" size={20} />
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              Email
                            </p>
                            <p className="text-gray-900">{user.email}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-gradient-to-r from-white/80 to-white/50 border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        {user.user_type === "company"
                          ? "Company Details"
                          : "Bio"}
                      </h3>
                      {renderUserTypeSpecificInfo()}
                    </div>
                  </div>

                  {user.user_type === "farmer" && (
                    <div className="rounded-lg bg-gradient-to-r from-white/80 to-white/50 border border-gray-100 shadow-sm overflow-hidden mt-6">
                      <div className="px-6 py-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                          Land Information
                        </h3>
                        <LandInfoSection
                          landInfo={authProfile?.farmer?.landInfo}
                        />
                      </div>
                    </div>
                  )}

                  {(user.user_type === "company" ||
                    user.user_type === "buyer") && (
                    <div className="rounded-lg bg-gradient-to-r from-white/80 to-white/50 border border-gray-100 shadow-sm overflow-hidden mt-6">
                      <div className="px-6 py-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                          Government ID Information
                        </h3>
                        <GovernmentIDSection
                          governmentId={
                            user.user_type === "company"
                              ? authProfile?.company?.governmentId
                              : authProfile?.buyer?.governmentId
                          }
                        />
                      </div>
                    </div>
                  )}

                  {user.user_type === "company" && (
                    <div className="rounded-lg bg-gradient-to-r from-white/80 to-white/50 border border-gray-100 shadow-sm overflow-hidden mt-6">
                      <div className="px-6 py-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                          GST Information
                        </h3>
                        <GSTInfoSection
                          gstInfo={authProfile?.company?.gstInfo}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8">
                  {isEditing ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex space-x-4"
                    >
                      <Button
                        onClick={handleSave}
                        className="flex-1 bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white shadow-lg transition-all hover:shadow-xl"
                      >
                        <Save size={20} className="mr-2" />
                        Save Changes
                      </Button>
                      <Button
                        onClick={() => setIsEditing(false)}
                        variant="destructive"
                        className="flex-1 shadow-lg hover:shadow-xl"
                      >
                        <X size={20} className="mr-2" />
                        Cancel
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div whileHover={{ scale: 1.02 }}>
                      <Button
                        onClick={() => setIsEditing(true)}
                        className="w-full bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white shadow-lg transition-all hover:shadow-xl"
                      >
                        <Edit2 size={20} className="mr-2" />
                        Edit Profile
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </>
  );
}
