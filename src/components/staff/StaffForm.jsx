import React, { useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { ROUTES } from "../../constants/routes";

export default function StaffForm({ setActivePage }) {
  const [form, setForm] = useState({
    employeeId: "",
    employeeName: "",
    designation: "",
    salary: "",
    pancard: "",
    dateOfJoining: "",
    location: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch("https://attendance-backend-snvv.onrender.com/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      setShowSuccess(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-8"
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-700 text-center">
          Add Staff
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Employee ID", name: "employeeId", type: "text" },
            { label: "Employee Name", name: "employeeName", type: "text" },
            { label: "Designation", name: "designation", type: "text" },
            { label: "Salary", name: "salary", type: "number" },
            { label: "PAN Card", name: "pancard", type: "text" },
            { label: "Date of Joining", name: "dateOfJoining", type: "date" },
            { label: "Location", name: "location", type: "text" },
          ].map((field) => (
            <div
              key={field.name}
              className={field.name === "location" ? "md:col-span-2" : ""}
            >
              <label className="block mb-2 text-gray-600">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-xl"
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={() => setActivePage(ROUTES.STAFF_DASHBOARD)}
            className="flex items-center gap-2 text-blue-600"
          >
            <IoArrowBack size={20} />
            Back
          </button>

          <button
            type="submit"
            className="bg-blue-600 text-white py-3 px-6 rounded-xl"
          >
            Save Staff
          </button>
        </div>
      </form>

      {/* SUCCESS DIALOG */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[330px] text-center">
            <h2 className="text-lg font-semibold mb-4">Staff Added!</h2>

            <button
              onClick={() => (
                setShowSuccess(false),
                setActivePage(ROUTES.STAFF_LIST)
              )}
              className="bg-blue-600 text-white w-full py-2 rounded-lg"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
