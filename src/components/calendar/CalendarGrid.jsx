import React, { useEffect, useState } from "react";
import axios from "axios";
import EmployeePopup from "./EmployeePopup";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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

// Convert backend UTC timestamp → LOCAL IST date
const convertUTCToLocalDate = (utcString) => {
  const utc = new Date(utcString);

  return new Date(
    utc.getUTCFullYear(),
    utc.getUTCMonth(),
    utc.getUTCDate(),
    utc.getUTCHours(),
    utc.getUTCMinutes(),
    utc.getUTCSeconds(),
  );
};

export default function CalendarGrid() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const username = localStorage.getItem("name") || "";

  // Fetch & aggregate data
  const fetchAttendance = () => {
    setLoading(true);
    setError(null);

    axios
      .get("https://attendance-backend-mlct.onrender.com/attendance")
      .then((res) => {
        if (!Array.isArray(res.data)) {
          setAttendanceData([]);
          return;
        }

        const userRecords = res.data.filter((r) => r.username === username);

        const grouped = {};

        userRecords.forEach((rec) => {
          if (!rec.startTime) return;

          const localDate = convertUTCToLocalDate(rec.startTime);

          const key = `${localDate.getFullYear()}-${localDate.getMonth()}-${localDate.getDate()}`;

          if (!grouped[key]) {
            grouped[key] = {
              date: localDate,
              username: rec.username,
              workedDuration: 0,
              totalBreakDuration: 0,
              breakCount: 0,
              sessions: [],
            };
          }

          grouped[key].workedDuration += rec.workedDuration || 0;
          grouped[key].totalBreakDuration += rec.totalBreakDuration || 0;
          grouped[key].breakCount += rec.breakCount || 0;
          grouped[key].sessions.push(rec);
        });

        setAttendanceData(Object.values(grouped));
      })
      .catch((err) => {
        console.error("Failed to fetch attendance:", err);
        setError("Failed to fetch attendance");
      })
      .finally(() => setLoading(false));
  };

  // Auto refresh every 10 seconds
  useEffect(() => {
    fetchAttendance();
    const interval = setInterval(fetchAttendance, 10000);
    return () => clearInterval(interval);
  }, []);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const today = new Date();

  const findRecordForDay = (day) => {
    return attendanceData.find((item) => {
      const d = item.date;
      return (
        d.getDate() === day &&
        d.getMonth() === currentMonth &&
        d.getFullYear() === currentYear
      );
    });
  };

  const statusClasses = {
    working: "bg-green-400 text-green-800 border-green-500",
    holiday: "bg-yellow-200 text-yellow-800 border-yellow-400",
    future: "bg-gray-200 text-gray-500 border-gray-300",
  };

  const totalCells = firstDayOfMonth + daysInMonth;

  const exampleDates = Array.from({ length: totalCells }, (_, i) => {
    const dayNum = i - firstDayOfMonth + 1;

    if (i < firstDayOfMonth) return { blank: true };

    const record = findRecordForDay(dayNum);
    const tempDate = new Date(currentYear, currentMonth, dayNum);
    const weekday = tempDate.getDay();

    let status = "future";

    if (record) {
      status = "working";
    } else {
      const isWeekend = weekday === 0 || weekday === 6;
      const isPastOrToday = tempDate <= today;

      if (isWeekend || isPastOrToday) status = "holiday";
    }

    return { day: dayNum, status, record };
  });

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  return (
    <div className="w-full rounded-xl p-12 font-sans bg-white">
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg border border-indigo-100 mb-4">
        <h3 className="text-2xl font-bold text-indigo-600">
          Attendance Calendar
        </h3>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="bg-blue-800 text-white px-3 py-1 rounded-md font-bold text-sm hover:bg-blue-900"
          >
            &lt;
          </button>
          <span className="text-lg font-semibold text-indigo-700">
            {months[currentMonth]} {currentYear}
          </span>
          <button
            onClick={handleNextMonth}
            className="bg-blue-800 text-white px-3 py-1 rounded-md font-bold text-sm hover:bg-blue-900"
          >
            &gt;
          </button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-6 mb-2">
        {daysOfWeek.map((d) => (
          <div
            key={d}
            className="text-center font-semibold text-sm bg-teal-50 border border-gray-200 rounded py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {loading && <div className="text-center py-4">Loading attendance...</div>}
      {error && <div className="text-center py-2 text-red-600">{error}</div>}

      {/* Calendar */}
      <div className="grid grid-cols-7 gap-6">
        {exampleDates.map((d, i) => {
          if (d.blank) return <div key={`blank-${i}`} className="h-10"></div>;

          const isToday =
            d.day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear();

          return (
            <div
              key={d.day}
              onClick={() => d.record && setSelectedRecord(d.record)}
              className={`h-10 flex justify-center items-center rounded border text-base font-medium transition
                ${
                  isToday
                    ? "border-2 border-black bg-gradient-to-br from-blue-200 to-blue-400 font-bold text-blue-900 shadow"
                    : statusClasses[d.status]
                }
                ${
                  d.record
                    ? "cursor-pointer hover:scale-105 transform"
                    : "cursor-default"
                }
              `}
            >
              {d.day}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-18 text-lg text-gray-600">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-green-400 border border-green-500"></div>
          Worked Day
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-yellow-200 border border-yellow-400"></div>
          Weekend / No Data
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-gray-200 border border-gray-300"></div>
          Future Date
        </div>
      </div>

      {selectedRecord && (
        <EmployeePopup
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )}
    </div>
  );
}
