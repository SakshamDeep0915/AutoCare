import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  getServices,
  deleteService,
} from "../services/serviceService";

function ServiceHistory() {
  const { vehicleId } = useParams();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      const res = await getServices(vehicleId);
      setServices(res.data.services || []);
    } catch (error) {
      console.error(error);
      alert("Failed to load service history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this service record?"
    );

    if (!confirmDelete) return;

    try {
      await deleteService(id);

      setServices((prev) =>
        prev.filter((service) => service._id !== id)
      );

      alert("Service deleted successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to delete service");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="p-8 text-center text-lg">
          Loading...
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            Service History
          </h1>

          <Link
            to={`/vehicles/${vehicleId}/add-service`}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            + Add Service
          </Link>
        </div>

        {services.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-10 text-center">
            <h2 className="text-2xl font-semibold">
              No Service Records Found
            </h2>

            <p className="text-gray-500 mt-3">
              Add your first service record.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {services.map((service) => (
              <div
                key={service._id}
                className="bg-white shadow-lg rounded-xl p-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {service.serviceType}
                    </h2>

                    <p className="text-gray-500 mt-2">
                      📍 {service.serviceCenter}
                    </p>

                    <p>
                      📅{" "}
                      {new Date(
                        service.serviceDate
                      ).toLocaleDateString()}
                    </p>

                    <p>
                      🚗 Odometer:
                      <strong> {service.odometer} km</strong>
                    </p>

                    <p>
                      💰 Cost:
                      <strong> ₹{service.cost}</strong>
                    </p>

                    {service.description && (
                      <p className="mt-3 text-gray-700">
                        {service.description}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Link
                      to={`/services/edit/${service._id}`}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(service._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default ServiceHistory;