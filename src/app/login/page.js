"use client";

import { useRouter } from "next/router";
import Login from "../components/auth/Login";

export default function LoginPage() {
  const router = useRouter();

  // Callback after login
  const handleLogin = (data) => {
    console.log("Login successful:", data);
    // Redirect to MFA page
    router.push("/mfa");
  };

  const switchToRegister = () => {
    router.push("/register"); // if you have a register page
  };

  return (
    <Login onLogin={handleLogin} onSwitchToRegister={switchToRegister} />
  );
}