import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { ArrowLeft, Fuel, Calculator } from "lucide-react";

function AddFuel() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [vehicleLoading, setVehicleLoading] = useState(true);

  const [formData, setFormData] = useState({
    fuelDate: new Date().toISOString().split("T")[0],
    fuelType: "Petrol",
    quantity: "",
    pricePerUnit: "",
    odometer: "",
    fuelStation: "",
    notes: "",
  });

  // =========================
  // Get Vehicle Details
  // =========================
  useEffect(() => {
    fetchVehicle();
  }, [vehicleId]);

  const fetchVehicle = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/api/vehicles/${vehicleId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVehicle(res.data.vehicle);
    } catch (error) {
      console.error("Vehicle Error:", error);
      alert("Failed to load vehicle");
    } finally {
      setVehicleLoading(false);
    }
  };

  // =========================
  // Handle Input
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // Calculate Total
  // =========================
  const totalCost =
    Number(formData.quantity || 0) *
    Number(formData.pricePerUnit || 0);

  // =========================
  // Submit Fuel Expense
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.fuelDate ||
      !formData.fuelType ||
      !formData.quantity ||
      !formData.pricePerUnit ||
      !formData.odometer
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/fuel",
        {
          vehicle: vehicleId,
          fuelDate: formData.fuelDate,
          fuelType: formData.fuelType,
          quantity: Number(formData.quantity),
          pricePerUnit: Number(formData.pricePerUnit),
          odometer: Number(formData.odometer),
          fuelStation: formData.fuelStation,
          notes: formData.notes,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Fuel expense added successfully!");

      navigate(`/vehicles/${vehicleId}`);
    } catch (error) {
      console.error("Fuel Error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to add fuel expense"
      );
    } finally {
      setLoading(false);
    }
  };

  if (vehicleLoading) {
    return (
      <>
        <Navbar />

        <div className="text-center mt-20 text-xl">
          Loading vehicle...
        </div>
      </>
    );
  }

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

        <div className="max-w-3xl mx-auto">

          {/* Back Button */}
          <button
            onClick={() =>
              navigate(`/vehicles/${vehicleId}`)
            }
            className="flex items-center gap-2 text-blue-600 hover:underline mb-6"
          >
            <ArrowLeft size={20} />
            Back to Vehicle
          </button>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">

              <div className="bg-green-100 p-4 rounded-full">
                <Fuel
                  className="text-green-600"
                  size={32}
                />
              </div>

              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Add Fuel Expense
                </h1>

                <p className="text-gray-500 mt-1">
                  {vehicle.brand} {vehicle.model}
                </p>

                <p className="font-bold tracking-wide text-gray-700">
                  {vehicle.registrationNumber?.toUpperCase()}
                </p>
              </div>

            </div>

            <form onSubmit={handleSubmit}>

              {/* Date + Fuel Type */}
              <div className="grid md:grid-cols-2 gap-5">

                <div>
                  <label className="block font-semibold mb-2">
                    Fuel Date *
                  </label>

                  <input
                    type="date"
                    name="fuelDate"
                    value={formData.fuelDate}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">
                    Fuel Type *
                  </label>

                  <select
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="CNG">CNG</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>

              </div>

              {/* Quantity + Price */}
              <div className="grid md:grid-cols-2 gap-5 mt-5">

                <div>
                  <label className="block font-semibold mb-2">
                    Quantity (Litres) *
                  </label>

                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="e.g. 25"
                    min="0"
                    step="0.01"
                    className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">
                    Price per Litre (₹) *
                  </label>

                  <input
                    type="number"
                    name="pricePerUnit"
                    value={formData.pricePerUnit}
                    onChange={handleChange}
                    placeholder="e.g. 94"
                    min="0"
                    step="0.01"
                    className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

              </div>

              {/* Total Cost */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mt-6">

                <div className="flex items-center gap-3">

                  <Calculator
                    className="text-blue-600"
                    size={25}
                  />

                  <div>
                    <p className="text-gray-500 text-sm">
                      Total Fuel Cost
                    </p>

                    <p className="text-3xl font-bold text-blue-600">
                      ₹{totalCost.toFixed(2)}
                    </p>
                  </div>

                </div>

              </div>

              {/* Odometer */}
              <div className="mt-5">

                <label className="block font-semibold mb-2">
                  Odometer Reading (km) *
                </label>

                <input
                  type="number"
                  name="odometer"
                  value={formData.odometer}
                  onChange={handleChange}
                  placeholder="e.g. 21500"
                  min="0"
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

              </div>

              {/* Fuel Station */}
              <div className="mt-5">

                <label className="block font-semibold mb-2">
                  Fuel Station
                </label>

                <input
                  type="text"
                  name="fuelStation"
                  value={formData.fuelStation}
                  onChange={handleChange}
                  placeholder="e.g. Indian Oil"
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              {/* Notes */}
              <div className="mt-5">

                <label className="block font-semibold mb-2">
                  Notes
                </label>

                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="e.g. Full tank"
                  rows="4"
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />

              </div>

              {/* Buttons */}
              <div className="flex gap-4 mt-8">

                <button
                  type="button"
                  onClick={() =>
                    navigate(`/vehicles/${vehicleId}`)
                  }
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-3 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-5 py-3 rounded-lg font-semibold transition"
                >
                  {loading
                    ? "Adding..."
                    : "⛽ Add Fuel Expense"}
                </button>

              </div>

            </form>

          </div>

        </div>

      </div>
    </>
  );
}

export default AddFuel;