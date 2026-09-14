import api from './api';

const API_URL = '/venues'

const authHeader = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
});

// Create venue
export const createVenue = async (data) => {
    const res = await api.post(API_URL, data, authHeader());
    return res.data;
}

// Get all venue
export const getAllVenues = async () => {
    const res = await api.get(API_URL, authHeader());
    return res.data;
}