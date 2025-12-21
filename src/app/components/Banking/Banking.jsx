"use client";

import { useState } from "react";
import { CreditCard, Landmark, Hash } from "lucide-react";
import { COLORS } from "../../constants/colors";

const StudentBankingProfile = ({ student, onUpdate, showToast }) => {
  const [form, setForm] = useState({
    bankName: student?.bankName || "",
    accountType: student?.accountType || "",
    accountNumber: student?.accountNumber || ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!form.bankName || !form.accountType || !form.accountNumber) {
      showToast?.("Please complete all banking fields", "error");
      return;
    }

    onUpdate?.(form);
    showToast?.("Banking details updated", "success");
  };

  return (
    <div className="space-y-6">
      {/* Banking Details */}
      <div
        className="rounded-lg p-6 shadow-sm"
        style={{ backgroundColor: COLORS.bgWhite }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-xl font-bold"
            style={{ color: COLORS.primary }}
          >
            Banking Details
          </h2>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bank Name */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>
              Bank Name
            </label>
            <div className="relative">
              <Landmark className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="bankName"
                value={form.bankName}
                onChange={handleChange}
                placeholder="e.g. Standard Bank"
                className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  borderColor: COLORS.border,
                  focusRingColor: COLORS.primary
                }}
              />
            </div>
          </div>

          {/* Account Type */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>
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
            <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>
              Account Number
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="accountNumber"
                value={form.accountNumber}
                onChange={handleChange}
                placeholder="Enter account number"
                className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style={{ borderColor: COLORS.border }}
              />
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-lg text-white font-medium transition"
            style={{ backgroundColor: COLORS.primary }}
          >
            Save Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentBankingProfile;