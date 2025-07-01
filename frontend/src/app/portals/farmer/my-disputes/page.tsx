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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDisputes } from "@/helpers/api";
import { format } from "date-fns";
import { Eye, Loader2, AlertCircle, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Dispute {
  id: number;
  contract: number;
  description: string;
  status: "pending" | "resolved" | "rejected";
  admin_comment: string | null;
  created_at: string;
}

export default function MyDisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        const data = await getDisputes();
        if (data) {
          setDisputes(data);
        }
      } catch (error) {
        console.error("Failed to fetch disputes:", error);
        setError("Failed to load disputes. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDisputes();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="border-yellow-200 text-yellow-700 bg-yellow-50/50"
          >
            Pending
          </Badge>
        );
      case "resolved":
        return (
          <Badge
            variant="outline"
            className="border-green-200 text-green-700 bg-green-50/50"
          >
            Resolved
          </Badge>
        );
      case "rejected":
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
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-green-800">
          My Disputes
        </h1>
      </div>

      {error ? (
        <Alert
          variant="destructive"
          className="bg-red-50/50 text-red-800 border-red-200"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dispute ID</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Admin Response</TableHead>
                <TableHead>Created On</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {disputes.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-gray-500 py-8"
                  >
                    No disputes found
                  </TableCell>
                </TableRow>
              ) : (
                disputes.map((dispute) => (
                  <TableRow key={dispute.id}>
                    <TableCell className="font-medium">#{dispute.id}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {dispute.description}
                    </TableCell>
                    <TableCell>{getStatusBadge(dispute.status)}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {dispute.admin_comment || "No response yet"}
                    </TableCell>
                    <TableCell>
                      {format(new Date(dispute.created_at), "PPP")}
                    </TableCell>
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
                              router.push(`/farmer/my-disputes/${dispute.id}`)
                            }
                            className="cursor-pointer"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
