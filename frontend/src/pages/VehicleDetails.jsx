import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Car,
  Calendar,
  Fuel,
  Gauge,
  Shield,
  Wrench,
  History,
} from "lucide-react";
import { getVehicleById } from "../services/vehicleService";
import Navbar from "../components/Navbar";

function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicle();
  }, []);

  const fetchVehicle = async () => {
    try {
      const res = await getVehicleById(id);
      setVehicle(res.data.vehicle);
    } catch (err) {
      console.error(err);
      alert("Failed to load vehicle");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <h2 className="text-xl font-semibold">Loading...</h2>
        </div>
      </>
    );
  }

  if (!vehicle) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <h2 className="text-red-500 text-xl font-semibold">
            Vehicle not found
          </h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-blue-600 mb-6 hover:underline"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        {/* Vehicle Card */}
        <div className="bg-white shadow-lg rounded-2xl p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-blue-100 p-4 rounded-full">
              <Car className="text-blue-600" size={35} />
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                {vehicle.brand} {vehicle.model}
              </h1>

              <p className="text-gray-500">
                {vehicle.registrationNumber}
              </p>
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <InfoCard
              icon={<Calendar />}
              title="Year"
              value={vehicle.year}
            />

            <InfoCard
              icon={<Fuel />}
              title="Fuel Type"
              value={vehicle.fuelType}
            />

            <InfoCard
              icon={<Gauge />}
              title="Odometer"
              value={`${vehicle.odometer} km`}
            />

            <InfoCard
              icon={<Shield />}
              title="Insurance Expiry"
              value={new Date(vehicle.insuranceExpiry).toLocaleDateString()}
            />
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap gap-4">
            {/* Add Service */}
            <button
            onClick={()=>
              navigate(`/vehicles/${vehicle._id}/add-service`)

            }
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg transition"
            >
              <Wrench size={20} />
              Add Service
            </button>

            {/* View Service History */}
            <button
            onClick={() =>
              navigate(`/vehicles/${vehicle._id}/services`)
            }

            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg transition"
            >
              <History size={20} />
              View Service History
            </button>

            {/* AI Analyze Vehicle */}
  <button
    onClick={() =>
      navigate(`/ai-report/${vehicle._id}`)
    }
    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-lg transition"
  >
    🤖 Analyze Vehicle
  </button>

  <button
  onClick={() =>
    navigate(`/vehicles/${vehicle._id}/add-fuel`)
  }
  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg transition"
>
  ⛽ Add Fuel
</button>

<button
  onClick={() =>
    navigate(`/vehicles/${vehicle._id}/fuel-history`)
  }
  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg transition"
>
  ⛽ Fuel History
</button>

            </div>
        </div>
      </div>
    </>
  );
}

function InfoCard({ icon, title, value }) {
  return (
    <div className="border rounded-xl p-5 flex gap-4 items-center shadow-sm">
      <div className="bg-blue-100 p-3 rounded-full text-blue-600">
        {icon}
      </div>

      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="font-semibold text-lg">{value}</h3>
      </div>
    </div>
  );
}

export default VehicleDetails;