import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import axios from "axios";

export default function LeaveTable({ onBack }) {
  const [leaveData, setLeaveData] = useState([]);
  const [selectedUser, setSelectedUser] = useState("All");
  const [editingLeave, setEditingLeave] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Fetch leave data
  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await axios.get(
          "https://attendance-backend-snvv.onrender.com/leaves",
        );
        setLeaveData(response.data);
      } catch (error) {
        console.error("Error fetching leaves:", error);
      }
    };
    fetchLeaves();
  }, []);

  const uniqueUsers = ["All", ...new Set(leaveData.map((leave) => leave.name))];
  const filteredData =
    selectedUser === "All"
      ? leaveData
      : leaveData.filter((leave) => leave.name === selectedUser);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const exportToExcel = () => {
    if (!filteredData || filteredData.length === 0) {
      alert("No data available to export!");
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.map((leave) => ({
        ID: leave.id,
        Name: leave.name,
        "Leave Type": leave.leaveType,
        "From Date": leave.fromDate,
        "To Date": leave.toDate,
        Reason: leave.reason,
        Status: leave.status,
        "Submitted At": new Date(leave.submittedAt).toLocaleString(),
      })),
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leave Requests");

    const fileName =
      selectedUser === "All"
        ? "All_LeaveRequests.xlsx"
        : `${selectedUser}_LeaveRequests.xlsx`;

    XLSX.writeFile(workbook, fileName);
  };

  const handleEditClick = (leave) => {
    setEditingLeave({ ...leave });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingLeave((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `https://attendance-backend-snvv.onrender.com/leaves/${editingLeave.id}`,
        {
          status: editingLeave.status,
        },
      );
      setLeaveData((prev) =>
        prev.map((leave) =>
          leave.id === editingLeave.id
            ? { ...leave, status: editingLeave.status }
            : leave,
        ),
      );
      setEditingLeave(null);
    } catch (error) {
      console.error("Error updating leave:", error);
      alert("Failed to update leave status. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
        Leave Requests
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
            setCurrentPage(1); // reset page when user changes
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
              <th className="p-3 border border-gray-200">Leave Type</th>
              <th className="p-3 border border-gray-200">From Date</th>
              <th className="p-3 border border-gray-200">To Date</th>
              <th className="p-3 border border-gray-200">Reason</th>
              <th className="p-3 border border-gray-200">Status</th>
              <th className="p-3 border border-gray-200">Submitted At</th>
              <th className="p-3 border border-gray-200">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((leave) => (
                <tr key={leave.id} className="hover:bg-blue-50">
                  <td className="p-3 border border-gray-200">{leave.id}</td>
                  <td className="p-3 border border-gray-200">{leave.name}</td>
                  <td className="p-3 border border-gray-200">
                    {leave.leaveType}
                  </td>
                  <td className="p-3 border border-gray-200">
                    {new Date(leave.fromDate).toLocaleDateString()}
                  </td>
                  <td className="p-3 border border-gray-200">
                    {new Date(leave.toDate).toLocaleDateString()}
                  </td>
                  <td className="p-3 border border-gray-200">{leave.reason}</td>
                  <td
                    className={`p-3 border border-gray-200 font-semibold ${
                      leave.status === "Pending"
                        ? "text-yellow-600"
                        : leave.status === "Approved"
                          ? "text-green-600"
                          : "text-red-600"
                    }`}
                  >
                    {leave.status}
                  </td>
                  <td className="p-3 border border-gray-200">
                    {new Date(leave.submittedAt).toLocaleString()}
                  </td>
                  <td className="p-3 border border-gray-200">
                    <button
                      onClick={() => handleEditClick(leave)}
                      className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 transition"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="text-center p-4 text-gray-500 italic"
                >
                  No leave records found for {selectedUser}.
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
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
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

      {/* Edit Modal (centered) */}
      {editingLeave && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-lg">
            <h3 className="text-xl font-bold mb-4">
              Update Status for Leave ID: {editingLeave.id}
            </h3>

            <label className="block mb-2">Status</label>
            <select
              name="status"
              value={editingLeave.status}
              onChange={handleEditChange}
              className="w-full mb-4 p-2 border rounded"
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setEditingLeave(null)}
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
