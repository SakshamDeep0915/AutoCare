import API from "./api";

export const getVehicles = () => {
  return API.get("/vehicles");
};

export const addVehicle = (vehicleData) => {
  return API.post("/vehicles", vehicleData);
};

export const updateVehicle = (id, vehicleData) => {
  return API.put(`/vehicles/${id}`, vehicleData);
};

export const deleteVehicle = (id) => {
  return API.delete(`/vehicles/${id}`);
};

export const getVehicleById = (id) => {
  return API.get(`/vehicles/${id}`);
};