import React, { useEffect, useState } from "react";
import axios from "axios";
import { ROUTES } from "../../constants/routes";

export default function BalanceCheck({ setActivePage }) {
  const username = localStorage.getItem("name");
  const [balanceData, setBalanceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await axios.get(
          "https://attendance-backend-mlct.onrender.com/leaves/balance/${username}",
        );

        console.log("Balance API Response:", res.data);

        setBalanceData(res.data);
      } catch (err) {
        console.error("Error fetching balance:", err);
        setBalanceData(null);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchBalance();
    }
  }, [username]);

  const leaveTypes = [
    "sickLeave",
    "personalLeave",
    "earnedLeave",
    "maternityLeave",
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading leave balance...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4 pt-8">
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

      {/* Balance Card */}
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">
          Leave Balance - {username}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {leaveTypes.map((type) => (
            <div
              key={type}
              className="bg-green-100 p-4 rounded-xl flex flex-col items-center"
            >
              <h3 className="font-semibold text-gray-700">
                {type
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </h3>

              <span className="text-xl font-bold text-green-700">
                {balanceData?.[type] ?? 0}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
