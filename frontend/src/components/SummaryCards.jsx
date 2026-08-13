import {
  Car,
  Wrench,
  IndianRupee,
  Fuel,
} from "lucide-react";

function SummaryCards({
  totalVehicles,
  totalServices,
  maintenanceCost,
  fuelExpense,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

      {/* Total Vehicles */}
      <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between">

        <div>
          <p className="text-gray-500 text-sm">
            Total Vehicles
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {totalVehicles}
          </h2>
        </div>

        <div className="bg-blue-100 p-4 rounded-full">
          <Car
            className="text-blue-600"
            size={28}
          />
        </div>

      </div>


      {/* Total Services */}
      <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between">

        <div>
          <p className="text-gray-500 text-sm">
            Total Services
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {totalServices}
          </h2>
        </div>

        <div className="bg-green-100 p-4 rounded-full">
          <Wrench
            className="text-green-600"
            size={28}
          />
        </div>

      </div>


      {/* Maintenance Cost */}
      <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between">

        <div>
          <p className="text-gray-500 text-sm">
            Maintenance Cost
          </p>

          <h2 className="text-3xl font-bold mt-2">
            ₹
            {Number(
              maintenanceCost || 0
            ).toLocaleString("en-IN")}
          </h2>
        </div>

        <div className="bg-orange-100 p-4 rounded-full">
          <IndianRupee
            className="text-orange-600"
            size={28}
          />
        </div>

      </div>


      {/* Fuel Cost */}
      <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between">

        <div>
          <p className="text-gray-500 text-sm">
            Fuel Cost
          </p>

          <h2 className="text-3xl font-bold mt-2">
            ₹
            {Number(
              fuelExpense || 0
            ).toLocaleString("en-IN")}
          </h2>
        </div>

        <div className="bg-purple-100 p-4 rounded-full">
          <Fuel
            className="text-purple-600"
            size={28}
          />
        </div>

      </div>

    </div>
  );
}

export default SummaryCards;