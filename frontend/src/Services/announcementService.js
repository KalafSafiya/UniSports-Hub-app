import api from './api';

const API_URL = "/announcements";

const authHeader = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
});

// Fetch all announcements
export const getAnnouncements = async () => {
    const response = await api.get(API_URL, authHeader());
    return response.data;
};

// Fetch a single announcement by ID
export const getAnnouncementById = async (id) => {
    const response = await api.get(`${API_URL}/${id}`, authHeader());
    return response.data;
}

// Create a new announcement
export const createAnnouncements = async (data) => {
    const response = await api.post(API_URL, data, authHeader());
    return response.data;
};

// Update an existing announcement
export const updateAnnouncement = async (id, updatedData) => {
    const response = await api.put(`${API_URL}/${id}`, updatedData, authHeader());
    return response.data;
}

// Delete an announcement
export const deleteAnnouncement = async (id) => {
    const response = await api.delete(`${API_URL}/${id}`, authHeader());
    return response.data;
}