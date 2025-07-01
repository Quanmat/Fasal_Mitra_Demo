"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  FileText,
  Loader2,
  Upload,
  X,
  ArrowLeft,
} from "lucide-react";
import { useState, useEffect } from "react";
import { createContractTemplate, getCropListings } from "@/helpers/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Crop } from "@/types/crop";
import { CropCombobox } from "@/components/ui/crop-combobox";

export default function CreateContractPage() {
  const router = useRouter();
  const [contractName, setContractName] = useState("");
  const [contractDescription, setContractDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [price, setPrice] = useState("");
  const [crop, setCrop] = useState<number>(0);
  const [totalQuantity, setTotalQuantity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [isCropsLoading, setIsCropsLoading] = useState(true);
  const [fileError, setFileError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const data = await getCropListings();
        if (data) {
          setCrops(data);
        }
      } catch {
        toast.error("Failed to load crops");
      } finally {
        setIsCropsLoading(false);
      }
    };

    fetchCrops();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        setFileError("Please upload only PDF or DOCX files");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setFileError("File size should not exceed 5MB");
      } else {
        setSelectedFile(file);
        setFileError(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setFileError("Please upload a contract file");
      return;
    }

    setIsLoading(true);
    setFileError(null);

    const formData = new FormData();
    formData.append("contract_name", contractName);
    formData.append("contract_description", contractDescription);
    formData.append("contract_file", selectedFile);
    formData.append("price", price);
    formData.append("crop", crop.toString());
    formData.append("total_quintal_required", totalQuantity);

    try {
      const response = await createContractTemplate(formData);
      if (response) {
        toast.success("Contract created successfully", {
          description:
            "Your contract template has been created and is pending approval.",
        });
        router.push("/buyer");
      } else {
        setFileError("Failed to create contract. Please try again.");
      }
    } catch {
      setFileError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          className="mr-4 text-green-700 hover:text-green-800 hover:bg-green-50/50"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-green-800">
            Create New Contract
          </h1>
          <p className="mt-2 text-green-700/80">
            Fill in the details to create a new contract template
          </p>
        </div>
      </div>

      <Card className="overflow-hidden border-0 bg-white/90 backdrop-blur-sm shadow-lg">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8 py-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-800">
                Basic Information
              </h3>
              <div className="space-y-2">
                <Label htmlFor="contract_name">Contract Name</Label>
                <Input
                  id="contract_name"
                  value={contractName}
                  onChange={(e) => setContractName(e.target.value)}
                  placeholder="Enter contract name"
                  className="border-green-200 bg-white/80 focus:border-blue-400 focus:ring-blue-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contract_description">Description</Label>
                <Textarea
                  id="contract_description"
                  value={contractDescription}
                  onChange={(e) => setContractDescription(e.target.value)}
                  placeholder="Enter contract description"
                  className="min-h-[120px] resize-none border-green-200 bg-white/80 focus:border-blue-400 focus:ring-blue-400"
                  required
                />
              </div>
            </div>

            {/* Contract Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-800">
                Contract Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price per Quintal (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="border-green-200 bg-white/80 focus:border-blue-400 focus:ring-blue-400"
                    placeholder="Enter price"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Required Quantity (quintals)</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={totalQuantity}
                    onChange={(e) => setTotalQuantity(e.target.value)}
                    className="border-green-200 bg-white/80 focus:border-blue-400 focus:ring-blue-400"
                    placeholder="Enter quantity"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="crop">Crop Type</Label>
                <CropCombobox
                  crops={crops}
                  value={crop}
                  onChange={setCrop}
                  disabled={isCropsLoading}
                />
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-800">
                Contract Document
              </h3>
              <div className="mt-2">
                {selectedFile ? (
                  <div className="flex items-center justify-between p-4 rounded-lg bg-white/80 border border-green-200 hover:border-green-300 transition-all duration-300">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-6 w-6 text-green-600" />
                      <span className="font-medium text-green-700 truncate max-w-[200px]">
                        {selectedFile.name}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedFile(null)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50/50"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-green-200 border-dashed rounded-lg cursor-pointer bg-white/80 hover:bg-white/70 hover:border-green-300 transition-all duration-300">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 mb-3 text-green-600" />
                      <p className="mb-2 text-sm text-green-700">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-green-600/80">
                        PDF or DOCX (MAX. 5MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf,.docx"
                    />
                  </label>
                )}
              </div>
            </div>

            {fileError && (
              <Alert
                variant="destructive"
                className="bg-red-50/80 text-red-800 border-red-200"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{fileError}</AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <Button
                type="submit"
                className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white shadow-lg transition-all duration-300 min-w-[200px]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Contract"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
