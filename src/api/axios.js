import axios from "axios";

export const api = axios.create({
  baseURL: "https://attendance-backend-1-pzsj.onrender.com", // NestJS backend URL
});
