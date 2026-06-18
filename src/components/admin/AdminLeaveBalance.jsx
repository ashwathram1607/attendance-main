import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const BASE_URL = "https://attendance-backend-1-pzsj.onrender.com";

export default function AdminLeaveBalance({
  data,
  users = [],
  onBack,
}) {
  const [balances, setBalances] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [selectedUser, setSelectedUser] = useState("All");

  useEffect(() => {
    setBalances(data || []);
  }, [data]);

  // unique users
  const validUsers = useMemo(() => {
    return [...new Set(balances.map((b) => b.name).filter(Boolean))].sort();
  }, [balances]);

  // sorting
  const sortedBalances = useMemo(() => {
    return [...balances].sort((a, b) => b.id - a.id);
  }, [balances]);

  // filtering
  const filteredBalances = useMemo(() => {
    return selectedUser === "All"
      ? sortedBalances
      : sortedBalances.filter((b) => b.name === selectedUser);
  }, [sortedBalances, selectedUser]);

  // ✅ FIXED: update by ID (NO INDEX)
  const handleChange = (id, field, value) => {
    setBalances((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, [field]: Number(value) }
          : b
      )
    );
  };

  const handleEdit = (id) => {
    setEditingRow(id);
  };

  // save fix
  const handleSave = async (id) => {
    try {
      const employee = balances.find((b) => b.id === id);

      const url = `${BASE_URL}/leaves/balance/${encodeURIComponent(
        employee.name
      )}`;

      const payload = {
        sickLeave: Number(employee.sickLeave),
        personalLeave: Number(employee.personalLeave),
        earnedLeave: Number(employee.earnedLeave),
        maternityLeave: Number(employee.maternityLeave),
      };

      await axios.put(url, payload);

      alert("Leave balance updated successfully");
      setEditingRow(null);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  // export excel
  const exportToExcel = () => {
    const exportData = filteredBalances.map((employee) => ({
      Employee: employee.name,
      SickLeave: employee.sickLeave,
      PersonalLeave: employee.personalLeave,
      EarnedLeave: employee.earnedLeave,
      MaternityLeave: employee.maternityLeave,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Leave Balances"
    );

    XLSX.writeFile(workbook, "Employee_Leave_Balances.xlsx");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* TITLE */}
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
        Employee Leave Balances
      </h2>

      {/* TOP CONTROLS */}
      <div className="grid grid-cols-3 items-center mb-6">
        {/* BACK */}
        <div className="flex justify-start">
          <button
            onClick={onBack}
            className="bg-gray-500 text-white px-5 py-2 rounded-lg hover:bg-gray-600"
          >
            Back
          </button>
        </div>

        {/* FILTER */}
        <div className="flex justify-center">
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg shadow-sm min-w-[220px]"
          >
            <option value="All">All Users</option>
            {validUsers.map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>
        </div>

        {/* EXPORT */}
        <div className="flex justify-end">
          <button
            onClick={exportToExcel}
            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
          >
            Export to Excel
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg p-6">
        <table className="w-full border border-gray-200">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-3">Employee</th>
              <th className="p-3">Sick Leave</th>
              <th className="p-3">Personal Leave</th>
              <th className="p-3">Earned Leave</th>
              <th className="p-3">Maternity Leave</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredBalances.length > 0 ? (
              filteredBalances.map((employee) => (
                <tr
                  key={employee.id}
                  className="hover:bg-blue-50 text-center"
                >
                  {/* NAME */}
                  <td className="p-3 border border-gray-200">
                    {employee.name}
                  </td>

                  {/* SICK */}
                  <td className="p-3 border border-gray-200">
                    {editingRow === employee.id ? (
                      <input
                        type="number"
                        value={employee.sickLeave}
                        onChange={(e) =>
                          handleChange(
                            employee.id,
                            "sickLeave",
                            e.target.value
                          )
                        }
                        className="w-20 text-center p-2 border-2 border-red-400 bg-red-50 rounded-lg"
                      />
                    ) : (
                      employee.sickLeave
                    )}
                  </td>

                  {/* PERSONAL */}
                  <td className="p-3 border border-gray-200">
                    {editingRow === employee.id ? (
                      <input
                        type="number"
                        value={employee.personalLeave}
                        onChange={(e) =>
                          handleChange(
                            employee.id,
                            "personalLeave",
                            e.target.value
                          )
                        }
                        className="w-20 text-center p-2 border-2 border-purple-400 bg-purple-50 rounded-lg"
                      />
                    ) : (
                      employee.personalLeave
                    )}
                  </td>

                  {/* EARNED */}
                  <td className="p-3 border border-gray-200">
                    {editingRow === employee.id ? (
                      <input
                        type="number"
                        value={employee.earnedLeave}
                        onChange={(e) =>
                          handleChange(
                            employee.id,
                            "earnedLeave",
                            e.target.value
                          )
                        }
                        className="w-20 text-center p-2 border-2 border-green-400 bg-green-50 rounded-lg"
                      />
                    ) : (
                      employee.earnedLeave
                    )}
                  </td>

                  {/* MATERNITY */}
                  <td className="p-3 border border-gray-200">
                    {editingRow === employee.id ? (
                      <input
                        type="number"
                        value={employee.maternityLeave}
                        onChange={(e) =>
                          handleChange(
                            employee.id,
                            "maternityLeave",
                            e.target.value
                          )
                        }
                        className="w-20 text-center p-2 border-2 border-pink-400 bg-pink-50 rounded-lg"
                      />
                    ) : (
                      employee.maternityLeave
                    )}
                  </td>

                  {/* ACTION */}
                  <td className="p-3 border border-gray-200">
                    {editingRow === employee.id ? (
                      <button
                        onClick={() => handleSave(employee.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(employee.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center p-6 text-gray-500"
                >
                  No Leave Balances Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}