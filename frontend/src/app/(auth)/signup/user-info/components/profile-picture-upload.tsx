import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

interface ProfilePictureUploadProps {
  profilePicture: File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  label?: string;
}

export function ProfilePictureUpload({
  profilePicture,
  onChange,
  error,
  label = "Profile Picture",
}: ProfilePictureUploadProps) {
  return (
    <div>
      <Label htmlFor={label}>{label}</Label>
      <div className="flex items-center space-x-4">
        <Input
          id={label}
          type="file"
          onChange={onChange}
          className="hidden"
          accept="image/*"
        />
        <Label
          htmlFor={label}
          className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-full cursor-pointer hover:border-gray-400 transition-colors"
        >
          {profilePicture ? (
            <img
              src={URL.createObjectURL(profilePicture)}
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <Upload className="h-8 w-8 text-gray-400" />
          )}
        </Label>
        <span className="text-sm text-gray-500">
          {profilePicture
            ? profilePicture.name
            : "Upload a profile picture (max 5MB)"}
        </span>
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}
