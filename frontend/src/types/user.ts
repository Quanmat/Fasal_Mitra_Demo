export type UserType = "farmer" | "company" | "buyer";

export interface BaseUser {
  email: string;
  first_name: string;
  last_name: string;
  user_type: UserType;
}

export interface LandInfo {
  land_area: number;
  land_location: string;
  document_image: string;
  submitted_at: string;
  is_verified: boolean;
}

export interface GSTInfo {
  gst_number: string;
  is_verified: boolean;
  submitted_at: string;
  gst_certificate: string;
}

export interface GovernmentID {
  gov_id: string;
  type_of_id: string;
  is_verified: boolean;
  submitted_at: string;
}

export interface FarmerUser extends BaseUser {
  user_type: "farmer";
  bio?: string;
  profile_image?: string;
  landInfo?: LandInfo[];
}

export interface CompanyUser extends BaseUser {
  user_type: "company";
  company_name: string;
  company_description: string;
  company_logo?: string;
  gstInfo?: GSTInfo[];
  governmentId?: GovernmentID[];
}

export interface BuyerUser extends BaseUser {
  user_type: "buyer";
  bio?: string;
  profile_image?: string;
  governmentId?: GovernmentID[];
}

export type User = FarmerUser | CompanyUser | BuyerUser;

// Profile types for API responses
export interface FarmerProfile {
  user: number;
  profile_image: string;
  bio: string;
  landInfo?: LandInfo[];
}

export interface CompanyProfile {
  user: number;
  company_name: string;
  company_description: string;
  company_logo: string;
  created_at: string;
  gstInfo?: GSTInfo[];
  governmentId?: GovernmentID[];
}

export interface BuyerProfile {
  user: number;
  bio: string;
  profile_image: string;
  created_at: string;
  listings: number[];
  governmentId?: GovernmentID[];
}
