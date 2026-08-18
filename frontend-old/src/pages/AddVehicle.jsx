import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Car,
  Calendar,
  Fuel,
  Gauge,
  User,
  ArrowLeft,
  Save,
} from "lucide-react";
import { addVehicle } from "../services/vehicleService";

const AddVehicle = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    registrationNumber: "",
    registrationType: "Private",
    fuelType: "Petrol",
    transmission: "Manual",
    odometer: "",
    owners: 1,
    insuranceExpiry: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");
  setSuccess("");

  try {
    setLoading(true);

    await addVehicle(formData);

    setSuccess("Vehicle added successfully!");

    setTimeout(() => {
      navigate("/dashboard");
    }, 1200);

  } catch (err) {
    setError(
      err.response?.data?.message ||
      "Failed to add vehicle."
    );
  } finally {
    setLoading(false);
  }
};
    return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-10">

      <div className="max-w-5xl mx-auto px-6">

        {/* Back Button */}

        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 mb-8 text-blue-700 font-semibold hover:text-blue-900 transition"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        {/* Card */}

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* Header */}

          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-10 py-8">

            <h1 className="text-4xl font-bold">
              🚗 Register New Vehicle
            </h1>

            <p className="text-blue-100 mt-2">
              Add your vehicle to unlock AI-powered maintenance insights.
            </p>

          </div>

          <form onSubmit={handleSubmit} className="p-10">

            <div className="grid md:grid-cols-2 gap-6">

                          {/* Brand */}

              <div>

                <label className="font-semibold">
                  Brand
                </label>

                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full mt-2 border rounded-xl p-3 focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Brand</option>

                  <option>Maruti Suzuki</option>
                  <option>Hyundai</option>
                  <option>Tata</option>
                  <option>Mahindra</option>
                  <option>Toyota</option>
                  <option>Honda</option>
                  <option>Kia</option>
                  <option>MG</option>
                  <option>Renault</option>
                  <option>Nissan</option>
                  <option>Volkswagen</option>
                  <option>Skoda</option>
                  <option>BMW</option>
                  <option>Mercedes-Benz</option>
                  <option>Audi</option>
                  <option>Jeep</option>
                  <option>Volvo</option>
                  <option>BYD</option>
                  <option>Other</option>

                </select>

              </div>

              {/* Model */}

              <div>

                <label className="font-semibold">
                  Model
                </label>

                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="e.g. Creta"
                  className="w-full mt-2 border rounded-xl p-3 focus:ring-2 focus:ring-blue-500"
                  required
                />

              </div>

              {/* Year */}

              <div>

                <label className="font-semibold">
                  Manufacturing Year
                </label>

                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  min="1990"
                  max="2035"
                  className="w-full mt-2 border rounded-xl p-3 focus:ring-2 focus:ring-blue-500"
                  required
                />

              </div>

              {/* Registration */}

              <div>

                <label className="font-semibold">
                  Registration Number
                </label>

                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  placeholder="PB10AB1234"
                  className="w-full mt-2 border rounded-xl p-3 uppercase focus:ring-2 focus:ring-blue-500"
                  required
                />

              </div>

              {/* Registration Type */}

              <div>

                <label className="font-semibold">
                  Registration Type
                </label>

                <select
                  name="registrationType"
                  value={formData.registrationType}
                  onChange={handleChange}
                  className="w-full mt-2 border rounded-xl p-3 focus:ring-2 focus:ring-blue-500"
                >
                  <option>Private</option>
                  <option>Commercial</option>
                </select>
                </div>

                            {/* Fuel Type */}

              <div>

                <label className="font-semibold">
                  Fuel Type
                </label>

                <select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleChange}
                  className="w-full mt-2 border rounded-xl p-3 focus:ring-2 focus:ring-blue-500"
                >
                  <option>Petrol</option>
                  <option>Diesel</option>
                  <option>CNG</option>
                  <option>Electric</option>
                  <option>Hybrid</option>
                </select>

              </div>

              {/* Transmission */}

              <div>

                <label className="font-semibold">
                  Transmission
                </label>

                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleChange}
                  className="w-full mt-2 border rounded-xl p-3 focus:ring-2 focus:ring-blue-500"
                >
                  <option>Manual</option>
                  <option>Automatic</option>
                </select>

              </div>

              {/* Odometer */}

              <div>

                <label className="font-semibold">
                  Odometer (KM)
                </label>

                <input
                  type="number"
                  name="odometer"
                  value={formData.odometer}
                  onChange={handleChange}
                  placeholder="42000"
                  className="w-full mt-2 border rounded-xl p-3 focus:ring-2 focus:ring-blue-500"
                  required
                />

              </div>

              {/* Owners */}

              <div>

                <label className="font-semibold">
                  Number of Owners
                </label>

                <select
                  name="owners"
                  value={formData.owners}
                  onChange={handleChange}
                  className="w-full mt-2 border rounded-xl p-3 focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4+</option>
                </select>

              </div>

              {/* Insurance Expiry */}

              <div className="md:col-span-2">

                <label className="font-semibold">
                  Insurance Expiry
                </label>

                <input
                  type="date"
                  name="insuranceExpiry"
                  value={formData.insuranceExpiry}
                  onChange={handleChange}
                  className="w-full mt-2 border rounded-xl p-3 focus:ring-2 focus:ring-blue-500"
                />

              </div>

            </div>

            {/* Error */}

            {error && (
              <div className="bg-red-100 text-red-700 p-4 rounded-xl mt-6 text-center">
                {error}
              </div>
            )}

            {/* Success */}

            {success && (
              <div className="bg-green-100 text-green-700 p-4 rounded-xl mt-6 text-center">
                {success}
              </div>
            )}

            {/* Save Button */}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold text-lg flex justify-center items-center gap-3 transition-all duration-300 hover:scale-[1.02]"
            >
              <Save size={22} />

              {loading ? "Saving Vehicle..." : "Save Vehicle"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
};

export default AddVehicle;


