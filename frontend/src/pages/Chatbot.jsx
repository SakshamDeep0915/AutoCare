import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import API from "../services/api";

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
      const response = await API.post(
        "/chatbot",
        {
          message: text,

          // Send previous conversation
          history: messages,
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
      console.error(
        "Chatbot Error:",
        error
      );

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
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
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

      <div className="min-h-screen bg-[#0a0a0a] py-8 px-4">

        <div className="max-w-5xl mx-auto">

          {/* =========================
              Back to Dashboard
          ========================= */}

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="flex items-center gap-2 text-zinc-400 hover:text-orange-500 hover:underline mb-6 font-medium transition"
          >
            <ArrowLeft size={20} />

            Back to Dashboard
          </button>

          {/* =========================
              Chatbot Card
          ========================= */}

          <div className="bg-[#111111] border border-zinc-800 rounded-2xl shadow-2xl shadow-black/30 overflow-hidden">

            {/* =========================
                Header
            ========================= */}

            <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white p-6">

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

                    <p className="text-orange-100 mt-1">
                      Your Intelligent Vehicle Assistant
                    </p>

                  </div>

                </div>

                {/* Clear Chat */}

                <button
                  onClick={clearChat}
                  className="bg-black/20 hover:bg-black/30 p-3 rounded-lg transition"
                  title="Clear Chat"
                >
                  <Trash2 size={20} />
                </button>

              </div>

            </div>

            {/* =========================
                Chat Area
            ========================= */}

            <div className="h-[600px] overflow-y-auto p-5 md:p-6 bg-[#0f0f0f]">

              {messages.map(
                (msg, index) => (

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
                            ? "bg-orange-500 text-white"
                            : "bg-orange-500/10 border border-orange-500/20 text-orange-500"
                        }`}
                      >

                        {msg.role ===
                        "user" ? (
                          <User size={19} />
                        ) : (
                          <Bot size={20} />
                        )}

                      </div>

                      {/* Message */}

                      <div
                        className={`px-4 py-3 rounded-2xl whitespace-pre-wrap leading-7 ${
                          msg.role === "user"
                            ? "bg-orange-500 text-white rounded-tr-none"
                            : "bg-[#151515] border border-zinc-800 text-zinc-300 shadow-lg rounded-tl-none"
                        }`}
                      >
                        {msg.content}
                      </div>

                    </div>

                  </div>

                )
              )}

              {/* =========================
                  AI Loading
              ========================= */}

              {loading && (

                <div className="flex gap-3 mb-6">

                  <div className="w-10 h-10 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center">

                    <Bot size={20} />

                  </div>

                  <div className="bg-[#151515] border border-zinc-800 shadow-lg px-5 py-4 rounded-2xl rounded-tl-none">

                    <div className="flex gap-1">

                      <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></span>

                      <span
                        className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                        style={{
                          animationDelay:
                            "0.15s",
                        }}
                      ></span>

                      <span
                        className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                        style={{
                          animationDelay:
                            "0.3s",
                        }}
                      ></span>

                    </div>

                    <p className="text-sm text-zinc-500 mt-2">
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

            <div className="border-t border-zinc-800 bg-[#111111] p-4">

              <div className="flex gap-3 items-end">

                <textarea
                  value={message}
                  onChange={(e) =>
                    setMessage(
                      e.target.value
                    )
                  }
                  onKeyDown={
                    handleKeyDown
                  }
                  disabled={loading}
                  rows="2"
                  placeholder="Ask anything about your vehicle..."
                  className="flex-1 resize-none bg-[#151515] border border-zinc-700 text-zinc-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 placeholder-zinc-600 disabled:bg-zinc-900"
                />

                <button
                  onClick={sendMessage}
                  disabled={
                    !message.trim() ||
                    loading
                  }
                  className="bg-orange-500 hover:bg-orange-400 disabled:bg-zinc-700 disabled:text-zinc-500 text-white p-4 rounded-xl transition shadow-lg shadow-orange-950/30"
                  title="Send Message"
                >
                  <Send size={22} />
                </button>

              </div>

              <p className="text-xs text-zinc-600 mt-2">
                Press Enter to send • Shift + Enter for a new line
              </p>

            </div>

          </div>

          {/* =========================
              Disclaimer
          ========================= */}

          <p className="text-center text-xs text-zinc-600 mt-4">
            ⚠️ AutoCare AI provides general automotive
            guidance and does not replace professional
            mechanical inspection.
          </p>

        </div>

      </div>
    </>
  );
}

export default Chatbot;