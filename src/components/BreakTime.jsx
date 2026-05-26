import React, { useState, useEffect } from "react";
import { useAttendanceStore } from "../store/attendanceStore";
import BreakApp from "../pages/BreakApp";

export default function BreakTime() {
  const { isCheckedIn, isOnBreak, toggleBreak, elapsedTime, breakCount } =
    useAttendanceStore();

  const [breakTime, setBreakTime] = useState(() =>
    parseInt(localStorage.getItem("breakTime") || "0")
  );

  const [breakStartTime, setBreakStartTime] = useState(() =>
    parseInt(localStorage.getItem("breakStartTime") || "0")
  );

  const [showBreakApp, setShowBreakApp] = useState(false);

  const MAX_BREAK_TIME = 60 * 60 * 1000;

  // 🕐 Load saved data
  useEffect(() => {
    const savedBreakTime = parseInt(
      localStorage.getItem("breakTime") || "0"
    );

    const savedBreakStart = parseInt(
      localStorage.getItem("breakStartTime") || "0"
    );

    setBreakTime(savedBreakTime);
    setBreakStartTime(savedBreakStart);
  }, []);

  // 🔄 Reset when checked out
  useEffect(() => {
    if (!isCheckedIn) {
      setBreakTime(0);
      setBreakStartTime(0);

      localStorage.setItem("breakTime", "0");
      localStorage.removeItem("breakStartTime");
    }
  }, [isCheckedIn]);

  // ⏱ Break Timer
  useEffect(() => {
    let interval = null;

    if (isOnBreak) {
      let start = breakStartTime;

      if (!start) {
        start = Date.now();

        setBreakStartTime(start);

        localStorage.setItem("breakStartTime", start.toString());
      }

      interval = setInterval(() => {
        const currentTime = Date.now();

        const duration = Math.max(0, currentTime - start);

        const newTime = Math.min(duration, MAX_BREAK_TIME);

        setBreakTime(newTime);

        localStorage.setItem("breakTime", newTime.toString());

        if (newTime >= MAX_BREAK_TIME) {
          clearInterval(interval);

          alert("⚠️ Break limit reached (1 hour). Auto-resuming work.");

          handleResumeWork();
        }
      }, 1000);
    } else {
      clearInterval(interval);

      setBreakTime(0);
      setBreakStartTime(0);

      localStorage.setItem("breakTime", "0");
      localStorage.removeItem("breakStartTime");
    }

    return () => clearInterval(interval);
  }, [isOnBreak]);

  // 🟢 Resume Work
  const handleResumeWork = () => {
    setBreakTime(0);
    setBreakStartTime(0);

    localStorage.setItem("breakTime", "0");
    localStorage.removeItem("breakStartTime");

    toggleBreak();
  };

  // ⏰ Format Time
  const formatTime = (ms) => {
    const totalSec = Math.floor(ms / 1000);

    const h = String(Math.floor(totalSec / 3600)).padStart(2, "0");

    const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");

    const s = String(totalSec % 60).padStart(2, "0");

    return `${h}:${m}:${s}`;
  };

  return (
    <>
      <div className="w-full max-w-md mx-auto p-6">
        <div className="rounded-2xl p-2 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-blue-600">
              Break Time & Counts
            </h2>

            <button
              onClick={() => setShowBreakApp(true)}
              className="bg-orange-600 text-white px-3 py-1 rounded-md font-semibold text-sm hover:bg-orange-700 transition"
            >
              INFO
            </button>
          </div>

          {/* Break Info */}
          <div className="flex flex-col gap-4 w-full">
            <div className="p-4 sm:p-6 rounded-xl bg-green-300 shadow flex flex-col gap-3">
              <div className="flex flex-col items-center text-center">
                <span className="text-gray-700 text-lg sm:text-xl font-bold">
                  Break Count
                </span>

                <span className="text-blue-600 text-2xl sm:text-3xl font-extrabold mt-1">
                  {breakCount}
                </span>
              </div>

              <div className="flex flex-col items-center text-center">
                <span className="text-gray-700 text-lg sm:text-xl font-bold">
                  Current Break
                </span>

                <span className="text-blue-600 text-2xl sm:text-3xl font-extrabold mt-1">
                  {formatTime(breakTime)}
                </span>
              </div>
            </div>

            {/* Work Info */}
            <div className="p-4 sm:p-6 rounded-xl bg-green-300 shadow flex flex-col gap-3">
              <div className="flex flex-col items-center text-center">
                <span className="text-gray-700 text-lg sm:text-xl font-bold">
                  Total Work Time
                </span>

                <span className="text-blue-600 text-2xl sm:text-3xl font-extrabold mt-1">
                  {formatTime(elapsedTime)}
                </span>
              </div>

              <p
                className={`text-center text-lg sm:text-xl font-bold mt-2 ${
                  isOnBreak ? "text-red-500" : "text-green-600"
                }`}
              >
                {isOnBreak ? "On Break" : "Working"}
              </p>
            </div>
          </div>

          {/* Button */}
          <button
            onClick={() => {
              if (isOnBreak) {
                handleResumeWork();
              } else {
                setBreakTime(0);

                const start = Date.now();

                setBreakStartTime(start);

                localStorage.setItem("breakTime", "0");

                localStorage.setItem(
                  "breakStartTime",
                  start.toString()
                );

                toggleBreak();
              }
            }}
            disabled={!isCheckedIn}
            className={`w-full py-3 rounded-xl font-bold text-lg text-white transition ${
              isOnBreak
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-orange-600 hover:bg-orange-700"
            } disabled:opacity-50`}
          >
            {isOnBreak ? "Resume Work" : "Take Break"}
          </button>
        </div>
      </div>

      {/* Dialog */}
      {showBreakApp && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-lg z-40"></div>

          <div className="fixed top-[80px] left-1/2 transform -translate-x-1/2 bg-white rounded-2xl shadow-2xl w-[95%] sm:w-[80%] md:w-[60%] lg:w-[50%] p-6 z-50">
            <button
              onClick={() => setShowBreakApp(false)}
              className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded font-bold"
            >
              ✕
            </button>

            <BreakApp
              checkedIn={isCheckedIn}
              onBreakStart={() => console.log("Break Started")}
              onBreakEnd={() => console.log("Break Ended")}
            />
          </div>
        </>
      )}
    </>
  );
}