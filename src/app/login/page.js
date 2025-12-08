"use client";

import { useRouter } from "next/navigation"; // ✅ use next/navigation
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
    router.push("/registration"); // your registration page path
  };

  return (
    <Login onLogin={handleLogin} onSwitchToRegister={switchToRegister} />
  );
}
