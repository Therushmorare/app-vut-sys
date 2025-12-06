"use client";

import { useState } from "react";
import axios from "axios";
import { GraduationCap, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { COLORS } from "../../constants/colors";

const Login = ({ onLogin, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";

    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setApiError("");
    setApiSuccess("");

    try {
      // Prepare payload exactly as API expects
      const payload = {
        user_type: "student",
        email: formData.email.trim(), // must be valid
        id_number: null,              // always include key
        password: formData.password,
      };

      console.log("Sending payload:", payload);

      const response = await axios.post(
        "https://d17qozs0vubb7e.cloudfront.net/api/students/login",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { message, user_type, user_id, access_token } = response.data;

      // Save session data
      sessionStorage.setItem("access_token", access_token);
      sessionStorage.setItem("user_type", user_type);
      sessionStorage.setItem("user_id", user_id);

      setApiSuccess(message || "Login successful!");

      console.log("API Response:", response.data);

      if (onLogin) onLogin(response.data);
    } catch (err) {
      console.error("Login error:", err);
      setApiError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: COLORS.bgLight }}
    >
      <div
        className="w-full max-w-md rounded-lg shadow-lg p-8"
        style={{ backgroundColor: COLORS.bgWhite }}
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <GraduationCap
              className="w-16 h-16"
              style={{ color: COLORS.primary }}
            />
          </div>
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: COLORS.primary }}
          >
            Welcome Back
          </h1>
          <p className="text-gray-600">Login to your student portal</p>
        </div>

        {apiError && (
          <p
            className="mb-4 text-center text-sm font-medium"
            style={{ color: COLORS.danger }}
          >
            {apiError}
          </p>
        )}

        {apiSuccess && (
          <p
            className="mb-4 text-center text-sm font-medium"
            style={{ color: COLORS.success }}
          >
            {apiSuccess}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="your.email@university.ac.za"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{
                  borderColor: errors.email ? COLORS.danger : COLORS.border,
                }}
              />
            </div>
            {errors.email && (
              <p className="text-sm mt-1" style={{ color: COLORS.danger }}>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{
                  borderColor: errors.password ? COLORS.danger : COLORS.border,
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm mt-1" style={{ color: COLORS.danger }}>
                {errors.password}
              </p>
            )}
          </div>

          {/* Remember me + Forgot password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            <button
              type="button"
              className="text-sm"
              style={{ color: COLORS.primary }}
            >
              Forgot password?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: COLORS.primary }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={onSwitchToRegister}
              className="font-semibold hover:underline"
              style={{ color: COLORS.primary }}
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;