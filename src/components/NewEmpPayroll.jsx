import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import GeneratePayslip from "./payslip/GeneratePayslip.jsx";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function NewEmpPayroll() {
  const [payslips, setPayslips] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [loading, setLoading] = useState(true);
  const [latestPayslip, setLatestPayslip] = useState(null);

  useEffect(() => {
    const loadPayslip = async () => {
      try {
        const storedName = localStorage.getItem("name");
        if (!storedName) {
          setLoading(false);
          return;
        }

        const res = await axios.get(
          "https://attendance-backend-mlct.onrender.com"
        );

        const cleanStored = storedName.trim().toLowerCase();

        const matched = res.data.filter(
          (p) => p.employeeName?.trim().toLowerCase() === cleanStored,
        );

        setPayslips(matched);

        if (matched.length > 0) {
          matched.sort((a, b) => {
            const dateA = new Date(`${a.month} 1, ${a.year}`);
             const dateB = new Date(`${b.month} 1, ${b.year}`);
            return dateB - dateA; // latest first
          });

          setLatestPayslip(matched[0]);

          setSelectedYear(matched[0].year);
        }
      } catch (err) {
        console.error("Error fetching payslip:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPayslip();
  }, []);

  const uniqueYears = [...new Set(payslips.map((p) => p.year))].sort();

  const changeYear = (direction) => {
    setSelectedMonth(null);
    setSelectedYear((prev) => (direction === "prev" ? prev - 1 : prev + 1));
  };

  if (loading)
    return (
      <div className="text-center py-10 text-lg font-semibold text-gray-600 animate-pulse">
        Loading payroll…
      </div>
    );

  if (payslips.length === 0)
    return (
      <div className="text-center py-10 text-red-500 font-semibold text-xl">
        No payslips found for this employee.
      </div>
    );

  const filteredPayslips = payslips.filter((p) => p.year === selectedYear);

  const selectedPayslip = filteredPayslips.find(
    (p) => p.month.toLowerCase() === selectedMonth?.toLowerCase(),
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Title */}
      <h1 className="text-4xl font-bold text-center mb-10 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        Employee Payroll Portal
      </h1>

      {/* Year Navigator */}
      <div className="flex items-center justify-center gap-6 mb-8">
        <button
          onClick={() => changeYear("prev")}
          className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 shadow"
        >
          <IoChevronBack size={22} />
        </button>

        {/* Dropdown */}
        <select
          value={selectedYear}
          onChange={(e) => {
            setSelectedYear(Number(e.target.value));
            setSelectedMonth(null);
          }}
          className="px-4 py-2 border rounded-xl shadow-sm text-lg"
        >
          {uniqueYears.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <button
          onClick={() => changeYear("next")}
          className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 shadow"
        >
          <IoChevronForward size={22} />
        </button>
      </div>

      {/* Month Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {months.map((month, i) => {
          const slip = filteredPayslips.find(
            (p) => p.month.toLowerCase() === month.toLowerCase(),
          );

          const isLatest =
            latestPayslip &&
            latestPayslip.month.toLowerCase() === month.toLowerCase() &&
            latestPayslip.year === selectedYear;

          return (
            <div
              key={i}
              onClick={() => slip && setSelectedMonth(month)}
              className={`p-8 rounded-2xl shadow-md transition transform relative
                ${
                  slip
                    ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white hover:scale-105 cursor-pointer"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }
              `}
            >
              {/* Latest badge */}
              {isLatest && (
                <span className="absolute top-3 right-3 bg-yellow-400 text-black text-xs px-2 py-1 rounded-lg shadow">
                  Latest
                </span>
              )}

              <h2 className="text-2xl font-semibold">{month}</h2>
              <p className="mt-2 text-sm opacity-80">
                {slip ? "Click to view payslip" : "No payslip available"}
              </p>
            </div>
          );
        })}
      </div>

      {/* Payslip viewer */}
      {selectedMonth && selectedPayslip && (
        <div className="mt-12 bg-white shadow-xl rounded-2xl p-6 border">
          <h2 className="text-3xl font-bold text-center mb-6">
            Payslip for <span className="text-blue-600">{selectedMonth}</span> –{" "}
            {selectedPayslip.year}
          </h2>
 
          <GeneratePayslip data={selectedPayslip} />
        </div>
      )}
    </div>
  );
}
