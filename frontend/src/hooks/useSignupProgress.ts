import { useState } from "react";
import { useRouter } from "next/navigation";
import { checkUserVerification } from "@/helpers/api";

export const SIGNUP_STEPS = {
  VERIFY_EMAIL: "/signup/verify-email",
  USER_INFO: "/signup/user-info",
  GOVERNMENT_ID: "/signup/government-id",
  ADDITIONAL_INFO: "/signup/additional-info",
  PROFILE: "/profile",
} as const;

type SignupStep = (typeof SIGNUP_STEPS)[keyof typeof SIGNUP_STEPS];

interface VerificationStatus {
  isEmailVerified: boolean;
  isGovIdVerified: boolean;
  userVerified: boolean;
  userType: string | null;
  email: string | null;
}

export function useSignupProgress() {
  const router = useRouter();
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus>({
      isEmailVerified: false,
      isGovIdVerified: false,
      userVerified: false,
      userType: null,
      email: null,
    });

  const checkVerificationStatus = async () => {
    try {
      const data = await checkUserVerification();
      if (!data) return null;

      const status = {
        isEmailVerified: data.is_email_verified,
        isGovIdVerified: data.is_gov_id_verified,
        userVerified: data.user_verified,
        userType: data.user_type,
        email: data.email,
      };

      setVerificationStatus(status);
      return status;
    } catch (error) {
      console.error("Error checking verification status:", error);
      return null;
    }
  };

  const determineNextStep = (status: VerificationStatus): SignupStep => {
    if (!status.isEmailVerified) return SIGNUP_STEPS.VERIFY_EMAIL;
    if (!status.userType) return SIGNUP_STEPS.USER_INFO;
    if (!status.isGovIdVerified) return SIGNUP_STEPS.GOVERNMENT_ID;
    if (!status.userVerified) return SIGNUP_STEPS.ADDITIONAL_INFO;
    return SIGNUP_STEPS.PROFILE;
  };

  const proceedToNextStep = async () => {
    const status = await checkVerificationStatus();
    if (status) {
      const nextStep = determineNextStep(status);
      router.replace(nextStep);
    }
  };

  return {
    verificationStatus,
    checkVerificationStatus,
    proceedToNextStep,
  };
}
