import React, { useEffect, useState } from "react";
import axios from "axios";
import { ROUTES } from "../../constants/routes";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://attendance-backend-1-pzsj.onrender.com";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function SuccessDialog({ message, onConfirm }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[320px] text-center">
        <h2 className="text-lg font-semibold mb-4">Success</h2>
        <p className="mb-6">{message}</p>
        <button
          onClick={onConfirm}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          OK
        </button>
      </div>
    </div>
  );
}

export default function PayslipForm({ editData, onSuccess }) {
  const navigate = useNavigate();

  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [allEmployees, setAllEmployees] = useState([]);

  const now = new Date();
  const currentMonth = now.toLocaleString("en-US", { month: "long" });
  const currentYear = now.getFullYear();

  const [form, setForm] = useState({
    selectedEmployeeId: "",
    employeeType: "",
    employeeId: "",
    employeeName: "",
    designation: "",
    salary: "",
    bonus: "",
    panCard: "",
    dateOfJoining: "",
    month: currentMonth,
    year: currentYear,
    payableDays: "",
    paidDays: "",
  });

  useEffect(() => {
    const fetchAllEmployees = async () => {
      try {
        const [staffRes, usersRes] = await Promise.all([
          axios.get(`${BASE_URL}/staff`),
          axios.get(`${BASE_URL}/users`),
        ]);

        const staffData = staffRes.data.map((s) => ({
          id: `staff-${s.id}`,
          type: "staff",
          employeeId: s.employeeId,
          employeeName: `${s.employeeName} (Staff)`,
          designation: s.designation,
          salary: s.salary || 0,
          panCard: s.panCard || s.pancard || "",
          dateOfJoining: s.dateOfJoining,
        }));

        const usersData = usersRes.data.map((u) => ({
          id: `user-${u.id}`,
          type: "user",
          employeeId: u.id,
          employeeName: `${u.name} (User)`,
          designation: u.designation,
          salary: u.salary || 0,
          panCard: u.panCard || u.pancard || "",
          dateOfJoining: u.dateOfJoining,
        }));

        setAllEmployees([...staffData, ...usersData]);
      } catch (err) {
        console.error("Employee fetch error:", err);
      }
    };

    fetchAllEmployees();
  }, []);

  useEffect(() => {
    if (!editData || allEmployees.length === 0) return;

    const empId =
      editData.employeeId || editData.employee_id || editData.empId || "";

    const matched = allEmployees.find(
      (e) => String(e.employeeId) === String(empId)
    );

    setForm({
      selectedEmployeeId: matched?.id || "",
      employeeType: editData.employeeType || matched?.type || "",
      employeeId: empId || matched?.employeeId || "",
      employeeName: editData.employeeName || matched?.employeeName || "",
      designation: editData.designation || matched?.designation || "",
      salary: editData.salary ?? matched?.salary ?? "",
      bonus: editData.bonus ?? "",
      panCard: editData.panCard ?? editData.pancard ?? matched?.panCard ?? "",
      dateOfJoining: editData.dateOfJoining ?? matched?.dateOfJoining ?? "",
      month: editData.month ?? currentMonth,
      year: editData.year ?? currentYear,
      payableDays: editData.payableDays ?? "",
      paidDays: editData.paidDays ?? "",
    });
  }, [editData, allEmployees]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEmployeeChange = (e) => {
    const selected = allEmployees.find((emp) => emp.id === e.target.value);

    if (selected) {
      setForm((prev) => ({
        ...prev,
        selectedEmployeeId: selected.id,
        employeeType: selected.type,
        employeeId: selected.employeeId,
        employeeName: selected.employeeName,
        designation: selected.designation,
        salary: selected.salary,
        panCard: selected.panCard,
        dateOfJoining: selected.dateOfJoining,
      }));
    }
  };

  const safeNumber = (val) => (isNaN(Number(val)) ? 0 : Number(val));

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        employeeId: Number(form.employeeId),
        employeeName: form.employeeName,
        designation: form.designation,
        salary: safeNumber(form.salary),
        bonus: safeNumber(form.bonus),
        panCard: form.panCard || null,
        dateOfJoining: form.dateOfJoining,
        month: form.month,
        year: Number(form.year),
        payableDays: safeNumber(form.payableDays),
        paidDays: safeNumber(form.paidDays),
      };

      let res;

      if (editData) {
        const id = editData.id || editData._id;
        res = await axios.put(`${BASE_URL}/payslip/${id}`, payload);
        setDialogMessage("Payslip updated successfully!");
      } else {
        res = await axios.post(`${BASE_URL}/payslip`, payload);
        setDialogMessage("Payslip created successfully!");
      }

      if (onSuccess) {
        await onSuccess(res.data);
      }

      setShowDialog(true);
    } catch (err) {
      console.error("Submit error:", err);
      setDialogMessage("Something went wrong!");
      setShowDialog(true);
    }
  };

  return (
    <>
      {showDialog && (
        <SuccessDialog
          message={dialogMessage}
          onConfirm={() => {
            setShowDialog(false);
            navigate(ROUTES.PAYROLL_DASHBOARD);
          }}
        />
      )}

      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-3xl bg-white p-8 rounded-3xl shadow-xl"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            {editData ? "Edit Payslip" : "Add Payslip"}
          </h2>

          <button
            type="button"
            onClick={() => navigate(ROUTES.PAYROLL)}
            className="bg-gray-500 text-white px-4 py-2 rounded mb-4"
          >
            Back
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block mb-2 text-gray-600">Employee</label>
              <select
                value={form.selectedEmployeeId}
                onChange={handleEmployeeChange}
                className="w-full p-3 border rounded-xl"
              >
                <option value="">Select Employee</option>
                {allEmployees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.employeeName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-gray-600">Employee ID</label>
              <input
                name="employeeId"
                value={form.employeeId}
                readOnly
                className="p-3 border rounded-xl w-full bg-gray-100"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-600">Designation</label>
              <input
                name="designation"
                value={form.designation}
                onChange={handleChange}
                className="p-3 border rounded-xl w-full"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-600">Salary</label>
              <input
                name="salary"
                type="number"
                value={form.salary}
                onChange={handleChange}
                className="p-3 border rounded-xl w-full"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-600">Bonus</label>
              <input
                name="bonus"
                type="number"
                value={form.bonus}
                onChange={handleChange}
                className="p-3 border rounded-xl w-full"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-600">PAN Card</label>
              <input
                name="panCard"
                value={form.panCard}
                onChange={handleChange}
                className="p-3 border rounded-xl w-full"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-600">Payable Days</label>
              <input
                name="payableDays"
                type="number"
                value={form.payableDays}
                onChange={handleChange}
                className="p-3 border rounded-xl w-full"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-600">Paid Days</label>
              <input
                name="paidDays"
                type="number"
                value={form.paidDays}
                onChange={handleChange}
                className="p-3 border rounded-xl w-full"
              />
            </div>
          </div>

          <button className="w-full bg-blue-600 text-white py-3 rounded-xl mt-6">
            {editData ? "Update Payslip" : "Submit Payslip"}
          </button>
        </form>
      </div>
    </>
  );
}