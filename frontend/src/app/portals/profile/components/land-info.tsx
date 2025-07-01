import { FileCheck, FileText, MapPin } from "lucide-react";

interface LandInfo {
  land_area: number;
  land_location: string;
  document_image: string;
  submitted_at: string;
  is_verified: boolean;
}

interface LandInfoProps {
  landInfo?: LandInfo[];
}

export function LandInfoSection({ landInfo }: LandInfoProps) {
  if (!landInfo || landInfo.length === 0) {
    return (
      <p className="text-gray-500 italic">No land information available</p>
    );
  }

  return (
    <div className="space-y-4">
      {landInfo.map((land, index) => (
        <div
          key={index}
          className="p-4 bg-white/50 rounded-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-800">Land Plot {index + 1}</h4>
            {land.is_verified ? (
              <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full flex items-center">
                <FileCheck className="w-3 h-3 mr-1" />
                Verified
              </span>
            ) : (
              <span className="px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full">
                Pending Verification
              </span>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2 text-green-600" />
              <span>{land.land_location}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <FileText className="w-4 h-4 mr-2 text-green-600" />
              <span>{land.land_area} acres</span>
            </div>
            {land.document_image && (
              <div className="mt-2">
                <a
                  href={land.document_image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <FileText className="w-4 h-4 mr-1" />
                  View Document
                </a>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
