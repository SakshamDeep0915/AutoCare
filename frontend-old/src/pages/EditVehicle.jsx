import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

import {
  getVehicleById,
  updateVehicle,
} from "../services/vehicleService";

const EditVehicle = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  useEffect(() => {
    fetchVehicle();
  }, []);

  const fetchVehicle = async () => {
    try {
      setLoading(true);

      const res = await getVehicleById(id);

      const vehicle = res.data.vehicle;

      setFormData({
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        registrationNumber: vehicle.registrationNumber,
        registrationType: vehicle.registrationType,
        fuelType: vehicle.fuelType,
        transmission: vehicle.transmission,
        odometer: vehicle.odometer,
        owners: vehicle.owners,
        insuranceExpiry: vehicle.insuranceExpiry
          ? vehicle.insuranceExpiry.substring(0, 10)
          : "",
      });
    } catch (err) {
      setError("Unable to load vehicle details.");
    } finally {
      setLoading(false);
    }
  };

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
      setSaving(true);

      await updateVehicle(id, formData);

      setSuccess("Vehicle updated successfully!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update vehicle."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-xl font-semibold text-blue-700">
          Loading Vehicle...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-10">

      <div className="max-w-5xl mx-auto px-6">

        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 mb-8 text-blue-700 font-semibold hover:text-blue-900 transition"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

          <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white px-10 py-8">

            <h1 className="text-4xl font-bold">
              ✏️ Edit Vehicle
            </h1>

            <p className="text-green-100 mt-2">
              Update your vehicle information.
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="p-10"
          >

            <div className="grid md:grid-cols-2 gap-6">

                          {/* Brand */}

              <div>
                <label className="font-semibold">Brand</label>

                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full mt-2 border rounded-xl p-3 focus:ring-2 focus:ring-green-500"
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
                <label className="font-semibold">Model</label>

                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className="w-full mt-2 border rounded-xl p-3 focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              {/* Year */}

              <div>
                <label className="font-semibold">Manufacturing Year</label>

                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  min="1990"
                  max="2035"
                  className="w-full mt-2 border rounded-xl p-3 focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              {/* Registration Number */}

              <div>
                <label className="font-semibold">Registration Number</label>

                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      registrationNumber: e.target.value.toUpperCase(),
                    })
                  }
                  className="w-full mt-2 border rounded-xl p-3 uppercase focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              {/* Registration Type */}

              <div>
                <label className="font-semibold">Registration Type</label>

                <select
                  name="registrationType"
                  value={formData.registrationType}
                  onChange={handleChange}
                  className="w-full mt-2 border rounded-xl p-3 focus:ring-2 focus:ring-green-500"
                >
                  <option>Private</option>
                  <option>Commercial</option>
                </select>
              </div>

              {/* Fuel Type */}

              <div>
                <label className="font-semibold">Fuel Type</label>

                <select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleChange}
                  className="w-full mt-2 border rounded-xl p-3 focus:ring-2 focus:ring-green-500"
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
                <label className="font-semibold">Transmission</label>

                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleChange}
                  className="w-full mt-2 border rounded-xl p-3 focus:ring-2 focus:ring-green-500"
                >
                  <option>Manual</option>
                  <option>Automatic</option>
                </select>
              </div>

              {/* Odometer */}

              <div>
                <label className="font-semibold">Odometer (KM)</label>

                <input
                  type="number"
                  name="odometer"
                  value={formData.odometer}
                  onChange={handleChange}
                  className="w-full mt-2 border rounded-xl p-3 focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              {/* Owners */}

              <div>
                <label className="font-semibold">Number of Owners</label>

                <select
                  name="owners"
                  value={formData.owners}
                  onChange={handleChange}
                  className="w-full mt-2 border rounded-xl p-3 focus:ring-2 focus:ring-green-500"
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4+</option>
                </select>
              </div>

              {/* Insurance Expiry */}

              <div className="md:col-span-2">
                <label className="font-semibold">Insurance Expiry</label>

                <input
                  type="date"
                  name="insuranceExpiry"
                  value={formData.insuranceExpiry}
                  onChange={handleChange}
                  className="w-full mt-2 border rounded-xl p-3 focus:ring-2 focus:ring-green-500"
                />
              </div>

            </div>

            {error && (
              <div className="mt-6 bg-red-100 text-red-700 p-4 rounded-xl text-center">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-6 bg-green-100 text-green-700 p-4 rounded-xl text-center">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-semibold text-lg flex justify-center items-center gap-3 transition-all duration-300 hover:scale-[1.02]"
            >
              <Save size={22} />

              {saving ? "Updating Vehicle..." : "Update Vehicle"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
};

export default EditVehicle;