import api from './api';

const API_URL = "/team-members";

const authHeader = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
});

// Create a new team member
export const createTeamMember = async (data) => {
    const response = await api.post(API_URL, data, authHeader());
    return response.data;
}

// Fetch all team members
export const getAllTeamMembers = async () => {
    const response = await api.get(API_URL, authHeader());
    return response.data;
}

// Fetch team members by team
export const getTeamMemberByTeam = async (team_id) => {
    const response = await api.get(`${API_URL}/team/${team_id}`, authHeader());
    return response.data;
}

// Fetch team member by id
export const getTeamMemberById = async (id) => {
    const response = await api.get(`${API_URL}/${id}`, authHeader());
    return response.data;
}

// Update a team member
export const updateTeamMember = async (id, updatedData) => {
    const response = await api.put(`${API_URL}/${id}`, updatedData, authHeader());
    return response.data;
}

// Delete a team member
export const deleteTeamMember = async (id) => {
    const response = await api.delete(`${API_URL}/${id}`, authHeader());
    return response.data;
}