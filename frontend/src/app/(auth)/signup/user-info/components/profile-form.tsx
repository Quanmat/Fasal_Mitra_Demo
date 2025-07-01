import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileFormProps {
  firstName: string;
  lastName: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: {
    firstName?: string;
    lastName?: string;
  };
}

export function ProfileForm({
  firstName,
  lastName,
  onChange,
  errors = {},
}: ProfileFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            name="firstName"
            value={firstName}
            onChange={onChange}
            placeholder="Enter your first name"
            className={errors.firstName ? "border-red-500" : ""}
            required
          />
          {errors.firstName && (
            <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
          )}
        </div>
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            name="lastName"
            value={lastName}
            onChange={onChange}
            placeholder="Enter your last name"
            className={errors.lastName ? "border-red-500" : ""}
            required
          />
          {errors.lastName && (
            <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
          )}
        </div>
      </div>
    </div>
  );
}
