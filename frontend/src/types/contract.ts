import { User } from "./user";

export interface ContractTemplate {
  id: number;
  submitted_by: User;
  contract_name: string;
  contract_description: string;
  contract_file: string;
  created_at: string;
  approved: boolean;
  price: string;
  crop: number;
  total_quintal_required: string;
}

export interface Contract {
  id: number;
  contract_template: number;
  buyer: number;
  seller: number;
  created_at: string;
  approved: boolean;
  status: "PENDING" | "APPROVED" | "REJECTED";
  signed_contract: string | null;
  estimate_production_in_quintal: string;
  estimate_total_price: string;
}
