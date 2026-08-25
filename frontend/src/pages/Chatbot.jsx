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
  Wrench,
  Sparkles,
  MessageSquare,
  Circle,
  CarFront,
} from "lucide-react";

function Chatbot() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi. I'm AutoCare AI. Tell me what's happening with your vehicle and I'll help you understand the possible causes, checks, and next steps.",
    },
  ]);

  const messagesEndRef = useRef(null);

  // =====================================================
  // SCROLL TO LATEST MESSAGE
  // =====================================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // =====================================================
  // SEND MESSAGE
  // =====================================================

  const sendMessage = async () => {
    const text = message.trim();

    if (!text || loading) {
      return;
    }

    const userMessage = {
      role: "user",
      content: text,
    };

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
          history: messages,
        }
      );

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
            "I couldn't connect to the diagnostic service right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // KEYBOARD HANDLER
  // =====================================================

  const handleKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();
      sendMessage();
    }
  };

  // =====================================================
  // CLEAR CHAT
  // =====================================================

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Conversation cleared. What would you like to diagnose?",
      },
    ]);
  };

  // =====================================================
  // QUICK QUESTIONS
  // =====================================================

  const quickQuestions = [
    "My engine is making a strange noise",
    "Why is my mileage decreasing?",
    "How often should I change engine oil?",
    "My brake pedal feels soft",
  ];

  const useQuickQuestion = (question) => {
    if (loading) return;

    setMessage(question);
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#0d0f10] text-white">

        {/* =================================================
            TOP BAR
        ================================================= */}

        <div className="border-b border-[#25282b] bg-[#101213]">

          <div className="max-w-7xl mx-auto px-5 lg:px-8 py-5 flex items-center justify-between">

            <button
              onClick={() =>
                navigate("/dashboard")
              }
              className="group flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition"
            >
              <ArrowLeft
                size={17}
                className="group-hover:-translate-x-1 transition"
              />

              Dashboard
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-600">

              <Circle
                size={7}
                fill="currentColor"
                className="text-orange-500"
              />

              AI ASSISTANT ONLINE

            </div>

          </div>

        </div>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-8">

          {/* =================================================
              PAGE INTRO
          ================================================= */}

          <div className="mb-7">

            <div className="flex items-center gap-3 mb-3">

              <span className="text-[11px] tracking-[0.25em] uppercase text-orange-500 font-semibold">
                Vehicle Intelligence
              </span>

              <span className="h-px w-8 bg-orange-500/50" />

              <span className="text-[11px] tracking-wider text-gray-600">
                AI ASSISTANT
              </span>

            </div>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">

              <div>

                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                  Talk to your mechanic.
                </h1>

                <p className="text-gray-500 mt-2 max-w-2xl">
                  Describe a vehicle problem in your own words. AutoCare AI
                  will help you understand what could be happening and what
                  you should check next.
                </p>

              </div>

              <button
                onClick={clearChat}
                className="self-start md:self-auto flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#303438] text-gray-500 hover:text-red-400 hover:border-red-500/30 transition text-sm"
              >
                <Trash2 size={15} />

                Clear conversation
              </button>

            </div>

          </div>

          {/* =================================================
              CHAT LAYOUT
          ================================================= */}

          <div className="grid lg:grid-cols-[240px_1fr] gap-5">

            {/* =================================================
                LEFT CONTEXT PANEL
            ================================================= */}

            <aside className="hidden lg:block">

              <div className="bg-[#151718] border border-[#292c2f] rounded-2xl overflow-hidden sticky top-24">

                {/* Assistant */}

                <div className="p-5 border-b border-[#292c2f]">

                  <div className="w-11 h-11 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">

                    <Bot
                      size={21}
                      className="text-orange-500"
                    />

                  </div>

                  <h2 className="font-semibold mt-4">
                    AutoCare AI
                  </h2>

                  <p className="text-xs text-gray-600 mt-1 leading-5">
                    Automotive troubleshooting assistant
                  </p>

                  <div className="flex items-center gap-2 mt-4">

                    <Circle
                      size={7}
                      fill="currentColor"
                      className="text-orange-500"
                    />

                    <span className="text-xs text-gray-500">
                      Ready to help
                    </span>

                  </div>

                </div>

                {/* Quick Questions */}

                <div className="p-5">

                  <div className="flex items-center gap-2 mb-4">

                    <Sparkles
                      size={15}
                      className="text-orange-500"
                    />

                    <p className="text-[11px] uppercase tracking-[0.18em] text-gray-600 font-semibold">
                      Try asking
                    </p>

                  </div>

                  <div className="space-y-2">

                    {quickQuestions.map(
                      (question, index) => (

                        <button
                          key={index}
                          onClick={() =>
                            useQuickQuestion(
                              question
                            )
                          }
                          className="w-full text-left p-3 rounded-lg bg-[#101213] border border-[#292c2f] hover:border-orange-500/30 hover:bg-orange-500/[0.03] transition"
                        >

                          <p className="text-xs leading-5 text-gray-500 hover:text-gray-300">
                            {question}
                          </p>

                        </button>

                      )
                    )}

                  </div>

                </div>

                {/* Disclaimer */}

                <div className="p-5 border-t border-[#292c2f]">

                  <p className="text-[10px] leading-4 text-gray-700">
                    AI guidance is informational and does not replace a
                    professional mechanical inspection.
                  </p>

                </div>

              </div>

            </aside>

            {/* =================================================
                CHAT PANEL
            ================================================= */}

            <section className="bg-[#151718] border border-[#292c2f] rounded-2xl overflow-hidden">

              {/* CHAT HEADER */}

              <div className="px-5 md:px-6 py-4 border-b border-[#292c2f] bg-[#111314] flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">

                    <Wrench
                      size={17}
                      className="text-orange-500"
                    />

                  </div>

                  <div>

                    <p className="text-sm font-semibold text-gray-200">
                      Diagnostic conversation
                    </p>

                    <p className="text-[11px] text-gray-600">
                      Ask about maintenance, symptoms or vehicle care
                    </p>

                  </div>

                </div>

                <MessageSquare
                  size={18}
                  className="text-gray-700"
                />

              </div>

              {/* =================================================
                  CHAT AREA
              ================================================= */}

              <div className="h-[560px] overflow-y-auto px-5 md:px-8 py-7 bg-[#101213]">

                {messages.map(
                  (msg, index) => {

                    const isUser =
                      msg.role === "user";

                    return (
                      <div
                        key={index}
                        className={`flex mb-7 ${
                          isUser
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >

                        <div
                          className={`flex gap-3 max-w-[92%] md:max-w-[78%] ${
                            isUser
                              ? "flex-row-reverse"
                              : ""
                          }`}
                        >

                          {/* AVATAR */}

                          <div
                            className={`w-8 h-8 mt-1 flex-shrink-0 rounded-lg flex items-center justify-center ${
                              isUser
                                ? "bg-orange-500 text-black"
                                : "bg-[#191b1d] border border-[#303438] text-orange-500"
                            }`}
                          >

                            {isUser ? (
                              <User size={16} />
                            ) : (
                              <Bot size={17} />
                            )}

                          </div>

                          {/* MESSAGE */}

                          <div>

                            <div
                              className={`mb-1.5 text-[10px] uppercase tracking-wider ${
                                isUser
                                  ? "text-right text-gray-700"
                                  : "text-gray-700"
                              }`}
                            >
                              {isUser
                                ? "You"
                                : "AutoCare AI"}
                            </div>

                            <div
                              className={`px-4 py-3.5 whitespace-pre-wrap leading-7 text-sm ${
                                isUser
                                  ? "bg-orange-500 text-black rounded-2xl rounded-tr-sm"
                                  : "bg-[#17191b] border border-[#292c2f] text-gray-300 rounded-2xl rounded-tl-sm"
                              }`}
                            >
                              {msg.content}
                            </div>

                          </div>

                        </div>

                      </div>
                    );
                  }
                )}

                {/* =================================================
                    LOADING
                ================================================= */}

                {loading && (

                  <div className="flex gap-3 mb-7">

                    <div className="w-8 h-8 rounded-lg bg-[#191b1d] border border-[#303438] text-orange-500 flex items-center justify-center">

                      <Bot size={17} />

                    </div>

                    <div>

                      <p className="text-[10px] uppercase tracking-wider text-gray-700 mb-1.5">
                        AutoCare AI
                      </p>

                      <div className="bg-[#17191b] border border-[#292c2f] rounded-2xl rounded-tl-sm px-5 py-4">

                        <div className="flex items-center gap-1">

                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" />

                          <span
                            className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce"
                            style={{
                              animationDelay:
                                "0.15s",
                            }}
                          />

                          <span
                            className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce"
                            style={{
                              animationDelay:
                                "0.3s",
                            }}
                          />

                        </div>

                        <p className="text-xs text-gray-600 mt-2">
                          Reviewing your question...
                        </p>

                      </div>

                    </div>

                  </div>

                )}

                <div ref={messagesEndRef} />

              </div>

              {/* =================================================
                  INPUT
              ================================================= */}

              <div className="border-t border-[#292c2f] bg-[#111314] p-4 md:p-5">

                <div className="flex gap-3 items-end">

                  <div className="relative flex-1">

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
                      placeholder="Describe a problem, symptom or maintenance question..."
                      className="w-full resize-none bg-[#0d0f10] border border-[#303438] text-gray-200 rounded-xl px-4 py-3.5 pr-4 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 placeholder-gray-700 disabled:opacity-50 transition"
                    />

                  </div>

                  <button
                    onClick={sendMessage}
                    disabled={
                      !message.trim() ||
                      loading
                    }
                    className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-orange-500 hover:bg-orange-400 disabled:bg-[#292c2f] disabled:text-gray-600 text-black rounded-xl transition"
                    title="Send Message"
                  >
                    <Send size={19} />
                  </button>

                </div>

                <div className="flex items-center justify-between mt-2 px-1">

                  <p className="text-[10px] text-gray-700">
                    Enter to send · Shift + Enter for new line
                  </p>

                  <p className="hidden sm:block text-[10px] text-gray-700">
                    AI assistance
                  </p>

                </div>

              </div>

            </section>

          </div>

          {/* =================================================
              MOBILE QUICK QUESTIONS
          ================================================= */}

          <div className="lg:hidden mt-5">

            <div className="bg-[#151718] border border-[#292c2f] rounded-2xl p-5">

              <div className="flex items-center gap-2 mb-4">

                <Sparkles
                  size={15}
                  className="text-orange-500"
                />

                <p className="text-[11px] uppercase tracking-[0.18em] text-gray-600 font-semibold">
                  Quick questions
                </p>

              </div>

              <div className="grid sm:grid-cols-2 gap-2">

                {quickQuestions.map(
                  (question, index) => (

                    <button
                      key={index}
                      onClick={() =>
                        useQuickQuestion(
                          question
                        )
                      }
                      className="text-left p-3 rounded-lg bg-[#101213] border border-[#292c2f] hover:border-orange-500/30 transition"
                    >

                      <span className="text-xs text-gray-500">
                        {question}
                      </span>

                    </button>

                  )
                )}

              </div>

            </div>

          </div>

          {/* =================================================
              DISCLAIMER
          ================================================= */}

          <p className="text-center text-[10px] text-gray-700 mt-5">
            AutoCare AI provides general automotive guidance and does not
            replace professional mechanical inspection.
          </p>

        </div>

      </main>
    </>
  );
}

export default Chatbot;