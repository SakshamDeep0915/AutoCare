import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addVehicle } from "../services/vehicleService";

function AddVehicle() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    registrationNumber: "",
    fuelType: "",
    odometer: "",
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

      await addVehicle(formData);

      alert("Vehicle Added Successfully!");

      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add vehicle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-xl p-8 w-full max-w-lg"
      >
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Add Vehicle
        </h2>

        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={formData.brand}
          onChange={handleChange}
          className="w-full border rounded-lg p-3 mb-4"
          required
        />

        <input
          type="text"
          name="model"
          placeholder="Model"
          value={formData.model}
          onChange={handleChange}
          className="w-full border rounded-lg p-3 mb-4"
          required
        />

        <input
          type="text"
          name="registrationNumber"
          placeholder="Registration Number"
          value={formData.registrationNumber}
          onChange={handleChange}
          className="w-full border rounded-lg p-3 mb-4"
          required
        />

        <select
          name="fuelType"
          value={formData.fuelType}
          onChange={handleChange}
          className="w-full border rounded-lg p-3 mb-4"
          required
        >
          <option value="">Select Fuel Type</option>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="Electric">Electric</option>
          <option value="Hybrid">Hybrid</option>
          <option value="CNG">CNG</option>
        </select>

        <input
          type="number"
          name="odometer"
          placeholder="Odometer (km)"
          value={formData.odometer}
          onChange={handleChange}
          className="w-full border rounded-lg p-3 mb-6"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
        >
          {loading ? "Adding..." : "Add Vehicle"}
        </button>
      </form>
    </div>
  );
}

export default AddVehicle;