"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Contract, ContractTemplate } from "@/types/contract";
import {
  getFarmerApplications,
  getContractTemplates,
  getCropListings,
} from "@/helpers/api";
import { FileText, Eye, XCircle, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CreateDisputeDialog } from "@/components/dialogs/create-dispute-dialog";
import { Crop } from "@/types/crop";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

interface ApplicationWithTemplate extends Contract {
  template?: ContractTemplate;
  crop?: Crop;
}

export default function ApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<ApplicationWithTemplate[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const [apps, templates, crops] = await Promise.all([
        getFarmerApplications(),
        getContractTemplates(),
        getCropListings(),
      ]);

      // Combine applications with their template and crop data
      const enrichedApps = apps.map((app: ApplicationWithTemplate) => {
        const template = templates.find(
          (t: ContractTemplate) => t.id === app.contract_template
        );
        return {
          ...app,
          template,
          crop: template
            ? crops.find((c: Crop) => c.id === template.crop)
            : undefined,
        };
      });

      setApplications(enrichedApps);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load applications");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge
            variant="outline"
            className="border-yellow-200 text-yellow-700 bg-yellow-50/50"
          >
            Pending
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge
            variant="outline"
            className="border-green-200 text-green-700 bg-green-50/50"
          >
            Approved
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge
            variant="outline"
            className="border-rose-200 text-rose-700 bg-rose-50/50"
          >
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">My Applications</h1>
        <p className="text-gray-600">
          Track and manage your contract applications
        </p>
      </div>

      <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contract Name</TableHead>
              <TableHead>Crop</TableHead>
              <TableHead>Estimated Production</TableHead>
              <TableHead>Estimated Value</TableHead>
              <TableHead>Applied On</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-gray-500 py-8"
                >
                  No applications found
                </TableCell>
              </TableRow>
            ) : (
              applications
                .slice(0)
                .reverse()
                .map((app) => (
                  <TableRow
                    key={app.id}
                    onClick={() =>
                      router.push(`/farmer/applications/${app.id}`)
                    }
                    className="cursor-pointer hover:bg-gray-50"
                  >
                    <TableCell className="font-medium">
                      {app.template?.contract_name || "Unknown Contract"}
                    </TableCell>
                    <TableCell>{app.crop?.name || "N/A"}</TableCell>
                    <TableCell>
                      {parseFloat(
                        app.estimate_production_in_quintal
                      ).toLocaleString("en-IN")}{" "}
                      quintals
                    </TableCell>
                    <TableCell>
                      ₹
                      {parseFloat(app.estimate_total_price).toLocaleString(
                        "en-IN"
                      )}
                    </TableCell>
                    <TableCell>
                      {format(new Date(app.created_at), "PPP")}
                    </TableCell>
                    <TableCell>{getStatusBadge(app.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 p-0"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              window.open(app.template?.contract_file, "_blank")
                            }
                            className="cursor-pointer"
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            <span>View Contract</span>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/farmer/applications/${app.id}`)
                            }
                            className="cursor-pointer"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View Details</span>
                          </DropdownMenuItem>

                          {app.status === "PENDING" && (
                            <DropdownMenuItem
                              onClick={() => {
                                toast.error("Cancel functionality coming soon");
                              }}
                              className="cursor-pointer text-red-600"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              <span>Cancel</span>
                            </DropdownMenuItem>
                          )}

                          {app.status === "APPROVED" && (
                            <CreateDisputeDialog
                              contract={app}
                              onSuccess={fetchApplications}
                              trigger={
                                <DropdownMenuItem className="cursor-pointer text-amber-600">
                                  <AlertTriangle className="mr-2 h-4 w-4" />
                                  <span>Raise Dispute</span>
                                </DropdownMenuItem>
                              }
                            />
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
