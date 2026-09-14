import api from './api';

const API_URL = "/bookings";

const authHeader = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
});

export const getAllApprovedBookings = async () => {
    const res = await api.get(`${API_URL}/approved`, authHeader());
    return res.data;
}