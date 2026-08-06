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
      element={<AddService />}
      />

      <Route
      path="/vehicles/:vehicleId/services"
      element={<ServiceHistory />}
      />

      <Route 
      path="/services/edit/:id" element={<EditService />} />
      
    </Routes>
  );
}

export default App;