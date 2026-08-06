import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getVehicles } from "../services/vehicleService";

function Dashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await getVehicles();

      console.log("Vehicle Response:", res.data);

      setVehicles(res.data.vehicles || []);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white px-8 py-5 flex justify-between items-center">
        <h1 className="text-3xl font-bold">🚗 AutoCare AI</h1>

        <Link
          to="/add-vehicle"
          className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200"
        >
          + Add Vehicle
        </Link>
      </header>

      {/* Main */}
      <main className="p-8">
        <h2 className="text-2xl font-bold mb-6">
          Welcome Back 👋
        </h2>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-gray-500">Total Vehicles</h3>
            <p className="text-3xl font-bold">
              {vehicles.length}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-gray-500">Health Score</h3>
            <p className="text-3xl font-bold text-green-600">
              95%
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-gray-500">Service Due</h3>
            <p className="text-3xl font-bold text-orange-500">
              1
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-gray-500">AI Diagnosis</h3>
            <p className="text-3xl font-bold text-purple-600">
              0
            </p>
          </div>
        </div>

        {/* Vehicle List */}
        <h2 className="text-2xl font-bold mb-4">
          My Vehicles
        </h2>

        {vehicles.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <h3 className="text-xl font-semibold mb-3">
              No vehicles found
            </h3>

            <Link
              to="/add-vehicle"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg"
            >
              Add Your First Vehicle
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle._id}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h3 className="text-2xl font-bold">
                  {vehicle.brand} {vehicle.model}
                </h3>

                <p className="mt-2">
                  <strong>Registration:</strong>{" "}
                  {vehicle.registrationNumber}
                </p>

                <p>
                  <strong>Fuel:</strong> {vehicle.fuelType}
                </p>

                <p>
                  <strong>Odometer:</strong>{" "}
                  {vehicle.odometer} km
                </p>

                <button className="mt-5 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;