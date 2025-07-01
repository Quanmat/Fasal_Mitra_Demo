"use client";

import { useRouter } from "next/navigation";
import { GovernmentIdVerificationComponent } from "./government-id-verification";
import { useEffect } from "react";
import { useSignupProgress } from "@/hooks/useSignupProgress";

export default function GovernmentIdPage() {
  const router = useRouter();
  const { checkVerificationStatus, proceedToNextStep } = useSignupProgress();

  useEffect(() => {
    const checkStatus = async () => {
      const status = await checkVerificationStatus();
      if (!status?.isEmailVerified || !status?.userType) {
        const redirectTo = !status?.isEmailVerified
          ? "/signup/verify-email"
          : "/signup/user-info";
        router.replace(redirectTo);
        return;
      }
      if (status?.isGovIdVerified) {
        proceedToNextStep();
      }
    };
    checkStatus();
  }, []);

  const handleGovIdVerified = async () => {
    await proceedToNextStep();
  };

  return (
    <>
      <GovernmentIdVerificationComponent onNext={handleGovIdVerified} />
    </>
  );
}
