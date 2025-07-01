"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { EmailPasswordForm } from "./email-password-form";
import { VerificationCodeForm } from "./verification-code-form";
import { registerUser, verifyEmail } from "@/helpers/api";
import { useAuth } from "@/contexts/auth-context";

interface EmailVerificationProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (confirmPassword: string) => void;
  onNext: () => void;
}

interface BackendErrors {
  email?: string[];
  password1?: string[];
  password2?: string[];
  detail?: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  verificationCode?: string;
  general?: string;
}

export function EmailVerificationComponent({
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  onNext,
}: EmailVerificationProps) {
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const { login } = useAuth();

  // convert backend errors -> frontend format
  const formatBackendErrors = (backendErrors: BackendErrors): FormErrors => {
    const formattedErrors: FormErrors = {};

    if (backendErrors.email) {
      formattedErrors.email = backendErrors.email[0];
    }
    if (backendErrors.password1) {
      formattedErrors.password = backendErrors.password1[0];
    }
    if (backendErrors.password2) {
      formattedErrors.confirmPassword = backendErrors.password2[0];
    }
    if (backendErrors.detail) {
      formattedErrors.general = backendErrors.detail;
    }

    return formattedErrors;
  };

  const handleSendCode = async () => {
    setIsSendingCode(true);
    try {
      const response = await registerUser({
        email,
        password1: password,
        password2: confirmPassword,
      });

      const data = await response?.json();

      if (response?.ok) {
        setErrors({});
        await login({ email, password });
      } else {
        setErrors(formatBackendErrors(data));
      }
    } catch {
      setErrors({
        general: "An error occurred. Please try again.",
      });
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerify = async () => {
    if (!verificationCode) {
      setErrors({ verificationCode: "Please enter verification code" });
      return;
    }

    setIsVerifying(true);
    try {
      const response = await verifyEmail(verificationCode);

      if (response?.ok) {
        setIsVerified(true);
        setErrors({});
        setTimeout(onNext, 1000);
      } else {
        const data = await response?.json();
        setErrors({
          verificationCode: data.detail || "Invalid verification code",
        });
      }
    } catch {
      setErrors({
        verificationCode: "An error occurred. Please try again.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">Email Verification</h2>

      {errors.general && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {errors.general}
        </div>
      )}

      <EmailPasswordForm
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        errors={errors}
        isVerified={isVerified}
      />

      <Button
        onClick={handleSendCode}
        className="w-full bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white"
        disabled={isVerified || isSendingCode}
      >
        {isSendingCode ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Verification Code"
        )}
      </Button>

      <VerificationCodeForm
        verificationCode={verificationCode}
        setVerificationCode={setVerificationCode}
        error={errors.verificationCode}
        isVerified={isVerified}
      />

      <Button
        onClick={handleVerify}
        className="w-full bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white"
        disabled={isVerified || isVerifying}
      >
        {isVerifying ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : (
          "Verify"
        )}
      </Button>
    </div>
  );
}
