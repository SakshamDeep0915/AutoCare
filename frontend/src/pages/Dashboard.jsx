import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import SummaryCards from "../components/SummaryCards";
import RecentServices from "../components/RecentServices";
import ExpenseChart from "../components/ExpenseChart";
import { getDashboard } from "../services/dashboardService";
import HealthAlerts from "../components/HealthAlerts";

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
      <div className="flex items-center justify-between mb-8">

  <h1 className="text-4xl font-bold">
    Dashboard
  </h1>

  <button
    onClick={() => navigate("/chatbot")}
    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-lg font-semibold transition"
  >
    🤖 Ask AutoCare AI
  </button>

</div>

      <SummaryCards
  totalVehicles={dashboard.totalVehicles}
  totalServices={dashboard.totalServices}
  maintenanceCost={dashboard.maintenanceCost}
  fuelExpense={dashboard.fuelExpense}
/>

      <div className="my-8">
        <ExpenseChart />
      </div>
      <HealthAlerts /> 

      {/* Nearby Services / GPS */}

<div className="bg-white rounded-2xl shadow-lg p-6 mb-8">

  <div className="flex flex-col md:flex-row items-center justify-between gap-5">

    <div className="flex items-center gap-4">

      <div className="bg-blue-100 p-4 rounded-full text-3xl">
        📍
      </div>

      <div>
        <h2 className="text-2xl font-bold">
          Nearby Vehicle Services
        </h2>

        <p className="text-gray-500 mt-1">
          Find nearby fuel stations, service centers,
          tyre shops, EV charging stations and more.
        </p>
      </div>

    </div>


    <button
      onClick={() => navigate("/nearby-services")}
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap"
    >
      📍 Find Nearby Services
    </button>

  </div>

</div>

      { /* My Vehicles */ }

      <div className="mb-10">
        {/* Section Header */}

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold">
            🚗 My Vehicles
          </h2>

          <button
          onClick={() => navigate("/add-vehicle")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded=lg font-semibold transition"
          >
            <span className="text-xl">+</span>
            Add New Vehicle
          </button>
        </div>

        {/* Vehicles*/}
        {dashboard.vehicles.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <div className="text-5xl mb-4">
              🚗
            </div>
            <h3 className="text-xl font-semibold mb-2">
              No Vehicles Added
            </h3>

            <p className="text-xl font-semibold mb-2">
              Add your first vehicle to start tracking its health and maintenance.
            </p>

            <button
            onClick={() => navigate("/add-vehicle")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semi"
            >
              + Add Your First Vehicle
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboard.vehicles.map((vehicle) => (
              <div
              key={vehicle._id}
              className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition"
              >
                {/* Vehicle Icon */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="bg-blue-100 p-4 rounded-full text-2xl">
                    🚗
                  </div>

                  <div>
                    <h3 className="text-xl font-bold">
                      {vehicle.brand}
                    </h3>

                    <p className="text-gray-500">
                      {vehicle.model}
                    </p>
                  </div>
                </div>

                {/* Vehicle Details */}

                <div className="space-y-2 text-gray-600">
                  <p>
                    <span className="font-semibold">
                      Registration:
                    </span>{" "}
                    {vehicle.registrationNumber.toUpperCase()}
                  </p>

                  <p>
                    <span className="font-semibold">
                      Year:
                    </span>{" "}
                    {vehicle.year}
                  </p>

                  <p>
              <span className="font-semibold">
                Fuel:
              </span>{" "}
              {vehicle.fuelType}
            </p>

            <p>
              <span className="font-semibold">
                Odometer:
              </span>{" "}
              {vehicle.odometer} km
            </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-6">
                  <button
              onClick={() =>
                navigate(`/vehicles/${vehicle._id}`)
              }
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              View Details
            </button>

            <button
              onClick={() =>
                navigate(`/edit-vehicle/${vehicle._id}`)
              }
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium"
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