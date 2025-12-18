export interface LoginResponse {
  access_token: string;
  email?: string;
  id?: string;
}

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<LoginResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;
  const envTenant = process.env.NEXT_PUBLIC_TENANT || process.env.REACT_APP_TENANT;

  if (!baseUrl) {
    throw new Error("Missing BACKEND_URL environment variable");
  }

  try {
    const response = await fetch(`${baseUrl}/auth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        tenant: envTenant,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.message || "Login failed");
    }

    const data = await response.json();

    if (data?.access_token) {
      return data;
    }

    throw new Error("Invalid login response");
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("UNAUTHORIZED");
  }
};

export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_id");
  }
};

export const getAccessToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token");
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  return getAccessToken() !== null;
};
