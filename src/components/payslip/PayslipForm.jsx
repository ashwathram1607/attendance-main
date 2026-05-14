import React, { useEffect, useState } from "react";
import axios from "axios";
import { ROUTES } from "../../constants/routes";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://attendance-backend-1-pzsj.onrender.com/payslip"

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

function SuccessDialog({ message, onConfirm }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[320px] text-center">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Success</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
          onClick={onConfirm}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md w-full"
        >
          OK
        </button>
      </div>
    </div>
  );
}

export default function PayslipForm({ editData }) {
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

  // ================= FETCH EMPLOYEES =================
  useEffect(() => {
    const fetchAllEmployees = async () => {
      try {
        const [staffRes, usersRes] = await Promise.all([
          axios.get(`${BASE_URL}/staff`),
          axios.get(`${BASE_URL}/users`)
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
          employeeId: u.employeeId,
          employeeName: `${u.name} (User)`,
          designation: u.designation,
          salary: u.salary || 0,
          panCard: u.panCard || u.pancard || "",
          dateOfJoining: u.dateOfJoining,
        }));

        setAllEmployees([...staffData, ...usersData]);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAllEmployees();
  }, []);

  // ================= PERFECT EDIT PREFILL =================
  useEffect(() => {
    if (!editData || allEmployees.length === 0) return;

    const empId =
      editData.employeeId ||
      editData.employee_id ||
      editData.empId ||
      "";

    const matchedEmployee = allEmployees.find(
      (emp) => String(emp.employeeId) === String(empId)
    );

    setForm({
      selectedEmployeeId: matchedEmployee?.id || "",
      employeeType: editData.employeeType || matchedEmployee?.type || "",

      employeeId:
        empId ||
        matchedEmployee?.employeeId ||
        "",

      employeeName:
        editData.employeeName ||
        matchedEmployee?.employeeName ||
        "",

      designation:
        editData.designation ||
        matchedEmployee?.designation ||
        "",

      //  NEVER EMPTY
      salary:
        editData.salary ??
        matchedEmployee?.salary ??
        "",

      bonus: editData.bonus ?? "",

      //  HANDLE ALL CASES
      panCard:
        editData.panCard ??
        editData.pancard ??
        matchedEmployee?.panCard ??
        "",

      dateOfJoining:
        editData.dateOfJoining ??
        matchedEmployee?.dateOfJoining ??
        "",

      month: editData.month ?? currentMonth,
      year: editData.year ?? currentYear,
      payableDays: editData.payableDays ?? "",
      paidDays: editData.paidDays ?? "",
    });

  }, [editData, allEmployees]);

  // ================= HANDLERS =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEmployeeChange = (e) => {
    const selected = allEmployees.find(emp => emp.id === e.target.value);

    if (selected) {
      setForm(prev => ({
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

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.employeeId) {
      setDialogMessage("Employee ID missing!");
      setShowDialog(true);
      return;
    }

    if (!form.salary || !form.payableDays || !form.paidDays) {
      setDialogMessage("Please fill required fields!");
      setShowDialog(true);
      return;
    }

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

      if (editData) {
        await axios.put(`${BASE_URL}/payslip/${editData.id}`, payload);
        setDialogMessage("Payslip updated successfully!");
      } else {
        await axios.post(`${BASE_URL}/payslip`, payload);
        setDialogMessage("Payslip added successfully!");
      }

      setShowDialog(true);
    } catch (err) {
      console.error(err);
      setDialogMessage("Something went wrong!");
      setShowDialog(true);
    }
  };

  // ================= UI =================
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
        <form onSubmit={handleSubmit} className="w-full max-w-3xl bg-white p-8 rounded-3xl shadow-xl">

          <button
            type="button"
            onClick={() => navigate(ROUTES.PAYROLL)}
            className="bg-gray-500 text-white px-4 py-2 rounded mb-4"
          >
            Back
          </button>

          <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
            {editData ? "Edit Payslip" : "Add Payslip"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div className="md:col-span-2">
              <label className="block mb-2 text-gray-600">Employee Name *</label>
              <select value={form.selectedEmployeeId} onChange={handleEmployeeChange} className="w-full p-3 border rounded-xl">
                <option value="">Select Employee</option>
                {allEmployees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.employeeName}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Employee ID</label>
              <input value={form.employeeId} readOnly className="p-3 border rounded-xl w-full bg-gray-100"/>
            </div>

            <div>
              <label>Designation</label>
              <input name="designation" value={form.designation} onChange={handleChange} className="p-3 border rounded-xl w-full"/>
            </div>

            <div>
              <label>Salary *</label>
              <input name="salary" type="number" value={form.salary} onChange={handleChange} className="p-3 border rounded-xl w-full"/>
            </div>

            <div>
              <label>Bonus</label>
              <input name="bonus" type="number" value={form.bonus} onChange={handleChange} className="p-3 border rounded-xl w-full"/>
            </div>

            <div>
              <label>PAN Card</label>
              <input name="panCard" value={form.panCard} onChange={handleChange} className="p-3 border rounded-xl w-full"/>
            </div>

            <div>
              <label>Date of Joining</label>
              <input name="dateOfJoining" type="date" value={form.dateOfJoining} onChange={handleChange} className="p-3 border rounded-xl w-full"/>
            </div>

            <div>
              <label>Month</label>
              <select name="month" value={form.month} onChange={handleChange} className="p-3 border rounded-xl w-full">
                {months.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>

            <div>
              <label>Year</label>
              <input name="year" value={form.year} onChange={handleChange} className="p-3 border rounded-xl w-full"/>
            </div>

            <div>
              <label>Payable Days *</label>
              <input name="payableDays" type="number" value={form.payableDays} onChange={handleChange} className="p-3 border rounded-xl w-full"/>
            </div>

            <div>
              <label>Paid Days *</label>
              <input name="paidDays" type="number" value={form.paidDays} onChange={handleChange} className="p-3 border rounded-xl w-full"/>
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