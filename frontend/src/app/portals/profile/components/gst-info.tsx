import { GSTInfo } from "@/types/user";
import { FileCheck, FileText } from "lucide-react";

interface GSTInfoProps {
  gstInfo?: GSTInfo[];
}

export function GSTInfoSection({ gstInfo }: GSTInfoProps) {
  if (!gstInfo || gstInfo.length === 0) {
    return <p className="text-gray-500 italic">No GST information available</p>;
  }

  return (
    <div className="space-y-4">
      {gstInfo.map((info, index) => (
        <div
          key={index}
          className="p-4 bg-white/50 rounded-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-800">GST Certificate</h4>
            {info.is_verified ? (
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
              <span>GST Number: {info.gst_number}</span>
            </div>
            {info.gst_certificate && (
              <div className="mt-2">
                <a
                  href={info.gst_certificate}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <FileText className="w-4 h-4 mr-1" />
                  View Certificate
                </a>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
