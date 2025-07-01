export interface Dispute {
  id: number;
  contract: number;
  raised_by: number;
  description: string;
  status: "pending" | "resolved" | "rejected";
  admin_comment: string | null;
  created_at: string;
}

export interface CreateDisputeRequest {
  contract: number;
  description: string;
}
