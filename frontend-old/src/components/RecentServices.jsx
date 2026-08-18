function RecentServices({ services }) {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 mt-8">
      <h2 className="text-2xl font-bold mb-5">
        Recent Services
      </h2>

      {services.length === 0 ? (
        <p className="text-gray-500">
          No recent services found.
        </p>
      ) : (
        <div className="space-y-4">
          {services.map((service) => (
            <div
              key={service._id}
              className="border rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold text-lg">
                  {service.serviceType}
                </h3>

                <p className="text-gray-500">
                  {service.vehicle?.brand}{" "}
                  {service.vehicle?.model}
                </p>

                <p className="text-sm text-gray-400">
                  {new Date(
                    service.serviceDate
                  ).toLocaleDateString()}
                </p>
              </div>

              <div className="text-green-600 font-bold text-lg">
                ₹{service.cost}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecentServices;