import { CreateDisputeRequest } from "@/types/dispute";
import { getCookie } from "cookies-next";

export const API_BACKEND = process.env.NEXT_PUBLIC_API_URL;
export const BASE_URL = `${API_BACKEND}/api/v1`;

interface ApiCallOptions {
  method?: string;
  isAuth?: boolean;
  body?: object;
  formData?: FormData | null;
  params?: Record<string, string>;
}

export const apiCall = async (
  path: string,
  {
    method = "GET",
    isAuth = true,
    body = {},
    formData = null,
    params = {},
  }: ApiCallOptions = {}
) => {
  const accessToken = getCookie("accessToken");
  if (!accessToken && isAuth) {
    if (!window.location.pathname.startsWith("/signup")) {
      return null;
    }
    return null;
  }

  // Build URL with query parameters
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) queryParams.append(key, value);
  });
  const queryString = queryParams.toString();
  const requestUrl = `${BASE_URL}${path}/${
    queryString ? `?${queryString}` : ""
  }`;

  console.log("Making API call to:", requestUrl);
  const csrftoken = getCSRFCookie("csrftoken")!;

  const headers: HeadersInit = {};

  const req: RequestInit = {
    method: method,
  };

  if ((method === "POST" || method === "PATCH") && body && !formData) {
    req["body"] = JSON.stringify(body);
    headers["Content-Type"] = "application/json";
  }
  if ((method === "POST" || method === "PATCH") && formData) {
    req["body"] = formData;
  }
  if (method === "DELETE") {
    headers["accept"] = "application/json";
  }

  if (isAuth && accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  headers["X-CSRFToken"] = csrftoken;

  req["headers"] = headers;

  const res = await fetch(requestUrl, req);
  return method === "DELETE" ? undefined : res;
};

function getCSRFCookie(name: string) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();

      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Registration and verification endpoints
export const registerUser = async (data: {
  email: string;
  password1: string;
  password2: string;
}) => {
  return apiCall("/auth/registration", {
    method: "POST",
    isAuth: false,
    body: data,
  });
};

export const verifyEmail = async (code: string) => {
  return apiCall(`/verification/verify-email/${code}`, {
    method: "GET",
    isAuth: true,
  });
};

// User info endpoints
export const updateUserInfo = async (formData: FormData) => {
  return apiCall("/verification/user", {
    method: "PATCH",
    formData: formData,
  });
};

export const updateUserProfile = async (formData: FormData) => {
  const response = await apiCall("/verification/user", {
    method: "PATCH",
    isAuth: true,
    formData: formData,
  });
  if (!response?.ok) return null;
  return response.json();
};

export const updateBuyerProfile = async (formData: FormData) => {
  const response = await apiCall("/verification/user/buyer-profile", {
    method: "PATCH",
    isAuth: true,
    formData: formData,
  });
  if (!response?.ok) return null;
  return response.json();
};

export const updateCompanyProfile = async (formData: FormData) => {
  const response = await apiCall("/verification/user/company-profile", {
    method: "PATCH",
    isAuth: true,
    formData: formData,
  });
  if (!response?.ok) return null;
  return response.json();
};

export const updateFarmerProfile = async (formData: FormData) => {
  const response = await apiCall("/verification/user/farmer-profile", {
    method: "PATCH",
    isAuth: true,
    formData: formData,
  });
  if (!response?.ok) return null;
  return response.json();
};

export const requestAadhaarOtp = async (data: { aadhaar_number: string }) => {
  const response = await apiCall("/verification/request-otp", {
    method: "POST",
    body: data,
  });
  if (!response?.ok) return null;
  return response.json();
};

export const verifyAadhaarOtp = async (data: {
  otp: string;
  ref_id: string;
}) => {
  const response = await apiCall("/verification/verify-otp", {
    method: "POST",
    body: data,
  });
  if (!response?.ok) return null;
  return response.json();
};

// Government ID verification
export const verifyGovernmentId = async (data: {
  gov_id: string;
  type_of_id: string;
}) => {
  return apiCall("/verification/user/government-id", {
    method: "POST",
    body: data,
  });
};

// Additional info endpoints
export const submitLandInfo = async (formData: FormData) => {
  return apiCall("/verification/user/land", {
    method: "POST",
    formData: formData,
  });
};

export const submitGSTInfo = async (formData: FormData) => {
  return apiCall("/verification/user/gst-info", {
    method: "POST",
    formData: formData,
  });
};

// Verification status endpoint
export const checkEmailVerification = async () => {
  const response = await apiCall("/verification/user", {
    method: "GET",
    isAuth: false,
  });

  if (!response?.ok) return null;
  return response.json();
};

export const checkUserVerification = async () => {
  const response = await apiCall("/verification/user", {
    method: "GET",
    isAuth: true,
  });

  if (!response?.ok) return null;
  return response.json();
};

//profile endpoints
export const getUserProfile = async () => {
  const response = await apiCall("/verification/user", {
    method: "GET",
    isAuth: true,
  });
  if (!response?.ok) return null;
  return response.json();
};

export const getFarmerProfile = async () => {
  const response = await apiCall("/verification/user/farmer-profile", {
    method: "GET",
    isAuth: true,
  });
  if (!response?.ok) return null;
  return response.json();
};

export const getCompanyProfile = async () => {
  const response = await apiCall("/verification/user/company-profile", {
    method: "GET",
    isAuth: true,
  });
  if (!response?.ok) return null;
  return response.json();
};

export const getBuyerProfile = async () => {
  const response = await apiCall("/verification/user/buyer-profile", {
    method: "GET",
    isAuth: true,
  });
  if (!response?.ok) return null;
  return response.json();
};

export const getFarmerLandInfo = async () => {
  const response = await apiCall("/verification/user/land", {
    method: "GET",
    isAuth: true,
  });
  if (!response?.ok) return null;
  return response.json();
};

export const getGSTInfo = async () => {
  const response = await apiCall("/verification/user/gst-info", {
    method: "GET",
    isAuth: true,
  });
  if (!response?.ok) return null;
  return response.json();
};

export const getGovernmentId = async () => {
  const response = await apiCall("/verification/user/government-id", {
    method: "GET",
    isAuth: true,
  });
  if (!response?.ok) return null;
  return response.json();
};

export const createContractTemplate = async (formData: FormData) => {
  const response = await apiCall("/business/contract-templates", {
    method: "POST",
    isAuth: true,
    formData: formData,
  });
  if (!response?.ok) return null;
  return response.json();
};

export const getContractTemplates = async () => {
  const response = await apiCall("/business/contract-templates", {
    method: "GET",
    isAuth: true,
  });
  if (!response?.ok) return null;
  return response.json();
};

export const applyForContract = async (
  contractId: number,
  data: {
    estimate_production_in_quintal: string;
    estimate_total_price: string;
  }
) => {
  const response = await apiCall("/contracts", {
    method: "POST",
    isAuth: true,
    body: {
      contract_template: contractId,
      ...data,
    },
  });
  if (!response?.ok) return null;
  return response.json();
};

export const getFarmerApplications = async () => {
  const response = await apiCall("/contracts", {
    method: "GET",
    isAuth: true,
  });
  if (!response?.ok) return null;
  return response.json();
};

export const getCropListings = async () => {
  const response = await apiCall("/crop-listings", {
    method: "GET",
    isAuth: true,
  });
  if (!response?.ok) return null;
  return response.json();
};

export const getDisputes = async () => {
  const response = await apiCall("/disputes", {
    method: "GET",
    isAuth: true,
  });
  if (!response?.ok) return null;
  return response.json();
};

export const createDispute = async (data: CreateDisputeRequest) => {
  const response = await apiCall("/disputes", {
    method: "POST",
    isAuth: true,
    body: data,
  });
  if (!response?.ok) return null;
  return response.json();
};

export const startPayment = async (order_id: string, stage: string) => {
  const data = await apiCall(`/payments/create/${order_id}/${stage}`);
  return await data?.json();
};

export const paymentStatus = async (payment_id: string) => {
  const data = await apiCall(`/payments/payment-status/${payment_id}`);
  return await data?.json();
};

export const getContractById = async (id: string) => {
  const data = await apiCall(`/contracts/${id}`);
  return await data?.json();
};

export const searchUsers = async (query: string) => {
  console.log("Searching with query:", query);
  const response = await apiCall(`/search-users`, {
    method: "GET",
    isAuth: true,
    params: { search: query },
  });

  if (!response?.ok) {
    console.error("Search API error:", response?.status, response?.statusText);
    return null;
  }

  const data = await response.json();
  console.log("Search API response:", data);
  return data;
};

export const getContractApplications = async () => {
  const data = await apiCall(`/contracts`);
  return await data?.json();
};

export const getContractApplicationById = async (id: string) => {
  const data = await apiCall(`/contracts/${id}`);
  return await data?.json();
};

export const payAdvance = async (id: string) => {
  const data = await apiCall(`/payments/create/${id}/advance`);
  return await data?.json();
};

export const payFinal = async (id: string) => {
  const data = await apiCall(`/payments/create/${id}/final`);
  return await data?.json();
};

export const buyerEsign = async (id: string) => {
  const data = await apiCall(`/esign-buyer/${id}`);
  return await data?.json();
};

export const submitTenderApplication = async (formData: FormData) => {
  const response = await apiCall("/tender-application", {
    method: "POST",
    isAuth: true,
    formData: formData,
  });
  if (!response?.ok) return null;
  return response.json();
};

export const getTransportationTenders = async () => {
  const response = await apiCall("/transportation-tenders", {
    method: "GET",
    isAuth: false,
  });
  if (!response?.ok) return null;
  return response.json();
};
