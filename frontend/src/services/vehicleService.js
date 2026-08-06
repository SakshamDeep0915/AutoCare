import API from "./api";

export const getVehicles = () => API.get("/vehicles");

export const getVehicleById = (id) =>
  API.get(`/vehicles/${id}`);

export const addVehicle = (vehicleData) =>
  API.post("/vehicles", vehicleData);

export const updateVehicle = (id, vehicleData) =>
  API.put(`/vehicles/${id}`, vehicleData);

export const deleteVehicle = (id) =>
  API.delete(`/vehicles/${id}`);