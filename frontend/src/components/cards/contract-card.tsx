"use client";

import { ContractTemplate } from "@/types/contract";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { FileText } from "lucide-react";
import { useState } from "react";
import { ViewProfileDialog } from "../dialogs/view-profile-dialog";
import { format } from "date-fns";
import { AuthUser } from "@/types/auth";

interface ContractCardProps {
  contract: ContractTemplate;
  onApply: (id: number) => void;
}

export function ContractCard({ contract, onApply }: ContractCardProps) {
  const [showProfile, setShowProfile] = useState(false);

  const creatorName =
    contract.submitted_by.user_type === "company"
      ? contract.submitted_by.company_name
      : `${contract.submitted_by.first_name} ${contract.submitted_by.last_name}`;

  return (
    <>
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="space-y-1">
            <h3 className="text-xl font-semibold text-gray-900">
              {contract.contract_name}
            </h3>
            <p
              className="text-sm text-gray-600 hover:text-green-600 cursor-pointer transition-colors"
              onClick={() => setShowProfile(true)}
            >
              Created by: {creatorName}
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            {contract.contract_description}
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Price per Quintal
              </p>
              <p className="mt-1 text-sm">
                ₹{parseFloat(contract.price).toLocaleString("en-IN")}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Required Quantity
              </p>
              <p className="mt-1 text-sm">
                {parseFloat(contract.total_quintal_required).toLocaleString(
                  "en-IN"
                )}{" "}
                quintals
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Created On</p>
              <p className="mt-1 text-sm">
                {format(new Date(contract.created_at), "PPP")}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            size="sm"
            className="text-gray-600"
            onClick={() => window.open(contract.contract_file, "_blank")}
          >
            <FileText className="mr-2 h-4 w-4" />
            View Contract
          </Button>
          <Button size="sm" onClick={() => onApply(contract.id)}>
            Apply Now
          </Button>
        </CardFooter>
      </Card>

      <ViewProfileDialog
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        user={contract.submitted_by as AuthUser}
      />
    </>
  );
}
