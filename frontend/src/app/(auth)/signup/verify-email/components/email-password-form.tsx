import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Check, X } from "lucide-react";

interface EmailPasswordFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (confirmPassword: string) => void;
  errors: {
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
  isVerified: boolean;
}

export function EmailPasswordForm({
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  errors,
  isVerified,
}: EmailPasswordFormProps) {
  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className={`pr-10 ${errors.email ? "border-red-500" : ""}`}
            disabled={isVerified}
          />
          <Mail className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email}</p>
        )}
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your Password (min 8 characters)"
            className={`pr-10 ${errors.password ? "border-red-500" : ""}`}
            disabled={isVerified}
          />
        </div>
        {errors.password && (
          <p className="text-sm text-red-500 mt-1">{errors.password}</p>
        )}
      </div>
      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your Password"
            className={`pr-10 ${
              errors.confirmPassword ? "border-red-500" : ""
            }`}
            disabled={isVerified}
          />
          {password &&
            confirmPassword &&
            (password === confirmPassword ? (
              <Check className="absolute right-3 top-2.5 h-5 w-5 text-green-500" />
            ) : (
              <X className="absolute right-3 top-2.5 h-5 w-5 text-red-500" />
            ))}
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
        )}
      </div>
    </div>
  );
}
