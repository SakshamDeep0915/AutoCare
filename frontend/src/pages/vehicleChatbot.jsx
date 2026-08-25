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
  Activity,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  MessageSquare,
} from "lucide-react";

import Navbar from "../components/Navbar";


// ======================================================
// API BASE URL
// ======================================================

const API_URL = import.meta.env.VITE_API_URL;


function VehicleChatbot() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] =
    useState(null);

  const [problem, setProblem] =
    useState("");

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Describe the issue you're experiencing with your vehicle. I'll help you understand the possible causes, severity, potential damage, and recommended next steps.",
    },
  ]);

  const [loading, setLoading] =
    useState(false);

  const messagesEndRef =
    useRef(null);

  const textareaRef =
    useRef(null);


  // ======================================================
  // FETCH VEHICLE
  // ======================================================

  useEffect(() => {
    fetchVehicle();
  }, [vehicleId]);


  const fetchVehicle = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const res = await axios.get(
        `${API_URL}/api/vehicles/${vehicleId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVehicle(
        res.data.vehicle
      );

    } catch (error) {

      console.error(
        "Vehicle Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to load vehicle"
      );
    }
  };


  // ======================================================
  // AUTO SCROLL
  // ======================================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);


  // ======================================================
  // SEND PROBLEM
  // ======================================================

  const sendProblem = async () => {
    const trimmedProblem =
      problem.trim();

    if (
      !trimmedProblem ||
      loading
    ) {
      return;
    }


    // Add user message

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

      const token =
        localStorage.getItem("token");


      const res = await axios.post(
        `${API_URL}/api/chatbot/${vehicleId}`,

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
          content:
            res.data.analysis,
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
            error.response?.data
              ?.message ||
            "I couldn't analyze the issue right now. Please try again.",

          error: true,
        },
      ]);

    } finally {

      setLoading(false);

      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  };


  // ======================================================
  // ENTER KEY
  // ======================================================

  const handleKeyDown = (e) => {

    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {

      e.preventDefault();

      sendProblem();
    }
  };


  // ======================================================
  // CLEAR CHAT
  // ======================================================

  const clearChat = () => {

    setMessages([
      {
        role: "assistant",

        content:
          "Chat cleared. Describe a vehicle issue whenever you're ready and I'll help you assess it.",
      },
    ]);

    setProblem("");
  };


  // ======================================================
  // MAIN
  // ======================================================

  return (
    <>
      <Navbar />

      <main className="diagnostic-page">


        {/* ==================================================
            BACKGROUND
        ================================================== */}

        <div className="diagnostic-background">

          <div className="diagnostic-grid"></div>

          <div className="diagnostic-glow"></div>

        </div>


        {/* ==================================================
            PAGE CONTAINER
        ================================================== */}

        <div className="diagnostic-container">


          {/* ==================================================
              TOP NAV
          ================================================== */}

          <div className="diagnostic-topbar">

            <button
              onClick={() =>
                navigate(
                  `/vehicles/${vehicleId}`
                )
              }
              className="diagnostic-back"
            >

              <ArrowLeft size={16} />

              Back to vehicle

            </button>


            <div className="diagnostic-system">

              <span className="system-dot"></span>

              AI DIAGNOSTIC SYSTEM

            </div>

          </div>


          {/* ==================================================
              HEADER
          ================================================== */}

          <section className="diagnostic-header">

            <div className="diagnostic-title-area">


              <div className="diagnostic-kicker">

                <span></span>

                VEHICLE INTELLIGENCE

              </div>


              <h1>
                Diagnostic
                <em>
                  Assistant
                </em>
              </h1>


              <p>
                Describe a problem with your vehicle
                and get an AI-powered preliminary
                assessment of what may be happening.
              </p>

            </div>


            {/* VEHICLE STATUS */}

            {vehicle && (

              <div className="vehicle-status-card">

                <div className="vehicle-status-icon">

                  <Car size={19} />

                </div>


                <div className="vehicle-status-info">

                  <span>
                    ACTIVE VEHICLE
                  </span>

                  <strong>
                    {vehicle.brand}{" "}
                    {vehicle.model}
                  </strong>

                  <small>

                    {vehicle.registrationNumber
                      ?.toUpperCase()}

                    {"  •  "}

                    {vehicle.year}

                    {"  •  "}

                    {vehicle.fuelType}

                  </small>

                </div>


                <div className="vehicle-online">

                  <span></span>

                  READY

                </div>

              </div>

            )}

          </section>


          {/* ==================================================
              MAIN DIAGNOSTIC PANEL
          ================================================== */}

          <section className="diagnostic-panel">


            {/* ==================================================
                PANEL HEADER
            ================================================== */}

            <div className="diagnostic-panel-header">

              <div className="assistant-identity">

                <div className="assistant-avatar">

                  <Bot size={21} />

                </div>


                <div>

                  <div className="assistant-name">

                    AutoCare AI

                    <span className="verified-badge">

                      <ShieldCheck size={10} />

                    </span>

                  </div>

                  <div className="assistant-status">

                    <span></span>

                    Diagnostic engine online

                  </div>

                </div>

              </div>


              <button
                onClick={clearChat}
                className="clear-chat-button"
                title="Clear conversation"
              >

                <Trash2 size={14} />

                <span>
                  Clear
                </span>

              </button>

            </div>


            {/* ==================================================
                CHAT AREA
            ================================================== */}

            <div className="diagnostic-chat">


              {/* WELCOME INFORMATION */}

              {messages.length === 1 && (

                <div className="diagnostic-intro">

                  <div className="intro-icon">

                    <Sparkles size={18} />

                  </div>


                  <div>

                    <strong>
                      What can I help diagnose?
                    </strong>

                    <p>
                      Describe symptoms such as unusual
                      sounds, warning lights, starting issues,
                      vibrations, overheating or unusual
                      performance.
                    </p>

                  </div>

                </div>

              )}


              {/* ==================================================
                  MESSAGES
              ================================================== */}

              {messages.map(
                (
                  message,
                  index
                ) => (

                  <div
                    key={index}
                    className={`chat-message-row ${
                      message.role ===
                      "user"
                        ? "user-row"
                        : "assistant-row"
                    }`}
                  >


                    {/* AVATAR */}

                    <div
                      className={`chat-avatar ${
                        message.role ===
                        "user"
                          ? "user-avatar"
                          : message.error
                          ? "error-avatar"
                          : "ai-avatar"
                      }`}
                    >

                      {message.role ===
                      "user" ? (
                        <User size={16} />
                      ) : message.error ? (
                        <AlertTriangle
                          size={16}
                        />
                      ) : (
                        <Bot size={16} />
                      )}

                    </div>


                    {/* MESSAGE */}

                    <div
                      className={`chat-message-wrapper ${
                        message.role ===
                        "user"
                          ? "user-message-wrapper"
                          : ""
                      }`}
                    >

                      <div className="message-meta">

                        <span>

                          {message.role ===
                          "user"
                            ? "YOU"
                            : "AUTOCARE AI"}

                        </span>

                        <span className="message-time">
                          {index === 0
                            ? "INITIAL"
                            : "LIVE"}
                        </span>

                      </div>


                      <div
                        className={`chat-bubble ${
                          message.role ===
                          "user"
                            ? "user-bubble"
                            : message.error
                            ? "error-bubble"
                            : "assistant-bubble"
                        }`}
                      >

                        {message.content}

                      </div>

                    </div>

                  </div>

                )
              )}


              {/* ==================================================
                  LOADING
              ================================================== */}

              {loading && (

                <div className="chat-message-row assistant-row">

                  <div className="chat-avatar ai-avatar">

                    <Bot size={16} />

                  </div>


                  <div className="chat-message-wrapper">

                    <div className="message-meta">

                      <span>
                        AUTOCARE AI
                      </span>

                      <span className="message-time">
                        ANALYZING
                      </span>

                    </div>


                    <div className="ai-thinking">

                      <div className="thinking-animation">

                        <span></span>
                        <span></span>
                        <span></span>

                      </div>


                      <div>

                        <strong>
                          Analyzing vehicle symptoms
                        </strong>

                        <small>
                          Evaluating possible causes and severity...
                        </small>

                      </div>

                    </div>

                  </div>

                </div>

              )}


              <div
                ref={messagesEndRef}
              />

            </div>


            {/* ==================================================
                INPUT
            ================================================== */}

            <div className="diagnostic-input-area">


              <div className="input-label">

                <div>

                  <MessageSquare
                    size={13}
                  />

                  Describe the problem

                </div>

                <span>
                  AI PRELIMINARY ASSESSMENT
                </span>

              </div>


              <div className="diagnostic-input-wrapper">


                <textarea
                  ref={textareaRef}
                  value={problem}
                  onChange={(e) =>
                    setProblem(
                      e.target.value
                    )
                  }
                  onKeyDown={
                    handleKeyDown
                  }
                  placeholder="Example: My car makes a clicking sound when I turn the steering wheel..."
                  rows="3"
                  disabled={loading}
                  className="diagnostic-textarea"
                />


                <button
                  onClick={sendProblem}
                  disabled={
                    !problem.trim() ||
                    loading
                  }
                  className="send-button"
                  title="Send message"
                >

                  <Send size={17} />

                </button>

              </div>


              <div className="input-footer">

                <span>
                  Enter to send
                </span>

                <span>
                  Shift + Enter for new line
                </span>

                <span className="character-count">

                  {problem.length}
                  /1000

                </span>

              </div>

            </div>

          </section>


          {/* ==================================================
              QUICK TOPICS
          ================================================== */}

          <div className="diagnostic-topics">

            <span>
              COMMON ISSUES
            </span>

            <div className="topic-item">
              Engine noise
            </div>

            <div className="topic-item">
              Warning light
            </div>

            <div className="topic-item">
              Brake problem
            </div>

            <div className="topic-item">
              Starting issue
            </div>

            <div className="topic-item">
              Overheating
            </div>

          </div>


          {/* ==================================================
              DISCLAIMER
          ================================================== */}

          <div className="diagnostic-disclaimer">

            <AlertTriangle size={13} />

            <span>

              AutoCare AI provides a preliminary
              assessment based on the information
              you provide. It does not replace a
              professional mechanical inspection.

            </span>

          </div>


        </div>

      </main>


      {/* ==================================================
          STYLES
      ================================================== */}

      <style>{`

        /* ==================================================
           PAGE
        ================================================== */

        .diagnostic-page {
          min-height: calc(100vh - 64px);

          background: #0b0d0e;

          color: #e9e9e9;

          position: relative;

          overflow: hidden;
        }


        /* ==================================================
           BACKGROUND
        ================================================== */

        .diagnostic-background {
          position: fixed;

          inset: 0;

          pointer-events: none;

          overflow: hidden;

          z-index: 0;
        }

        .diagnostic-grid {
          position: absolute;

          inset: 0;

          opacity: 0.18;

          background-image:
            linear-gradient(
              #25292b 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              #25292b 1px,
              transparent 1px
            );

          background-size:
            70px 70px;

          mask-image:
            linear-gradient(
              to bottom,
              black,
              transparent 75%
            );
        }

        .diagnostic-glow {
          position: absolute;

          width: 700px;

          height: 700px;

          right: -400px;

          top: 80px;

          background:
            radial-gradient(
              circle,
              rgba(
                232,
                117,
                42,
                0.06
              ),
              transparent 68%
            );
        }


        /* ==================================================
           CONTAINER
        ================================================== */

        .diagnostic-container {
          max-width: 1180px;

          margin: 0 auto;

          padding:
            28px 30px
            55px;

          position: relative;

          z-index: 2;
        }


        /* ==================================================
           TOP BAR
        ================================================== */

        .diagnostic-topbar {
          display: flex;

          align-items: center;

          justify-content: space-between;

          margin-bottom: 34px;
        }

        .diagnostic-back {
          display: inline-flex;

          align-items: center;

          gap: 8px;

          padding: 0;

          border: none;

          background: transparent;

          color: #5a6165;

          font-size: 10px;

          cursor: pointer;

          transition:
            color 0.2s ease;
        }

        .diagnostic-back:hover {
          color: #e8752a;
        }

        .diagnostic-system {
          display: flex;

          align-items: center;

          gap: 7px;

          color: #4e5559;

          font-size: 7px;

          font-weight: 700;

          letter-spacing: 0.18em;
        }

        .system-dot {
          width: 5px;

          height: 5px;

          border-radius: 50%;

          background: #e8752a;

          box-shadow:
            0 0 8px
            rgba(
              232,
              117,
              42,
              0.7
            );
        }


        /* ==================================================
           HEADER
        ================================================== */

        .diagnostic-header {
          display: flex;

          align-items: flex-end;

          justify-content: space-between;

          gap: 40px;

          margin-bottom: 28px;
        }

        .diagnostic-title-area {
          max-width: 650px;
        }

        .diagnostic-kicker {
          display: flex;

          align-items: center;

          gap: 9px;

          color: #5d6468;

          font-size: 8px;

          font-weight: 700;

          letter-spacing: 0.2em;

          margin-bottom: 12px;
        }

        .diagnostic-kicker span {
          width: 23px;

          height: 1px;

          background: #e8752a;
        }

        .diagnostic-title-area h1 {
          margin: 0;

          font-size:
            clamp(
              2.3rem,
              4.5vw,
              3.8rem
            );

          line-height: 0.98;

          letter-spacing: -0.06em;

          font-weight: 650;

          color: #f2f2f2;
        }

        .diagnostic-title-area h1 em {
          color: #e8752a;

          font-style: normal;
        }

        .diagnostic-title-area p {
          max-width: 560px;

          margin: 13px 0 0;

          color: #5b6266;

          font-size: 11px;

          line-height: 1.75;
        }


        /* ==================================================
           VEHICLE CARD
        ================================================== */

        .vehicle-status-card {
          min-width: 285px;

          display: flex;

          align-items: center;

          gap: 11px;

          padding: 13px 14px;

          background: #131617;

          border: 1px solid #292e31;

          border-radius: 10px;
        }

        .vehicle-status-icon {
          width: 38px;

          height: 38px;

          flex-shrink: 0;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 8px;

          background:
            rgba(
              232,
              117,
              42,
              0.07
            );

          border: 1px solid
            rgba(
              232,
              117,
              42,
              0.14
            );

          color: #e8752a;
        }

        .vehicle-status-info {
          min-width: 0;

          flex: 1;
        }

        .vehicle-status-info span {
          display: block;

          color: #4d5458;

          font-size: 6px;

          letter-spacing: 0.17em;

          font-weight: 700;
        }

        .vehicle-status-info strong {
          display: block;

          margin-top: 3px;

          color: #c5c9ca;

          font-size: 11px;

          font-weight: 600;
        }

        .vehicle-status-info small {
          display: block;

          margin-top: 3px;

          color: #555c60;

          font-size: 8px;
        }

        .vehicle-online {
          display: flex;

          align-items: center;

          gap: 5px;

          color: #6b7073;

          font-size: 6px;

          font-weight: 700;

          letter-spacing: 0.12em;
        }

        .vehicle-online span {
          width: 5px;

          height: 5px;

          border-radius: 50%;

          background: #e8752a;
        }


        /* ==================================================
           MAIN PANEL
        ================================================== */

        .diagnostic-panel {
          background: #121516;

          border: 1px solid #2a2f31;

          border-radius: 14px;

          overflow: hidden;

          box-shadow:
            0 30px 90px
            rgba(
              0,
              0,
              0,
              0.35
            );
        }


        /* ==================================================
           PANEL HEADER
        ================================================== */

        .diagnostic-panel-header {
          height: 68px;

          display: flex;

          align-items: center;

          justify-content: space-between;

          padding: 0 22px;

          border-bottom: 1px solid #282d2f;

          background: #151819;
        }

        .assistant-identity {
          display: flex;

          align-items: center;

          gap: 10px;
        }

        .assistant-avatar {
          width: 38px;

          height: 38px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 9px;

          background:
            rgba(
              232,
              117,
              42,
              0.08
            );

          border: 1px solid
            rgba(
              232,
              117,
              42,
              0.17
            );

          color: #e8752a;
        }

        .assistant-name {
          display: flex;

          align-items: center;

          gap: 5px;

          color: #d6d9da;

          font-size: 11px;

          font-weight: 600;
        }

        .verified-badge {
          display: inline-flex;

          align-items: center;

          justify-content: center;

          width: 14px;

          height: 14px;

          border-radius: 50%;

          background:
            rgba(
              232,
              117,
              42,
              0.1
            );

          color: #e8752a;
        }

        .assistant-status {
          display: flex;

          align-items: center;

          gap: 5px;

          margin-top: 3px;

          color: #555c60;

          font-size: 7px;
        }

        .assistant-status span {
          width: 4px;

          height: 4px;

          border-radius: 50%;

          background: #e8752a;
        }


        /* ==================================================
           CLEAR
        ================================================== */

        .clear-chat-button {
          display: inline-flex;

          align-items: center;

          gap: 7px;

          padding: 8px 10px;

          border-radius: 7px;

          border: 1px solid #303538;

          background: #101213;

          color: #5e6569;

          font-size: 8px;

          cursor: pointer;

          transition: all 0.2s ease;
        }

        .clear-chat-button:hover {
          color: #d07240;

          border-color:
            rgba(
              232,
              117,
              42,
              0.3
            );
        }


        /* ==================================================
           CHAT
        ================================================== */

        .diagnostic-chat {
          height: 540px;

          overflow-y: auto;

          padding: 25px;

          background:
            radial-gradient(
              circle at 50% 0%,
              rgba(
                255,
                255,
                255,
                0.015
              ),
              transparent 50%
            );
        }

        .diagnostic-chat::-webkit-scrollbar {
          width: 5px;
        }

        .diagnostic-chat::-webkit-scrollbar-track {
          background: transparent;
        }

        .diagnostic-chat::-webkit-scrollbar-thumb {
          background: #2b3033;

          border-radius: 10px;
        }


        /* ==================================================
           INTRO
        ================================================== */

        .diagnostic-intro {
          max-width: 570px;

          margin: 0 auto 28px;

          display: flex;

          align-items: flex-start;

          gap: 12px;

          padding: 15px 17px;

          background:
            rgba(
              232,
              117,
              42,
              0.035
            );

          border: 1px solid
            rgba(
              232,
              117,
              42,
              0.12
            );

          border-radius: 9px;
        }

        .intro-icon {
          width: 31px;

          height: 31px;

          flex-shrink: 0;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 7px;

          background:
            rgba(
              232,
              117,
              42,
              0.08
            );

          color: #e8752a;
        }

        .diagnostic-intro strong {
          display: block;

          color: #aeb3b5;

          font-size: 10px;

          font-weight: 600;
        }

        .diagnostic-intro p {
          margin: 5px 0 0;

          color: #565d61;

          font-size: 9px;

          line-height: 1.6;
        }


        /* ==================================================
           MESSAGE ROW
        ================================================== */

        .chat-message-row {
          display: flex;

          align-items: flex-start;

          gap: 10px;

          max-width: 850px;

          margin: 0 auto 24px;
        }

        .user-row {
          flex-direction: row-reverse;
        }


        /* ==================================================
           AVATAR
        ================================================== */

        .chat-avatar {
          width: 30px;

          height: 30px;

          flex-shrink: 0;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 8px;
        }

        .ai-avatar {
          background:
            rgba(
              232,
              117,
              42,
              0.08
            );

          border: 1px solid
            rgba(
              232,
              117,
              42,
              0.15
            );

          color: #e8752a;
        }

        .user-avatar {
          background: #e8752a;

          color: #0b0d0e;
        }

        .error-avatar {
          background:
            rgba(
              210,
              70,
              70,
              0.08
            );

          border: 1px solid
            rgba(
              210,
              70,
              70,
              0.18
            );

          color: #df7777;
        }


        /* ==================================================
           MESSAGE WRAPPER
        ================================================== */

        .chat-message-wrapper {
          max-width: 72%;

          min-width: 0;
        }

        .user-message-wrapper {
          display: flex;

          flex-direction: column;

          align-items: flex-end;
        }

        .message-meta {
          display: flex;

          align-items: center;

          gap: 8px;

          margin-bottom: 5px;

          color: #4d5458;

          font-size: 6px;

          font-weight: 700;

          letter-spacing: 0.13em;
        }

        .message-time {
          color: #363c3f;

          font-weight: 500;
        }


        /* ==================================================
           BUBBLE
        ================================================== */

        .chat-bubble {
          padding: 12px 14px;

          border-radius: 9px;

          font-size: 10px;

          line-height: 1.75;

          white-space: pre-wrap;

          word-break: break-word;
        }

        .assistant-bubble {
          background: #171a1b;

          border: 1px solid #292e31;

          color: #aeb3b5;

          border-top-left-radius: 2px;
        }

        .user-bubble {
          background: #e8752a;

          color: #101213;

          font-weight: 500;

          border-top-right-radius: 2px;
        }

        .error-bubble {
          background:
            rgba(
              210,
              70,
              70,
              0.055
            );

          border: 1px solid
            rgba(
              210,
              70,
              70,
              0.17
            );

          color: #d98181;

          border-top-left-radius: 2px;
        }


        /* ==================================================
           AI THINKING
        ================================================== */

        .ai-thinking {
          display: flex;

          align-items: center;

          gap: 11px;

          padding: 13px 14px;

          background: #171a1b;

          border: 1px solid #292e31;

          border-radius: 9px;

          border-top-left-radius: 2px;
        }

        .thinking-animation {
          display: flex;

          align-items: center;

          gap: 3px;
        }

        .thinking-animation span {
          width: 4px;

          height: 4px;

          border-radius: 50%;

          background: #e8752a;

          animation:
            diagnostic-bounce
            1.1s infinite;
        }

        .thinking-animation span:nth-child(2) {
          animation-delay: 0.15s;
        }

        .thinking-animation span:nth-child(3) {
          animation-delay: 0.3s;
        }

        @keyframes diagnostic-bounce {

          0%,
          60%,
          100% {
            transform:
              translateY(0);

            opacity: 0.35;
          }

          30% {
            transform:
              translateY(-4px);

            opacity: 1;
          }

        }

        .ai-thinking strong {
          display: block;

          color: #8d9497;

          font-size: 9px;

          font-weight: 600;
        }

        .ai-thinking small {
          display: block;

          color: #4f565a;

          font-size: 7px;

          margin-top: 3px;
        }


        /* ==================================================
           INPUT AREA
        ================================================== */

        .diagnostic-input-area {
          padding:
            18px 22px
            16px;

          border-top: 1px solid #292e31;

          background: #151819;
        }

        .input-label {
          display: flex;

          align-items: center;

          justify-content: space-between;

          margin-bottom: 8px;

          color: #646b6f;

          font-size: 8px;

          font-weight: 600;
        }

        .input-label > div {
          display: flex;

          align-items: center;

          gap: 6px;
        }

        .input-label svg {
          color: #e8752a;
        }

        .input-label > span {
          color: #41484c;

          font-size: 6px;

          letter-spacing: 0.13em;
        }


        /* ==================================================
           TEXTAREA
        ================================================== */

        .diagnostic-input-wrapper {
          display: flex;

          align-items: flex-end;

          gap: 10px;

          padding: 5px;

          background: #0f1112;

          border: 1px solid #303538;

          border-radius: 9px;

          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .diagnostic-input-wrapper:focus-within {
          border-color: #e8752a;

          box-shadow:
            0 0 0 3px
            rgba(
              232,
              117,
              42,
              0.055
            );
        }

        .diagnostic-textarea {
          flex: 1;

          min-width: 0;

          resize: none;

          min-height: 72px;

          padding: 9px 10px;

          border: none;

          outline: none;

          background: transparent;

          color: #dfe1e2;

          font-size: 10px;

          line-height: 1.7;
        }

        .diagnostic-textarea::placeholder {
          color: #464d51;
        }

        .diagnostic-textarea:disabled {
          opacity: 0.5;
        }


        /* ==================================================
           SEND
        ================================================== */

        .send-button {
          width: 40px;

          height: 40px;

          flex-shrink: 0;

          display: flex;

          align-items: center;

          justify-content: center;

          border: none;

          border-radius: 7px;

          background: #e8752a;

          color: #0b0d0e;

          cursor: pointer;

          transition:
            background 0.2s ease,
            transform 0.2s ease;
        }

        .send-button:hover:not(:disabled) {
          background: #f08a45;

          transform:
            translateY(-1px);
        }

        .send-button:disabled {
          background: #292e31;

          color: #50575a;

          cursor: not-allowed;
        }


        /* ==================================================
           INPUT FOOTER
        ================================================== */

        .input-footer {
          display: flex;

          align-items: center;

          gap: 14px;

          margin-top: 7px;

          color: #3f464a;

          font-size: 7px;
        }

        .character-count {
          margin-left: auto;
        }


        /* ==================================================
           TOPICS
        ================================================== */

        .diagnostic-topics {
          display: flex;

          align-items: center;

          gap: 7px;

          flex-wrap: wrap;

          margin-top: 13px;
        }

        .diagnostic-topics > span {
          color: #41484c;

          font-size: 6px;

          font-weight: 700;

          letter-spacing: 0.14em;

          margin-right: 4px;
        }

        .topic-item {
          padding: 6px 9px;

          border: 1px solid #252a2c;

          border-radius: 6px;

          background: #101213;

          color: #535a5e;

          font-size: 7px;
        }


        /* ==================================================
           DISCLAIMER
        ================================================== */

        .diagnostic-disclaimer {
          display: flex;

          align-items: center;

          justify-content: center;

          gap: 6px;

          margin-top: 18px;

          color: #3f464a;

          font-size: 7px;

          line-height: 1.5;

          text-align: center;
        }

        .diagnostic-disclaimer svg {
          color: #6a5a4f;

          flex-shrink: 0;
        }


        /* ==================================================
           TABLET
        ================================================== */

        @media (max-width: 900px) {

          .diagnostic-header {
            flex-direction: column;

            align-items: flex-start;

            gap: 20px;
          }

          .vehicle-status-card {
            width: 100%;

            min-width: 0;
          }

          .diagnostic-chat {
            height: 500px;
          }

          .chat-message-wrapper {
            max-width: 82%;
          }

        }


        /* ==================================================
           MOBILE
        ================================================== */

        @media (max-width: 600px) {

          .diagnostic-container {
            padding:
              22px 14px
              40px;
          }

          .diagnostic-system {
            display: none;
          }

          .diagnostic-title-area h1 {
            font-size: 2.6rem;
          }

          .diagnostic-panel {
            border-radius: 10px;
          }

          .diagnostic-panel-header {
            height: 61px;

            padding:
              0 14px;
          }

          .assistant-avatar {
            width: 34px;

            height: 34px;
          }

          .clear-chat-button span {
            display: none;
          }

          .diagnostic-chat {
            height: 500px;

            padding:
              18px 12px;
          }

          .diagnostic-intro {
            margin-bottom: 22px;

            padding: 12px;
          }

          .chat-message-row {
            gap: 7px;

            margin-bottom: 19px;
          }

          .chat-avatar {
            width: 27px;

            height: 27px;
          }

          .chat-message-wrapper {
            max-width: 84%;
          }

          .chat-bubble {
            font-size: 9px;

            line-height: 1.65;

            padding:
              10px 11px;
          }

          .diagnostic-input-area {
            padding:
              14px 12px;
          }

          .input-label > span {
            display: none;
          }

          .diagnostic-textarea {
            min-height: 62px;
          }

          .diagnostic-topics {
            display: none;
          }

          .diagnostic-disclaimer {
            padding: 0 10px;
          }

        }

      `}</style>

    </>
  );
}

export default VehicleChatbot;