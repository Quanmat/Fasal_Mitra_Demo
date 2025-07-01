import { GovernmentID } from "@/types/user";
import { FileCheck, FileText } from "lucide-react";

interface GovernmentIDProps {
  governmentId?: GovernmentID[];
}

export function GovernmentIDSection({ governmentId }: GovernmentIDProps) {
  if (!governmentId || governmentId.length === 0) {
    return (
      <p className="text-gray-500 italic">
        No government ID information available
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {governmentId.map((id, index) => (
        <div
          key={index}
          className="p-4 bg-white/50 rounded-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-800">{id.type_of_id} Card</h4>
            {id.is_verified ? (
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
              <FileText className="w-4 h-4 mr-2 text-green-600" />
              <span>ID Number: {id.gov_id}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
