import { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import AttendanceTable from "./AttendanceTable";
import LeaveTable from "./LeaveTable";
import PermissionTable from "./PermissionTable";
import UsersTable from "./UsersTable"; // ✅ IMPORT THIS
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [leaveData, setLeaveData] = useState([]);
  const [permissionData, setPermissionData] = useState([]);
  const [usersData, setUsersData] = useState([]); // ✅ NEW STATE
  const [selectedUser, setSelectedUser] = useState("All");

  useEffect(() => {
    if (activeTab === "attendance") fetchAttendance();
    if (activeTab === "leaves") fetchLeaves();
    if (activeTab === "permission") fetchPermissions();
    if (activeTab === "users") fetchUsers(); // ✅ NEW
  }, [activeTab]);

  const fetchAttendance = async () => {
    try {
      const res = await axios.get(
        "https://attendance-backend-snvv.onrender.com/attendance",
      );
      setAttendanceData(res.data);
    } catch (err) {
      console.error("Error fetching attendance", err);
    }
  };

  const fetchLeaves = async () => {
    try {
      const res = await axios.get(
        "https://attendance-backend-snvv.onrender.com/leaves",
      );
      setLeaveData(res.data);
    } catch (err) {
      console.error("Error fetching leaves", err);
    }
  };

  const fetchPermissions = async () => {
    try {
      const res = await axios.get(
        "https://attendance-backend-snvv.onrender.com/permission",
      );
      setPermissionData(res.data);
    } catch (err) {
      console.error("Error fetching permissions", err);
    }
  };

  // ✅ NEW FUNCTION
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token"); // ✅ get token

      const res = await axios.get(
        "https://attendance-backend-snvv.onrender.com/users",
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ send token
          },
        },
      );

      setUsersData(res.data);
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  const uniqueUsers = [
    "All",
    ...new Set(
      attendanceData.map((d) => d.username).filter((u) => u && u.trim() !== ""),
    ),
  ];

  const filteredData =
    selectedUser === "All"
      ? attendanceData
      : attendanceData.filter((d) => d.username === selectedUser);

  const exportToExcel = () => {
    if (filteredData.length === 0) return alert("No data to export!");
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    const fileName =
      selectedUser === "All"
        ? "All_Attendance.xlsx"
        : `${selectedUser}_Attendance.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" },
    }),
  };

  // ================= DASHBOARD =================
  if (activeTab === "")
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-56 h-56 bg-blue-300 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-300 rounded-full blur-3xl opacity-20 animate-pulse"></div>

        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-extrabold text-blue-700 mb-10 drop-shadow-md"
        >
          Admin Dashboard
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-5xl z-10">
          {[
            {
              title: "Attendance Records",
              desc: "View and export employee attendance data.",
              color: "from-blue-500 to-indigo-500",
              tab: "attendance",
            },
            {
              title: "Leave Requests",
              desc: "Review all employee leave requests.",
              color: "from-emerald-500 to-teal-500",
              tab: "leaves",
            },
            {
              title: "Permission Requests",
              desc: "View all employee short-duration permissions.",
              color: "from-purple-500 to-pink-500",
              tab: "permission",
            },
            {
              title: "Users Table",
              desc: "View all employee details.",
              color: "from-orange-500 to-red-500",
              tab: "users",
            },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              whileHover={{
                scale: 1.05,
                rotate: 1,
                boxShadow: "0px 10px 25px rgba(0,0,0,0.15)",
              }}
              onClick={() => setActiveTab(card.tab)}
              className={`bg-gradient-to-br ${card.color} text-white rounded-2xl shadow-lg p-10 text-center cursor-pointer`}
            >
              <h3 className="text-2xl font-semibold mb-4">{card.title}</h3>
              <p className="text-white/90 text-sm">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    );

  // ================= TABS =================
  if (activeTab === "attendance")
    return (
      <AttendanceTable
        data={filteredData}
        users={uniqueUsers}
        selectedUser={selectedUser}
        onSelectUser={setSelectedUser}
        onExport={exportToExcel}
        onBack={() => setActiveTab("")}
      />
    );

  if (activeTab === "leaves")
    return <LeaveTable data={leaveData} onBack={() => setActiveTab("")} />;

  if (activeTab === "permission")
    return (
      <PermissionTable data={permissionData} onBack={() => setActiveTab("")} />
    );

  // ✅ USERS TAB
  if (activeTab === "users")
    return <UsersTable data={usersData} onBack={() => setActiveTab("")} />;
}
