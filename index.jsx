import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Text,
  Input,
} from "@chakra-ui/react";
import lottie from "lottie-web";
import LogoSvg from "assets/img/auth/Contract-IQ.svg";
import LogoAnimationData from "assets/img/auth/logo_animation.json";
import { login } from "api/auth";

function GetStarted() {
  const navigate = useNavigate();
  const lottieContainerRef = useRef(null);
  const [showFallbackLogo, setShowFallbackLogo] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!lottieContainerRef.current) return undefined;

    const animation = lottie.loadAnimation({
      container: lottieContainerRef.current,
      renderer: "svg",
      loop: false,
      autoplay: true,
      animationData: LogoAnimationData,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    });

    return () => {
      animation.destroy();
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setContentVisible(true), 3500);
    return () => clearTimeout(timer);
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

  const slideUpBase = {
    initial: { opacity: 0, transform: "translateY(16px)" },
    animate: { opacity: 1, transform: "translateY(0px)" },
  };

  return (
    <Flex
      minH="100vh"
      w="100%"
      align="center"
      justify="center"
      position="relative"
      overflow="hidden"
      sx={{
        backgroundImage: backgroundGradient,
        backgroundColor: "#C9D7FF",
      }}
    >
      {/* Animation layer - full screen behind content */}
      {!showFallbackLogo && (
        <Box
          ref={lottieContainerRef}
          position="absolute"
          inset={0}
          w="100vw"
          h="100vh"
          zIndex={0}
        />
      )}

      {/* Content layer - centered and above animation */}
      {contentVisible && (
        <Flex
          direction="column"
          align="center"
          justify="center"
          gap="20px"
          mt="200px"
          zIndex={1}
          position="relative"
          sx={{ fontFamily: "Ubuntu, sans-serif" }}
        >
          {showFallbackLogo ? (
            <Image
              src={LogoSvg}
              alt="Contract IQ"
              w="60vw"
              h="auto"
              objectFit="contain"
              style={{ filter: "drop-shadow(0px 10px 30px rgba(0,0,0,0.15))" }}
            />
          ) : null}

          {!showLogin && (
            <Heading
              as="h1"
              fontSize={{ base: "22px", md: "28px", lg: "32px" }}
              textAlign="center"
              color="#0B0B0B"
              style={{
                opacity: slideUpBase.initial.opacity,
                transform: slideUpBase.initial.transform,
                animation: "slideUpHeading 500ms ease-out 120ms forwards",
              }}
            >
              AI-Powered Insights on Healthcare Contracts
            </Heading>
          )}

          {!showLogin && (
            <Text
              maxW={{ base: "90%", md: "720px" }}
              textAlign="center"
              color="rgba(0,0,0,0.7)"
              fontSize={{ base: "14px", md: "16px" }}
              style={{
                opacity: slideUpBase.initial.opacity,
                transform: slideUpBase.initial.transform,
                animation: "slideUpSub 600ms ease-out 300ms forwards",
              }}
            >
              ContractIQ analyzes healthcare contracts and compares them with
              claims data <br /> to identify discrepancies, strengthening
              payment integrity.
            </Text>
          )}

          {!showLogin && (
            <Button
              onClick={() => setShowLogin(true)}
              color="white"
              px="28px"
              py="22px"
              borderRadius="12px"
              fontWeight="600"
              style={{
                backgroundImage: buttonGradient,
                boxShadow: "0 10px 24px rgba(54, 68, 207, 0.35)",
                opacity: slideUpBase.initial.opacity,
                transform: slideUpBase.initial.transform,
                animation: "slideUpCta 600ms ease-out 420ms forwards",
              }}
            >
              Get Started
            </Button>
          )}

          {showLogin && (
            <Flex
              direction="column"
              gap="12px"
              mt="8px"
              w={{ base: "90%", sm: "360px" }}
              align="center"
            >
              <Heading as="h3" fontSize="22px" textAlign="center" mb="4px">
                Let's get started
              </Heading>
              <Text
                fontSize="sm"
                color="blackAlpha.700"
                textAlign="center"
                mb="6px"
              >
                Login with your email
              </Text>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                borderRadius="12px"
                bg="whiteAlpha.800"
                _placeholder={{ color: "blackAlpha.500" }}
              />
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Enter your password"
                borderRadius="12px"
                bg="whiteAlpha.800"
                _placeholder={{ color: "blackAlpha.500" }}
              />
              {errorMessage ? (
                <Text fontSize="sm" color="red.500" textAlign="center" mt="4px">
                  {errorMessage}
                </Text>
              ) : null}
              <Button
                onClick={async () => {
                  setErrorMessage("");
                  if (!email || !password) {
                    setErrorMessage("Please enter email and password");
                    return;
                  }
                  try {
                    setIsSubmitting(true);
                    const result = await login({ email, password });
                    if (result?.access_token) {
                      localStorage.setItem("access_token", result.access_token);
                      if (result.email)
                        localStorage.setItem("user_email", result.email);
                      if (result.id) localStorage.setItem("user_id", result.id);
                      navigate("/storage-page");
                    } else {
                      setErrorMessage("Invalid login response");
                    }
                  } catch (err) {
                    setErrorMessage(err?.message || "Login failed");
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                color="white"
                py="16px"
                borderRadius="12px"
                fontWeight="600"
                style={{
                  backgroundImage: buttonGradient,
                  boxShadow: "0 10px 24px rgba(54,68,207,0.35)",
                }}
                isDisabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </Flex>
          )}
        </Flex>
      )}

      <style>{`
        @keyframes slideUpHeading { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUpSub { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUpCta { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      <h2
        className="text-get_started_subheading_color text-xs"
        style={{
          position: "absolute",
          bottom: "5px",
          opacity: slideUpBase.initial.opacity,
          transform: slideUpBase.initial.transform,
          animation: "slideUpHeading 6500ms ease-out 120ms forwards",
        }}
      >
        Powered by Everlign's Enterprise AI Platform
      </h2>
    </Flex>
  );
}

export default GetStarted;
