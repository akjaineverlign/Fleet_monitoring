"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsAuth(authenticated);
      setIsLoading(false);

      if (!authenticated) {
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuth) {
    return null;
  }

  return <>{children}</>;
}

