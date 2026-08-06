import {
    Car,
    Wrench,
    IndianRupee,
} from "lucide-react";

function SummaryCards({
    totalVehicles,
    totalServices,
    totalCost,
}) {
    const cards = [
        {
            title: "Total Vehicles",
            value: totalVehicles,
            icon: <Car size={32} />,
            bg: "bg-blue-100",
            text: "text-blue-600",
        },
        {
            title: "Total Services",
            value: totalServices,
            icon: <Wrench size={32} />,
            bg: "bg-green-100",
            text: "text-green-600",
        },
        {
            title: "Maintenance Cost",
            value: `₹${totalCost}`,
            icon: <IndianRupee size={32} />,
            bg: "bg-yellow-100",
            text: "text-yellow-600",
        },
    ];

    return (
        <div className="grid md:grid-cols-3 gap-6 mb-8">
            {cards.map((card, index) => (
                <div
                key={index}
                className="bg-white shadow-lg rounded-xl p-6 flex justify-between items-center hover:shadow-xl transition"
                >
                    <div>
                        <h3 className="text-grey-500 text-sm">
                            {card.title}
                        </h3>

                        <p className="text-3xl font-bold mt-2">
                            {card.value}
                        </p>
                </div>

                <div className={`${card.bg} ${card.text} p-4 rounded-full`} >
                    {card.icon}
                </div>
                </div>
            ))}
        </div>
    );
}

export default SummaryCards;