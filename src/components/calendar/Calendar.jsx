import React, { useState } from "react";

// Example days and statuses (you can integrate with actual data later)
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const exampleDates = Array.from({ length: 30 }, (_, i) => ({
  date: i + 1,
  status: "working", // working | absent | holiday | halfday | future
}));

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState("September 2025");

  const statusClasses = {
    working: "bg-green-400 text-green-800 border-green-500",
    absent: "bg-red-200 text-red-800 border-red-400",
    holiday: "bg-yellow-200 text-yellow-800 border-yellow-400",
    halfday: "bg-blue-200 text-blue-800 border-blue-400",
    future: "bg-gray-200 text-gray-500 border-gray-300",
  };

  const today = new Date().getDate();

  return (
    <div className="w-full rounded-xl p-4 font-sans bg-white shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg border border-indigo-100 mb-4">
        <h3 className="text-2xl font-bold text-indigo-600 tracking-wide m-0">
          Attendance Calendar
        </h3>
        <div className="flex items-center gap-2">
          <button className="bg-blue-800 text-white px-3 py-1 rounded-md font-bold text-sm hover:bg-blue-900 transition">
            &lt;
          </button>
          <span className="text-lg font-semibold text-indigo-700">
            {currentMonth}
          </span>
          <button className="bg-blue-800 text-white px-3 py-1 rounded-md font-bold text-sm hover:bg-blue-900 transition">
            &gt;
          </button>
        </div>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="text-center font-semibold text-sm bg-teal-50 border border-gray-200 rounded py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Dates Grid */}
      <div className="grid grid-cols-7 gap-2">
        {exampleDates.map((d, i) => {
          const dayOfWeek = i % 7; // 0 = Sunday, 6 = Saturday
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

          return (
            <div
              key={d.date}
              className={`h-10 flex justify-center items-center rounded border text-base font-medium transition 
                ${
                  d.date === today
                    ? "border-2 border-black bg-gradient-to-br from-blue-200 to-blue-400 font-bold text-blue-900 shadow"
                    : isWeekend
                    ? "bg-yellow-200 text-yellow-800 border-yellow-400 font-bold"
                    : statusClasses[d.status]
                }`}
            >
              {d.date}
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="flex justify-evenly gap-2 mt-4 text-lg font-semibold">
        <div className="flex items-center gap-2 p-2">
          <span className="w-4 h-4 rounded-full bg-gradient-to-br from-green-400 to-green-600 inline-block"></span>
          Working
        </div>
        <div className="flex items-center gap-2 p-2">
          <span className="w-4 h-4 rounded-full bg-gradient-to-br from-red-200 to-red-400 inline-block"></span>
          Absent
        </div>
        <div className="flex items-center gap-2 p-2">
          <span className="w-4 h-4 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-400 inline-block"></span>
          Holiday / Weekend
        </div>
        <div className="flex items-center gap-2 p-2">
          <span className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-200 to-blue-400 inline-block"></span>
          Half Day
        </div>
      </div>
    </div>
  );
}
