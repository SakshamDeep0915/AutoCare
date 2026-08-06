import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { addService } from "../services/serviceService";

function AddService() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    serviceType: "",
    serviceCenter: "",
    serviceDate: "",
    odometer: "",
    cost: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await addService(vehicleId, formData);

      alert("Service added successfully!");

      navigate(`/vehicles/${vehicleId}/services`);
    } catch (error) {
      console.error(error);
      alert("Failed to add service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white shadow-lg rounded-xl p-8">
          <h1 className="text-3xl font-bold mb-6">
            Add Service Record
          </h1>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Service Type */}
            <div>
              <label className="block mb-2 font-medium">
                Service Type
              </label>

              <input
                type="text"
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-3"
                placeholder="Engine Oil Change"
              />
            </div>

            {/* Service Center */}
            <div>
              <label className="block mb-2 font-medium">
                Service Center
              </label>

              <input
                type="text"
                name="serviceCenter"
                value={formData.serviceCenter}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-3"
                placeholder="Mahindra Service Center"
              />
            </div>

            {/* Date & Odometer */}
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block mb-2 font-medium">
                  Service Date
                </label>

                <input
                  type="date"
                  name="serviceDate"
                  value={formData.serviceDate}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg p-3"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Odometer (km)
                </label>

                <input
                  type="number"
                  name="odometer"
                  value={formData.odometer}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg p-3"
                />
              </div>
            </div>

            {/* Cost */}
            <div>
              <label className="block mb-2 font-medium">
                Cost (₹)
              </label>

              <input
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-3"
                placeholder="1500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block mb-2 font-medium">
                Description
              </label>

              <textarea
                rows="4"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                placeholder="Additional notes..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
            >
              {loading ? "Saving..." : "Add Service"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddService;