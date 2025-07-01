import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Contract, ContractTemplate } from "@/types/contract";
import {
  Package,
  FileText,
  IndianRupee,
  Scale,
  Sprout,
  Building2,
  UserIcon,
  CheckCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Crop } from "@/types/crop";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ViewProfileDialog } from "@/components/dialogs/view-profile-dialog";
import { useState } from "react";
import { User } from "@/types/user";
import { AuthUser } from "@/types/auth";

interface FarmerContractCardProps {
  contract: ContractTemplate;
  applicationStatus?: Contract;
  cropData?: Crop;
}

interface IconProps {
  className?: string;
}

export const FarmerContractCard = ({
  contract,
  applicationStatus,
  cropData,
}: FarmerContractCardProps) => {
  const router = useRouter();
  const [showProfile, setShowProfile] = useState(false);

  const creatorName =
    contract.submitted_by.user_type === "company"
      ? contract.submitted_by.company_name
      : `${contract.submitted_by.first_name} ${contract.submitted_by.last_name}`;

  const DetailItem = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: React.ComponentType<IconProps>;
    label: string;
    value: string;
  }) => (
    <div className="space-y-1">
      <p className="text-xs text-gray-500 flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {label}
      </p>
      <p className="text-sm font-medium text-gray-700">{value}</p>
    </div>
  );

  const isVerified = (user: User) => {
    switch (user.user_type) {
      case "farmer":
        return user.landInfo?.some((land) => land.is_verified);
      case "company":
        return (
          user.gstInfo?.some((gst) => gst.is_verified) ||
          user.governmentId?.some((id) => id.is_verified)
        );
      case "buyer":
        return user.governmentId?.some((id) => id.is_verified);
      default:
        return false;
    }
  };

  return (
    <>
      <Card className="overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all group">
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2 min-w-0">
                <Package className="h-5 w-5 text-green-600 transition-transform duration-300 group-hover:scale-110 flex-shrink-0" />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <CardTitle className="text-lg font-semibold text-gray-800 truncate">
                        {contract.contract_name}
                      </CardTitle>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{contract.contract_name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center gap-2">
                <Sprout className="h-4 w-4 text-green-600 transition-transform duration-300 group-hover:scale-110 flex-shrink-0" />
                <span className="text-sm text-green-700 font-medium truncate">
                  {cropData?.name || "Crop"}
                </span>
                {cropData && (
                  <Badge
                    variant="outline"
                    className="ml-2 text-xs border-green-200 text-green-700 bg-green-50/50 flex-shrink-0"
                  >
                    {cropData.crop_type.toUpperCase()}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="text-xs border-gray-200 text-gray-700 bg-gray-50/50 hover:bg-gray-100/50 cursor-pointer transition-all flex items-center gap-1.5"
                  onClick={() => setShowProfile(true)}
                >
                  {contract.submitted_by.user_type === "company" ? (
                    <Building2 className="h-3 w-3" />
                  ) : (
                    <UserIcon className="h-3 w-3" />
                  )}
                  {creatorName}
                  {isVerified(contract.submitted_by) && (
                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                  )}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                {contract.contract_description}
              </p>
            </div>
            <div className="flex-shrink-0">
              {applicationStatus ? (
                <Badge
                  variant="outline"
                  className={
                    applicationStatus.status === "PENDING"
                      ? "border-yellow-200 text-yellow-700 bg-yellow-50/50"
                      : applicationStatus.status === "APPROVED"
                      ? "border-green-200 text-green-700 bg-green-50/50"
                      : "border-rose-200 text-rose-700 bg-rose-50/50"
                  }
                >
                  {applicationStatus.status}
                </Badge>
              ) : (
                <Badge className="bg-green-100/80 text-green-700">
                  Available
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Contract Details */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-green-50/50 rounded-lg">
              <DetailItem
                icon={IndianRupee}
                label="Price per Quintal"
                value={`₹${parseFloat(contract.price).toLocaleString("en-IN")}`}
              />
              <DetailItem
                icon={Scale}
                label="Required Quantity"
                value={`${parseFloat(
                  contract.total_quintal_required
                ).toLocaleString("en-IN")} quintals`}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 border-green-200 text-green-700 hover:bg-green-50/50"
                onClick={() => window.open(contract.contract_file, "_blank")}
              >
                <FileText className="h-4 w-4 mr-2" />
                View Document
              </Button>
              {!applicationStatus ? (
                <Button
                  className="flex-1 bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white shadow-lg transition-all duration-300 group"
                  onClick={() =>
                    router.push(`/farmer/contracts/${contract.id}/apply`)
                  }
                >
                  Apply Now
                </Button>
              ) : (
                <Button
                  className="flex-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 shadow-lg transition-all duration-300 group"
                  variant="outline"
                  onClick={() =>
                    router.push(`/farmer/contracts/${contract.id}/apply`)
                  }
                >
                  Apply Again
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <ViewProfileDialog
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        user={contract.submitted_by as AuthUser}
      />
    </>
  );
};
