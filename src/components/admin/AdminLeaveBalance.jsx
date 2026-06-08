import React, { useState, useEffect } from "react";
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

  const validUsers = [
    ...new Set(
      balances
        .map((b) => b.name)
        .filter(Boolean)
    ),
  ].sort();

  // FILTER LOGIC
  const filteredBalances =
    selectedUser === "All"
      ? balances
      : balances.filter(
          (b) => b.name === selectedUser
        );

  const handleChange = (index, field, value) => {
    const updated = [...balances];

    updated[index] = {
      ...updated[index],
      [field]: Number(value),
    };

    setBalances(updated);
  };

  const handleEdit = (index) => {
    setEditingRow(index);
  };

  const handleSave = async (employee) => {
    try {
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

  // EXPORT EXCEL
  const exportToExcel = () => {
    const exportData = filteredBalances.map((employee) => ({
      Employee: employee.name,
      SickLeave: employee.sickLeave,
      PersonalLeave: employee.personalLeave,
      EarnedLeave: employee.earnedLeave,
      MaternityLeave: employee.maternityLeave,
    }));

    const worksheet =
      XLSX.utils.json_to_sheet(exportData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Leave Balances"
    );

    XLSX.writeFile(
      workbook,
      "Employee_Leave_Balances.xlsx"
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* TITLE */}
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
        Employee Leave Balances
      </h2>

      {/* TOP CONTROLS */}
      <div className="grid grid-cols-3 items-center mb-6">
        {/* LEFT - BACK */}
        <div className="flex justify-start">
          <button
            onClick={onBack}
            className="bg-gray-500 text-white px-5 py-2 rounded-lg hover:bg-gray-600"
          >
            Back
          </button>
        </div>

        <div className="flex justify-center">
          <select
            value={selectedUser}
            onChange={(e) =>
              setSelectedUser(e.target.value)
            }
            className="p-2 border border-gray-300 rounded-lg shadow-sm min-w-[220px]"
          >
            <option value="All">All Users</option>

            {validUsers.map((user) => (
              <option
                key={user}
                value={user}
              >
                {user}
              </option>
            ))}
          </select>
        </div>

        {/* RIGHT - EXPORT */}
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
              <th className="p-3 border border-gray-200">
                Employee
              </th>
              <th className="p-3 border border-gray-200">
                Sick Leave
              </th>
              <th className="p-3 border border-gray-200">
                Personal Leave
              </th>
              <th className="p-3 border border-gray-200">
                Earned Leave
              </th>
              <th className="p-3 border border-gray-200">
                Maternity Leave
              </th>
              <th className="p-3 border border-gray-200">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredBalances.length > 0 ? (
              filteredBalances.map(
                (employee, index) => (
                  <tr
                    key={employee.id || index}
                    className="hover:bg-blue-50 text-center"
                  >
                    <td className="p-3 border border-gray-200">
                      {employee.name}
                    </td>

                    {/* Sick Leave */}
                    <td className="p-3 border border-gray-200">
                      {editingRow === index ? (
                        <input
                          type="number"
                          value={employee.sickLeave}
                          onChange={(e) =>
                            handleChange(
                              index,
                              "sickLeave",
                              e.target.value
                            )
                          }
                          className="w-20 text-center p-2 rounded-lg border-2 border-red-400 bg-red-50"
                        />
                      ) : (
                        employee.sickLeave
                      )}
                    </td>

                    {/* Personal Leave */}
                    <td className="p-3 border border-gray-200">
                      {editingRow === index ? (
                        <input
                          type="number"
                          value={
                            employee.personalLeave
                          }
                          onChange={(e) =>
                            handleChange(
                              index,
                              "personalLeave",
                              e.target.value
                            )
                          }
                          className="w-20 text-center p-2 rounded-lg border-2 border-purple-400 bg-purple-50"
                        />
                      ) : (
                        employee.personalLeave
                      )}
                    </td>

                    {/* Earned Leave */}
                    <td className="p-3 border border-gray-200">
                      {editingRow === index ? (
                        <input
                          type="number"
                          value={employee.earnedLeave}
                          onChange={(e) =>
                            handleChange(
                              index,
                              "earnedLeave",
                              e.target.value
                            )
                          }
                          className="w-20 text-center p-2 rounded-lg border-2 border-green-400 bg-green-50"
                        />
                      ) : (
                        employee.earnedLeave
                      )}
                    </td>

                    {/* Maternity Leave */}
                    <td className="p-3 border border-gray-200">
                      {editingRow === index ? (
                        <input
                          type="number"
                          value={
                            employee.maternityLeave
                          }
                          onChange={(e) =>
                             handleChange(
                              index,
                              "maternityLeave",
                              e.target.value
                            )
                          }
                          className="w-20 text-center p-2 rounded-lg border-2 border-pink-400 bg-pink-50"
                        />
                      ) : (
                        employee.maternityLeave
                      )}
                    </td>

                    {/* ACTION */}
                    <td className="p-3 border border-gray-200">
                      {editingRow === index ? (
                        <button
                          onClick={() =>
                            handleSave(employee)
                          }
                          className="bg-green-600 text-white px-4 py-2 rounded-lg"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            handleEdit(index)
                          }
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                )
              )
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