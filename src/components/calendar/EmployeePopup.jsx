import React from "react";

export default function EmployeePopup({ record, onClose }) {
  if (!record) return null;

  const {
    username,
    workedDuration,
    totalBreakDuration,
    breakCount,
    sessions = [],
  } = record;

  const secToHHMMSS = (s) => {
    if (!s) return "0s";
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const ss = s % 60;
    return `${h > 0 ? h + "h " : ""}${m > 0 ? m + "m " : ""}${ss}s`;
  };

  const formatISO = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-[900px] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-cyan-200 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {username} — Full Day Summary
          </h2>
          <button
            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        {/* Summary */}
        <div className="p-5 grid grid-cols-3 gap-4 text-center">
          <div className="bg-green-100 border border-green-300 rounded-lg p-3">
            <h4 className="font-semibold text-gray-800">Total Worked</h4>
            <p className="text-lg font-bold text-green-700">
              {secToHHMMSS(workedDuration)}
            </p>
          </div>
          <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3">
            <h4 className="font-semibold text-gray-800">Breaks Taken</h4>
            <p className="text-lg font-bold text-yellow-700">{breakCount}</p>
          </div>
          <div className="bg-blue-100 border border-blue-300 rounded-lg p-3">
            <h4 className="font-semibold text-gray-800">
              Total Break Duration
            </h4>
            <p className="text-lg font-bold text-blue-700">
              {secToHHMMSS(totalBreakDuration)}
            </p>
          </div>
        </div>

        {/* Sessions list */}
        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Individual Sessions
          </h3>
          {sessions.map((s, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-md p-3 mb-3 bg-gray-50"
            >
              <div className="flex justify-between text-sm">
                <p>
                  <strong>Start:</strong> {formatISO(s.startTime)}
                </p>
                <p>
                  <strong>End:</strong>{" "}
                  {s.endTime ? formatISO(s.endTime) : "Ongoing"}
                </p>
              </div>
              <p className="text-sm text-gray-700 mt-1">
                Worked: {secToHHMMSS(s.workedDuration)} | Breaks: {s.breakCount}{" "}
                | Break Time: {secToHHMMSS(s.totalBreakDuration)}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-100 border-t border-gray-200 text-center">
          <button
            onClick={onClose}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Back to Calendar
          </button>
        </div>
      </div>
    </div>
  );
}
