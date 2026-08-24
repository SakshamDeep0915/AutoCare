import "./App.css";

import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddVehicle from "./pages/AddVehicle";
import EditVehicle from "./pages/EditVehicle";
import VehicleDetails from "./pages/VehicleDetails";
import AddService from "./pages/AddService";
import ServiceHistory from "./pages/ServiceHistory";
import EditService from "./pages/EditService";
import AIReport from "./pages/AIReport";
import AddFuel from "./pages/AddFuel";
import FuelHistory from "./pages/FuelHistory";
import VehicleChatbot from "./pages/vehicleChatbot";
import Chatbot from "./pages/Chatbot";
import NearbyServices from "./pages/NearbyServices";
import ExpenseReport from "./pages/ExpenseReport";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>

      {/* ==========================================
          LANDING PAGE
          ========================================== */}
      <Route path="/" element={<Landing />} />


      {/* ==========================================
          PUBLIC ROUTES
          ========================================== */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />


      {/* ==========================================
          DASHBOARD
          ========================================== */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />


      {/* ==========================================
          VEHICLE ROUTES
          ========================================== */}

      <Route
        path="/add-vehicle"
        element={
          <ProtectedRoute>
            <AddVehicle />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-vehicle/:id"
        element={
          <ProtectedRoute>
            <EditVehicle />
          </ProtectedRoute>
        }
      />

      <Route
        path="/vehicles/:id"
        element={
          <ProtectedRoute>
            <VehicleDetails />
          </ProtectedRoute>
        }
      />


      {/* ==========================================
          SERVICE ROUTES
          ========================================== */}

      <Route
        path="/vehicles/:vehicleId/add-service"
        element={
          <ProtectedRoute>
            <AddService />
          </ProtectedRoute>
        }
      />

      <Route
        path="/vehicles/:vehicleId/services"
        element={
          <ProtectedRoute>
            <ServiceHistory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/services/edit/:id"
        element={
          <ProtectedRoute>
            <EditService />
          </ProtectedRoute>
        }
      />


      {/* ==========================================
          AI REPORT
          ========================================== */}

      <Route
        path="/ai-report/:vehicleId"
        element={
          <ProtectedRoute>
            <AIReport />
          </ProtectedRoute>
        }
      />


      {/* ==========================================
          FUEL ROUTES
          ========================================== */}

      <Route
        path="/vehicles/:vehicleId/add-fuel"
        element={
          <ProtectedRoute>
            <AddFuel />
          </ProtectedRoute>
        }
      />

      <Route
        path="/vehicles/:vehicleId/fuel-history"
        element={
          <ProtectedRoute>
            <FuelHistory />
          </ProtectedRoute>
        }
      />


      {/* ==========================================
          CHATBOT
          ========================================== */}

      <Route
        path="/chatbot"
        element={
          <ProtectedRoute>
            <Chatbot />
          </ProtectedRoute>
        }
      />


      {/* ==========================================
          NEARBY SERVICES
          ========================================== */}

      <Route
        path="/nearby-services"
        element={
          <ProtectedRoute>
            <NearbyServices />
          </ProtectedRoute>
        }
      />


      {/* ==========================================
          EXPENSE REPORT
          ========================================== */}

      <Route
        path="/expense-report"
        element={
          <ProtectedRoute>
            <ExpenseReport />
          </ProtectedRoute>
        }
      />


      {/* ==========================================
          FALLBACK
          ========================================== */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}

export default App;