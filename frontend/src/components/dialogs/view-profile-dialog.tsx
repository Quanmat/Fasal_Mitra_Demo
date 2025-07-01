"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AuthUser } from "@/types/auth";
import {
  Building2,
  User as UserIcon,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface ViewProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: AuthUser;
}

export function ViewProfileDialog({
  isOpen,
  onClose,
  user,
}: ViewProfileDialogProps) {
  const router = useRouter();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {user.user_type === "company" ? (
              <Building2 className="h-5 w-5 text-gray-600" />
            ) : (
              <UserIcon className="h-5 w-5 text-gray-600" />
            )}
            <span>
              {user.user_type === "company"
                ? user.company_name
                : `${user.first_name} ${user.last_name}`}
            </span>
            {user.user_verified && (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={
                user.user_type === "company"
                  ? "border-purple-200 text-purple-700 bg-purple-50/50"
                  : user.user_type === "buyer"
                  ? "border-blue-200 text-blue-700 bg-blue-50/50"
                  : "border-green-200 text-green-700 bg-green-50/50"
              }
            >
              {user.user_type.charAt(0).toUpperCase() + user.user_type.slice(1)}
            </Badge>
            {user.user_verified && (
              <Badge
                variant="outline"
                className="border-green-200 text-green-700 bg-green-50/50"
              >
                Verified
              </Badge>
            )}
          </div>

          <div className="space-y-2 bg-gray-50/80 p-3 rounded-lg">
            {user.user_type === "company" ? (
              <p className="text-sm text-gray-600 line-clamp-3">
                {user.company_description || "No company description available"}
              </p>
            ) : (
              <>
                <p className="text-sm font-medium text-gray-700">
                  {user.email}
                </p>
                {user.bio && (
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {user.bio}
                  </p>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            {user.is_email_verified && (
              <Badge variant="secondary" className="text-xs">
                Email Verified
              </Badge>
            )}
            {user.is_gov_id_verified && (
              <Badge variant="secondary" className="text-xs">
                ID Verified
              </Badge>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              onClose();
              router.push(
                `/profile/${
                  user.user_type === "company" ? user.company_name : user.email
                }`
              );
            }}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View Full Profile
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
