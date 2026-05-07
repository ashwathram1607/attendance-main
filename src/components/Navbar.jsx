import { FaBars } from "react-icons/fa";
import { useAttendanceStore } from "../store/attendanceStore";
import Logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import CheckOutDialog from "./CheckOutDialog";
import LogoutDialog from "./LogoutDialog";

function formatTime(ms) {
  const totalSec = Math.floor(ms / 1000);
  const h = String(Math.floor(totalSec / 3600)).padStart(2, "0");
  const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
  const s = String(totalSec % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export default function Navbar({ onToggleSidebar }) {
  const { isCheckedIn, checkIn, checkOut, elapsedTime, isOnBreak } =
    useAttendanceStore();

  const [showCheckOutDialog, setShowCheckOutDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const navigate = useNavigate();

  const workedTimeFormatted = formatTime(elapsedTime);

  const handleLogoutClick = () => setShowLogoutDialog(true);
  const confirmLogout = () => {
    if (isCheckedIn) checkOut();
    localStorage.clear();
    navigate("/");
    setShowLogoutDialog(false);
  };
  const cancelLogout = () => setShowLogoutDialog(false);

  const handleCheckOutClick = () => setShowCheckOutDialog(true);
  const confirmCheckOut = () => {
    checkOut();
    setShowCheckOutDialog(false);
  };
  const cancelCheckOut = () => setShowCheckOutDialog(false);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-[#0b2c5d] shadow-md fixed w-full top-0 z-50"
      >
        <div className="flex items-center justify-between px-6 py-3">
          {/* Left: Sidebar + Logo */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.1, rotate: 10 }}
              onClick={onToggleSidebar}
              className="text-white text-2xl hover:text-gray-300"
            >
              <FaBars />
            </motion.button>

            <motion.img
              src={Logo}
              alt="Logo"
              className="h-10 w-10 object-contain"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 120, delay: 0.2 }}
            />
            <motion.span
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-white font-semibold text-lg"
            >
              Employee Dashboard
            </motion.span>
          </motion.div>

          {/* Right: Timer + Buttons */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white text-black font-mono px-3 py-1 rounded-md shadow-md min-w-[120px] text-center"
            >
              {workedTimeFormatted} {isOnBreak && "(On Break)"}
            </motion.div>

            {!isCheckedIn ? (
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 5px 15px rgba(0,0,0,0.2)",
                }}
                className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-md shadow-md transition-all"
                onClick={checkIn}
              >
                Check-In
              </motion.button>
            ) : (
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 5px 15px rgba(0,0,0,0.2)",
                }}
                className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-md shadow-md transition-all"
                onClick={handleCheckOutClick}
              >
                Check-Out
              </motion.button>
            )}

            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 5px 15px rgba(0,0,0,0.2)",
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded-md shadow-md transition-all"
              onClick={handleLogoutClick}
            >
              Logout
            </motion.button>
          </motion.div>
        </div>
      </motion.nav>

      {showCheckOutDialog && (
        <CheckOutDialog
          workedTime={workedTimeFormatted}
          onConfirm={confirmCheckOut}
          onCancel={cancelCheckOut}
        />
      )}

      {showLogoutDialog && (
        <LogoutDialog onConfirm={confirmLogout} onCancel={cancelLogout} />
      )}
    </>
  );
}
