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

      const formattedData = res.data.monthlyExpenses.map(
        (item) => ({
          month: `${months[item.month - 1]} ${item.year}`,
          expense: item.totalExpense || 0,
        })
      );

      console.log("Monthly Total Expenses:", formattedData);

      setData(formattedData);
    } catch (err) {
      console.error("Expense Chart Error:", err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-8">

      {/* Heading */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          Monthly Total Expenses
        </h2>

        <p className="text-gray-500 text-sm mt-1">
          Maintenance + Fuel Expenses
        </p>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 20,
            left: 10,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="month"
          />

          <YAxis />

          <Tooltip
            formatter={(value) => [
              `₹${Number(value).toLocaleString("en-IN")}`,
              "Total Expense",
            ]}
          />

          <Bar
            dataKey="expense"
            fill="#2563eb"
            radius={[6, 6, 0, 0]}
          />

        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}

export default ExpenseChart;