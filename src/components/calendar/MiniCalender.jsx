import React from "react";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const attendance = {
  1: 8,
  2: 0,
  3: 8,
  4: 4,
  5: 8,
};

export default function Calendar() {
  const today = new Date();
  const currentMonth = today.toLocaleString("default", { month: "long" });
  const currentYear = today.getFullYear();
  const todayDate = today.getDate();

  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();

  const getStatus = (day, dayOfWeek) => {
    const hours = attendance[day];

    if (day > todayDate) return "future";
    if (dayOfWeek === 0 || dayOfWeek === 6) return "weekend";

    if (hours >= 8) return "present";
    if (hours > 0 && hours < 8) return "halfday";
    if (hours === 0) return "absent";

    return "absent";
  };

  const statusClasses = {
    present: "bg-green-400 text-green-900 border-green-600",
    absent: "bg-red-200 text-red-800 border-red-400",
    weekend: "bg-yellow-200 text-yellow-800 border-yellow-400",
    halfday: "bg-blue-200 text-blue-800 border-blue-400",
    future: "bg-gray-200 text-gray-500 border-gray-300",
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4">

      {/* Widget Container FULL COVER */}
      <div className="w-full h-full bg-white rounded-xl shadow-md p-5">

        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-indigo-600">
            Attendance Calendar
          </h2>
          <div className="text-lg font-semibold text-indigo-700">
            {currentMonth} {currentYear}
          </div>
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-2 mb-3">
          {daysOfWeek.map((d) => (
            <div
              key={d}
              className="text-center font-bold text-sm bg-teal-50 p-2 rounded"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;

            const dayOfWeek = new Date(
              today.getFullYear(),
              today.getMonth(),
              day
            ).getDay();

            const status = getStatus(day, dayOfWeek);

            const isToday = day === todayDate;

            return (
              <div
                key={day}
                className={`h-12 flex items-center justify-center rounded border font-medium text-sm transition
                  ${
                    isToday
                      ? "bg-blue-500 text-white border-blue-700 shadow"
                      : statusClasses[status]
                  }`}
              >
                {day}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-6 mt-6 text-sm font-medium justify-center">
          <div>🟢 Present (8h+)</div>
          <div>🔵 Half Day</div>
          <div>🟡 Weekend</div>
          <div>🔴 Absent</div>
          <div>⚫ Future</div>
        </div>

      </div>
    </div>
  );
}