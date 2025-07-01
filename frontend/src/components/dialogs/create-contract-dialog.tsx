"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

interface CreateContractDialogProps {
  trigger: React.ReactNode;
  onSuccess?: () => void;
}

export function CreateContractDialog({ trigger }: CreateContractDialogProps) {
  const router = useRouter();

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Contract</DialogTitle>
          <DialogDescription>
            Would you like to create a new contract template?
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <p className="text-sm text-gray-600">
            You&apos;ll be redirected to a form where you can:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
            <li>Set contract details</li>
            <li>Define pricing and quantities</li>
            <li>Upload contract documents</li>
          </ul>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => router.push("/buyer/create")}
            className="w-full"
          >
            Continue to Form
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
