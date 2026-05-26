import React, { useEffect, useState } from "react";
import axios from "axios";
import { ROUTES } from "../../constants/routes";

function getTodayDate() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function PermissionRequestForm({ setActivePage }) {
  const [formData, setFormData] = useState({
    name: "",
    date: getTodayDate(),
    startTime: "",
    endTime: "",
    reason: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("name") || "";
    setFormData((prev) => ({ ...prev, name: storedName }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.startTime || !formData.endTime || !formData.reason) {
      alert("Please fill all fields before submitting");
      return;
    }

    if (formData.startTime >= formData.endTime) {
      alert("End time must be after start time");
      return;
    }

    try {
      await axios.post(
        "https://attendance-backend-1-pzsj.onrender.com/permission",
        formData,
      );
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        setFormData({
          name: localStorage.getItem("name") || "",
          date: getTodayDate(),
          startTime: "",
          endTime: "",
          reason: "",
        });
      }, 4000);
    } catch (error) {
      console.error("Error submitting permission:", error);
      alert("Error submitting permission request. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-blue-100 to-blue-300 px-4 pt-8">
      {/* Back Button */}
      <div className="w-full max-w-md mb-6">
        <button
          type="button"
          onClick={() => setActivePage(ROUTES.PERMISSIONDASHBOARD)}
          className="bg-gray-500 text-white px-4 py-2 rounded-xl hover:bg-gray-600 transition"
        >
          Back
        </button>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8"
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-700 text-center">
          Permission Request Form
        </h2>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-4 text-center text-green-600 font-semibold">
            ✅ Permission request submitted successfully!
          </div>
        )}

        {/* Employee Name */}
        <div className="mb-4">
          <label className="block mb-2 text-gray-600">
            Employee Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-700 cursor-not-allowed"
          />
        </div>

        {/* Date */}
        <div className="mb-4">
          <label className="block mb-2 text-gray-600">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            max={getTodayDate()}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        {/* Start & End Time */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label className="block mb-2 text-gray-600">
              Start Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-2 text-gray-600">
              End Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
        </div>

        {/* Reason */}
        <div className="mb-4">
          <label className="block mb-2 text-gray-600">
            Reason for Permission <span className="text-red-500">*</span>
          </label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows="3"
            required
            placeholder="Enter reason for permission..."
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition mt-6"
        >
          Submit Permission Request
        </button>
      </form>
    </div>
  );
}
