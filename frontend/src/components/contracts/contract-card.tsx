import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ContractTemplate } from "@/types/contract";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const ContractCard = ({ contract }: { contract: ContractTemplate }) => (
  <Card className="overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all group">
    <CardHeader>
      <CardTitle className="flex items-center justify-between text-green-800 gap-3">
        <div className="flex items-center min-w-0 max-w-[70%]">
          <Package className="h-6 w-6 mr-2 text-green-600 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
          <TooltipProvider>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <span className="truncate overflow-hidden font-medium block">
                  {contract.contract_name}
                </span>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-white/90 backdrop-blur-sm border border-green-100 shadow-md max-w-[200px]"
              >
                <p className="font-medium text-green-800 text-[0.8rem] break-words whitespace-normal text-center">
                  {contract.contract_name}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {contract.approved ? (
          <Badge className="bg-green-100/80 text-green-700 flex-shrink-0">
            Approved
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="border-yellow-200 text-yellow-700 flex-shrink-0 bg-yellow-50/50"
          >
            Approval Pending
          </Badge>
        )}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="text-sm text-green-700/80">
          <div className="flex items-start min-w-0">
            <FileText className="h-4 w-4 mr-2 text-green-600 mt-1 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
            <span className="line-clamp-3 break-words">
              {contract.contract_description}
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full hover:bg-green-50/50 border-green-200 text-green-700 transition-all duration-300 group"
          onClick={() => window.open(contract.contract_file, "_blank")}
        >
          View Contract
        </Button>
      </div>
    </CardContent>
  </Card>
);
