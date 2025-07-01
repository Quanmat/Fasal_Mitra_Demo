"use client";
import { getContractById } from "@/helpers/api";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  User,
  FileText,
  CheckCircle,
  Building2,
  Mail,
  FileCheck,
} from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface FarmerProfile {
  user: number;
  profile_image: string | null;
  bio: string;
}

interface CompanyProfile {
  company_name: string;
}

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  user_type: string;
  user_verified: boolean;
  farmer_profile: FarmerProfile | null;
  company_profile: CompanyProfile | null;
  buyer_profile: Record<string, unknown> | null;
}

interface EsignResponse {
  contract: number;
  type_of: string;
  status: string;
  verification_id: string;
  reference_id: number;
  document_id: number;
  signing_link: string;
}

interface Order {
  id: string;
  contract: number;
  amount: string;
  currency: string;
  receipt: string;
  status: string;
  created_at: string;
  payments: Payment[];
}

interface Payment {
  id: number;
  payment_id: string;
  stage: string;
  status: string;
  method: string | null;
  amount: string;
  email: string;
  contact: string;
  created_at: string;
  order: string;
}

interface Contract {
  id: number;
  contract_template: number;
  buyer: User;
  seller: User;
  created_at: string;
  approved: boolean;
  status: string;
  signed_contract: string | null;
  estimate_production_in_quintal: string;
  estimate_total_price: string;
  buyer_signed: boolean;
  seller_signed: boolean;
  esign_responses: EsignResponse[];
  order: Order;
}

interface EsignStatus {
  status: string;
  reference_id: number;
  verification_id: string;
  document_id: number;
  signers: {
    name: string;
    status: string;
    is_notified: boolean;
  }[];
  signed_doc_url: string;
}

interface ContractData {
  contract: Contract;
  esign_status: EsignStatus;
  order: Order;
}

const Page = () => {
  const { contract_id } = useParams();
  const [contract, setContract] = React.useState<ContractData | null>(null);

  React.useEffect(() => {
    const fetchContract = async () => {
      const data = await getContractById(contract_id as string);
      console.log("Data: ", data);
      setContract(data);
    };
    fetchContract();
  }, [contract_id]);

  if (!contract) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-green-800">
          Contract Details
        </h1>
        <p className="text-green-700/80 mt-2">
          Contract ID: {contract.contract.id}
        </p>
      </div>

      <Card className="overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-xl">
        <CardHeader className="border-b bg-gradient-to-r from-white/50 to-white/30 pb-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold text-gray-800">
                Contract Overview
              </h2>
              <p className="text-sm text-gray-500">
                Created on{" "}
                {new Date(contract.contract.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  contract.contract.status === "PENDING" ? "outline" : "default"
                }
                className={`capitalize ${
                  contract.contract.status === "PENDING"
                    ? "border-yellow-500 text-yellow-700"
                    : "bg-green-100 text-green-800 hover:bg-green-200"
                }`}
              >
                {contract.contract.status}
              </Badge>
              {contract.contract.approved && (
                <Badge
                  variant="default"
                  className="flex items-center gap-1 bg-green-100 text-green-800 hover:bg-green-200"
                >
                  <CheckCircle className="h-4 w-4" />
                  Approved
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Contract Details */}
          <div className="rounded-lg bg-gradient-to-r from-white/80 to-white/50 border border-gray-100 shadow-sm p-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-800 mb-4 flex items-center">
                  <FileText className="h-5 w-5 text-green-600 mr-2" />
                  Production Details
                </h3>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <span className="text-sm text-gray-500">
                      Estimated Production
                    </span>
                    <p className="text-lg font-semibold text-gray-900">
                      {contract.contract.estimate_production_in_quintal} Quintal
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-gray-500">
                      Estimated Price
                    </span>
                    <p className="text-lg font-semibold text-green-600">
                      ₹{contract.contract.estimate_total_price}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-800 mb-4 flex items-center">
                  <FileCheck className="h-5 w-5 text-green-600 mr-2" />
                  Signature Status
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Buyer</span>
                    <Badge
                      variant={
                        contract.contract.buyer_signed ? "default" : "secondary"
                      }
                      className={
                        contract.contract.buyer_signed
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                      }
                    >
                      {contract.contract.buyer_signed ? "Signed" : "Pending"}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Seller</span>
                    <Badge
                      variant={
                        contract.contract.seller_signed
                          ? "default"
                          : "secondary"
                      }
                      className={
                        contract.contract.seller_signed
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                      }
                    >
                      {contract.contract.seller_signed ? "Signed" : "Pending"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Parties Information */}
          <div className="grid grid-cols-2 gap-6">
            {/* Buyer Card */}
            <div className="rounded-lg bg-gradient-to-r from-white/80 to-white/50 border border-gray-100 shadow-sm p-6">
              <h3 className="font-medium text-gray-800 mb-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Building2 className="h-5 w-5 text-green-600 mr-2" />
                  Buyer Details
                </div>
                {contract.contract.buyer &&
                  contract.contract.buyer.user_verified && (
                    <Badge variant="outline" className="text-green-600">
                      Verified
                    </Badge>
                  )}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <User className="h-4 w-4 text-green-600 mr-2" />
                  <span>
                    {contract.contract.buyer &&
                      `${contract.contract.buyer.first_name} ${contract.contract.buyer.last_name}`}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 text-green-600 mr-2" />
                  <span>
                    {contract.contract.buyer && contract.contract.buyer.email}
                  </span>
                </div>
                {contract.contract.buyer?.company_profile?.company_name && (
                  <div className="flex items-center text-gray-600">
                    <Building2 className="h-4 w-4 text-green-600 mr-2" />
                    <span>
                      {contract.contract.buyer.company_profile.company_name}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Seller Card */}
            <div className="rounded-lg bg-gradient-to-r from-white/80 to-white/50 border border-gray-100 shadow-sm p-6">
              <h3 className="font-medium text-gray-800 mb-4 flex items-center justify-between">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-green-600 mr-2" />
                  Seller Details
                </div>
                {contract.contract.seller &&
                  contract.contract.seller.user_verified && (
                    <Badge variant="outline" className="text-green-600">
                      Verified
                    </Badge>
                  )}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <User className="h-4 w-4 text-green-600 mr-2" />
                  <span>
                    {contract.contract.seller &&
                      `${contract.contract.seller.first_name} ${contract.contract.seller.last_name}`}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 text-green-600 mr-2" />
                  <span>
                    {contract.contract.seller && contract.contract.seller.email}
                  </span>
                </div>
                {contract.contract.seller?.farmer_profile?.bio && (
                  <div className="flex items-center text-gray-600">
                    <FileText className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm text-gray-500">
                      {contract.contract.seller.farmer_profile.bio}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contract Document */}
          {contract.contract.signed_contract && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white border-0"
                onClick={() =>
                  window.open(contract.contract.signed_contract!, "_blank")
                }
              >
                <FileText className="h-4 w-4 mr-2" />
                View Contract Document
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
