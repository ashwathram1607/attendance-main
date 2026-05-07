import axios from "axios";

const API_URL = "http://localhost:8000/attendance"; // your NestJS backend

// ✅ Save attendance data to backend
export const saveAttendance = async (attendanceData) => {
  try {
    const res = await axios.post(API_URL, attendanceData);
    return res.data;
  } catch (err) {
    console.error("Error saving attendance:", err);
    throw err;
  }
};

// ✅ Fetch all attendance records
export const getAllAttendance = async () => {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (err) {
    console.error("Error fetching attendance:", err);
    throw err;
  }
};
