import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard } from "lucide-react";

interface BuyerFormProps {
  info: {
    panNumber: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function BuyerForm({ info, handleInputChange }: BuyerFormProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="pan-number">PAN Number *</Label>
      <div className="relative">
        <Input
          id="pan-number"
          name="panNumber"
          type="text"
          value={info.panNumber}
          onChange={(e) => {
            const value = e.target.value.toUpperCase();
            if (value.length <= 10) {
              handleInputChange(e);
            }
          }}
          placeholder="Enter PAN number"
          className="pr-10"
          maxLength={10}
        />
        <CreditCard className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>
    </div>
  );
}
