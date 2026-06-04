import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "https://attendance-backend-1-pzsj.onrender.com/leaves/balances";

export default function AdminLeaveBalance({ data, onBack }) {
  const [balances, setBalances] = useState([]);
  const [editingRow, setEditingRow] = useState(null);

  useEffect(() => {
    setBalances(data || []);
  }, [data]);

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
      await axios.put(
        `${BASE_URL}/leaves/balance/${employee.name}`,
        {
          sickLeave: employee.sickLeave,
          personalLeave: employee.personalLeave,
          earnedLeave: employee.earnedLeave,
          maternityLeave: employee.maternityLeave,
        }
      );

      alert("Leave balance updated successfully");
      setEditingRow(null);
    } catch (error) {
      console.error(error);
      alert("Failed to update leave balance");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
        Employee Leave Balances
      </h2>

      <div className="flex justify-center mb-6">
        <button
          onClick={onBack}
          className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition"
        >
          Back
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg p-6">
        <table className="w-full border border-gray-200">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-3 border border-gray-200">Employee</th>
              <th className="p-3 border border-gray-200">Sick Leave</th>
              <th className="p-3 border border-gray-200">Personal Leave</th>
              <th className="p-3 border border-gray-200">Earned Leave</th>
              <th className="p-3 border border-gray-200">Maternity Leave</th>
              <th className="p-3 border border-gray-200">Action</th>
            </tr>
          </thead>

          <tbody>
            {balances.length > 0 ? (
              balances.map((employee, index) => (
                <tr key={employee.id || index} className="hover:bg-blue-50 text-center">
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
                          handleChange(index, "sickLeave", e.target.value)
                        }
                        className="w-20 text-center p-2 rounded-lg border-2 border-red-400 bg-red-50 text-red-700 font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 focus:scale-110"
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
                        value={employee.personalLeave}
                        onChange={(e) =>
                          handleChange(index, "personalLeave", e.target.value)
                        }
                        className="w-20 text-center p-2 rounded-lg border-2 border-purple-400 bg-purple-50 text-purple-700 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
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
                          handleChange(index, "earnedLeave", e.target.value)
                        }
                        className="w-20 text-center p-2 rounded-lg border-2 border-green-400 bg-green-50 text-green-700 font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
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
                        value={employee.maternityLeave}
                        onChange={(e) =>
                          handleChange(index, "maternityLeave", e.target.value)
                        }
                        className="w-20 text-center p-2 rounded-lg border-2 border-pink-400 bg-pink-50 text-pink-700 font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-200"
                      />
                    ) : (
                      employee.maternityLeave
                    )}
                  </td>

                  {/* Action */}
                  <td className="p-3 border border-gray-200">
                    {editingRow === index ? (
                      <button
                        onClick={() => handleSave(employee)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(index)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">
                  No leave balances found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}