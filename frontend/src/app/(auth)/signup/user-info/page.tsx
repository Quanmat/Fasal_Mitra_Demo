"use client";

import { useRouter } from "next/navigation";
import UserTypeSelection from "./components/index";
import { useState, useEffect } from "react";
import { useSignupProgress } from "@/hooks/useSignupProgress";

export default function UserInfoPage() {
  const router = useRouter();
  const { verificationStatus, checkVerificationStatus, proceedToNextStep } =
    useSignupProgress();

  const [userType, setUserType] = useState("");

  useEffect(() => {
    const checkStatus = async () => {
      const status = await checkVerificationStatus();
      if (!status?.isEmailVerified) {
        router.replace("/signup/verify-email");
        return;
      }
      if (status?.userType) {
        proceedToNextStep();
      }
    };
    checkStatus();
  }, []);

  const handleUserTypeVerified = async () => {
    await proceedToNextStep();
  };

  return (
    <>
      <UserTypeSelection
        userType={userType}
        setUserType={setUserType}
        email={verificationStatus.email || ""}
        onNext={handleUserTypeVerified}
      />
    </>
  );
}
