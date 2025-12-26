"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { COLORS } from "../../constants/colors";

const apiToForm = (student) => ({
  dateOfBirth: student?.date_of_birth ?? "",
  gender: student?.gender?.toLowerCase() ?? "",
  address: student?.address ?? "",
});

const StudentBiographic = ({ student, onUpdate, showToast }) => {
  const [formData, setFormData] = useState({
    dateOfBirth: "",
    gender: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (student) {
      setFormData(apiToForm(student));
      setErrors({});
    }
  }, [student]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.dateOfBirth) errs.dateOfBirth = "Date of birth is required";
    if (!formData.gender) errs.gender = "Gender is required";
    if (!formData.address.trim()) errs.address = "Address is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      showToast?.("Please complete all required fields", "error");
      return;
    }

    if (!student?.user_id && !student?.id) {
      showToast?.("Missing student ID", "error");
      return;
    }

    setLoading(true);

    const payload = {
      user_id: student.user_id || student.id,
      date_of_birth: formData.dateOfBirth,
      gender: formData.gender,
      address: formData.address.trim(),
    };

    try {
      const res = await axios.post(
        "https://seta-management-api-fvzc9.ondigitalocean.app/api/students/edit-student",
        payload
      );

      if (res.status === 200) {
        const updatedStudent = {
          ...student,
          ...res.data,
        };
        setFormData(apiToForm(updatedStudent));
        onUpdate?.(updatedStudent);
        showToast?.(res.data.message || "Profile updated successfully", "success");
        setErrors({});
      }
    } catch (err) {
      console.error("Update error:", err);

      // Backend field-specific errors
      if (err.response?.data?.errors) {
        const backendErrors = err.response.data.errors;
        const fieldErrors = {};
        Object.keys(backendErrors).forEach((key) => {
          // Map backend field to formData key if necessary
          if (key === "date_of_birth") fieldErrors.dateOfBirth = backendErrors[key][0];
          else if (key === "gender") fieldErrors.gender = backendErrors[key][0];
          else if (key === "address") fieldErrors.address = backendErrors[key][0];
        });
        setErrors(fieldErrors);
      }

      // Show general message
      const message = err.response?.data?.message;
      if (message) showToast?.(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Section
        title="Biographical Details"
        action={
          <SuccessButton onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </SuccessButton>
        }
      >
        <Grid>
          <Field label="Date of Birth" error={errors.dateOfBirth}>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleChange("dateOfBirth", e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-gray-50"
              style={{ borderColor: COLORS.border }}
            />
          </Field>

          <Field label="Gender" error={errors.gender}>
            <select
              value={formData.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-gray-50"
              style={{ borderColor: COLORS.border }}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </Field>

          <Field label="Address" error={errors.address} full>
            <textarea
              rows={3}
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-gray-50"
              style={{ borderColor: COLORS.border }}
            />
          </Field>
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

const Field = ({ label, error, children, full }) => (
  <div className={full ? "md:col-span-2" : ""}>
    <label className="block text-sm font-medium mb-2 text-gray-700">{label}</label>
    {children}
    {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
  </div>
);

const ButtonBase = ({ children, ...props }) => (
  <button
    {...props}
    className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-60"
  >
    {children}
  </button>
);

const SuccessButton = (props) => (
  <ButtonBase {...props} style={{ backgroundColor: COLORS.success, color: "#fff" }} />
);

export default StudentBiographic;