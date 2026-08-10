import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import SummaryCards from "../components/SummaryCards";
import RecentServices from "../components/RecentServices";
import ExpenseChart from "../components/ExpenseChart";
import { getDashboard } from "../services/dashboardService";

function Dashboard() {
  const navigate = useNavigate();

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

  if(loading) {
    return (
      <>
      <Navbar />
      <div className="text-center mt-20 text-xl">
        Loading Dashboard...
      </div>

      </>
    );
  }

  return (
    <>
    <Navbar />
    <div className="max-w-7xl mx-autop p-6">
      <h1 className="text-4xl font-bold mb-8">
        Dashboard
      </h1>

      <SummaryCards
      totalVehicles={dashboard.totalVehicles}
      totalServices={dashboard.totalServices}
      totalCost={dashboard.totalCost}
      />

      <div className="my-8">
        <ExpenseChart />
      </div>

      { /* My Vehicles */ }

      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">
          🚗 My Vehicles
        </h2>
        {dashboard.vehicles.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-6">
            No vehicles found.
            </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {dashboard.vehicles.map((vehicle) =>(
              <div
              key={vehicle._id}
              className="bg-white shadow-lg rounded-xl p-6"
              >
                <h3 className="text-xl font-bold">
                  {vehicle.brand} {vehicle.model}
                </h3>

                <p className="text-grey-500 mt-2">
                  {vehicle.registrationNumber}
                </p>
                <div className="flex gap-3 mt-5">
                  <button
                  onClick={() =>
                    navigate(`/vehicles/${vehicle._id}`)
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    View Details
                  </button>

                  <button
                  onClick={() =>
                    navigate(`/edit-vehicle/${vehicle._id}`)
                  }
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                  >
                    Edit
                  </button>
                  </div>
                  </div>
            ))}
          </div>
        )}
      </div>

      <RecentServices
      services={dashboard.recentServices}
      />
    </div>
    </>
  );
}

export default Dashboard;