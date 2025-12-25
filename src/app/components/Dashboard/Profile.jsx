"use client";

import { useState, useEffect } from "react";
import { Mail, Phone } from "lucide-react";
import { COLORS } from "../../constants/colors";
import { formatDate } from "../../utils/date";

const API_URL =
  "https://seta-management-api-fvzc9.ondigitalocean.app/api/students/student/profile/update";

const StudentProfile = ({ student, onUpdate, showToast }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    setFormData(student || {});
    setApiError(null);
  }, [student]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setApiError(null);
  };

  const handleSave = async () => {
    const userId = formData.user_id || formData.id;

    if (!userId) {
      setApiError("Missing student ID");
      return;
    }

    setLoading(true);

    /* ================= PAYLOAD (BACKEND SAFE) ================= */
    const payload = {
      user_id: userId,
      first_name: formData.firstName.trim(),
      last_name: formData.lastName.trim(),
      email: formData.email.trim(),
      phone_number: formData.phone.trim(),
      date_of_birth: formData.dateOfBirth,
      gender: formData.gender.toLowerCase(),
      ID_number: formData.idNumber.trim(), //FIXED
      address: formData.address.trim(),
      student_number: formData.studentNumber.trim(),
      faculty: formData.faculty.trim(),
      programme: formData.programme?.trim(),
    };

    // Remove empty / undefined fields
    Object.keys(payload).forEach(
      (key) =>
        (payload[key] === undefined ||
          payload[key] === null ||
          payload[key] === "") &&
        delete payload[key]
    );

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setApiError(data?.message || "Input payload validation failed");
        showToast?.(data?.message || "Profile update failed", "error");
        return;
      }

      onUpdate?.(data.student);
      setIsEditing(false);
      setApiError(null);
      showToast?.("Profile updated successfully", "success");
    } catch (err) {
      console.error(err);
      setApiError("Server error while updating profile");
      showToast?.("Server error while updating profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(student || {});
    setApiError(null);
  };

  return (
    <div className="space-y-6">
      <Section
        title="Personal Information"
        action={
          !isEditing ? (
            <PrimaryButton onClick={() => setIsEditing(true)}>
              Edit Profile
            </PrimaryButton>
          ) : (
            <div className="flex gap-2">
              <SuccessButton onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </SuccessButton>
              <SecondaryButton onClick={handleCancel}>
                Cancel
              </SecondaryButton>
            </div>
          )
        }
      >
        {apiError && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-700 border border-red-300">
            {apiError}
          </div>
        )}

        <Grid>
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
          <Input label="Student Number"
           value={formData.studentNumber || ""}
           disabled={!isEditing}
           onChange={(e) => handleChange("studentNumber", e.target.value)}
          />

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
        </Grid>
      </Section>

      <Section title="Biographical Information">
        <Grid>
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
        </Grid>
      </Section>

      <Section title="Academic Information">
        <Grid>
          <Input label="Faculty" value={formData.faculty || ""}  />
          <Input label="Programme" value={formData.programme || ""} />
          <Input
            label="Registration Date"
            value={formatDate(formData.registrationDate)}
            disabled
          />
          <Input label="Status" value={formData.status || ""} disabled />
        </Grid>
      </Section>
    </div>
  );
};

/* ================= UI HELPERS ================= */
const Section = ({ title, action, children }) => (
  <div className="rounded-lg p-6 shadow-sm" style={{ backgroundColor: COLORS.bgWhite }}>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-bold" style={{ color: COLORS.primary }}>
        {title}
      </h2>
      {action}
    </div>
    {children}
  </div>
);

const Grid = ({ children }) => <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>;

const ButtonBase = ({ children, ...props }) => (
  <button {...props} className="px-4 py-2 rounded-lg text-sm font-medium">
    {children}
  </button>
);

const PrimaryButton = (props) => (
  <ButtonBase {...props} style={{ backgroundColor: COLORS.primary, color: "#fff" }} />
);
const SuccessButton = (props) => (
  <ButtonBase {...props} style={{ backgroundColor: COLORS.success, color: "#fff" }} />
);
const SecondaryButton = (props) => (
  <ButtonBase {...props} style={{ border: `1px solid ${COLORS.border}`, color: COLORS.text }} />
);

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-2 text-gray-700">{label}</label>
    <input {...props} className="w-full px-4 py-2 border rounded-lg bg-gray-50" />
  </div>
);
const IconInput = ({ label, icon, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-2 text-gray-700">{label}</label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</span>
      <input {...props} className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50" />
    </div>
  </div>
);
const Select = ({ label, options, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-2 text-gray-700">{label}</label>
    <select {...props} className="w-full px-4 py-2 border rounded-lg bg-gray-50">
      <option value="">Select {label.toLowerCase()}</option>
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
    <label className="block text-sm font-medium mb-2 text-gray-700">{label}</label>
    <textarea {...props} rows={3} className="w-full px-4 py-2 border rounded-lg bg-gray-50" />
  </div>
);

export default StudentProfile;