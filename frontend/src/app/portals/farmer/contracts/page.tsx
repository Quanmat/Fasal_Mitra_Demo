"use client";

import { useState, useEffect } from "react";
import {
  getContractTemplates,
  getFarmerApplications,
  getCropListings,
} from "@/helpers/api";
import { ContractTemplate, Contract } from "@/types/contract";
import { FarmerContractCard } from "@/components/contracts/farmer-contract-card";
import { LoadingCard } from "@/components/contracts/loading-card";
import { Wheat } from "lucide-react";
import { Crop } from "@/types/crop";

export default function FarmerPage() {
  const [contracts, setContracts] = useState<ContractTemplate[]>([]);
  const [applications, setApplications] = useState<Contract[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [contractsData, applicationsData, cropsData] = await Promise.all([
        getContractTemplates(),
        getFarmerApplications(),
        getCropListings(),
      ]);

      if (contractsData) {
        setContracts(contractsData);
      } else {
        setError("Failed to load contracts");
      }

      if (applicationsData) {
        setApplications(applicationsData);
      }

      if (cropsData) {
        setCrops(cropsData);
      }
    } catch {
      setError("An error occurred while loading data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-green-800">
          Available Contracts
        </h1>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <p className="text-red-600">{error}</p>
        </div>
      ) : contracts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <Wheat className="h-16 w-16 text-green-600/50" />
          <p className="text-gray-600 text-lg">No contracts available yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contracts.map((contract) => (
            <FarmerContractCard
              key={contract.id}
              contract={contract}
              applicationStatus={applications.find(
                (app) => app.contract_template === contract.id
              )}
              cropData={crops.find((crop) => crop.id === contract.crop)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
