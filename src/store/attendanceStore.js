// src/store/attendanceStore.js
import { create } from "zustand";
import axios from "axios";

const API = "https://attendance-backend-1-eohz.onrender.com"

const JSON_HEADERS = {
  headers: { "Content-Type": "application/json" },
};

let _interval = null;

/* ---------------------------------------
   GET USER FROM LOCAL STORAGE
---------------------------------------*/
const getUser = () => {
  const name = localStorage.getItem("name");
  return name || "unknown-user";
};

/* ---------------------------------------
   ALWAYS GET IST TIME
---------------------------------------*/
const getISTMs = () => {
  const nowIST = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
  });
  return new Date(nowIST).getTime();
};

/* ---------------------------------------
   UTC → IST → ms
---------------------------------------*/
const utcToISTMs = (utcStr) => {
  if (!utcStr) return null;

  const ist = new Date(utcStr).toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
  });

  return new Date(ist).getTime();
};

/* ---------------------------------------
   FORMAT TIME
---------------------------------------*/
const formatMs = (ms = 0) => {
  const total = Math.floor(ms / 1000);

  const h = String(Math.floor(total / 3600)).padStart(2, "0");
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");

  return `${h}:${m}:${s}`;
};

export const useAttendanceStore = create((set, get) => ({
  username: getUser(),

  /* ---------------------------------------
      STATE
  ---------------------------------------*/

  isCheckedIn: false,
  isOnBreak: false,
  startTime: null,
  elapsedTime: 0,

  breakStart: null,
  breakElapsed: 0,
  breakCount: 0,

  /* ---------------------------------------
      TIMER ENGINE
  ---------------------------------------*/

  _startTimer: () => {
    get()._stopTimer();

    if (!get().startTime) return;

    _interval = setInterval(() => {
      const now = getISTMs();
      const state = get();

      let worked = now - state.startTime - state.breakElapsed;

      if (state.isOnBreak && state.breakStart) {
        worked -= now - state.breakStart;
      }

      if (worked < 0) worked = 0;

      set({ elapsedTime: worked });
    }, 1000);
  },

  _stopTimer: () => {
    if (_interval) {
      clearInterval(_interval);
      _interval = null;
    }
  },

  /* ---------------------------------------
      CHECK IN
  ---------------------------------------*/

  checkIn: async () => {
    const username = getUser();

    try {
      const res = await axios.post(
        `${API}/check-in`, // ✅ FIXED
        { username },
        JSON_HEADERS,
      );

      const data = res.data;

      set({
        username,
        isCheckedIn: true,
        startTime: utcToISTMs(data.startTime),
        breakElapsed: (data.totalBreakDuration || 0) * 1000,
        breakCount: data.breakCount || 0,
        isOnBreak: false,
        breakStart: null,
        elapsedTime: 0,
      });

      get()._startTimer();
    } catch (err) {
      console.error("CHECK-IN ERROR:", err);
      alert(err.response?.data?.message || "Check-in failed");
    }
  },

  /* ---------------------------------------
      START BREAK
  ---------------------------------------*/

  startBreak: async () => {
    const username = get().username;

    try {
      const res = await axios.post(
        `${API}/start-break`,
        { username },
        JSON_HEADERS,
      );

      const data = res.data;

      get()._stopTimer();

      set({
        isOnBreak: true,
        breakStart: utcToISTMs(data.currentBreakStart),
        breakCount: data.breakCount,
      });
    } catch (err) {
      console.error("START BREAK ERROR:", err);
      alert(err.response?.data?.message || "Start break failed");
    }
  },

  /* ---------------------------------------
      END BREAK
  ---------------------------------------*/

  endBreak: async () => {
    const username = get().username;

    try {
      const res = await axios.post(
        `${API}/end-break`,
        { username },
        JSON_HEADERS,
      );

      const data = res.data;

      set({
        isOnBreak: false,
        breakStart: null,
        breakElapsed: (data.totalBreakDuration || 0) * 1000,
      });

      get()._startTimer();
    } catch (err) {
      console.error("END BREAK ERROR:", err);
      alert(err.response?.data?.message || "End break failed");
    }
  },

  toggleBreak: async () => {
    if (get().isOnBreak) {
      await get().endBreak();
    } else {
      await get().startBreak();
    }
  },

  /* ---------------------------------------
      CHECK OUT
  ---------------------------------------*/

  checkOut: async () => {
    const username = get().username;

    try {
      await axios.post(
        `${API}/check-out`, // ✅ FIXED
        { username },
        JSON_HEADERS,
      );

      get()._stopTimer();

      set({
        isCheckedIn: false,
        isOnBreak: false,
        startTime: null,
        elapsedTime: 0,
        breakStart: null,
        breakElapsed: 0,
        breakCount: 0,
      });
    } catch (err) {
      console.error("CHECK-OUT ERROR:", err);
      alert(err.response?.data?.message || "Checkout failed");
    }
  },

  /* ---------------------------------------
      RESUME SESSION AFTER REFRESH
  ---------------------------------------*/

  resumeFromBackend: async () => {
    const username = getUser();

    try {
      const res = await axios.get(`${API}/attendance`);

      const list = Array.isArray(res.data) ? res.data : res.data.records;

      const open = list.find((r) => r.username === username && !r.endTime);

      if (!open) return;

      set({
        username,
        isCheckedIn: true,
        startTime: utcToISTMs(open.startTime),
        breakElapsed: (open.totalBreakDuration || 0) * 1000,
        breakCount: open.breakCount || 0,
        isOnBreak: !!open.currentBreakStart,
        breakStart: open.currentBreakStart
          ? utcToISTMs(open.currentBreakStart)
          : null,
      });

      get()._startTimer();
    } catch (err) {
      console.error("RESUME ERROR:", err);
    }
  },

  resumeTimer: async () => {
    await get().resumeFromBackend();
  },

  /* ---------------------------------------
      RESET LOCAL
  ---------------------------------------*/

  resetLocal: () => {
    get()._stopTimer();

    set({
      isCheckedIn: false,
      isOnBreak: false,
      startTime: null,
      elapsedTime: 0,
      breakStart: null,
      breakElapsed: 0,
      breakCount: 0,
    });
  },

  /* ---------------------------------------
      FORMATTERS
  ---------------------------------------*/

  formatElapsed: (ms) => formatMs(ms),
}));
