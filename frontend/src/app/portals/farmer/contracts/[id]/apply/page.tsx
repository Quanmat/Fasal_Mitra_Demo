"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ContractTemplate } from "@/types/contract";
import { getContractTemplates, applyForContract } from "@/helpers/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Loader2,
  IndianRupee,
  Scale,
  FileText,
  ArrowLeft,
  Leaf,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ContractApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [contract, setContract] = useState<ContractTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [estimateProduction, setEstimateProduction] = useState("");

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const data = await getContractTemplates();
        const contractData = data.find(
          (c: ContractTemplate) => c.id === parseInt(id)
        );
        if (contractData) {
          setContract(contractData);
        } else {
          toast.error("Contract not found");
          router.push("/farmer");
        }
      } catch {
        toast.error("Failed to load contract");
        router.push("/farmer");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContract();
  }, [id, router]);

  const estimatedPrice = () => {
    if (!estimateProduction || !contract) return 0;
    const price = parseFloat(contract.price);
    const quantity = parseFloat(estimateProduction);
    if (isNaN(price) || isNaN(quantity)) return 0;
    return price * quantity;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract) return;

    if (!estimateProduction) {
      toast.error("Please enter your estimated production");
      return;
    }

    const quantity = parseFloat(estimateProduction);
    const required = parseFloat(contract.total_quintal_required);

    if (quantity > required) {
      toast.error("Your estimated production exceeds the required quantity");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await applyForContract(contract.id, {
        estimate_production_in_quintal: estimateProduction,
        estimate_total_price: estimatedPrice().toString(),
      });
      if (response) {
        toast.success("Application submitted successfully");
        router.push(response.signing_link);
      } else {
        toast.error("Failed to submit application");
      }
    } catch {
      toast.error("An error occurred while applying");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!contract) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="gap-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Badge className="bg-green-100/80 text-green-700">Available</Badge>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="border-green-200 text-green-700 hover:bg-green-50"
                onClick={() => window.open(contract.contract_file, "_blank")}
              >
                <FileText className="h-4 w-4 mr-2" />
                View Contract Document
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Open detailed contract document in new tab</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Contract Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-green-600" />
                <CardTitle>{contract.contract_name}</CardTitle>
              </div>
              <CardDescription>{contract.contract_description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-green-700">
                    <IndianRupee className="h-5 w-5" />
                    <span className="font-medium">Price per Quintal</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{parseFloat(contract.price).toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-green-700">
                    <Scale className="h-5 w-5" />
                    <span className="font-medium">Required Quantity</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {parseFloat(contract.total_quintal_required).toLocaleString(
                      "en-IN"
                    )}{" "}
                    quintals
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please review the contract document carefully before submitting
              your application. Make sure your estimated production aligns with
              the contract requirements.
            </AlertDescription>
          </Alert>
        </div>

        {/* Application Form */}
        <Card className="lg:row-span-2">
          <CardHeader>
            <CardTitle>Submit Application</CardTitle>
            <CardDescription>
              Enter your estimated production to apply for this contract
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Your Estimated Production
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="Enter quantity"
                    value={estimateProduction}
                    onChange={(e) => setEstimateProduction(e.target.value)}
                    min="0"
                    max={contract.total_quintal_required}
                    step="0.01"
                    required
                    className="pr-16"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                    quintals
                  </span>
                </div>
                {estimateProduction && (
                  <div className="rounded-lg bg-green-50/50 p-4 space-y-1">
                    <p className="text-sm text-green-700">
                      Estimated Total Value
                    </p>
                    <p className="text-2xl font-bold text-green-700">
                      ₹{estimatedPrice().toLocaleString("en-IN")}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
