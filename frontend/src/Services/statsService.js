import api from './api';

const API_URL = "/stats";

const authHeader = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
});

// Admin
export const adminStats = async () => {
    const res = await api.get(`${API_URL}/admin-dashboard-stats`, authHeader());
    return res.data;
}

export const getCoachDashboardStats = async () => {
    
}