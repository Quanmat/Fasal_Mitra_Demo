"use client";

import { EmailVerificationComponent } from "./components";
import { useState, useEffect } from "react";
import { useSignupProgress } from "@/hooks/useSignupProgress";

export default function VerifyEmailPage() {
  const { checkVerificationStatus, proceedToNextStep } = useSignupProgress();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const checkStatus = async () => {
      const status = await checkVerificationStatus();
      if (status?.isEmailVerified) {
        proceedToNextStep();
      }
    };
    checkStatus();
  }, [checkVerificationStatus, proceedToNextStep]);

  const handleEmailVerified = async () => {
    await proceedToNextStep();
  };

  return (
    <>
      <EmailVerificationComponent
        email={formData.email}
        setEmail={(email) => setFormData((prev) => ({ ...prev, email }))}
        password={formData.password}
        setPassword={(password) =>
          setFormData((prev) => ({ ...prev, password }))
        }
        confirmPassword={formData.confirmPassword}
        setConfirmPassword={(confirmPassword) =>
          setFormData((prev) => ({ ...prev, confirmPassword }))
        }
        onNext={handleEmailVerified}
      />
    </>
  );
}
