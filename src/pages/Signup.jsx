import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SignupForm from "../pages/SignupForm";
import DialogBox from "../pages/Login/DialogBox";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    Password: "",
    Role: "",
    Designation: "",
    EmployeeId: "",
    DateOfJoining: "", // ✅ added
  });

  const [dialog, setDialog] = useState({ isOpen: false, message: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, [navigate]);

  const signupMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axios.post(
        "https://attendance-backend-1-eohz.onrender.com",
        {
          name: data.Name,
          email: data.Email,
          password: data.Password,
          role: data.Role,
          designation: data.Designation,
          employeeId: data.EmployeeId,
          dateOfJoining: data.DateOfJoining, // ✅ send to backend
        },
      );
      return res.data;
    },
    onSuccess: () => {
      setDialog({
        isOpen: true,
        message: "🎉 Signup successful! Redirecting...",
      });
      setTimeout(() => navigate("/"), 1200);
    },
    onError: (error) => {
      console.log("ERROR 👉", error.response?.data);

      setDialog({
        isOpen: true,
        message:
          error.response?.data?.message ||
          "❌ Signup failed. Please try again.",
      });
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signupMutation.mutate(formData);
  };

  return (
    <>
      <SignupForm
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        formData={formData}
      />

      <DialogBox
        isOpen={dialog.isOpen}
        message={dialog.message}
        onClose={() => setDialog({ isOpen: false, message: "" })}
      />
    </>
  );
}
