import api from './api';

const API_URL = "/auth";

export const login = async (credentials) => {
    const response = await api.post(`${API_URL}/login`, credentials);
    return response.data;
}