import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import {
  Bot,
  Send,
  User,
  Trash2,
  ArrowLeft,
} from "lucide-react";

function Chatbot() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hey! 👋 I'm AutoCare AI. Ask me anything about your vehicle, maintenance, servicing, fuel economy, warning lights, noises, brakes, engine, battery, tyres, AC, or any other car problem.",
    },
  ]);

  const messagesEndRef = useRef(null);

  // =========================
  // Scroll to Latest Message
  // =========================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // =========================
  // Send Message
  // =========================
  const sendMessage = async () => {
    const text = message.trim();

    if (!text || loading) {
      return;
    }

    const userMessage = {
      role: "user",
      content: text,
    };

    // Add user message to chat
    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setMessage("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/chatbot",
        {
          message: text,

          // Send previous conversation
          history: messages,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Add AI response
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.data.reply,
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
            "Sorry, I'm having trouble connecting right now. Please try again.",
        },
      ]);

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Keyboard Handler
  // =========================
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
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
          "Chat cleared. 👋 What would you like to know about your vehicle?",
      },
    ]);
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-8 px-4">

        <div className="max-w-5xl mx-auto">

          {/* =========================
              Back to Home
          ========================= */}
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline mb-6 font-medium"
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>

          {/* =========================
              Chatbot Card
          ========================= */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

            {/* =========================
                Header
            ========================= */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">

              <div className="flex items-center justify-between">

                {/* AI Info */}
                <div className="flex items-center gap-4">

                  <div className="bg-white/20 p-4 rounded-full">
                    <Bot size={32} />
                  </div>

                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">
                      AutoCare AI
                    </h1>

                    <p className="text-blue-100 mt-1">
                      Your Vehicle Assistant
                    </p>
                  </div>

                </div>

                {/* Clear Chat */}
                <button
                  onClick={clearChat}
                  className="bg-white/20 hover:bg-white/30 p-3 rounded-lg transition"
                  title="Clear Chat"
                >
                  <Trash2 size={20} />
                </button>

              </div>

            </div>

            {/* =========================
                Chat Area
            ========================= */}
            <div className="h-[600px] overflow-y-auto p-5 md:p-6 bg-gray-50">

              {messages.map((msg, index) => (

                <div
                  key={index}
                  className={`flex mb-6 ${
                    msg.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  <div
                    className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${
                      msg.role === "user"
                        ? "flex-row-reverse"
                        : ""
                    }`}
                  >

                    {/* Avatar */}
                    <div
                      className={`w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-purple-100 text-purple-600"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <User size={19} />
                      ) : (
                        <Bot size={20} />
                      )}
                    </div>

                    {/* Message */}
                    <div
                      className={`px-4 py-3 rounded-2xl whitespace-pre-wrap leading-7 ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white rounded-tr-none"
                          : "bg-white text-gray-800 shadow rounded-tl-none"
                      }`}
                    >
                      {msg.content}
                    </div>

                  </div>

                </div>

              ))}

              {/* =========================
                  AI Loading
              ========================= */}
              {loading && (
                <div className="flex gap-3 mb-6">

                  <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                    <Bot size={20} />
                  </div>

                  <div className="bg-white shadow px-5 py-4 rounded-2xl rounded-tl-none">

                    <div className="flex gap-1">

                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>

                      <span
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{
                          animationDelay: "0.15s",
                        }}
                      ></span>

                      <span
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{
                          animationDelay: "0.3s",
                        }}
                      ></span>

                    </div>

                    <p className="text-sm text-gray-500 mt-2">
                      AutoCare AI is thinking...
                    </p>

                  </div>

                </div>
              )}

              <div ref={messagesEndRef}></div>

            </div>

            {/* =========================
                Input Area
            ========================= */}
            <div className="border-t bg-white p-4">

              <div className="flex gap-3 items-end">

                <textarea
                  value={message}
                  onChange={(e) =>
                    setMessage(e.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                  rows="2"
                  placeholder="Ask anything about your vehicle..."
                  className="flex-1 resize-none border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />

                <button
                  onClick={sendMessage}
                  disabled={
                    !message.trim() || loading
                  }
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-4 rounded-xl transition"
                  title="Send Message"
                >
                  <Send size={22} />
                </button>

              </div>

              <p className="text-xs text-gray-400 mt-2">
                Press Enter to send • Shift + Enter for a new line
              </p>

            </div>

          </div>

          {/* =========================
              Disclaimer
          ========================= */}
          <p className="text-center text-xs text-gray-400 mt-4">
            ⚠️ AutoCare AI provides general automotive guidance
            and does not replace professional mechanical inspection.
          </p>

        </div>

      </div>
    </>
  );
}

export default Chatbot;