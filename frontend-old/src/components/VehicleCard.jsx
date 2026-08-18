import {
  Calendar,
  Car,
  Fuel,
  Gauge,
  Trash2,
  Edit,
  User,
  Shield,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const VehicleCard = ({ vehicle, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">

      {/* Top Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">

        <div className="flex justify-between items-center">

          <div>
            <h2 className="text-2xl font-bold">
              {vehicle.brand} {vehicle.model}
            </h2>

            <p className="text-blue-100 mt-2">
              {vehicle.registrationNumber}
            </p>
          </div>

          <div className="bg-white/20 p-4 rounded-2xl">
            <Car size={34} />
          </div>

        </div>

      </div>

      {/* Vehicle Details */}
      <div className="p-6">

        <div className="grid grid-cols-2 gap-5">

          <div className="flex items-center gap-3">
            <Fuel className="text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Fuel</p>
              <p className="font-semibold">{vehicle.fuelType}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Gauge className="text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Odometer</p>
              <p className="font-semibold">{vehicle.odometer} km</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Car className="text-purple-600" />
            <div>
              <p className="text-sm text-gray-500">Transmission</p>
              <p className="font-semibold">{vehicle.transmission}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <User className="text-orange-600" />
            <div>
              <p className="text-sm text-gray-500">Owners</p>
              <p className="font-semibold">{vehicle.owners}</p>
            </div>
          </div>

        </div>

        {/* Insurance */}
        <div className="mt-6 bg-blue-50 rounded-2xl p-4 flex items-center gap-3">

          <Shield className="text-blue-600" />

          <div>

            <p className="text-sm text-gray-500">
              Insurance Expiry
            </p>

            <p className="font-semibold flex items-center gap-2">

              <Calendar size={16} />

              {vehicle.insuranceExpiry
                ? new Date(vehicle.insuranceExpiry).toLocaleDateString()
                : "Not Available"}

            </p>

          </div>

        </div>

        {/* Buttons */}
        <div className="space-y-3 mt-6">

          <button
            onClick={() => navigate(`/vehicles/${vehicle._id}`)}
            className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-300"
          >
            <Eye size={18} />
            View Details
          </button>

          <div className="flex gap-3">

            <button
              onClick={() => navigate(`/edit-vehicle/${vehicle._id}`)}
              className="flex-1 flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition-all duration-300"
            >
              <Edit size={18} />
              Edit
            </button>

            <button
              onClick={() => onDelete(vehicle._id)}
              className="flex-1 flex justify-center items-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl transition-all duration-300"
            >
              <Trash2 size={18} />
              Delete
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default VehicleCard;