"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Upload, Building2 } from "lucide-react";
import {
  submitTenderApplication,
  getTransportationTenders,
} from "@/helpers/api";
import { toast } from "sonner";
import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Tender {
  id: number;
  tender_name: string;
  tender_description: string;
  tender_file: string;
  created_at: string;
  end_date: string;
  is_active: boolean;
}

const FileUploadSection = ({
  file,
  setFile,
}: {
  file: File | null;
  setFile: (file: File | null) => void;
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="application_file" className="text-green-700">
        Proposal Document
      </Label>
      {!file ? (
        <div className="mt-1 border-2 border-green-200 hover:border-blue-400 transition-all duration-300 rounded-lg bg-white/50">
          <label
            htmlFor="application_file"
            className="relative block cursor-pointer p-6 text-center"
          >
            <Upload className="mx-auto h-12 w-12 text-green-600 mb-4" />
            <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Click to upload
            </span>
            <span className="text-sm text-gray-500 ml-1">or drag and drop</span>
            <Input
              id="application_file"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
              className="sr-only"
            />
            <p className="text-xs text-gray-500 mt-2">PDF or DOC up to 10MB</p>
          </label>
        </div>
      ) : (
        <div className="mt-1">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFile(null)}
              className="p-1.5 bg-green-100 hover:bg-green-200 rounded-lg transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <div className="mt-2 flex items-center space-x-2">
            <button
              type="button"
              onClick={() =>
                document.getElementById("application_file")?.click()
              }
              className="text-sm text-blue-600 hover:text-blue-500 font-medium"
            >
              Change file
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const TenderDetailsCard = ({ tender }: { tender: Tender }) => {
  return (
    <div className="rounded-lg bg-gradient-to-r from-white/80 to-white/50 border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Tender Details</h2>
        <Badge
          variant="outline"
          className="bg-green-50 text-green-600 border-green-200"
        >
          Active until {new Date(tender.end_date).toLocaleDateString()}
        </Badge>
      </div>
      <p className="text-gray-600 mb-4">{tender.tender_description}</p>
      <div className="flex items-center text-gray-600">
        <FileText className="h-5 w-5 text-green-600 mr-2" />
        <Link
          href={tender.tender_file}
          className="text-blue-600 hover:text-blue-700 underline"
        >
          View Tender Document
        </Link>
      </div>
    </div>
  );
};

export default function TenderApplicationPage() {
  const { id } = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [tender, setTender] = useState<Tender | null>(null);

  useEffect(() => {
    const fetchTender = async () => {
      const tenders = await getTransportationTenders();
      const currentTender = tenders?.find(
        (t: Tender) => t.id.toString() === id
      );
      if (currentTender) {
        setTender(currentTender);
      } else {
        toast.error("Tender not found");
        router.push("/tenders");
      }
    };

    fetchTender();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!tender) {
      toast.error("Tender not found");
      return;
    }
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("tender", tender.id.toString());
      formData.append(
        "applicant_name",
        (e.currentTarget as HTMLFormElement).applicant_name.value
      );
      formData.append(
        "company_name",
        (e.currentTarget as HTMLFormElement).company_name.value
      );
      formData.append(
        "applicant_contact",
        (e.currentTarget as HTMLFormElement).applicant_contact.value
      );
      formData.append(
        "address",
        (e.currentTarget as HTMLFormElement).address.value
      );
      formData.append("application_file", file, file.name);

      const response = await submitTenderApplication(formData);

      if (response) {
        toast.success("Application submitted successfully", {
          description: "We will contact you soon regarding your application.",
        });
        router.push("/tenders");
      } else {
        throw new Error("Failed to submit application");
      }
    } catch {
      toast.error("Failed to submit application", {
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!tender) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-100 to-blue-200 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-100 to-blue-200">
      <div className="max-w-4xl mx-auto p-4">
        <Link
          href="/tenders"
          className="inline-flex items-center text-green-700 hover:text-green-800 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Tenders
        </Link>

        <div className="flex items-center mb-8">
          <Building2 className="h-8 w-8 text-green-600 mr-3" />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Apply for Tender
            </h1>
            <p className="text-gray-600 mt-1">{tender.tender_name}</p>
          </div>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
          <CardHeader className="border-b bg-gradient-to-r from-white/50 to-white/30 pb-6">
            <TenderDetailsCard tender={tender} />
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="applicant_name" className="text-green-700">
                    Full Name
                  </Label>
                  <Input
                    id="applicant_name"
                    name="applicant_name"
                    required
                    placeholder="Enter your full name"
                    className="border-green-200 bg-white/50 focus:border-blue-400 focus:ring-blue-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company_name" className="text-green-700">
                    Company Name
                  </Label>
                  <Input
                    id="company_name"
                    name="company_name"
                    required
                    placeholder="Enter company name"
                    className="border-green-200 bg-white/50 focus:border-blue-400 focus:ring-blue-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="applicant_contact" className="text-green-700">
                    Contact Number
                  </Label>
                  <Input
                    id="applicant_contact"
                    name="applicant_contact"
                    required
                    type="tel"
                    placeholder="Enter contact number"
                    className="border-green-200 bg-white/50 focus:border-blue-400 focus:ring-blue-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-green-700">
                    Address
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    required
                    placeholder="Enter your address"
                    className="border-green-200 bg-white/50 focus:border-blue-400 focus:ring-blue-400"
                  />
                </div>
              </div>

              <FileUploadSection file={file} setFile={setFile} />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white shadow-lg transition-all duration-300 ease-in-out h-11"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    <span>Submitting Application...</span>
                  </div>
                ) : (
                  "Submit Application"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
