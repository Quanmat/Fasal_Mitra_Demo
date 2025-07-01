import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPinIcon, Upload } from "lucide-react";

interface FarmerFormProps {
  info: {
    landArea: string;
    landUnit: string;
    landLocation: string;
    landDistrict: string;
    landState: string;
  };
  file: File | null;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  convertToAcres: (value: string, fromUnit: string) => string;
}

export function FarmerForm({
  info,
  file,
  handleInputChange,
  handleFileChange,
  convertToAcres,
}: FarmerFormProps) {
  return (
    <div className="grid gap-6">
      {/* Land Area Section */}
      <div className="space-y-2">
        <Label htmlFor="land-area">Land Area *</Label>
        <div className="relative">
          <div className="grid grid-cols-4 gap-2">
            <div className="relative col-span-3">
              <Input
                id="land-area"
                name="landArea"
                type="number"
                value={info.landArea}
                onChange={handleInputChange}
                placeholder="Enter land area"
                min="0"
                step="0.01"
                className="pr-24 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              {info.landUnit !== "acre" && info.landArea && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                  ≈ {convertToAcres(info.landArea, info.landUnit)} ac
                </div>
              )}
            </div>
            <select
              name="landUnit"
              value={info.landUnit}
              onChange={handleInputChange}
              className="rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="acre">Acres</option>
              <option value="hectare">Hectares</option>
              <option value="sqm">Sq. m</option>
              <option value="sqft">Sq. ft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Land Location Section */}
      <div className="space-y-2">
        <Label htmlFor="land-location">Land Location *</Label>
        <div className="grid gap-2">
          <div className="relative">
            <Input
              id="land-location-village"
              name="landLocation"
              type="text"
              value={info.landLocation}
              onChange={handleInputChange}
              placeholder="Village/Town"
              className="pl-10"
            />
            <MapPinIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input
              id="land-location-district"
              name="landDistrict"
              type="text"
              value={info.landDistrict}
              onChange={handleInputChange}
              placeholder="District"
            />
            <Input
              id="land-location-state"
              name="landState"
              type="text"
              value={info.landState}
              onChange={handleInputChange}
              placeholder="State"
            />
          </div>
          <p className="text-sm text-gray-500">
            Please provide complete location details of your agricultural land
          </p>
        </div>
      </div>

      {/* Land Certificate Section */}
      <div className="space-y-2">
        <Label htmlFor="land-certificate">Land Certificate *</Label>
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="land-certificate"
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
              id="land-certificate"
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
