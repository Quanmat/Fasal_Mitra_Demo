"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileText, Check, Loader2, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { requestAadhaarOtp, verifyAadhaarOtp } from "@/helpers/api";

interface GovernmentIdVerificationProps {
  onNext: () => void;
}

export function GovernmentIdVerificationComponent({
  onNext,
}: GovernmentIdVerificationProps) {
  const [idNumber, setIdNumber] = useState("");
  const [name, setName] = useState("");
  const [date, setDate] = useState<Date>();
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [refId, setRefId] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const validateAadhar = (number: string) => {
    // Basic Aadhar validation - 12 digits
    return /^\d{12}$/.test(number);
  };

  const formatAadhar = (value: string) => {
    // Remove all non-digits first
    const digits = value.replace(/\D/g, "");

    // Add spaces after every 4 digits
    const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");

    return formatted;
  };

  const validateInputs = () => {
    if (!validateAadhar(idNumber.replace(/\s/g, ""))) {
      setError("Please enter a valid 12-digit Aadhar number");
      return false;
    }
    if (!name || name.trim().length < 2) {
      setError("Please enter your valid name as on Aadhar");
      return false;
    }
    if (!date) {
      setError("Please enter your date of birth");
      return false;
    }
    return true;
  };

  const handleGetOtp = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);
    try {
      setOtp("");
      setError("");

      const response = await requestAadhaarOtp({
        aadhaar_number: idNumber.replace(/\s/g, ""),
      });
      if (!response?.ref_id) {
        setError("Failed to send OTP. Please try again.");
        return;
      }
      setRefId(response.ref_id);
      setShowOtpInput(true);
      setResendTimer(30);
    } catch {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpComplete = (value: string) => {
    setOtp(value);
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      await verifyAadhaarOtp({
        otp,
        ref_id: refId,
      });
      setError("");
      setIsVerified(true);
      onNext();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || "Invalid OTP. Please try again.");
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center">
        Government ID Verification
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Name (as on Aadhar) *</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name as on Aadhar"
          disabled={isVerified}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dob">Date of Birth *</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="dob"
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
              disabled={isVerified}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="id-number">Aadhar Number *</Label>
        <div className="relative">
          <Input
            id="id-number"
            type="text"
            value={idNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\s/g, ""); // remove existing spaces
              if (value.length <= 12) {
                setIdNumber(formatAadhar(value));
              }
            }}
            placeholder="XXXX XXXX XXXX"
            className="pr-10"
            maxLength={14} // 12 digits + 2 spaces
            disabled={isVerified}
          />
          <FileText className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <Button
        onClick={handleGetOtp}
        className="w-full bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white"
        disabled={isVerified || isLoading || (showOtpInput && resendTimer > 0)}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {showOtpInput ? "Resending OTP..." : "Sending OTP..."}
          </>
        ) : showOtpInput ? (
          resendTimer > 0 ? (
            `Resend OTP (${resendTimer}s)`
          ) : (
            "Resend OTP"
          )
        ) : (
          "Get OTP"
        )}
      </Button>

      {showOtpInput && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="otp">Enter OTP</Label>
            <div className="mt-2">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={handleOtpComplete}
                pattern={REGEXP_ONLY_DIGITS}
                disabled={isVerified || isLoading}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>

          <Button
            onClick={handleVerifyOtp}
            className="w-full bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white"
            disabled={isVerified || isLoading || otp.length !== 6}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify"
            )}
          </Button>
        </div>
      )}

      {isVerified && (
        <div className="flex items-center justify-center text-green-500">
          <Check className="mr-2 h-4 w-4" /> Verified Successfully
        </div>
      )}
    </div>
  );
}
