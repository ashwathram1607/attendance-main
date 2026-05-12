import React, { useEffect, useState } from "react";
import axios from "axios";
import { ROUTES } from "../../constants/routes";

export default function PermissionRecords({ setActivePage }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  const username = localStorage.getItem("name");

  // ✅ Fetch permission records and auto-refresh every 5 seconds
  useEffect(() => {
    if (!username) return;

    const fetchRecords = async () => {
      try {
        const res = await axios.get(
          "https://attendance-backend-mlct.onrender.com/permission"
        );

        const filtered = res.data.filter(
          (record) =>
            record.name?.toLowerCase() === username?.toLowerCase()
        );

        setRecords(filtered);
      } catch (err) {
        console.error("Error fetching permission data:", err);
        setError("Failed to load permission records.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecords(); // initial fetch
    const interval = setInterval(fetchRecords, 5000); // refresh every 5 seconds

    return () => clearInterval(interval); // cleanup on unmount
  }, [username]);

  // ✅ Pagination Logic
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentData = records.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(records.length / recordsPerPage);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-lg font-semibold text-blue-600">
        Loading permission records...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      {/* Back Button */}
      <div className="w-full max-w-5xl mb-6">
        <button
          onClick={() => setActivePage(ROUTES.PERMISSIONDASHBOARD)}
          className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
        >
          Back
        </button>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">
        Permission Records - {username}
      </h2>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg p-6 w-full max-w-5xl">
        <table className="w-full border border-gray-200">
          <thead>
            <tr className="bg-purple-600 text-white">
              <th className="p-3 border border-gray-200">#</th>
              <th className="p-3 border border-gray-200">Date</th>
              <th className="p-3 border border-gray-200">Start Time</th>
              <th className="p-3 border border-gray-200">End Time</th>
              <th className="p-3 border border-gray-200">Reason</th>
              <th className="p-3 border border-gray-200">Status</th>
            </tr>
          </thead>

          <tbody>
            {currentData.length > 0 ? (
              currentData.map((r, index) => (
                <tr key={r.id || index} className="hover:bg-purple-50">
                  <td className="p-3 border border-gray-200">
                    {indexOfFirst + index + 1}
                  </td>
                  <td className="p-3 border border-gray-200">{r.date}</td>
                  <td className="p-3 border border-gray-200">{r.startTime}</td>
                  <td className="p-3 border border-gray-200">{r.endTime}</td>
                  <td className="p-3 border border-gray-200">{r.reason}</td>

                  {/* STATUS COLUMN */}
                  <td
                    className={`p-3 border border-gray-200 font-semibold ${
                      (r.status || "Pending") === "Approved"
                        ? "text-green-600"
                        : (r.status || "Pending") === "Rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {r.status || "Pending"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center p-4 text-gray-500 border border-gray-200"
                >
                  No permission records found.
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
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}