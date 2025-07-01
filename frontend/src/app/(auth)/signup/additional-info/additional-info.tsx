"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { FarmerForm } from "./components/farmer-form";
import { CompanyForm } from "./components/company-form";
import { BuyerForm } from "./components/buyer-form";
import {
  submitLandInfo,
  submitGSTInfo,
  verifyGovernmentId,
} from "@/helpers/api";
import { useRouter } from "next/navigation";

interface AdditionalInfoProps {
  userType: string;
  onNext: () => void;
}

interface AdditionalInfo {
  landArea: string;
  landUnit: string;
  gstNumber: string;
  panNumber: string;
  landLocation: string;
  landDistrict: string;
  landState: string;
}

export function AdditionalInfoComponent({ userType }: AdditionalInfoProps) {
  const [info, setInfo] = useState<AdditionalInfo>({
    landArea: "",
    landUnit: "acre",
    landLocation: "",
    landDistrict: "",
    landState: "",
    gstNumber: "",
    panNumber: "",
  });
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setError("File must be less than 5MB");
        return;
      }
      setFile(file);
      setError("");
    }
  };

  const validateGST = (gst: string) => {
    return /^[0-9A-Z]{15}$/.test(gst);
  };

  const validatePAN = (pan: string) => {
    return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
  };

  const validateForm = () => {
    if (userType === "farmer") {
      const landAreaNum = parseFloat(info.landArea);
      if (!landAreaNum || landAreaNum <= 0) {
        setError("Please enter a valid land area");
        return false;
      }
      if (!info.landLocation || !info.landDistrict || !info.landState) {
        setError("Please enter complete land location details");
        return false;
      }
      if (!file) {
        setError("Please upload your land certificate");
        return false;
      }
    }

    if (userType === "company") {
      if (!validateGST(info.gstNumber)) {
        setError("Please enter a valid GST number");
        return false;
      }
      if (!file) {
        setError("Please upload your GST certificate");
        return false;
      }
    }

    if (userType === "company" || userType === "buyer") {
      if (!validatePAN(info.panNumber)) {
        setError("Please enter a valid PAN number");
        return false;
      }
    }

    return true;
  };

  const convertToAcres = (value: string, fromUnit: string): string => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return "0";

    switch (fromUnit) {
      case "hectare":
        return (numValue * 2.47105).toFixed(2);
      case "sqft":
        return (numValue * 0.0000229568).toFixed(2);
      case "sqm":
        return (numValue * 0.000247105).toFixed(2);
      default: // acre
        return value;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (userType === "farmer") {
        const formData = new FormData();
        const areaInAcres = convertToAcres(info.landArea, info.landUnit);
        formData.append("land_area", areaInAcres);
        formData.append("document_image", file!);
        const fullLocation =
          `${info.landLocation}, ${info.landDistrict}, ${info.landState}`.trim();
        formData.append("land_location", fullLocation);

        await submitLandInfo(formData);
      } else if (userType === "company") {
        const formData = new FormData();
        formData.append("gst_number", info.gstNumber);
        formData.append("gst_certificate", file!);

        await submitGSTInfo(formData);
        await verifyGovernmentId({
          gov_id: info.panNumber,
          type_of_id: "PAN",
        });
      } else if (userType === "buyer") {
        await verifyGovernmentId({
          gov_id: info.panNumber,
          type_of_id: "PAN",
        });
      }
      router.replace("/profile");
    } catch (err) {
      setError("Failed to save information. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center">Additional Information</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      {userType === "farmer" && (
        <FarmerForm
          info={info}
          file={file}
          handleInputChange={handleInputChange}
          handleFileChange={handleFileChange}
          convertToAcres={convertToAcres}
        />
      )}

      {userType === "company" && (
        <CompanyForm
          info={info}
          file={file}
          handleInputChange={handleInputChange}
          handleFileChange={handleFileChange}
        />
      )}

      {userType === "buyer" && (
        <BuyerForm info={info} handleInputChange={handleInputChange} />
      )}

      <Button
        onClick={handleSubmit}
        className="w-full bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Complete Registration"
        )}
      </Button>
    </div>
  );
}
