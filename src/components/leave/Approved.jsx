import React, { useEffect, useState } from "react";
import axios from "axios";
import { ROUTES } from "../../constants/routes";

export default function Approved({ setActivePage }) {
  const username = localStorage.getItem("name");
  const [leaves, setLeaves] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");

  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await axios.get(
          "https://attendance-backend-m5zj.onrender.com/leaves"
        );

        const userLeaves = res.data.filter(
          (leave) => leave.name === username
        );

        setLeaves(userLeaves);
      } catch (err) {
        console.error("Failed to fetch leaves", err);
      }
    };

    if (username) fetchLeaves();
  }, [username]);

  // ✅ Filter logic (case-safe)
  const filteredLeaves =
    statusFilter === "All"
      ? leaves
      : leaves.filter(
          (leave) =>
            leave.status?.toLowerCase() === statusFilter.toLowerCase()
        );

  // ✅ Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  // ✅ Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentLeaves = filteredLeaves.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredLeaves.length / itemsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // ✅ Status color helper
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "text-green-600";
      case "rejected":
        return "text-red-600";
      default:
        return "text-yellow-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Back Button */}
      <div className="w-full max-w-md mb-6">
        <button
          type="button"
          onClick={() => setActivePage(ROUTES.LEAVEDASHBOARD)}
          className="bg-gray-500 text-white px-4 py-2 rounded-xl hover:bg-gray-600 transition"
        >
          Back
        </button>
      </div>

      <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">
        Leave Requests - {username}
      </h2>

      {/* Filter */}
      <div className="mb-4 flex justify-end">
        <label className="mr-2 font-semibold">Filter by Status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg p-6">
        <table className="w-full border border-gray-200">
          <thead>
            <tr className="bg-purple-600 text-white">
              <th className="p-3 border">#</th>
              <th className="p-3 border">Leave Type</th>
              <th className="p-3 border">From Date</th>
              <th className="p-3 border">To Date</th>
              <th className="p-3 border">Reason</th>
              <th className="p-3 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentLeaves.length > 0 ? (
              currentLeaves.map((leave, index) => (
                <tr key={leave.id} className="hover:bg-purple-50">
                  <td className="p-3 border">
                    {indexOfFirst + index + 1}
                  </td>
                  <td className="p-3 border">{leave.leaveType}</td>
                  <td className="p-3 border">{leave.fromDate}</td>
                  <td className="p-3 border">{leave.toDate}</td>
                  <td className="p-3 border">{leave.reason}</td>
                  <td
                    className={`p-3 border font-semibold ${getStatusColor(
                      leave.status
                    )}`}
                  >
                    {leave.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500 italic">
                  No leaves found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* ✅ Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-400 text-white rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="font-semibold">
            Page {currentPage} of {totalPages || 1}
          </span>

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-4 py-2 bg-purple-600 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
} 