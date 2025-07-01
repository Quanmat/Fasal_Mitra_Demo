import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

export const EmptyState = ({
  onCreateContract,
}: {
  onCreateContract: () => void;
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4">
      <Package className="h-16 w-16 text-green-600/50" />
      <p className="text-gray-600 text-lg">No contracts available yet</p>
      <Button
        variant="outline"
        className="border-green-200 text-green-700 hover:bg-green-50/50"
        onClick={onCreateContract}
      >
        Create Your First Contract
      </Button>
    </div>
  );
};
