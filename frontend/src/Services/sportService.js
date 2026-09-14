import api from './api';

const API_URL = "/sports";

const authHeader = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
});

// Create a new sport
export const createSport = async (data) => {
    const response = await api.post(API_URL, data, authHeader());
    return response.data;
}

// Get pending sports
export const getPendingSports = async () => {
    const response = await api.get(`${API_URL}/pending`, authHeader());
    return response.data;
}

// Get approved sports
export const getApprovedSports = async () => {
    const response = await api.get(`${API_URL}/approved`, authHeader());
    return response.data;
}

// Get approved sports for a coach
export const getMyApprovedSports = async () => {
    const response = await api.get(`${API_URL}/my-approved`, authHeader());
    return response.data;
} 

// Get all sports
export const getAllSports = async () => {
    const response = await api.get(API_URL, authHeader());
    return response.data;
}

// Approve with Image or Reject
export const updateSportStatus = async (id, action, image = null) => {
    const response = await api.patch(`${API_URL}/${id}/status`, { action, image }, authHeader());
    return response.data;
}

// Update a sport
export const updateSport = async (id, updatedData) => {
    const response = await api.put(`${API_URL}/${id}`, updatedData, authHeader());
    return response.data;
}

// Delete a sport
export const deleteSport = async (id) => {
    const response = await api.delete(`${API_URL}/${id}`, authHeader());
    return response.data;
}

// Get coach sports
export const getApprovedSportsWithTeamsById = async () => {
    const response = await api.get(`${API_URL}/coach-dashboard-team`, authHeader());
    return response.data;
}