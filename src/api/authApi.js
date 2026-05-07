import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/auth",
  headers: { "Content-Type": "application/json" },
});

export const loginApi = async (data) => {
  const payload = { email: data.Email, password: data.Password };
  const res = await api.post("/login", payload);
  return res.data;
};

export const signupApi = async (data) => {
  const payload = {
    name: data.Name,
    email: data.Email,
    password: data.Password,
  };
  const res = await api.post("/signup", payload);
  return res.data;
};
