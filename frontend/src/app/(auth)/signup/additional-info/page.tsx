"use client";

import { useRouter } from "next/navigation";
import { AdditionalInfoComponent } from "./additional-info";
import { useEffect } from "react";
import { useSignupProgress } from "@/hooks/useSignupProgress";

export default function AdditionalInfoPage() {
  const router = useRouter();
  const { verificationStatus, checkVerificationStatus, proceedToNextStep } =
    useSignupProgress();

  useEffect(() => {
    const checkStatus = async () => {
      const status = await checkVerificationStatus();
      if (
        !status?.isEmailVerified ||
        !status?.userType ||
        !status?.isGovIdVerified
      ) {
        let redirectTo = "/signup/verify-email";
        if (status?.isEmailVerified) {
          redirectTo = !status.userType
            ? "/signup/user-info"
            : "/signup/government-id";
        }
        router.replace(redirectTo);
        return;
      }
      if (status?.userVerified) {
        proceedToNextStep();
      }
    };
    checkStatus();
  }, []);

  const handleAdditionalInfoSubmitted = async () => {
    await proceedToNextStep();
  };

  return (
    <AdditionalInfoComponent
      userType={verificationStatus.userType || ""}
      onNext={handleAdditionalInfoSubmitted}
    />
  );
}
