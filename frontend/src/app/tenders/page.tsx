"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, Calendar, ArrowLeft, FileUp, Building2 } from "lucide-react";
import { getTransportationTenders } from "@/helpers/api";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface Tender {
  id: number;
  tender_name: string;
  tender_description: string;
  tender_file: string;
  created_at: string;
  end_date: string;
  is_active: boolean;
}

export default function TendersPage() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const data = await getTransportationTenders();
        if (data) {
          setTenders(data);
        }
      } catch (error) {
        console.error("Error fetching tenders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTenders();
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-100 to-blue-200 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-100 to-blue-200">
      <div className="max-w-7xl mx-auto p-4">
        <Link
          href="/"
          className="inline-flex items-center text-green-700 hover:text-green-800 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>

        <div className="flex items-center mb-8">
          <Building2 className="h-8 w-8 text-green-600 mr-3" />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Transportation Tenders
            </h1>
            <p className="text-gray-600 mt-1">
              Find and apply for agricultural transportation opportunities
            </p>
          </div>
        </div>

        {tenders.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 p-8 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              No Active Tenders
            </h3>
            <p className="text-gray-600">
              There are currently no active transportation tenders. Please check
              back later.
            </p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tenders.map((tender, index) => (
              <motion.div
                key={tender.id}
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-800">
                        {tender.tender_name}
                      </h2>
                      {tender.is_active ? (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-600 border-green-200"
                        >
                          Active
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-red-50 text-red-600 border-red-200"
                        >
                          Inactive
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {tender.tender_description}
                    </p>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 text-green-600 mr-2" />
                        <span>
                          Posted:{" "}
                          {new Date(tender.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 text-green-600 mr-2" />
                        <span>
                          Deadline:{" "}
                          {new Date(tender.end_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Link
                        href={tender.tender_file}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-colors duration-300"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        View Details
                      </Link>
                      {tender.is_active && (
                        <Link
                          href={`/tenders/${tender.id}/apply`}
                          className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white rounded-lg text-sm font-semibold transition-all duration-300"
                        >
                          <FileUp className="w-4 h-4 mr-2" />
                          Apply Now
                        </Link>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
