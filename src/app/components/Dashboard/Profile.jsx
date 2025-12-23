"use client";

import { useState, useEffect } from "react";
import { Mail, Phone } from "lucide-react";
import { COLORS } from "../../constants/colors";
import { formatDate } from "../../utils/date";

const StudentProfile = ({ student, onUpdate, showToast }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(student || {});

  // 🔄 Keep local state in sync if parent student changes
  useEffect(() => {
    setFormData(student || {});
  }, [student]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    // ✅ SAFETY CHECKS (prevents "l is not a function")
    if (typeof onUpdate === "function") {
      onUpdate(formData);
    } else {
      console.warn("onUpdate is not a function:", onUpdate);
    }

    setIsEditing(false);

    if (typeof showToast === "function") {
      showToast("Profile updated successfully!", "success");
    } else {
      console.warn("showToast is not a function:", showToast);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(student || {});
  };

  return (
    <div className="space-y-6">
      {/* ================= PERSONAL INFO ================= */}
      <div
        className="rounded-lg p-6 shadow-sm"
        style={{ backgroundColor: COLORS.bgWhite }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ color: COLORS.primary }}>
            Personal Information
          </h2>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-lg text-white text-sm font-medium"
              style={{ backgroundColor: COLORS.primary }}
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                style={{ backgroundColor: COLORS.success }}
              >
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg text-sm font-medium border"
                style={{ color: COLORS.text, borderColor: COLORS.border }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="First Name"
            value={formData.firstName || ""}
            disabled={!isEditing}
            onChange={(e) => handleChange("firstName", e.target.value)}
          />

          <Input
            label="Last Name"
            value={formData.lastName || ""}
            disabled={!isEditing}
            onChange={(e) => handleChange("lastName", e.target.value)}
          />

          <Input label="Student Number" value={formData.studentNumber || ""} disabled />
          <Input label="ID Number" value={formData.idNumber || ""} disabled />

          <IconInput
            label="Email Address"
            icon={<Mail className="w-5 h-5 text-gray-400" />}
            value={formData.email || ""}
            disabled={!isEditing}
            onChange={(e) => handleChange("email", e.target.value)}
          />

          <IconInput
            label="Phone Number"
            icon={<Phone className="w-5 h-5 text-gray-400" />}
            value={formData.phone || ""}
            disabled={!isEditing}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </div>
      </div>

      {/* ================= BIOGRAPHICAL ================= */}
      <div
        className="rounded-lg p-6 shadow-sm"
        style={{ backgroundColor: COLORS.bgWhite }}
      >
        <h2 className="text-xl font-bold mb-6" style={{ color: COLORS.primary }}>
          Biographical Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Date of Birth"
            type="date"
            value={formData.dateOfBirth || ""}
            disabled={!isEditing}
            onChange={(e) => handleChange("dateOfBirth", e.target.value)}
          />

          <Select
            label="Gender"
            value={formData.gender || ""}
            disabled={!isEditing}
            onChange={(e) => handleChange("gender", e.target.value)}
            options={["Male", "Female", "Other"]}
          />

          <Textarea
            label="Address"
            value={formData.address || ""}
            disabled={!isEditing}
            onChange={(e) => handleChange("address", e.target.value)}
          />
        </div>
      </div>

      {/* ================= ACADEMIC ================= */}
      <div
        className="rounded-lg p-6 shadow-sm"
        style={{ backgroundColor: COLORS.bgWhite }}
      >
        <h2 className="text-xl font-bold mb-6" style={{ color: COLORS.primary }}>
          Academic Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Faculty" value={formData.faculty || ""} disabled />
          <Input label="Programme" value={formData.programme || ""} disabled />
          <Input
            label="Registration Date"
            value={formatDate(formData.registrationDate)}
            disabled
          />
          <Input label="Status" value={formData.status || ""} disabled />
        </div>
      </div>
    </div>
  );
};

/* ================= REUSABLE COMPONENTS ================= */

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-2 text-gray-700">
      {label}
    </label>
    <input
      {...props}
      className="w-full px-4 py-2 border rounded-lg bg-gray-50"
      style={{ borderColor: COLORS.border }}
    />
  </div>
);

const IconInput = ({ label, icon, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-2 text-gray-700">
      {label}
    </label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2">
        {icon}
      </span>
      <input
        {...props}
        className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50"
        style={{ borderColor: COLORS.border }}
      />
    </div>
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-2 text-gray-700">
      {label}
    </label>
    <select
      {...props}
      className="w-full px-4 py-2 border rounded-lg bg-gray-50"
      style={{ borderColor: COLORS.border }}
    >
      <option value="" disabled>
        Select {label.toLowerCase()}
      </option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div className="md:col-span-2">
    <label className="block text-sm font-medium mb-2 text-gray-700">
      {label}
    </label>
    <textarea
      {...props}
      rows={3}
      className="w-full px-4 py-2 border rounded-lg bg-gray-50 resize-none"
      style={{ borderColor: COLORS.border }}
    />
  </div>
);

export default StudentProfile;