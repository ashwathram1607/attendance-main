import React from "react";
import BreakInfo from "./BreakInfo";
import { useAttendanceStore } from "../store/attendanceStore";

function BreakApp() {
  const { isCheckedIn } = useAttendanceStore();

  return (
    <div className="flex-1 w-full rounded-xl p-3 flex flex-col justify-center tracking-[0.2px] text-[17px] font-medium text-[rgb(60,60,119)]">
      <BreakInfo checkedIn={isCheckedIn} />
    </div>
  );
}

export default BreakApp;
