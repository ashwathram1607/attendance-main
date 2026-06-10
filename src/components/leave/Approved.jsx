import React, { useEffect, useState } from "react";
import axios from "axios";
import { ROUTES } from "../../constants/routes";

export default function Approved({ setActivePage }) {
  const username = localStorage.getItem("name");

  const [leaves, setLeaves] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await axios.get(
          "https://attendance-backend-1-pzsj.onrender.com/leaves"
        );

        const userLeaves = res.data.filter(
          (leave) => leave.name?.toLowerCase() === username?.toLowerCase()
        );

        setLeaves(userLeaves);
      } catch (err) {
        console.error("Failed to fetch leaves", err);
      }
    };

    if (username) {
      fetchLeaves();
    }
  }, [username]);

  const filteredLeaves =
    statusFilter === "All"
      ? leaves
      : leaves.filter(
          (leave) =>
            leave.status?.toLowerCase() === statusFilter.toLowerCase()
        );

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;

  const currentLeaves = filteredLeaves.slice(
    indexOfFirst,
    indexOfLast
  );

  const totalPages = Math.ceil(
    filteredLeaves.length / itemsPerPage
  );

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "text-green-600 font-semibold";
      case "rejected":
        return "text-red-600 font-semibold";
      default:
        return "text-yellow-600 font-semibold";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">

      {/* Header Section */}
      <div className="w-full max-w-5xl mb-6">
        <div className="grid grid-cols-3 items-center">

          {/* Back Button */}
          <div>
            <button
              onClick={() => setActivePage(ROUTES.LEAVEDASHBOARD)}
              className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
            >
              Back
            </button>
          </div>

          {/* Heading */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-purple-700">
              Leave Records - {username}
            </h2>
          </div>

          {/* Filter */}
          <div className="flex justify-end">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 bg-white"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg p-6 w-full max-w-5xl">
        <table className="w-full border border-gray-200">
          <thead>
            <tr className="bg-purple-600 text-white">
              <th className="p-3 border border-gray-200">#</th>
              <th className="p-3 border border-gray-200">Leave Type</th>
              <th className="p-3 border border-gray-200">From Date</th>
              <th className="p-3 border border-gray-200">To Date</th>
              <th className="p-3 border border-gray-200">Reason</th>
              <th className="p-3 border border-gray-200">Status</th>
            </tr>
          </thead>

          <tbody>
            {currentLeaves.length > 0 ? (
              currentLeaves.map((leave, index) => (
                <tr
                  key={leave.id || index}
                  className="hover:bg-purple-50"
                >
                  <td className="p-3 border border-gray-200 text-center">
                    {indexOfFirst + index + 1}
                  </td>

                  <td className="p-3 border border-gray-200">
                    {leave.leaveType}
                  </td>

                  <td className="p-3 border border-gray-200">
                    {leave.fromDate}
                  </td>

                  <td className="p-3 border border-gray-200">
                    {leave.toDate}
                  </td>

                  <td className="p-3 border border-gray-200">
                    {leave.reason}
                  </td>

                  <td
                    className={`p-3 border border-gray-200 text-center ${getStatusColor(
                      leave.status
                    )}`}
                  >
                    {leave.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center p-4 text-gray-500 border border-gray-200"
                >
                  No leave records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center mt-6 gap-2">
          <button
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

    </div>
  );
}