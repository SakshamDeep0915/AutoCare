import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

import {
  ArrowLeft,
  Fuel,
  Trash2,
  Plus,
  Calendar,
  Gauge,
  IndianRupee,
  TrendingUp,
} from "lucide-react";

function FuelHistory() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [fuelExpenses, setFuelExpenses] = useState([]);
  const [fuelEfficiency, setFuelEfficiency] = useState(null);
  const [efficiencyMessage, setEfficiencyMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // =========================
  // Fetch Vehicle + Fuel History + Efficiency
  // =========================
  useEffect(() => {
    fetchData();
  }, [vehicleId]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      // =========================
      // Get Vehicle
      // =========================
      const vehicleRes = await axios.get(
        `http://localhost:5000/api/vehicles/${vehicleId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVehicle(vehicleRes.data.vehicle);

      // =========================
      // Get Fuel History
      // =========================
      const fuelRes = await axios.get(
        `http://localhost:5000/api/fuel/vehicle/${vehicleId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFuelExpenses(
        fuelRes.data.fuelExpenses || []
      );

      // =========================
      // Get Fuel Efficiency
      // =========================
      const efficiencyRes = await axios.get(
        `http://localhost:5000/api/fuel/vehicle/${vehicleId}/efficiency`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (efficiencyRes.data.fuelEfficiency !== null) {
        setFuelEfficiency(
          efficiencyRes.data.fuelEfficiency
        );

        setEfficiencyMessage("");
      } else {
        setFuelEfficiency(null);

        setEfficiencyMessage(
          efficiencyRes.data.message ||
            "Add more fuel records to calculate efficiency."
        );
      }

    } catch (error) {
      console.error(
        "Fuel History Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to load fuel history"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Delete Fuel Entry
  // =========================
  const handleDelete = async (fuelId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this fuel record?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/fuel/${fuelId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(
        "Fuel record deleted successfully"
      );

      // Reload everything so efficiency updates
      fetchData();

    } catch (error) {
      console.error(
        "Delete Fuel Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete fuel record"
      );
    }
  };

  // =========================
  // Total Fuel Expense
  // =========================
  const totalExpense = fuelExpenses.reduce(
    (total, fuel) =>
      total + Number(fuel.totalCost || 0),
    0
  );

  // =========================
  // Total Fuel Quantity
  // =========================
  const totalQuantity = fuelExpenses.reduce(
    (total, fuel) =>
      total + Number(fuel.quantity || 0),
    0
  );

  // =========================
  // Loading
  // =========================
  if (loading) {
    return (
      <>
        <Navbar />

        <div className="text-center mt-20 text-xl">
          Loading Fuel History...
        </div>
      </>
    );
  }

  // =========================
  // Vehicle Not Found
  // =========================
  if (!vehicle) {
    return (
      <>
        <Navbar />

        <div className="text-center mt-20">
          <h2 className="text-2xl font-bold">
            Vehicle not found
          </h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-8 px-4">

        <div className="max-w-6xl mx-auto">

          {/* =========================
              Back Button
          ========================= */}
          <button
            onClick={() =>
              navigate(`/vehicles/${vehicleId}`)
            }
            className="flex items-center gap-2 text-blue-600 hover:underline mb-6"
          >
            <ArrowLeft size={20} />
            Back to Vehicle
          </button>

          {/* =========================
              Header
          ========================= */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

              <div className="flex items-center gap-4">

                <div className="bg-green-100 p-4 rounded-full">
                  <Fuel
                    className="text-green-600"
                    size={32}
                  />
                </div>

                <div>

                  <h1 className="text-3xl font-bold text-gray-800">
                    Fuel History
                  </h1>

                  <p className="text-gray-500 mt-1">
                    {vehicle.brand} {vehicle.model}
                  </p>

                  <p className="font-bold tracking-wide text-gray-700">
                    {vehicle.registrationNumber?.toUpperCase()}
                  </p>

                </div>

              </div>

              <button
                onClick={() =>
                  navigate(
                    `/vehicles/${vehicleId}/add-fuel`
                  )
                }
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg font-semibold transition"
              >
                <Plus size={20} />
                Add Fuel
              </button>

            </div>

          </div>

          {/* =========================
              Summary Cards
          ========================= */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">

            {/* Total Fuel Expense */}
            <div className="bg-white rounded-2xl shadow-lg p-6">

              <div className="flex items-center gap-4">

                <div className="bg-blue-100 p-3 rounded-full">

                  <IndianRupee
                    className="text-blue-600"
                    size={25}
                  />

                </div>

                <div>

                  <p className="text-gray-500">
                    Total Fuel Expense
                  </p>

                  <h2 className="text-3xl font-bold text-gray-800">
                    ₹{totalExpense.toFixed(2)}
                  </h2>

                </div>

              </div>

            </div>

            {/* Total Fuel Quantity */}
            <div className="bg-white rounded-2xl shadow-lg p-6">

              <div className="flex items-center gap-4">

                <div className="bg-green-100 p-3 rounded-full">

                  <Fuel
                    className="text-green-600"
                    size={25}
                  />

                </div>

                <div>

                  <p className="text-gray-500">
                    Total Fuel Used
                  </p>

                  <h2 className="text-3xl font-bold text-gray-800">
                    {totalQuantity.toFixed(2)} L
                  </h2>

                </div>

              </div>

            </div>

            {/* Fuel Efficiency */}
            <div className="bg-white rounded-2xl shadow-lg p-6">

              <div className="flex items-center gap-4">

                <div className="bg-purple-100 p-3 rounded-full">

                  <TrendingUp
                    className="text-purple-600"
                    size={25}
                  />

                </div>

                <div>

                  <p className="text-gray-500">
                    Fuel Efficiency
                  </p>

                  {fuelEfficiency !== null ? (

                    <h2 className="text-3xl font-bold text-gray-800">
                      {Number(
                        fuelEfficiency
                      ).toFixed(2)}{" "}
                      <span className="text-lg font-semibold">
                        km/L
                      </span>
                    </h2>

                  ) : (

                    <p className="text-sm text-gray-500 mt-1">
                      {efficiencyMessage}
                    </p>

                  )}

                </div>

              </div>

            </div>

          </div>

          {/* =========================
              Fuel Records
          ========================= */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

            <div className="p-6 border-b">

              <h2 className="text-2xl font-bold text-gray-800">
                Fuel Records
              </h2>

              <p className="text-gray-500 mt-1">
                Complete fuel expense history
              </p>

            </div>

            {fuelExpenses.length === 0 ? (

              <div className="text-center py-16 px-6">

                <Fuel
                  className="mx-auto text-gray-300"
                  size={60}
                />

                <h3 className="text-xl font-semibold mt-5">
                  No Fuel Records
                </h3>

                <p className="text-gray-500 mt-2 mb-6">
                  Start tracking your fuel expenses.
                </p>

                <button
                  onClick={() =>
                    navigate(
                      `/vehicles/${vehicleId}/add-fuel`
                    )
                  }
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
                >
                  + Add First Fuel Record
                </button>

              </div>

            ) : (

              <div className="divide-y">

                {fuelExpenses.map((fuel) => (

                  <div
                    key={fuel._id}
                    className="p-6 hover:bg-gray-50 transition"
                  >

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                      {/* Main Info */}
                      <div className="flex items-start gap-4">

                        <div className="bg-green-100 p-3 rounded-full">

                          <Fuel
                            className="text-green-600"
                            size={25}
                          />

                        </div>

                        <div>

                          <div className="flex items-center gap-3 flex-wrap">

                            <h3 className="text-lg font-bold">
                              {fuel.fuelType}
                            </h3>

                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                              {fuel.quantity} L
                            </span>

                          </div>

                          <div className="flex flex-wrap gap-4 text-gray-500 text-sm mt-2">

                            <span className="flex items-center gap-1">

                              <Calendar size={15} />

                              {new Date(
                                fuel.fuelDate
                              ).toLocaleDateString()}

                            </span>

                            <span className="flex items-center gap-1">

                              <Gauge size={15} />

                              {fuel.odometer} km

                            </span>

                            {fuel.fuelStation && (
                              <span>
                                📍 {fuel.fuelStation}
                              </span>
                            )}

                          </div>

                          {fuel.notes && (
                            <p className="text-gray-500 text-sm mt-2">
                              {fuel.notes}
                            </p>
                          )}

                        </div>

                      </div>

                      {/* Cost + Delete */}
                      <div className="flex items-center justify-between lg:justify-end gap-6">

                        <div className="text-right">

                          <p className="text-2xl font-bold text-gray-800">
                            ₹
                            {Number(
                              fuel.totalCost || 0
                            ).toFixed(2)}
                          </p>

                          <p className="text-sm text-gray-500">
                            ₹
                            {Number(
                              fuel.pricePerUnit || 0
                            ).toFixed(2)}
                            /unit
                          </p>

                        </div>

                        <button
                          onClick={() =>
                            handleDelete(
                              fuel._id
                            )
                          }
                          className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition"
                          title="Delete Fuel Record"
                        >
                          <Trash2 size={20} />
                        </button>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>

      </div>
    </>
  );
}

export default FuelHistory;