"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SplashLogin } from "@/components/splash-login";
import { isAuthenticated } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check authentication status - only redirect if already authenticated
    // Don't redirect unauthenticated users, let them see and use the login form
    const checkAuth = () => {
      if (isAuthenticated()) {
        // Only redirect if user is already logged in
        router.push("/dashboard");
      } else {
        // If not authenticated, show splash/login - don't redirect
        setIsChecking(false);
      }
    };

    // Check after a brief delay to ensure component is mounted
    const timer = setTimeout(checkAuth, 200);
    return () => clearTimeout(timer);
  }, [router]);

  // Always show splash screen
  // For unauthenticated users, they'll see the full splash/login flow
  // For authenticated users, they'll be redirected to dashboard
  return <SplashLogin />;
}

