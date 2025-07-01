"use client";
import { getContractApplications } from "@/helpers/api";
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  FileText,
  IndianRupee,
  Scale,
  ArrowRight,
} from "lucide-react";

interface Application {
  id: number;
  status: string;
  buyer: {
    first_name: string;
    last_name: string;
  };
  seller: {
    first_name: string;
    last_name: string;
  };
  estimate_production_in_quintal: number;
  estimate_total_price: number;
}

const Page = () => {
  const [applications, setApplications] = React.useState<Application[]>([]);

  React.useEffect(() => {
    const fetchApplications = async () => {
      const data = await getContractApplications();
      setApplications(data.reverse());
    };

    fetchApplications();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-green-800">
          Contract Applications
        </h1>
        <p className="text-green-700/80 mt-2">
          View and manage your contract applications
        </p>
      </div>

      <div className="grid gap-6">
        {applications.map((application) => (
          <Link
            key={application.id}
            href={`/company/applications/${application.id}`}
            className="block transition-all duration-300 hover:scale-[1.01]"
          >
            <Card className="overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader className="border-b bg-gradient-to-r from-white/50 to-white/30 pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-gradient-to-r from-sky-50 to-blue-50 rounded-full border border-blue-100">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        Contract Application #{application.id}
                      </h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {application.buyer.first_name}{" "}
                        {application.buyer.last_name}{" "}
                        <span className="text-gray-400 mx-2">→</span>
                        {application.seller.first_name}{" "}
                        {application.seller.last_name}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      application.status === "PENDING" ? "outline" : "default"
                    }
                    className={`capitalize ${
                      application.status === "PENDING"
                        ? "border-yellow-500 text-yellow-700 bg-yellow-50"
                        : "bg-green-100 text-green-800 hover:bg-green-200"
                    }`}
                  >
                    {application.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="space-y-1.5">
                    <span className="text-sm text-gray-500 flex items-center">
                      <Scale className="h-4 w-4 text-green-600 mr-2" />
                      Production
                    </span>
                    <p className="font-semibold text-gray-900">
                      {application.estimate_production_in_quintal} Quintal
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-sm text-gray-500 flex items-center">
                      <IndianRupee className="h-4 w-4 text-green-600 mr-2" />
                      Estimated Price
                    </span>
                    <p className="font-semibold text-green-600">
                      ₹{application.estimate_total_price}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <div className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {applications.length === 0 && (
        <Card className="py-12 border-0 bg-white/80 backdrop-blur-sm">
          <div className="text-center">
            <div className="rounded-full bg-gray-50 p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <FileText className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              No Applications Yet
            </h3>
            <p className="mt-1 text-gray-500">
              Contract applications will appear here
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Page;
