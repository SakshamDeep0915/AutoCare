import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { getMonthlyExpenses } from "../services/dashboardService";

function ExpenseChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    loadChart();
  }, []);

  const loadChart = async () => {
    try {
      const res = await getMonthlyExpenses();

      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const formattedData = res.data.monthlyExpenses.map((item) => ({
        month: months[item._id.month - 1],
        expense: item.totalExpense,
      }));

      console.log(formattedData);

      setData(formattedData);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
      <h2 className="text-2xl font-bold mb-6">
        Monthly Maintenance Expenses
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="expense"
            fill="#2563eb"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ExpenseChart;