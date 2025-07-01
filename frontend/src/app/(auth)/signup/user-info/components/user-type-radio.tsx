import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tractor, ShoppingCart, Building2 } from "lucide-react";

interface UserTypeRadioProps {
  userType: string;
  onValueChange: (value: string) => void;
  error?: string;
}

export function UserTypeRadio({
  userType,
  onValueChange,
  error,
}: UserTypeRadioProps) {
  return (
    <div>
      <Label>Select User Type *</Label>
      <RadioGroup
        value={userType}
        onValueChange={onValueChange}
        className="flex justify-between space-x-4 mt-2"
      >
        <div className="flex-1">
          <RadioGroupItem value="farmer" id="farmer" className="peer sr-only" />
          <Label
            htmlFor="farmer"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <Tractor className="mb-3 h-6 w-6" />
            Farmer
          </Label>
        </div>
        <div className="flex-1">
          <RadioGroupItem value="buyer" id="buyer" className="peer sr-only" />
          <Label
            htmlFor="buyer"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <ShoppingCart className="mb-3 h-6 w-6" />
            Buyer
          </Label>
        </div>
        <div className="flex-1">
          <RadioGroupItem
            value="company"
            id="company"
            className="peer sr-only"
          />
          <Label
            htmlFor="company"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <Building2 className="mb-3 h-6 w-6" />
            Company
          </Label>
        </div>
      </RadioGroup>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}
