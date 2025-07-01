import {
  UserType,
  BaseUser,
  FarmerUser,
  CompanyUser,
  BuyerUser,
  FarmerProfile,
  CompanyProfile,
  BuyerProfile,
} from "./user";

interface BaseAuthUser extends BaseUser {
  is_active: boolean;
  is_staff: boolean;
  is_email_verified: boolean;
  is_gov_id_verified: boolean;
  user_verified: boolean;
  farmer_profile?: FarmerProfile;
  company_profile?: CompanyProfile;
  buyer_profile?: BuyerProfile;
}

export interface FarmerAuthUser
  extends BaseAuthUser,
    Omit<FarmerUser, keyof BaseUser> {
  user_type: "farmer";
}

export interface CompanyAuthUser
  extends BaseAuthUser,
    Omit<CompanyUser, keyof BaseUser> {
  user_type: "company";
}

export interface BuyerAuthUser
  extends BaseAuthUser,
    Omit<BuyerUser, keyof BaseUser> {
  user_type: "buyer";
}

export type AuthUser = FarmerAuthUser | CompanyAuthUser | BuyerAuthUser;

export interface VerificationStatus {
  isEmailVerified: boolean;
  isGovIdVerified: boolean;
  userVerified: boolean;
  userType: UserType | null;
  email: string | null;
}

export interface AuthState {
  user: AuthUser | null;
  profile: {
    farmer?: FarmerProfile;
    company?: CompanyProfile;
    buyer?: BuyerProfile;
  } | null;
  verificationStatus: VerificationStatus;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password1: string;
  password2: string;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (data: FormData) => Promise<void>;
  clearError: () => void;
}
