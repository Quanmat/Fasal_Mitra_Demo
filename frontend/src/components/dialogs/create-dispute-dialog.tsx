"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { createDispute } from "@/helpers/api";
import { toast } from "sonner";
import { Contract } from "@/types/contract";
import { LoadingSpinner } from "../ui/loading-spinner";
import { CreateDisputeRequest } from "@/types/dispute";

interface CreateDisputeDialogProps {
  contract: Contract;
  onSuccess?: () => void;
  trigger: React.ReactNode;
}

export function CreateDisputeDialog({
  contract,
  onSuccess,
  trigger,
}: CreateDisputeDialogProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!description.trim()) {
      setError("Please provide a description for the dispute");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create the dispute payload according to API requirements
      const disputeData: CreateDisputeRequest = {
        contract: contract.id,
        description: description.trim(),
      };

      const response = await createDispute(disputeData);

      if (response) {
        toast.success("Dispute raised successfully");
        setIsOpen(false);
        onSuccess?.();
      } else {
        setError("Failed to raise dispute. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while raising the dispute");
      console.error("Dispute creation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Raise a Dispute</DialogTitle>
          <DialogDescription>
            Please provide details about your dispute. Be clear and specific
            about the issue.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Textarea
              id="description"
              placeholder="Describe your dispute..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-32"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white"
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Raising Dispute...
              </>
            ) : (
              "Raise Dispute"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
