"use client";

import { useState } from "react";
import { Mail, Phone } from "lucide-react";
import { COLORS } from "../../constants/colors";
import { formatDate } from "../../utils/date";

const StudentProfile = ({ student, onUpdate, showToast }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(student);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        user_id: student.id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone_number: formData.phone,
        date_of_birth: formData.dateOfBirth || null,
        gender: formData.gender || null,
        address: formData.address || null,
      };

      const res = await fetch(
        "https://seta-management-api-fvzc9.ondigitalocean.app/api/students/student/profile/update",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        showToast(data.message || "Failed to update profile", "error");
        return;
      }

      const updatedStudent = {
        ...student,
        firstName: data.student.first_name,
        lastName: data.student.last_name,
        email: data.student.email,
        phone: data.student.phone_number,
        dateOfBirth: data.student.date_of_birth,
        gender: data.student.gender,
        address: data.student.address,
      };

      setFormData(updatedStudent);
      setIsEditing(false);

      onUpdate(updatedStudent);
      sessionStorage.setItem("student", JSON.stringify(updatedStudent));

      showToast("Profile updated successfully!", "success");
    } catch (error) {
      console.error("Profile update error:", error);
      showToast("Something went wrong while updating profile", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="rounded-lg p-6 shadow-sm" style={{ backgroundColor: COLORS.bgWhite }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ color: COLORS.primary }}>
            Personal Information
          </h2>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90"
              style={{ backgroundColor: COLORS.primary }}
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90"
                style={{ backgroundColor: COLORS.success }}
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData(student);
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium border hover:bg-gray-100"
                style={{ color: COLORS.text, borderColor: COLORS.border }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              First Name
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={e => handleChange("firstName", e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-2 border rounded-lg disabled:bg-gray-50"
              style={{ borderColor: COLORS.border }}
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={e => handleChange("lastName", e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-2 border rounded-lg disabled:bg-gray-50"
              style={{ borderColor: COLORS.border }}
            />
          </div>

          {/* Student Number */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Student Number
            </label>
            <input
              type="text"
              value={formData.studentNumber}
              disabled
              className="w-full px-4 py-2 border rounded-lg bg-gray-50"
              style={{ borderColor: COLORS.border }}
            />
          </div>

          {/* ID Number */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              ID Number
            </label>
            <input
              type="text"
              value={formData.idNumber}
              disabled
              className="w-full px-4 py-2 border rounded-lg bg-gray-50"
              style={{ borderColor: COLORS.border }}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={e => handleChange("email", e.target.value)}
                disabled={!isEditing}
                className="w-full pl-10 pr-4 py-2 border rounded-lg disabled:bg-gray-50"
                style={{ borderColor: COLORS.border }}
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={formData.phone}
                onChange={e => handleChange("phone", e.target.value)}
                disabled={!isEditing}
                className="w-full pl-10 pr-4 py-2 border rounded-lg disabled:bg-gray-50"
                style={{ borderColor: COLORS.border }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Biographical Information */}
      <div className="rounded-lg p-6 shadow-sm" style={{ backgroundColor: COLORS.bgWhite }}>
        <h2 className="text-xl font-bold mb-6" style={{ color: COLORS.primary }}>
          Biographical Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="date"
            value={formData.dateOfBirth || ""}
            onChange={e => handleChange("dateOfBirth", e.target.value)}
            disabled={!isEditing}
            className="px-4 py-2 border rounded-lg disabled:bg-gray-50"
            style={{ borderColor: COLORS.border }}
          />

          <select
            value={formData.gender || ""}
            onChange={e => handleChange("gender", e.target.value)}
            disabled={!isEditing}
            className="px-4 py-2 border rounded-lg disabled:bg-gray-50"
            style={{ borderColor: COLORS.border }}
          >
            <option value="" disabled>Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <textarea
            rows={3}
            value={formData.address || ""}
            onChange={e => handleChange("address", e.target.value)}
            disabled={!isEditing}
            className="md:col-span-2 px-4 py-2 border rounded-lg resize-none disabled:bg-gray-50"
            style={{ borderColor: COLORS.border }}
            placeholder="Enter your residential address"
          />
        </div>
      </div>

      {/* Academic Information */}
      <div className="rounded-lg p-6 shadow-sm" style={{ backgroundColor: COLORS.bgWhite }}>
        <h2 className="text-xl font-bold mb-6" style={{ color: COLORS.primary }}>
          Academic Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input value={formData.faculty} disabled className="px-4 py-2 border rounded-lg bg-gray-50" />
          <input value={formData.programme} disabled className="px-4 py-2 border rounded-lg bg-gray-50" />
          <input value={formatDate(formData.registrationDate)} disabled className="px-4 py-2 border rounded-lg bg-gray-50" />
          <input value={formData.status} disabled className="px-4 py-2 border rounded-lg bg-gray-50" />
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;