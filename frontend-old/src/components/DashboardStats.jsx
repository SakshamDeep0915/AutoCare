import {
  Car,
  HeartPulse,
  Wrench,
  TriangleAlert,
} from "lucide-react";

const DashboardStats = ({ totalVehicles }) => {
  const stats = [
    {
      title: "Total Vehicles",
      value: totalVehicles,
      icon: <Car size={32} />,
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      title: "Health Score",
      value: "95%",
      icon: <HeartPulse size={32} />,
      gradient: "from-green-500 to-emerald-600",
    },
    {
      title: "Service Due",
      value: "1",
      icon: <Wrench size={32} />,
      gradient: "from-amber-400 to-orange-500",
    },
    {
      title: "AI Alerts",
      value: "0",
      icon: <TriangleAlert size={32} />,
      gradient: "from-red-500 to-pink-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

      {stats.map((item, index) => (

        <div
          key={index}
          className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
        >

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-500 font-medium">
                {item.title}
              </p>

              <h2 className="text-4xl font-bold text-gray-800 mt-3">
                {item.value}
              </h2>

            </div>

            <div
              className={`bg-gradient-to-r ${item.gradient} text-white p-4 rounded-2xl shadow-lg`}
            >
              {item.icon}
            </div>

          </div>

        </div>

      ))}

    </div>
  );
};

export default DashboardStats;