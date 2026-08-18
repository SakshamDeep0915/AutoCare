import { Routes, Route, Navigate } from "react-router-dom";

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

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Redirect Root */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={<Dashboard />} />

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
      element={ <ProtectedRoute>
      <ServiceHistory />
    </ProtectedRoute>}
      />

      <Route
      path="/ai-report/:vehicleId"
      element={<ProtectedRoute>
        <AIReport/>
        </ProtectedRoute>
        }
      />

      <Route 
      path="/services/edit/:id" 
      element={
      <ProtectedRoute>
      <EditService />
      </ProtectedRoute>
      } />

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



<Route
  path="/chatbot"
  element={
    <ProtectedRoute>
      <Chatbot />
    </ProtectedRoute>
  }
/>

<Route
  path="/nearby-services"
  element={
    <ProtectedRoute>
      <NearbyServices />
    </ProtectedRoute>
  }
/>

<Route
  path="/expense-report"
  element={<ExpenseReport />}
/>
      
    </Routes>
  );
}

export default App;