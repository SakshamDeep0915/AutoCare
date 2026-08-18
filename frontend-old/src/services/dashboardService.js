import API from "./api";

export const getDashboard = () =>
  API.get("/dashboard");

export const getMonthlyExpenses = () =>
  API.get("/dashboard/monthly-expenses");

export const getExpenseReport = (
  registrationNumber = "",
  from = "",
  to = ""
) => {
  const params = {};

  if (registrationNumber) {
    params.registrationNumber =
      registrationNumber.trim().toUpperCase();
  }

  if (from) {
    params.from = from;
  }

  if (to) {
    params.to = to;
  }

  return API.get(
    "/dashboard/expense-report",
    {
      params,
    }
  );
};