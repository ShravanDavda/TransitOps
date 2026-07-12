import api from "./axios";

export const vehicleService = {
  async getVehicles() {
    const response = await api.get("/vehicles");
    return response.data.vehicles;
  },

  async addVehicle(vehicle: any) {
    const response = await api.post("/vehicles", vehicle);
    return response.data;
  },

  async updateVehicle(id: number, vehicle: any) {
    const response = await api.put(`/vehicles/${id}`, vehicle);
    return response.data;
  },

  async deleteVehicle(id: number) {
    const response = await api.delete(`/vehicles/${id}`);
    return response.data;
  },
};