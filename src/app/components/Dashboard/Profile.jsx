"use client";

import { useState, useEffect } from "react";
import { Mail, Phone } from "lucide-react";
import { COLORS } from "../../constants/colors";
import { formatDate } from "../../utils/date";

const API_URL =
  "https://seta-management-api-fvzc9.ondigitalocean.app/api/students/student/profile/update";

/* ================= NORMALIZERS ================= */
const apiToForm = (s) => ({
  userId: s.user_id ?? s.id,
  firstName: s.first_name ?? "",
  lastName: s.last_name ?? "",
  email: s.email ?? "",
  phone: s.phone_number ?? "",
  dateOfBirth: s.date_of_birth ?? "",
  gender: s.gender?.toLowerCase() ?? "",
  idNumber: s.ID_number ?? "",
  address: s.address ?? "",
  studentNumber: s.student_number ?? "",
  faculty: s.faculty ?? "",
  programme: s.programme ?? "",
  registrationDate: s.registration_date ?? "",
  status: s.status ?? "",
});

const formToApi = (f) => ({
  user_id: f.userId,
  first_name: f.firstName.trim(),
  last_name: f.lastName.trim(),
  email: f.email.trim().toLowerCase(),
  phone_number: f.phone.trim(),
  date_of_birth: f.dateOfBirth || null,
  gender: f.gender,
  ID_number: f.idNumber,
  address: f.address.trim(),
  student_number: f.studentNumber.trim(),
  faculty: f.faculty.trim(),
  programme: f.programme.trim(),
});

/* ================= VALIDATION ================= */
const validateForm = (f) => {
  if (!f.firstName.trim()) return "First name is required";
  if (!f.lastName.trim()) return "Last name is required";
  if (!f.email.trim()) return "Email is required";
  if (!f.phone.trim()) return "Phone number is required";
  if (!f.studentNumber.trim()) return "Student number is required";
  if (!f.gender) return "Gender is required";
  return null;
};

const StudentProfile = ({ student, onUpdate, showToast }) => {
  const [formData, setFormData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  /* ================= INIT ================= */
  useEffect(() => {
    if (!student) return;
    setFormData(apiToForm(student));
    setApiError(null);
  }, [student]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setApiError(null);
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    const error = validateForm(formData);
    if (error) {
      setApiError(error);
      showToast?.(error, "error");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formToApi(formData)),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Profile update failed");
      }

      const updatedStudent = apiToForm(data);

      // 🔐 AUTH SAFETY CHECK
      if (!updatedStudent.userId || !updatedStudent.email) {
        throw new Error("Invalid profile response from server");
      }

      setFormData(updatedStudent);
      onUpdate?.(updatedStudent);
      setIsEditing(false);
      showToast?.("Profile updated successfully!", "success");
    } catch (err) {
      console.error(err);
      setApiError(err.message);
      showToast?.(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(apiToForm(student));
    setIsEditing(false);
    setApiError(null);
  };

  if (!formData) return null;

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
          <Input label="First Name" value={formData.firstName} disabled={!isEditing}
            onChange={(e) => handleChange("firstName", e.target.value)} />

          <Input label="Last Name" value={formData.lastName} disabled={!isEditing}
            onChange={(e) => handleChange("lastName", e.target.value)} />

          <Input label="Student Number" value={formData.studentNumber} disabled={!isEditing}
            onChange={(e) => handleChange("studentNumber", e.target.value)} />

          <Input label="ID Number" value={formData.idNumber} disabled />

          <IconInput label="Email Address" icon={<Mail className="w-5 h-5 text-gray-400" />}
            value={formData.email} disabled={!isEditing}
            onChange={(e) => handleChange("email", e.target.value)} />

          <IconInput label="Phone Number" icon={<Phone className="w-5 h-5 text-gray-400" />}
            value={formData.phone} disabled={!isEditing}
            onChange={(e) => handleChange("phone", e.target.value)} />
        </Grid>
      </Section>

      <Section title="Biographical Information">
        <Grid>
          <Input type="date" label="Date of Birth" value={formData.dateOfBirth}
            disabled={!isEditing}
            onChange={(e) => handleChange("dateOfBirth", e.target.value)} />

          <Select label="Gender" value={formData.gender} disabled={!isEditing}
            onChange={(e) => handleChange("gender", e.target.value)}
            options={["male", "female", "other"]} />

          <Textarea label="Address" value={formData.address}
            disabled={!isEditing}
            onChange={(e) => handleChange("address", e.target.value)} />
        </Grid>
      </Section>

      <Section title="Academic Information">
        <Grid>
          <Input label="Faculty" value={formData.faculty} disabled={!isEditing}
            onChange={(e) => handleChange("faculty", e.target.value)} />

          <Input label="Programme" value={formData.programme} disabled={!isEditing}
            onChange={(e) => handleChange("programme", e.target.value)} />

          <Input label="Registration Date" value={formatDate(formData.registrationDate)} disabled />
          <Input label="Status" value={formData.status} disabled />
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

const Grid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
);

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
        <option key={opt} value={opt}>{opt}</option>
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