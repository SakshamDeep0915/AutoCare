import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
    getServiceById,
    updateService,
} from "../services/serviceService";

function EditService() {
    const { id } = useParams();
    const navigate = useNavigate();

    const[formData, setFormData] = useState({
        serviceType: "",
        serviceCenter: "",
        serviceDate: "",
        odometer: "",
        cost: "",
        description: "",
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchService();
    }, []);

    const fetchService = async () => {
        try {
            const res = await getServiceById(id);
            const service = res.data.service;

            setFormData({
                serviceType: service.serviceType,
                serviceCenter: serviceCenter,
                serviceDate: service.serviceDate.split("T")[0],
                odometer: service.odometer,
                cost: service.cost,
                description: service.description || "",
            });
        } catch (err) {
            console.error(err);
            alert("Failed to load service");
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

        try {
            await updateService(id, formData);

            alert("Service updated successfully");
            navigate(-1);
        } catch (err) {
            console.error(err);
            alert("Failed to update service");
        }
    };

    if(loading) {
        return (
            <>
            <Navbar />
            <div className="p-10 text-center text-xl">
                Loading...
            </div>
            </>
        );
    }

    return (
        <>
        <Navbar />
        <div className="max-w-3xlmx-auto p-6">
            <div className="bg-white shadow-lg rounded-xl p-8">
                <h1 className="text-3xl font-bold mb-6">
                    Edit Service
                </h1>

                <form
                onSubmit={handleSubmit}
                className="space-y-5"
                >
                    <input
                    type="text"
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                    placeholder="Service Type"
                    required
                    />

                    <input
                    type="text"
                    name="serviceCenter"
                    value={formData.serviceCenter}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                    placeholder="Service Center"
                    required
                    />

                    <input
              type="date"
              name="serviceDate"
              value={formData.serviceDate}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              required
            />

            <input
            type="number"
            name="odometer"
            value={formData.odometer}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            placeholder="Odometer"
            required
            />

            <input
            type="number"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            placeholder="Cost"
            required
            />

            <textarea
            rows="4"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            placeholder="Description"
            />

            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold">
                Update Service
            </button>
                </form>
            </div>
        </div>
        </>
    );
}

export default EditService;