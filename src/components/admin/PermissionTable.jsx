import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import axios from "axios";

export default function PermissionTable({ onBack }) {
  const [permissionData, setPermissionData] = useState([]);
  const [selectedUser, setSelectedUser] = useState("All");
  const [editingPermission, setEditingPermission] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // ✅ Use local backend
  const API_BASE = "http://localhost:8000";

  // Fetch all permission requests
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await axios.get(`${API_BASE}/permission`);
        console.log("Fetched permissions:", response.data);
        setPermissionData(response.data);
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    };
    fetchPermissions();
  }, []);

  const uniqueUsers = ["All", ...new Set(permissionData.map((p) => p.name))];
  const filteredData =
    selectedUser === "All"
      ? permissionData
      : permissionData.filter((p) => p.name === selectedUser);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Export to Excel
  const exportToExcel = () => {
    if (!filteredData || filteredData.length === 0) {
      alert("No data available to export!");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.map((p) => ({
        ID: p.id,
        Name: p.name,
        Date: p.date,
        "Start Time": p.startTime,
        "End Time": p.endTime,
        Reason: p.reason,
        Status: p.status || "Pending",
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Permissions");

    const fileName =
      selectedUser === "All"
        ? "All_Permissions.xlsx"
        : `${selectedUser}_Permissions.xlsx`;

    XLSX.writeFile(workbook, fileName);
  };

  // Handle edit
  const handleEditClick = (permission) => {
    setEditingPermission({ ...permission });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingPermission((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `${API_BASE}/permission/${editingPermission.id}`,
        { status: editingPermission.status }
      );

      setPermissionData((prev) =>
        prev.map((p) =>
          p.id === editingPermission.id
            ? { ...p, status: editingPermission.status }
            : p
        )
      );

      setEditingPermission(null);
    } catch (error) {
      console.error("Error updating permission:", error); 
      alert("Failed to update permission status. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
        Permission Requests
      </h2>

      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="bg-gray-600 text-white py-2 px-6 rounded-lg hover:bg-gray-700 transition-all"
        >
          Back
        </button>

        <select
          value={selectedUser}
          onChange={(e) => {
            setSelectedUser(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-blue-500"
        >
          {uniqueUsers.map((user, index) => (
            <option key={index} value={user}>
              {user}
            </option>
          ))}
        </select>

        <button
          onClick={exportToExcel}
          className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-all"
        >
          Export {selectedUser === "All" ? "All" : selectedUser} Data
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg p-6">
        <table className="w-full border border-gray-200">
          <thead>
            <tr className="bg-blue-600 text-white text-left">
              <th className="p-3 border border-gray-200">ID</th>
              <th className="p-3 border border-gray-200">Name</th>
              <th className="p-3 border border-gray-200">Date</th>
              <th className="p-3 border border-gray-200">Start Time</th>
              <th className="p-3 border border-gray-200">End Time</th>
              <th className="p-3 border border-gray-200">Reason</th>
              <th className="p-3 border border-gray-200">Status</th>
              <th className="p-3 border border-gray-200">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((p) => (
                <tr key={p.id} className="hover:bg-blue-50">
                  <td className="p-3 border border-gray-200">{p.id}</td>
                  <td className="p-3 border border-gray-200">{p.name}</td>
                  <td className="p-3 border border-gray-200">{p.date}</td>
                  <td className="p-3 border border-gray-200">{p.startTime}</td>
                  <td className="p-3 border border-gray-200">{p.endTime}</td>
                  <td className="p-3 border border-gray-200">{p.reason}</td>
                  <td
                    className={`p-3 border border-gray-200 font-semibold ${
                      p.status === "Pending"
                        ? "text-yellow-600"
                        : p.status === "Approved"
                        ? "text-green-600"
                        : p.status === "Rejected"
                        ? "text-red-600"
                        : ""
                    }`}
                  >
                    {p.status || "Pending"}
                  </td>
                  <td className="p-3 border border-gray-200">
                    <button
                      onClick={() => handleEditClick(p)}
                      className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 transition"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center p-4 text-gray-500 italic">
                  No permission records found for {selectedUser}.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded hover:bg-gray-300 ${
                  currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingPermission && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-lg">
            <h3 className="text-xl font-bold mb-4">
              Update Status for Permission ID: {editingPermission.id}
            </h3>

            <label className="block mb-2">Status</label>
            <select
              name="status"
              value={editingPermission.status || "Pending"}
              onChange={handleEditChange}
              className="w-full mb-4 p-2 border rounded"
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setEditingPermission(null)}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}