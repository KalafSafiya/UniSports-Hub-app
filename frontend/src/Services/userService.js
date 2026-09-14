import api from './api';

const API_URL = "/users";

// Create a new user
export const createUser = async (data) => {
    const response = await api.post(API_URL, data);
    return response.data;
}

// Fetch all users
export const getAllUsers = async () => {
    const response = await api.get(API_URL);
    return response.data;
}

// Update user
export const updateUser = async (id, updatedData) => {
    const response = await api.put(`${API_URL}/${id}`, updatedData);
    return response.data;
}

// Delete user
export const deleteUser = async (id) => {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
}