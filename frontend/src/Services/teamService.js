import api from './api';

const API_URL = "/teams";

const authHeader = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
})

// Fetch all teams
export const getAllTeams = async () => {
    const response = await api.get(API_URL, authHeader());
    return response.data;
}

// Fetch a Team by id
export const getTeamById = async (id) => {
    const response = await api.get(`${API_URL}/${id}`, authHeader());
    return response.data;
}

// Create a new Team
export const createTeam = async (data) => {
    const response = await api.post(API_URL, data, authHeader());
    return response.data;
}

// Update a Team
export const updateTeam = async (id, updatedData) => {
    const response = await api.put(`${API_URL}/${id}`, updatedData, authHeader());
    return response.data;
}

// Delete a Team
export const deleteTeam = async (id) => {
    const response = await api.delete(`${API_URL}/${id}`, authHeader());
    return response.data;
}