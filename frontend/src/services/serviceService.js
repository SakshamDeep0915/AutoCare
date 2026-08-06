import API from "./api";

export const getServices = (vehicleId) =>
  API.get(`/services/vehicle/${vehicleId}`);

export const addService = (vehicleId, serviceData) =>
  API.post(`/services/vehicle/${vehicleId}`, serviceData);

export const getServiceById = (id) =>
  API.get(`/services/${id}`);

export const updateService = (serviceId, serviceData) =>
  API.put(`/services/${serviceId}`, serviceData);

export const deleteService = (serviceId) =>
  API.delete(`/services/${serviceId}`);