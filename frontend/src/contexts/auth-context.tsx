"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AuthUser,
  AuthState,
  LoginCredentials,
  RegisterCredentials,
  AuthContextType,
} from "@/types/auth";
import {
  login as loginApi,
  register as registerApi,
  logOut as logoutApi,
  getAccessToken,
} from "@/helpers/auth";
import {
  getUserProfile,
  getFarmerProfile,
  getCompanyProfile,
  getBuyerProfile,
  updateUserProfile,
  updateFarmerProfile,
  updateCompanyProfile,
  updateBuyerProfile,
  getFarmerLandInfo,
  getGovernmentId,
  getGSTInfo,
} from "@/helpers/api";
import { setCookie } from "cookies-next";

const initialState: AuthState = {
  user: null,
  profile: null,
  verificationStatus: {
    isEmailVerified: false,
    isGovIdVerified: false,
    userVerified: false,
    userType: null,
    email: null,
  },
  isLoading: false,
  error: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);
  const router = useRouter();

  const fetchUserProfile = async () => {
    try {
      const baseProfile = await getUserProfile();
      if (!baseProfile) return;

      let specificProfile = null;
      let landInfo = null;
      let governmentId = null;
      let gstInfo = null;

      switch (baseProfile.user_type) {
        case "farmer":
          specificProfile = await getFarmerProfile();
          landInfo = await getFarmerLandInfo();
          if (landInfo) {
            specificProfile = { ...specificProfile, landInfo };
          }
          break;
        case "company":
          specificProfile = await getCompanyProfile();
          governmentId = await getGovernmentId();
          gstInfo = await getGSTInfo();
          if (governmentId) {
            specificProfile = { ...specificProfile, governmentId };
          }
          if (gstInfo) {
            specificProfile = { ...specificProfile, gstInfo };
          }
          break;
        case "buyer":
          specificProfile = await getBuyerProfile();
          governmentId = await getGovernmentId();
          if (governmentId) {
            specificProfile = { ...specificProfile, governmentId };
          }
          break;
      }

      setState((prev) => ({
        ...prev,
        user: {
          ...baseProfile,
          user_type: baseProfile.user_type,
        } as AuthUser,
        profile: specificProfile
          ? {
              [baseProfile.user_type]: specificProfile,
            }
          : null,
        verificationStatus: {
          ...prev.verificationStatus,
          isEmailVerified: baseProfile.is_email_verified,
          isGovIdVerified: baseProfile.is_gov_id_verified,
          userVerified: baseProfile.user_verified,
          userType: baseProfile.user_type,
          email: baseProfile.email,
        },
      }));
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      fetchUserProfile();
    }
  }, []);

  const updateProfile = async (data: FormData) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await updateUserProfile(data);
      if (!response?.ok) {
        throw new Error("Failed to update profile");
      }

      if (state.user) {
        switch (state.user.user_type) {
          case "farmer":
            await updateFarmerProfile(data);
            break;
          case "company":
            await updateCompanyProfile(data);
            break;
          case "buyer":
            await updateBuyerProfile(data);
            break;
        }
      }

      await fetchUserProfile();
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
      throw error;
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const success = await loginApi(credentials);

      if (success) {
        console.log("Login successful, fetching user profile...");
        const baseProfile = await getUserProfile();
        console.log("Base profile:", baseProfile);

        if (baseProfile?.user_type) {
          console.log("Setting userType cookie:", baseProfile.user_type);
          setCookie("userType", baseProfile.user_type, {
            maxAge: 30 * 24 * 60 * 60,
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
          });

          // Redirect based on user type
          switch (baseProfile.user_type) {
            case "farmer":
              router.push("/farmer/contracts");
              break;
            case "company":
              router.push("/company");
              break;
            case "buyer":
              router.push("/buyer");
              break;
            default:
              router.push("/");
          }
        }
        await fetchUserProfile();
      } else {
        setState((prev) => ({
          ...prev,
          error: "Invalid credentials",
        }));
      }
    } catch {
      console.error("Login error");
      setState((prev) => ({
        ...prev,
        error: "Login failed. Please try again.",
      }));
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const success = await registerApi(credentials);

      if (success) {
        toast.success("Registration successful! Please verify your email.");
      } else {
        setState((prev) => ({
          ...prev,
          error: "Registration failed",
        }));
      }
    } catch {
      setState((prev) => ({
        ...prev,
        error: "Registration failed. Please try again.",
      }));
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const logout = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const success = await logoutApi();

      setState(initialState);
      router.push("/login");

      if (!success) {
        toast.error("Server logout failed, but you've been logged out locally");
      }
    } catch {
      console.error("Logout error");
      setState(initialState);
      router.push("/login");
      toast.error(
        "Logout encountered an error, but you've been logged out locally"
      );
    }
  };

  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }));
  };

  const refreshUser = async () => {
    await fetchUserProfile();
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        clearError,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
