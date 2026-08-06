import API from "./api";

export const sendOTP = (userData) =>
  API.post("/auth/send-otp", userData);

export const verifyOTP = (userData) =>
  API.post("/auth/verify-otp", userData);

export const loginUser = (userData) =>
  API.post("/auth/login", userData);