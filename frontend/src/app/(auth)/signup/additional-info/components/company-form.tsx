import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building, Upload, CreditCard } from "lucide-react";

interface CompanyFormProps {
  info: {
    gstNumber: string;
    panNumber: string;
  };
  file: File | null;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CompanyForm({
  info,
  file,
  handleInputChange,
  handleFileChange,
}: CompanyFormProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="gst-number">GST Number *</Label>
        <div className="relative">
          <Input
            id="gst-number"
            name="gstNumber"
            type="text"
            value={info.gstNumber}
            onChange={(e) => {
              const value = e.target.value.toUpperCase();
              if (value.length <= 15) {
                handleInputChange(e);
              }
            }}
            placeholder="Enter GST number"
            className="pr-10"
            maxLength={15}
          />
          <Building className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

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
      <div className="space-y-2">
        <Label htmlFor="gst-certificate">GST Certificate *</Label>
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="gst-certificate"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {file ? (
                <>
                  <Upload className="w-8 h-8 mb-2 text-green-500" />
                  <p className="text-sm text-gray-600">{file.name}</p>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 mb-2 text-gray-500" />
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG or PDF (MAX. 5MB)
                  </p>
                </>
              )}
            </div>
            <Input
              id="gst-certificate"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.pdf"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
