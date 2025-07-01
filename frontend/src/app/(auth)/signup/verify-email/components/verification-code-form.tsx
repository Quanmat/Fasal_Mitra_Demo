import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";

interface VerificationCodeFormProps {
  verificationCode: string;
  setVerificationCode: (code: string) => void;
  error?: string;
  isVerified: boolean;
}

export function VerificationCodeForm({
  verificationCode,
  setVerificationCode,
  error,
  isVerified,
}: VerificationCodeFormProps) {
  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="verification-code">Verification Code</Label>
        <div className="relative">
          <Input
            id="verification-code"
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter verification code"
            className={`pr-10 ${error ? "border-red-500" : ""}`}
            disabled={isVerified}
          />
          {isVerified && (
            <Check className="absolute right-3 top-2.5 h-5 w-5 text-green-500" />
          )}
        </div>
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
    </div>
  );
}
