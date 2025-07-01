import { BASE_URL } from "./api";

import { getCookie, setCookie, deleteCookie } from "cookies-next";

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

export function getAccessToken(): string | null {
  return getCookie("accessToken") as string | null;
}

export interface LoginPostData {
  email: string;
  password: string;
}

export interface RegisterPostData {
  email: string;
  password1: string;
  password2: string;
}

export async function login(data: LoginPostData) {
  const csrftoken = getCSRFCookie("csrftoken")!;
  const response = await fetch(`${BASE_URL}/token/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify(data),
  });

  const res = await response.json();

  if (response.ok) {
    setCookie("accessToken", res.access, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }
  return response.ok;
}

export async function logOut() {
  const csrftoken = getCSRFCookie("csrftoken")!;
  const data = await fetch(`${BASE_URL}/auth/logout/`, {
    method: "POST",
    headers: { "X-CSRFToken": csrftoken },
  });
  if (data.ok) {
    deleteCookie("accessToken");
    deleteCookie("userType");
  } else {
    deleteCookie("accessToken");
    deleteCookie("userType");
  }
  return data.ok;
}

export async function register(data: RegisterPostData) {
  const response = await fetch(`${BASE_URL}/auth/registration/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.ok;
}

export async function refreshToken(refresh: string) {
  const response = await fetch(`${BASE_URL}/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh }),
  });

  const res = await response.json();
  if (response.ok) {
    setCookie("accessToken", res.access, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    return true;
  }
  return false;
}

export async function verifyToken(
  token: string
): Promise<{ isValid: boolean; error?: string }> {
  try {
    const response = await fetch(`${BASE_URL}/token/verify/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    if (response.status === 401) {
      const data = await response.json();
      return { isValid: false, error: data.detail };
    }
    return { isValid: true };
  } catch {
    return { isValid: false, error: "Network error" };
  }
}
