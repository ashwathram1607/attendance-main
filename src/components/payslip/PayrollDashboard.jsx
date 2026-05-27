import React, { useEffect, useState } from "react";
import axios from "axios";
import GeneratePayslip from "./GeneratePayslip";
import PayslipForm from "./PayslipForm";
import { ROUTES } from "../../constants/routes";
import { useNavigate } from "react-router-dom";

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
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[320px] text-center">
        <h2 className="text-lg font-semibold mb-3 text-green-600">
          Success
        </h2>

        <p className="mb-4">{message}</p>

        <button
          onClick={onConfirm}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
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

  // ✅ Edit existing populated data
  const [editPayslip, setEditPayslip] = useState(null);

  const [showDialog, setShowDialog] = useState(false);

  const [dialogMessage, setDialogMessage] = useState("");

  const [showDeleteBox, setShowDeleteBox] = useState(false);

  const [deleteId, setDeleteId] = useState(null);

  const today = new Date();

  const [selectedMonth, setSelectedMonth] = useState(
    months[today.getMonth()]
  );

  const [selectedYear, setSelectedYear] = useState(
    today.getFullYear()
  );

  // ✅ FETCH PAYSLIPS
  const fetchPayslips = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "https://attendance-backend-1-pzsj.onrender.com/payslip"
      );

      setPayslips(res.data || []);
    } catch (err) {
      console.error("Error fetching payslips:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayslips();
  }, []);

  // ✅ EDIT EXISTING DATA
  const handleEdit = (payslip) => {
    setEditPayslip(payslip);

    setShowForm(true);
  };

  // ✅ DELETE CONFIRM OPEN
  const openDeleteBox = (id) => {
    setDeleteId(id);

    setShowDeleteBox(true);
  };

  // ✅ DELETE PAYSLIP
  const confirmDelete = async () => {
    try {
      await axios.delete(
        `https://attendance-backend-1-pzsj.onrender.com/payslip/${deleteId}`
      );

      await fetchPayslips();

      setDialogMessage("Payslip deleted successfully");

      setShowDialog(true);
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setShowDeleteBox(false);

      setDeleteId(null);
    }
  };

  // ✅ FILTER DATA
  const filteredPayslips = payslips.filter(
    (p) =>
      p.month?.toLowerCase() ===
        selectedMonth.toLowerCase() &&
      Number(p.year) === Number(selectedYear)
  );

  // ✅ YEARS SORT
  const years = [
    ...new Set(payslips.map((p) => Number(p.year))),
  ].sort((a, b) => b - a);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(ROUTES.PAYROLL)}
        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mb-4"
      >
        Back
      </button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">
          Payroll Dashboard
        </h1>

        {/* ✅ GENERATE NEW PAYSLIP */}
        <button
          onClick={() => {
            setEditPayslip(null);

            setShowForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Generate Payslip
        </button>
      </div>

      {/* ✅ SUCCESS POPUP */}
      {showDialog && (
        <SuccessDialog
          message={dialogMessage}
          onConfirm={() => setShowDialog(false)}
        />
      )}

      {/* ✅ FORM */}
      {showForm && (
        <div className="mb-8 bg-white p-4 rounded-xl shadow">

          <PayslipForm
            editData={editPayslip}
            onSuccess={async () => {

              // ✅ Refresh latest data
              await fetchPayslips();

              // ✅ Stay same page
              setShowForm(false);

              // ✅ Clear edit state
              setEditPayslip(null);

              // ✅ Success popup
              setDialogMessage(
                editPayslip
                  ? "Payslip updated successfully"
                  : "Payslip generated successfully"
              );

              setShowDialog(true);
            }}
          />
        </div>
      )}

      {/* DELETE CONFIRM */}
      {showDeleteBox && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-md w-[320px] text-center">

            <h2 className="text-lg font-semibold mb-3">
              Delete Payslip?
            </h2>

            <p className="mb-4">
              Are you sure you want to delete this payslip?
            </p>

            <div className="flex gap-3 justify-center">

              <button
                onClick={() => setShowDeleteBox(false)}
                className="bg-gray-400 hover:bg-gray-500 px-4 py-2 text-white rounded"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 text-white rounded"
              >
                Delete
              </button>

            </div>
          </div>
        </div>
      )}

      {/* FILTERS */}
      <div className="flex flex-wrap gap-3 mb-4">

        {months.map((m) => (
          <button
            key={m}
            onClick={() => setSelectedMonth(m)}
            className={`px-3 py-1 rounded transition ${
              selectedMonth === m
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {m.slice(0, 3)}
          </button>
        ))}

        <select
          value={selectedYear}
          onChange={(e) =>
            setSelectedYear(Number(e.target.value))
          }
          className="border px-3 py-1 rounded"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

      </div>

      {/* TABLE */}
      {loading ? (
        <p className="text-center py-10">
          Loading...
        </p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow">

          <table className="w-full">

            <thead>
              <tr className="bg-gray-200 text-center">

                <th className="p-3">ID</th>

                <th className="p-3">Name</th>

                <th className="p-3">Designation</th>

                <th className="p-3">Net Salary</th>

                <th className="p-3">Month</th>

                <th className="p-3">Year</th>

                <th className="p-3">Action</th>

              </tr>
            </thead>

            <tbody>
              {filteredPayslips.length > 0 ? (
                filteredPayslips.map((p) => (
                  <tr
                    key={p.id}
                    className="text-center border-b hover:bg-gray-50"
                  >

                    <td className="p-3">
                      {p.employeeId}
                    </td>

                    <td className="p-3">
                      {p.employeeName}
                    </td>

                    <td className="p-3">
                      {p.designation}
                    </td>

                    <td className="p-3">
                      ₹{p.netSalary}
                    </td>

                    <td className="p-3">
                      {p.month}
                    </td>

                    <td className="p-3">
                      {p.year}
                    </td>

                    <td className="p-3 flex gap-2 justify-center">

                      <button
                        onClick={() => handleEdit(p)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => openDeleteBox(p.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>

                      <button
                        onClick={() => setSelectedPayslip(p)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Generate
                      </button>

                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="p-6 text-center text-gray-500"
                  >
                    No payslips found
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
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