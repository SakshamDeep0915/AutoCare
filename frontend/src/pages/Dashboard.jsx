import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import SummaryCards from "../components/SummaryCards";
import RecentServices from "../components/RecentServices";
import { getDashboard } from "../services/dashboardService";
import ExpenseChart from "../components/ExpenseChart";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await getDashboard();
      setDashboard(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="text-center p-10 text-xl">
          Loading Dashboard...
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8">
          Dashboard
        </h1>

        <SummaryCards
          totalVehicles={dashboard.totalVehicles}
          totalServices={dashboard.totalServices}
          totalCost={dashboard.totalCost}
        />

        <div className="mb-8">
  <ExpenseChart />
</div>

        <RecentServices
          services={dashboard.recentServices}
        />
      </div>
    </>
  );
}

export default Dashboard;