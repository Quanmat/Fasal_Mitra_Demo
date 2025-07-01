"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { getContractTemplates } from "@/helpers/api";
import { ContractTemplate } from "@/types/contract";
import { ContractCard } from "@/components/contracts/contract-card";
import { LoadingCard } from "@/components/contracts/loading-card";
import { EmptyState } from "@/components/contracts/empty-state";
import { useRouter } from "next/navigation";

export default function BuyerPage() {
  const [contracts, setContracts] = useState<ContractTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchContracts = async () => {
    setIsLoading(true);
    try {
      const data = await getContractTemplates();
      if (data) {
        setContracts(data);
      } else {
        setError("Failed to load contracts");
      }
    } catch {
      setError("An error occurred while loading contracts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-green-800">
          Buyer Portal
        </h1>
        <Button
          className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white shadow-lg transition-all duration-300 group"
          onClick={() => router.push("/buyer/create")}
        >
          <ShoppingCart className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:scale-110" />
          Create New Contract
        </Button>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <p className="text-red-600">{error}</p>
          <Button
            onClick={fetchContracts}
            className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white"
          >
            Try Again
          </Button>
        </div>
      ) : contracts.length === 0 ? (
        <EmptyState onCreateContract={() => router.push("/buyer/create")} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contracts.map((contract) => (
            <ContractCard key={contract.id} contract={contract} />
          ))}
        </div>
      )}
    </div>
  );
}
