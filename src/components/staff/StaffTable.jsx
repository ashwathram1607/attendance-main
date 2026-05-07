import React from "react";

export default function StaffTable({ data, onEdit, onDelete }) {
  const staffList = Array.isArray(data) ? data : [];

  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full bg-white rounded-xl shadow-lg border-collapse border border-gray-200">
        <thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white sticky top-0">
          <tr>
            <th className="p-3 text-left border-b border-gray-300">
              Employee ID
            </th>
            <th className="p-3 text-left border-b border-gray-300">Name</th>
            <th className="p-3 text-left border-b border-gray-300">
              Designation
            </th>
            <th className="p-3 text-left border-b border-gray-300">Salary</th>
            <th className="p-3 text-left border-b border-gray-300">PAN Card</th>
            <th className="p-3 text-left border-b border-gray-300">
              Date of Joining
            </th>
            <th className="p-3 text-left border-b border-gray-300">Location</th>
            <th className="p-3 text-center border-b border-gray-300">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {staffList.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center p-4 text-gray-500 italic">
                No staff data available.
              </td>
            </tr>
          ) : (
            staffList.map((staff, idx) => (
              <tr
                key={staff.id}
                className={`transition-all hover:bg-blue-50 ${
                  idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="p-3 border-b">{staff.employeeId}</td>
                <td className="p-3 border-b">{staff.employeeName}</td>
                <td className="p-3 border-b">{staff.designation}</td>
                <td className="p-3 border-b">{staff.salary}</td>
                <td className="p-3 border-b">{staff.pancard}</td>
                <td className="p-3 border-b">{staff.dateOfJoining}</td>
                <td className="p-3 border-b">{staff.location}</td>

                <td className="p-3 border-b flex gap-2 justify-center">
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg transition"
                    onClick={() => onEdit(staff)}
                  >
                    Edit
                  </button>

                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
                    onClick={() => onDelete(staff.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
