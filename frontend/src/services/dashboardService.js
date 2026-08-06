import API from "./api";

export const getDashboard = () => API.get("/dashboard");

export const getMonthlyExpenses = () => API.get("/dashboard/monthly-expenses");
