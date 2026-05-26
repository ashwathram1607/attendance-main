import React, { useEffect, useState } from "react";
import axios from "axios";
import GeneratePayslip from "./GeneratePayslip";
import PayslipForm from "./PayslipForm";
import { ROUTES } from "../../constants/routes";
import { useNavigate } from "react-router-dom";

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function SuccessDialog({ message, onConfirm }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded shadow-md w-[320px] text-center">
        <h2 className="text-lg font-semibold mb-3">Confirmation</h2>
        <p className="mb-4">{message}</p>
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

const PayrollDashboard = () => {
  const navigate = useNavigate();

  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editPayslip, setEditPayslip] = useState(null);

  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [showDeleteBox, setShowDeleteBox] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    months[today.getMonth()]
  );
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  const fetchPayslips = async () => {
    try {
      const res = await axios.get("https://attendance-backend-1-pzsj.onrender.com/payslip");
      setPayslips(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayslips();
  }, []);

  // EDIT
  const handleEdit = (p) => {
    setEditPayslip(p);
    setShowForm(true);
  };

  // OPEN DELETE CONFIRM BOX
  const openDeleteBox = (id) => {
    setDeleteId(id);
    setShowDeleteBox(true);
  };

  // CONFIRM DELETE
  const confirmDelete = async () => {
    try {
      await axios.delete(`https://attendance-backend-1-pzsj.onrender.com/payslip/${deleteId}`);
      fetchPayslips();
    } catch (err) {
      console.error(err);
    } finally {
      setShowDeleteBox(false);
      setDeleteId(null);
    }
  };

  const filteredPayslips = payslips.filter(
    (p) =>
      p.month?.toLowerCase() === selectedMonth.toLowerCase() &&
      p.year === selectedYear
  );

  const years = [...new Set(payslips.map((p) => p.year))].sort(
    (a, b) => b - a
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* BACK BUTTON FIXED */}
      <button
        onClick={() => navigate(ROUTES.PAYROLL)}
        className="bg-gray-500 text-white px-4 py-2 rounded mb-4"
      >
        Back
      </button>

      <h1 className="text-3xl font-bold mb-6">Payroll Dashboard</h1>

      {/* FORM */}
      {showForm && (
        <PayslipForm
          editData={editPayslip}
          onSuccess={() => {
            fetchPayslips();
            setShowForm(false);
            setEditPayslip(null);
          }}
        />
      )}

      {/* DELETE CONFIRM BOX */}
      {showDeleteBox && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded shadow-md w-[300px] text-center">
            <h2 className="text-lg font-semibold mb-3">Delete Payslip?</h2>
            <p className="mb-4">Are you sure you want to delete?</p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowDeleteBox(false)}
                className="bg-gray-400 px-4 py-2 text-white rounded"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="bg-blue-700 px-4 py-2 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FILTER */}
      <div className="flex gap-3 mb-4">
        {months.map((m) => (
          <button
            key={m}
            onClick={() => setSelectedMonth(m)}
            className={`px-3 py-1 rounded ${
              selectedMonth === m ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {m.slice(0, 3)}
          </button>
        ))}
      </div>

      {/* TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full bg-white shadow">
          <thead>
            <tr className="bg-gray-200">
              <th>ID</th>
              <th>Name</th>
              <th>Designation</th>
              <th>Salary</th>
              <th>Month</th>
              <th>Year</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredPayslips.map((p) => (
              <tr key={p.id} className="text-center border-b">
                <td>{p.employeeId}</td>
                <td>{p.employeeName}</td>
                <td>{p.designation}</td>
                <td>{p.salary}</td>
                <td>{p.month}</td>
                <td>{p.year}</td>

                <td className="flex gap-2 justify-center p-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="bg-yellow-500 text-white px-2"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => openDeleteBox(p.id)}
                    className="bg-red-500 text-white px-2"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => setSelectedPayslip(p)}
                    className="bg-green-500 text-white px-2"
                  >
                    Generate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* PREVIEW */}
      {selectedPayslip && (
        <div className="mt-6">
          <GeneratePayslip data={selectedPayslip} />
        </div>
      )}
    </div>
  );
};

export default PayrollDashboard;