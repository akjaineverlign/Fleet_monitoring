import { useNavigate } from "react-router-dom";
import { sendLogToServer } from "./logging";
import { supabase } from "supabase/supabaseClient";
import { MenuItem, Text } from "@chakra-ui/react";
import axios from "axios";
export const loginWithGoogle = async () => {
  sendLogToServer("Login with google Started");
  await supabase.auth
    .signInWithOAuth({
      provider: "google",
    })
    .then(() => {
      sendLogToServer("Login successful");
    });
};

export const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    sendLogToServer("Logout");
    try {
      await supabase.auth.signOut();
    } catch (e) {}
    try {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_email");
      localStorage.removeItem("user_id");
    } catch (e) {}
    navigate("/");
  };

  return (
    <MenuItem
      _hover={{ bg: "none" }}
      _focus={{ bg: "none" }}
      color="red.400"
      borderRadius="8px"
      px="14px"
      onClick={handleLogout}
    >
      <Text fontSize="sm">Log out</Text>
    </MenuItem>
  );
};

export const fetchUser = async () => {
  sendLogToServer("Fetching User");
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return {
      id: user.id,
    };
  } catch (error) {
    sendLogToServer(`Error fetching session:${error}`);
    return error;
  }
};

export const login = async ({ email, password}) => {
  const baseUrl = process.env.REACT_APP_BACKEND_URL;
  const envTenant = process.env.REACT_APP_TENANT;
  if (!baseUrl) {
    throw new Error("Missing REACT_APP_API environment variable");
  }
  try {
    const response = await axios.post(`${baseUrl}/auth/token`, {
      email,
      password,
      tenant: envTenant,
    });
    if (response?.data?.access_token) {
      return response.data;
    }
    throw new Error("Invalid login response");
  } catch (error) {
    const message = error?.response?.data?.message || error?.message || "Login failed";
    throw new Error("UNAUTHORIZED");
  }
};
