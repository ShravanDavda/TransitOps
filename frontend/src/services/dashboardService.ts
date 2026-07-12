import axios from "./axios";

export const dashboardService = {
  async getDashboard() {
    const response = await axios.get("/dashboard");
    return response.data.dashboard;
  },
};