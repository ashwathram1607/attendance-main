import React, { useEffect, useState } from "react";
import { useAttendanceStore } from "../store/attendanceStore";

export default function BreakInfo() {
  const {
    isOnBreak,
    breakCount,
    breakElapsed,
    toggleBreak,
    elapsedTime,
    isCheckedIn,
  } = useAttendanceStore();

  const [currentBreakTime, setCurrentBreakTime] = useState(0);

  // 🕒 Update the current break timer if on break
  useEffect(() => {
    let interval;
    if (isOnBreak) {
      interval = setInterval(() => {
        setCurrentBreakTime(
          Date.now() - useAttendanceStore.getState().breakStart
        );
      }, 1000);
    } else {
      setCurrentBreakTime(0);
    }
    return () => clearInterval(interval);
  }, [isOnBreak]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const s = String(totalSeconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const netWorkedTime = elapsedTime; // already excludes breaks

  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="flex flex-col justify-between rounded-lg p-4">
      {/* 🧮 Net Hours Card */}
      <div className="rounded-lg border p-4 shadow bg-white mb-4">
        <h3 className="font-bold text-lg text-blue-700">Net Hours</h3>
        <div className="flex flex-col mt-2">
          <div className="text-3xl font-extrabold">
            {formatTime(netWorkedTime)}
          </div>
          <div className="text-sm text-gray-600">
            Worked − Breaks = {formatTime(netWorkedTime)}
          </div>
        </div>
      </div>

      {/* 🕓 Header */}
      <div className="flex justify-between items-start font-bold tracking-[0.2px] text-blue-600 text-2xl mb-2">
        <div>Break Time & Counts</div>
      </div>

      {/* 📊 Stats */}
      <div className="grid grid-cols-2 gap-6 my-4">
        <div className="flex flex-col gap-1 p-3 rounded-md bg-gradient-to-br from-green-100 to-emerald-200 shadow">
          <p className="font-semibold text-lg text-gray-700">Break Count:</p>
          <p className="font-extrabold text-blue-600 text-xl">{breakCount}</p>
          <p className="font-semibold text-lg text-gray-700">Current:</p>
          <p className="font-extrabold text-blue-600 text-xl">
            {formatTime(currentBreakTime)}
          </p>
        </div>
        <div className="flex flex-col gap-1 p-3 rounded-md bg-gradient-to-br from-green-100 to-emerald-200 shadow">
          <p className="font-semibold text-lg text-gray-700">Total Break:</p>
          <p className="font-extrabold text-blue-600 text-xl">
            {formatTime(breakElapsed)}
          </p>
          <p
            className={`font-bold text-xl ${
              isOnBreak ? "text-red-600" : "text-green-700"
            }`}
          >
            {isOnBreak ? "On Break" : "Working"}
          </p>
        </div>
      </div>

      {/* 🎯 Action Button */}
      <button
        onClick={toggleBreak}
        disabled={!isCheckedIn}
        className={`w-full font-bold text-white py-3 rounded-md transition ${
          isOnBreak
            ? "bg-red-600 hover:bg-red-700"
            : "bg-green-600 hover:bg-green-700"
        } disabled:opacity-50`}
      >
        {isOnBreak ? "Resume Work" : "Take Break"}
      </button>

      {/* 🪟 Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-blue-900/60 backdrop-blur-sm flex justify-center items-center z-[2000]">
          <div className="bg-gradient-to-br from-blue-900 via-blue-600 to-blue-300 p-5 rounded-lg w-[700px] max-w-[900px]">
            <div className="bg-white rounded-lg p-5 max-h-[75vh] overflow-y-auto relative">
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded font-bold"
              >
                ✕
              </button>
              <h3 className="text-xl font-bold text-blue-700 text-center border-b-2 border-blue-400 pb-2">
                Break Details
              </h3>

              {/* Example details grid */}
              <div className="mt-4">
                <div className="grid grid-cols-4 gap-2 bg-blue-600 text-white font-bold text-sm py-2 px-1 rounded">
                  <div className="text-center">#</div>
                  <div className="text-center">Start</div>
                  <div className="text-center">End</div>
                  <div className="text-center">Duration</div>
                </div>
                <div className="grid grid-cols-4 gap-2 border-b text-sm py-2 px-1 text-center">
                  <div>1</div>
                  <div>10:00 AM</div>
                  <div>10:15 AM</div>
                  <div>00:15:00</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
