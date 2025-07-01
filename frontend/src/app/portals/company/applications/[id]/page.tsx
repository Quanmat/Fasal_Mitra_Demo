"use client";
import {
  buyerEsign,
  getContractApplicationById,
  payAdvance,
} from "@/helpers/api";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  FileText,
  Building2,
  DollarSign,
  Scale,
  FileSignature,
  Briefcase,
  FileCheck,
  Image as ImageIcon,
  CreditCard,
} from "lucide-react";
import Image from "next/image";

interface EsignResponse {
  contract: number;
  type_of: "buyer" | "seller";
  status: string;
  verification_id: string;
  reference_id: number;
  document_id: number;
  signing_link: string;
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

interface CompanyProfile {
  user: number;
  company_name: string;
  company_description: string;
  company_logo: string | null;
  created_at: string;
}

interface FarmerProfile {
  user: number;
  profile_image: string | null;
  bio: string;
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
  buyer_profile: any | null;
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

interface Application {
  contract: {
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
    order: {
      payments: Payment[];
    };
  };
  order: {
    payments: Payment[];
  };
}

const Page = () => {
  const { id } = useParams();
  const [application, setApplication] = React.useState<Application | null>(
    null
  );
  const router = useRouter();
  const [paymentDone, setPaymentDone] = React.useState(false);

  React.useEffect(() => {
    const fetchApplication = async () => {
      const data = await getContractApplicationById(id as string);
      setApplication(data);
    };

    if (id) {
      fetchApplication();
    }
  }, [id]);

  const esignDocument = async () => {
    try {
      const esignObj = await buyerEsign(id as string);
      if (esignObj?.signing_link) {
        const newWindow = window.open(esignObj.signing_link, "_blank");
        if (newWindow) newWindow.focus();
      }
    } catch (error) {
      console.error("Error in e-signing:", error);
    }
  };

  application?.order?.payments?.forEach((payment: Payment) => {
    console.log("Payment: ", payment);
    if (payment.stage == "advance" && payment.status == "captured") {
      setPaymentDone(true);
    }
  });

  const startAdvancePayment = async () => {
    router.push(`/payments/${id}/advance`);
  };

  const hasCompletedPayment = () => {
    const payments = application?.contract?.order?.payments || [];
    return payments.some(
      (payment) => payment.stage === "advance" && payment.status === "captured"
    );
  };

  const renderProfileDetails = (user: User) => {
    const details = [];

    // Basic user details
    if (user.email) {
      details.push(
        <div className="flex items-center text-gray-600">
          <Mail className="h-4 w-4 text-green-600 mr-2" />
          <span>{user.email}</span>
        </div>
      );
    }

    if (user.first_name || user.last_name) {
      details.push(
        <div className="flex items-center text-gray-600">
          <User className="h-4 w-4 text-green-600 mr-2" />
          <span>
            {[user.first_name, user.last_name].filter(Boolean).join(" ")}
          </span>
        </div>
      );
    }

    if (user.user_type) {
      details.push(
        <div className="flex items-center text-gray-600">
          <Briefcase className="h-4 w-4 text-green-600 mr-2" />
          <span className="capitalize">{user.user_type}</span>
        </div>
      );
    }

    // Company profile details
    if (user.company_profile) {
      if (user.company_profile.company_name) {
        details.push(
          <div className="flex items-center text-gray-600">
            <Building2 className="h-4 w-4 text-green-600 mr-2" />
            <span>{user.company_profile.company_name}</span>
          </div>
        );
      }

      if (user.company_profile.company_description) {
        details.push(
          <div key="company-desc" className="flex items-center text-gray-600">
            <FileText className="h-4 w-4 text-green-600 mr-2" />
            <span>{user.company_profile.company_description}</span>
          </div>
        );
      }
    }

    // Farmer profile details
    if (user.farmer_profile) {
      if (user.farmer_profile.bio) {
        details.push(
          <div key="farmer-bio" className="flex items-center text-gray-600">
            <FileText className="h-4 w-4 text-green-600 mr-2" />
            <span>{user.farmer_profile.bio}</span>
          </div>
        );
      }
    }

    // Buyer profile details
    if (user.buyer_profile) {
      if (user.buyer_profile.bio) {
        details.push(
          <div key="buyer-bio" className="flex items-center text-gray-600">
            <FileText className="h-4 w-4 text-green-600 mr-2" />
            <span>{user.buyer_profile.bio}</span>
          </div>
        );
      }
    }

    // Verification status
    details.push(
      <div key="verification" className="flex items-center text-gray-600">
        {user.user_verified ? (
          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
        ) : (
          <XCircle className="h-4 w-4 text-red-500 mr-2" />
        )}
        <span>{user.user_verified ? "Verified User" : "Not Verified"}</span>
      </div>
    );

    return details;
  };

  if (!application) {
    return (
      <div className="min-h-screen bg-background">
        <div className="h-full w-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  const sortedPayments = [...(application.contract.order?.payments || [])].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const renderActionButtons = () => {
    const paymentCompleted = hasCompletedPayment();
    const { buyer_signed } = application?.contract || {};

    if (!paymentCompleted) {
      return (
        <div className="flex justify-center">
          <button
            onClick={startAdvancePayment}
            className="px-6 py-3 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 shadow-sm hover:shadow-md"
          >
            <CreditCard className="w-5 h-5" />
            Accept and Pay Advance
          </button>
        </div>
      );
    }

    if (paymentCompleted && !buyer_signed) {
      return (
        <div className="flex flex-col items-center gap-4">
          <p className="text-green-600 font-medium text-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Payment Complete
          </p>
          <button
            onClick={esignDocument}
            className="px-6 py-3 bg-green-500 text-white text-lg font-semibold rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 shadow-sm hover:shadow-md"
          >
            <FileSignature className="w-5 h-5" />
            Sign Document
          </button>
        </div>
      );
    }

    return (
      <p className="text-green-600 font-medium text-lg flex items-center gap-2">
        <CheckCircle className="w-5 h-5" />
        Contract Done
      </p>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-8 w-8 text-green-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    Contract Application Details
                  </h1>
                  <p className="text-gray-600">
                    Contract ID: {application.contract.id}
                  </p>
                </div>
              </div>
              <Badge
                variant="outline"
                className={
                  application.contract.status === "PENDING"
                    ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                    : "bg-green-50 text-green-700 border-green-200"
                }
              >
                {application.contract.status}
              </Badge>
            </div>
          </div>

          {/* Main Content */}
          <Card className="bg-white/50 backdrop-blur-sm shadow-sm border-0">
            <CardHeader className="border-b bg-white/50">
              <div className="flex items-center space-x-2">
                <Building2 className="h-6 w-6 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Contract Information
                </h2>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Buyer Details */}
                <div className="space-y-4">
                  <div className="rounded-lg bg-white/50 backdrop-blur-sm border border-gray-100 shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <User className="h-5 w-5 text-green-600 mr-2" />
                      Buyer Details
                    </h3>
                    <div className="space-y-3">
                      {renderProfileDetails(application.contract.buyer)}
                    </div>
                  </div>
                </div>

                {/* Seller Details */}
                <div className="space-y-4">
                  <div className="rounded-lg bg-white/50 backdrop-blur-sm border border-gray-100 shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <User className="h-5 w-5 text-green-600 mr-2" />
                      Seller Details
                    </h3>
                    <div className="space-y-3">
                      {renderProfileDetails(application.contract.seller)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contract Details */}
              <div className="rounded-lg bg-white/50 backdrop-blur-sm border border-gray-100 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FileText className="h-5 w-5 text-green-600 mr-2" />
                  Contract Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 text-green-600 mr-2" />
                      <span>
                        Created:{" "}
                        {new Date(
                          application.contract.created_at
                        ).toLocaleString()}
                      </span>
                    </div>
                    {application.contract.estimate_production_in_quintal && (
                      <div className="flex items-center text-gray-600">
                        <Scale className="h-4 w-4 text-green-600 mr-2" />
                        <span>
                          Production:{" "}
                          {application.contract.estimate_production_in_quintal}{" "}
                          Quintal
                        </span>
                      </div>
                    )}
                    {application.contract.estimate_total_price && (
                      <div className="flex items-center text-gray-600">
                        <DollarSign className="h-4 w-4 text-green-600 mr-2" />
                        <span>
                          Price: ₹{application.contract.estimate_total_price}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <FileSignature className="h-4 w-4 text-green-600 mr-2" />
                      <span>
                        Buyer Signed:{" "}
                        {application.contract.buyer_signed ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FileSignature className="h-4 w-4 text-green-600 mr-2" />
                      <span>
                        Seller Signed:{" "}
                        {application.contract.seller_signed ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span>Status: {application.contract.status}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              {application.contract.order && (
                <div>
                  {application.contract.order.payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="rounded-lg bg-white/50 backdrop-blur-sm border border-gray-100 shadow-sm p-6"
                    >
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <CreditCard className="h-5 w-5 text-green-600 mr-2" />
                        Payments Details
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center text-gray-600">
                          <span>Order ID: {payment.id}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <span>
                            Amount: ₹{payment.amount} - {payment.stage}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <span>Status: {payment.status}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <span>
                            Created:{" "}
                            {new Date(payment.created_at).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Payment History */}
              {application.order?.payments &&
                application.order?.payments?.length > 0 && (
                  <div className="rounded-lg bg-white/50 backdrop-blur-sm border border-gray-100 shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-green-600" />
                      Payment History
                    </h3>
                    <div className="space-y-3">
                      {application.order!.payments!.map((payment) => (
                        <div
                          key={payment.id}
                          className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-gray-100/50"
                        >
                          <div className="flex items-center gap-3">
                            <Badge
                              variant="outline"
                              className={
                                payment.status === "captured"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-yellow-50 text-yellow-700 border-yellow-200"
                              }
                            >
                              {payment.status}
                            </Badge>
                            <span className="text-gray-600">
                              ₹{payment.amount}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(payment.created_at).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 shadow-sm">
            {renderActionButtons()}
            {!paymentDone ? (
              <div className="flex justify-center">
                <button
                  onClick={startAdvancePayment}
                  className="px-6 py-3 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 shadow-sm hover:shadow-md"
                >
                  <CreditCard className="w-5 h-5" />
                  Accept and Pay Advance
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                {!application.contract.buyer_signed ? (
                  <>
                    <p className="text-green-600 font-medium text-lg flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Payment Complete
                    </p>
                    <button
                      onClick={esignDocument}
                      className="px-6 py-3 bg-green-500 text-white text-lg font-semibold rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 shadow-sm hover:shadow-md"
                    >
                      <FileSignature className="w-5 h-5" />
                      Sign Document
                    </button>
                  </>
                ) : (
                  <p className="text-green-600 font-medium text-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Contract Done
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
