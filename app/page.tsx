"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SplashLogin } from "@/components/splash-login";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Don't auto-redirect here - let user see the login page
    // Redirect happens in SplashLogin after successful login
  }, [router]);

  return <SplashLogin />;
}