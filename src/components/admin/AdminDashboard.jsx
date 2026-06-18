import { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import AttendanceTable from "./AttendanceTable";
import LeaveTable from "./LeaveTable";
import PermissionTable from "./PermissionTable";
import UsersTable from "./UsersTable";
import AdminLeaveBalance from "./AdminLeaveBalance";
import Signup from "../../pages/Signup";
import { color, motion } from "framer-motion";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [leaveData, setLeaveData] = useState([]);
  const [permissionData, setPermissionData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [balanceData, setBalanceData] = useState([]);
  const [selectedUser, setSelectedUser] = useState("All");

  const BASE_URL = "https://attendance-backend-1-pzsj.onrender.com";

  // ================= FETCH ON TAB CHANGE =================
  useEffect(() => {
    if (activeTab === "attendance") fetchAttendance();
    if (activeTab === "leaves") fetchLeaves();
    if (activeTab === "permission") fetchPermissions();
    if (activeTab === "users") fetchUsers();
    if (activeTab === "leaveBalance") fetchBalances(); 
  }, [activeTab]);

  // ================= ATTENDANCE =================
  const fetchAttendance = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/attendance`);
      setAttendanceData(res.data);
    } catch (err) {
      console.error("Error fetching attendance", err);
    }
  };

  // ================= LEAVES =================
  const fetchLeaves = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/leaves`);
      setLeaveData(res.data);
    } catch (err) {
      console.error("Error fetching leaves", err);
    }
  };

  // ================= PERMISSIONS =================
  const fetchPermissions = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/permission`);
      setPermissionData(res.data);
    } catch (err) {
      console.error("Error fetching permissions", err);
    }
  };

  // ================= USERS =================
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${BASE_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsersData(res.data);
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  // ================= LEAVE BALANCES (ADDED - FIXED) =================
  const fetchBalances = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/leaves/balances`);
      setBalanceData(res.data);
    } catch (err) {
      console.error("Error fetching leave balances", err);
    }
  };

  const uniqueUsers = [
    "All",
    ...new Set(
      attendanceData.map((d) => d.username).filter((u) => u && u.trim() !== "")
    ),
  ];

  const filteredData =
    selectedUser === "All"
      ? attendanceData
      : attendanceData.filter((d) => d.username === selectedUser);

  const formatToHours = (seconds) => {
    if (seconds === undefined || seconds === null || isNaN(seconds))
      return "0 hrs";
    const hours = seconds / 3600;
    return `${hours.toFixed(2)} hrs`;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });
  };

  const exportToExcel = () => {
    if (filteredData.length === 0) return alert("No data to export!");

    const rows = [
      ["ID", "Start", "End", "Worked", "Breaks", "Total Break", "Username"],
      ...filteredData.map((item) => [
        item.id,
        formatDateTime(item.startTime),
        formatDateTime(item.endTime),
        formatToHours(item.workedDuration),
        item.breakCount,
        item.totalBreakDuration
          ? formatToHours(item.totalBreakDuration)
          : "0 hrs",
        item.username,
      ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(rows);
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
              title:"Signup",
              desc:"Create new employee or admin accounts",
              color: "from-emerald-800 to-amber-500",
              tab:"signup",
            },
          
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
            {
              title:  "Leave Balances",
              desc: "View and edit employee leave balances.",
              color: "from-cyan-500 to-blue-500",
              tab: "leaveBalance",
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
  if (activeTab=="signup")
    return <Signup/>
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

  if (activeTab === "users")
    return (
      <UsersTable data={usersData} onBack={() => setActiveTab("")} />
    );

  if (activeTab === "leaveBalance")
    return (
      <AdminLeaveBalance
        data={balanceData}
        onBack={() => setActiveTab("")}
      />
    );
    if (activeTab === "signup")
  return <SignupForm onBack={() => setActiveTab("")} />;

  return null;
}