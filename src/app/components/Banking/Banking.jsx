"use client";

import { useEffect, useState } from "react";
import { Landmark, Hash } from "lucide-react";
import { COLORS } from "../../constants/colors";

const StudentBankingProfile = ({ student, onUpdate, showToast }) => {
  const [form, setForm] = useState({
    bankName: "",
    accountType: "",
    accountNumber: ""
  });

  const [loading, setLoading] = useState(false);
  const [hasExisting, setHasExisting] = useState(false);

  /* ---------------- Fetch existing banking details ---------------- */
  useEffect(() => {
    if (!student?.id) return;

    const fetchBankingDetails = async () => {
      try {
        const res = await fetch(
          `/api/students/bankingDetails/${student.id}`
        );

        if (!res.ok) return;

        const data = await res.json();

        setForm({
          bankName: data.bank_name || "",
          accountType: data.account_type || "",
          accountNumber: data.account_number || ""
        });

        setHasExisting(true);
      } catch (err) {
        console.error("Failed to load banking details", err);
      }
    };

    fetchBankingDetails();
  }, [student?.id]);

  /* ---------------- Handle input changes ---------------- */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ---------------- Save (Create or Update) ---------------- */
  const handleSave = async () => {
    if (!form.bankName || !form.accountType || !form.accountNumber) {
      showToast?.("Please complete all banking fields", "error");
      return;
    }

    setLoading(true);

    const payload = {
      user_id: student.id,
      bank_name: form.bankName,
      account_type: form.accountType,
      account_number: form.accountNumber
    };

    try {
      const endpoint = hasExisting
        ? "/api/students/banking-details/update"
        : "/api/students/banking-details";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        showToast?.(data.message || "Failed to save details", "error");
        return;
      }

      setHasExisting(true);
      onUpdate?.(payload);
      showToast?.("Banking details saved successfully", "success");

    } catch (err) {
      console.error(err);
      showToast?.("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-6">
      <div
        className="rounded-lg p-6 shadow-sm"
        style={{ backgroundColor: COLORS.bgWhite }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-xl font-bold"
            style={{ color: COLORS.primary }}
          >
            Banking Details
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bank Name */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: COLORS.text }}
            >
              Bank Name
            </label>
            <div className="relative">
              <Landmark className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="bankName"
                value={form.bankName}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style={{ borderColor: COLORS.border }}
              />
            </div>
          </div>

          {/* Account Type */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: COLORS.text }}
            >
              Account Type
            </label>
            <select
              name="accountType"
              value={form.accountType}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
              style={{ borderColor: COLORS.border }}
            >
              <option value="">Select account type</option>
              <option value="Savings">Savings</option>
              <option value="Cheque">Cheque</option>
              <option value="Current">Current</option>
            </select>
          </div>

          {/* Account Number */}
          <div className="md:col-span-2">
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: COLORS.text }}
            >
              Account Number
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="accountNumber"
                value={form.accountNumber}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style={{ borderColor: COLORS.border }}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2 rounded-lg text-white font-medium transition disabled:opacity-50"
            style={{ backgroundColor: COLORS.primary }}
          >
            {loading ? "Saving..." : "Save Details"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentBankingProfile;