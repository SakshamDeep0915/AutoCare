import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Bot,
  Send,
  User,
  Trash2,
  Car,
} from "lucide-react";
import Navbar from "../components/Navbar";

function VehicleChatbot() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [problem, setProblem] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! 👋 I'm AutoCare AI. Describe any problem you're facing with your vehicle and I'll help you understand the possible causes, severity, possible damage, and recommended action.",
    },
  ]);

  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // =========================
  // Fetch Vehicle
  // =========================
  useEffect(() => {
    fetchVehicle();
  }, [vehicleId]);

  const fetchVehicle = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/api/vehicles/${vehicleId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVehicle(res.data.vehicle);
    } catch (error) {
      console.error("Vehicle Error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to load vehicle"
      );
    }
  };

  // =========================
  // Auto Scroll
  // =========================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // =========================
  // Send Problem
  // =========================
  const sendProblem = async () => {
    const trimmedProblem = problem.trim();

    if (!trimmedProblem || loading) {
      return;
    }

    // Add user's message
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: trimmedProblem,
      },
    ]);

    setProblem("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `http://localhost:5000/api/chatbot/${vehicleId}`,
        {
          problem: trimmedProblem,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.data.analysis,
        },
      ]);
    } catch (error) {
      console.error("Chatbot Error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            error.response?.data?.message ||
            "Sorry, I couldn't analyze the problem. Please try again.",
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Enter Key
  // =========================
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendProblem();
    }
  };

  // =========================
  // Clear Chat
  // =========================
  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Chat cleared. 🚗 Tell me what problem you're experiencing with your vehicle.",
      },
    ]);
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-8 px-4">

        <div className="max-w-5xl mx-auto">

          {/* Back */}
          <button
            onClick={() =>
              navigate(`/vehicles/${vehicleId}`)
            }
            className="flex items-center gap-2 text-blue-600 hover:underline mb-6"
          >
            <ArrowLeft size={20} />
            Back to Vehicle
          </button>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

            {/* =========================
                Header
            ========================= */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-4">

                  <div className="bg-white/20 p-4 rounded-full">
                    <Bot size={32} />
                  </div>

                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">
                      AutoCare AI Assistant
                    </h1>

                    <p className="text-blue-100 mt-1">
                      Vehicle Problem Diagnosis
                    </p>
                  </div>

                </div>

                <button
                  onClick={clearChat}
                  className="bg-white/20 hover:bg-white/30 p-3 rounded-lg transition"
                  title="Clear Chat"
                >
                  <Trash2 size={20} />
                </button>

              </div>

              {/* Vehicle Information */}
              {vehicle && (
                <div className="mt-5 bg-white/10 rounded-xl p-4">

                  <div className="flex items-center gap-3">

                    <Car size={22} />

                    <div>

                      <p className="font-semibold">
                        {vehicle.brand} {vehicle.model}
                      </p>

                      <p className="text-sm text-blue-100">
                        {vehicle.registrationNumber?.toUpperCase()}
                        {" • "}
                        {vehicle.year}
                        {" • "}
                        {vehicle.fuelType}
                      </p>

                    </div>

                  </div>

                </div>
              )}

            </div>

            {/* =========================
                Chat Area
            ========================= */}
            <div className="h-[550px] overflow-y-auto p-5 md:p-6 bg-gray-50">

              {messages.map((message, index) => (

                <div
                  key={index}
                  className={`flex mb-5 ${
                    message.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  <div
                    className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${
                      message.role === "user"
                        ? "flex-row-reverse"
                        : "flex-row"
                    }`}
                  >

                    {/* Avatar */}
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        message.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-purple-100 text-purple-600"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User size={20} />
                      ) : (
                        <Bot size={20} />
                      )}
                    </div>

                    {/* Message */}
                    <div
                      className={`px-4 py-3 rounded-2xl whitespace-pre-wrap leading-7 ${
                        message.role === "user"
                          ? "bg-blue-600 text-white rounded-tr-none"
                          : message.error
                          ? "bg-red-100 text-red-700 rounded-tl-none"
                          : "bg-white text-gray-800 shadow rounded-tl-none"
                      }`}
                    >
                      {message.content}
                    </div>

                  </div>

                </div>

              ))}

              {/* Loading */}
              {loading && (
                <div className="flex items-start gap-3 mb-5">

                  <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                    <Bot size={20} />
                  </div>

                  <div className="bg-white shadow px-5 py-4 rounded-2xl rounded-tl-none">

                    <div className="flex gap-1">

                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>

                      <span
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.15s" }}
                      ></span>

                      <span
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.3s" }}
                      ></span>

                    </div>

                    <p className="text-sm text-gray-500 mt-2">
                      AutoCare AI is analyzing...
                    </p>

                  </div>

                </div>
              )}

              <div ref={messagesEndRef} />

            </div>

            {/* =========================
                Input
            ========================= */}
            <div className="border-t bg-white p-4">

              <div className="flex items-end gap-3">

                <textarea
                  value={problem}
                  onChange={(e) =>
                    setProblem(e.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  placeholder="Describe the problem you're facing with your vehicle..."
                  rows="2"
                  disabled={loading}
                  className="flex-1 resize-none border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />

                <button
                  onClick={sendProblem}
                  disabled={!problem.trim() || loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-4 rounded-xl transition"
                  title="Send"
                >
                  <Send size={22} />
                </button>

              </div>

              <p className="text-xs text-gray-400 mt-2">
                Press Enter to send • Shift + Enter for a new line
              </p>

            </div>

          </div>

          {/* Disclaimer */}
          <p className="text-center text-xs text-gray-400 mt-4">
            ⚠️ AutoCare AI provides a preliminary assessment
            and does not replace professional mechanical
            inspection.
          </p>

        </div>

      </div>
    </>
  );
}

export default VehicleChatbot;