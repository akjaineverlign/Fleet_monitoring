"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import lottie, { type AnimationItem } from "lottie-web";
import { login } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SplashLogin() {
  const router = useRouter();
  const lottieContainerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);
  const [showFallbackLogo, setShowFallbackLogo] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!lottieContainerRef.current) return;

    // Load animation
    const loadAnimation = async () => {
      try {
        const animationData = await fetch("/logo_animation1.json").then((res) =>
          res.json()
        );

        animationRef.current = lottie.loadAnimation({
          container: lottieContainerRef.current!,
          renderer: "svg",
          loop: false,
          autoplay: true,
          animationData: animationData,
          rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
          },
        });

        animationRef.current.addEventListener("data_failed", () => {
          setShowFallbackLogo(true);
        });
      } catch (error) {
        console.error("Failed to load animation:", error);
        setShowFallbackLogo(true);
      }
    };

    loadAnimation();

    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    // Show content after animation plays (3.5 seconds)
    // This gives time for the splash animation to complete
    const timer = setTimeout(() => {
      setContentVisible(true);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  // Show background and animation immediately
  useEffect(() => {
    // Ensure the page is visible right away
    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, []);

  // Ensure Ubuntu font is available
  useEffect(() => {
    const existing = document.getElementById("font-ubuntu");
    if (existing) return;
    const link = document.createElement("link");
    link.id = "font-ubuntu";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;700&display=swap";
    document.head.appendChild(link);
  }, []);

  // const handleLogin = async () => {
  //   setErrorMessage("");
  //   if (!email || !password) {
  //     setErrorMessage("Please enter email and password");
  //     return;
  //   }

  //   try {
  //     setIsSubmitting(true);
  //     const result = await login({ email, password });
  //     if (result?.access_token) {
  //       if (typeof window !== "undefined") {
  //         localStorage.setItem("access_token", result.access_token);
  //         if (result.email)
  //           localStorage.setItem("user_email", result.email);
  //         if (result.id) localStorage.setItem("user_id", result.id);
  //       }
  //       router.push("/dashboard");
  //     } else {
  //       setErrorMessage("Invalid login response");
  //     }
  //   } catch (err) {
  //     setErrorMessage(err instanceof Error ? err.message : "Login failed");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };
const handleLogin = async () => {
  setErrorMessage("");
  if (!email || !password) {
    setErrorMessage("Please enter email and password");
    return;
  }

  try {
    setIsSubmitting(true);
    console.log("Attempting login with:", { email, baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL });
    
    const result = await login({ email, password });
    
    if (result?.access_token) {
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", result.access_token);
        localStorage.setItem("user_email", result.email || "");
        localStorage.setItem("user_id", result.id || "");
      }
      // Redirect to dashboard after successful login
      router.push("/dashboard");
    } else {
      setErrorMessage("Invalid login response");
    }
  } catch (err) {
    console.error("Login error details:", err);
    setErrorMessage(err instanceof Error ? err.message : "Login failed");
  } finally {
    setIsSubmitting(false);
  }
};

  const backgroundGradient =
    "radial-gradient(at 51% 67%, hsla(216,71%,87%,1) 0px, transparent 50%)," +
    "radial-gradient(at 34% 21%, hsla(214,83%,92%,1) 0px, transparent 50%)," +
    "radial-gradient(at 56% 37%, hsla(205,100%,98%,1) 0px, transparent 50%)," +
    "radial-gradient(at 1% 2%, hsla(217,65%,69%,1) 0px, transparent 50%)," +
    "radial-gradient(at 8% 75%, hsla(217,65%,71%,1) 0px, transparent 50%)," +
    "radial-gradient(at 67% 94%, hsla(217,65%,73%,1) 0px, transparent 50%)," +
    "radial-gradient(at 0% 98%, hsla(209,89%,60%,1) 0px, transparent 50%)";

  const buttonGradient =
    "linear-gradient(#81E5FF -22.92%, rgba(254, 200, 241, 0) 26.73%), radial-gradient(137.13% 253.39% at 76.68% 66.67%, #3644CF 0%, #85F3FF 100%)";

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: backgroundGradient,
        backgroundColor: "#C9D7FF",
        fontFamily: "Ubuntu, sans-serif",
      }}
    >
      {/* Animation layer - full screen behind content - always visible */}
      <div
        ref={lottieContainerRef}
        className="absolute inset-0 w-screen h-screen z-0"
        style={{ display: showFallbackLogo ? "none" : "block" }}
      />

      {/* Fallback logo if animation fails */}
      {showFallbackLogo && !contentVisible && (
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <div className="w-[60vw] h-auto">
            <svg
              viewBox="0 0 200 200"
              className="w-full h-auto"
              style={{ filter: "drop-shadow(0px 10px 30px rgba(0,0,0,0.15))" }}
            >
              <circle cx="100" cy="100" r="80" fill="url(#logoGradient)" />
              <circle cx="100" cy="100" r="20" fill="#ffffff" />
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="1" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="1" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      )}

      {/* Content layer - centered and above animation */}
      {contentVisible && (
        <div
          className="flex flex-col items-center justify-center gap-5 mt-[200px] z-10 relative"
          style={{ fontFamily: "Ubuntu, sans-serif" }}
        >
          {showFallbackLogo && (
            <div className="w-[60vw] h-auto">
              <svg
                viewBox="0 0 200 200"
                className="w-full h-auto"
                style={{ filter: "drop-shadow(0px 10px 30px rgba(0,0,0,0.15))" }}
              >
                <circle cx="100" cy="100" r="80" fill="url(#logoGradient)" />
                <circle cx="100" cy="100" r="20" fill="#ffffff" />
                <defs>
                  <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="1" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="1" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          )}

          {!showLogin && (
            <>
              <h1
                className="text-2xl md:text-3xl lg:text-4xl text-center text-[#0B0B0B] font-bold"
                style={{
                  opacity: 0,
                  transform: "translateY(16px)",
                  animation: "slideUpHeading 500ms ease-out 120ms forwards",
                }}
              >
                AI-Powered Insights on Fleet Monitoring
              </h1>

              <p
                className="max-w-[90%] md:max-w-[720px] text-center text-black/70 text-sm md:text-base"
                style={{
                  opacity: 0,
                  transform: "translateY(16px)",
                  animation: "slideUpSub 600ms ease-out 300ms forwards",
                }}
              >
                Signal-IQ monitors your fleet in real-time, providing intelligent
                insights <br /> to optimize operations and ensure maximum efficiency.
              </p>

              <Button
                onClick={() => setShowLogin(true)}
                className="text-white px-7 py-5 rounded-xl font-semibold text-base"
                style={{
                  backgroundImage: buttonGradient,
                  boxShadow: "0 10px 24px rgba(54, 68, 207, 0.35)",
                  opacity: 0,
                  transform: "translateY(16px)",
                  animation: "slideUpCta 600ms ease-out 420ms forwards",
                }}
              >
                Get Started
              </Button>
            </>
          )}

          {showLogin && (
            <div className="flex flex-col gap-3 mt-2 w-[90%] sm:w-[360px] items-center">
              <h3 className="text-black text-2xl text-center mb-1 font-semibold">
                Let&apos;s get started
              </h3>
              <p className="text-sm text-black/70 text-center mb-1.5">
                Login with your email
              </p>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isSubmitting) {
                    handleLogin();
                  }
                }}
                placeholder="Enter your email"
                type="email"
                className="rounded-xl bg-white/80 placeholder:text-black/50 border-black/20"
              />
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isSubmitting) {
                    handleLogin();
                  }
                }}
                type="password"
                placeholder="Enter your password"
                className="rounded-xl bg-white/80 placeholder:text-black/50 border-black/20"
              />
              {errorMessage && (
                <p className="text-sm text-red-500 text-center mt-1">
                  {errorMessage}
                </p>
              )}
              <Button
                onClick={handleLogin}
                disabled={isSubmitting}
                className="text-white py-4 rounded-xl font-semibold w-full"
                style={{
                  backgroundImage: buttonGradient,
                  boxShadow: "0 10px 24px rgba(54,68,207,0.35)",
                }}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </div>
          )}
        </div>
      )}


      <h2
        className="text-xs text-black/70 absolute bottom-[5px]"
        style={{
          opacity: 0,
          transform: "translateY(16px)",
          animation: "slideUpHeading 6500ms ease-out 120ms forwards",
        }}
      >
        Powered by Signal-IQ Enterprise Platform
      </h2>
    </div>
  );
}
