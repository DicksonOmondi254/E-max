const API_URL = "http://localhost:5000/api/dashboard";

export const dashboardService = {
  async getDashboard() {
    const token = localStorage.getItem("token");

    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to load dashboard.");
    }

    const result = await response.json();

    return result.data;
  },
};